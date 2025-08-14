'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: 'home' },
  ]

  const renderIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (iconName) {
      case 'home':
        return <Home {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div className={`hidden md:flex fixed inset-y-0 left-0 ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200/60 z-40 transition-all duration-200 ease-out flex-col`}>
        
        {/* Logo */}
        <div className={`flex items-center py-8 ${isCollapsed ? 'justify-center px-4' : 'px-6'}`}>
          <div className={`w-8 h-8 text-slate-900 relative ${isCollapsed ? '' : 'mr-3'}`}>
            <Image 
              src="/new-logo.svg" 
              alt="Alvite Logo" 
              fill
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-medium text-slate-900 tracking-tight">Alvite</span>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={isCollapsed ? '' : 'mr-3'}>{renderIcon(item.icon)}</span>
                  {!isCollapsed && item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Collapse button - bottom of sidebar */}
        <div className={`border-t border-slate-100 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex ${isCollapsed ? 'justify-center w-full px-2' : 'px-3 w-full justify-start'} py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-150`}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <span className={isCollapsed ? '' : 'mr-3'}>
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </span>
            {!isCollapsed && 'Recolher'}
          </button>
        </div>
      </div>
  )
}