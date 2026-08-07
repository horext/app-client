import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import type { ISubjectStudyPlan } from '~/interfaces/subject'
import SubjectCard from '~/components/plan/SubjectCard.vue'

const vuetify = createVuetify()

function makeSubject(
  overrides: Partial<ISubjectStudyPlan> = {},
): ISubjectStudyPlan {
  return {
    id: 1,
    credits: 4,
    type: { id: 1, name: 'Obligatorio' },
    course: { id: 'CS101', name: 'Intro CS' },
    relationships: [],
    cycle: '1',
    ...overrides,
  } as ISubjectStudyPlan
}

describe('plan/SubjectCard', () => {
  it('renders a basic subject card', () => {
    const subject = makeSubject()
    const wrapper = shallowMount(SubjectCard, {
      props: {
        subject,
        selectedSubjectIds: [],
        subjects: [subject],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('applies "selected" class when subject id is in selectedSubjectIds', () => {
    const subject = makeSubject({ id: 42 })
    const wrapper = shallowMount(SubjectCard, {
      props: {
        subject,
        selectedSubjectIds: [42],
        subjects: [subject],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.classes()).toContain('highlighted')
    expect(wrapper.classes()).toContain('selected')
  })

  it('applies "open-subjects" class when a selected subject is a prerequisite', () => {
    const prereqSubject = makeSubject({ id: 5, relationships: [] })
    const subject = makeSubject({
      id: 10,
      relationships: [{ relatedSubjectId: 5 } as never],
    })
    const wrapper = shallowMount(SubjectCard, {
      props: {
        subject,
        selectedSubjectIds: [5],
        subjects: [prereqSubject, subject],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.classes()).toContain('open-subjects')
  })

  it('renders prerequisites when they exist', () => {
    const prereqSubject = makeSubject({
      id: 3,
      course: { id: 'MATH101', name: 'Calculus' } as never,
    })
    const subject = makeSubject({
      id: 10,
      relationships: [{ relatedSubjectId: 3 } as never],
    })
    const wrapper = shallowMount(SubjectCard, {
      props: {
        subject,
        selectedSubjectIds: [],
        subjects: [prereqSubject, subject],
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.text()).toContain('Calculus')
  })

  it('emits click event when card is clicked', async () => {
    const subject = makeSubject()
    const wrapper = shallowMount(SubjectCard, {
      props: {
        subject,
        selectedSubjectIds: [],
        subjects: [subject],
      },
      global: { plugins: [vuetify] },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
