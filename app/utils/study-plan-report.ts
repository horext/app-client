const APP_DATA_ISSUES_URL = 'https://github.com/horext/app-data/issues/new'
const STUDY_PLAN_REPORT_TEMPLATE = 'study-plan-report.yml'
const HOURLY_LOAD_REPORT_TEMPLATE = 'hourly-load-report.yml'
const STUDY_PLAN_REPORT_PROBLEMS = {
  'missing-subject': 'Falta una asignatura en el plan',
} as const

export type StudyPlanReportProblem = keyof typeof STUDY_PLAN_REPORT_PROBLEMS

export interface StudyPlanReportContext {
  specialityName: string
  studyPlanName: string
  studyPlanCode?: string
  fromDate?: string
}

export interface StudyPlanSubjectReportContext {
  courseCode: string
  courseName: string
  credits: number
  cycle: number | null
  typeCode: string
  typeName: string
}

export interface HourlyLoadReportContext {
  specialityName: string
  hourlyLoadName: string
}

export interface HourlyLoadSubjectSchedulesReportContext {
  courseCode: string
  courseName: string
  sections: string[]
}

export function buildStudyPlanReportUrl(
  context: StudyPlanReportContext,
): string {
  const url = new URL(APP_DATA_ISSUES_URL)
  const planLabel = context.studyPlanCode
    ? `${context.studyPlanCode} - ${context.studyPlanName}`
    : context.studyPlanName

  url.searchParams.set('template', STUDY_PLAN_REPORT_TEMPLATE)
  url.searchParams.set(
    'title',
    `[Plan de estudios] Corrección para ${planLabel}`,
  )
  url.searchParams.set('speciality', context.specialityName)
  url.searchParams.set('study_plan', planLabel)
  if (context.fromDate) {
    url.searchParams.set('valid_from', context.fromDate)
  }
  return url.toString()
}

export function withStudyPlanReportProblem(
  reportUrl: string,
  problem: StudyPlanReportProblem,
): string {
  const url = new URL(reportUrl)
  url.searchParams.set('problem_type', STUDY_PLAN_REPORT_PROBLEMS[problem])
  return url.toString()
}

export function buildHourlyLoadReportUrl(
  context: HourlyLoadReportContext,
): string {
  const url = new URL(APP_DATA_ISSUES_URL)
  url.searchParams.set('template', HOURLY_LOAD_REPORT_TEMPLATE)
  url.searchParams.set(
    'title',
    `[Carga horaria] Corrección para ${context.hourlyLoadName}`,
  )
  url.searchParams.set('speciality', context.specialityName)
  url.searchParams.set('hourly_load', context.hourlyLoadName)
  return url.toString()
}

export function withStudyPlanSubject(
  reportUrl: string,
  subject: StudyPlanSubjectReportContext,
): string {
  const url = new URL(reportUrl)
  const courseLabel = `${subject.courseCode} — ${subject.courseName}`
  const typeLabel = subject.typeCode
    ? `${subject.typeCode} — ${subject.typeName}`
    : subject.typeName
  const details = [
    courseLabel,
    '',
    `- Créditos: ${subject.credits}`,
    `- Ciclo: ${subject.cycle ?? 'No especificado'}`,
    `- Tipo: ${typeLabel}`,
  ].join('\n')

  url.searchParams.set(
    'title',
    `[Curso] Corrección para ${subject.courseCode} - ${subject.courseName}`,
  )
  url.searchParams.set('affected_subjects', details)
  return url.toString()
}

export function withHourlyLoadSubjectSchedules(
  reportUrl: string,
  context: HourlyLoadSubjectSchedulesReportContext,
): string {
  const url = new URL(reportUrl)
  const uniqueSections = [...new Set(context.sections)].filter(Boolean)

  url.searchParams.set(
    'title',
    `[Carga horaria] Corrección para ${context.courseCode} - ${context.courseName}`,
  )
  url.searchParams.set(
    'course',
    `${context.courseCode} — ${context.courseName}`,
  )
  url.searchParams.set(
    'affected_schedules',
    `Secciones disponibles: ${uniqueSections.join(', ') || 'No disponibles'}`,
  )
  return url.toString()
}
