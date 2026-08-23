import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import SearchContext from '../SearchContext.vue'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

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
    expect(wrapper.text()).toContain('Carrera')
    expect(wrapper.text()).toContain('Engineering')
    expect(wrapper.text()).toContain('Plan 2026')
    expect(wrapper.text()).toContain('Informar problema')
    expect(wrapper.text()).not.toContain('mejorar la precisión')
    expect(wrapper.find('.v-chip__prepend svg').exists()).toBe(true)
    const reportLink = wrapper.get('a')
    expect(reportLink.find('.v-btn__prepend svg').exists()).toBe(true)
    expect(reportLink.find('.v-btn__append svg').exists()).toBe(true)
    expect(reportLink.attributes()).toMatchObject({
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
    expect(wrapper.text()).toContain('Carrera')
    expect(wrapper.text()).toContain('mejorar la precisión')
    expect(wrapper.text()).not.toContain('Informar problema')
    expect(wrapper.find('.v-icon svg').exists()).toBe(true)
    expect(wrapper.find('.v-btn__prepend svg').exists()).toBe(true)
  })
})
