import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/Table/data-table";
import SearchBar from "@/components/SearchBar";
import Select from "react-select";
import { useAddDirectorySync } from "@/service/employee";
import TableHeader from "@/components/TableHeader";
import { ColumnDef } from "@tanstack/react-table";
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from "react-hot-toast";
import { useDirectoryList } from "@/service/campaign";
import { DirectoryList } from "@/service/campaign/api";
import { TablePagination } from "@/components/TablePagination";
import DeleteEmployee from "../deleteEmployee";

export type UserDetails = {
  // id:number,
  email: string;
  isVerify: boolean;
};

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

const MircosoftValidationSchema = yup.object({
  directoryName: yup.string().required("Directory name is required"),
})

const DireectorySync = () => {
  const [selectedOption, setSelectedOption] = useState("manualImport2");
  const [isOpenDirectory, setIsOpenDirectory] = useState(false);
  // const [googleButtonState, setGoogleButtonState] = useState<
  //   "normal" | "focus" | "pressed"
  // >("normal");

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
      data: DirectoryData,
      isLoading,
      refetch,
    } = useDirectoryList({
      ...tableParams
    },{
      enabled:isOpenDirectory
    })

  const {mutate:MicrosoftDirectory}=useAddDirectorySync({
    onSuccess(data) {
      console.log(data)
      MicrosoftForm.reset({
        directoryName:""
      })
      refetch()
      toast.success("Directory added successfully")
    },
  })

  const MicrosoftForm=useForm({
    resolver:yupResolver(MircosoftValidationSchema),
    mode:"onChange"
  })

  const handleSubmit=(data:any)=>{
    console.log(data)
    const obj={
      userId:localStorage.getItem("user") as string,
      employeeListName:data.directoryName,
    }
    MicrosoftDirectory(obj)
  }

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const Domiancolumns: ColumnDef<DirectoryList>[] = [
    {
      accessorKey: "domainName",
      header: ({ column }) => (
        //   <TableHeader column={column} title='First Name' className='' />
        <TableHeader
          column={column}
          title="Domain Name"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span>{props.row.original.employeeListName}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        //   <TableHeader column={column} title='First Name' className='' />
        <TableHeader
          column={column}
          title="Type"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span>Entra ID</span>
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
              Active
            </span>
          ) : (
            <span
              className={`bg-red-500 text-white  px-2 py-1 rounded-sm cursor-pointer`}
              // onClick={()=>{
              //   modalForm.setValue("email",props.row.original.email)
              //   setIsVerify(true)
              // }}
            >
              Unactive
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
        <div className='flex items-center justify-center gap-2'>
       <DeleteEmployee employeeListId={props.row.original.employeeId }/>
       </div>
      ),
    },
  ];

  console.log("DirectoryData")
  console.log(DirectoryData)
  return (
    <div>
      <Dialog open={isOpenDirectory} onOpenChange={setIsOpenDirectory}>
        <DialogContent className="mb-[10] overflow-y-scroll max-h-[40.6875rem]  lg:max-w-[44rem] p-0">
          {/* <DialogContent className="mb-[10]   max-h-[40.6875rem]  lg:max-w-[35rem] p-0"> */}
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Directory Sync
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <div className="flex justify-between items-center mb-6 ">
              <div className="flex space-x-4">
                {/* Manually Import Option */}
                <div
                  className="flex items-center space-x-2"
                  data-tooltip-id="manualImportTooltip"
                  data-tooltip-content="Manually import target employees by inputting them individually or using a .csv import."
                >
                  <input
                    type="radio"
                    id="manualImport2"
                    name="importType2"
                    className="form-radio h-4 w-4 text-blue-600"
                    value="manualImport2"
                    checked={selectedOption === "manualImport2"}
                    onChange={() => setSelectedOption("manualImport2")}
                  />
                  <label
                    htmlFor="manualImport2"
                    className="flex items-center space-x-1"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1 items-center">
                            <span>Microsoft Entra ID</span>
                            <img
                              src={Symbol}
                              alt="image"
                              className=" w-[14px] h-[14px] "
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-48 bg-black px-4 text-center">
                          <p>
                            Manually input target employees by inputing them
                            individually or using a .csv import
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>

                {/* Import From Directory Option */}
                {/* <div
                  className="flex items-center space-x-2"
                  data-tooltip-id="dirImportTooltip"
                  data-tooltip-content="Use an Entra ID or Google Workspace integration to automatically sync target employees."
                >
                  <input
                    type="radio"
                    id="dirImport2"
                    name="importType2"
                    className="form-radio h-4 w-4 text-blue-600"
                    value="dirImport2"
                    checked={selectedOption === "dirImport2"}
                    onChange={() => setSelectedOption("dirImport2")}
                  />
                  <label
                    htmlFor="dirImport2"
                    className="flex items-center space-x-1"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1 items-center">
                            <span>Google Workspace</span>
                            <img
                              src={Symbol}
                              alt="image"
                              className=" w-[14px] h-[14px] "
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-48 bg-black px-4 text-center">
                          <p>
                            Manually input target employees by inputing them
                            individually or using a .csv import
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div> */}
              </div>
            </div>
            {selectedOption === "manualImport2" && (
              <div
                id="azureADDiv"
                className="pt-3 pr-2 border border-gray-300 rounded-md"
              >
                {/* <p className="pl-3 italic text-gray-700">
                  Read our{" "}
                  <a
                    className="font-bold text-blue-600 hover:text-blue-800"
                    href="https://help.caniphish.com/hc/en-us/articles/4412685120911-Targets-Azure-AD-Target-Directory-Integration"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    knowledge base article
                  </a>{" "}
                  for setup guidance. CanIPhish will request access to read
                  directory data such as users and groups. Additionally we will
                  read the profile of the authorising user.
                </p> */}

                <form onSubmit={MicrosoftForm.handleSubmit(handleSubmit)} className="mt-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center mb-6">
                    <label
                      htmlFor="dName"
                      className="md:w-1/4 mb-2 md:mb-0 pl-5"
                    >
                      Directory Name: <span className="text-red-500">*</span>
                    </label>
                    <div className="relative md:w-3/4 ">
                      
                      <input
            id="templateName"
            {...MicrosoftForm.register("directoryName")}
            name='directoryName'
            type="text"
            placeholder="Enter a unique name to identify this directory"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          {MicrosoftForm.formState.errors.directoryName && (
            MicrosoftForm.formState.errors.directoryName && <div className="text-destructive absolute -bottom-6">{MicrosoftForm.formState.errors.directoryName.message}</div>
          )}
                      <div className="text-sm text-red-600 mt-1 hidden">
                        Please enter a unique directory name.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pl-5 ">
                    <button
                      id="syncButton"
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-[4px] flex items-center transition-colors duration-200"
                      style={{
                        fontFamily: "'Segoe UI', sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      <img
                        src="https://caniphish.com/assets/images/ms-button-symbol.svg"
                        alt="Microsoft logo"
                        className="pr-2 h-7"
                      />
                      Sign in with Microsoft
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* {selectedOption === "dirImport2" && (
              <div
                id="googleWorkspaceDiv"
                className="pt-3 pr-2 border border-gray-300 rounded-md"
              >
                <p className="pl-3 italic text-gray-700">
                  Read our{" "}
                  <a
                    className="font-bold text-blue-600 hover:text-blue-800"
                    href="https://help.caniphish.com/hc/en-us/articles/4414380004623-Google-Workspace-Target-Directory-Synchronisation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    knowledge base article
                  </a>{" "}
                  for setup guidance. CanIPhish will request access to read
                  directories, directory group members, directory users and the
                  authorising users profile and email.
                </p>

                <div className="mt-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <label
                      htmlFor="dNameGoogle"
                      className="md:w-1/4 mb-2 md:mb-0 pl-5"
                    >
                      Directory Name: <span className="text-red-500">*</span>
                    </label>
                    <div className="md:w-3/4">
                      <input
                        type="text"
                        id="dNameGoogle"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter a unique name to identify this directory"
                        required
                        aria-invalid="false"
                      />
                      <div className="text-sm text-red-600 mt-1 hidden">
                        Please enter a unique directory name.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pl-5">
                    <button
                      type="button"
                      className="p-0 border-none bg-transparent cursor-pointer"
                      onMouseEnter={() => setGoogleButtonState("focus")}
                      onMouseLeave={() => setGoogleButtonState("normal")}
                      onMouseDown={() => setGoogleButtonState("pressed")}
                      onMouseUp={() => setGoogleButtonState("focus")}
                    >
                      <img
                        src={
                          "https://caniphish.com/assets/integrations/google_signin_normal.png"
                        }
                        alt="Sign in with Google"
                        className="h-10 w-48" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            <div className="px-[1.56rem]">
              {" "}
              <div className="mb-[1.81rem] border-t border-gray-300 pt-4 flex items-center justify-between">
                <div className=" flex items-center justify-between  px-[1.56rem]">
                  <div className="flex w-full items-center space-x-2 text-base font-normal">
                    <p className="text-gray-400 font-extralight">Show</p>
                    <Select
                      defaultValue={pagesizes[0]}
                      options={pagesizes}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          height: "2.5rem",
                          border: "1px solid #D6CFCF",
                        }),
                        option: (styles, { isSelected }) => ({
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
                      onChange={(e: any) => setPageSize(Number(e?.value))}
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
                data={DirectoryData?.data || []}
                isLoading={isLoading}
                columns={Domiancolumns}
                // setSortId={setSortId}
              />
            </div>

            <TablePagination
                              // totalCount={employeeData?.totalCount || 0}
                              totalCount={DirectoryData?.totalCount as number}
                              pageNo={page}
                              pageSize={pageSize}
                              handleClick={handlePageChange}
                            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DireectorySync;
