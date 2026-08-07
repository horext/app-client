import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import NuxtLogo from '~/components/NuxtLogo.vue'
import LottieRender from '~/components/LottieRender.vue'

vi.mock('~/composables/lottie', () => ({
  useLottie: vi.fn(() => ref(null)),
}))

const vuetify = createVuetify()

describe('Logo', () => {
  it('renders without error', () => {
    const wrapper = shallowMount(Logo, { global: { plugins: [vuetify] } })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('VuetifyLogo', () => {
  it('renders without error', () => {
    const wrapper = shallowMount(VuetifyLogo, {
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('NuxtLogo', () => {
  it('renders without error', () => {
    const wrapper = shallowMount(NuxtLogo, { global: { plugins: [vuetify] } })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('LottieRender', () => {
  it('renders without error', () => {
    const wrapper = shallowMount(LottieRender, {
      props: {
        animationData: {},
        renderer: 'svg',
        loop: false,
        autoplay: false,
      } as never,
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
