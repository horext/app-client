import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'
import { describe, expect, it } from 'vitest'
import SearchLocationPanel from '../SearchLocationPanel.vue'

const vuetify = createVuetify()

const specialities = [
  {
    id: 2,
    parentOrganizationUnit: { id: 1 },
    code: 'AI',
    name: 'Inteligencia Artificial',
    type: { id: 1, name: 'Especialidad' },
  },
]

const faculties = [
  {
    id: 1,
    parentOrganizationUnit: { id: 0 },
    code: 'FIIS',
    name: 'Facultad de Ingeniería',
    type: { id: 1, name: 'Facultad' },
  },
]

const studyPlans = [
  {
    id: 3,
    name: 'Malla 2026-1',
    code: '2026-1',
    fromDate: '2026-01-01',
    organizationUnit: { id: 2 },
  },
]

const mountPanel = (
  selectedSpecialityId: number | null,
  selectedStudyPlanId: number | null,
) =>
  mount(SearchLocationPanel, {
    props: {
      faculties,
      facultyId: 1,
      hasCustomContext: false,
      closeRequestId: 0,
      specialities,
      studyPlans,
      selectedSpecialityId,
      selectedStudyPlanId,
      loadingSpecialities: false,
      loadingStudyPlans: false,
    },
    global: { plugins: [vuetify] },
  })

describe('SubjectSearchLocationPanel', () => {
  it('shows the faculty-level summary when no speciality is selected', () => {
    const wrapper = mountPanel(null, null)

    expect(wrapper.text()).toContain('Buscando cursos en:')
    expect(wrapper.text()).toContain('toda la facultad')
  })

  it('derives the speciality and study-plan summary from its options', () => {
    const wrapper = mountPanel(2, 3)

    expect(wrapper.text()).toContain('Inteligencia Artificial · Malla 2026-1')
  })

  it('owns expansion state and closes after a new close request', async () => {
    const wrapper = mountPanel(2, null)
    const toggle = wrapper
      .findAllComponents(VBtn)
      .find((button) => button.text().includes('Cambiar dónde buscar'))

    await toggle?.trigger('click')
    expect(wrapper.text()).toContain('La facultad determina tu carga horaria')

    await wrapper.setProps({ closeRequestId: 1 })
    expect(wrapper.text()).not.toContain(
      'La facultad determina tu carga horaria',
    )
  })
})
