'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Building, Calculator, Wrench, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  const shouldShowExpanded = !isCollapsed || isHovered

  const navigation = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Corretores', href: '/corretores', icon: 'users' },
    { name: 'Terceiros', href: '/terceiros', icon: 'wrench' },
    { name: 'Imóveis', href: '/imoveis', icon: 'building' },
    { name: 'Viabilidade', href: '/viabilidade', icon: 'calculator' },
  ]

  const renderIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (iconName) {
      case 'home':
        return <Home {...iconProps} />
      case 'users':
        return <Users {...iconProps} />
      case 'wrench':
        return <Wrench {...iconProps} />
      case 'building':
        return <Building {...iconProps} />
      case 'calculator':
        return <Calculator {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div 
      className={`hidden md:flex ${shouldShowExpanded ? 'w-64' : 'w-20'} bg-white border-r border-slate-200/60 transition-all duration-200 ease-out flex-col`}
      onMouseLeave={() => setIsHovered(false)}
    >

        {/* Navigation */}
        <nav 
          className="flex-1 pt-8 pb-6 pl-4 pr-4"
          onMouseEnter={() => isCollapsed && setIsHovered(true)}
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center h-10 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-nav-active text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  } ${shouldShowExpanded ? 'pr-3' : 'w-10'}`}
                  title={isCollapsed && !isHovered ? item.name : undefined}
                >
                  <span className="w-10 h-10 flex items-center justify-center flex-shrink-0">{renderIcon(item.icon)}</span>
                  {shouldShowExpanded && <span className="ml-1">{item.name}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Collapse button - bottom of sidebar */}
        <div className="border-t border-slate-100 py-4 pl-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex justify-center items-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all duration-150"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
      </div>
  )
}