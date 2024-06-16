import { redirect } from 'next/navigation'
import { isAuthenticated } from '../auth/auth'
import { Header } from '@/components/header'

export default function AppLayout({
  children,
  teste,
}: Readonly<{
  children: React.ReactNode
  teste?: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {teste}
    </>
  )
}
