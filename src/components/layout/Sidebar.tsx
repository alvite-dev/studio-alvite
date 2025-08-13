'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, FileSpreadsheet, MessageCircle, Users, Calculator, LogOut, User, Globe, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'Planilha', href: '/planilha', icon: 'document' },
    { name: 'Viabilidade', href: '/viabilidade', icon: 'calculator' },
    { name: 'WhatsApp', href: '/whatsapp', icon: 'whatsapp' },
    { name: 'Corretores', href: '/corretores', icon: 'users' },
    { name: 'Scrapping', href: '/scrapping', icon: 'scrapping' },
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
      case 'scrapping':
        return <Globe {...iconProps} />
      default:
        return null
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-lg border border-slate-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 md:w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-12">
        <div className="w-12 h-12 text-slate-900 mr-4 relative">
          <Image 
            src="/new-logo.svg" 
            alt="Studio Alvite Logo" 
            fill
            className="object-contain"
          />
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
              onClick={() => setIsOpen(false)}
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
    </>
  )
}