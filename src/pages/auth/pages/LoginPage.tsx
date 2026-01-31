// Desc: Login page for old users
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo_one from "@/assets/images/dashboard/logo_one.png";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import { useSignin, useVerifyEmail, useVerifyLoginEmail } from "@/service";
import { LoginAuthType } from "@/service/api";
import * as yup from "yup";
import { OtpValidationSchema } from "./constant";
import logo from "@/assets/logo.png";

// Function to extract domain from email
const getEmailDomain = (email: string) => email.split("@")[1] || "";
const validationSchema = yup.object().shape({
  // email: yup.string()
  // .email('Please enter a valid email address')
  //  .required('Email is required'),
  // .test(
  //   'is-business-email',
  //   // Dynamic error message
  //   (value) => {
  //     const domain = value.split('@')[1];
  //     return `Please enter a different email address. This form does not accept addresses from ${domain}.`;
  //   },
  //   (value:any) => {
  //     const domain = value.split('@')[1];
  //     const blockedDomains = ['gmail.com', 'yahoo.com'];
  //     return domain && !blockedDomains.includes(domain.toLowerCase());
  //   }
  // ),

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
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const LoginPage = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState("password");
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(120);
  const navigate = useNavigate();
  const { mutate: SignInUser } = useSignin({
    onSuccess(data: any) {
      console.log(data);
      if (data.data.isVerified) {
        toast.success("User Logged in Successfully");
        localStorage.setItem("token", data.data.passcode);
        localStorage.setItem("user", data.data.user);
        localStorage.setItem("isAdmin",data.data.isAdmin);
        localStorage.setItem("email", getValues("email"));
        // <Navigate to="/auth/login" replace />
        navigate("/", { replace: true });
      } else {
        toast.error(data.data.message);
      }
    },
    onError(error: any) {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: verifyEmail } = useVerifyLoginEmail({
    onSuccess(data) {
      console.log(data);
      setOpen(false);
      //   toast.success("user verified sucessfully");
      toast.success("User Logged in Successfully");
      localStorage.setItem("token", data.data.passcode);
      localStorage.setItem("user", data.data.user);
      localStorage.setItem("email", getValues("email"));
      navigate("/", { replace: true });
    },
    onError(error) {
      toast.error("Error occured");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const modalForm = useForm({
    mode: "onSubmit",
    resolver: yupResolver(OtpValidationSchema),
  });

  const togglePasswordType = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
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

  const onSubmit = async (data: LoginAuthType) => {
    console.log(data);
    startTransition(async () => {
      try {
        SignInUser(data);
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="w-full bg-[#013f63] rounded-lg p-8">
      <div className="mb-6">
        <img
          src={logo}
          alt="Phish Logo"
          className="h-18 w-[12rem] mb-4 mx-auto"
        />

        <div className=" text-base text-white mt-2 mb-3 text-center font-normal">
          Sign in to access your PhishFarm account.
        </div>

        {/* <Button className="w-full mt-4 bg-white text-lg font-normal text-[#377DFF] rounded-md py-8 border border-[#377DFF] hover:bg-white" disabled={isPending}>
                Sign in with Single Sign-On
            </Button> */}
      </div>

      {/* <h6 className="flex items-center text-[#8c98a4] before:content-[''] before:flex-1 before:border-b before:border-gray-400 after:content-[''] after:flex-1 after:border-b after:border-gray-400 px-4">
  or
</h6> */}
      <div className="">
        {/* <Link to="/" className="inline-block">
                <div>LOGO</div>
            </Link> */}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
          <div className="space-y-8">
            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="mb-2 block font-bold text-white"
              >
                Email
              </Label>
              <Input
                disabled={isPending}
                {...register("email")}
                type="email"
                id="email"
                className={cn("", { "border-destructive text-white": errors.email })}
                placeholder="Email address"
              />
              {errors.email && (
                <div className="text-destructive mt-2">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="mb-2 block font-bold text-white"
                >
                  Password
                </Label>
                <div className="mb-2 text-right">
                  <Link
                    to="/auth/Recover"
                    className="text-sm text-white border-b border-dashed border-[#97a4af]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="relative">
                <Input
                  type={passwordType}
                  id="password"
                  disabled={isPending}
                  {...register("password")}
                  className={cn("pr-10", {
                    "border-destructive text-white": errors.password,
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
                <div className="text-destructive mt-2">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          {/* Forgot Password */}
          {/* <div className="mt-3 text-right">
                    <Link to="/auth/forgot-password" className="text-sm text-white">
                        Forgot Password?
                    </Link>
                </div> */}

          {/* Submit Button */}
          <Button
            className="w-full mt-4 bg-purple-950 hover:bg-purple-700"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
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
                className="mx-auto w-[7.5rem] hover:text-white"
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

export default LoginPage;
