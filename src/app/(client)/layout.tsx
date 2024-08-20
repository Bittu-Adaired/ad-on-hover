import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Greitai ir paprastai įgarsink tekstą lietuviškai',
  description: 'Įgarsink tekstą lietuviškai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className={inter.className}>{children}</main>
      </body>
    </html>
  )
}
