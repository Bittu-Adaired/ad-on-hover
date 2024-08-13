import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Garsėja teksto įgarsinimo grotuvas',
  description: 'Įgarsink tekstą lietuviškai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script id="google-ima" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></Script>
      <body>
        <main className={inter.className}>{children}</main>
      </body>
    </html>
  )
}
