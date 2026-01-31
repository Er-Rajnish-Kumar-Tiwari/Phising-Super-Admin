import { useGetEmployeeListById } from "@/service/employee";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Props for each step component
interface StepProps {
  register: any;
  errors: any;
  setValue: any;
  watch: any;
  getValues: any;
}

const StepOne: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  watch,
  getValues,
}) => {
  // Get the current value of selectedEmployees
  const selectedEmployees = watch("step1.selectedEmployees") || [];

  register("step1.selectedEmployees");

  // Inside your component
  const [selectAll, setSelectAll] = useState(false);
  const [initialData,setInitialData]=useState<{ employeeListName: string; totalEmployees: number; _id: string; }[]>([])
  
  // Handle select all checkbox change
  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      // Select all employee lists
      const allEmployees =
        employeeData?.paginatedData.map((item) => ({
          employeeID: item._id,
          name: item.employeeListName,
        })) || [];

      setValue("step1.selectedEmployees", allEmployees, {
        shouldValidate: true,
      });
    } else {
      // Deselect all
      setValue("step1.selectedEmployees", [], { shouldValidate: true });
    }
    setSelectAll(isChecked);
  };

  const handleCheckboxChange = (
    id: string,
    name: string,
    isChecked: boolean
  ) => {

    const updatedSelection = isChecked
      ? [...selectedEmployees, { employeeID: id, name }]
      : selectedEmployees.filter(
          (employee: { employeeID: string; name: string }) =>
            employee.employeeID !== id
        );

    setValue("step1.selectedEmployees", updatedSelection, {
      shouldValidate: true,
    });
    
    // Fix: Use current employeeData instead of initialData
    // Also check if updatedSelection length matches current visible data
    if (
      updatedSelection.length === employeeData?.paginatedData.length &&
      employeeData?.paginatedData.every((item) => 
        updatedSelection.some((emp: { employeeID: string }) => emp.employeeID === item._id)
      )
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const tableParams = {
    id: localStorage.getItem("user") as string,
    search: searchQuery,
  };
  const { data: employeeData, refetch } = useGetEmployeeListById({
    ...tableParams,
  });

  useEffect(() => {
    refetch();
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Calculate total selected employees count
  const calculateTotalSelectedEmployees = () => {
    if (!employeeData?.paginatedData) return 0;

    return employeeData.paginatedData
      .filter((item) =>
        selectedEmployees.some((emp: any) => emp.employeeID === item._id)
      )
      .reduce((sum, item) => sum + item.totalEmployees, 0);
  };

  useEffect(()=>{
    if(employeeData?.paginatedData){
      setInitialData(employeeData?.paginatedData)
    }
    
  },[employeeData?.paginatedData]) // Added dependency to update when data changes

  // Update selectAll state when employeeData or selectedEmployees change
  useEffect(() => {
    if (employeeData?.paginatedData) {
      const allCurrentEmployeesSelected = employeeData.paginatedData.every((item) =>
        selectedEmployees.some((emp: { employeeID: string }) => emp.employeeID === item._id)
      );
      setSelectAll(allCurrentEmployeesSelected && employeeData.paginatedData.length > 0);
    }
  }, [employeeData?.paginatedData, selectedEmployees]);

  console.log(selectedEmployees);
  console.log("init",initialData);
  console.log(getValues("step1.campaignName"));
  console.log(employeeData?.paginatedData);
  
  return (
    <>
      <div>
        <hr className="my-4 border-t bg-[#6c757dbf]" />
        <h4 className="relative mb-4 font-semibold text-[14px]">
          <b>Initial Setup</b>
        </h4>
        <div className="flex flex-wrap justify-between -mx-2">
          <div className="w-full md:w-5/12 px-2 mb-2">
            <div className="form-group">
              <label
                htmlFor="step1.campaignName"
                className="flex items-center"
                title='This can be anything you want. We recommend something that will help to uniquely identify this campaign from others (e.g. "All-Staff-Mar-23").'
              >
                Campaign Name: <i className="fas fa-info-circle ml-1"></i>
              </label>
              <input
                type="text"
                className="form-input w-full h-10 border rounded mt-1 px-3 py-2 required"
                {...register("step1.campaignName")}
                name="step1.campaignName"
                placeholder="Enter a unique campaign name"
              />
              {errors.step1?.campaignName && (
                <p className="text-red-500 text-sm mt-2">{errors.step1.campaignName.message}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/4 md:w-1/3 px-2 mb-4 hidden trainFrequencyDiv">
            <div className="form-group mb-0">
              <label
                className="mb-0 flex items-center"
                htmlFor="trainFrequency"
                title="How often do you want training to be reassigned to your learners?"
              >
                Training Frequency: <i className="fas fa-info-circle ml-1"></i>
              </label>
            </div>
            <div className="form-group mb-0 mt-2">
              <div>
                <select
                  className="form-select w-full h-9 border rounded px-3 py-1"
                  id="trainFrequency"
                  name="trainFrequency"
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
          </div>
        </div>

        <hr className="my-4 border-t bg-[#6c757dbf]"></hr>
        <div className="mb-3" id="campaignTargetEmployeesDiv">
          <h4
            className="card-title ml-2.5"
            title="Select one or more employee lists you would like to include in this campaign."
          >
            <b> Employees List</b> <i className="fas fa-info-circle"></i>
          </h4>
          <div className="w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-1/3 md:w-1/2">
                <div className="flex mb-2 h-9">
                  <div
                    className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l"
                    title="Search for a specific employee list by typing the name of it into the search box."
                  >
                    <b>Search:</b>
                  </div>
                  <input
                    type="text"
                    className="form-input flex-grow border rounded-r px-3 py-2"
                    id="employeeSearch"
                    placeholder="Search for a specific employee list"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div className="ml-auto mr-3 w-auto">
                <div className="relative flex flex-wrap items-stretch w-full mb-2">
                  <span
                    className="flex items-center px-3 py-2 bg-gray-100 border rounded-l"
                    title="Select all available employee lists."
                  >
                    <strong>
                      Select All <i className="fas fa-info-circle ml-1"></i>
                    </strong>
                  </span>
                  <div className="flex items-center px-3 bg-gray-200 border rounded-r">
                    <div className=" ml-1.5 bg-white">
                      <input
                        type="checkbox"
                        className="hidden"
                        id="selectAllEmployeeLists"
                        checked={selectAll}
                        onChange={(e) =>
                          handleSelectAllChange(e.target.checked)
                        }
                      />
                      <label
                        htmlFor="selectAllEmployeeLists"
                        className=" relative flex items-center "
                      >
                        <div
                          className={` border ${
                            selectAll
                              ? "border-blue-500 bg-blue-500"
                              : "border-none"
                          } rounded w-5 h-5 flex items-center justify-center`}
                        >
                          {selectAll && (
                            <svg
                              className="absolute inset-0 m-auto w-3 h-3 text-white fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M6 10l3 3l6-6"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                              />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="float-right mr-3 w-auto">
                <div className="flex mb-2 h-9">
                  <span className="flex items-center px-3 bg-gray-100 border rounded-l">
                    <strong>Total Employees: </strong>
                  </span>
                  <input
                    type="text"
                    className="w-12 font-bold border rounded-r px-2 bg-gray-100"
                    id="targetCount"
                    value={calculateTotalSelectedEmployees()}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded p-2.5 pt-3.5 pb-0 max-h-[200px] overflow-auto">
              <div className="flex flex-wrap mb-2">
                {employeeData?.paginatedData.map((item: any) => (
                  <div
                    className="w-full md:w-1/3 flex-none px-[10px]"
                    key={item._id}
                  >
                    <label className="flex items-center p-3 border rounded cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.some(
                          (data: { employeeID: string }) =>
                            data.employeeID == item._id
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            item._id,
                            item.employeeListName,
                            e.target.checked
                          )
                        }
                        className="hidden"
                      />
                      <div className="flex gap-2 items-center">
                        <div
                          className={`w-5 h-5 border ${
                            selectedEmployees.some(
                              (data: { employeeID: string }) =>
                                data.employeeID == item._id
                            )
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          } rounded mr-2 flex-shrink-0 relative`}
                        >
                          {selectedEmployees.some(
                            (data: { employeeID: string }) =>
                              data.employeeID == item._id
                          ) && (
                            <svg
                              className="absolute inset-0 m-auto w-3 h-3 text-white fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M6 10l3 3l6-6"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="overflow-auto">
                          <strong className="mr-1">
                            {item.employeeListName}
                          </strong>{" "}
                          ({item.totalEmployees} Employee)
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {errors.step1?.selectedEmployees && (
              <>
                <p className="text-red-500 text-sm mt-2">
                  {"Please select at least one employee list"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StepOne;