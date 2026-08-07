import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import Lottie from 'lottie-web'
import { getElReference, useLottie } from '../lottie'

vi.mock('lottie-web', () => ({
  default: {
    loadAnimation: vi.fn(() => ({
      destroy: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      setSpeed: vi.fn(),
    })),
  },
}))

describe('getElReference', () => {
  it('returns the element directly when it is a plain Element', () => {
    const el = document.createElement('div')
    const reference = ref<Element | null>(el)
    expect(getElReference(reference)).toBe(el)
  })

  it('returns null when reference is null', () => {
    const reference = ref<Element | null>(null)
    expect(getElReference(reference)).toBeNull()
  })

  it('returns $el when reference is a ComponentPublicInstance', () => {
    const el = document.createElement('span')
    const fakeComponent = { $el: el }
    const reference = ref(fakeComponent)
    expect(getElReference(reference as never)).toBe(el)
  })
})

describe('useLottie', () => {
  beforeEach(() => {
    vi.mocked(Lottie.loadAnimation).mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls Lottie.loadAnimation with the element and options on mount', async () => {
    const el = document.createElement('div')
    const reference = ref<Element | null>(null)

    const TestComponent = defineComponent({
      setup() {
        const lottie = useLottie(reference, {
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: {},
        } as never)
        return { lottie }
      },
      template: '<div />',
    })

    const wrapper = mount(TestComponent, {
      attachTo: document.body,
    })

    reference.value = el
    // re-mount to trigger onMounted with the element set
    const wrapper2 = mount(
      defineComponent({
        setup() {
          const innerRef = ref<Element | null>(el)
          const lottie = useLottie(innerRef, {
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: {},
          } as never)
          return { lottie }
        },
        template: '<div />',
      }),
      { attachTo: document.body },
    )

    expect(Lottie.loadAnimation).toHaveBeenCalled()
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('does not call loadAnimation when reference element is null on mount', () => {
    const reference = ref<Element | null>(null)

    const TestComponent = defineComponent({
      setup() {
        const lottie = useLottie(reference, {
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: {},
        } as never)
        return { lottie }
      },
      template: '<div />',
    })

    const wrapper = mount(TestComponent, { attachTo: document.body })
    expect(Lottie.loadAnimation).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
