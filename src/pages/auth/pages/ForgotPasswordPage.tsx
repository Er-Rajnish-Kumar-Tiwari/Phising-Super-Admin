// Desc: Login page for old users
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
// import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import { useForgotPassword } from "@/service";
// import { LoginAuthType } from "@/service/api";
import * as yup from "yup";
import logo from "@/assets/logo.png";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    //   .test("business-email", function (value) {
    //     if (!value) return true; // Skip validation if empty

    //     const domain = getEmailDomain(value);
    //     const restrictedDomains = ["gmail.com", "yahoo.com", "outlook.com"];

    //     if (restrictedDomains.includes(domain)) {
    //       return this.createError({
    //         message: `Please enter a different email address. This form does not accept addresses from ${domain}.`,
    //       });
    //     }

    //     return true;
    //   })
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [isPending, startTransition] = React.useTransition();
  // const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  const { mutate: ForgetPassword } = useForgotPassword({
    onSuccess(data: any) {
      console.log(data);
      toast.success("Otp sent on your email");
      navigate("/auth/RecoverConfirm");
    },
    onError(error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const onSubmit = async (data: { email: string }) => {
    console.log(data);

    try {
      ForgetPassword({ email: data.email });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#013f63] rounded-lg p-8 box-border">
      <div className="mb-6">
        <img
          src={logo}
          alt="Phish Logo"
          className="h-18 w-[12rem] mb-4 mx-auto"
        />
        <h1 className="text-[1.875rem] mb-2 font-bold leading-6 text-center">
          Forgot your password?
        </h1>

        {/* <Button className="w-full mt-4 bg-white text-lg font-normal text-[#377DFF] rounded-md py-8 border border-[#377DFF] hover:bg-white" disabled={isPending}>
                Sign in with Single Sign-On
            </Button> */}
      </div>
      <div className="">
        {/* <Link to="/" className="inline-block">
                <div>LOGO</div>
            </Link> */}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
          <div className="mb-6">
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
                className={cn("px-4 py-3", {
                  "border-destructive text-gray-300": errors.email,
                })}
                placeholder="Email address"
              />
              {errors.email && (
                <div className="text-destructive mt-2">
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>

          {/* Forgot Password */}
          {/* <div className="mt-3 text-right">
                    <Link to="/auth/forgot-password" className="text-sm text-[#97A4AF]">
                        Forgot Password?
                    </Link>
                </div> */}

          {/* Submit Button */}
          <Button className="w-full px-4 py-3 bg-purple-900 hover:bg-purple-700 text-white" disabled={isPending} size="xl">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Request Reset Code..." : "Request Reset Code"}
          </Button>
        </form>

        {/* Signup Link */}
        <div className="mt-1 2xl:mt-2 text-base text-white ">
          {" "}
          <Link
            to="/auth/signup"
            className="text-white text-[0.875rem] font-semibold mb-3"
          >
            Back to <span className="underline">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
