'use client'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
// import { ArrowDown, ArrowUp } from 'lucide-react'
import UpArrow from '@/assets/icons/UpArrow.svg'
import DownArrow from '@/assets/icons/DownArrow.svg'
// import UpArrow from '../../assets/icons/SortButtonUp'
// import DownArrow from '../../assets/icons/SortArrowDown'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  sortId?: string
  sortBy?: string
  handleSort?: (id: string) => void
  sortColumn?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  sortId,
  sortBy,
  handleSort,
  sortColumn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })
  return (
    <div>
      <Table className=''>
        <TableHeader>
          {table?.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // onClick={() => handleSort(header?.id) }
                    >
                      <div className='flex cursor-pointer items-center justify-between'>
                        {header?.isPlaceholder
                          ? null
                          : flexRender(
                              header?.column.columnDef.header,
                              header.getContext(),
                            )}
                        {sortColumn?.includes(header?.id) && (
                          <div className='flex flex-col items-center justify-center gap-[2px]'>

                            {/* <UpArrow
                              className={cn(
                                sortId === header.id && sortBy == 'asc'
                                  ? 'opacity-100'
                                  : 'opacity-50',
                              )}
                            />
                            <DownArrow
                              className={cn(
                                sortId === header.id && sortBy == 'desc'
                                  ? 'opacity-100'
                                  : 'opacity-50',
                              )}
                            /> */}
                          </div>
                        )}
                      {/* <div className='flex'>
                        <img src={UpArrow} className='w-2 h-4'/>
                        <img src={DownArrow} className='w-2 h-4'/>
                      </div> */}
                        
                        
                        {/* <UpArrow className='h-4 w-4' />
                        <DownArrow className='h-4 w-4' /> */}
                        {/* {header.id === sortId ? (
                          sortBy === '' ? null : sortBy === 'asc' ? (
                            <UpArrow className='h-4 w-4 opacity-0' />
                          ) : (
                            <DownArrow className='h-4 w-4' />
                          )
                        ) : null} */}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            )
          })}
        </TableHeader>
        {isLoading ? (
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i + 1}>
                {columns.map((item, i) => (
                  <TableCell key={i + 1}>
                    <div className='animate-pulse'>
                      <div className='h-4 rounded bg-gray-200'></div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {table
              ?.getRowModel()
              .rows?.map((row) => (
                <TableRow key={row.id}>
                  {row
                    ?.getVisibleCells()
                    .map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>

      {/*  <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
    </div>
  )
}
