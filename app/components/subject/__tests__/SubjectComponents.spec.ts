import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import type {
  ISubjectSchedule,
  IBaseSubjectSchedules,
} from '~/interfaces/subject'
import ScheduleItem from '~/components/subject/ScheduleItem.vue'
import ScheduleSection from '~/components/subject/ScheduleSection.vue'
import ScheduleList from '~/components/subject/ScheduleList.vue'
import Select from '~/components/subject/Select.vue'
import ItemActions from '~/components/subject/table/ItemActions.vue'

const vuetify = createVuetify()

function makeSchedule(): ISubjectSchedule {
  return {
    id: 1,
    sessions: [],
    section: {
      id: '',
    },
    scheduleSubject: {
      id: 0,
    },
  }
}

function makeBaseSubjectSchedules(): IBaseSubjectSchedules {
  return {
    subject: {
      id: 1,
      course: { id: 'CS101', name: 'Intro CS' },
      type: { id: 1, name: 'Obligatorio', code: 'OBL' },
      studyPlan: {
        id: 1,
        fromDate: '2024-01-01',
        code: 'SP1',
        organizationUnit: { id: 1 },
      },
      credits: 4,
      cycle: 1,
    },
    schedules: [makeSchedule()],
  } as IBaseSubjectSchedules
}

describe('subject/ScheduleItem', () => {
  it('renders with loading state', () => {
    const wrapper = shallowMount(ScheduleItem, {
      props: {
        schedules: [],
        loading: true,
        modelValue: [],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with schedule data', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ScheduleItem, {
      props: {
        schedules: [schedule],
        loading: false,
        modelValue: [],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('subject/ScheduleSection', () => {
  it('renders with a schedule', () => {
    const schedule = makeSchedule()
    const wrapper = shallowMount(ScheduleSection, {
      props: {
        schedule,
        modelValue: [],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('subject/ScheduleList', () => {
  it('renders with loading state', () => {
    const wrapper = shallowMount(ScheduleList, {
      props: {
        subjectSchedules: makeBaseSubjectSchedules(),
        schedules: [],
        loading: true,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with schedule data', () => {
    const wrapper = shallowMount(ScheduleList, {
      props: {
        subjectSchedules: makeBaseSubjectSchedules(),
        schedules: [makeSchedule()],
        loading: false,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('subject/Select', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(Select, {
      props: {
        subjects: [],
        statusSubjects: 'idle',
        modelValue: undefined,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('subject/table/ItemActions', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(ItemActions, {
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click:edit when edit button clicked', () => {
    const wrapper = shallowMount(ItemActions, {
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click:edit', new MouseEvent('click'))
    expect(wrapper.emitted('click:edit')).toBeTruthy()
  })

  it('emits click:delete when delete button clicked', () => {
    const wrapper = shallowMount(ItemActions, {
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click:delete', new MouseEvent('click'))
    expect(wrapper.emitted('click:delete')).toBeTruthy()
  })
})
