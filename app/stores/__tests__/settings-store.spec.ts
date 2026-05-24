import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useSettingsStore } from '~/stores/settings'

// Mock the useTheme composable from Vuetify
vi.mock('vuetify', () => ({
  useTheme: vi.fn(() => ({
    global: {
      name: ref('light'),
    },
    change: vi.fn(),
  })),
}))

// Mock useLocalStorage composable
vi.mock('~/composables/local-storage', () => ({
  useLocalStorage: vi.fn(() => ({
    getItem: vi.fn().mockResolvedValue(false),
    setItem: vi.fn(),
  })),
}))

describe('useSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('darkMode defaults to false when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      global: { name: ref('light') },
      change: vi.fn(),
    } as never)
    const store = useSettingsStore()
    expect(store.darkMode).toBe(false)
  })

  it('darkMode is true when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      global: { name: ref('dark') },
      change: vi.fn(),
    } as never)
    const store = useSettingsStore()
    expect(store.darkMode).toBe(true)
  })

  it('toggleDarkMode calls theme.change with dark when darkMode is false', () => {
    const mockChange = vi.fn()
    vi.mocked(useTheme).mockReturnValue({
      global: { name: ref('light') },
      change: mockChange,
    } as never)
    const store = useSettingsStore()
    store.toggleDarkMode()
    expect(mockChange).toHaveBeenCalledWith('dark')
  })

  it('toggleDarkMode calls theme.change with light when darkMode is true', () => {
    const mockChange = vi.fn()
    vi.mocked(useTheme).mockReturnValue({
      global: { name: ref('dark') },
      change: mockChange,
    } as never)
    const store = useSettingsStore()
    store.toggleDarkMode()
    expect(mockChange).toHaveBeenCalledWith('light')
  })
})
