'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import UserDropdown from './UserDropdown'

export default function UserAvatar() {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // Fechar dropdown com ESC
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen])

  if (!user) return null

  // Gerar iniciais do usuário
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="relative">
      <button
        ref={avatarRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getInitials(user.username)}
      </button>

      {isOpen && (
        <div ref={dropdownRef}>
          <UserDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  )
}