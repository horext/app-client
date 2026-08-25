import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import type { IBasePlannedSubject } from '~/interfaces/subject'
import SchedulesEdit from '~/components/subject/SchedulesEdit.vue'
import Select from '~/components/subject/Select.vue'
import ItemActions from '~/components/subject/table/ItemActions.vue'
import { makeSchedule } from '~/components/subject/__tests__/fixtures'

const vuetify = createVuetify()

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

describe('subject/SchedulesEdit', () => {
  it('renders with loading state', () => {
    const wrapper = shallowMount(SchedulesEdit, {
      props: {
        planedSubject: makeBaseSubjectSchedules(),
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
        planedSubject: makeBaseSubjectSchedules(),
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
        planedSubject: makeBaseSubjectSchedules(),
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
