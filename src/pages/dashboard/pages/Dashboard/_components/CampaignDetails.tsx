import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';


const peopleData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      risk: "High Risk",
      category: "Finance",
      test:"5"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      risk: "Medium Risk",
      category: "Executive",
      test:"4"
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      risk: "Low Risk",
      category: "IT",
      test:"3"
    },
]

const reports = [
    {
      name: "Phishing Email Campaign",
      category: "IT",
      date: "2025-04-20",
      clicked: "25%",
      reported: "60%",
    },
    {
      name: "Social Engineering Test",
      category: "Social",
      date: "2025-04-15",
      clicked: "40%",
      reported: "30%",
    },
    {
      name: "Internal Security Awareness",
      category: "Internal",
      date: "2025-04-10",
      clicked: "15%",
      reported: "70%",
    }
  ];

const CampaignDetails = () => {
  return (
    <>
        <div className="grid grid-cols-2 gap-6">
        <Card  className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Recent Campaign</CardTitle>
            
          </CardHeader>
      {reports.map((report, index) => (
        
          <CardContent className="space-y-4" key={index} >
            <div className='flex justify-between items-center border border-gray-200 rounded-md py-6 px-4'>
                <div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <div className='flex gap-2 items-center'>
                <p className="text-sm bg-brand py-2 px-3 rounded-full">
              {report.category}  
            </p>
            <p className=''>{report.date}</p>
                </div>
            
                </div>
                <div className='flex flex-col gap-3 w-[40%] mt-2'>
                <div>
              {/* <p className="text-sm font-medium mb-1">Clicked</p> */}
              <Progress value={parseInt(report.clicked)} className='text-red-600 bg-red-600'/>
              
            </div>
            <div>
              {/* <p className="text-sm font-medium mb-1">Reported</p> */}
              <Progress value={parseInt(report.reported)} className='bg-brand text-brand'/>
              <p className="text-right text-xs font-bold text-green-600 mt-1">
              Reported {report.reported}
              </p>
              </div>
               
                </div>
            </div>
            
          </CardContent>
        
      ))}
      </Card>

      <Card  className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">High-Risk Users</CardTitle>
            
          </CardHeader>
      {peopleData.map((report, index) => (
        
          <CardContent className="space-y-4" key={index} >
            <div className='flex justify-between items-center border border-gray-200 rounded-md py-6 px-4'>
                <div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {report.category} • {report.email}
            </p>
            <div className='flex gap-2 items-center'>
                <p className={`text-sm ${report.risk=="High Risk"?"bg-red-200 text-red-600":report.risk=="Medium Risk"?"bg-yellow-200 text-yellow-500":"bg-green-200 text-green-600"} p-2 rounded-lg`}>
              {report.risk}  
            </p>
            <p className=''>{report.category}</p>
                </div>
                </div>
                <div className='flex flex-col gap-4 w-[40%]'>
                
                <p className="text-right text-lg font-medium mt-1">
                {report.test} failed tests
              </p>
              <p className="text-lg text-right font-medium mb-1">Assign Training</p>
              
            
                </div>
            </div>
            
          </CardContent>
        
      ))}
      </Card>
    </div>
    </>
  )
}

export default CampaignDetails