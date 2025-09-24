'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { User, Settings, LogOut } from 'lucide-react'

interface UserDropdownProps {
  onClose: () => void
}

export default function UserDropdown({ onClose }: UserDropdownProps) {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  if (!user) return null

  const handleProfile = () => {
    router.push('/profile')
    onClose()
  }

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout()
      router.push('/login')
      onClose()
    }
  }

  const menuItems = [
    {
      icon: User,
      label: 'Minha Conta',
      onClick: handleProfile,
      className: 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
    },
    {
      icon: Settings,
      label: 'Configurações',
      onClick: () => {
        // TODO: Implementar página de configurações
        console.log('Configurações')
        onClose()
      },
      className: 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
    }
  ]

  return (
    <div className="absolute right-0 top-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-in slide-in-from-top-1 duration-150">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
            {user.username.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.username}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 text-sm transition-colors duration-150 ${item.className}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
        
        {/* Separator */}
        <div className="border-t border-slate-100 my-2"></div>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left flex items-center gap-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}