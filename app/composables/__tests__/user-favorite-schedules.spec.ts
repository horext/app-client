import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '~/interfaces/schedule'
import { useUserFavoritesStore } from '~/stores/user-favorites'
import { makeUUID } from '~~/shared/domain/types/ids'
import { isProxy, reactive } from 'vue'
import { GeneratedSchedule } from '~~/shared/domain'
import type { GeneratedScheduleId } from '~~/shared/domain'

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

function makeFavorite(
  id: GeneratedScheduleId = makeUUID<GeneratedScheduleId>(),
): IGeneratedSchedule {
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
    const { saveNewFavoriteSchedule, favoritesSchedules } =
      useUserFavoriteSchedules()
    await saveNewFavoriteSchedule(fav as IBaseGeneratedSchedule)
    expect(mockAddFavorite).toHaveBeenCalledWith(expect.any(String), fav)
    expect(favoritesSchedules.value).toContainEqual(fav)
  })

  it('maps a reactive new favorite before domain entity creation', async () => {
    const favorite = makeFavorite()
    const { id: _id, ...newSchedule } = favorite
    const reactiveSchedule = reactive(newSchedule)
    mockAddFavorite.mockImplementation(async (_userId, input) => {
      expect(isProxy(input)).toBe(false)
      expect(() => GeneratedSchedule.create(input)).not.toThrow()
      return favorite
    })

    const { saveNewFavoriteSchedule } = useUserFavoriteSchedules()
    await expect(
      saveNewFavoriteSchedule(reactiveSchedule),
    ).resolves.toBeUndefined()
  })

  it('preserves the id of a reactive persisted favorite', async () => {
    const favorite = reactive(makeFavorite())
    mockAddFavorite.mockResolvedValue(favorite)

    const { saveNewFavoriteSchedule } = useUserFavoriteSchedules()
    await saveNewFavoriteSchedule(favorite)

    expect(mockAddFavorite.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({ id: favorite.id }),
    )
    expect(isProxy(mockAddFavorite.mock.calls[0]?.[1])).toBe(false)
  })

  it('deleteFavoriteScheduleById removes from service and store', async () => {
    const fav = makeFavorite()
    const store = useUserFavoritesStore()
    store.favoritesSchedules = [fav]
    mockRemoveFavorite.mockResolvedValue(undefined)
    const { deleteFavoriteScheduleById, favoritesSchedules } =
      useUserFavoriteSchedules()
    await deleteFavoriteScheduleById(fav.id)
    expect(mockRemoveFavorite).toHaveBeenCalledWith(expect.any(String), fav.id)
    expect(favoritesSchedules.value).not.toContainEqual(fav)
  })

  it('does not remove another favorite when the id is missing from the store', async () => {
    const first = makeFavorite()
    const missingId = makeFavorite()
    const store = useUserFavoritesStore()
    store.favoritesSchedules = [first]
    mockRemoveFavorite.mockResolvedValue(undefined)

    const { deleteFavoriteScheduleById } = useUserFavoriteSchedules()
    await deleteFavoriteScheduleById(missingId.id)

    expect(store.favoritesSchedules).toEqual([first])
  })

  it('fetchFavoritesSchedules loads all favorites into store', async () => {
    const favs = [makeFavorite()]
    mockGetFavoriteSchedules.mockResolvedValue(favs)
    const { fetchFavoritesSchedules, favoritesSchedules } =
      useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(favoritesSchedules.value).toEqual(favs)
  })

  it('fetchFavoritesSchedules sets empty array when service returns null', async () => {
    mockGetFavoriteSchedules.mockResolvedValue(null)
    const { fetchFavoritesSchedules, favoritesSchedules } =
      useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(favoritesSchedules.value).toEqual([])
  })
})
