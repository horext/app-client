import { expect, describe, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClassSessionItem from '@/components/subject/ClassSessionItem.vue'

describe('ClassSessionItem', () => {
  it('renders the correct data', () => {
    const session = {
      day: 1,
      type: {
        code: 'Lecture',
      },
      teacher: {
        fullName: 'John Doe',
      },
      classroom: {
        code: 'A101',
      },
      startTime: '09:00',
      endTime: '10:30',
    }

    const wrapper = shallowMount(ClassSessionItem, {
      props: {
        session,
      },
    })

    const wrappers = wrapper.findAll('.text-left')
    expect(wrappers.at(0)?.text()).toContain('LU')
    expect(wrappers.at(1)?.text()).toContain('09:00 - 10:30')
    expect(wrappers.at(2)?.text()).toContain('John Doe')
    expect(wrappers.at(3)?.text()).toContain('Lecture')
    expect(wrappers.at(4)?.text()).toContain('A101')
  })

})