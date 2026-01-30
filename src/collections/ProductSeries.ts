import type { CollectionConfig } from 'payload'
import {
  invalidateSeriesCacheHook,
  invalidateSeriesCacheOnDelete,
} from '@/hooks/cache-invalidation'

export const ProductSeries: CollectionConfig = {
  slug: 'product-series',
  labels: {
    singular: 'Product Series',
    plural: 'Product Series',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'productCount'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [invalidateSeriesCacheHook],
    afterDelete: [invalidateSeriesCacheOnDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Series Name',
      admin: {
        description: 'e.g., "Moxie", "Suono", "Trueno", "Platinum", "Value"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        { label: 'Premium', value: 'premium' },
        { label: 'Standard', value: 'standard' },
        { label: 'Value', value: 'value' },
      ],
      defaultValue: 'standard',
      admin: {
        position: 'sidebar',
        description: 'Product tier for pricing/quality positioning',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Series Description',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Series Logo',
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'series',
      admin: {
        description: 'Products in this series',
      },
    },
  ],
}
