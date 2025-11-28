import { mount } from '@vue/test-utils'
import GeneratorActions from '~/components/schedule/GeneratorActions.vue'
import { describe, expect, it, vi } from 'vitest'
import { VBtn } from 'vuetify/components/VBtn'
import { VTextField } from 'vuetify/components/VTextField'
import { VIcon } from 'vuetify/components/VIcon'
import { VCardText } from 'vuetify/components/VCard'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()
vi.stubGlobal('visualViewport', new EventTarget())
describe('GeneratorActions.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(GeneratorActions, {
      props: {
        loadingGenerate: false,
        crossings: 2,
      },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.findComponent(VTextField).exists()).toBe(true)
    expect(wrapper.findComponent(VBtn).exists()).toBe(true)
  })

  it('initializes with correct props', () => {
    const wrapper = mount(GeneratorActions, {
      props: {
        loadingGenerate: false,
        crossings: 2,
      },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.props().loadingGenerate).toBe(false)
    expect(wrapper.props().crossings).toBe(2)
  })

  it('updates internalCrossings on input change', async () => {
    const wrapper = mount(GeneratorActions, {
      props: {
        loadingGenerate: false,
        crossings: 2,
      },
      global: {
        plugins: [vuetify],
      },
    })

    const input = wrapper.findComponent(VTextField).find('input')
    await input.setValue(3)

    expect(wrapper.emitted()['update:crossings'][0]).toEqual([3])
  })

  it('displays help text in v-menu', async () => {
    const wrapper = mount(GeneratorActions, {
      props: {
        loadingGenerate: false,
        crossings: 2,
      },
      global: {
        plugins: [vuetify],
      },
    })

    const menuActivator = wrapper.findComponent(VIcon)
    await menuActivator.trigger('click')

    expect(wrapper.findComponent(VCardText).text()).toContain(
      'Solo se contabiliza los cruces entre cursos',
    )
  })

  it('emits click:generate event on button click', async () => {
    const wrapper = mount(GeneratorActions, {
      props: {
        loadingGenerate: false,
        crossings: 2,
      },
      global: {
        plugins: [vuetify],
      },
    })

    const button = wrapper.findComponent(VBtn)
    await button.trigger('click')

    expect(wrapper.emitted()['click:generate']).toBeTruthy()
  })
})
