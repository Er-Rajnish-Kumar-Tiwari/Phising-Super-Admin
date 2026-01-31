import { PopoverContentProps } from '@radix-ui/react-popover'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React, { FC, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { ListFilter } from 'lucide-react';


const FilterRole: FC<
  {
    label: string
    className?: string
    isOpen?: boolean
    setIsOpen?: (e: boolean) => void
    popContentProps?: PopoverContentProps
  } & PropsWithChildren
> = ({ isOpen, setIsOpen, popContentProps, children, className, label }) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative flex cursor-pointer items-center rounded-full border border-black bg-white px-4 py-2 text-brand data-[state=open]:text-brand',
            className,
          )}
        >
          {label != undefined ? (
            <p className='w-full text-center '>{label}</p>
          ) : (
            <>
              {/* <FilterIcon width={16} className='mr-2' /> */}
              <ListFilter width={16} className='mr-2'/>
              <span>Filter By Category</span>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        className='w-[220px] h-[200px] overflow-y-scroll rounded-[10px] bg-white p-0'
        {...popContentProps}
      >
        {/* <ScrollArea className="h-[200px]  rounded-md border "> */}
        {children}
        {/* </ScrollArea> */}
        
      </PopoverContent>
    </Popover>
  )
}

export default FilterRole
