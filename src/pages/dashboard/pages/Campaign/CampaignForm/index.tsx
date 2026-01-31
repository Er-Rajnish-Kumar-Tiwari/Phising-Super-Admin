import { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MultiStepForm from "./MultiStepping/MultiStepForm";

const CampaignForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <Button
          className=" mt-4 mb-4 text-lg font-normal bg-purple-950 hover:bg-purple-700 text-white rounded-md px-4 py-6 "
          onClick={() => setIsOpen(true)}
        >
          New Campaign
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="mb-[10]  overflow-y-scroll  max-h-[90%]  lg:max-w-[90%] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              New Campaign Wizard
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <MultiStepForm setIsOpen={setIsOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignForm;
