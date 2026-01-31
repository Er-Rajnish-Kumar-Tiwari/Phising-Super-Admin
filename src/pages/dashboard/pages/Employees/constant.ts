import { StylesConfig } from "react-select";

export const bookingStatusList = [
  {
    value: 'all',
    label: 'All',
    className: 'bg-[#FFFCAD] text-[#312F00]',
  },
  {
    value: 'captured',
    label: 'Captured',
    className: 'bg-[#FFFCAD] text-[#312F00]',
  },
  {
    value: 'authorized',
    label: 'Authorized',
    className: 'bg-[#FFFCAD] text-[#312F00]',
  },
  {
    value: 'failed',
    label: 'Failed',
    className: 'bg-[#FFFCAD] text-[#312F00]',
  },
]

export const checkingStatus = {
  all: 'all',
  captured: 'captured',
  authorized: 'authorized',
  failed: 'failed',
}


export const SelectStyles: StylesConfig = {
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