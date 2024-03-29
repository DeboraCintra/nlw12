import { Copyright } from '@/components/Copyright'
import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { SingIn } from '@/components/SingIn'
import type { Metadata } from 'next'
import { Roboto_Flex as Roboto , Bai_Jamjuree as BaiJamjuree } from 'next/font/google'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'] , variable: '--font-roboto'})
const baiJamjuree = BaiJamjuree({ subsets: ['latin'], weight: '700', variable: '--font-bai-jamjuree' })

export const metadata: Metadata = {
  title: 'NLW Spacetime',
  description: 'Uma capsula do tempo construida com React, Next.js, TailwindCSS e TypeSCript',
}

export default function RootLayout({children,}: {  children: ReactNode}) {
  const isAuthenticated  = cookies().has('token')
  return (
    <html lang="en">
      <body className={ `${roboto.variable} ${baiJamjuree.variable} font-sans bg-gray-900 text-gray-100` }>
      <main className="grid grid-cols-2 min-h-screen">
      {/*left*/}
      <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
        {/*Blur*/}
        <div className="absolute right-0 top-1/2 h-[288px] w-[526px] bg-purple-700 opacity-50 -translate-y-1/2  translate-x-1/2  rounded-full blur-full"/>
        {/*Stripes*/}
        <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes"/>
        {/*sing in*/}
        {isAuthenticated ? <Profile/> : <SingIn/>}

        {/*hero*/}
        <Hero/>
        
        {/*Copyright*/}
        <Copyright/>

      </div>
      {/*Right*/}
      <div className="flex overflow-y-scroll max-h-screen flex-col  bg-[url(../assets/bg-stars.svg)] bg-cover">
      {children}
      </div>
    </main>
      
      </body>

    </html>
  )
}
