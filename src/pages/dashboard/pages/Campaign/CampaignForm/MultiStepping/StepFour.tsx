import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CampaignFrequency } from "@/service/campaign/api";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTestEmail } from "@/service/campaign";
import  { toast } from "react-hot-toast";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

interface StepProps {
  getValues: any;
}

const StepFour: React.FC<StepProps> = ({ getValues }) => {
  // const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("once");
  const [selectedSchedule, setSelectedSchedule] = useState("setup");
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

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
  };

  const handleScheduleChange = (schedule: string) => {
    setSelectedSchedule(schedule);
  };

  // const toggleAdvanced = () => {
  //   setShowAdvanced(!showAdvanced);
  // };

  const toggleTestEmail = () => {
    setShowTestEmail(!showTestEmail);
  };

  const handleTestEmail = () => {
  const email = TestEmail.getValues("email");

  // ❌ Empty email
  if (!email) {
    toast.error("Please enter an email address");
    return;
  }

    
    // e.preventdefault()
    // console.log("data", data);
    userTestEmail({
      email: TestEmail.getValues("email"),
      templateId: getValues("step2.selectedTemplate")[0],
      userId: localStorage.getItem("user") as string,
    });
  };
  console.log(getValues("step1.selectedEmployees"));
  console.log("weeklty", getValues("step3.schedulefrequency"));
  console.log(
    getValues("step3.schedulefrequency") === CampaignFrequency.Weekly
  );
  console.log(getValues("step3.scheduleType"));

  return (
    <section className="overflow-auto max-h-[50vh] overflow-y-scroll mb-4">
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
            value={getValues("step1.campaignName")}
            placeholder="Campaign Name"
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row mb-4">
        <label className="w-full md:w-1/6 mb-2 md:mb-0 md:pr-4">
          Target Employee(s)
        </label>
        <div className="w-full flex gap-2 p-2 md:w-5/6 bg-[#e9ecef] items-center">
          {getValues("step1.selectedEmployees").map((item: any, index: any) => (
            <div
              className="border p-2 rounded-lg  text-black"
              key={index}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden flex-col md:flex-row mb-4">
        <label className="w-full md:w-1/6 mb-2 md:mb-0 md:pr-4">
          Training Frequency
        </label>
        <div className="w-full md:w-5/6">
          <select
            className="w-full p-2 border rounded h-9"
            id="trainFrequencyR"
            disabled
          >
            <option value="once">One-off</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="annual">Annually</option>
          </select>
        </div>
      </div>

      <div className="hidden">
        <div className="flex flex-col md:flex-row mb-4">
          <label className="w-full md:w-1/6 mb-2 md:mb-0 md:pr-4">
            Expire After
          </label>
          <div className="w-full md:w-5/6 flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              id="datepicker-autoclose-wizard-training-review"
              disabled
            />
            <div className="p-2 border rounded bg-gray-100">
              <span className="ti-calendar"></span>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Delivery Schedule */}
      <div className="mb-4 mt-4">
        <label className="w-full md:w-1/6 mb-2 md:mb-0  md:pr-4">
          Delivery Schedule
        </label>
        <div className="flex space-x-2 my-4">
          <div>
            <input
              type="radio"
              className="hidden"
              id="chkScheduleImmediate3"
              name="inlineRadioOptions3"
              disabled
              checked={selectedSchedule === "immediately"}
              onChange={() => handleScheduleChange("immediately")}
            />
            <label
              htmlFor="chkScheduleImmediate3"
              className={`px-4 py-2 rounded cursor-pointer opacity-65 ${
                getValues("step3.scheduleType") == "immediately"
                  ? "bg-purple-950 text-white"
                  : "bg-gray-200"
              }`}
            >
              Deliver Immediately
            </label>
          </div>
          <div>
            <input
              type="radio"
              className="hidden"
              id="chkSchedule3"
              name="inlineRadioOptions3"
              checked={selectedSchedule === "setup_later"}
              onChange={() => handleScheduleChange("setup_later")}
            />
            <label
              htmlFor="chkSchedule3"
              className={`px-4 py-2 rounded cursor-pointer opacity-65 ${
                getValues("step3.scheduleType") == "setup_later"
                  ? "bg-purple-950 text-white"
                  : "bg-gray-200"
              }`}
            >
              Setup Schedule
            </label>
          </div>
        </div>
        {getValues("step3.scheduleType") === "setup_later" && (
          <div className=" grid grid-cols-1  gap-4 mb-4">
            {/* Schedule Between Days */}
            <Datepicker
              useRange={false}
              containerClassName="relative w-full min-w-[200px]"
              value={{
                startDate: new Date(getValues("step3.startDate")),
                endDate: new Date(getValues("step3.endDate")),
              }}
              disabled
              inputName="step3.scheduleDateTime"
              popoverDirection="up"
              onChange={() => console.log("change")}
              toggleClassName={(className) =>
                cn(
                  className,
                  "text-[#696767]",
                  "bg-gray-300 rounded-tr-[0.325rem] rounded-br-[0.325rem] absolute right-0"
                )
              }
              inputClassName={cn(
                "rounded-[0.325rem] h-[2.5rem] w-full border-2 border-[#F6F6F6]",
                "text-[#696767] p-3 text-black outline-none"
              )}
            />

            {/* Schedule Between Times */}
            <div>
              <label className="block mb-2">Schedule (Between Times)</label>
              <div className="flex items-center">
                <input
                  type="time"
                  className="flex-1 p-2 border rounded"
                  id="schTimeStart3"
                  defaultValue={getValues("step3.startTime")}
                  disabled
                />
                <div className="px-2">To</div>
                <input
                  type="time"
                  className="flex-1 p-2 border rounded"
                  id="schTimeEnd3"
                  defaultValue={getValues("step3.endTime")}
                  disabled
                />
              </div>
            </div>

            {/* Schedule Time Zone */}
          </div>
        )}
      </div>

      {/* Campaign Frequency */}

      <hr />

      {/* Send Test Email */}
      <div className="flex w-full flex-col md:flex-row items-center mt-4">
        <div className="flex items-center gap-2 w-[200px]">
          {/* <label className=" text-left">Send Test Email</label> */}
          <label
            htmlFor="manualImport2"
            className="flex items-center space-x-1"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center">
                    <span className=" py-2">Send Test Email</span>
                    
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-48 bg-black px-4 text-center">
                  <p>
                    Test emails don't count towards your monthly email quota and
                    employee data e.g. First Names, etc. will appear as John
                    Doe, IT Manager at Contoso Corp.{" "}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>

          <input
            type="checkbox"
            id="chkScheduleNow2"
            className="w-4 h-4"
            onChange={toggleTestEmail}
          />
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
                    TestEmail.watch("email");
                  }}
                  // defaultValue="udit.agarwal@cywall.co"
                  required
                />
                {TestEmail.formState.errors.email && (
                  <div className="text-destructive mt-2 absolute -bottom-6">
                    {TestEmail.formState.errors.email.message}
                  </div>
                )}
              </div>
              <div className="w-1/5 pl-4 bg-purple-950 text-white hover:bg-purple-700 text-center rounded flex items-center justify-center">
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
                  className="px-4 py-2"
                >
                  Send Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StepFour;
