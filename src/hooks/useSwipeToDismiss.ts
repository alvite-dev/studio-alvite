import { useEffect, useRef } from 'react'

interface SwipeToDismissOptions {
  onDismiss: () => void
  threshold?: number
  enabled?: boolean
}

export function useSwipeToDismiss({ 
  onDismiss, 
  threshold = 100, 
  enabled = true 
}: SwipeToDismissOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled) return

    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY
      currentY.current = startY.current
      isDragging.current = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      
      currentY.current = e.touches[0].clientY
      const deltaY = currentY.current - startY.current
      
      // Apenas permitir movimento para baixo
      if (deltaY > 0) {
        const translateY = Math.min(deltaY, threshold * 2)
        element.style.transform = `translateY(${translateY}px)`
        element.style.transition = 'none'
      }
    }

    const handleTouchEnd = () => {
      if (!isDragging.current) return
      
      const deltaY = currentY.current - startY.current
      
      // Reset transform
      element.style.transform = ''
      element.style.transition = ''
      
      // Se passou do threshold, fechar
      if (deltaY > threshold) {
        onDismiss()
      }
      
      isDragging.current = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      startY.current = e.clientY
      currentY.current = startY.current
      isDragging.current = true
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      
      currentY.current = e.clientY
      const deltaY = currentY.current - startY.current
      
      // Apenas permitir movimento para baixo
      if (deltaY > 0) {
        const translateY = Math.min(deltaY, threshold * 2)
        element.style.transform = `translateY(${translateY}px)`
        element.style.transition = 'none'
      }
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      
      const deltaY = currentY.current - startY.current
      
      // Reset transform
      element.style.transform = ''
      element.style.transition = ''
      
      // Se passou do threshold, fechar
      if (deltaY > threshold) {
        onDismiss()
      }
      
      isDragging.current = false
    }

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    // Mouse events (para desktop)
    element.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onDismiss, threshold, enabled])

  return elementRef
}