import EmployeeTable from "./EmployeeTable";
import EmployeeForm from "./EmployeeForm";
import DomainVerification from "./domainVerification";
import DireectorySync from "./DirectorySync";

const Employees = () => {
  return (
    <div className=" bg-white w-full px-4">
     
        <div className="flex justify-between pb-4">
          <EmployeeForm />
          <div className="flex gap-4">
            <DomainVerification />
            <DireectorySync />
          </div>
        </div>
        <div>
          <EmployeeTable />
        </div>
      </div>
  );
};

export default Employees;
