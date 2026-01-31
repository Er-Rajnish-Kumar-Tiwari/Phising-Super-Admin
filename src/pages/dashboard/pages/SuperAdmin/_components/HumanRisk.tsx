import TableHeader from '@/components/TableHeader'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/Table/data-table';
import {Building, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDownloadTextFile, useHumanRisk } from '@/service/dashboard';
import { EmployeeDataArray, Organization } from '@/contracts/dashboard';
import { FC, useEffect, useRef, useState } from 'react';
import { createTextFileDownloadableLink } from '@/constants/utils';

const userRisks = [
    {
      email: "john.doe@example.com",
      fullName: "John Doe",
      riskPercentage: 85,
      riskType: "High",
    },
    {
      email: "jane.smith@example.com",
      fullName: "Jane Smith",
      riskPercentage: 55,
      riskType: "Medium",
    },
    {
      email: "alex.jones@example.com",
      fullName: "Alex Jones",
      riskPercentage: 20,
      riskType: "Low",
    },
    {
      email: "emily.taylor@example.com",
      fullName: "Emily Taylor",
      riskPercentage: 72,
      riskType: "High",
    },
    {
      email: "michael.lee@example.com",
      fullName: "Michael Lee",
      riskPercentage: 40,
      riskType: "Medium",
    }
  ]

  type OrganisationType={
    item?:Organization[],
    isLoading:boolean,
    isFetching:boolean
  }

const HumanRisk:FC<OrganisationType> = ({item,isLoading,isFetching}) => {
  // const [downloadType, setDownloadType] = useState<"excel" | "csv" | null>(
  //     null
  //   );
    const isDownloadingRef = useRef(false);
    // const [downloadTrigger, setDownloadTrigger] = useState(0)
    const [userIdTrigger, setUserIdTrigger] = useState('')
    const { isFetching: isDownloading, refetch: refetchDownload } =
      useDownloadTextFile(
        {
          userId:userIdTrigger,
        },
        {
          enabled: false,
        }
      );
  
  
    useEffect(() => {
      if (userIdTrigger && !isDownloadingRef.current) {
        isDownloadingRef.current = true;
        refetchDownload()
          .then(({ data }) => {
            if (data) {

              createTextFileDownloadableLink({
                content:data,
                fileName:"CampaignList.txt"
              })
              
            }
          })
          .finally(() => {
            isDownloadingRef.current = false;
            setUserIdTrigger('')
            // setDownloadType(null);
          });
      }
    }, [ userIdTrigger, refetchDownload]);
  
    const handleDownloadTextFile = (userId:string) => {
      setUserIdTrigger(userId)
    };

 const columns: ColumnDef<Organization>[] = [
    {
        accessorKey: 'Organisation Name',
        header: ({ column }) => (
          <TableHeader column={column} title='Organisation Name' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.organizationName}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Employee',
        header: ({ column }) => (
          <TableHeader column={column} title='Employee' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.employees}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Domain',
        header: ({ column }) => (
          <TableHeader column={column} title='Domain' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.domain.split('@')[1]}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Contact Info',
        header: ({ column }) => (
          <TableHeader column={column} title='Contact Info' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.contactEmail}`}</span>
          </div>
        ),
      },

      {
        accessorKey: 'Last Login',
        header: ({ column }) => (
          <TableHeader column={column} title='Last Login' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.lastLogin?props.row.original.lastLogin:""}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Region',
        header: ({ column }) => (
          <TableHeader column={column} title='Regin' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' '>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.region}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Campaign',
        header: ({ column }) => (
          <TableHeader column={column} title='Campaign' className=' text-center ' />
        ),
        cell: (props) => (
          <div className=' flex gap-2'>
            {/* <GreenTick /> */}
            {props.row.original.campaigns?(
              <>
                <FileText className="size-4 text-brand cursor-pointer" onClick={()=>handleDownloadTextFile(props.row.original.userId)}/>
            <span>{`${props.row.original.campaigns}`}</span>
              </>
              
            ):(
              <>
                <FileText className="size-4 text-gray-300 disabled:text-gray-300 cursor-not-allowed" />
            <span>{`${props.row.original.campaigns}`}</span>
              </>
            )}
            
          </div>
        ),
      },

      
]

  return (
    <div>
        <Card  className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex gap-2">
                      <Building className='size-6'/>
                      <h1>Organizations</h1>
                    </CardTitle>
                    
                  </CardHeader>
                  <CardContent className="space-y-4" >

        <div className=" border-lightGray mx-auto  rounded-xl border">
                  
                    <DataTable
                      data={item || []}
                      isLoading={isLoading}
                      columns={columns}
                    />
                 
        
                  {item ? (
                    <></>
                  ) : (
                    <>
                      {!isFetching && (
                        <div className="flex h-[500px] flex-col items-center justify-center">
                          <p className="text-lg font-medium">No matches found</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                </CardContent>
                </Card>
    </div>
  )
}

export default HumanRisk