import React from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  action?: React.ReactNode
}

export function Heading({ children, className, as: Tag = 'h2', action }: Readonly<HeadingProps>) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-12">
      <div className="border-l-4 md:border-l-8 border-primary pl-4 md:pl-6 py-1">
        <Tag
          className={cn(
            'text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none',
            Tag === 'h1' && 'md:text-5xl',
            className,
          )}
        >
          {children}
        </Tag>
      </div>
      {action}
    </div>
  )
}
