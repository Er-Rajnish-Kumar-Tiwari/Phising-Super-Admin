import React from 'react'
// import Select from '../SelectInput'
import Pagination from '../Pagination'
// import { PaginationTypes, PaginationsTypes } from '../../contracts/master'
import { cn } from '@/lib/utils'

export type PaginationsTypes = {
  totalCount: number
  pageSize: number
  pageNo: number
  setPageSize?: (e: any) => void
  setPageNo?: (e: any) => void
  // setParam: (name: string, value: string) => void
  handleClick: (e: { selected: number }) => void
  pageSizeList?: any
}

export const TablePagination = ({
  handleClick,
  pageNo,
  pageSize,
  setPageSize,
  totalCount,
  pageSizeList,
  setPageNo,
}: PaginationsTypes) => {
  return (
    <div
      className={cn(
        'my-[1.56rem] flex w-full items-center justify-between  px-[1.5rem]',
        totalCount ? 'block flex' : 'flex hidden',
      )}
    >
      <div className='flex items-center justify-start space-x-2 text-base font-normal'>
        {/* <div className='w-[5.5rem]'>
          <Select
            name='page'
            options={pageSizeList}
            style={{
              control: (baseStyles) => ({
                ...baseStyles,
                height: '2.5rem',
                width: '100%',
                backgroundColor: '#fff',
                border: '1px solid #D6CFCF',
                fontSize: '1rem',
                borderRadius: '0.5rem',

                paddingLeft: '1em',
              }),
              container: (s) => ({
                ...s,
                width: '5.4rem',
              }),
              valueContainer: (base) => ({
                ...base,
                padding: 0,
              }),
            }}
            onChange={(e) => {
              setPageSize(Number(e?.value))
              setPageNo(1)
            }}
            value={{
              value: String(pageSize),
              label: String(pageSize),
            }}
          />
        </div>

        <p>
          {`Showing ${(pageNo - 1) * pageSize + 1} -
          ${Math.min(pageSize * pageNo, totalCount)}
           of ${totalCount} Entries`}
        </p> */}
      </div>
      <div>
        <Pagination
          handleClick={handleClick}
          pageCount={Math.ceil(Math.ceil(totalCount / pageSize))}
          pageRange={3}
          mariginpage={1}
          pageNo={pageNo}
        />
      </div>
    </div>
  )
}
