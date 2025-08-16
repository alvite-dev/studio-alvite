'use client'

import { Badge } from '@/components/ui/badge'

const BAIRRO_CORES = {
  'flamengo': 'bg-blue-200 text-blue-800',
  'catete': 'bg-purple-200 text-purple-800', 
  'botafogo': 'bg-indigo-200 text-indigo-800',
  'copacabana': 'bg-cyan-200 text-cyan-800',
  'ipanema': 'bg-pink-200 text-pink-800',
  'leblon': 'bg-yellow-200 text-yellow-800',
  'barra': 'bg-violet-200 text-violet-800',
  'tijuca': 'bg-orange-200 text-orange-800',
  'centro': 'bg-gray-200 text-gray-800',
  'zona sul': 'bg-teal-200 text-teal-800',
  'zona norte': 'bg-sky-200 text-sky-800',
  'zona oeste': 'bg-slate-200 text-slate-800',
  'default': 'bg-slate-200 text-slate-800'
}

interface BairroTagsProps {
  bairros?: string[]
  maxTags?: number
}

export function BairroTags({ bairros = [], maxTags }: BairroTagsProps) {
  if (!bairros || bairros.length === 0) {
    return null
  }

  const getBairroColor = (bairro: string) => {
    const key = bairro.toLowerCase().trim()
    return BAIRRO_CORES[key as keyof typeof BAIRRO_CORES] || BAIRRO_CORES.default
  }

  const displayBairros = maxTags ? bairros.slice(0, maxTags) : bairros
  const remaining = maxTags && bairros.length > maxTags ? bairros.length - maxTags : 0

  return (
    <div className="flex flex-wrap gap-1">
      {displayBairros.map((bairro, index) => (
        <Badge
          key={index}
          className={`text-xs px-2 py-0.5 ${getBairroColor(bairro)}`}
        >
          {bairro}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}