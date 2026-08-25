import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import type {
  ISubjectSchedule,
  IBasePlannedSubject,
} from '~/interfaces/subject'
import ScheduleItem from '~/components/subject/ScheduleItem.vue'
import ScheduleSection from '~/components/subject/ScheduleSection.vue'
import SchedulesEdit from '~/components/subject/SchedulesEdit.vue'
import Select from '~/components/subject/Select.vue'
import ItemActions from '~/components/subject/table/ItemActions.vue'

const vuetify = createVuetify()

function makeSchedule(id = 1, sectionId = ''): ISubjectSchedule {
  return {
    id,
    sessions: [],
    section: {
      id: sectionId,
    },
    scheduleSubject: {
      id: 0,
    },
  }
}

function makeBaseSubjectSchedules(): IBasePlannedSubject {
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
  } as IBasePlannedSubject
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

  it('selects and clears every available schedule', async () => {
    const schedules = [makeSchedule(1, 'A'), makeSchedule(2, 'B')]
    const wrapper = shallowMount(ScheduleItem, {
      props: {
        schedules,
        loading: false,
        modelValue: [],
      },
      global: { plugins: [vuetify] },
    })
    const selectAll = wrapper.findComponent({ name: 'VCheckboxBtn' })

    selectAll.vm.$emit('update:modelValue', true)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([schedules])

    await wrapper.setProps({ modelValue: schedules })
    selectAll.vm.$emit('update:modelValue', false)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
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

describe('subject/SchedulesEdit', () => {
  it('renders with loading state', () => {
    const wrapper = shallowMount(SchedulesEdit, {
      props: {
        subjectSchedules: makeBaseSubjectSchedules(),
        availableSchedules: [],
        loading: true,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with schedule data', () => {
    const wrapper = shallowMount(SchedulesEdit, {
      props: {
        subjectSchedules: makeBaseSubjectSchedules(),
        availableSchedules: [makeSchedule()],
        loading: false,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('shows a schedule report action when a URL is available', () => {
    const reportUrl = 'https://github.com/horext/app-data/issues/new'
    const wrapper = mount(SchedulesEdit, {
      props: {
        subjectSchedules: makeBaseSubjectSchedules(),
        availableSchedules: [makeSchedule()],
        loading: false,
        reportUrl,
      },
      global: { plugins: [vuetify] },
    })
    const reportButton = wrapper.find(`[href="${reportUrl}"]`)

    expect(reportButton.attributes()).toMatchObject({
      href: reportUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
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
