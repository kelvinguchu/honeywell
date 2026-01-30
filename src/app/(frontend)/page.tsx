import React from 'react'
import { Hero } from '@/components/home/Hero'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { NewArrivals } from '@/components/home/NewArrivals'
import { SeriesSection } from '@/components/home/SeriesSection'
import { FAQ } from '@/components/home/FAQ'

export default async function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <NewArrivals />
      <SeriesSection />
      <FAQ />
    </>
  )
}
