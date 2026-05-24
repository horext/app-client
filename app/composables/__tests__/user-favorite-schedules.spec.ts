import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '~/interfaces/schedule'

import { useUserFavoriteSchedules } from '../user-favorite-schedules'

const mockFavoritesSchedules = ref<IScheduleGenerate[]>([])

const mockAddFavorite = vi.fn()
const mockRemoveFavorite = vi.fn()
const mockSaveFavorites = vi.fn()
const mockGetFavoriteSchedules = vi.fn()

mockNuxtImport('useUserFavoritesStore', () =>
  vi.fn(() => ({
    favoritesSchedules: mockFavoritesSchedules,
  })),
)

mockNuxtImport('useFavoritesSchedulesService', () =>
  vi.fn(() => ({
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    saveFavorites: mockSaveFavorites,
    getFavoriteSchedules: mockGetFavoriteSchedules,
  })),
)

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: vi.fn((store) => store),
  }
})

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
    vi.clearAllMocks()
    mockFavoritesSchedules.value = []
  })

  it('returns favoritesSchedules, saveNewFavoriteSchedule, deleteFavoriteScheduleById, updateFavoritesSchedules, fetchFavoritesSchedules', () => {
    const result = useUserFavoriteSchedules()
    expect(result.favoritesSchedules).toBeDefined()
    expect(result.saveNewFavoriteSchedule).toBeTypeOf('function')
    expect(result.deleteFavoriteScheduleById).toBeTypeOf('function')
    expect(result.updateFavoritesSchedules).toBeTypeOf('function')
    expect(result.fetchFavoritesSchedules).toBeTypeOf('function')
  })

  it('saveNewFavoriteSchedule adds a favorite and pushes to store', async () => {
    const fav = makeFavorite()
    mockAddFavorite.mockResolvedValue(fav)
    const { saveNewFavoriteSchedule } = useUserFavoriteSchedules()
    await saveNewFavoriteSchedule(fav as IBaseScheduleGenerate)
    expect(mockAddFavorite).toHaveBeenCalledWith(fav)
    expect(mockFavoritesSchedules.value).toContainEqual(fav)
  })

  it('deleteFavoriteScheduleById removes from service and store', async () => {
    const fav = makeFavorite()
    mockFavoritesSchedules.value = [fav]
    mockRemoveFavorite.mockResolvedValue(undefined)
    const { deleteFavoriteScheduleById } = useUserFavoriteSchedules()
    await deleteFavoriteScheduleById(fav.id)
    expect(mockRemoveFavorite).toHaveBeenCalledWith(fav.id)
    expect(mockFavoritesSchedules.value).not.toContainEqual(fav)
  })

  it('updateFavoritesSchedules saves and appends results to store', async () => {
    const favs = [makeFavorite()]
    mockSaveFavorites.mockResolvedValue(favs)
    const { updateFavoritesSchedules } = useUserFavoriteSchedules()
    await updateFavoritesSchedules(favs)
    expect(mockSaveFavorites).toHaveBeenCalledWith(favs)
    expect(mockFavoritesSchedules.value).toEqual(favs)
  })

  it('fetchFavoritesSchedules loads all favorites into store', async () => {
    const favs = [makeFavorite()]
    mockGetFavoriteSchedules.mockResolvedValue(favs)
    const { fetchFavoritesSchedules } = useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(mockFavoritesSchedules.value).toEqual(favs)
  })

  it('fetchFavoritesSchedules sets empty array when service returns null', async () => {
    mockGetFavoriteSchedules.mockResolvedValue(null)
    const { fetchFavoritesSchedules } = useUserFavoriteSchedules()
    await fetchFavoritesSchedules()
    expect(mockFavoritesSchedules.value).toEqual([])
  })
})
