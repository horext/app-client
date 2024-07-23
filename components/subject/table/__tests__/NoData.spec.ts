import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import NoData from '../NoData.vue'

describe('NoData', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })

  it('renders the correct message', () => {
    const wrapper = shallowMount(NoData, {
      global: {
        stubs: {
          LottieRender: true,  
        },
      },
    })
    const message = wrapper.find('.text-md-h2')
    expect(message.text()).toBe(
      'Busca tus cursos en la parte superior y luego ve al generador',
    )
  })

  it('renders the lottie animation', () => {
    const wrapper = shallowMount(NoData, {
      global: {
        stubs: {
          LottieRender: true,  
        },
      },
    })
    const lottie = wrapper.findComponent({ name: 'LottieRender' })
    expect(lottie.exists()).toBe(true)
  })
})
