import { describe, it, expect } from 'vitest'
import { appendScheduleToCategory, excludeCategoryFromSchedule, mergeScheduleWithNewCategory, removeCategoryFromSchedule, updateAndCategorizeSchedules } from '../user-category-schedule'
import type { IBaseScheduleGenerate, IScheduleGenerate } from '~/interfaces/schedule'

describe('processIncomingSchedules', () => {
    const categoryCode = 'GENERATED'

    it('should add new schedules with the given category', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
            {
                id: '2',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = []

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
            {
                id: '2',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })

    it('should update existing schedules to include the given category', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: ['FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: ['FAVORITE', categoryCode,],
            },
        ])
    })

    it('should not duplicate categories for existing schedules', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })

    it('should remove the category from schedules not in incoming schedules', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = []
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([])
    })

})

describe('updateAndCategorizeSchedules', () => {
    const categoryCode = 'GENERATED'

    it('should add new schedules with the given category', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
            {
                id: '2',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = []

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
            {
                id: '2',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })

    it('should update existing schedules to include the given category', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: ['FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: ['FAVORITE', categoryCode],
            },
        ])
    })

    it('should not duplicate categories for existing schedules', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = [
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })

    it('should remove the category from schedules not in incoming schedules', () => {
        const incomingSchedules: IBaseScheduleGenerate[] = []
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]

        const result = updateAndCategorizeSchedules(
            incomingSchedules,
            currentSchedules,
            categoryCode,
        )

        expect(result).toEqual([])
    })
})

describe('appendScheduleToCategory', () => {
    const categoryCode = 'GENERATED'

    it('should append a new schedule with the given category', () => {
        const schedules: IScheduleGenerate[] = []
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = appendScheduleToCategory(schedules, schedule, categoryCode)

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })
})

describe('mergeScheduleWithNewCategory', () => {
    const categoryCode = 'GENERATED'

    it('should merge a new schedule with the given category', () => {
        const currentSchedules: IScheduleGenerate[] = []
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = mergeScheduleWithNewCategory(
            currentSchedules,
            schedule,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })

    it('should add the category to an existing schedule', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: ['FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = mergeScheduleWithNewCategory(
            currentSchedules,
            schedule,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: ['FAVORITE', categoryCode],
            },
        ])
    })

    it('should not duplicate the category for an existing schedule', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = mergeScheduleWithNewCategory(
            currentSchedules,
            schedule,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
                categories: [categoryCode],
            },
        ])
    })
})

describe('excludeCategoryFromSchedule', () => {
    const categoryCode = 'GENERATED'

    it('should exclude the category from the schedule', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const id = '1'

        const result = excludeCategoryFromSchedule(
            currentSchedules,
            id,
            categoryCode,
        )

        expect(result).toEqual([])
    })

    it('should not remove the schedule if other categories exist', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode, 'FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const id = '1'

        const result = excludeCategoryFromSchedule(
            currentSchedules,
            id,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                categories: ['FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ])
    })
})

describe('removeCategoryFromSchedule', () => {
    const categoryCode = 'GENERATED'

    it('should remove the category from the schedule', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = removeCategoryFromSchedule(
            currentSchedules,
            schedule,
            categoryCode,
        )

        expect(result).toEqual([])
    })

    it('should not remove the schedule if other categories exist', () => {
        const currentSchedules: IScheduleGenerate[] = [
            {
                id: '1',
                categories: [categoryCode, 'FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ]
        const schedule: IBaseScheduleGenerate = {
            id: '1',
            scheduleSubjectIds: [],
            schedule: [],
            crossings: 0,
            events: [],
        }

        const result = removeCategoryFromSchedule(
            currentSchedules,
            schedule,
            categoryCode,
        )

        expect(result).toEqual([
            {
                id: '1',
                categories: ['FAVORITE'],
                scheduleSubjectIds: [],
                schedule: [],
                crossings: 0,
                events: [],
            },
        ])
    })
})
