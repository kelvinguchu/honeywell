import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import {
  invalidateProductCacheHook,
  invalidateProductCacheOnDelete,
} from '@/hooks/cache-invalidation'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'series', 'status', 'basePrice'],
    group: 'Catalogue',
    listSearchableFields: ['name', 'eanCode', 'hsnCode', 'shortDescription'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 300,
      },
    },
    maxPerDoc: 25,
  },
  fields: [
    // ─────────────────────────────────────────────────────────────────
    // Basic Information
    // ─────────────────────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  index: true,
                  label: 'Product Name',
                  admin: {
                    width: '70%',
                    description: 'e.g., "Suono P10 Bluetooth Headphones"',
                  },
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'active',
                  options: [
                    { label: 'New', value: 'new' },
                    { label: 'Active', value: 'active' },
                    { label: 'Discontinued', value: 'discontinued' },
                    { label: 'Coming Soon', value: 'coming-soon' },
                  ],
                  admin: {
                    width: '30%',
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Short Description',
              admin: {
                description: 'Brief summary for product cards (max 160 chars)',
              },
              maxLength: 160,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Full Description',
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Product Codes & Classification
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Codes & Classification',
          fields: [
            {
              name: 'hsnCode',
              type: 'text',
              label: 'HSN Code',
              admin: {
                description: 'Harmonized System Nomenclature code for tax (e.g., 85183000)',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  label: 'Category',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'series',
                  type: 'relationship',
                  relationTo: 'product-series',
                  label: 'Product Series',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Features & Specifications
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Features',
          fields: [
            {
              name: 'features',
              type: 'array',
              label: 'Key Features',
              labels: {
                singular: 'Feature',
                plural: 'Features',
              },
              admin: {
                description: 'List of product features/benefits',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                  label: 'Feature',
                },
              ],
            },
            {
              name: 'specifications',
              type: 'array',
              label: 'Technical Specifications',
              labels: {
                singular: 'Specification',
                plural: 'Specifications',
              },
              admin: {
                description: 'Technical specs (e.g., "Battery Life: 15 hours")',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Specification',
                      admin: {
                        width: '40%',
                        placeholder: 'e.g., Battery Life',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      label: 'Value',
                      admin: {
                        width: '60%',
                        placeholder: 'e.g., 15 hours',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Variants (Color options with individual pricing)
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Variants',
          fields: [
            {
              name: 'basePrice',
              type: 'number',
              required: true,
              label: 'Base Price',
              min: 0,
              admin: {
                description: 'Default price in local currency (can be overridden per variant)',
              },
            },
            {
              name: 'variants',
              type: 'array',
              label: 'Product Variants',
              labels: {
                singular: 'Variant',
                plural: 'Variants',
              },
              admin: {
                description: 'Different color/style options for this product',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'color',
                      type: 'text',
                      required: true,
                      label: 'Color',
                      admin: {
                        width: '30%',
                        placeholder: 'e.g., Silver, Gold, Rose Gold',
                      },
                    },
                    {
                      name: 'colorHex',
                      type: 'text',
                      label: 'Color Code',
                      admin: {
                        width: '20%',
                        placeholder: '#C0C0C0',
                        description: 'Hex color for UI display',
                      },
                    },
                    {
                      name: 'eanCode',
                      type: 'text',
                      required: true,
                      label: 'EAN Code',
                      admin: {
                        width: '25%',
                        description: 'Barcode',
                      },
                    },
                    {
                      name: 'variantPartCode',
                      type: 'text',
                      label: 'Part Code',
                      admin: {
                        width: '25%',
                        description: 'SKU (e.g., HC000004/AUD/HP/P10/SLV)',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Price Override',
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Leave empty to use base price',
                      },
                    },
                    {
                      name: 'stock',
                      type: 'number',
                      label: 'Stock Quantity',
                      min: 0,
                      defaultValue: 0,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'available',
                      type: 'checkbox',
                      label: 'Available',
                      defaultValue: true,
                      admin: {
                        width: '34%',
                      },
                    },
                  ],
                },
                {
                  name: 'images',
                  type: 'array',
                  label: 'Variant Images',
                  maxRows: 10,
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Media
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Media',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
              admin: {
                description: 'Main product image shown in listings',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Product Gallery',
              maxRows: 20,
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
                },
              ],
            },
            {
              name: 'packagingImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Packaging Image',
              admin: {
                description: 'Image of product packaging/box',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────
    // Sidebar Fields
    // ─────────────────────────────────────────────────────────────────
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: {
        update: () => false,
      },
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated)',
        readOnly: true,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in featured sections',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Auto-generate slug from name and prevent manual overrides
        if ((operation === 'create' || operation === 'update') && data?.name) {
          data.slug = slugify(data.name, {
            lower: true,
            strict: true,
            trim: true,
          })
        }
        return data
      },
    ],
    afterChange: [invalidateProductCacheHook],
    afterDelete: [invalidateProductCacheOnDelete],
  },
}
