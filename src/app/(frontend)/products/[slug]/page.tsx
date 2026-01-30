import React from 'react'
import { getProductBySlug } from '@/lib/products'
import { notFound } from 'next/navigation'
import { ProductPageClient } from '@/components/product/ProductPageClient'
import { ProductSpecifications } from '@/components/product/ProductSpecifications'
import Link from 'next/link'
import { HiOutlineArrowLeft } from 'react-icons/hi2'
import type { Media } from '@/payload-types'

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: 'Not Found' }

  return {
    title: `${product.name} | Honeywell`,
    description: product.shortDescription || `Buy ${product.name} from Honeywell`,
  }
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: Readonly<ProductPageProps>) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return notFound()
  }

  const hasSpecifications =
    (product.specifications && product.specifications.length > 0) || product.hsnCode

  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <HiOutlineArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-sm font-bold tracking-wide">Back to Products</span>
      </Link>

      {/* Main Product Section - Client Component for interactivity */}
      <ProductPageClient product={product} />

      {/* Specifications Section */}
      {hasSpecifications && (
        <div className="border-t border-border pt-8 md:pt-12">
          <ProductSpecifications
            specifications={product.specifications}
            hsnCode={product.hsnCode}
          />
        </div>
      )}

      {/* Packaging Image */}
      {product.packagingImage && typeof product.packagingImage !== 'number' && (
        <div className="border-t border-border pt-8 md:pt-12 mt-8 md:mt-12">
          <h3 className="font-bold uppercase text-sm tracking-wider mb-4 border-l-4 border-primary pl-3">
            Packaging
          </h3>
          <div className="relative aspect-video max-w-2xl bg-muted border border-border">
            <img
              src={(product.packagingImage as Media).url || ''}
              alt={`${product.name} packaging`}
              className="object-contain w-full h-full p-4"
            />
          </div>
        </div>
      )}
    </div>
  )
}
