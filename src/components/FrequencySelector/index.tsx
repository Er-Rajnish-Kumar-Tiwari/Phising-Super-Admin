import { cn } from '@/lib/utils';
import { CampaignFrequency } from '@/service/campaign/api';
import React, { useState, useEffect } from 'react';
import Datepicker, { DateValueType }  from 'react-tailwindcss-datepicker';

interface StepProps {
  register: any;
  setValue: any;
  getValues: any;
}

const FrequencySelector: React.FC<StepProps> = ({ register, setValue, getValues }) => {
  const [selectedFrequency, setSelectedFrequency] = useState('once');
  const [showExpiry, setShowExpiry] = useState(false);
  const [dateValue, setDateValue] = useState<DateValueType>({ 
    startDate: getValues("step3.scheduleDateTime"), 
    endDate: getValues("step3.scheduleDateTime") 
  });

//   const nextYearDate = new Date();
// nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

  // Initialize with form values if they exist
  useEffect(() => {
    const initialFrequency = getValues("step3.schedulefrequency") || 'once';
    // const initialFrequency =  'once' || getValues();
    setSelectedFrequency(initialFrequency);
    setShowExpiry(initialFrequency !== 'once');
    
    const initialDate = getValues("step3.scheduleDateTime");
    if (initialDate) {
      setDateValue({
        startDate: initialDate ,
        endDate: initialDate || null
      });
    }
  }, [getValues]);

  const expiryDate=new Date(new Date().setFullYear(new Date().getFullYear() + 1)) ;

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
    setShowExpiry(frequency !== 'once');
    // setValue("step3.frequency", frequency);
    
    // Clear expiry date if switching to one-off
    if (frequency === 'once') {
      setValue("step3.scheduleDateTime", '');
      setDateValue({ startDate: null, endDate: null });
      setValue("step3.schedulefrequency",CampaignFrequency.ONCE)
    }

    if(frequency==="weekly"){
      setValue("step3.schedulefrequency",CampaignFrequency.Weekly)
      setDateValue({ startDate: expiryDate, endDate: expiryDate });
      setValue("step3.scheduleDateTime", expiryDate);
    }
    if(frequency==="monthly"){
      setValue("step3.schedulefrequency",CampaignFrequency.Monthly)
      setDateValue({ startDate: expiryDate, endDate: expiryDate });
      setValue("step3.scheduleDateTime", expiryDate);
    }
    if(frequency==="quarterly"){
      setValue("step3.schedulefrequency",CampaignFrequency.Quarterly)
      setDateValue({ startDate: expiryDate, endDate: expiryDate });
      setValue("step3.scheduleDateTime", expiryDate);
    }
    // if(frequency==="fortnightly"){
    //   setValue("step3.schedulefrequency",CampaignFrequency.Fortnightly)
    // }
  };

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
    setValue("step3.scheduleDateTime", newValue?.startDate);
  };


  const frequencyOptions = [
    { 
      id: 'chkFrequencyOnce2', 
      value: 'once', 
      label: 'One-Off', 
      tooltip: 'One-Off campaign, based on the defined schedule.' 
    },
    { 
      id: 'chkFrequencyWeekly2', 
      value: 'weekly', 
      label: 'Weekly', 
      tooltip: 'Campaign will recur every 7 days.' 
    },
    // { 
    //   id: 'chkFrequencyFortnightly2', 
    //   value: 'fortnightly', 
    //   label: 'Fortnightly', 
    //   tooltip: 'Campaign will recur every 2 weeks.' 
    // },
    { 
      id: 'chkFrequencyMonthly2', 
      value: 'monthly', 
      label: 'Monthly', 
      tooltip: 'Campaign will recur every 4 to 5 weeks.' 
    },
    { 
      id: 'chkFrequencyQuarterly2', 
      value: 'quarterly', 
      label: 'Quarterly', 
      tooltip: 'Campaign will recur every 13 weeks.' 
    },
  ];

  console.log(getValues("step3.scheduleDateTime"))
  console.log(getValues("step3.schedulefrequency"))

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      {/* Radio Button Group */}
      <div className="flex flex-wrap gap-2">
        {frequencyOptions.map((option) => (
          <React.Fragment key={option.id}>
            <input
              type="radio"
              className="hidden"
              id={option.id}
              // {...register("step3.frequency")}
              value={option.value}
              checked={selectedFrequency === option.value}
              onChange={() => handleFrequencyChange(option.value)}
            />
            <label
              htmlFor={option.id}
              className={`px-4 py-2 rounded-md cursor-pointer transition-colors text-sm ${
                selectedFrequency === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              title={option.tooltip}
            >
              {option.label}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Date Picker (Conditional) */}
      {getValues("step3.scheduleDateTime") && (
        // <div className='flex items-center border rounded-md w-full md:w-auto'>
        //   <span className="px-3 py-2 bg-gray-100 border-r font-semibold text-sm">
        //     Expire After:
        //   </span>
        //   <Datepicker 
            
        //     useRange={false}
        //     containerClassName="relative w-full min-w-[200px]"
        //     asSingle={true}
        //     value={dateValue }
        //     inputName="step3.scheduleDateTime"
        //     popoverDirection="up"
        //     onChange={handleDateChange}
        //     toggleClassName={(className) =>
        //       cn(
        //         className,
        //         'text-[#696767]',
        //         'bg-gray-300 rounded-tr-[0.325rem] rounded-br-[0.325rem] absolute right-0'
        //       )
        //     }
        //     inputClassName={cn(
        //       'rounded-[0.325rem] h-[2.5rem] w-full border-2 border-[#F6F6F6]',
        //       'text-[#696767] p-3 text-black outline-none'
        //     )}
        //   />
        // </div>
        <div className='flex items-center border rounded-md w-full md:w-auto'>
            <span className="px-3 py-2 bg-gray-100 border-r font-semibold text-sm">
              Expire After:
            </span>
            <Datepicker
              
              useRange={false}
              containerClassName="relative "
              asSingle={true}
            value={dateValue }
              displayFormat="DD/MM/YYYY"
              inputName="step3.scheduleDateTime"
              popoverDirection="up"
              onChange={handleDateChange}
              toggleClassName={(className) =>
                cn(
                  className,
                  'text-[#696767]',
                  'bg-gray-300 rounded-tr-[0.325rem] rounded-br-[0.325rem] absolute right-0'
                )
              }
              inputClassName={cn(
                ' h-[2.3rem] w-full border-2 border-[#F6F6F6]',
                'text-[#696767] p-3 text-black outline-none'
              )}
            />
          </div>
      )}
    </div>
  );
};

export default FrequencySelector;