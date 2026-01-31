import AnimatedProgressProvider from '@/components/CircularProgressBar/AnimatedProgressProvider';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOverview } from '@/service/dashboard';
import { Users,Mail } from 'lucide-react';
import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

interface SeoMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}

export function Overview() {

  const{data:OverviewData}=useOverview({
    id:localStorage.getItem("user") as string
  })

  const seoMetrics: SeoMetric[] = [
    { label: 'Total Users', value: OverviewData?.users as number, icon: <Users className="size-6 text-brand" />, change: '+10%', positive: true },
    { label: 'Active Campaign', value: OverviewData?.campaign as number, icon: <Mail className="size-6 text-brand" />, change: '+15%', positive: true },
    // { label: 'Click Rate', value: '31%', icon: <TrendingUpIcon className="size-4" />, change: '+1', positive: true },
    // { label: 'Report Submitted', value: '47%', icon: <TrendingDownIcon className="size-4" />, change: '-1', positive: false },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {seoMetrics.map((metric, index) => (
        <Card key={index} className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{metric.label}</CardDescription>
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

<Card className="@container/card relative">
          <CardHeader className="">
            <CardDescription>Click Rate</CardDescription>
            <CardTitle className=" @[250px]/card:text-3xl text-3xl font-bold tabular-nums">
            {OverviewData?.emailTracking?.clickRate} %
            </CardTitle>
            {/* <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-gray-200">
                <CircleAlert className="size-6"/>
              </Badge>
            </div> */}
            <div className="absolute right-4 top-0">
              {/* <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-4" />
                +15%
              </Badge> */}
              <div className='w-20 h-20 mt-2'>
              <AnimatedProgressProvider
        valueStart={0}
        valueEnd={parseFloat(OverviewData?.emailTracking?.clickRate?.toString() || "0")}
        duration={1.4}
        // easingFunction={easeQuadInOut}
        // repeat
      >
        {value => {
          const roundedValue = Math.round(value);
          // console.log(roundedValue)
          return (
            <CircularProgressbar
            background={false}
              value={value}
              text={`${roundedValue}%`}
              className=''
              styles={buildStyles({ pathTransition: "none" })}
            />
          );
        }}
      </AnimatedProgressProvider>
              </div>
            </div>
          </CardHeader>
          {/* <CardFooter className="absolute bottom-0 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {true ? 'Positive trend' : 'Needs improvement'} <TrendingUpIcon className="size-4" />
            </div>
          </CardFooter> */}
        </Card>

        {/* <Card className="@container/card relative">
          <CardHeader className=" pb-2">
            <CardDescription>Report Submitted</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-3xl font-bold tabular-nums">
            
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-4" />
                -5%
              </Badge>
              <div className='w-20 h-20 mt-2'>
              <AnimatedProgressProvider
        valueStart={0}
        valueEnd={47}
        duration={1.4}
        // easingFunction={easeQuadInOut}
        // repeat
      >
        {value => {
          const roundedValue = Math.round(value);
          return (
            <CircularProgressbar
              value={value}
              text={`${roundedValue}%`}

              styles={buildStyles({ pathTransition: "none",pathColor: `rgb(220, 38, 38)` })}
            />
          );
        }}
      </AnimatedProgressProvider>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="absolute bottom-0 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {false ? 'Positive trend' : 'Needs improvement'} <TrendingDownIcon className="size-4" />
            </div>
          </CardFooter>
        </Card> */}

    </div>
  );
};