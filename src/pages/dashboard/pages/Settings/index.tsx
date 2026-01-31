import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetails from "./UserDetails";
import PlatformSettings from "./PlatformSettings";
import { useGetUserDetails, useUpdateProfile } from "@/service/settings";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo1.png";

const validationSchema = yup.object().shape({
  companyName: yup
    .string()
    .matches(
      /[A-Za-z0-9]/, // Must contain at least one letter OR number
      "Name must contain at least one alphabet or numeric character",
    )
    .required("Enter your Company Name"),
  // .trim()
});

const Settings = () => {
  const [isOpenCampany, setIsCompany] = useState(false);

  const { data: UserDetail, refetch } = useGetUserDetails();
  const { mutate: UpdateUserProfile } = useUpdateProfile({
    onSuccess(data) {
      console.log(data);
      setIsCompany(false);
      refetch();
      reset({
        companyName: "",
      });
    },
  });
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
      companyName: "",
      // country:{label:'',value:''},
    },
  });

  const onSubmitHandler = (data: any) => {
    const obj = {
      userId: localStorage.getItem("user") as string,
      companyName: data.companyName,
    };
    UpdateUserProfile(obj);
  };

  console.log("userData1");
  console.log(UserDetail);
  return (
    <div className="container bg-white">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3  py-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 ">
              <div className="flex flex-col items-center mt-4">
                <img src={logo} alt="Company Logo" className="w-36" />
                <h4 className="text-xl font-semibold mt-2">
                  Platform Super Admin
                </h4>
                <h6 className="text-gray-500">{UserDetail?.email}</h6>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="p-6 ">
              <div className="mb-4">
                <p className="text-sm text-gray-700">Company</p>
                <div className="flex items-center">
                  <h6 className="text-base font-medium">
                    {UserDetail?.companyName}
                  </h6>
                  <button
                    onClick={() => setIsCompany(true)}
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                    aria-label="Update Company Name"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-square-pen-icon lucide-square-pen"
                    >
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                    </svg>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-arrow-out-down-left-icon lucide-square-arrow-out-down-left"><path d="M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"/><path d="m3 21 9-9"/><path d="M9 21H3v-6"/></svg> */}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">Tenant ID</p>
                {/* <h6 className="text-base font-medium">bedc828f-546f-4b50-88cd-e6cb24b19748</h6> */}
                <h6 className="text-base font-medium">{UserDetail?._id}</h6>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">Data Storage Location</p>
                {/* <h6 className="text-base font-medium">India (Mumbai)</h6> */}
                <h6 className="text-base font-medium">{UserDetail?.country}</h6>
              </div>

              {/* <div className="mb-4 pt-4">
            <p className="text-sm text-gray-700">Current Login Location</p>
            <h6 className="text-base font-medium">Uttar Pradesh, India</h6>
          </div>
          
          <div className="mb-4 pt-4">
            <p className="text-sm text-gray-700">Previous Login Location</p>
            <h6 className="text-base font-medium">NCT, India</h6>
          </div> */}

              <div className="mt-6 rounded-lg overflow-hidden">
                <div className="w-full">
                  <iframe
                    className="w-full h-64"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA3EMHhwq27gLV8V-3-iG3xQyWx_KUq3s0&q=25.28288,83.22668&zoom=3&q=Space+Needle,Seattle+WA"
                    title="Location Map"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3  lg:p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div>
              <Tabs defaultValue={"phishing-statics"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="phishing-statics"
                    className="border-0 hover:border-0 data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#2962FF]"
                  >
                    User Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="training-statistic"
                    className="border-0 hover:border-0 data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:border-[#2962FF]"
                  >
                    Platform Settings
                  </TabsTrigger>
                  {/* <TabsTrigger value="setup_later">Schedule Later</TabsTrigger> */}
                </TabsList>
                <TabsContent value="phishing-statics" className="w-full ">
                  {/* <PhishingStatistic/> */}
                  <UserDetails UserDetail={UserDetail} refetch={refetch} />
                </TabsContent>

                <TabsContent value="training-statistic" className="w-full">
                  <PlatformSettings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpenCampany} onOpenChange={setIsCompany}>
        <DialogContent className="mb-[10]  max-h-[40.6875rem]  lg:max-w-[28rem] p-0">
          {/* <DialogContent className="mb-[10]   max-h-[40.6875rem]  lg:max-w-[35rem] p-0"> */}
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Update Company Name
            </DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="  p-6 ">
              <div onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="space-y-4">
                  {/* Existing Company Name Field */}
                  <div className="flex ">
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-950 text-white hover:bg-purple-800 rounded-l-[4px] flex items-center"
                      title="The existing company name associated to your CanIPhish tenant."
                    >
                      Existing Name
                    </button>
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Existing Company Name"
                      aria-label="name"
                      id="oldCompanyInput"
                      value={UserDetail?.companyName}
                      disabled
                    />
                  </div>

                  {/* New Company Name Field */}
                  <div className="flex">
                    <button
                      type="button"
                      className="px-4 py-2 w-[26%] h-10 bg-purple-950 text-white hover:bg-purple-800 rounded-l-[4px] flex items-center"
                      title="Enter the new company name you would like to associate to your CanIPhish tenant."
                    >
                      New Name
                    </button>
                    <div className=" w-[74%]">
                      <input
                        type="text"
                        {...register("companyName")}
                        className="flex-1 w-full px-4 py-2 h-10 border border-gray-300 rounded-r-[4px] focus:outline-none"
                        placeholder="New Company Name"
                        aria-label="name"
                        name="companyName"
                        onChange={(e: any) => {
                          setValue("companyName", e.target.value);
                          watch("companyName");
                          trigger("companyName");
                        }}
                      />
                      {errors.companyName && (
                        <div className="text-destructive ">
                          {errors.companyName.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="mt-6 mb-4" />

              <div className="flex justify-end space-x-3 py-2 ">
                <button
                  type="button"
                  onClick={() => setIsCompany(false)}
                  className="px-6 py-2 text-white bg-purple-950 hover:bg-purple-800 rounded-[4px] transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  // onClick={onSave}
                  // disabled={saveDisabled}
                  type="submit"
                  className={`px-4 py-2 text-white rounded-[4px] transition-colors duration-200 flex items-center ${
                    getValues("companyName") == ""
                      ? "bg-purple-600"
                      : "bg-purple-950 hover:bg-purple-800"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
