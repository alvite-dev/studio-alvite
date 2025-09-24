'use client'

import { useAuthStore } from '@/stores/authStore'
import UserAvatar from './UserAvatar'
import Image from 'next/image'

export default function TopHeader() {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-14">
      <div className="flex items-center justify-between h-full pr-4 sm:pr-6 lg:pr-8 pl-4">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image 
              src="/new-logo.svg" 
              alt="Alvite Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-slate-900 tracking-tight">
            Alvite
          </span>
        </div>
        
        {/* Right side - User Avatar */}
        <div className="flex items-center">
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}