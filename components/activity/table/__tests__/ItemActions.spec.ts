import { shallowMount } from '@vue/test-utils'
import ItemActions from '../ItemActions.vue'
import { describe, it, expect } from 'vitest'
import { VBtn } from 'vuetify/components/VBtn'

describe('ItemActions', () => {
  it('emits click:edit event when edit button is clicked', () => {
    const wrapper = shallowMount(ItemActions)
    wrapper.findAllComponents(VBtn).at(0).trigger('click')
    expect(wrapper.emitted('click:edit')).toBeTruthy()
  })

  it('emits click:delete event when delete button is clicked', () => {
    const wrapper = shallowMount(ItemActions)
    wrapper.findAllComponents(VBtn).at(1).trigger('click')
    expect(wrapper.emitted('click:delete')).toBeTruthy()
  })
})
