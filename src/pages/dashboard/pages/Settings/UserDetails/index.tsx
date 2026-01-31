import { SelectComponent } from "@/components/SelectComponet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { CountryList, SelectStyles } from "@/pages/auth/pages/constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChangePassword from "./ChangePassword";
import { User } from "@/contracts/settings";
import { useUpdateProfile } from "@/service/settings";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
const validationSchema = yup.object().shape({
  // templateName: yup.string().required("Template name is required"),
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
});

type UserDetailsProps = {
  UserDetail: User | undefined;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult<any, Error>>;
};

const UserDetails: FC<UserDetailsProps> = ({ UserDetail, refetch }) => {
  const [isPending, startTransition] = React.useTransition();

  const { mutate: UpdateUserProfile } = useUpdateProfile({
    onSuccess(data) {
      console.log(data);
      toast.success("User details updated successfully")
      refetch();
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
      // country:{label:'',value:''},
    },
  });

  useEffect(() => {
    if (UserDetail) {
      setValue("fullName", UserDetail.fullName);
      setValue("country.label", UserDetail.country);
      setValue("country.value", UserDetail.country);
    }
  }, [UserDetail]);

  const addressCountry = watch("country");
  console.log("add", addressCountry);

  const onSubmit = (data: any) => {
    console.log("data",data)
    const obj = {
      userId: localStorage.getItem("user") as string,
      fullName: data.fullName as string,
      country: data.country.label as string,
    };
    UpdateUserProfile(obj);
  };
  return (
    <div className="p-6">
      <h4 className="text-lg font-semibold mb-[10px]">Personal Profile</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div>
              <Label
                htmlFor="fullName"
                className="mb-2 block font-bold text-default-600"
              >
                Full Name
              </Label>
              <Input
                {...register("fullName")}
                type="text"
                id="fullName"
                className={cn("", {
                  "border-destructive": errors.fullName,
                })}
                onChange={(e) => {
                setValue("fullName", e.target.value); // Update the form value
              }}
                //size={!isDesktop2xl ? "xl" : "lg"}
                placeholder="John Deo"
              />
              {errors.fullName && (
                <div className="text-destructive mt-2">
                  {errors.fullName.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-1 items-center w-full">
              <Label
                htmlFor="country"
                className=" block mb-2 font-bold text-default-600"
              >
                Region
              </Label>
            </div>
            <SelectComponent
              {...register("country")}
              styles={SelectStyles}
              options={CountryList}
              placeholder="Country"
              clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
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

          <Button className="w-full bg-purple-950 text-white hover:bg-purple-800">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Registering..." : "Update"}
          </Button>
        </div>
      </form>

      <div className="mt-4">
        <Accordion type="single" collapsible>
          <AccordionItem
            value="item-1"
            className="border-t hover:text-[#381be7]"
          >
            <AccordionTrigger className="justify-normal gap-2 text-[#2962FF] text-lg font-bold hover:text-[#381be7] hover:no-underline">
              Change Password
            </AccordionTrigger>
            <AccordionContent>
              <ChangePassword />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default UserDetails;
