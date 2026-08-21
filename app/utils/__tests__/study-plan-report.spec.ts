import { describe, expect, it } from 'vitest'
import {
  buildStudyPlanReportUrl,
  withStudyPlanReportProblem,
} from '../study-plan-report'

describe('buildStudyPlanReportUrl', () => {
  it('creates a prefilled issue for the public data repository', () => {
    const result = new URL(
      buildStudyPlanReportUrl({
        specialityName: 'Ingeniería de Sistemas',
        studyPlanName: 'Plan 2026',
        studyPlanCode: 'SIS-2026',
        fromDate: '2026-01-01',
      }),
    )

    expect(result.origin + result.pathname).toBe(
      'https://github.com/horext/app-data/issues/new',
    )
    expect(result.searchParams.get('template')).toBe('study-plan-report.yml')
    expect(result.searchParams.get('title')).toContain('SIS-2026 - Plan 2026')
    expect(result.searchParams.get('speciality')).toBe('Ingeniería de Sistemas')
    expect(result.searchParams.get('study_plan')).toBe('SIS-2026 - Plan 2026')
    expect(result.searchParams.get('valid_from')).toBe('2026-01-01')
    expect(result.searchParams.has('body')).toBe(false)
    expect(result.searchParams.has('problem_type')).toBe(false)
  })

  it('uses fallbacks for optional plan metadata', () => {
    const result = new URL(
      buildStudyPlanReportUrl({
        specialityName: 'Ingeniería',
        studyPlanName: 'Plan 2024',
      }),
    )

    expect(result.searchParams.get('title')).toContain('Plan 2024')
    expect(result.searchParams.get('study_plan')).toBe('Plan 2024')
    expect(result.searchParams.has('valid_from')).toBe(false)
  })

  it('prefills the missing-subject problem when requested', () => {
    const reportUrl = buildStudyPlanReportUrl({
      specialityName: 'Ingeniería de Sistemas',
      studyPlanName: 'Plan 2026',
    })

    const result = new URL(
      withStudyPlanReportProblem(reportUrl, 'missing-subject'),
    )

    expect(result.searchParams.get('problem_type')).toBe(
      'Falta una asignatura en el plan',
    )
  })
})
