import React from 'react'

type IconProps = {
  className?: string
}

export default function Icon({ className }: IconProps) {
  return (
    <img
      src="/favicon.png"
      alt="Honeywell"
      className={className}
      style={{ display: 'block', height: '20px', width: '20px' }}
    />
  )
}
