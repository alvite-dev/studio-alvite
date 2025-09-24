'use client'

import { Phone, Calendar } from 'lucide-react'
import { TerceiroCompleto } from '../types/terceiro'
import { PersonInfoModal } from '@/components/shared/PersonInfoModal'
import { StarRating, getEspecialidadeColor, formatPhone, formatDate } from '@/components/shared/PersonInfoComponents'

interface TerceiroInfoModalProps {
  terceiro: TerceiroCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (terceiro: TerceiroCompleto) => void
  onDelete: (id: string) => void
  onWhatsApp: (contato: string) => void
}

export function TerceiroInfoModal({
  terceiro,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onWhatsApp
}: TerceiroInfoModalProps) {
  if (!terceiro) return null

  const infoFields = [
    {
      icon: Phone,
      label: 'Contato',
      value: formatPhone(terceiro.contato)
    }
  ]

  // Adiciona campo de data apenas se existir
  if (terceiro.created_at) {
    infoFields.push({
      icon: Calendar,
      label: 'Cadastrado em',
      value: formatDate(terceiro.created_at)
    })
  }

  return (
    <PersonInfoModal
      name={terceiro.nome}
      open={open}
      onOpenChange={onOpenChange}
      title="Informações do Terceiro"
      primaryBadge={{
        text: terceiro.especialidade,
        className: getEspecialidadeColor(terceiro.especialidade)
      }}
      metricsSection={
        <StarRating rating={terceiro.nota} />
      }
      infoFields={infoFields}
      onWhatsApp={() => onWhatsApp(terceiro.contato)}
      onEdit={() => onEdit(terceiro)}
      onDelete={() => onDelete(terceiro.id)}
      deleteConfirmMessage={`Tem certeza que deseja excluir ${terceiro.nome}?`}
      hasPhone={true}
    />
  )
}