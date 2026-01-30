import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'mediaType', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'product',
        width: 800,
        height: 800,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1200,
        height: 800,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Describe the image for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'mediaType',
      type: 'select',
      label: 'Media Type',
      defaultValue: 'product',
      options: [
        { label: 'Product Image', value: 'product' },
        { label: 'Packaging', value: 'packaging' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Category', value: 'category' },
        { label: 'Banner', value: 'banner' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
