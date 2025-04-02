import React from 'react';
import {ArrowIcon, SelectWrapper, StyledSelect} from "./Sidebar.jsx";

export const CustomSelect = (props) => {
    return (
        <SelectWrapper>
            <StyledSelect value={props.value} onChange={(e) => props.onChange(e.target.value)}>
                <option value="" disabled>
                    {props.placeholder}
                </option>
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>
            <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 10l5 5 5-5z" />
            </ArrowIcon>
        </SelectWrapper>
    );
};


