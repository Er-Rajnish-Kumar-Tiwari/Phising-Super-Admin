import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Table/data-table";
import VerifyDomain, { OtpValidationSchema } from "./VerifyDomain";
import { useGetUserMainList } from "@/service/employee";
import TableHeader from "@/components/TableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import SearchBar from "@/components/SearchBar";
import Select from "react-select";
import { TablePagination } from "@/components/TablePagination";
import DeleteDomain from "./deleteDomain";

const pagesizes = [
  {
    value: 5,
    label: 5,
  },
  {
    value: 10,
    label: 10,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 30,
    label: 30,
  },
  {
    value: 50,
    label: 50,
  },
  {
    value: 100,
    label: 100,
  },
];

type UserDetails={
  email:string,
  isVerify:boolean
}

const DomainVerification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: searchQuery,
  };
  const {
    data: UserData,
    refetch,
    isLoading,
  } = useGetUserMainList({
    ...tableParams,
  },
{
  enabled:isOpen
});

  const modalForm = useForm({
    mode: "onChange",
    resolver: yupResolver(OtpValidationSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
  });

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
      refetch();
    }, [page, pageSize, searchQuery]);

  const Domiancolumns: ColumnDef<UserDetails>[] = [
    {
      accessorKey: "domainName",
      header: ({ column }) => (
        //   <TableHeader column={column} title='First Name' className='' />
        <TableHeader
          column={column}
          title="DOMAIN NAME"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span>{props.row.original.email.split("@")[1]}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        // <TableHeader column={column} title='Status' className='' />
        <TableHeader
          column={column}
          title="STATUS"
          className="w-[100px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          {props.row.original.isVerify ? (
            <span className={`bg-green-500 text-black  px-2 py-1 rounded-sm`}>
              Verified
            </span>
          ) : (
            <span
              className={`bg-red-500 text-white  px-2 py-1 rounded-sm cursor-pointer`}
              onClick={() => {
                modalForm.setValue("email", props.row.original.email);
                setIsVerify(true);
              }}
            >
              Unverified
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="ACTIONS"
          className="w-[90px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[90px] ">
          {localStorage.getItem("email")?.split("@")[1]!=props.row.original.email.split("@")[1] && (
            <DeleteDomain 
            employeeListId={props.row.original.email}
            refetch={refetch}
            />
          )}
          
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>
        <Button
          className=" mt-4 text-lg font-normal bg-pink-600  hover:bg-pink-400 text-white rounded-md px-4 py-6 "
          onClick={() => setIsOpen(true)}
        >
          Domain Verification
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={()=>{
        setIsOpen(false);
        // Reset all state when dialog closes
        setPage(1);
        setPageSize(5);
        setSearchQuery("");
      }}>
        <DialogContent className="mb-[10]  overflow-y-scroll  max-h-[40.6875rem]  lg:max-w-[600px] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Domain Verification Overview
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="px-4">
              <Button
                className=" mt-4 text-lg font-normal bg-purple-950 text-white hover:bg-purple-800 rounded-md px-4 py-6 "
                onClick={() => setIsVerify(true)}
              >
                Verify new Domain
              </Button>
            </div>

            <div className="px-[1.56rem]">
              {" "}
              <h3 className="pt-[1.56rem] text-[1rem] text-[#3e5569] font-semibold text-center">
                Domain Status
              </h3>
              <div className="mb-[1.81rem] border-t border-gray-300 pt-4 flex items-center justify-between">
                <div className=" flex items-center justify-between  px-[1.56rem]">
                  <div className="flex w-full items-center space-x-2 text-base font-normal">
                    <p className="text-gray-400 font-extralight">Show</p>
                    <Select
                      defaultValue={pagesizes[0]}
                      options={pagesizes}
                      isSearchable={false}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          height: "2.5rem",
                          border: "1px solid #D6CFCF",
                        }),
                        option: (
                          styles,
                          { isDisabled, isFocused, isSelected }
                        ) => ({
                          ...styles,
                          cursor: "pointer",
                          margin: "0",
                          color: isSelected ? "#ffffff" : "#000000",
                          backgroundColor: isSelected ? "#2962FF" : "#ffffff",
                          ":hover": {
                            backgroundColor: isSelected ? "" : "#2962FF",
                          },
                        }),
                      }}
                      classNamePrefix="select"
                      // onChange={(e: any) => setPageSize(Number(e?.value))}
                      onChange={(e: any) => {setPageSize(Number(e?.value));
                        setPage(1)
                      }}
                    />
                    <p className="text-gray-400 font-extralight">entries</p>
                    {/* <p>
                  Showing 1 -{' '}
                  {userData?.totalCount < 10 ? userData.totalCount : '10'} of{' '}
                  {userData?.totalCount} Entries
                </p> */}
                  </div>
                </div>
                <SearchBar
                  value={searchQuery}
                  handleChnage={handleSearchChange}
                />
              </div>
            </div>

            <div className=" border-lightGray mx-auto w-[95%] my-10 rounded-xl border">
              <DataTable
                data={UserData?.paginatedData || []}
                isLoading={isLoading}
                columns={Domiancolumns}
                // setSortId={setSortId}
              />
            </div>

            <TablePagination
              // totalCount={employeeData?.totalCount || 0}
              totalCount={UserData?.totalCount as number}
              pageNo={page}
              pageSize={pageSize}
              handleClick={handlePageChange}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isVerify} onOpenChange={()=>{
        setIsVerify(false);
        modalForm.reset({
          email: "",
          pin: "",
        });
      }}>
        <DialogContent className="mb-[10]  max-h-[40.6875rem]  lg:max-w-[500px] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Verify Domain
            </DialogTitle>
          </DialogHeader>

          <VerifyDomain modalForm={modalForm} setIsOpen={setIsVerify} refetch={refetch}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainVerification;
