import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Stepper, Step } from "react-form-stepper";
import "./style.css";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import { useAddCampaign } from "@/service/campaign";
import { CampaignFrequency, CampaignStep } from "@/service/campaign/api";
import StepFour from "./StepFour";
import { useQueryClient } from "@tanstack/react-query";
import { campaignTableQueries } from "@/service/queryKeys";
import toast from "react-hot-toast";

// Step 1 Schema
const step1Schema = yup.object().shape({
  campaignName: yup.string().required("Please Enter the Campaign Name"),
  selectedEmployees: yup
    .array()
    .of(
      yup.object().shape({
        employeeID: yup.string().required("Employee ID is required"),
        name: yup.string().required("Employee name is required"),
      })
    )
    .min(1, "Please select at least one employee list")
    .required("Please select at least one employee list"),
});

// Step 2 Schema
const step2Schema = yup.object().shape({
  campaignId: yup.string(),
  selectedTemplate: yup
    .array()
    .min(1, "Please select at least one Template")
    .required("Please select at least one Template"),
});

// Step 3 Schema
const step3Schema = yup.object().shape({
  scheduleType: yup.string(),
  schedulefrequency: yup.string(),
  scheduleDateTime: yup.string(),
  startDate: yup
    .string()
    .test('is-future-date', 'Start date cannot be in the past', function(value) {
      if (!value) return true;
      return new Date(value) >= new Date(new Date().toDateString());
    }),
  endDate: yup
    .string()
    .test('is-future-date', 'End date cannot be in the past', function(value) {
      if (!value) return true;
      return new Date(value) >= new Date(new Date().toDateString());
    }),
  startTime: yup
    .string()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time format"),
  endTime: yup
    .string()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time format")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);
        return (
          endHours > startHours ||
          (endHours === startHours && endMinutes > startMinutes)
        );
      }
    ),
});

// Step 4 Schema
const step4Schema = yup.object();

// Combine all schemas
const formSchema = yup.object().shape({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
});

// Define the form data type
type FormData = yup.InferType<typeof formSchema>;

type propsType = {
  setIsOpen: any;
};

const MultiStepForm: React.FC<propsType> = ({ setIsOpen }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      step1: { campaignName: "" },
      step2: {},
      step3: {
        scheduleDateTime: "",
        scheduleType: "immediately",
        schedulefrequency: "once",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "17:00",
      },
      step4: {},
    },
  });

  const steps = [
    { label: "Initial Setup & Employee Selection" },
    { label: "Select Phishing Material" },
    { label: "Set Delivery Schedule" },
    { label: "Review & Submit" },
  ];

  const { mutate: Campaign } = useAddCampaign({
    onSuccess(data) {
      console.log("data");
      console.log(data.data.data);
      toast.success("The campaign has been sent Successfully!");

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
      if (isActive) {
        handleInvalidation();
      }
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = () => {
    try {
      setIsActive(true);
      console.log("Form Data:");
      const formData = getValues();
      const employeeData = formData.step1.selectedEmployees.map((item) => ({
        employeeDocumentId: item.employeeID,
      }));

      if (formData.step3.scheduleType == "immediately") {
        const campaignData = {
          campaignName: formData.step1.campaignName,
          campaignId: getValues("step2.campaignId"),
          employees: employeeData,
          templateIds: formData.step2.selectedTemplate,
          userId: localStorage.getItem("user") as string,
          campaignType: "email",

          scheduleType: formData.step3.scheduleType,
          scheduleDateTime: formData.step3.scheduleDateTime,
          schedulefrequecy: formData.step3
            .schedulefrequency as CampaignFrequency,
          campaignStep: CampaignStep.REVIEW,
        };
        Campaign(campaignData);
      }

      if (formData.step3.scheduleType == "setup_later") {
        const setupObj = {
          campaignName: formData.step1.campaignName,
          // campaignId: getValues("step2.campaignId"),
          employees: employeeData,
          templateIds: formData.step2.selectedTemplate,
          userId: localStorage.getItem("user") as string,
          campaignType: "email",
          scheduleType: formData.step3.scheduleType,
          startDate: formData.step3.startDate,
          endDate: formData.step3.endDate,
          startTime: formData.step3.startTime,
          endTime: formData.step3.endTime,
          scheduleDateTime: formData.step3.scheduleDateTime,
          schedulefrequecy: formData.step3
            .schedulefrequency as CampaignFrequency,
          campaignStep: CampaignStep.REVIEW,
        };
        Campaign(setupObj);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  console.log("active step", activeStep);

  const handleNext = async () => {
    let isValid = false;
    let apiData: any = null;

    switch (activeStep) {
      case 0:
        isValid = await trigger("step1");
        if (isValid) {
          apiData = {
            campaignName: getValues("step1.campaignName"),
            employees: getValues("step1.selectedEmployees").map((item) => ({
              employeeDocumentId: item.employeeID,
            })),
            userId: localStorage.getItem("user") as string,
            campaignType: "email",
            campaignStep: CampaignStep.FIRST_NAME,
          };
          // Campaign(apiData);
        }
        break;
      case 1:
        isValid = await trigger("step2");
        if (isValid && getValues("step2.campaignId")) {
          apiData = {
            campaignName: getValues("step1.campaignName"),
            campaignId: getValues("step2.campaignId"),
            userId: localStorage.getItem("user") as string,
            templateIds: getValues("step2.selectedTemplate"),
            campaignStep: CampaignStep.TEMPLATE_SELECTION,
          };
          // Campaign(apiData);
        }
        break;
      case 2:
        isValid = await trigger("step3");
        if (isValid && getValues("step2.campaignId")) {
          if (getValues("step3.scheduleType") == "immediately") {
            apiData = {
              campaignName: getValues("step1.campaignName"),
              campaignId: getValues("step2.campaignId"),
              userId: localStorage.getItem("user") as string,
              // scheduleType: getValues("step3.scheduleType"),
              scheduleType: getValues("step3.scheduleType"),
              schedulefrequecy: getValues(
                "step3.schedulefrequency"
              ) as CampaignFrequency,
              scheduleDateTime: getValues("step3.scheduleDateTime"),
              campaignStep: CampaignStep.SCHEDULE,
            };
            // Campaign(apiData);
          }
          if (getValues("step3.scheduleType") == "setup_later") {
            apiData = {
              campaignName: getValues("step1.campaignName"),
              campaignId: getValues("step2.campaignId"),
              userId: localStorage.getItem("user") as string,
              // scheduleType: getValues("step3.scheduleType"),
              scheduleType: getValues("step3.scheduleType"),
              startDate: getValues("step3.startDate"),
              endDate: getValues("step3.endDate"),
              startTime: getValues("step3.startTime"),
              endTime: getValues("step3.endTime"),
              schedulefrequecy: getValues(
                "step3.schedulefrequency"
              ) as CampaignFrequency,
              scheduleDateTime: getValues("step3.scheduleDateTime"),
              campaignStep: CampaignStep.SCHEDULE,
            };
            // Campaign(apiData);
          }
        }
        break;
      case 3:
        isValid = await trigger("step4"); // Review step doesn't need validation
        break;
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StepOne
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
          />
        );
      case 1:
        return (
          <StepTwo
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
          />
        );
      case 2:
        return (
          <StepThree
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
          />
        );
      case 3:
        // return <Step4 register={register} errors={errors} />;
        return <StepFour getValues={getValues} />;
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <Stepper
        activeStep={activeStep}
        connectorStateColors
        connectorStyleConfig={{
          completedColor: "#2196F3",
          activeColor: "#2196F3",
          disabledColor: "#999999",
          size: 2,
          style: "",
        }}
        className="form-step"
        stepClassName="form-inner"
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            label={step.label}
            styleConfig={{
              activeBgColor: "#FFFFFF",
              activeTextColor: "#2962FF",
              completedBgColor: "#2962FF",
              completedTextColor: "#FFFFFF",
              inactiveBgColor: "#FFFFFF",
              inactiveTextColor: "#999999",
              size: "4em",
              circleFontSize: "1rem", // Added missing property
              labelFontSize: "0.875rem", // Added missing property
              borderRadius: "50%", // Added missing property
              fontWeight: "bold",
            }}
          />
        ))}
      </Stepper>

      <form className="form-content">
        {getStepContent(activeStep)}
        <div className="form-navigation">
          {activeStep !== 0 && (
            <button type="button" onClick={handleBack} className="btn-back">
              Back
            </button>
          )}
          {activeStep !== steps.length - 1 ? (
            <button type="button" onClick={handleNext} className="btn-next bg-purple-950 text-white hover:bg-purple-800">
              Next
            </button>
          ) : (
            <button type="button" className="btn-submit bg-purple-950 text-white hover:bg-purple-800" onClick={onSubmit}>
              {"Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
