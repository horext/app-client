import { describe, expect, it } from 'vitest'
import {
  buildHourlyLoadReportUrl,
  buildStudyPlanReportUrl,
  withHourlyLoadSubjectSchedules,
  withStudyPlanReportProblem,
  withStudyPlanSubject,
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

  it('prefills public subject information without internal identifiers', () => {
    const reportUrl = buildStudyPlanReportUrl({
      specialityName: 'Ingeniería de Sistemas',
      studyPlanName: 'Plan 2026',
      studyPlanCode: 'SIS-2026',
    })

    const result = new URL(
      withStudyPlanSubject(reportUrl, {
        courseCode: 'CS101',
        courseName: 'Introducción a la Programación',
        credits: 4,
        cycle: 1,
        typeCode: 'OBL',
        typeName: 'Obligatorio',
      }),
    )
    const affectedSubjects = result.searchParams.get('affected_subjects')

    expect(result.searchParams.get('title')).toBe(
      '[Curso] Corrección para CS101 - Introducción a la Programación',
    )
    expect(result.searchParams.get('study_plan')).toBe('SIS-2026 - Plan 2026')
    expect(affectedSubjects).toContain('CS101 — Introducción a la Programación')
    expect(affectedSubjects).toContain('- Créditos: 4')
    expect(affectedSubjects).toContain('- Ciclo: 1')
    expect(affectedSubjects).toContain('- Tipo: OBL — Obligatorio')
    expect(affectedSubjects).not.toContain('Secciones')
    expect(affectedSubjects).not.toContain('ID:')
  })

  it('prefills hourly-load schedules using their own issue template', () => {
    const reportUrl = buildHourlyLoadReportUrl({
      specialityName: 'Ingeniería de Sistemas',
      hourlyLoadName: '2026-2',
    })

    const result = new URL(
      withHourlyLoadSubjectSchedules(reportUrl, {
        courseCode: 'CS101',
        courseName: 'Introducción a la Programación',
        sections: ['A', 'B', 'A'],
      }),
    )

    expect(result.searchParams.get('template')).toBe('hourly-load-report.yml')
    expect(result.searchParams.get('speciality')).toBe('Ingeniería de Sistemas')
    expect(result.searchParams.get('hourly_load')).toBe('2026-2')
    expect(result.searchParams.get('course')).toBe(
      'CS101 — Introducción a la Programación',
    )
    expect(result.searchParams.get('affected_schedules')).toBe(
      'Secciones disponibles: A, B',
    )
    expect(result.searchParams.has('study_plan')).toBe(false)
    expect(result.searchParams.has('affected_subjects')).toBe(false)
  })

  it('builds hourly-load reports without subject details', () => {
    const result = new URL(
      buildHourlyLoadReportUrl({
        specialityName: 'Ingeniería de Sistemas',
        hourlyLoadName: '2026-2',
      }),
    )

    expect(result.searchParams.get('title')).toBe(
      '[Carga horaria] Corrección para 2026-2',
    )
    expect(result.searchParams.get('hourly_load')).toBe('2026-2')
    expect(result.searchParams.has('course')).toBe(false)
  })
})
