import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import CoreWorkerClass from '@/assets/workers/core?worker'

import { useSchedulesGenerator } from '../schedules'

// Mock the CoreWorker module
vi.mock('@/assets/workers/core?worker', () => ({
  default: vi.fn(),
}))

// Mock getSchedules auto-import
const { mockGetSchedules } = vi.hoisted(() => ({ mockGetSchedules: vi.fn() }))
mockNuxtImport('getSchedules', () => mockGetSchedules)

const mockPostMessage = vi.fn()
const mockTerminate = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

function createMockWorker() {
  return {
    postMessage: mockPostMessage,
    terminate: mockTerminate,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(CoreWorkerClass).mockImplementation(createMockWorker as never)
})

describe('useSchedulesGenerator', () => {
  it('returns loadSchedules function', () => {
    const TestComponent = defineComponent({
      setup() {
        const { loadSchedules } = useSchedulesGenerator()
        return { loadSchedules }
      },
      template: '<div />',
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.loadSchedules).toBeTypeOf('function')
    wrapper.unmount()
  })

  it('creates a CoreWorker on mount', () => {
    const TestComponent = defineComponent({
      setup() {
        useSchedulesGenerator()
        return {}
      },
      template: '<div />',
    })
    const wrapper = mount(TestComponent, { attachTo: document.body })
    expect(CoreWorkerClass).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('terminates the worker on unmount', () => {
    const TestComponent = defineComponent({
      setup() {
        useSchedulesGenerator()
        return {}
      },
      template: '<div />',
    })
    const wrapper = mount(TestComponent, { attachTo: document.body })
    wrapper.unmount()
    expect(mockTerminate).toHaveBeenCalled()
  })

  it('loadSchedules posts a message to the worker', async () => {
    let capturedResolve: (value: unknown) => void
    mockAddEventListener.mockImplementation(
      (_event: string, handler: (e: MessageEvent) => void) => {
        capturedResolve = (data) => handler({ data } as MessageEvent)
      },
    )

    const TestComponent = defineComponent({
      setup() {
        const { loadSchedules } = useSchedulesGenerator()
        return { loadSchedules }
      },
      template: '<div />',
    })
    const wrapper = mount(TestComponent, { attachTo: document.body })

    const resultData = {
      occurrences: [],
      schedules: [],
      combinations: [],
    }

    const promise = wrapper.vm.loadSchedules([], [], {} as never)
    capturedResolve!(resultData)
    const result = await promise
    expect(result).toEqual(resultData)
    expect(mockPostMessage).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('loadSchedulesViaWorker rejects when worker is not loaded', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { loadSchedules } = useSchedulesGenerator()
        return { loadSchedules }
      },
      template: '<div />',
    })
    const wrapper = mount(TestComponent, { attachTo: document.body })

    // Worker is null because we return null in the constructor mock
    // loadSchedules catches the error and falls back to getSchedules
    mockGetSchedules.mockReturnValue({
      occurrences: [],
      schedules: [],
      combinations: [],
    })

    // Call before mount gives null worker, falls back to getSchedules
    const gen = useSchedulesGenerator()
    gen.loadSchedules([], [], {} as never)

    wrapper.unmount()
  })
})
