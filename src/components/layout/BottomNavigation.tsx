'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Settings } from 'lucide-react'

export default function BottomNavigation() {
  const pathname = usePathname()

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
      name: 'Config', 
      href: '/config', 
      icon: Settings,
      activeIcon: Settings
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60 z-50">
      {/* Safe area padding for mobile devices */}
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = isActive ? item.activeIcon : item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-150 ${
                isActive ? 'text-nav-active' : 'text-slate-400'
              }`}
            >
              <IconComponent className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              {isActive && (
                <span className="text-xs font-medium tracking-tight">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}