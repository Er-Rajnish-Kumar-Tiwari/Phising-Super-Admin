import { SelectComponent } from "@/components/SelectComponet";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { SelectStyles } from "./constant";
import { CountryList } from "@/pages/auth/pages/constant";
import Symbol from "@/assets/icons/auth/Symbol.svg";

const DirectoryImport = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="space-y-4 py-4">
      {/* No Directory Sync Warning */}
      <div className="text-red-500 font-bold">
        No Entra ID or Google Workspace Directories have been synced. Exit this
        popup and click <b>Directory Sync</b> to get started.
      </div>

      <div className="flex items-center gap-2">
        <div className="w-[80%]">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="mt-2 w-[15%]">
              <Label
                htmlFor="password"
                className=" block mb-2 font-bold text-default-600"
              >
                Storage Region
              </Label>
            </div>
            <SelectComponent
              // {...register("country")}
              styles={SelectStyles}
              options={CountryList}
              placeholder="Select profession"
              clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
              onChange={() => {
                // setValue('country', selectedOption); // Update the form value
              }}
            />
            {/* {errors.country && !getValues("country")?.label && (
                                    <div className="text-destructive mt-2">
                                        {errors.country.label?.message || errors.country.value?.message}
                                    </div>
                                )} */}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="w-[15%] text-sm font-medium">
              Directory Groups
            </label>
            <input
              className="w-full p-2 border border-gray-300 bg-gray-300 rounded-sm"
              id="dGroups2"
              multiple
              disabled
            />
          </div>
        </div>

        {/* Video Card */}
        <div className="hidden lg:block mt-4">
          <a
            href="https://www.youtube.com/watch?v=r4W874lbcNc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-md"
          >
            <div className="relative">
              <img
                src="https://d3p8e1mvy30w84.cloudfront.net/assets/images/thumbnails/gaz-thumbnail2.png"
                alt="Video Thumbnail"
                className="w-24 h-24 rounded-lg"
              />
              <i className="fas fa-play-circle absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl"></i>
            </div>
            <div className="ml-4">
              <small className="text-xs font-bold uppercase text-gray-600">
                WALKTHROUGH VIDEO
              </small>
              <p className="text-lg font-semibold text-gray-800">
                Learn how to use directory sync filtering.
              </p>
            </div>
          </a>
        </div>
      </div>
      {/* Directory Attribute Mapping */}
      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
        <label className="text-lg font-bold">Directory Attribute Mapping</label>

        {/* Show Filtering Options */}
        <div className="mt-4">
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={toggleAdvanced}
          >
            Show Filtering Options...
          </button>
        </div>

        {/* Advanced Filtering Options */}
        {showAdvanced && (
          <div className="mt-4">
            <label className="text-lg font-bold">
              Directory Filters{" "}
              <i className="fas fa-info-circle text-gray-400"></i>
            </label>
            <hr className="my-2" />

            {[1, 2, 3].map((index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor={`ffUSelect${index}`}
                      className="text-sm text-gray-600"
                    >
                      #{index} Attribute Filter
                    </label>
                    <select
                      id={`ffUSelect${index}`}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option>Select an attribute to filter against</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor={`fvUSelect${index}`}
                      className="text-sm text-gray-600"
                    >
                      #{index} Attribute Value(s){" "}
                      <i className="fas fa-info-circle text-gray-400"></i>
                    </label>
                    <select
                      id={`fvUSelect${index}`}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      multiple
                    >
                      <option>
                        Specify one or more filters by typing the value and
                        pressing enter.
                      </option>
                    </select>
                  </div>
                </div>
                <hr className="my-2" />
              </div>
            ))}

            {/* Directory Group Exclusion */}
            <div className="mt-4">
              <label htmlFor="dIExclude2" className="text-sm text-gray-600">
                Directory Group Exclusion{" "}
                <i className="fas fa-info-circle text-gray-400"></i>
              </label>
              <select
                id="dIExclude2"
                className="w-full p-2 border border-gray-300 rounded-lg"
                multiple
                disabled
              >
                <option>Exempt target directory group(s)</option>
              </select>
            </div>

            {/* Manually Deleted Employees */}
            <div className="mt-4">
              <label htmlFor="dEUSelect2" className="text-sm text-gray-600">
                Manually Deleted Employees{" "}
                <i className="fas fa-info-circle text-gray-400"></i>
              </label>
              <select
                id="dEUSelect2"
                className="w-full p-2 border border-gray-300 rounded-lg"
                multiple
              >
                <option>
                  Specify one or more filters by typing the value and pressing
                  enter.
                </option>
              </select>
            </div>

            {/* Note */}
            <p className="mt-2 text-sm text-gray-600">
              <i>
                Note: To use wildcards, date filters, or NOT operators, please
                see our{" "}
                <a
                  href="https://help.caniphish.com/hc/en-us/articles/6422060501135-Employee-Directory-Sync-Filtering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-500"
                >
                  Directory Sync Filtering Support Article
                </a>
                .
              </i>
            </p>
          </div>
        )}
      </div>

      {/* Sync Button */}
      <div className="mt-4">
        <button
          type="button"
          className="p-2 bg-purple-950 text-white hover:bg-purple-800 rounded-lg disabled:bg-gray-300"
          disabled
        >
          <i className="fas fa-sync"></i> Sync Directory Employees
        </button>
      </div>
    </div>
  );
};

export default DirectoryImport;
