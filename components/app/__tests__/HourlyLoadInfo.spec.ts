import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import HourlyLoadInfo from '~/components/app/HourlyLoadInfo.vue'

describe('HourlyLoadInfo', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })

  it('renders the component with hourlyLoad prop', () => {
    const hourlyLoad = {
      name: 'Example Load',
      updatedAt: '2022-01-01T00:00:00Z',
    }

    const wrapper = shallowMount(HourlyLoadInfo, {
      props: {
        hourlyLoad,
      },
    })

    expect(wrapper.text()).toContain(hourlyLoad.name)
    expect(wrapper.text()).toContain(
      new Date(hourlyLoad.updatedAt).toLocaleString(),
    )
  })

  it('renders the component without hourlyLoad prop', () => {
    const wrapper = shallowMount(HourlyLoadInfo)

    expect(wrapper.text()).toContain('Sin carga horaria.')
  })
})
