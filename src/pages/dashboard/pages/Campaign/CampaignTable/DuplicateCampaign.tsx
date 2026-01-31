import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useDuplicateCampaign } from '@/service/campaign';
import { campaignTableQueries } from '@/service/queryKeys';
import { Copy, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const validationSchema = yup.object().shape({
  
  campaignName: yup
  .string()
  .required("Enter your Company Name")
  // .matches(/^[A-Za-z\s-]+$/, "Name must contain only alphabetic characters and hyphens"),
});

type DeleteType={
    campaignId:string
    Name:string
}
const DublicateCampaign = (props:DeleteType) => {
    const queryClient = useQueryClient();
    const {campaignId,Name}=props
    const [isDublicate, setIsDublicate] = useState(false);
    const {mutate:DuplicateCampaign}=useDuplicateCampaign({
        onSuccess(data) {
            console.log(data)
            
            // Show success message
            toast.success("The campaign has been duplicated")
            
            // Properly invalidate and refetch campaign queries
            const userId = localStorage.getItem("user") as string;
            queryClient.invalidateQueries({
                queryKey: ["campaign", "getCampaignList"],
                refetchType: 'active'
            });
            
            setIsDublicate(false)
            reset({
                campaignName:"",
              })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to duplicate campaign")
        },
    })

    const {
            register,
            handleSubmit,
            reset,
            setValue,
            getValues,
            watch,
            trigger,
            formState: { errors },
          } = useForm({
            resolver: yupResolver(validationSchema),
            mode: "onChange",
            defaultValues: {
              campaignName: `${Name} - Copy`,
              // country:{label:'',value:''},
            },
          });

    
        const handleDublicate = (data:{campaignName:string}) => {
         
          DuplicateCampaign({userId:localStorage.getItem("user") as string,campaignId:campaignId,campaingName:data.campaignName})
        };
  return (
    <div>
         <div className='flex items-center justify-center'>
    <button
        onClick={() => setIsDublicate(true)}
        className="text-red-500 hover:text-red-700"
      >
        <Copy className="w-5 h-5 mr-2 text-brand" />
      </button>
      </div>
    <Dialog open={isDublicate} onOpenChange={()=>{
        setIsDublicate(false);
        setValue(
            "campaignName",`${Name} - Copy`
        );
    }}>
                    <DialogContent className='mb-[10]  max-h-[40.6875rem]  lg:max-w-[35rem] p-0'>
                    {/* <DialogContent className="mb-[10]   max-h-[40.6875rem]  lg:max-w-[35rem] p-0"> */}
                              <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
                                <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
                                Duplicate Campaign
                                </DialogTitle>
                              </DialogHeader>
                      
                              <div className="p-8">
      <form 
        className="needs-validation" 
        noValidate 
        id="duplicateCampaignForm" 
        onSubmit={handleSubmit(handleDublicate)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="dupName" 
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Duplicating Campaign
            </label>
            <div>
              <Input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-300"
                id="dupName"
                placeholder="Duplicating Campaign"
                value={Name}
                aria-invalid="false"
                disabled
                // value={originalCampaignName || ''}
              />
              {/* <div className="text-sm text-red-600">
                Which campaign is being duplicated?
              </div> */}
            </div>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="dupNewName" 
              className="block text-sm font-medium text-gray-700 text-left"
            >
              New Campaign Name
            </label>
            <div>
              <Input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                id="dupNewName"
                
                {...register("campaignName")}
                placeholder="New Campaign Name"
                // value={getValues("campaignName")}
                onChange={(e)=> setValue("campaignName",e.target.value)}
                aria-invalid="false"
              />
              {errors.campaignName && (
                      <div className="text-destructive ">
                        {errors.campaignName.message}
                      </div>
                    )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-center space-x-3">
              <button
                id="duplicateButton"
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Copy className="w-5 h-5 mr-2" />
                Duplicate
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={()=>setIsDublicate(false)}
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
                      </DialogContent>
                  </Dialog>
          </div>
  )
}

export default DublicateCampaign