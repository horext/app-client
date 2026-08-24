import { useOrm } from '../database/client'
import { DrizzleSchedulesRepository } from '../infrastructure/database/d1/repositories/drizzle-schedules.repository'
import { DrizzleGenerationsRepository } from '../infrastructure/database/d1/repositories/drizzle-generations.repository'
import { DrizzleFavoritesRepository } from '../infrastructure/database/d1/repositories/drizzle-favorites.repository'
import type { H3Event } from 'h3'

export const schedulesRepository = (event: H3Event) =>
  new DrizzleSchedulesRepository(useOrm(event))

export const generationsRepository = (event: H3Event) =>
  new DrizzleGenerationsRepository(useOrm(event))

export const favoritesRepository = (event: H3Event) =>
  new DrizzleFavoritesRepository(useOrm(event))
