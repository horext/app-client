import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, afterAll, beforeAll, vi } from 'vitest'
import NoData from '../NoData.vue'
import LottieRender from '~/components/LottieRender.vue'

vi.mock('lottie-web', () => ({
  loadAnimation: vi.fn(),
}))

describe('NoData', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })

  it('renders the correct message', () => {
    const wrapper = shallowMount(NoData)
    const message = wrapper.find('.text-md-h2')
    expect(message.text()).toBe(
      'Busca tus cursos en la parte superior y luego ve al generador',
    )
  })

  it('renders the lottie animation', () => {
    const wrapper = shallowMount(NoData)
    const lottie = wrapper.findComponent(LottieRender)
    expect(lottie).toBeDefined()
    expect(lottie.attributes('animationdata')).toBeDefined()
  })
})
