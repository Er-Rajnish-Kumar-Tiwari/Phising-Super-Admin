import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRemoveEmail, useRemoveEmployee } from '@/service/employee';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRemoveCampaign } from '@/service/campaign';

type DeleteType={
    campaignListId:string
}
const DeleteCampaign = (props:DeleteType) => {
    const queryClient = useQueryClient();
    const {campaignListId}=props
    const [isDelete, setIsDelete] = useState(false);
    const {mutate:RemoveEmployee}=useRemoveCampaign({
        onSuccess(data) {
            console.log(data)
            queryClient.refetchQueries()
            setIsDelete(false)
            toast.success("Campaign deleted successfully")
        },
    })
    const handleDelete=()=>{
        try{
            RemoveEmployee({campaignId:campaignListId})
        }
        catch(err){

        }
    }
  return (
    <div>
         <div className='flex items-center justify-center'>
    <button
        onClick={() => setIsDelete(true)}
        className="text-red-500 hover:text-red-700"
      >
        ❌
      </button>
      </div>
    <Dialog open={isDelete} onOpenChange={setIsDelete}>
                    <DialogContent className='mb-[10]  max-h-[40.6875rem]  lg:max-w-[28rem] p-0'>
                    {/* <DialogContent className="mb-[10]   max-h-[40.6875rem]  lg:max-w-[35rem] p-0"> */}
                              <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
                                <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
                                  Delete Campaign
                                </DialogTitle>
                              </DialogHeader>
                      
                      <div className="  p-6 ">
                  <div className=" max-w-sm w-full">
                    <div className='text-red-400 flex justify-center mb-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    </div>
                    <h2 className="text-3xl  mb-4 text-center text-[#595959]">Are you sure?</h2>
                    <p className="text-gray-600 mb-6 text-sm text-center">You will not be able to recover the user!</p>
                    <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleDelete}
                        className="px-8 py-2 bg-red-400 text-lg text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Yes, remove them.
                      </button>
                      <button
                        onClick={()=> setIsDelete(false)}
                        className="px-4 py-2 text-white text-lg bg-[#aaa] border border-gray-300 rounded-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      
                    </div>
                  </div>
                </div>
                      </DialogContent>
                  </Dialog>
          </div>
  )
}

export default DeleteCampaign