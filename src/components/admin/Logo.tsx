import React from 'react'

type LogoProps = {
  className?: string
}

export default function Logo({ className }: Readonly<LogoProps>) {
  return (
    <img
      src="/logo.png"
      alt="Honeywell"
      className={className}
      style={{ display: 'block', width: 'auto' }}
    />
  )
}
