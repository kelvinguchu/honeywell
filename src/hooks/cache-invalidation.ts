import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import {
  invalidateProductCache,
  invalidateCategoryCache,
  invalidateSeriesCache,
  invalidateSearchCache,
  invalidateHeaderCache,
} from '@/lib/redis'

// Product cache invalidation
export const invalidateProductCacheHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  // Invalidate relevant caches
  await Promise.all([invalidateProductCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log(`[Cache] Invalidated product cache after ${operation}`)

  return doc
}

export const invalidateProductCacheOnDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await Promise.all([invalidateProductCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log('[Cache] Invalidated product cache after delete')

  return doc
}

// Category cache invalidation
export const invalidateCategoryCacheHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  await Promise.all([invalidateCategoryCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log(`[Cache] Invalidated category cache after ${operation}`)

  return doc
}

export const invalidateCategoryCacheOnDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await Promise.all([invalidateCategoryCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log('[Cache] Invalidated category cache after delete')

  return doc
}

// Series cache invalidation
export const invalidateSeriesCacheHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  await Promise.all([invalidateSeriesCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log(`[Cache] Invalidated series cache after ${operation}`)

  return doc
}

export const invalidateSeriesCacheOnDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await Promise.all([invalidateSeriesCache(), invalidateSearchCache(), invalidateHeaderCache()])

  console.log('[Cache] Invalidated series cache after delete')

  return doc
}
