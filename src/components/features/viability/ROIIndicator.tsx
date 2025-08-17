'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ROIIndicatorProps {
  roi: number
  size?: 'sm' | 'md' | 'lg'
}

export function ROIIndicator({ roi, size = 'md' }: ROIIndicatorProps) {
  const percentage = (roi * 100).toFixed(1)
  
  const getStatus = (roi: number) => {
    if (roi >= 0.3) return { 
      label: 'Excelente', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      icon: TrendingUp 
    }
    if (roi >= 0.15) return { 
      label: 'Bom', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      icon: TrendingUp 
    }
    if (roi >= 0.05) return { 
      label: 'Regular', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      icon: Minus 
    }
    return { 
      label: 'Baixo', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: TrendingDown 
    }
  }

  const status = getStatus(roi)
  const Icon = status.icon
  
  const sizeClasses = {
    sm: {
      container: 'p-3',
      percentage: 'text-xl',
      icon: 'w-5 h-5',
      label: 'text-xs'
    },
    md: {
      container: 'p-4',
      percentage: 'text-2xl',
      icon: 'w-6 h-6',
      label: 'text-sm'
    },
    lg: {
      container: 'p-6',
      percentage: 'text-4xl',
      icon: 'w-8 h-8',
      label: 'text-base'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`
      ${status.bgColor} ${status.borderColor} ${classes.container}
      border-2 rounded-xl flex flex-col items-center justify-center text-center
      transition-all duration-200 hover:shadow-md
    `}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`${status.color} ${classes.icon}`} />
        <span className={`${status.color} font-bold ${classes.percentage}`}>
          {percentage}%
        </span>
      </div>
      <span className={`${status.color} font-medium ${classes.label} uppercase tracking-wide`}>
        {status.label}
      </span>
      <span className="text-xs text-slate-500 mt-1">ROI</span>
    </div>
  )
}