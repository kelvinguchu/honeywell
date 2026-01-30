import type { CollectionConfig } from 'payload'
import {
  invalidateCategoryCacheHook,
  invalidateCategoryCacheOnDelete,
} from '@/hooks/cache-invalidation'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'productCount'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [invalidateCategoryCacheHook],
    afterDelete: [invalidateCategoryCacheOnDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (e.g., "bluetooth-headphones")',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent Category',
      admin: {
        position: 'sidebar',
        description: 'Leave empty for top-level categories',
      },
      filterOptions: ({ id }) => {
        // Prevent circular references
        if (id) {
          return { id: { not_equals: id } }
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Category Image',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Class',
      admin: {
        description: 'CSS icon class or emoji for quick identification',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Category',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage or in prominent locations',
      },
    },
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      on: 'category',
      admin: {
        description: 'Products in this category',
      },
    },
  ],
}
