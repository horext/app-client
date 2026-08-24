import { describe, expectTypeOf, it } from 'vitest'
import type { IActivity } from '#shared/domain/types/event'
import type { IProfile } from '#shared/domain/types/profile'
import type {
  bulkCollectionResources,
  collectionResources,
  individualResources,
  regularCollectionResources,
  SyncResource,
  type BulkCollectionResource,
  type CollectionResource,
  type IndividualResource,
  type RegularCollectionResource,
} from '#shared/domain/synchronization'
import type { SyncBodyMap } from '~~/modules/synchronization/runtime/contracts'

type IsAssignable<Source, Target> = Source extends Target ? true : false

describe('synchronization contracts', () => {
  it('maps each synchronization resource to its own payload type', () => {
    expectTypeOf<SyncBodyMap<SyncResource.PROFILE>>().toMatchTypeOf<IProfile>()
    expectTypeOf<
      SyncBodyMap<SyncResource.ACTIVITIES>
    >().toMatchTypeOf<IActivity>()
    expectTypeOf<
      IsAssignable<IActivity, SyncBodyMap<SyncResource.PROFILE>>
    >().toEqualTypeOf<false>()
    expectTypeOf<
      IsAssignable<IProfile, SyncBodyMap<SyncResource.ACTIVITIES>>
    >().toEqualTypeOf<false>()
  })

  it('keeps individual and collection resources as disjoint shared types', () => {
    expectTypeOf<
      (typeof individualResources)[number]
    >().toEqualTypeOf<IndividualResource>()
    expectTypeOf<
      (typeof collectionResources)[number]
    >().toEqualTypeOf<CollectionResource>()
    expectTypeOf<
      IsAssignable<IndividualResource, CollectionResource>
    >().toEqualTypeOf<false>()
    expectTypeOf<
      IsAssignable<CollectionResource, IndividualResource>
    >().toEqualTypeOf<false>()
    expectTypeOf<
      IsAssignable<SyncResource, IndividualResource | CollectionResource>
    >().toEqualTypeOf<true>()
    expectTypeOf<
      IsAssignable<IndividualResource | CollectionResource, SyncResource>
    >().toEqualTypeOf<true>()
  })

  it('separates regular and bulk collection resources', () => {
    expectTypeOf<
      (typeof regularCollectionResources)[number]
    >().toEqualTypeOf<RegularCollectionResource>()
    expectTypeOf<
      (typeof bulkCollectionResources)[number]
    >().toEqualTypeOf<BulkCollectionResource>()
    expectTypeOf<
      IsAssignable<BulkCollectionResource, CollectionResource>
    >().toEqualTypeOf<true>()
    expectTypeOf<
      IsAssignable<RegularCollectionResource, BulkCollectionResource>
    >().toEqualTypeOf<false>()
  })
})
