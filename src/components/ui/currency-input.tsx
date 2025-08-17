'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | null
  onChange: (value: number | null) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')

    const formatCurrency = (amount: number | null) => {
      if (amount === null || amount === 0) return ''
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }

    const parseCurrencyString = (str: string): number | null => {
      // Remove todos os caracteres que não são dígitos
      const numbersOnly = str.replace(/\D/g, '')
      return numbersOnly ? parseInt(numbersOnly, 10) : null
    }

    useEffect(() => {
      setDisplayValue(formatCurrency(value))
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const numericValue = parseCurrencyString(inputValue)
      
      setDisplayValue(formatCurrency(numericValue))
      onChange(numericValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Quando foca, mostra apenas os números para facilitar edição
      setDisplayValue(value?.toString() || '')
      e.target.select()
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Quando sai do foco, volta para formato monetário
      const numericValue = parseCurrencyString(e.target.value)
      setDisplayValue(formatCurrency(numericValue))
      onChange(numericValue)
    }

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(className)}
        {...props}
      />
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'