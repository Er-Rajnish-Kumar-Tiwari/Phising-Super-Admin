import React from 'react'
import TableHeader from '@/components/TableHeader'
import type { ColumnDef } from '@tanstack/react-table'
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/Table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedProgressProvider from '@/components/CircularProgressBar/AnimatedProgressProvider';
import { useHumanRisk } from '@/service/dashboard';
import { EmployeeDataArray } from '@/contracts/dashboard';

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

  type RiskType = "High" | "Medium" | "Low";

interface UserRisk {
  email: string;
  fullName: string;
  riskPercentage: number; // e.g. "85%"
  riskType: string;
}

const HumanRisk = () => {

      const {
        data: humanRiskData,
        isLoading,
        isFetching,
        // refetch,
      } = useHumanRisk({
        id:localStorage.getItem("user") as string
        // id:"67e24139925615b9c3fd4dfc"
      });

console.log(humanRiskData)

 const columns: ColumnDef<EmployeeDataArray>[] = [
    {
        accessorKey: 'Employee Email',
        header: ({ column }) => (
          <TableHeader column={column} title='Employee Email' className='w-[200px] text-center ' />
        ),
        cell: (props) => (
          <div className='flex items-center justify-center w-[200px]'>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.employeeDetails[0].email}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Full Name',
        header: ({ column }) => (
          <TableHeader column={column} title='Full Name' className='w-[200px] text-center ' />
        ),
        cell: (props) => (
          <div className='flex items-center justify-center w-[200px]'>
            {/* <GreenTick /> */}
            <span>{`${props.row.original.employeeDetails[0].firstName} ${props.row.original.employeeDetails[0].lastName}`}</span>
          </div>
        ),
      },
      {
        accessorKey: 'Human Risk',
        header: ({ column }) => (
          <TableHeader column={column} title='Human Risk' className='w-[200px] text-center ' />
        ),
        cell: (props) => (
          <div className='flex flex-col gap-2 py-2 w-[200px]'>
            {/* <GreenTick /> */}
            
            <AnimatedProgressProvider
        valueStart={0}
        valueEnd={props.row.original.phishingScore.totalRiskScore}
        duration={1.4}
        // easingFunction={easeQuadInOut}
        // repeat
      >
        {value => {
          const roundedValue = Math.round(value);
          return (
            <>
                <p className='text-md text-left'>{roundedValue}% <span className='font-semibold text-md'>- {props.row.original.phishingScore?.totalRiskScore>70?"High":props.row.original.phishingScore.totalRiskScore>50?"Medium":"Low" } Risk</span></p>
                <Progress value={roundedValue} className={` ${props.row.original.phishingScore?.totalRiskScore>70?"bg-red-600":props.row.original.phishingScore.totalRiskScore>50?"bg-yellow-500":"bg-green-600"}`}/>

            </>

          );
        }}
      </AnimatedProgressProvider>
          </div>
        ),
      },
]

  return (
    <div>
        <Card  className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">High-Risk Users</CardTitle>
                    
                  </CardHeader>
                  <CardContent className="space-y-4" >

        <div className=" border-lightGray mx-auto  rounded-xl border">
                  
                    <DataTable
                      data={humanRiskData || []}
                      isLoading={false}
                      columns={columns}
                    />
                 
        
                  {humanRiskData ? (
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