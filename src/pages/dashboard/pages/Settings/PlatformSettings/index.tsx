import SearchBar from "@/components/SearchBar";
import { DataTable } from "@/components/Table/data-table";
import { TablePagination } from "@/components/TablePagination";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddOrUpdate from "./AddOrUpdate";
import { useGetUserList } from "@/service/settings";
import TableHeader from "@/components/TableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/contracts/settings";
import DeleteUser from "./DeleteUser";

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

const PlatformSettings = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const tableParams = {
    id: localStorage.getItem("user") as string,
    // id:"67e24139925615b9c3fd4dfc",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: searchQuery,
  };
  // const {
  //   data: employeeData,
  //   isLoading,
  //   isFetching,
  //   refetch,
  // } = useGetEmployeeMainList({
  //   ...tableParams
  // })
  const {
    data: userData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserList({
    ...tableParams,
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, searchQuery]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "EMPLOYEE LIST NAME",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="NAME"
          className="w-[100px] text-center "
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          <span>{`${props.row.original.firstName}`}</span>
        </div>
      ),
    },
    // {
    //   accessorKey: 'EMPLOYEE LIST NAME',
    //   header: ({ column }) => (
    //     <TableHeader column={column} title='NAME' className='w-[100px] text-center ' />
    //   ),
    //   cell: (props) => (
    //     <div className='flex items-center justify-center w-[100px]'>
    //       {/* <GreenTick /> */}
    //       <span>{`${props.row.original.user.companyName}`}</span>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "EMPLOYEE COUNT",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="EMAIL"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span>{`${props.row.original.email}`}</span>
        </div>
      ),
    },
    {
      accessorKey: "ROLE",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="ROLE"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span
            className={`${"Admin" ? "bg-green-500 text-black" : "bg-red-500 text-white"}  px-2 py-1 rounded-sm`}
          >
            Admin
          </span>
        </div>
      ),
    },
    {
      accessorKey: "LAST MODIFIED",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="STATUS"
          className="w-[100px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          <span>
            {props.row.original.status ? "Activated" : "Invite Pending"}
          </span>
        </div>
      ),
    },
{
  accessorKey: "_id",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="ACTIONS"
      className="w-[100px] text-center"
    />
  ),
  cell: (props) => {
    //  First user (primary signup user) → no action
    if (props.row.index === 0) {
      return <div className="w-[100px]"></div>;
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <DeleteUser
          refetch={refetch}
          userId={props.row.original._id}
        />
      </div>
    );
  },
},

  ];

  const columnuser: ColumnDef<User>[] = [
    {
      accessorKey: "EMPLOYEE LIST NAME",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="NAME"
          className="w-[100px] text-center "
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          <span>{`${props.row.original.user.companyName}`}</span>
        </div>
      ),
    },
    {
      accessorKey: "EMPLOYEE LIST NAME",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="EMAIL"
          className="w-[100px] text-center "
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          <span>{`${props.row.original.user.email}`}</span>
        </div>
      ),
    },
    {
      accessorKey: "ROLE",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="IS VERIFIED"
          className="w-[150px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[150px]">
          {/* <GreenTick /> */}
          <span
            className={`${props.row.original.user.isVerified ? "bg-green-500 text-black" : "bg-red-500 text-white"}  px-2 py-1 rounded-sm`}
          >
            {props.row.original.user.isVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "LAST MODIFIED",
      header: ({ column }) => (
        <TableHeader
          column={column}
          title="STATUS"
          className="w-[100px] text-center"
        />
      ),
      cell: (props) => (
        <div className="flex items-center justify-center w-[100px]">
          {/* <GreenTick /> */}
          <span>{`${props.row.original.user.status}`}</span>
        </div>
      ),
    },
  ];

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  console.log("userData");
  console.log(userData);

  console.log("employeeData1");
  // console.log(employeeData)
  return (
    <div className=" bg-[#EEF5F9]   ">
      <div className=" bg-white">
        <div className=" w-full ">
          <div>
            <div className="px-[1.56rem]">
              <div className="pt-[1.56rem] flex justify-between items-center">
                <h3 className=" text-[1.375rem] font-semibold">Manage User</h3>
                 {/*<AddOrUpdate refetch={refetch} />*/}
              </div>

              <div className="mb-[1.81rem] mt-[2rem] flex flex-col gap-3 md:flex-row items-center md:justify-between">
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
                        option: (
                          styles,
                          { isDisabled, isFocused, isSelected },
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

            <div className=" border-lightGray mx-auto w-[95%] mt-10 rounded-xl border mb-2">
              <DataTable
                data={userData?.data || []}
                isLoading={isLoading}
                columns={columns}
                // setSortId={setSortId}
              />

              {userData?.data ? (
                <></>
              ) : (
                <>
                  {!isFetching && (
                    <div className="flex h-[500px] flex-col items-center justify-center">
                      <p className="text-lg font-medium">No matches found</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className=" flex justify-between items-center">
              {userData && (
                <p className="w-full pl-8">
                  Showing 1 - {userData?.total < 10 ? userData?.total : "10"} of{" "}
                  {userData?.total} Entries{" "}
                  {searchQuery &&
                    `(filtered from ${userData.total} total entries)`}
                </p>
              )}
              <TablePagination
                // totalCount={employeeData?.totalCount || 0}
                totalCount={userData?.totalPages as number}
                pageNo={page}
                pageSize={pageSize}
                handleClick={handlePageChange}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformSettings;
