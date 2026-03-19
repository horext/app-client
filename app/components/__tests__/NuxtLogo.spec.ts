// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import NuxtLogo from '@/components/NuxtLogo.vue'
import { describe, expect, test } from 'vitest'

describe('NuxtLogo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(NuxtLogo)
    expect(wrapper.vm).toBeTruthy()
  })
})
