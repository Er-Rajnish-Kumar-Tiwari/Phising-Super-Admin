import type { Column } from '@tanstack/react-table'
import React from 'react'
import { cn } from '@/lib/utils'

type SortContent = {
  title?: string
  column?: Column<any, unknown>
  className?: string
}
const TableHeader = ({ column, title, className }: SortContent) => {
  return (
    <div
  className={cn(
    'flex items-center justify-center text-center w-full gap-[0.94rem]',
    className
  )}
>
      <span className='font-bold text-sm text-[#5D5A5A] leading-normal'>{title}</span>
      {/* <button type='button' onClick={() => {}}>
        <Image
          src='svg/icons/sort.svg'
          alt='sort'
          className='h-[0.79131rem] w-[0.56463rem] cursor-pointer'
        />
      </button> */}
    </div>
  )
}

export default TableHeader
