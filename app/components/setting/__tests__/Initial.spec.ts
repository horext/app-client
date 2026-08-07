import { shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import Initial from '~/components/setting/Initial.vue'

vi.mock('~/stores/user-profile', () => ({
  useUserProfileStore: vi.fn(() => ({
    facultyId: ref(null),
    specialityId: ref(null),
    hourlyLoad: ref(null),
  })),
}))

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

vi.mock('~~/modules/apis/runtime/composables', () => ({
  useFacultyApi: vi.fn(() => ({
    get: vi.fn().mockResolvedValue([]),
  })),
  useHourlyLoadApi: vi.fn(() => ({
    getByFacultyId: vi.fn().mockResolvedValue(null),
  })),
  useSpecialityApi: vi.fn(() => ({
    getByFacultyId: vi.fn().mockResolvedValue([]),
  })),
}))

const vuetify = createVuetify()

describe('setting/Initial', () => {
  it('renders the initial settings form', () => {
    const wrapper = shallowMount(Initial, {
      props: { loading: false },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders while loading', () => {
    const wrapper = shallowMount(Initial, {
      props: { loading: true },
      global: { plugins: [vuetify] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
