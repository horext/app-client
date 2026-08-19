import type ExcelJS from 'exceljs'
import JSZip from 'jszip'
import type { Weekdays } from '~/interfaces/event'
import type {
  ILocalHourlyLoadDraft,
  LocalHourlyLoadId,
} from '#shared/domain/types/local-hourly-load'
import type {
  ISession,
  ISubject,
  ISubjectSchedule,
} from '#shared/domain/types/subject'
import { makeUUID } from '#shared/domain/types/ids'

type ColumnKey =
  | 'code'
  | 'name'
  | 'section'
  | 'teacher'
  | 'type'
  | 'classroom'
  | 'day'
  | 'start'
  | 'end'

const COLUMN_NAMES: Record<ColumnKey, string[]> = {
  code: ['CODIGO', 'COD CURSO', 'COD_CURSO', 'COURSE CODE'],
  name: ['NOMBRE DEL CURSO', 'NOMBRE CURSO', 'ASIGNATURA', 'CURSO', 'MATERIA'],
  section: ['SECCION', 'SEC', 'GRUPO'],
  teacher: [
    'APELLIDOS Y NOMBRES DEL DOCENTE',
    'APELLIDOS Y NOMBRES',
    'DOCENTE',
    'PROFESOR',
    'NOMBRE DOCENTE',
  ],
  type: ['TIPO', 'TIPO CLASE', 'CLASE', 'MODALIDAD'],
  classroom: ['AULA', 'AMBIENTE', 'SALON', 'AULA VIRTUAL'],
  day: ['DIA', 'DIAS'],
  start: ['HORA INICIO', 'INICIO', 'DESDE', 'H INICIO'],
  end: ['HORA FINAL', 'FINAL', 'FIN', 'HASTA', 'H FIN'],
}

const DAY_BY_NAME: Record<string, Weekdays> = {
  LU: 1,
  LUNES: 1,
  MA: 2,
  MARTES: 2,
  MI: 3,
  MIERCOLES: 3,
  JU: 4,
  JUEVES: 4,
  VI: 5,
  VIERNES: 5,
  SA: 6,
  SABADO: 6,
  DO: 0,
  DOMINGO: 0,
}

const normalize = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()

const cellText = (cell: ExcelJS.Cell) => {
  if (cell.value == null) return ''
  if (cell.value instanceof Date) return cell.value.toISOString()
  return cell.text.trim() || String(cell.value).trim()
}

const matchColumn = (header: string): ColumnKey | undefined => {
  const normalized = normalize(header)
  for (const [key, names] of Object.entries(COLUMN_NAMES) as [
    ColumnKey,
    string[],
  ][]) {
    if (names.some((name) => normalize(name) === normalized)) return key
  }
  for (const [key, names] of Object.entries(COLUMN_NAMES) as [
    ColumnKey,
    string[],
  ][]) {
    if (
      names.some((name) => {
        const candidate = normalize(name)
        return candidate.length >= 5 && normalized.includes(candidate)
      })
    )
      return key
  }
}

const parseTime = (cell: ExcelJS.Cell): string | undefined => {
  const value = cell.value
  if (value instanceof Date) {
    // Some UNI files format plain hour numbers (14, 16, 20...) as dates.
    // ExcelJS then returns a January 1900 Date instead of the original number.
    const excelSerial = Math.round(
      (value.getTime() - Date.UTC(1899, 11, 30)) / 86_400_000,
    )
    if (excelSerial >= 1 && excelSerial <= 23)
      return `${String(excelSerial).padStart(2, '0')}:00`
    return `${String(value.getUTCHours()).padStart(2, '0')}:${String(value.getUTCMinutes()).padStart(2, '0')}`
  }
  if (typeof value === 'number') {
    const totalMinutes = value < 1 ? Math.round(value * 24 * 60) : value * 60
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = Math.round(totalMinutes % 60)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
  const text = cellText(cell)
  const match = text.match(/(?:^|\s)(\d{1,2})(?::(\d{2}))?/)
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = Number(match[2] ?? 0)
  if (hours > 23 || minutes > 59) return undefined
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const stableLocalId = (seed: string) => {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash) || 1
}

const SPREADSHEET_NAMESPACE =
  'http://schemas.openxmlformats.org/spreadsheetml/2006/main'

const normalizePrefixedSpreadsheetXml = async (data: ArrayBuffer) => {
  const zip = await JSZip.loadAsync(data)
  let changed = false

  await Promise.all(
    Object.values(zip.files).map(async (entry) => {
      if (entry.dir || !entry.name.endsWith('.xml')) return
      const xml = await entry.async('string')
      if (
        !xml.includes(`xmlns:x="${SPREADSHEET_NAMESPACE}"`) ||
        !/<\/?x:/.test(xml)
      )
        return

      const normalized = xml
        .replace(
          `xmlns:x="${SPREADSHEET_NAMESPACE}"`,
          `xmlns="${SPREADSHEET_NAMESPACE}"`,
        )
        .replace(/(<\/?)(x):/g, '$1')
      zip.file(entry.name, normalized)
      changed = true
    }),
  )

  if (!changed) return
  return zip.generateAsync({ type: 'arraybuffer' })
}

const loadWorkbook = async (data: ArrayBuffer) => {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  try {
    await workbook.xlsx.load(data)
    return workbook
  } catch (originalError) {
    const normalized = await normalizePrefixedSpreadsheetXml(data)
    if (!normalized) throw originalError
    const compatibleWorkbook = new ExcelJS.Workbook()
    await compatibleWorkbook.xlsx.load(normalized)
    return compatibleWorkbook
  }
}

export async function parseLocalHourlyLoad(
  file: File,
): Promise<ILocalHourlyLoadDraft> {
  const workbook = await loadWorkbook(await file.arrayBuffer())
  const worksheet = workbook.worksheets[0]
  if (!worksheet) throw new Error('El archivo no contiene ninguna hoja.')

  let headerRowNumber = 0
  let columns = new Map<ColumnKey, number>()
  worksheet.eachRow((row, rowNumber) => {
    if (headerRowNumber) return
    const found = new Map<ColumnKey, number>()
    row.eachCell((cell, columnNumber) => {
      const key = matchColumn(cellText(cell))
      if (key && !found.has(key)) found.set(key, columnNumber)
    })
    if (found.has('code') && found.has('section')) {
      headerRowNumber = rowNumber
      columns = found
    }
  })
  if (!headerRowNumber)
    throw new Error('No se encontraron las columnas CÓDIGO y SECCIÓN.')

  const grouped = new Map<
    string,
    { name: string; sections: Map<string, Omit<ISession, 'id' | 'schedule'>[]> }
  >()
  let validSessionCount = 0
  let rejectedRowCount = 0
  const warnings: { row: number; message: string }[] = []
  const sessionKeys = new Set<string>()

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return
    const read = (key: ColumnKey) => {
      const column = columns.get(key)
      return column ? cellText(row.getCell(column)) : ''
    }
    const code = read('code').trim().toUpperCase()
    const section = read('section').trim().toUpperCase()
    const hasMappedValue = [...columns.keys()].some((key) => read(key).trim())
    if (!hasMappedValue) return
    if (code.includes('TOTAL')) return
    if (!code || !section) {
      rejectedRowCount += 1
      warnings.push({ row: rowNumber, message: 'Falta código o sección.' })
      return
    }
    const day = DAY_BY_NAME[normalize(read('day'))]
    const startColumn = columns.get('start')
    const endColumn = columns.get('end')
    const startTime = startColumn
      ? parseTime(row.getCell(startColumn))
      : undefined
    const endTime = endColumn ? parseTime(row.getCell(endColumn)) : undefined
    if (day === undefined || !startTime || !endTime || startTime >= endTime) {
      rejectedRowCount += 1
      warnings.push({
        row: rowNumber,
        message: 'Día u horario inválido; la sesión fue omitida.',
      })
      return
    }

    const sessionKey = [code, section, day, startTime, endTime, read('type')]
      .map(normalize)
      .join('|')
    if (sessionKeys.has(sessionKey)) {
      rejectedRowCount += 1
      warnings.push({ row: rowNumber, message: 'Sesión duplicada omitida.' })
      return
    }
    sessionKeys.add(sessionKey)

    const course = grouped.get(code) ?? {
      name: read('name').trim() || code,
      sections: new Map(),
    }
    const sessions = course.sections.get(section) ?? []
    sessions.push({
      classroom: { id: 0, code: read('classroom').trim() || 'Sin aula' },
      teacher: read('teacher').trim()
        ? { id: 0, fullName: read('teacher').trim() }
        : undefined,
      type: { id: 0, code: normalize(read('type')) || 'CLASE' },
      day,
      startTime,
      endTime,
    })
    course.sections.set(section, sessions)
    grouped.set(code, course)
    validSessionCount += 1
  })

  if (!grouped.size || !validSessionCount)
    throw new Error('No se encontraron sesiones válidas con día y horario.')

  const importedAt = new Date().toISOString()
  const subjects: ISubject[] = []
  const schedulesBySubject: Record<string, ISubjectSchedule[]> = {}
  const usedIds = new Set<number>()
  const uniqueId = (seed: string) => {
    let id = stableLocalId(seed)
    while (usedIds.has(id)) id += 1
    usedIds.add(id)
    return id
  }

  for (const [code, course] of grouped) {
    const subjectId = uniqueId(`subject:${code}`)
    subjects.push({
      id: subjectId,
      course: { id: code, name: course.name },
      type: { id: 0, code: 'LOCAL', name: 'Carga local' },
      studyPlan: {
        id: 0,
        code: 'LOCAL',
        fromDate: importedAt.slice(0, 10),
        organizationUnit: { id: 0 },
      },
      credits: 0,
      cycle: null,
    })
    schedulesBySubject[String(subjectId)] = Array.from(
      course.sections.entries(),
      ([section, sessions]) => {
        const scheduleId = uniqueId(`schedule:${code}:${section}`)
        return {
          id: scheduleId,
          section: { id: section },
          scheduleSubject: { id: scheduleId },
          sessions: sessions.map((session) => ({
            ...session,
            id: uniqueId(
              `session:${code}:${section}:${session.day}:${session.startTime}:${session.endTime}:${session.type.code}`,
            ),
            schedule: { id: scheduleId },
          })),
        }
      },
    )
  }

  return {
    id: makeUUID<LocalHourlyLoadId>(),
    name: file.name.replace(/\.(xlsx|xls)$/i, ''),
    importedAt,
    sourceFileName: file.name,
    subjects: subjects.sort((a, b) => a.course.id.localeCompare(b.course.id)),
    schedulesBySubject,
    sessionCount: validSessionCount,
    rejectedRowCount,
    warnings,
  }
}
