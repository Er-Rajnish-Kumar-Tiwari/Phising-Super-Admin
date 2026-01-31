

import DeleteDailog from '@/components/DeleteDailog'
import TableHeader from '@/components/TableHeader'
import { EmployeeList } from '@/contracts/employee'
// import { EmployeeTableType, EmployeeType } from '@/service/employee/api'
import type { ColumnDef } from '@tanstack/react-table'

import moment from 'moment'
import DeleteEmployee from './deleteEmployee'
import EmployeeForm from './EmployeeForm'


export type Transactions = {
  bookingId: number
  formattedBookingId: string
  fullName: string
  phone: string
  bookingStatus: string
  transactionStatus?: string
  transactionDate?: number
  transactionAmount?: number
  propertyId: string
  // propertyDetail: PropertyDetail
}

export type UserDetails={
  firstName:string,
  lastName:string,
  email:string,
  phone:string
}
export const columns: ColumnDef<EmployeeList>[] = [
  
  {
    accessorKey: 'EMPLOYEE LIST NAME',
    header: ({ column }) => (
      <TableHeader column={column} title='EMPLOYEE LIST NAME' className='w-[180px] text-center ' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[180px]'>
        {/* <GreenTick /> */}
        <span>{`${props.row.original.employeeListName}`}</span>
      </div>
    ),
  },
  {
    accessorKey: 'EMPLOYEE COUNT',
    header: ({ column }) => (
      <TableHeader column={column} title='EMPLOYEE COUNT' className='w-[180px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[180px]'>
        {/* <GreenTick /> */}
        <span>{`${props.row.original.totalEmployees}`}</span>
      </div>
    ),
  },
  {
    accessorKey: 'DOMAIN VERIFICATION STATUS',
    header: ({ column }) => (
      <TableHeader column={column} title='DOMAIN VERIFICATION STATUS' className='w-[300px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[300px]'>
        {/* <GreenTick /> */}
        <span className={`${props.row.original.isVerify?"bg-green-500 text-black":" text-white"}  px-2 py-1 font-bold rounded-[4px]`}>{props.row.original.email.split("@")[1]}</span>
      </div>
    ),
  },
  {
    accessorKey: 'LAST MODIFIED',
    header: ({ column }) => (
      <TableHeader column={column} title='LAST MODIFIED' className='w-[200px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[180px]'>
        {/* <GreenTick /> */}
        <span>{`${ moment(props.row.original.createdAt).format("DD-MM-YYYY")}`}</span>
      </div>
    ),
  },
  {
    accessorKey: '_id',
    header: ({ column }) => (
      <TableHeader column={column} title='ACTIONS' className='w-[180px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center gap-2'>
      {/*<EmployeeForm employeeLsName={props.row.original.employeeListName} isUpdate={true}/>*/}
       <DeleteEmployee employeeListId={props.row.original.employeeId}/>
       </div>
    ),
  },


 

]
