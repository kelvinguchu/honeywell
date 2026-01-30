import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Media } from '@/payload-types'

export type CategoryWithImage = Category & {
  displayImage?: Media | string | null
}

export async function getCategoriesWithImages(): Promise<CategoryWithImage[]> {
  const payload = await getPayload({ config })

  // 1. Fetch all categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    pagination: false,
    sort: 'sortOrder',
    depth: 1,
  })

  // 2. For each category, fetch the first product to get its image
  const categoriesWithImages = await Promise.all(
    categories.map(async (category) => {
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          category: {
            equals: category.id,
          },
        },
        limit: 10,
        select: {
          featuredImage: true,
        },
        depth: 1,
      })

      let displayImage: Media | string | null = null

      // Find the first product that has a featuredImage
      const productWithImage = products.find((p) => p.featuredImage)

      if (productWithImage?.featuredImage) {
        displayImage = productWithImage.featuredImage
      } else if (category.image) {
        // Fallback to category image if no product image found
        displayImage = category.image
      }

      return {
        ...category,
        displayImage,
      }
    }),
  )

  return categoriesWithImages
}
