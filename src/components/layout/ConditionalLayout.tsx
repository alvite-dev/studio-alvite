'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import TopHeader from './TopHeader'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    // Layout da página de login (sem sidebar/bottom nav)
    return <>{children}</>
  }

  // Layout padrão do dashboard
  return (
    <>
      {/* Top Header */}
      <TopHeader />
      
      <div className="flex h-screen pt-14">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto md:overflow-auto pb-16 md:pb-0">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </div>
    </>
  )
}