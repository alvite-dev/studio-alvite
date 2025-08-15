'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, MoreHorizontal } from 'lucide-react'
import MoreMenuSheet from '@/components/features/MoreMenuSheet'

export default function BottomNavigation() {
  const pathname = usePathname()
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      activeIcon: Home
    },
    { 
      name: 'Agenda', 
      href: '/agenda', 
      icon: Calendar,
      activeIcon: Calendar
    },
    { 
      name: 'Corretores', 
      href: '/corretores', 
      icon: Users,
      activeIcon: Users
    },
    { 
      name: 'More', 
      href: '#', 
      icon: MoreHorizontal,
      activeIcon: MoreHorizontal,
      isMoreButton: true
    },
  ]

  const handleMoreClick = () => {
    setShowMoreMenu(true)
  }

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60 z-50">
        {/* Safe area padding for mobile devices */}
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navigation.map((item) => {
            const isActive = pathname === item.href && !item.isMoreButton
            const IconComponent = isActive ? item.activeIcon : item.icon
            
            if (item.isMoreButton) {
              return (
                <button
                  key={item.name}
                  onClick={handleMoreClick}
                  className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-150 relative ${
                    showMoreMenu ? 'text-nav-active' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mb-1 transition-transform duration-150 ${
                    showMoreMenu ? 'rotate-180 scale-110' : ''
                  }`} />
                  <span className="text-xs font-medium tracking-tight opacity-100">
                    {item.name}
                  </span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-150 relative ${
                  isActive ? 'text-nav-active' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-1 transition-transform duration-150 ${
                  isActive ? 'fill-current scale-110' : ''
                }`} />
                <span className={`text-xs font-medium tracking-tight transition-all duration-150 ${
                  isActive ? 'opacity-100' : 'opacity-0 translate-y-1'
                }`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* More Menu Sheet */}
      <MoreMenuSheet 
        isOpen={showMoreMenu} 
        onClose={() => setShowMoreMenu(false)} 
      />
    </>
  )
}