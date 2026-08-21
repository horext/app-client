import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import SearchContext from '../SearchContext.vue'

const vuetify = createVuetify()

describe('SubjectSearchContext', () => {
  it('shows the active study-plan search level', () => {
    const wrapper = mount(SearchContext, {
      props: {
        specialityName: 'Engineering',
        studyPlanName: 'Plan 2026',
        reportUrl: 'https://github.com/horext/app-data/issues/new',
      },
      global: { plugins: [vuetify] },
    })

    expect(wrapper.text()).toContain('Buscando en')
    expect(wrapper.text()).toContain('Especialidad')
    expect(wrapper.text()).toContain('Engineering')
    expect(wrapper.text()).toContain('Plan 2026')
    expect(wrapper.text()).toContain('Informar problema')
    expect(wrapper.text()).not.toContain('mejorar la precisión')
    expect(wrapper.find('.mdi-school-outline').exists()).toBe(true)
    expect(wrapper.find('.mdi-book-open-page-variant-outline').exists()).toBe(
      true,
    )
    expect(wrapper.find('.mdi-flag-outline').exists()).toBe(true)
    expect(wrapper.find('.mdi-open-in-new').exists()).toBe(true)
    expect(wrapper.get('a').attributes()).toMatchObject({
      href: 'https://github.com/horext/app-data/issues/new',
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })

  it('shows the specialty level and recommends selecting a plan', () => {
    const wrapper = mount(SearchContext, {
      props: { specialityName: 'Engineering' },
      global: { plugins: [vuetify] },
    })

    expect(wrapper.text()).toContain('Engineering')
    expect(wrapper.text()).toContain('Especialidad')
    expect(wrapper.text()).toContain('mejorar la precisión')
    expect(wrapper.text()).not.toContain('Informar problema')
    expect(wrapper.find('.mdi-information-outline').exists()).toBe(true)
    expect(wrapper.find('.mdi-tune-variant').exists()).toBe(true)
  })
})
