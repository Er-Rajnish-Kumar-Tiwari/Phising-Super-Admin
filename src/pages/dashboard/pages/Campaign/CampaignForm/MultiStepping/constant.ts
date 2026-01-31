import * as yup from "yup";
import { StylesConfig } from "react-select";

export const SelectStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "1rem",
      color: "#696767",
      fontWeight: 400,
      boxShadow: state.isFocused ? "none" : "none",
      '::placeholder': {
        color: '#696767',
      },
      height: "2.7372rem",
      width: "26.125rem",
      background: "white",
      overflowX:"unset",
    //   border: ".0625rem solid #e7eaf3",
      borderRadius: "0.3125rem",
      marginTop:"0px",
      "@media (min-width: 320px)": {
        width: "85%",
        marginLeft:"auto",
        marginRight:"auto",
        height:"2.25rem"
      },
      "@media (min-width: 640px)": {
        width: "100%",
      },
      "@media (min-width: 768px)": {
        width: "100%",
        height:"3rem"
      },
      "@media (min-width: 1024px)": {
        width: "100%",
      },
      "@media (min-width: 1280px)": {
        width: "100%",
        height:"2.25rem",
        
      },
  
    }),
    placeholder: (styles) => ({
        ...styles,
        color: '#696767',
        textIndent: '0.625rem',
      }),
    
  };


export const AIValidationSchema = yup.object({
  aitemplateName: yup.string().required("Template name is required"),
  category: yup
      .object()
      .shape({
        label: yup.string().required("Select the Category"),
        value: yup.string().required("Select the Category"),
      })
      .required("Select the Category"),
  tone: yup
      .object()
      .shape({
        label: yup.string().required("Select the Tone"),
        value: yup.string().required("Select the Tone"),
      })
      .required("Select the Tone"),
 industry: yup
     .object()
     .shape({
       label: yup.string().required("Select the Country"),
       value: yup.string().required("enter"),
     })
     .required("Select the Country")
});

export const optionNew=[
    { label: "Afghanistan", value: "Afghanistan" },
    { label: "Åland Islands", value: "Åland Islands" },
    { label: "Albania", value: "Albania" },
    { label: "Algeria", value: "Algeria" }
]

export const options = [
    { value: 'learn-more', label: 'Learn More' },
    { value: 'read-more', label: 'Read More' },
    { value: 'explore', label: 'Explore' },
    { value: 'view-plans', label: 'View Plans' },
    { value: 'click-here', label: 'Click here' },
    { value: 'download-now', label: 'Download Now' },
    { value: 'schedule-call', label: 'Schedule a Call' },
    { value: 'book-demo', label: 'Book a Free Demo' },
    { value: 'get-in-touch', label: 'Get in Touch' },
    { value: 'contact-sales', label: 'Contact Sales' },
    { value: 'request-callback', label: 'Request a Callback' },
    { value: 'chat-with-us', label: 'Chat with Us' },
    { value: 'talk-to-expert', label: 'Talk to an Expert' },
    { value: 'sign-up', label: 'Sign Up' },
    { value: 'others', label: 'Others' },
  ];


export const Category=[
    {
        label:"Compliance",value:"Compliance"
    },
    {
        label:"Customer Support",value:"Customer Support"
    },
    {
        label:"Financial",value:"Financial"
    },
    {
        label:"Health and Safety",value:"Health and Safety"
    },
    {
        label:"Human Resources",value:"Human Resources"
    },
    {
        label:"Internal Community",value:"Internal Community"
    },
    {
        label:"Legal",value:"Legal"
    },
    {
        label:"Marketing",value:"Marketing"
    },
    {
        label:"Payroll",value:"Payroll"
    },
    {
        label:"Product Documentation",value:"Product Documentation"
    },
    {
        label:"Quality Assurance",value:"Quality Assurance"
    },
    {
        label:"Research and Development",value:"Research and Development"
    },
    {
        label:"Sales Pitch",value:"Sales Pitch"
    },
    {
        label:"Supply Chain",value:"Supply Chain"
    },
    {
        label:"Shopping",value:"Shopping"
    },
    {
        label:"Technical",value:"Technical"
    },
    {
        label:"Training",value:"Training"
    }
]

export const Industy=[
    {
        label:"Account",value:"Account"
    },
    {
        label:"Advertising",value:"Advertising"
    },
    {
        label:"Aerospace and Defence",value:"Aerospace and Defence"
    },
    {
        label:"Agricultural Products",value:"Agricultural Products"
    },
    {
        label:"Airlines",value:"Airlines"
    },
    {
        label:"Airline Aviation",value:"Airline Aviation"
    },
    {
        label:"Alternative Dispute Resolution",value:"Alternative Dispute Resolution"
    },
    {
        label:"Alternative Medicine",value:"Alternative Medicine"
    },
    {
        label:"Apperal and Fashion",value:"Apperal and Fashion"
    },
    {
        label:"Apperal Accessories and Luxuary Goods",value:"Apperal Accessories and Luxuary Goods"
    },
    {
        label:"Agriculture",value:"Agriculture"
    },
    {
        label:"Agriculture and Planning",value:"Agriculture and Planning"
    },
    {
        label:"Arts and Craft",value:"Arts and Craft"
    },
    {
        label:"Asset Managemnt and Custody Banks",value:"Assets managemnt and Custody Banks"
    },
    {
        label:"Audio and Video Technology",value:"Audio and Video Technology"
    },
    {
        label:"Automation",value:"Automation"
    },
    {
        label:"Automative",value:"Automative"
    },
    {
        label:"Aviation and Aerospace",value:"Aviation and Aerospace"
    },
    {
        label:"Banking",value:"Banking"
    },
    {
        label:"Banking and Mortgages",value:"Banking and Mortgages"
    },
    {
        label:"Beverages",value:"Beverages"
    },
    {
        label:"Biotechnology",value:"Biotechnology"
    },
    {
        label:"Broadcast Media",value:"Broadcast Media"
    },
    {
        label:"Broadcast",value:"Broadcast"
    },
    {
        label:"Building Materials",value:"Building Materials"
    },
    {
        label:"Business Supplies",value:"Business Supplies"
    },
    {
        label:"Business Supplies and Equipment",value:"Business Supplies and Equipment"
    },
    {
        label:"Capital Goods",value:"Capital Goods"
    },
    {
        label:"Capital Markets",value:"Capital Markets"
    },
    {
        label:"Casino Gaming",value:"Casino Gaming"
    },
    {
        label:"Chemicals",value:"Chemicals"
    },
    {
        label:"civic and Social Organization",value:"civic and Social Organization"
    },
    {
        label:"Civil Engineering",value:"Civil Engineering"
    },
    {
        label:"Cloud Services",value:"Cloud Services"
    },
    {
        label:"Commercial Printing",value:"Commercial Printing"
    },
    {
        label:"Commercial Real Estate",value:"Commercial Real Estate"
    },
    {
        label:"Commodity Chemicals",value:"Commodity Chemicals"
    },
    {
        label:"Communications",value:"Communications"
    },
    {
        label:"Computer and Network",value:"Computer and Network"
    },
    {
        label:"Computer Hardware",value:"Computer Hardware"
    },
    {
        label:"Computer Networking",value:"Computer Networking"
    },
    {
        label:"Computer Software",value:"Computer Software"
    },
    {
        label:"Construction",value:"Construction"
    },
    {
        label:"Construction and Engineering",value:"Construction and Engineering"
    },
    {
        label:"Consulting",value:"Consulting"
    },
    {
        label:"Consumer Discretionary",value:"Consumer Discretionary"
    },
    {
        label:"Consumer Electronic",value:"Consumer Electronic"
    },
    {
        label:"Consumer Goods",value:"Consumer Goods"
    },
    {
        label:"Consumer Service",value:"Consumer Service"
    },
    {
        label:"Consumer Staples",value:"Consumer Staples"
    },
    {
        label:"Containers and Packaging",value:"Containers and Packaging"
    },
    {
        label:"Cosmatic",value:"Cosmatic"
    }
]

export const Tone=[
    {
        label:"Casual",value:"Casual"
    },
    {
        label:"Enthusiatic",value:"Enthusiatic"
    },
    {
        label:"Formal",value:"Formal"
    },
    {
        label:"Friendly",value:"Friendly"
    },
    {
        label:"Homorous",value:"Homorus"
    },
    {
        label:"Neutral",value:"Neutral"
    },
    {
        label:"Optamistic",value:"Optamistic"
    },
    {
        label:"Persimistic",value:"Persimistic"
    },
    {
        label:"Professtional",value:"Professtional"
    },
    {
        label:"Sarcastic",value:"Sarcastic"
    },
    {
        label:"Urgent",value:"Urgent"
    }
]


export const AISelectStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "1rem",
      color: "#696767",
      fontWeight: 400,
      boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
      '::placeholder': {
        color: '#696767',
      },
      height: "2.7372rem",
      width: "26.125rem",
      background: "white",
    //   overflowX:"unset",
      border: ".0625rem solid #e7eaf3",
      borderRadius: "0.3125rem",
      marginTop:"0px",
      "@media (min-width: 320px)": {
        width: "85%",
        marginLeft:"auto",
        marginRight:"auto",
        height:"2.25rem"
      },
      "@media (min-width: 640px)": {
        width: "100%",
      },
      "@media (min-width: 768px)": {
        width: "100%",
        height:"3rem"
      },
      "@media (min-width: 1024px)": {
        width: "100%",
      },
      "@media (min-width: 1280px)": {
        width: "100%",
        height:"2.25rem",
        
      },
  
    }),
    placeholder: (styles) => ({
        ...styles,
        color: '#696767',
        textIndent: '0.625rem',
      }),
    
  };