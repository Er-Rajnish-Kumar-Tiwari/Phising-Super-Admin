import { cn } from "@/lib/utils";
import { CampaignFrequency, CampaignStep } from "@/service/campaign/api";
import React, { useMemo, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTestEmail, useUpdateCampaign } from "@/service/campaign";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { campaignTableQueries } from "@/service/queryKeys";
import { SelectComponent } from "@/components/SelectComponet";
import { SelectStyles } from "@/pages/auth/pages/constant";
import { useGetEmployeeListById } from "@/service/employee";
import { Save, X } from "lucide-react";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

interface StepProps {
  campaignData: any;
  // getValues?:any
}

const EditCampaign: React.FC<StepProps> = ({ campaignData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [selectEmployee, setSelectEmployee] =
    useState<{ label: string; value: string }[]>();
  const [selectedFrequency, setSelectedFrequency] = useState(
    campaignData.schedulefrequecy,
  );
  const [selectedSchedule, setSelectedSchedule] = useState(
    campaignData.scheduleType,
  );
  const [value, setValues] = useState({
    startDate: new Date(campaignData.startDate),
    endDate: new Date(campaignData.endDate),
  });
  const [valueTime, setValueTime] = useState({
    startTime: campaignData.startTime,
    endTime: campaignData.endTime,
  });

  const [valueDateTime, setValueDateTime] = useState<DateValueType>({
    startDate: new Date(campaignData.scheduleDateTime),
    endDate: new Date(campaignData.scheduleDateTime),
  });
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isLoading,setIsLoading]=useState(false)
  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    // userSubType: params.get('userSubType') || '',
    search: searchQuery,
    // sortBy: params.get('sortBy') || '',
    // sortId: params.get('sortId') || '',
  };
  const {
    data: employeeData,
    // isLoading,
    // isFetching,
  } = useGetEmployeeListById(
    {
      ...tableParams,
    },
    { enabled: isOpen },
  );
  const { mutate: UpdateCampaign } = useUpdateCampaign({
    onSuccess(data) {
      console.log("data");
      console.log(data.data.data);
      // setValue("step2.campaignId", data?.data.data._id);
      // console.log(getValues("step2.campaignId"));

      // 2. Proper query invalidation
      const userId = localStorage.getItem("user") as string;
      const queryKey = campaignTableQueries.getCampaignList({
        id: userId,
        page: 1,
        pageSize: 10,
        search: "",
      }).queryKey;

      // 3. Add async/await and error handling
      const handleInvalidation = async () => {
        try {
          // await queryClient.invalidateQueries({
          //   queryKey:[queries?.campaign?.getCampaignList],
          //   refetchType: 'active' // Force immediate refetch
          // });
          await queryClient.refetchQueries({
            queryKey: ["campaign", "getCampaignList"],
          });
          console.log("Invalidation successful for:", queryKey);
        } catch (error) {
          console.error("Invalidation failed:", error);
        } finally {
          setIsOpen(false);
        }
      };
      handleInvalidation();
    },
    onError: (error: any) => {
      // setIsSubmitting(false);
      // setSubmitError("Failed to create campaign. Please try again.");
      toast.error(error.response.data.message);
    },
  });
  const { mutate: userTestEmail } = useTestEmail({
    onSuccess(data) {
      console.log(data);
      toast.success("The test email was successfully delivered.");
    },
    onError(error: any) {
      toast.error(error.response.data.message);
    },
  });
  const TestEmail = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [scheduleDate, setScheduleDate] = useState<DateValueType>({
    startDate: new Date(campaignData.scheduleDateTime),
    endDate: new Date(campaignData.scheduleDateTime),
  });

  const [scheduleTime, setScheduleTime] = useState(
    campaignData.startTime || "09:00",
  );

  const onSubmit = () => {
    // setIsSubmitting(true);

    // setSubmitError(null);

    try {
      // setIsActive(true)
      console.log("Form Data:");
      // const formData = getValues();
      const employeeData = selectEmployee?.map((item) => ({
        employeeDocumentId: item.value,
      }));

      if (selectedSchedule == "immediately") {
        const campaignInfo = {
          campaignName: campaignData.campaignName as string as string,
          campaignId: campaignData._id,
          employees: employeeData,
          templateIds: campaignData.templateIds as string[],
          userId: localStorage.getItem("user") as string,
          campaignType: "email",

          scheduleType: selectedSchedule,
          scheduleDateTime: valueDateTime?.startDate as any,
          schedulefrequecy: selectedFrequency as CampaignFrequency,
          campaignStep: CampaignStep.REVIEW,
        };
        UpdateCampaign(campaignInfo);
      }

      if (selectedSchedule == "setup_later") {
        const setupObj = {
          campaignName: campaignData.campaignName as string as string,
          campaignId: campaignData._id,
          employees: employeeData,
          templateIds: campaignData.templateIds as string[],
          userId: localStorage.getItem("user") as string,
          campaignType: "email",
          startDate: value.startDate as any,
          endDate: value.endDate as any,
          startTime: valueTime.startTime,
          endTime: valueTime.endTime,
          scheduleDateTime: valueDateTime?.startDate as any,
          schedulefrequecy: selectedFrequency as CampaignFrequency,
          scheduleType: selectedSchedule,
          campaignStep: CampaignStep.REVIEW,
        };
        UpdateCampaign(setupObj);
        // campaignData={...campaignData,setupObj}
      }

      // Campaign(campaignData);
    } catch (error) {
      // setIsSubmitting(false);
      // setSubmitError("An unexpected error occurred");
      console.error("Submission error:", error);
    }
  };

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
  };

  const handleScheduleChange = (schedule: string) => {
    setSelectedSchedule(schedule);
  };

  const toggleTestEmail = () => {
    setShowTestEmail(!showTestEmail);
  };

  const handleTestEmail = () => {
    // console.log("data",data)
    userTestEmail({
      email: TestEmail.getValues("email"),
      templateId: campaignData.templateIds[0],
      userId: localStorage.getItem("user") as string,
    });
  };

  const EmployeeList = useMemo(() => {
    return employeeData?.paginatedData.map((a) => ({
      label: `${a.employeeListName}`,
      value: a._id,
    }));
  }, [employeeData?.paginatedData]);

  // const selectListed = useMemo(() => {

  //   return employeeData?.paginatedData.map((item)=> item._id).filter((a:any) => a.includes(a.employeeDocumentId._id)
  // ).map((item: any) => ({
  //   label: item.employeeListName,
  //   value: item.value
  // }));

  // }, [campaignData?.employees,EmployeeList]);

  const selectListed = useMemo(() => {
    if (!EmployeeList || !campaignData?.employees) return [];

    // Get all employee userIds from the campaign
    const campaignEmployeeIds = campaignData?.employees.map(
      (emp: any) => emp.employeeDocumentId?._id,
    );

    return EmployeeList.filter((employee: any) =>
      campaignEmployeeIds.includes(employee.value),
    ).map((employee: any) => ({
      label: employee.label,
      value: employee.value,
    }));
  }, [campaignData?.employees, EmployeeList]);
  //   console.log(getValues("step1.selectedEmployees"))
  //   console.log("weeklty",getValues("step3.schedulefrequency"))
  //   console.log(getValues("step3.schedulefrequency") === CampaignFrequency.Weekly)
  console.log(selectListed);
  console.log(EmployeeList);
  console.log("campaign Data");
  console.log(campaignData);

  
    const [timezone, setTimezone] = useState("UTC");
  
    const TIMEZONES = [
      { value: "UTC", label: "UTC (Coordinated Universal Time)" },
      { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
      { value: "Europe/London", label: "GMT (London)" },
      { value: "Europe/Paris", label: "CET (Paris)" },
      { value: "Europe/Berlin", label: "CET (Berlin)" },
      { value: "Europe/Moscow", label: "MSK (Moscow)" },
      { value: "America/New_York", label: "EST (New York)" },
      { value: "America/Chicago", label: "CST (Chicago)" },
      { value: "America/Denver", label: "MST (Denver)" },
      { value: "America/Los_Angeles", label: "PST (Los Angeles)" },
      { value: "Asia/Dubai", label: "GST (Dubai)" },
      { value: "Asia/Singapore", label: "SGT (Singapore)" },
      { value: "Asia/Tokyo", label: "JST (Tokyo)" },
      { value: "Asia/Shanghai", label: "CST (China)" },
      { value: "Asia/Hong_Kong", label: "HKT (Hong Kong)" },
      { value: "Asia/Seoul", label: "KST (Seoul)" },
      { value: "Australia/Sydney", label: "AEST (Sydney)" },
      { value: "Australia/Melbourne", label: "AEST (Melbourne)" },
      { value: "America/Sao_Paulo", label: "BRT (São Paulo)" },
      { value: "Africa/Johannesburg", label: "SAST (Johannesburg)" },
    ];


  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(!isOpen);
          TestEmail.reset({});
          setShowTestEmail(false);
        }}
      >
        <DialogTrigger asChild>
          <div className="cursor-pointer">
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
              className="lucide lucide-square-pen-icon lucide-square-pen text-brand"
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
            </svg>
          </div>
        </DialogTrigger>
        <DialogContent className="mb-[10]   max-h-[47.6875rem]  lg:max-w-[65rem] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Edit Campaign
            </DialogTitle>
          </DialogHeader>
          <section className=" mb-4 p-8">
            <hr className="mt-0 mb-4 bg-[#6c757dbf]" />

            {/* Campaign Name */}
            <div className="flex flex-col md:flex-row mb-4">
              <label className="w-full md:w-1/6 text-left mb-2 md:mb-0 md:pr-4">
                Campaign Name
              </label>
              <div className="w-full md:w-5/6">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  id="cname3"
                  value={campaignData.campaignName}
                  placeholder="Campaign Name"
                  disabled
                />
              </div>
            </div>

            {/* Target Employees */}
            <div className="flex flex-col items-center md:flex-row mb-4">
              <label className="w-full md:w-1/6 mb-2 md:mb-0 md:pr-4">
                Target Employee(s)
              </label>
              <div className="w-full flex gap-2 p-2 md:w-5/6 ">
                <SelectComponent
                  // {...register("country")}
                  styles={SelectStyles}
                  options={EmployeeList}
                  placeholder="Select employees"
                  clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                  value={selectEmployee || selectListed}
                  onChange={(selectedOption) => {
                    // setValue("country", selectedOption); // Update the form value
                    setSelectEmployee(selectedOption);
                  }}
                  isMulti
                />
              </div>
            </div>

            <div className="flex-grow space-y-6 mt-6">
              {/* HEADER */}
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-[#101828]">
                  Email Delivery Schedule
                </span>
              </div>

              {/* OPTIONS */}
              <div className="space-y-4">
                {/* IMMEDIATELY */}
                <div
                  onClick={() => handleScheduleChange("immediately")}
                  className={cn(
                    "flex gap-3 cursor-pointer rounded-xl border p-4 transition-all",
                    selectedSchedule === "immediately"
                      ? "border-purple-600 bg-purple-50/30"
                      : "border-gray-200",
                  )}
                >
                  <input
                    type="radio"
                    checked={selectedSchedule === "immediately"}
                    readOnly
                    className="mt-1 accent-purple-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      ⚡ Deliver Immediately
                    </p>
                    <p className="text-sm text-gray-500">
                      Send the email right away as soon as you confirm
                    </p>
                  </div>
                </div>

                {/* SETUP SCHEDULE */}
                <div
                  onClick={() => handleScheduleChange("setup_later")}
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition-all",
                    selectedSchedule === "setup_later"
                      ? "border-purple-600 bg-purple-50/30"
                      : "border-gray-200",
                  )}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      checked={selectedSchedule === "setup_later"}
                      readOnly
                      className="mt-1 accent-purple-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        📅 Schedule for Later
                      </p>
                      <p className="text-sm text-gray-500">
                        Choose a specific date and time to send the email
                      </p>
                    </div>
                  </div>

                  {/* DATE & TIME */}
                  {selectedSchedule === "setup_later" && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      {/* DATE */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <Datepicker
                          useRange={false}
                          asSingle
                          minDate={new Date()}
                          value={scheduleDate}
                          onChange={(val: any) => setScheduleDate(val)}
                          inputClassName="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      {/* TIME */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          Time
                        </label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Frequency */}

            <hr />

            {/* Send Test Email */}
            <div className="flex w-full flex-col md:flex-row items-center mt-4">
              <div className="flex items-center gap-2 w-[15%]">
                <label className=" text-left">Send Test Email</label>
                <div className="">
                  <input
                    type="checkbox"
                    id="chkScheduleNow2"
                    className="w-4 h-4"
                    onChange={toggleTestEmail}
                  />
                </div>
              </div>

              {showTestEmail && (
                <div className="w-full relative">
                  <div className="flex w-[85%] gap-2  ml-4">
                    <div className=" w-full">
                      <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded"
                        placeholder="Enter your own email address"
                        onChange={(e) => {
                          TestEmail.setValue("email", e.target.value);
                          TestEmail.trigger("email");
                        }}
                        onBlur={() => TestEmail.trigger("email")} // Validate when field loses focus
                        value={TestEmail.watch("email") || ""} // Controlled component
                        required

                        // defaultValue="udit.agarwal@cywall.co"
                      />
                      {TestEmail.formState.errors.email && (
                        <div className="text-destructive mt-2 absolute -bottom-6">
                          {TestEmail.formState.errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="w-full pl-4">
                      <button
                        type="button"
                        onClick={() => {
                          // Validate before submitting
                          TestEmail.trigger("email").then((isValid) => {
                            if (isValid) {
                              handleTestEmail();
                            }
                          });
                        }}
                        className="px-4 py-2 bg-purple-950 hover:bg-purple-700 text-white rounded"
                      >
                        Send Test
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card pt-[15px]">
              <div className="card-body flex flex-row justify-center text-center">
                <button
                  id="updateButton"
                  type="submit"
                  onClick={onSubmit}
                  // className={`btn btn-lg mr-[5px] flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${isUpdateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  className={`btn btn-lg mr-[5px] flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md`}
                  // disabled={isUpdateDisabled}
                >
                  <Save className="w-5 h-5" />
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-lg ml-[5px] flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCampaign;
