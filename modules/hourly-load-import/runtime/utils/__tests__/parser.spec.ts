import ExcelJS from 'exceljs'
import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { parseLocalHourlyLoad } from '../parser'

const makeFile = async (
  rows: unknown[][],
  configure?: (sheet: ExcelJS.Worksheet) => void,
) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Carga')
  rows.forEach((row) => sheet.addRow(row))
  configure?.(sheet)
  const data = await workbook.xlsx.writeBuffer()
  return new File([data], 'carga.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

const addSpreadsheetNamespacePrefix = async (file: File) => {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  await Promise.all(
    Object.values(zip.files).map(async (entry) => {
      if (entry.dir || !entry.name.endsWith('.xml')) return
      const xml = await entry.async('string')
      const namespace =
        'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
      if (!xml.includes(namespace)) return
      const prefixed = xml
        .replace(namespace, namespace.replace('xmlns=', 'xmlns:x='))
        .replace(/<(\/?)([A-Za-z][\w.-]*)(?=[\s/>])/g, '<$1x:$2')
      zip.file(entry.name, prefixed)
    }),
  )
  return new File(
    [await zip.generateAsync({ type: 'arraybuffer' })],
    file.name,
    {
      type: file.type,
    },
  )
}

describe('parseLocalHourlyLoad', () => {
  it('ignores empty merged title cells before the header row', async () => {
    const file = await makeFile(
      [
        [],
        [],
        [],
        ['CÓDIGO', 'CURSO', 'SECCIÓN', 'DÍA', 'HORA INICIO', 'HORA FINAL'],
        ['BEF01', 'Ética', 'U', 'SA', 9, 11],
      ],
      (sheet) => sheet.mergeCells('A1:E3'),
    )

    const result = await parseLocalHourlyLoad(file)

    expect(result.subjects[0]?.course.id).toBe('BEF01')
    expect(result.sessionCount).toBe(1)
  })

  it('recognizes header variants, defaults optional fields and reports bad rows', async () => {
    const file = await makeFile([
      ['Título'],
      [
        'COD_CURSO',
        'ASIGNATURA',
        'GRUPO',
        'PROFESOR',
        'MODALIDAD',
        'AMBIENTE',
        'DÍAS',
        'DESDE',
        'HASTA',
      ],
      ['BIC01', 'Introducción', 'U', '', '', '', 'LUNES', 8, 10],
      ['BIC01', 'Introducción', 'U', '', '', '', 'LUNES', 8, 10],
      ['BMA01', 'Cálculo', 'V', 'Docente', 'T', 'S1', 'INVALIDO', 10, 12],
    ])

    const result = await parseLocalHourlyLoad(file)

    expect(result.subjects).toHaveLength(1)
    expect(result.sessionCount).toBe(1)
    expect(result.rejectedRowCount).toBe(2)
    expect(result.warnings.map(({ message }) => message)).toEqual([
      'Sesión duplicada omitida.',
      'Día u horario inválido; la sesión fue omitida.',
    ])
    const [session] =
      result.schedulesBySubject[String(result.subjects[0]?.id)]?.[0]
        ?.sessions ?? []
    expect(session?.classroom.code).toBe('Sin aula')
    expect(session?.type.code).toBe('CLASE')
    expect(result.id).toEqual(expect.any(String))
  })

  it('rejects a workbook without valid sessions', async () => {
    const file = await makeFile([
      ['CÓDIGO', 'NOMBRE DEL CURSO', 'SECCIÓN', 'DÍA', 'INICIO', 'FIN'],
      ['BIC01', 'Introducción', 'U', 'LUNES', 10, 8],
    ])

    await expect(parseLocalHourlyLoad(file)).rejects.toThrow(
      'No se encontraron sesiones válidas',
    )
  })

  it('reads spreadsheets whose main XML namespace uses an x prefix', async () => {
    const file = await makeFile([
      ['CÓDIGO', 'NOMBRE DEL CURSO', 'SECCIÓN', 'DÍA', 'INICIO', 'FIN'],
      ['BFI01', 'Física I', 'U', 'LU', 8, 10],
    ])

    const result = await parseLocalHourlyLoad(
      await addSpreadsheetNamespacePrefix(file),
    )

    expect(result.subjects).toHaveLength(1)
    expect(result.subjects[0]?.course.id).toBe('BFI01')
    expect(result.sessionCount).toBe(1)
  })
})
