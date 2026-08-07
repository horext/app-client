import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import SignInDialog from '~/components/google/SignInDialog.vue'
import Connect from '~/components/google/calendar/Connect.vue'
import CreateDialog from '~/components/google/calendar/CreateDialog.vue'
import SyncDialog from '~/components/google/calendar/SyncDialog.vue'

vi.mock('~/composables/google-oauth2', () => ({
  useGoogleOAuth2: vi.fn(() => ({
    isSignedIn: ref(false),
    isPendingClient: ref(false),
    isPendingToken: ref(false),
    getToken: vi.fn(),
    signOut: vi.fn(),
  })),
}))

const vuetify = createVuetify()

describe('google/SignInDialog', () => {
  it('renders when modelValue is false', () => {
    const wrapper = shallowMount(SignInDialog, {
      props: { modelValue: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders when modelValue is true', () => {
    const wrapper = shallowMount(SignInDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:modelValue when closed', () => {
    const wrapper = shallowMount(SignInDialog, {
      props: { modelValue: true },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})

describe('google/calendar/Connect', () => {
  it('renders with loading false', () => {
    const wrapper = shallowMount(Connect, {
      props: { loading: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with loading true', () => {
    const wrapper = shallowMount(Connect, {
      props: { loading: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click when button is clicked', () => {
    const wrapper = shallowMount(Connect, {
      props: { loading: false },
      global: { plugins: [vuetify] },
    })
    wrapper.vm.$emit('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})

describe('google/calendar/CreateDialog', () => {
  it('renders with calendar prop', () => {
    const wrapper = shallowMount(CreateDialog, {
      props: {
        calendar: { summary: 'Horext' },
        loading: false,
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})

describe('google/calendar/SyncDialog', () => {
  it('renders when modelValue is false', () => {
    const wrapper = shallowMount(SyncDialog, {
      props: {
        modelValue: false,
        events: [],
        startDate: '2024-03-01',
        endDate: '2024-07-31',
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders when modelValue is true with events', () => {
    const wrapper = shallowMount(SyncDialog, {
      props: {
        modelValue: true,
        events: [],
        startDate: '2024-03-01',
        endDate: '2024-07-31',
      },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
