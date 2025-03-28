import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

// Import components
import Navbar from '../components/Navbar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </ClerkProvider>
  )
}
