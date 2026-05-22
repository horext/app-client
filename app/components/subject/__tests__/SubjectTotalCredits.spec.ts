import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import TotalCredits from '~/components/subject/TotalCredits.vue'

describe('TotalCredits', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })
  it('displays the correct total credits', () => {
    const subjects = [{ subject: { credits: 3 } }, { subject: { credits: 4 } }, { subject: { credits: 2 } }]

    const wrapper = shallowMount(TotalCredits, {
      props: {
        subjects,
      },
    })

    expect(wrapper.text()).toContain('Total de créditos: 9')
  })
})
