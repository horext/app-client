const APP_DATA_ISSUES_URL = 'https://github.com/horext/app-data/issues/new'
const STUDY_PLAN_REPORT_TEMPLATE = 'study-plan-report.yml'
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
