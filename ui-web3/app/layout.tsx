import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HederaAgentsHub',
  description: 'Create AI agents on Hedera blockchain',
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
