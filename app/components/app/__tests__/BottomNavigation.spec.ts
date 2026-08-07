import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import BottomNavigation from '~/components/app/BottomNavigation.vue'

const vuetify = createVuetify()

const items = [
  {
    shortTitle: 'Inicio',
    denseTitle: 'Ini',
    icon: 'mdi-home',
    to: '/',
    badge: 0,
  },
  {
    shortTitle: 'Generador',
    denseTitle: 'Gen',
    icon: 'mdi-calendar',
    to: '/generator',
    badge: 2,
  },
]

describe('BottomNavigation', () => {
  it('renders the component with items', () => {
    const wrapper = shallowMount(BottomNavigation, {
      props: { items },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with multiple items', () => {
    const wrapper = shallowMount(BottomNavigation, {
      props: { items },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
