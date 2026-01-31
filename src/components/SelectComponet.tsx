"use client";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import Select, { StylesConfig } from "react-select";


interface DynamicSelectProps {
  options?: { label: any; value: any }[];
  defaultValue?:{ label: any; value: any },
  styles?:StylesConfig,
  isDisabled?:boolean,
  isMulti?:boolean
  value?: any;
  onChange: (value: any) => void;
  placeholder?: React.ReactNode;
  clName?: string;
  name?:string;
//   onBlur?: () => void;
}

export const SelectComponent =forwardRef<HTMLDivElement, DynamicSelectProps> ((
  {
    options,
    defaultValue,
    isDisabled,
    styles,
    value,
    onChange,
    placeholder,
    clName,
    name,
    isMulti = false,
  }: DynamicSelectProps,
  ref
)  => {
  const [isMounted, setIsMounted] = useState(false);
  const customStyles = useMemo(() => {
    const Styles: StylesConfig = {
      control: (provided, state) => ({
        ...provided,
        fontSize: "1rem",
        color: "#696767",
        fontWeight: 400,
        boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
        height: "2.7372rem",
        width: "26.125rem",
        background: "#F0F0F0",
        border: ".0625rem solid #e7eaf3",
        borderRadius: "0.3125rem",
        "@media (min-width: 320px)": {
          width: "100%",
        },
        "@media (min-width: 640px)": {
          width: "100%",
        },
        "@media (min-width: 768px)": {
          width: "25rem",
          height:"3rem"
        },
        "@media (min-width: 1024px)": {
          width: "25rem",
        },
        "@media (min-width: 1280px)": {
          width: "28rem",
          height:"2.7372rem"
        },
    
        // '@media (min-width: 1366px)': {
    
        //   width: '36.625rem',
    
        // },
    
        // '@media (min-width: 1410px)': {
    
        //   width: '38.625rem',
    
        // }
      }),
      
    };
    return Styles;
    }, []);
    useEffect(() => setIsMounted(true), []);
  return isMounted ? (
    <Select
      // styles={styles? styles:customStyles}
      styles={{ ...customStyles, ...styles }}
      options={options}
      isDisabled={isDisabled}
      isMulti={isMulti}
      value={value}
      name={name}
      onChange={onChange}
      className={clName}
      placeholder={placeholder}
      // placeholder={
      //   <span
      //     style={{
      //       color: "#696767",
      //       fontFamily: "Open Sans",
      //       fontWeight: 400,
      //       fontSize: "1rem",
      //       fontStyle: "normal",
      //       lineHeight: "normal",
      //     }}
      //   >
      //     {placeholder}
      //     {/* <span style={{ color: '#FF2800' }}>*</span> */}
      //   </span>
      // }
      components={{
        IndicatorSeparator: () => null,
        
      }}
    />
  ):null;
}
);

SelectComponent.displayName = 'SelectComponent';
// export default SelectComponent;
