'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileSpreadsheet, MessageCircle, Users, Calculator, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Planilha', href: '/planilha', icon: 'document' },
    { name: 'Viabilidade', href: '/viabilidade', icon: 'calculator' },
    { name: 'WhatsApp', href: '/whatsapp', icon: 'whatsapp' },
    { name: 'Corretores', href: '/corretores', icon: 'users' },
  ]

  const renderIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6" };
    
    switch (iconName) {
      case 'home':
        return <Home {...iconProps} />
      case 'document':
        return <FileSpreadsheet {...iconProps} />
      case 'calculator':
        return <Calculator {...iconProps} />
      case 'whatsapp':
        return <MessageCircle {...iconProps} />
      case 'users':
        return <Users {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-y-0 left-0 w-72 bg-white">
      {/* Logo */}
      <div className="flex items-center px-6 py-12">
        <div className="w-12 h-12 text-slate-900 mr-4">
          <img src="/new-logo.svg" alt="Studio Alvite Logo" className="w-full h-full" />
        </div>
        <span className="text-xl font-semibold text-slate-900">Studio Alvite</span>
      </div>

      {/* Navigation */}
      <nav className="px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="mr-3">{renderIcon(item.icon)}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200">
        <div className="flex items-center px-4 py-3 text-sm">
          <User className="w-5 h-5 text-slate-500 mr-3" />
          <span className="text-slate-700 flex-1">{user?.username}</span>
          <button
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}