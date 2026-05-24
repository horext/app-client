import { describe, it, expect } from 'vitest'
import {
  HOME_ROUTE,
  GENERATOR_ROUTE,
  FAVORITES_ROUTE,
  SUBJECTS_ROUTE,
  EVENTS_ROUTE,
  SETTINGS_ROUTE,
} from '../app-routes'

describe('HOME_ROUTE', () => {
  it('has title "Inicio"', () => {
    expect(HOME_ROUTE.title).toBe('Inicio')
  })

  it('navigates to "/"', () => {
    expect(HOME_ROUTE.to).toBe('/')
  })

  it('has an icon', () => {
    expect(typeof HOME_ROUTE.icon).toBe('string')
    expect(HOME_ROUTE.icon.length).toBeGreaterThan(0)
  })
})

describe('GENERATOR_ROUTE', () => {
  it('navigates to "/generator"', () => {
    expect(GENERATOR_ROUTE.to).toBe('/generator')
  })

  it('has a shortTitle', () => {
    expect(typeof GENERATOR_ROUTE.shortTitle).toBe('string')
  })

  it('has a denseTitle', () => {
    expect(typeof GENERATOR_ROUTE.denseTitle).toBe('string')
  })
})

describe('FAVORITES_ROUTE', () => {
  it('navigates to "/generator/favorites"', () => {
    expect(FAVORITES_ROUTE.to).toBe('/generator/favorites')
  })

  it('has a shortTitle', () => {
    expect(typeof FAVORITES_ROUTE.shortTitle).toBe('string')
  })
})

describe('SUBJECTS_ROUTE', () => {
  it('navigates to "/generator/subjects"', () => {
    expect(SUBJECTS_ROUTE.to).toBe('/generator/subjects')
  })

  it('has a shortTitle', () => {
    expect(typeof SUBJECTS_ROUTE.shortTitle).toBe('string')
  })
})

describe('EVENTS_ROUTE', () => {
  it('navigates to "/generator/events"', () => {
    expect(EVENTS_ROUTE.to).toBe('/generator/events')
  })

  it('has a shortTitle', () => {
    expect(typeof EVENTS_ROUTE.shortTitle).toBe('string')
  })
})

describe('SETTINGS_ROUTE', () => {
  it('navigates to "/generator/settings"', () => {
    expect(SETTINGS_ROUTE.to).toBe('/generator/settings')
  })

  it('has a title', () => {
    expect(typeof SETTINGS_ROUTE.title).toBe('string')
  })
})
