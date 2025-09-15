import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PM Automation Dashboard',
  description: 'Lightweight agent ecosystem for project management automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}