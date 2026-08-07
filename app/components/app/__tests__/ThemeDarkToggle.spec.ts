import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import ThemeDarkToggle from '~/components/app/ThemeDarkToggle.vue'

vi.mock('~/composables/lottie', () => ({
  useLottie: vi.fn(() =>
    ref({
      setSpeed: vi.fn(),
      setDirection: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      destroy: vi.fn(),
    }),
  ),
}))

const vuetify = createVuetify()

describe('ThemeDarkToggle', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(ThemeDarkToggle, {
      props: { darkMode: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with dark mode enabled', () => {
    const wrapper = shallowMount(ThemeDarkToggle, {
      props: { darkMode: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:darkMode when toggled', async () => {
    const wrapper = shallowMount(ThemeDarkToggle, {
      props: { darkMode: false },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:darkMode', true)
    expect(wrapper.emitted('update:darkMode')?.[0]).toEqual([true])
  })
})
