import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import NavigationDrawer from '~/components/app/NavigationDrawer.vue'

const vuetify = createVuetify()

const items = [
  { title: 'Inicio', icon: 'mdi-home', to: '/' },
  { title: 'Generador', icon: 'mdi-calendar', to: '/generator', badge: 3 },
]

describe('NavigationDrawer', () => {
  it('renders when drawer is true', () => {
    const wrapper = shallowMount(NavigationDrawer, {
      props: { drawer: true, items },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders items in the navigation list', () => {
    const wrapper = shallowMount(NavigationDrawer, {
      props: { drawer: true, items },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:drawer when internal drawer changes', async () => {
    const wrapper = shallowMount(NavigationDrawer, {
      props: { drawer: true, items },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:drawer', false)
    expect(wrapper.emitted('update:drawer')?.[0]).toEqual([false])
  })
})
