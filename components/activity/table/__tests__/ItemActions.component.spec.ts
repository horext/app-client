import { mount } from '@vue/test-utils'
import ItemActions from '../ItemActions.vue'
import { describe, it, expect } from 'vitest'
import { VBtn } from 'vuetify/components/VBtn'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

describe('ItemActions', () => {

  const mountComponent = () => {
    return mount(ItemActions, {
      global: {
        plugins: [vuetify],
      },
    })
  }
  it('emits click:edit event when edit button is clicked', () => {
    const wrapper = mountComponent()
    const actionButtons = wrapper.findAllComponents(VBtn)
    const editButton = actionButtons.find(
      (button) => button.attributes('aria-label') === 'Editar Actividad',
    )
    expect(editButton).toBeTruthy()
    editButton?.trigger('click')
    expect(wrapper.emitted('click:edit')).toBeTruthy()
  })

  it('emits click:delete event when delete button is clicked', () => {
    const wrapper = mountComponent()
    const actionButtons = wrapper.findAllComponents(VBtn)
    const deleteButton = actionButtons.find(
      (button) => button.attributes('aria-label') === 'Eliminar Actividad',
    )
    expect(deleteButton).toBeTruthy()
    deleteButton?.trigger('click')
    expect(wrapper.emitted('click:delete')).toBeTruthy()
  })
})
