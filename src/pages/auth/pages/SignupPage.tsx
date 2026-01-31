// Desc: Signup page for new users
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

// import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo_one from "@/assets/images/dashboard/logo_one.png";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { useNavigate, Link } from "react-router-dom";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import { useGetUserType, useSignUp, useVerifyEmail } from "@/service";
// import { SignUpAuthType } from "@/service/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CountryList, OtpValidationSchema, SelectStyles } from "./constant";
import { SelectComponent } from "@/components/SelectComponet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTPTimer } from "@/components/OTPTimer";
import logo from "@/assets/logo.png";

// Country codes data
const CountryCodes = [
  { label: "+1 (US)", value: "+1", flag: "🇺🇸" },
  { label: "+1 (CA)", value: "+1", flag: "🇨🇦" },
  { label: "+44 (UK)", value: "+44", flag: "🇬🇧" },
  { label: "+91 (IN)", value: "+91", flag: "🇮🇳" },
  { label: "+86 (CN)", value: "+86", flag: "🇨🇳" },
  { label: "+81 (JP)", value: "+81", flag: "🇯🇵" },
  { label: "+49 (DE)", value: "+49", flag: "🇩🇪" },
  { label: "+33 (FR)", value: "+33", flag: "🇫🇷" },
  { label: "+39 (IT)", value: "+39", flag: "🇮🇹" },
  { label: "+34 (ES)", value: "+34", flag: "🇪🇸" },
  { label: "+61 (AU)", value: "+61", flag: "🇦🇺" },
  { label: "+55 (BR)", value: "+55", flag: "🇧🇷" },
  { label: "+7 (RU)", value: "+7", flag: "🇷🇺" },
  { label: "+82 (KR)", value: "+82", flag: "🇰🇷" },
  { label: "+65 (SG)", value: "+65", flag: "🇸🇬" },
  { label: "+971 (AE)", value: "+971", flag: "🇦🇪" },
  { label: "+966 (SA)", value: "+966", flag: "🇸🇦" },
  { label: "+60 (MY)", value: "+60", flag: "🇲🇾" },
  { label: "+62 (ID)", value: "+62", flag: "🇮🇩" },
  { label: "+66 (TH)", value: "+66", flag: "🇹🇭" },
  { label: "+63 (PH)", value: "+63", flag: "🇵🇭" },
  { label: "+84 (VN)", value: "+84", flag: "🇻🇳" },
  { label: "+27 (ZA)", value: "+27", flag: "🇿🇦" },
  { label: "+20 (EG)", value: "+20", flag: "🇪🇬" },
  { label: "+234 (NG)", value: "+234", flag: "🇳🇬" },
  { label: "+52 (MX)", value: "+52", flag: "🇲🇽" },
  { label: "+54 (AR)", value: "+54", flag: "🇦🇷" },
  { label: "+56 (CL)", value: "+56", flag: "🇨🇱" },
  { label: "+57 (CO)", value: "+57", flag: "🇨🇴" },
  { label: "+51 (PE)", value: "+51", flag: "🇵🇪" },
];

const getEmailDomain = (email: string) => email.split("@")[1] || "";

const validationSchema = yup.object().shape({
  // user_type_id: yup
  //   .object()
  //   .shape({
  //     label: yup.string().required("enter"),
  //     value: yup.string().required("enter"),
  //   }),
  //   .required("Select the Profession"),
  country: yup
    .object()
    .shape({
      label: yup.string().required("Select the Country"),
      value: yup.string().required("enter"),
    })
    .required("Select the Country"),
  fullName: yup
    .string()
    .required("Enter your Name")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),
  companyName: yup
    .string()
    .required("Enter your Company")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),

  countryCode: yup
    .object()
    .shape({
      label: yup.string().required("Select country code"),
      value: yup.string().required("Select country code"),
    })
    .required("Please select a country code"),

  contactno: yup
    .string()
    .required("Contact number is required")
    .trim()
    // Remove any non-digit characters for validation
    .transform((value) => value?.replace(/\D/g, "") || "")
    // Check minimum length (at least 6 digits for local number)
    .min(6, "Contact number must be at least 6 digits")
    // Check maximum length (no more than 12 digits for local part)
    .max(12, "Contact number cannot exceed 12 digits")
    // Validate that it contains only digits after transformation
    .matches(/^\d+$/, "Contact number should contain only digits")
    // Additional validation for common patterns
    .test("valid-phone", "Please enter a valid phone number", function (value) {
      if (!value) return true;

      // Should not be all same digits
      if (value.length > 1 && /^(.)\1+$/.test(value)) {
        return this.createError({
          message: "Phone number cannot contain all same digits",
        });
      }

      // Should not start with 0 for most countries (except some specific cases)
      if (value.startsWith("0") && value.length > 8) {
        return this.createError({
          message: "Phone number format appears invalid",
        });
      }

      return true;
    }),

  email: yup
    .string()
    .email("Invalid email format")
    .test("business-email", function (value) {
      if (!value) return true; // Skip validation if empty

      const domain = getEmailDomain(value);
      const restrictedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "aol.com",
        "protonmail.com",
        "zoho.com",
        "mail.com",
        "yandex.com",
        "gmx.com",
        "icloud.com",
        "fastmail.com",
        "tutanota.com",
        "hey.com",
        "pm.me",
      ];

      if (restrictedDomains.includes(domain)) {
        return this.createError({
          message: `Please enter a different email address. This form does not accept addresses from ${domain}.`,
        });
      }

      return true;
    })
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*])[A-Za-z\d@#$!%^&*]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  isTermsAccepted: yup
    .boolean()
    .oneOf([true], "Please agree to the terms and conditions."),
});

const SignupPage = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState("password");
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(120);
  const [contactValue, setContactValue] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    CountryCodes[0],
  ); // Default to US
  const [searchParams] = useSearchParams();

  // const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const navigate = useNavigate();
  const { data: UserType } = useGetUserType();
  console.log("user type");
  console.log(UserType);

  // const { mutate: EmailVerification } = useForgotPassword({
  //   onSuccess(data: any) {
  //     console.log(data);

  //   },
  //   onError(error) {
  //     toast.error("Error occured");
  //   },
  // });

  const { mutate: SignUpUser } = useSignUp({
    onSuccess(data) {
      console.log(data);

      setOpen(true);
      // EmailVerification({ email: data.data.email });

      // toast.success(`${data.data.message}`)
      // navigate("/auth/login");
    },
    onError(error: any) {
      console.log("error", error);
      toast.error(`${error.response.data.message}`);
    },
  });

  const { mutate: verifyEmail } = useVerifyEmail({
    onSuccess(data) {
      console.log(data);
      setOpen(false);
      toast.success("User Registered Successfully");
      navigate("/auth/login");
    },
    onError(error) {
      toast.error("Error occured");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      companyName: "",
      password: "",
      email: "",
      contactno: "",
      countryCode: CountryCodes[0], // Default to first country code (US)
      country: null, // or {label:'',value:''}
      isTermsAccepted: false,
    },
  });

  useEffect(() => {
    const email = searchParams.get("email");
    const firstName = searchParams.get("firstName");
    const companyName = searchParams.get("companyName");
    const country = searchParams.get("country");

    if (email) {
      setValue("email", email);
    }

    if (firstName) {
      setValue("fullName", firstName);
    }

    if (companyName) {
      setValue("companyName", companyName);
    }

    if (country) {
      // CountryList se matching object find karo
      const selectedCountry = CountryList.find(
        (c) => c.label === country || c.value === country,
      );

      if (selectedCountry) {
        setValue("country", selectedCountry);
      }
    }
  }, [searchParams, setValue]);

  const modalForm = useForm({
    mode: "onSubmit",
    resolver: yupResolver(OtpValidationSchema),
  });

  const togglePasswordType = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password",
    );
  };

  const clickResentOTP = () => {
    setCounter(120);
    // otp.mutate({ phone })
  };

  const handleOtpSubmit = (data: any) => {
    // mutate(data)
    const obj = {
      //   phone: form.getValues('phone'),
      // fullName:getValues("fullName"),
      // companyName:getValues("companyName"),
      // email:getValues("email"),
      // password:getValues("password"),
      // country:getValues("country").label,
      // userType:UserType?.[1]?._id,
      email: getValues("email"),
      otp: modalForm.getValues("pin"),
    };
    verifyEmail(obj);
    // otpMutate(obj)
    // updatePhone(data.phone)
  };

  const handleContactChange = (e) => {
    // Only allow digits, spaces, and hyphens
    const value = e.target.value.replace(/[^\d\s\-]/g, "");
    setContactValue(value);
    setValue("contactno", value);
  };

  const handleCountryCodeChange = (selectedOption) => {
    setSelectedCountryCode(selectedOption);
    setValue("countryCode", selectedOption);
  };

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const new_data = {
        ...data,
        country: data.country.label,
        // Combine country code and contact number
        contactno: `${data.countryCode.value}${data.contactno}`,
        userType: "657e8ff44b628d1f0fc8f09c",
      };

      SignUpUser(new_data);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Watch the country field
  const addressCountry = watch("country");
  console.log("add", addressCountry);

  const isTermsAccepted = watch("isTermsAccepted");
  console.log("isterm", isTermsAccepted);

  return (
    <div className="w-full bg-[#013f63] rounded-lg p-8">
      {/* <Link to="/" className="inline-block">
                <div>LOGO</div>
            </Link> */}

      <img
        src={logo}
        alt="Phish Logo"
        className="h-18 w-[12rem] mb-4 mx-auto"
      />
      <div className=" text-base text-white mt-2 leading-6 text-center font-normal">
        Fill out this form to create your account!
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="mb-2 block font-bold text-white">
              Email
            </Label>
            <Input
              disabled={isPending || searchParams.get("email") !== null}
              {...register("email")}
              type="email"
              id="email"
              className={cn("", {
                "border-destructive bg-[#003a5c] text-gray-300": errors.email,
              })}
              //
              placeholder="Email Address"
            />
            {errors.email && (
              <div className="text-destructive mt-2">
                {errors.email.message}
              </div>
            )}
          </div>
          {/* Full Name Field */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            {/* Full Name */}
            <div>
              <Label
                htmlFor="fullName"
                className="mb-2 block font-bold text-white"
              >
                Full Name
              </Label>

              <Input
                disabled={isPending || searchParams.get("firstName") !== null}
                {...register("fullName")}
                type="text"
                id="fullName"
                placeholder="John Doe"
                className={cn(
                  "bg-[#003a5c] text-gray-300 placeholder:text-gray-500 focus:bg-[#003a5c] focus:text-gray-300",
                  {
                    "border-destructive": errors.fullName,
                  },
                )}
              />

              {errors.fullName && (
                <div className="mt-2 text-sm text-destructive">
                  {errors.fullName.message}
                </div>
              )}
            </div>

            {/* Company Name */}
            <div>
              <Label
                htmlFor="companyName"
                className="mb-2 block font-bold text-white"
              >
                Company Name
              </Label>

              <Input
                disabled={isPending || searchParams.get("companyName") !== null}
                {...register("companyName")}
                type="text"
                id="companyName"
                placeholder="Contoso Corp"
                className={cn(
                  "bg-[#003a5c] text-gray-300 placeholder:text-gray-500 focus:bg-[#003a5c] focus:text-gray-300",
                  {
                    "border-destructive": errors.companyName,
                  },
                )}
              />

              {errors.companyName && (
                <div className="mt-2 text-sm text-destructive">
                  {errors.companyName.message}
                </div>
              )}
            </div>
          </div>

          {/* Contact Number Field with Country Code */}
          <div>
            <div className="flex gap-1 items-center w-full">
              <Label
                htmlFor="contactno"
                className="mb-2 block font-bold text-white"
              >
                Contact no
              </Label>
            </div>

            <div className="flex gap-2 bg-[#003a5c]">
              {/* Country Code Dropdown */}
              <div className="w-30 p-1 border-grey bg-[#003a5c]">
                <SelectComponent
                  styles={{
                    ...SelectStyles,
                    control: (provided) => ({
                      ...provided,
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                    }),
                    input: (provided) => ({
                      ...provided,
                      margin: "0px",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                    }),
                  }}
                  options={CountryCodes}
                  value={selectedCountryCode}
                  onChange={handleCountryCodeChange}
                  placeholder="Code"
                  isSearchable={true}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2 bg-[#003a5c]">
                      <span>{option.flag}</span>
                      <span>{option.value}</span>
                    </div>
                  )}
                  className={cn("text-[#696767]", {
                    "border-destructive bg-[#003a5c]": errors.countryCode,
                  })}
                />
                {errors.countryCode && (
                  <div className="text-destructive text-xs mt-1">
                    {errors.countryCode.message ||
                      errors.countryCode.value?.message}
                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="flex-1">
                <Input
                  id="contactno"
                  disabled={isPending}
                  value={contactValue}
                  onChange={handleContactChange}
                  placeholder="Enter phone number"
                  maxLength={15}
                  className={cn(
                    "bg-[#003a5c] text-gray-300 placeholder:text-gray-500 focus:bg-[#003a5c] focus:text-gray-300",
                    {
                      "border-destructive": errors.contactno,
                    },
                  )}
                />

                {errors.contactno && (
                  <div className="mt-1 text-xs text-destructive">
                    {errors.contactno.message}
                  </div>
                )}
              </div>
            </div>

            {/* Display full number preview */}
            {selectedCountryCode && contactValue && (
              <div className="text-sm text-white mt-1">
                Full number: {selectedCountryCode.value} {contactValue}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex gap-1 items-center w-full">
              <Label
                htmlFor="password"
                className="mb-2 block font-bold text-white"
              >
                Password
              </Label>
            </div>

            <div className="relative">
              <Input
                type={passwordType}
                id="password"
                disabled={isPending}
                {...register("password")}
                className={cn("pr-10", {
                  "border-destructive bg-[#003a5c] text-gray-300":
                    errors.password,
                })}
                placeholder="********"
              />
              <div
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <div className="text-destructive mt-2 bg-[#003a5c]">
                {errors.password.message}
              </div>
            )}
          </div>
          <div>
            <div className="flex gap-1 items-center w-full ">
              <Label
                htmlFor="password"
                className=" block mb-2 font-bold text-white"
              >
                Region
              </Label>
            </div>
            <SelectComponent
              {...register("country")}
              styles={SelectStyles}
              options={CountryList}
              isDisabled={searchParams.get("country") !== null}
              placeholder="Country"
              clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0 bg-[#003a5c]"
              value={addressCountry}
              onChange={(selectedOption) => {
                setValue("country", selectedOption); // Update the form value
              }}
            />
            {errors.country && !getValues("country")?.label && (
              <div className="text-destructive mt-2">
                {errors.country.label?.message || errors.country.value?.message}
              </div>
            )}
          </div>
          {/* <div>
                        
                        <div className="flex gap-1 items-center w-full">
                            <Label htmlFor="password" className="mb-2 block font-bold text-white">
                                Storage Region 
                            </Label>
                            <img
                                src={Symbol}
                                alt="image"
                                className=" w-[14px] h-[14px] mb-2"
                            />
                        </div>
                        <div className="relative">
                            <Input
                                type={passwordType}
                                id="password"
                                //
                                disabled={isPending}
                                {...register("password")}
                                className={cn("pr-10", {
                                    "border-destructive": errors.password,
                                })}
                                placeholder="United States of America"
                            />
                            <div
                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordType}
                            >
                                {passwordType === "password" ? (
                                    <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
                                ) : (
                                    <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
                                )}
                            </div>
                        </div>
                        {errors.password && (
                            <div className="text-destructive mt-2">
                                {errors.password.message}
                            </div>
                        )}
                    </div> */}

          {/* Terms & Conditions */}
          <div className="mb-8">
            <div className="mt-5 flex items-center gap-1.5 ">
              <Checkbox
                {...register("isTermsAccepted")}
                checked={isTermsAccepted}
                onCheckedChange={(checked: boolean) =>
                  setValue("isTermsAccepted", checked)
                }
                className="border-default-300 mt-[1px]"
                id="isTermsAccepted"
              />
              <Label
                htmlFor="isTermsAccepted"
                className="text-sm text-white cursor-pointer whitespace-nowrap"
              >
                You accept our{" "}
                <a
                  href="https://kevlardefense.com/terms-and-conditons/"
                  target="_blank"
                  className="font-bold underline"
                >
                  Terms & Conditions
                </a>
              </Label>
            </div>
            {errors.isTermsAccepted && !getValues("isTermsAccepted") && (
              <div className="text-destructive mt-2 bg-[#003a5c]">
                {errors.isTermsAccepted.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-purple-950 hover:bg-purple-700"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Registering..." : "Create an Account"}
          </Button>
        </div>
      </form>

      {/* Login Link */}
      <div className="mt-5 2xl:mt-8 text-center text-base text-white">
        Already Registered?{" "}
        <Link
          to="/auth/login"
          className="text-purple-600 font-semibold underline"
        >
          Sign In
        </Link>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" container z-[1005] mx-auto mb-2 h-[350px] rounded-[0.625rem] xl:w-[40%]">
          <DialogHeader className="">
            <DialogTitle className="text-center">
              <span className="text-2xl">Enter OTP</span>
            </DialogTitle>
          </DialogHeader>
          <Form {...modalForm}>
            <form
              onSubmit={modalForm.handleSubmit(handleOtpSubmit)}
              className="mx-auto flex flex-col space-y-6 text-center"
            >
              <FormField
                control={modalForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mb-5 text-base">
                        {`Please enter the OTP sent to ${getValues("email")}`}
                      </p>
                    </FormLabel>
                    <FormControl>
                      <InputOTP autoFocus maxLength={6} {...field}>
                        <InputOTPGroup className="text-center">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <p className="text-brand mt-[0.5rem] text-sm">
                      {/* {otpError} */}
                    </p>
                    <FormMessage />
                    <div className="mt-2">
                      <OTPTimer
                        counter={counter}
                        setCounter={setCounter}
                        handleClick={clickResentOTP}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                // disabled={otpLoading}
                className="mx-auto w-[7.5rem] hover:text-white bg-purple-950 hover:bg-purple-700"
                type="submit"
              >
                Submit
                {/* {otpLoading ? <Loader /> : 'Submit'} */}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignupPage;
