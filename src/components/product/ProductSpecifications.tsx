import React from 'react'
import type { Product } from '@/payload-types'

interface ProductSpecificationsProps {
  specifications: Product['specifications']
  hsnCode?: string | null
}

export function ProductSpecifications({
  specifications,
  hsnCode,
}: Readonly<ProductSpecificationsProps>) {
  if ((!specifications || specifications.length === 0) && !hsnCode) {
    return null
  }

  return (
    <div>
      <h3 className="font-bold uppercase text-sm tracking-wider mb-4 border-l-4 border-primary pl-3">
        Technical Specifications
      </h3>
      <div className="border border-border">
        <table className="w-full text-sm">
          <tbody>
            {specifications?.map((spec, index) => (
              <tr
                key={spec.id || `${spec.label}-${spec.value}`}
                className={index % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'}
              >
                <td className="px-4 py-3 font-medium text-muted-foreground w-1/3 border-r border-border">
                  {spec.label}
                </td>
                <td className="px-4 py-3">{spec.value}</td>
              </tr>
            ))}
            {hsnCode && (
              <tr
                className={
                  (specifications?.length || 0) % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'
                }
              >
                <td className="px-4 py-3 font-medium text-muted-foreground w-1/3 border-r border-border">
                  HSN Code
                </td>
                <td className="px-4 py-3 font-mono text-xs">{hsnCode}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
