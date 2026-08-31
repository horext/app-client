import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import type { IBasePlannedSubject } from '~/interfaces/subject'
import ScheduleItem from '~/components/subject/ScheduleItem.vue'
import SchedulesEdit from '~/components/subject/SchedulesEdit.vue'
import Select from '~/components/subject/Select.vue'
import ItemActions from '~/components/subject/table/ItemActions.vue'
import { makeSchedule } from '~/components/subject/__tests__/fixtures'
import type { PlannedSubjectSchedule } from '~/models/planned-subject'

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

describe('subject/SchedulesEdit selection state', () => {
  it('keeps a new subject empty until the user selects a schedule', async () => {
    const schedule = makeSchedule(1, 'A')
    const planedSubject = makeBaseSubjectSchedules()
    planedSubject.schedules = []
    const wrapper = mount(SchedulesEdit, {
      props: {
        planedSubject,
        availableSchedules: [schedule],
        loading: false,
      },
      global: { plugins: [vuetify] },
    })
    const scheduleList = wrapper.findComponent(ScheduleItem)

    const options = scheduleList.props('schedules') as PlannedSubjectSchedule[]
    expect(options.every(({ selected }) => !selected)).toBe(true)
    expect(wrapper.text()).not.toContain('Cambios en tus selecciones')

    options[0]!.selected = true
    await nextTick()

    expect(options[0]!.selected).toBe(true)
    expect(wrapper.text()).not.toContain('Cambios en tus selecciones')
    expect(wrapper.text()).not.toContain('Nueva selección')
  })

  it('does not reset a user selection when available schedules change', async () => {
    const selected = makeSchedule(1, 'A')
    const planedSubject = makeBaseSubjectSchedules()
    planedSubject.schedules = []
    const wrapper = mount(SchedulesEdit, {
      props: {
        planedSubject,
        availableSchedules: [selected],
        loading: false,
      },
      global: { plugins: [vuetify] },
    })
    const scheduleList = wrapper.findComponent(ScheduleItem)
    const options = scheduleList.props('schedules') as PlannedSubjectSchedule[]
    options[0]!.selected = true
    await nextTick()

    await wrapper.setProps({
      availableSchedules: [selected, makeSchedule(2, 'B')],
    })

    const updatedOptions = scheduleList.props(
      'schedules',
    ) as PlannedSubjectSchedule[]
    expect(
      updatedOptions.find(({ sectionId }) => sectionId === 'A')?.selected,
    ).toBe(true)
  })
})
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
