import { mount } from '@vue/test-utils'
import ItemActions from '../ItemActions.vue'
import { describe, it, expect } from 'vitest'
import { VBtn } from 'vuetify/components/VBtn'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

describe('ItemActions', () => {
  it('emits click:edit event when edit button is clicked', () => {
    const wrapper = mount(ItemActions, {
      global: {
        plugins: [vuetify],
      },
    })
    const actionButtons = wrapper.findAllComponents(VBtn)
    const editButton = actionButtons.find(
      (button) => button.text() === 'Editar Actividad',
    )
    expect(editButton).toBeTruthy()
    editButton?.trigger('click')
    expect(wrapper.emitted('click:edit')).toBeTruthy()
  })

  it('emits click:delete event when delete button is clicked', () => {
    const wrapper = mount(ItemActions, {
      global: {
        plugins: [vuetify],
      },
    })
    const actionButtons = wrapper.findAllComponents(VBtn)
    const deleteButton = actionButtons.find(
      (button) => button.text() === 'Eliminar Actividad',
    )
    expect(deleteButton).toBeTruthy()
    deleteButton?.trigger('click')
    expect(wrapper.emitted('click:delete')).toBeTruthy()
  })
})
