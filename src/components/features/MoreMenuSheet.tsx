'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Settings, Calculator, Calendar, Users, Home, Building2 } from 'lucide-react'
import Image from 'next/image'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'

interface MoreMenuSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function MoreMenuSheet({ isOpen, onClose }: MoreMenuSheetProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  const sheetRef = useSwipeToDismiss({
    onDismiss: onClose,
    threshold: 80
  })

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Agenda',
      href: '/agenda',
      icon: Calendar
    },
    {
      name: 'Corretores',
      href: '/corretores',
      icon: Users
    },
    {
      name: 'Imóveis',
      href: '/imoveis',
      icon: Building2
    },
    {
      name: 'Viabilidade',
      href: '/viabilidade',
      icon: Calculator
    },
    {
      name: 'Configurações',
      href: '/config',
      icon: Settings
    }
  ]

  if (!isVisible) return null

  return (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 relative mr-4">
              <Image 
                src="/new-logo.svg" 
                alt="Alvite Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-slate-900">Alvite</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-6 h-6 text-slate-600 group-hover:text-slate-800" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 text-center leading-tight">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Safe area padding */}
        <div className="pb-safe" />
      </div>
    </div>
  )
}