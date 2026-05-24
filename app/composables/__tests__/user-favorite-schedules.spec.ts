import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'
import { useUserFavoritesStore } from '~/stores/user-favorites'

import { useUserFavoriteSchedules } from '../user-favorite-schedules'

const mockAddFavorite = vi.fn()
const mockRemoveFavorite = vi.fn()
const mockSaveFavorites = vi.fn()
const mockGetFavoriteSchedules = vi.fn()

mockNuxtImport('useFavoritesSchedulesService', () =>
  vi.fn(() => ({
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    saveFavorites: mockSaveFavorites,
    getFavoriteSchedules: mockGetFavoriteSchedules,
  })),
)

function makeFavorite(id = crypto.randomUUID()): IScheduleGenerate {
  return {
    id,
    events: [],
    scheduleSubjectKey: '',
    schedulesSubject: [],
    crossings: 0,
  }
}

describe('useUserFavoriteSchedules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('returns favoritesSchedules, saveNewFavoriteSchedule, deleteFavoriteScheduleById, updateFavoritesSchedules, fetchFavoritesSchedules', () => {
    const result = useUserFavoriteSchedules()
    expect(result.favoritesSchedules).toBeDefined()
    expect(result.saveNewFavoriteSchedule).toBeTypeOf('function')
    expect(result.deleteFavoriteScheduleById).toBeTypeOf('function')
    expect(result.fetchFavoritesSchedules).toBeTypeOf('function')
  })

  it('saveNewFavoriteSchedule adds a favorite and pushes to store', async () => {
    const fav = makeFavorite()
    mockAddFavorite.mockResolvedValue(fav)
    const { saveNewFavoriteSchedule, favoritesSchedules } = useUserFavoriteSchedules()
    await saveNewFavoriteSchedule(fav as IBaseScheduleGenerate)
    expect(mockAddFavorite).toHaveBeenCalledWith(fav)
    expect(favoritesSchedules.value).toContainEqual(fav)
  })

  it('deleteFavoriteScheduleById removes from service and store', async () => {
    const fav = makeFavorite()
    const store = useUserFavoritesStore()
    store.favoritesSchedules = [fav]
    mockRemoveFavorite.mockResolvedValue(undefined)
    const { deleteFavoriteScheduleById, favoritesSchedules } = useUserFavoriteSchedules()
    await deleteFavoriteScheduleById(fav.id)
    expect(mockRemoveFavorite).toHaveBeenCalledWith(fav.id)
    expect(favoritesSchedules.value).not.toContainEqual(fav)
  })

  it('fetchFavoritesSchedules loads all favorites into store', async () => {
    const favs = [makeFavorite()]
    mockGetFavoriteSchedules.mockResolvedValue(favs)
    const { fetchFavoritesSchedules, favoritesSchedules } = useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(favoritesSchedules.value).toEqual(favs)
  })

  it('fetchFavoritesSchedules sets empty array when service returns null', async () => {
    mockGetFavoriteSchedules.mockResolvedValue(null)
    const { fetchFavoritesSchedules, favoritesSchedules } = useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(favoritesSchedules.value).toEqual([])
  })
})
