import { mount } from '@vue/test-utils'
import AppBar from '../Bar.vue'
import { describe, it, expect, vi } from 'vitest'
import { VAppBarNavIcon, VLayout } from 'vuetify/components'
import { createVuetify } from 'vuetify'
import ThemeDarkToggle from '~/components/ThemeDarkToggle.vue'

vi.mock('~/composables/lottie', () => ({
  useLottie: () => ({
    value: {
      setSpeed: vi.fn(),
      setDirection: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
    },
  }),
}))

const vuetify = createVuetify()

describe('Bar', () => {
  it('renders the component', async () => {
    const wrapperLayout = mount(
      <VLayout>
        <AppBar drawer={true} darkMode={true} />
      </VLayout>,
      {
        global: {
          plugins: [vuetify],
        },
      },
    )
    await nextTick()
    const wrapper = wrapperLayout.findComponent(AppBar)
    expect(wrapper.exists()).toBe(true)
  })

  it('toggles the drawer', async () => {
    const wrapperLayout = mount(
      <VLayout>
        <AppBar drawer={true} darkMode={true} />
      </VLayout>,
      {
        global: {
          plugins: [vuetify],
        },
      },
    )
    await nextTick()
    const wrapper = wrapperLayout.findComponent(AppBar)
    const navIconButton = wrapper.findComponent(VAppBarNavIcon)
    expect(navIconButton.exists()).toBe(true)
    await navIconButton.trigger('click')

    expect(wrapper.emitted('update:drawer')).toStrictEqual([[false]])

    await nextTick()

    await navIconButton.trigger('click')

    expect(wrapper.emitted('update:drawer')).toStrictEqual([[false], [true]])
  })

  it('sets the dark mode', async () => {
    const wrapperLayout = mount(
      <VLayout>
        <AppBar drawer={true} darkMode={true} />
      </VLayout>,
      {
        global: {
          plugins: [vuetify],
        },
      },
    )
    await nextTick()
    const wrapper = wrapperLayout.findComponent(AppBar)
    const darkModeButton = wrapper.findComponent(ThemeDarkToggle)
    expect(darkModeButton.exists()).toBe(true)
    await darkModeButton.vm.$emit('update:darkMode', false)

    expect(wrapper.emitted('update:darkMode')).toStrictEqual([[false]])

    await nextTick()

    await darkModeButton.vm.$emit('update:darkMode', true)

    expect(wrapper.emitted('update:darkMode')).toStrictEqual([[false], [true]])
  })
})
