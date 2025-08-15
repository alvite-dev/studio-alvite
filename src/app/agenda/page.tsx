'use client'

import { useState, useEffect } from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import { VisitCard } from '@/components/features/VisitCard'
import { VisitForm } from '@/components/forms/VisitForm'
import { VisitInfoModal } from '@/components/features/VisitInfoModal'
import PageHeader from '@/components/features/PageHeader'
import { useVisitasStore, VisitaCompleta } from '@/stores/visitasStore'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { useImoveisStore } from '@/stores/imoveisStore'
import { Plus, Calendar, Info, Edit, Trash2 } from 'lucide-react'

// Wrapper para tornar cada VisitCard draggable
function SortableVisitCard({ 
  visita, 
  onInfo,
  onEdit,
  onDelete 
}: { 
  visita: VisitaCompleta
  onInfo: (visita: VisitaCompleta) => void
  onEdit: (visita: VisitaCompleta) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: visita.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className="relative group">
      {/* Botões de ação - fora da área de drag */}
      <div className="absolute top-4 right-4 z-10 flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInfo(visita)}
          className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white shadow-sm border border-slate-200"
          title="Ver informações"
        >
          <Info className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(visita)}
          className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white shadow-sm border border-slate-200"
          title="Editar visita"
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(visita.id)}
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white shadow-sm border border-slate-200"
          title="Remover visita"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Área draggable */}
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing"
      >
        <VisitCard
          visita={visita}
          isDragging={isDragging}
        />
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const { visitas, isLoading, carregarVisitas, removerVisita, reordenarVisitas } = useVisitasStore()
  const { carregarCorretores } = useCorretoresStore()
  const { carregarImoveis } = useImoveisStore()
  const [visitaParaEditar, setVisitaParaEditar] = useState<VisitaCompleta | undefined>()
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [visitaInfo, setVisitaInfo] = useState<VisitaCompleta | null>(null)
  const [modalInfoOpen, setModalInfoOpen] = useState(false)

  // Carregar dados iniciais
  useEffect(() => {
    const carregarTodosDados = async () => {
      await Promise.all([
        carregarVisitas(),
        carregarCorretores(),
        carregarImoveis()
      ])
    }
    carregarTodosDados()
  }, [carregarVisitas, carregarCorretores, carregarImoveis])
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = visitas.findIndex((visita) => visita.id === active.id)
      const newIndex = visitas.findIndex((visita) => visita.id === over?.id)

      await reordenarVisitas(arrayMove(visitas, oldIndex, newIndex))
    }
  }


  const resetEdicao = () => {
    setVisitaParaEditar(undefined)
    setModalEditOpen(false)
  }

  const handleInfoVisita = (visita: VisitaCompleta) => {
    setVisitaInfo(visita)
    setModalInfoOpen(true)
  }

  const handleEditVisita = (visita: VisitaCompleta) => {
    setVisitaParaEditar(visita)
    setModalEditOpen(true)
  }

  const handleDeleteVisita = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta visita?')) {
      await removerVisita(id)
    }
  }

  const handleEditFromInfo = (visita: VisitaCompleta) => {
    setVisitaParaEditar(visita)
    setModalEditOpen(true)
  }

  const handleDeleteFromInfo = async (id: string) => {
    await removerVisita(id)
  }

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <PageHeader
        title="Agenda de Visitas"
        description={`${visitas.length} ${visitas.length === 1 ? 'visita agendada' : 'visitas agendadas'}`}
        action={
          <VisitForm
            trigger={
              <Button size="sm" className="shrink-0" title="Adicionar visita">
                <Plus className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Adicionar</span>
              </Button>
            }
          />
        }
      />

      {/* Content */}
      <div className="px-4 pb-20 md:pb-8 md:px-6 pt-6">

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Carregando visitas...</p>
          </div>
        ) : (
          <>
            {/* Lista de Visitas */}
            {visitas.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={visitas.map(v => v.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {visitas.map((visita) => (
                  <SortableVisitCard
                    key={visita.id}
                    visita={visita}
                    onInfo={handleInfoVisita}
                    onEdit={handleEditVisita}
                    onDelete={handleDeleteVisita}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhuma visita agendada
            </h3>
          </div>
        )}
          </>
        )}
      </div>

      {/* Form de edição */}
      <VisitForm
        trigger={<div />}
        visitaParaEditar={visitaParaEditar}
        onSuccess={resetEdicao}
        open={modalEditOpen}
        onOpenChange={setModalEditOpen}
      />

      {/* Modal de informações */}
      <VisitInfoModal
        visita={visitaInfo}
        open={modalInfoOpen}
        onOpenChange={setModalInfoOpen}
        onEdit={handleEditFromInfo}
        onDelete={handleDeleteFromInfo}
      />
    </div>
  )
}