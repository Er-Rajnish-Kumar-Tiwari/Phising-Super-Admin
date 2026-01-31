import CampaignForm from "./CampaignForm";
import EmployeeTable from "./CampaignTable";

const Campaign = () => {
  return (
    <div className=" bg-white min-h-[calc(100vh-30px)] ">
      <div className="container mx-auto">
        {/* <div className="flex flex-col pt-4 pb-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-32 rounded-xl bg-white"></div>
            <div className="h-32 rounded-xl bg-white"></div>
            <div className="h-32 rounded-xl bg-white"></div>
          </div>
        </div> */}
        <div className="flex justify-between pb-4">
          <CampaignForm />
        </div>
        <div>
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
};

export default Campaign;
