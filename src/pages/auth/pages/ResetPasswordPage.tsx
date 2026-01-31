import React, { FC, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPassword } from "@/service";

import logo from "@/assets/logo.png";
export const resetPasswordValidationSchema = Yup.object({
  pin: Yup.string().required("OTP is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*])[A-Za-z\d@#$!%^&*]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

type PasswordStrengthType = {
  strength: number;
};

const PasswordStrengthBar = ({ strength }: PasswordStrengthType) => {
  const getColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-[40%] bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${getColor(strength)}`}
        style={{ width: `${strength}%` }}
      ></div>
    </div>
  );
};
const ResetPasswordPage = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [passwordStrength, setPasswordStrength] = useState(0);
  // const [counter, setCounter] = useState(120)
  // const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: ResetPassword } = useResetPassword({
    onSuccess(data: any) {
      console.log(data);
      navigate("/auth/login");
    },
    onError(error) {
      toast.error("Error occured");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordValidationSchema),
    mode: "all",
  });
  // const modalForm = useForm({
  //         mode: 'onSubmit',
  //         resolver: yupResolver(OtpValidationSchema),
  //       })

  const togglePasswordType = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password",
    );
  };

  const toggleConfirmPasswordType = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password",
    );
  };

  const onPasswordChange = (e: any) => {
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return strength;
  };

  const onSubmit = (data: any) => {
    console.log(data);
    startTransition(async () => {
      try {
        ResetPassword({ otp: data.pin, password: data.confirmPassword });
        toast.success("Password reset successful");
        navigate("/auth/login");
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };
  return (
    <div className="w-full bg-[#013f63] rounded-lg p-8">
      <div className="flex flex-col justify-center mb-6">
        <Link to="/" className="inline-block">
          <img
            src={logo}
            alt="Phish Logo"
            className="h-18 w-[12rem]  mx-auto items-center justify-center text-center"
          />
        </Link>
        <h1 className="2xl:mt-4 mt-2 2xl:text-3xl text-2xl font-bold text-white text-center">
          Create New Password
        </h1>
        <div className="2xl:text-lg text-base text-white mt-2 leading-6 text-center">
          Enter your password to unlock the screen!
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <Label htmlFor="pin" className="mb-2 block font-bold text-white">
            Code
          </Label>
          <Input
            // disabled={isPending}
            {...register("pin")}
            type="text"
            id="pin"
            className={cn("", { "border-destructive": errors.pin })}
            placeholder="Reset code"
          />
          {errors.pin && (
            <div className="text-destructive mt-2">{errors.pin.message}</div>
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
          </div>

          <div className="relative">
            <Input
              type={passwordType}
              id="password"
              // disabled={isPending}
              {...register("password")}
              className={cn("pr-10", { "border-destructive": errors.password })}
              onChange={onPasswordChange}
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
        <PasswordStrengthBar strength={passwordStrength} />
        {/* Confirm Password Field */}

        <div>
          <div className="flex justify-between items-center">
            <Label
              htmlFor="confirmPassword"
              className="mb-2 block font-bold text-white"
            >
              Confirm Password
            </Label>
          </div>

          <div className="relative">
            <Input
              type={confirmPasswordType}
              id="confirmPassword"
              // disabled={isPending}
              {...register("confirmPassword")}
              className={cn("pr-10", { "border-destructive": errors.password })}
              placeholder="********"
            />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              onClick={toggleConfirmPasswordType}
            >
              {confirmPasswordType === "password" ? (
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
          {errors.confirmPassword && (
            <div className="text-destructive mt-2">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        {/* <div>
                    <Label htmlFor="confirmPassword" className="mb-2 block font-medium text-white">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            type={confirmPasswordType}
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "border-destructive" : ""}
                        />
                        <div
                            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                            onClick={toggleConfirmPasswordType}
                        >
                            <Icon icon={confirmPasswordType === "password" ? "heroicons:eye" : "heroicons:eye-slash"} className="w-5 h-5 text-default-400" />
                        </div>
                    </div>
                    {errors.confirmPassword && <div className="text-destructive mt-2">{errors.confirmPassword.message}</div>}
                </div> */}

        {/* Submit Button */}
        <Button className="w-full bg-purple-900 hover:bg-purple-700 text-white">
          Reset Password
        </Button>
      </form>

      <div className="mt-5 text-center text-base text-white">
        Not now?{" "}
        <Link to="/auth/login" className="text-white">
          Back to <span className="underline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
