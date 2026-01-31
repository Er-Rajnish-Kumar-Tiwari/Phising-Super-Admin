import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import PhishingStatistic from "./TabsContent/PhishingStatistics"




const Reporting = () => {
    // const [isLoading,setIsLoading]=useState(false)
    
  return (
    <div className=' bg-white min-h-[calc(100vh-30px)]'>
        <div className='container mx-auto'>
        {/* <div className='flex flex-col pt-4 pb-8'>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="h-32 rounded-xl bg-white" ></div>
                    <div className="h-32 rounded-xl bg-white" ></div>
                    <div className="h-32 rounded-xl bg-white" ></div>
                </div>

        </div> */}
        <div className="bg-white px-4 rounded-lg ">
        {/* <Tabs defaultValue={"phishing-statistics"} className="" >
      <TabsList className="grid w-full grid-cols-2 mb-4" >
        <TabsTrigger value="phishing-statistics" className="hover:border-2 hover:text-[#7460ee]">phishing Statics</TabsTrigger>
      </TabsList>
      <TabsContent value="phishing-statistics" className="w-[95%] ">

        <PhishingStatistic/>
        </TabsContent>
        </Tabs> */}

        <PhishingStatistic/>
        </div>
        </div>
    </div>

  )
}

export default Reporting