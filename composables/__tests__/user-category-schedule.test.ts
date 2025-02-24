import { describe, it, expect } from 'vitest'
import { updateAndCategorizeSchedules } from '../user-category-schedule'
import type {
    IBaseScheduleGenerate,
    IScheduleGenerate,
} from '~/interfaces/schedule'

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
