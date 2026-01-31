import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {useVerifyEmail } from "@/service";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useGenerateVerifyied, useUpdateEmail } from "@/service/employee";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

export const OtpValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  pin: Yup.string().required("OTP is required"),
});

type DomainVerifyType={
  modalForm:any
  setIsOpen:Dispatch<SetStateAction<boolean>>
  refetch: <TPageData>(
          options?: RefetchOptions & RefetchQueryFilters<TPageData>
        ) => Promise<QueryObserverResult<any, Error>>;
}

const VerifyDomain = ({modalForm,setIsOpen,refetch}:DomainVerifyType) => {
  const [isShow,setIsShow]=useState(false);

  // Reset form and state when component mounts or when dialog opens
  React.useEffect(() => {
    // Reset the form to default values
    modalForm.reset({
      email: "",
      pin: "",
    });
    // Reset the show state
    setIsShow(false);
  }, []);

  // Reset form when dialog closes
  const handleClose = () => {
    modalForm.reset({
      email: "",
      pin: "",
    });
    setIsShow(false);
    setIsOpen(false);
  };


  const {mutate:UpdateEmailStatus}=useUpdateEmail({
    onSuccess(data) {
      console.log("setIsOpen",data)
      refetch()
      // Reset form and close dialog
      modalForm.reset({
        email: "",
        pin: "",
      });
      setIsShow(false);
      setIsOpen(false)
    },
  })

  const { mutate: GenerateEmail } = useGenerateVerifyied({
    onSuccess(data: any) {
      console.log(data);
      toast.success(`OTP sent to ${data.data.email}`)
      setIsShow(true)
    },
    onError(error:any) {
      console.log(error)
      toast.error(`${error.response.data.message}`);
    },
  });

  const { mutate: verifyEmail } = useVerifyEmail({
    onSuccess(data) {
      console.log(data);
        UpdateEmailStatus({email:data?.data.email})
        toast.success("Email verified successfully");
      
      
    },
    onError(error:any) {
      console.log(error)
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = async (data: { email: string,pin:string }) => {
    console.log(data);

    try {
    //   const obj = {
    // email:getValues("email"),
    // otp: modalForm.getValues('pin'),
    // }
    verifyEmail({email:data.email,otp:data.pin})
      // ForgetPassword({ email: data.email });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };


  const handleGenerateEmail = () => {
    // console.log(data);

    try {
      const val=modalForm.getValues("email")
      GenerateEmail({ email: val,userId:localStorage.getItem("user") as string});
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form className="w-full p-4  border-b-[1px] border-gray-300" onSubmit={modalForm.handleSubmit(onSubmit)}>
        

        <p className="text-gray-700 mb-6">
          Domain verification is performed through challenge-response
          authentication of the provided email address. (e.g.
          support@mybusiness.com will verify mybusiness.com.)
        </p>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address *
          </label>
          <input
            type="email"
            {...modalForm.register("email")}
            // onChange={(e) =>{ modalForm.setValue("email",e.target.value); modalForm.watch("email")}}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email Address"
          />
          {modalForm.formState.errors.email && (
            <div className="text-destructive mt-2">
              {modalForm.formState.errors.email.message}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleGenerateEmail}
          disabled={!modalForm.watch("email") || !!modalForm.formState.errors.email} // Disable if email is empty
          className={`bg-purple-950 text-white hover:bg-purple-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !modalForm.watch("email") || modalForm.formState.errors.email
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-800"
          }`}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Generate Verification Email
        </button>
        <p className="flex text-gray-700 text-[12px] mt-4">
          Haven't received the verification code? Try generating another
          verification email.
        </p>
      
      {isShow && (
        <div className=" flex items-center w-[92%] gap-6 px-4  py-4">
        <label
          htmlFor="eVCode"
          className="col-sm-3 text-center p-l-25"
        >
          Input Code: <span className="text-red-500">*</span>
        </label>
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...modalForm.register("pin")}
            placeholder="XXXX-XXXX"
          />
          {modalForm.formState.errors.pin && (
            <div className="text-red-500 mt-2">
              {modalForm.formState.errors.pin.message}
            </div>
          )}
        </div>
        <div className="col-sm-3">
        <button
            type="submit"
            className="btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            // onClick={handleCodeVerification}
          > Verify
          </button>
        </div>
      </div>
      )}
      
      
      </form>
      <div className="w-full flex justify-end  mb-4 pr-4  border-t pt-4 border-gray-300">
        <Button onClick={handleClose} className="bg-purple-950 text-white hover:bg-purple-700">Close</Button>
      </div>
    </div>
  );
};

export default VerifyDomain;
