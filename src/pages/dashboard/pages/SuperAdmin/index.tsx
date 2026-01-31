import { Overview } from './_components/overview'
import CampaignDetails from '../Dashboard/_components/CampaignDetails'
import HumanRisk from './_components/HumanRisk'
import { useRecent } from '@/service/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

const Dashboard = () => {
  const {data,isLoading,isFetching}=useRecent({onSuccess(data) {
    console.log("dash data",data)
  },})

  console.log("dash data1",data)
  return (
    <>
        <main className='peer-[.header-fixed]/header:mt-16 space-y-4 px-4 py-4 bg-[#EEF5F9]'>
        {data ? (
                      <Overview totalUsers={data.totalUsers} totalCampaigns={data.totalCampaigns} totalOrganizations={data.totalOrganizations}/>

        ):(
          <div className="h-[100px] grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            <Skeleton
          className='  rounded-md'
          // data-sidebar='menu-skeleton-icon'
        />
        <Skeleton
          className=' rounded-md'
          // data-sidebar='menu-skeleton-icon'
        />
        <Skeleton
          className=' rounded-md'
          // data-sidebar='menu-skeleton-icon'
        />
          </div>
          
        )}
        
            <HumanRisk item={data?.organizations} isLoading={isLoading} isFetching={isFetching}/>
            <CampaignDetails/>
        </main>
        
    </>
  )
}

export default Dashboard