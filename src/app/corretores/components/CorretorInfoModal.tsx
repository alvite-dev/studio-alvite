'use client'

import { Phone, Building2, MapPin } from 'lucide-react'
import { CorretorCompleto } from '../types/corretor'
import { PersonInfoModal } from '@/components/shared/PersonInfoModal'
import { TagsList, formatPhone } from '@/components/shared/PersonInfoComponents'

interface CorretorInfoModalProps {
  corretor: CorretorCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (corretor: CorretorCompleto) => void
  onWhatsApp: (telefone: string) => void
  onDelete?: (id: string) => void
}

export function CorretorInfoModal({ 
  corretor, 
  open, 
  onOpenChange, 
  onEdit, 
  onWhatsApp,
  onDelete
}: CorretorInfoModalProps) {
  if (!corretor) return null

  const infoFields = [
    {
      icon: Phone,
      label: 'Telefone',
      value: formatPhone(corretor.telefone) as React.ReactNode
    }
  ]

  // Adiciona campo de imobiliária apenas se existir
  if (corretor.imobiliaria) {
    infoFields.push({
      icon: Building2,
      label: 'Imobiliária',
      value: corretor.imobiliaria as React.ReactNode
    })
  }

  // Adiciona campo de bairros apenas se existir
  if (corretor.bairros && corretor.bairros.length > 0) {
    infoFields.push({
      icon: MapPin,
      label: 'Áreas de Atuação',
      value: <TagsList tags={corretor.bairros} maxTags={5} /> as React.ReactNode
    })
  }

  return (
    <PersonInfoModal
      name={corretor.nome}
      open={open}
      onOpenChange={onOpenChange}
      title="Informações do Corretor"
      primaryBadge={{
        text: 'Corretor',
        className: 'bg-blue-100 text-blue-800'
      }}
      infoFields={infoFields}
      onWhatsApp={() => onWhatsApp(corretor.telefone)}
      onEdit={() => onEdit(corretor)}
      onDelete={onDelete ? () => onDelete(corretor.id) : undefined}
      deleteConfirmMessage={`Tem certeza que deseja excluir ${corretor.nome}?`}
      hasPhone={true}
    />
  )
}