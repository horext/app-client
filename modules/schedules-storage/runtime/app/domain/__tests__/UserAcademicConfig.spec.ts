import { describe, it, expect } from 'vitest'
import { UserAcademicConfig } from '../UserAcademicConfig'
import type { IHourlyLoad } from '~/interfaces/houly-load'

describe('UserAcademicConfig', () => {
  describe('create', () => {
    it('creates default config with null hourlyLoad', () => {
      const config = UserAcademicConfig.create()
      expect(config.id).toBe('academic-config')
      expect(config.hourlyLoad).toBeNull()
    })

    it('creates config with initial hourlyLoad', () => {
      const hourlyLoad: IHourlyLoad = {
        id: 1,
        name: 'Test',
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: {
            id: 0,
          },
          organizationUnit: {
            id: 0,
          },
        },
      }
      const config = UserAcademicConfig.create({ hourlyLoad })
      expect(config.hourlyLoad).toEqual(hourlyLoad)
    })

    it('creates config with null hourlyLoad from initial', () => {
      const config = UserAcademicConfig.create({ hourlyLoad: null })
      expect(config.hourlyLoad).toBeNull()
    })
  })

  describe('from', () => {
    it('creates UserAcademicConfig from data', () => {
      const data = { id: 'academic-config' as const, hourlyLoad: null }
      const config = UserAcademicConfig.from(data)
      expect(config.id).toBe('academic-config')
      expect(config.hourlyLoad).toBeNull()
    })

    it('creates UserAcademicConfig from data with hourlyLoad', () => {
      const hourlyLoad: IHourlyLoad = {
        id: 2,
        name: 'Load',
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      const config = UserAcademicConfig.from({
        id: 'academic-config',
        hourlyLoad,
      })
      expect(config.hourlyLoad).toEqual(hourlyLoad)
    })
  })

  describe('patch', () => {
    it('patches hourlyLoad', () => {
      const config = UserAcademicConfig.create()
      const hourlyLoad: IHourlyLoad = {
        id: 1,
        name: 'Load',
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      const patched = config.patch({ hourlyLoad })
      expect(patched.hourlyLoad).toEqual(hourlyLoad)
    })

    it('keeps existing hourlyLoad when undefined in partial', () => {
      const hourlyLoad: IHourlyLoad = {
        id: 1,
        name: 'Load',
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      const config = UserAcademicConfig.create({ hourlyLoad })
      const patched = config.patch({})
      expect(patched.hourlyLoad).toEqual(hourlyLoad)
    })

    it('patches hourlyLoad to null', () => {
      const hourlyLoad: IHourlyLoad = {
        id: 1,
        name: 'Load',
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      const config = UserAcademicConfig.create({ hourlyLoad })
      const patched = config.patch({ hourlyLoad: null })
      expect(patched.hourlyLoad).toBeNull()
    })
  })

  describe('toData', () => {
    it('converts to plain object', () => {
      const config = UserAcademicConfig.create()
      const data = config.toData()
      expect(data).toEqual({ id: 'academic-config', hourlyLoad: null })
    })
  })
})
