'use client'

import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Componente para renderizar avaliação com estrelas
export function StarRating({ rating, label = "Avaliação" }: { rating?: number | null, label?: string }) {
  if (!rating) {
    return (
      <>
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-slate-400 text-sm">Sem avaliação</span>
      </>
    )
  }
  
  return (
    <>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium">{rating.toFixed(1)}</span>
      </div>
    </>
  )
}

// Componente para badges de tags (como bairros)
export function TagsList({ 
  tags, 
  maxTags = 5, 
  getTagColor 
}: { 
  tags: string[]
  maxTags?: number
  getTagColor?: (tag: string) => string
}) {
  const visibleTags = tags.slice(0, maxTags)
  const remainingCount = tags.length - maxTags

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag, index) => (
        <Badge
          key={index}
          className={getTagColor ? getTagColor(tag) : "bg-slate-100 text-slate-800"}
        >
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-slate-500">
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

// Utilitários para cores de especialidades e outros badges
export const EspecialidadeColors: { [key: string]: string } = {
  'marceneiro': 'bg-amber-100 text-amber-800',
  'encanador': 'bg-blue-100 text-blue-800', 
  'pintor': 'bg-green-100 text-green-800',
  'eletricista': 'bg-yellow-100 text-yellow-800',
  'pedreiro': 'bg-stone-100 text-stone-800',
  'jardineiro': 'bg-emerald-100 text-emerald-800',
  'limpeza': 'bg-cyan-100 text-cyan-800'
}

export function getEspecialidadeColor(especialidade: string): string {
  return EspecialidadeColors[especialidade.toLowerCase()] || 'bg-slate-100 text-slate-800'
}

// Utilitário para formatação de telefone
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// Utilitário para formatação de data
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}