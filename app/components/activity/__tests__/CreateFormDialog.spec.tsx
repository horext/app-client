// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import { defineComponent, ref } from 'vue'
import { VBtn } from 'vuetify/components/VBtn'
import { VTextField } from 'vuetify/components/VTextField'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import CreateFormDialog from '~/components/activity/CreateFormDialog.vue'
import { Activity } from '~/models/Event'
import type { IEventCreated } from '~/interfaces/event'

vi.stubGlobal('visualViewport', new EventTarget())
const vuetify = createVuetify()

vi.stubGlobal('CSS', { supports: () => false })

const mountComponent = (options: { event: IEventCreated | null; loading?: boolean; open?: boolean }) => {
  const Wrapper = defineComponent({
    setup() {
      const dialog = ref(options.open ?? false)
      const event = ref(options.event)
      const loading = ref(options.loading ?? false)
      return () => (
        <CreateFormDialog
          v-model={dialog.value}
          event={event.value}
          loading={loading.value}
        />
      )
    },
  })

  return mount(Wrapper, {
    global: { plugins: [vuetify] },
    attachTo: document.body,
  })
}

let wrapper: ReturnType<typeof mountComponent>

describe('CreateFormDialog', () => {
  beforeEach(() => {
    wrapper = mountComponent({ event: null })
  })

  it('renders the activator button with correct label', () => {
    const btn = wrapper.findAllComponents(VBtn).find((b) => b.text() === 'Nueva Actividad')
    expect(btn).toBeTruthy()
  })

  it('renders startTime and endTime time fields when dialog is open', () => {
    wrapper = mountComponent({ event: null, open: true })
    const textFields = wrapper.findAllComponents(VTextField)
    expect(textFields.find((f) => f.props('label') === 'Hora de Inicio')).toBeTruthy()
    expect(textFields.find((f) => f.props('label') === 'Hora de Fin')).toBeTruthy()
  })

  it('renders day autocomplete when dialog is open', () => {
    wrapper = mountComponent({ event: null, open: true })
    const autocomplete = wrapper.findComponent(VAutocomplete)
    expect(autocomplete.exists()).toBe(true)
    expect(autocomplete.props('label')).toBe('Dia')
  })

  it('populates title field from event prop', () => {
    const event: IEventCreated = {
      id: 'abc-123',
      title: 'My Activity',
      day: 3,
      color: '#ff0000',
      type: 'MY_EVENT',
      category: 'MY_EVENT',
      startTime: '09:00',
      endTime: '11:00',
    }
    wrapper = mountComponent({ event, open: true })
    const titleField = wrapper
      .findAllComponents(VTextField)
      .find((f) => f.props('label') === 'Titulo del Evento')
    expect(titleField?.props('modelValue')).toBe('My Activity')
  })

  it('uses default empty title when event prop is null', () => {
    wrapper = mountComponent({ event: null, open: true })
    const titleField = wrapper
      .findAllComponents(VTextField)
      .find((f) => f.props('label') === 'Titulo del Evento')
    expect(titleField?.props('modelValue')).toBe('')
  })

  it('emits cancel when cancel button is clicked', async () => {
    wrapper = mountComponent({ event: null, open: true })
    const cancelBtn = wrapper.findAllComponents(VBtn).find((b) => b.text() === 'Cancelar')
    expect(cancelBtn).toBeTruthy()
    await cancelBtn!.trigger('click')
    const dialog = wrapper.findComponent(CreateFormDialog)
    expect(dialog.emitted('cancel')).toBeTruthy()
  })

  it('emits save:event with an Activity instance when form is valid', async () => {
    wrapper = mountComponent({ event: null, open: true })
    const dialog = wrapper.findComponent(CreateFormDialog)

    const vm = dialog.vm as unknown as { form: { validate: () => Promise<{ valid: boolean }> } }
    vm.form = { validate: vi.fn().mockResolvedValue({ valid: true }) }

    const saveBtn = wrapper.findAllComponents(VBtn).find((b) => b.text() === 'Guardar')
    await saveBtn!.trigger('click')
    await dialog.vm.$nextTick()

    const emitted = dialog.emitted('save:event')
    expect(emitted).toBeTruthy()
    expect(emitted![0]?.[0]).toBeInstanceOf(Activity)
  })

  it('does not emit save:event when form validation fails', async () => {
    wrapper = mountComponent({ event: null, open: true })
    const dialog = wrapper.findComponent(CreateFormDialog)

    const vm = dialog.vm as unknown as { form: { validate: () => Promise<{ valid: boolean }> } }
    vm.form = { validate: vi.fn().mockResolvedValue({ valid: false }) }

    const saveBtn = wrapper.findAllComponents(VBtn).find((b) => b.text() === 'Guardar')
    await saveBtn!.trigger('click')
    await dialog.vm.$nextTick()

    expect(dialog.emitted('save:event')).toBeFalsy()
  })
})
