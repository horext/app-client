import type { $Fetch } from 'ofetch'
import { describe, it, expect, vi, type Mocked } from 'vitest'
import { BaseApi } from '../base'
import { FacultyApi } from '../faculty'
import { HourlyLoadApi } from '../hourly-load'
import { SpecialityApi } from '../speciality'
import { CourseApi } from '../course'
import { ScheduleSubjectApi } from '../schedule-subject'
import { StudyPlanApi } from '../studyPlan'

const makeFetch = (): Mocked<$Fetch> =>
  Object.assign(vi.fn(), {
    create: vi.fn(),
    raw: vi.fn(),
    native: vi.fn(),
  })

describe('BaseApi', () => {
  it('stores $fetch in constructor', () => {
    const $fetch = makeFetch()
    const api = new (class extends BaseApi {})($fetch)
    expect(api).toBeInstanceOf(BaseApi)
  })
})

describe('FacultyApi', () => {
  it('calls $fetch with faculties path', async () => {
    const $fetch = makeFetch()
    const api = new FacultyApi($fetch)
    await api.getAll()
    expect($fetch).toHaveBeenCalledWith('faculties')
  })
})

describe('HourlyLoadApi', () => {
  it('calls $fetch with hourlyLoads/latest path and faculty param', async () => {
    const $fetch = makeFetch()
    const api = new HourlyLoadApi($fetch)
    await api.getLatestByFaculty(42)
    expect($fetch).toHaveBeenCalledWith('hourlyLoads/latest', {
      method: 'GET',
      params: { faculty: 42 },
    })
  })
})

describe('SpecialityApi', () => {
  it('calls $fetch with specialities path and faculty param', async () => {
    const $fetch = makeFetch()
    const api = new SpecialityApi($fetch)
    await api.getAllByFaculty(5)
    expect($fetch).toHaveBeenCalledWith('specialities', {
      params: { faculty: 5 },
    })
  })
})

describe('CourseApi', () => {
  it('calls $fetch with subjects search path and params', async () => {
    const $fetch = makeFetch()
    const api = new CourseApi($fetch)
    await api.findBySearch('math', 2, 3)
    expect($fetch).toHaveBeenCalledWith('subjects?search=math', {
      method: 'GET',
      params: { speciality: 2, hourlyLoad: 3 },
    })
  })
})

describe('ScheduleSubjectApi', () => {
  it('calls $fetch with scheduleSubjects path and subject/hourlyLoad params', async () => {
    const $fetch = makeFetch()
    const api = new ScheduleSubjectApi($fetch)
    await api.findBySubjectIdAndHourlyLoadId(10, 20)
    expect($fetch).toHaveBeenCalledWith('scheduleSubjects', {
      params: { subject: 10, hourlyLoad: 20 },
    })
  })

  it('calls $fetch with ids joined by comma for getAllByIds', async () => {
    const $fetch = makeFetch()
    const api = new ScheduleSubjectApi($fetch)
    await api.getAllByIds([1, 2, 3])
    expect($fetch).toHaveBeenCalledWith('scheduleSubjects', {
      params: { ids: '1,2,3' },
    })
  })
})

describe('StudyPlanApi', () => {
  it('calls $fetch with studyPlans path for getAll', async () => {
    const $fetch = makeFetch()
    const api = new StudyPlanApi($fetch)
    await api.getAll()
    expect($fetch).toHaveBeenCalledWith('studyPlans')
  })

  it('calls $fetch with correct path for getSubjectsByStudyPlanId', async () => {
    const $fetch = makeFetch()
    const api = new StudyPlanApi($fetch)
    await api.getSubjectsByStudyPlanId(7)
    expect($fetch).toHaveBeenCalledWith('studyPlans/7/subjects')
  })
})
