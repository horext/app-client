import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import AppBar from '~/components/home/AppBar.vue'
import Drawer from '~/components/home/Drawer.vue'
import Footer from '~/components/home/Footer.vue'
import View from '~/components/home/View.vue'

vi.mock('~/stores/settings', () => ({
  useSettingsStore: vi.fn(() => ({
    toggleDarkMode: vi.fn(),
    darkMode: false,
  })),
}))

vi.mock('~/stores/user-auth', () => ({
  useUserAuthStore: vi.fn(() => ({
    isLoggedIn: false,
  })),
}))

const vuetify = createVuetify()
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div/>' } }],
})

describe('home/AppBar', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(AppBar, {
      global: {
        plugins: [vuetify, router],
        stubs: { VuetifyLogo: true, LazyHomeDrawer: true },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('home/Drawer', () => {
  it('renders with navigation items', () => {
    const items = [
      { name: 'Inicio', route: '/' },
      { name: 'Generador', route: '/generator' },
    ]
    const wrapper = shallowMount(Drawer, {
      props: { items },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('home/Footer', () => {
  it('renders the footer', () => {
    const wrapper = shallowMount(Footer, {
      global: { plugins: [vuetify], stubs: { NuxtLink: true } },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('home/View', () => {
  it('renders the view with a slot', () => {
    const wrapper = shallowMount(View, {
      slots: { default: '<p>content</p>' },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
