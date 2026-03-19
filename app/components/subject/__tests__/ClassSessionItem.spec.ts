import { expect, describe, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ClassSessionItem from '~/components/subject/ClassSessionItem.vue'
import type { ISession } from '~/interfaces/subject'

describe('ClassSessionItem', () => {
  it('renders the correct data', () => {
    const session: ISession = {
      day: 1,
      type: {
        code: 'Lecture',
        id: 1,
      },
      teacher: {
        fullName: 'John Doe',
        id: 2,
      },
      classroom: {
        code: 'A101',
        id: 3,
      },
      startTime: '09:00',
      endTime: '10:30',
      id: 0,
      schedule: {
        id: 0,
      },
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
