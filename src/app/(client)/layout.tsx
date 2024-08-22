import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'


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
        <Script id="google-ima" src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></Script>
        <Script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></Script>
      </body>
    </html>
  )
}
