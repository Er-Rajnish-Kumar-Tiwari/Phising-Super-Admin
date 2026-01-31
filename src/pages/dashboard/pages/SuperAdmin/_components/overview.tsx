import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOverview } from '@/service/dashboard';
import {Users,User,FileText } from 'lucide-react';
import React, { FC } from 'react';


interface SeoMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}

interface OverviewType {
  totalUsers:number,
  totalCampaigns:number
  totalOrganizations:number
}

export const Overview:FC<OverviewType>=({totalUsers,totalCampaigns,totalOrganizations})=> {

  // const{data:OverviewData}=useOverview({
  //   id:localStorage.getItem("user") as string
  // })

  const seoMetrics: SeoMetric[] = [
    { label: 'Total Organisations', value: totalOrganizations as number, icon: <Users className="size-6 text-brand" />, change: '+10%', positive: true },
    { label: 'Registered Users', value: totalUsers as number, icon: <User className="size-6 text-brand" />, change: '+15%', positive: true },
        { label: 'Active Campaigns', value: totalCampaigns as number, icon: <FileText className="size-6 text-brand" />, change: '+15%', positive: true },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {seoMetrics.map((metric, index) => (
        <Card key={index} className="@container/card">
          <CardHeader className="relative">
            <CardDescription className='font-bold'>{metric.label}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-3xl font-bold tabular-nums">
              {metric.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-gray-200">
                {metric.icon}
                {/* {metric.change} */}
              </Badge>
            </div>
          </CardHeader>
          {/* <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.positive ? 'Positive trend' : 'Needs improvement'} {metric.icon}
            </div>
          </CardFooter> */}
        </Card>
      ))}



    </div>
  );
};