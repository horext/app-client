import { config, shallowMount } from '@vue/test-utils'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import ItemSectionList from '~/components/subject/table/ItemSectionList.vue'
import { getSectionColor } from '~/utils/color'
import { VChip } from 'vuetify/components/VChip'

describe('ItemSectionList', () => {
  beforeAll(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterAll(() => {
    config.global.renderStubDefaultSlot = false
  })

  it('renders the correct number of chips', () => {
    const schedules = [
      { id: 1, section: { id: 'A' } },
      { id: 2, section: { id: 'B' } },
      { id: 3, section: { id: 'C' } },
    ]

    const wrapper = shallowMount(ItemSectionList, {
      props: {
        schedules,
      },
    })

    expect(wrapper.findAllComponents(VChip)).toHaveLength(schedules.length)
  })

  it('assigns the correct color to each chip', () => {
    const schedules = [
      { id: 1, section: { id: 'A' } },
      { id: 2, section: { id: 'B' } },
      { id: 3, section: { id: 'C' } },
    ]

    const wrapper = shallowMount(ItemSectionList, {
      props: {
        schedules,
      },
    })

    const chips = wrapper.findAllComponents(VChip)

    chips.forEach((chip, index) => {
      const expectedColor = getSectionColor(schedules[index]!.section.id)
      expect(chip.props('color')).toBe(expectedColor)
    })
  })

  it('displays the correct text in each chip', () => {
    const schedules = [
      { id: 1, section: { id: 'A' } },
      { id: 2, section: { id: 'B' } },
      { id: 3, section: { id: 'C' } },
    ]

    const wrapper = shallowMount(ItemSectionList, {
      props: {
        schedules,
      },
    })

    const chips = wrapper.findAllComponents(VChip)

    chips.forEach((chip, index) => {
      const expectedText = schedules[index]?.section.id
      expect(chip.text()).toBe(expectedText)
    })
  })
})
