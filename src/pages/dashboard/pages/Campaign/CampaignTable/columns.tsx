import DeleteDailog from '@/components/DeleteDailog'
import TableHeader from '@/components/TableHeader'
import { EmployeeList } from '@/contracts/employee'
// import { EmployeeTableType, EmployeeType } from '@/service/employee/api'
import type { ColumnDef } from '@tanstack/react-table'

import moment from 'moment'
import DeleteCampaign from './deleteCampaign'
import { CampaignPagination } from '@/service/campaign/api'
import { Progress } from '@/components/ui/progress'
import EditCampaign from './EditCampaign'
import DublicateCampaign from './DuplicateCampaign'
import momentTz from 'moment-timezone'
// import DeleteEmployee from './deleteEmployee'
// import EmployeeForm from './EmployeeForm'


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
export const columns: ColumnDef<CampaignPagination>[] = [
  
  {
    accessorKey: 'CAMPAIGN NAME',
    header: ({ column }) => (
      <TableHeader column={column} title='CAMPAIGN NAME' className='w-[200px] text-center items-center justify-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[200px] min-h-[56px]'>
        <span className='w-full text-center'>{`${props.row.original.campaignName}`}</span>
      </div>
    ),
  },
  {
    accessorKey: 'DELIVERY STATUS',
    header: ({ column }) => (
      <TableHeader column={column} title='DELIVERY STATUS' className='w-[220px] text-center' />
    ),
    cell: (props) => {
      const total = props.row.original.employeeDetailsCount ?? 0;
      const delivered = props.row.original.deliveryStatus === "Finished" ? total : 0;
      const percent = total > 0 ? Math.round((delivered / total) * 100) : 0;
      return (
        <div className='flex flex-col items-center justify-center w-[220px]'>
          <p className='mb-2'>{`${delivered} of ${total} employees targeted (${percent}%)`}</p>
          <Progress value={percent} className={` mb-2 `}/>
        </div>
      );
    },
  },
  {
    accessorKey: 'SCHEDULED DATE',
    header: ({ column }) => (
      <TableHeader column={column} title='SCHEDULED DATE' className='w-[180px] text-center ' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[180px]'>
        {(props.row.original.startDate && props.row.original.endDate)?(
          <span>{`${moment(props.row.original.startDate).format("DD/MM/YYYY")} - ${moment(props.row.original.endDate).format("DD/MM/YYYY")}  `}</span>
        ):<span>{`${moment(props.row.original.createdAt).format("DD/MM/YYYY")} - ${moment(props.row.original.createdAt).format("DD/MM/YYYY")}  `}</span>}
      </div>
    ),
  },
  {
    accessorKey: 'SCHEDULED TIME',
    header: ({ column }) => (
      <TableHeader column={column} title='SCHEDULED TIME' className='w-[180px] text-center ' />
    ),
    cell: (props) => {
      // Get user's local time zone abbreviation
      const timeZone = momentTz.tz.guess();
      const tzAbbr = momentTz.tz(timeZone).zoneAbbr();
      return (
        <div className='flex items-center justify-center w-[180px]'>
          {(props.row.original.startTime && props.row.original.endTime)?(
            <span>{`${props.row.original.startTime} - ${props.row.original.endTime} ${tzAbbr}`}</span>
          ):(
            <span>{`${moment(props.row.original.createdAt).format('HH:mm')} ${tzAbbr}`}</span>
          )}
        </div>
      );
    },
  },
//   {
//     accessorKey: 'DOMAIN VERIFICATION STATUS',
//     header: ({ column }) => (
//       <TableHeader column={column} title='DOMAIN VERIFICATION STATUS' className='w-[300px] text-center' />
//     ),
//     cell: (props) => (
//       <div className='flex items-center justify-center w-[300px]'>
//         {/* <GreenTick /> */}
//         <span className={`${props.row.original.isVerify?"bg-green-500 text-black":"bg-red-500 text-white"}  px-2 py-1 rounded-sm`}>{props.row.original.email.split("@")[1]}</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'LAST MODIFIED',
//     header: ({ column }) => (
//       <TableHeader column={column} title='LAST MODIFIED' className='w-[200px] text-center' />
//     ),
//     cell: (props) => (
//       <div className='flex items-center justify-center w-[180px]'>
//         {/* <GreenTick /> */}
//         <span>{`${ moment(props.row.original.createdAt).format("DD-MM-YYYY")}`}</span>
//       </div>
//     ),
//   },
  {
    accessorKey: '_id',
    header: ({ column }) => (
      <TableHeader column={column} title='ACTIONS' className='w-[180px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center gap-2 w-[180px]'>
       <DeleteCampaign campaignListId={props.row.original._id}/>
       </div>
    ),
  },
 

 

]