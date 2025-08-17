"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max: number
  min: number
  step: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, max, min, step, className, ...props }, ref) => {
    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange([Number(e.target.value)])}
          className="relative h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 outline-none
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-orange-600 
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:hover:bg-orange-700
                     [&::-moz-range-thumb]:h-5 
                     [&::-moz-range-thumb]:w-5 
                     [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:bg-orange-600 
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:border-none
                     [&::-moz-range-thumb]:shadow-lg"
          {...props}
        />
        <div 
          className="absolute h-2 bg-orange-600 rounded-lg pointer-events-none"
          style={{
            width: `${((value[0] - min) / (max - min)) * 100}%`
          }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }