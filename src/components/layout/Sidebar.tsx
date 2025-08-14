'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  const shouldShowExpanded = !isCollapsed || isHovered

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
    <div 
      className={`hidden md:flex fixed inset-y-0 left-0 ${shouldShowExpanded ? 'w-64' : 'w-20'} bg-white border-r border-slate-200/60 z-40 transition-all duration-200 ease-out flex-col`}
      onMouseLeave={() => setIsHovered(false)}
    >
        
        {/* Logo */}
        <div 
          className={`flex items-center py-8 ${shouldShowExpanded ? 'px-6' : 'justify-center px-4'}`}
          onMouseEnter={() => isCollapsed && setIsHovered(true)}
        >
          <div className={`w-8 h-8 text-slate-900 relative ${shouldShowExpanded ? 'mr-3' : ''}`}>
            <Image 
              src="/new-logo.svg" 
              alt="Alvite Logo" 
              fill
              className="object-contain"
            />
          </div>
          {shouldShowExpanded && (
            <span className="text-lg font-medium text-slate-900 tracking-tight">Alvite</span>
          )}
        </div>

        {/* Navigation */}
        <nav 
          className={`flex-1 py-6 ${shouldShowExpanded ? 'px-4' : 'px-2'}`}
          onMouseEnter={() => isCollapsed && setIsHovered(true)}
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${shouldShowExpanded ? 'px-3 py-2 rounded-md' : 'justify-center w-10 h-10 rounded-lg mx-auto'} text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-nav-active text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={!shouldShowExpanded ? item.name : undefined}
                >
                  <span className={shouldShowExpanded ? 'mr-3' : ''}>{renderIcon(item.icon)}</span>
                  {shouldShowExpanded && item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Collapse button - bottom of sidebar */}
        <div className={`border-t border-slate-100 ${shouldShowExpanded ? 'p-4' : 'p-2'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex ${shouldShowExpanded ? 'justify-start' : 'justify-center'} w-full px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all duration-150`}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
      </div>
  )
}