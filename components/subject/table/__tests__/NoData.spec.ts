import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, afterAll, beforeAll } from 'vitest'
import NoData from '../NoData.vue'

vi.mock('~/composables/lottie')

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
    const animation = wrapper.find({ ref: 'noDataElement' })
    expect(animation.exists()).toBe(true)
  })
})
