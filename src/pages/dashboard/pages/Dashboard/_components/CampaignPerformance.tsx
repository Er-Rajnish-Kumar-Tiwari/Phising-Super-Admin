import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import { Progress } from '@/components/ui/progress';
import { useMonthlyTrend, useRecentCampaign } from '@/service/dashboard';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

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

// const chartData = [
//     { month: "January", desktop: 186, date: "2024-04-01"},
//     { month: "February", desktop: 250,date: "2024-04-02" },
//     { month: "March", desktop: 237,date: "2024-04-03" },
//     { month: "April", desktop: 73,date: "2024-04-04" },
//     { month: "May", desktop: 209,date: "2024-04-05" },
//     { month: "June", desktop: 214,date: "2024-04-06" },
//   ]

type MonthlyTrendData = {
  month: string;
  clickRate: number;
}[];

type ChartConfig = {
  [key: string]: {
    label: React.ReactNode;
    color: string;
  };
};

const chartConfig = {
  clickRate: {
    label: <p className='font-bold text-lg text-[#2563eb] pr-2'>Click Rate</p>,
    color: "#E53935",
  },
  count: {
    label: <p className='font-bold text-lg text-[#2563eb] pr-2'>Click Rate</p>,
    color: "#E53935",
  }
  // mobile: {
  //   label: <p className='font-bold text-lg text-[#60a5fa]'>Report Rate</p>,
  //   color: "#2563eb",
  // },
} satisfies ChartConfig


const CampaignPerformance = () => {
  const navigate = useNavigate();
  const {data:MonthlyTrend}=useMonthlyTrend({
    id:localStorage.getItem("user") as string
    // id:"67e24139925615b9c3fd4dfc"
  })

  const {data:RecentCampaign}=useRecentCampaign({
    id:localStorage.getItem("user") as string
    // id:"67e24139925615b9c3fd4dfc"
  })
  // const [timeRange, setTimeRange] = React.useState("90d")
  // const filteredData = MonthlyTrend.filter((item) => {
  //   const date = new Date(item.date)
  //   const referenceDate = new Date("2024-06-30")
  //   let daysToSubtract = 90
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7
  //   }
  //   const startDate = new Date(referenceDate)
  //   startDate.setDate(startDate.getDate() - daysToSubtract)
  //   return date >= startDate
  // })

  
  console.log(MonthlyTrend)
  console.log(RecentCampaign)
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card  className="rounded-2xl shadow-md">
          <CardHeader>
            <div className='flex justify-between'>
              <CardTitle className="text-lg">Recent Campaign</CardTitle>
              <Button onClick={()=>navigate("/campaign")} className='bg-purple-950 text-white hover:bg-purple-800'>View More</Button>
            </div>
            
            
          </CardHeader>
      {RecentCampaign?.map((report, index) => (
        
          <CardContent className="space-y-4" key={index} >
            <div className='flex justify-between items-center border border-gray-200 rounded-md py-6 px-4'>
                <div>
                <CardTitle className="text-lg">{report.campaignName}</CardTitle>
                <div className='flex gap-2 items-center'>
                {/* <p className="text-sm bg-brand py-2 px-3 rounded-full">
              {"Social"}  
            </p> */}
            <p className=''>{moment(report.campainCreatedAt).format("DD-MM-YYYY")}</p>
                </div>
            
                </div>
                <div className='flex flex-col gap-3 w-[40%] mt-2'>
                <div>
              {/* <p className="text-sm font-medium mb-1">Clicked</p> */}
              <Progress value={report.clickRate==0?3:report.clickRate} className={`${report.clickRate==100?"text-green-600 bg-green-600":"text-red-600 bg-red-600"}`}/>
              
            </div>
            {/* <div>
              <Progress value={parseInt(report.reported)} className='bg-brand text-brand'/>
              <p className="text-right text-xs font-bold text-green-600 mt-1">
              Reported {report.reported}
              </p>
              </div> */}
               
                </div>
            </div>
            
          </CardContent>
        
      ))}
      </Card>
        <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
        <CardTitle className='font-bold text-xl'>Montly Trends</CardTitle>
        <CardDescription className='text-md'>Phishing campaign performance overview</CardDescription>
        </div>
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={MonthlyTrend}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              // domain={[0, 100]} // Set fixed domain for percentage
            />

            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            /> */}
            <Tooltip 
              formatter={(value) => [`${value}%`, "Click Rate"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar 
              dataKey="count" 
              fill={chartConfig.clickRate.color} 
              radius={[4, 4, 0, 0]} 
              name="Count"
            />
            {/* <Bar 
              dataKey="clickRate" 
              fill={chartConfig.clickRate.color} 
              radius={[4, 4, 0, 0]} 
              name="Click Rate"
            /> */}
            {/* <Bar dataKey="clickRate" fill="var(--color-desktop)" radius={4} /> */}
            {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
    </div>
    </div>
  )
}

export default CampaignPerformance