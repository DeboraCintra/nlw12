import type { Metadata } from 'next'
import { Roboto_Flex as Roboto , Bai_Jamjuree as BaiJamjuree } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'] , variable: '--font-roboto'})
const baiJamjuree = BaiJamjuree({ subsets: ['latin'], weight: '700', variable: '--font-bai-jamjuree' })

export const metadata: Metadata = {
  title: 'NLW Spacetime',
  description: 'Uma capsula do tempo construida com React, Next.js, TailwindCSS e TypeSCript',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={ `${roboto.variable} ${baiJamjuree.variable} font-sans bg-gray-900 text-gray-100` }>{children}</body>
    </html>
  )
}
