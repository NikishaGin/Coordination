import React from 'react';
import { ArrowIcon, SelectWrapper, StyledSelect } from './Sidebar.jsx';

export const SelectRegion = () => {
    // Массив с данными для опций
    const options = [
        { value: "option1", label: "0500" },
        { value: "option2", label: "1000" },
        { value: "option3", label: "1100" },
        { value: "option4", label: "2900" },
        { value: "option5", label: "3500" },
        { value: "option6", label: "3900" },
        { value: "option7", label: "4700" },
        { value: "option8", label: "5100" },
        { value: "option9", label: "7800" },
    ];

    return (
        <SelectWrapper>
            <StyledSelect>
                {/* Значение по умолчанию */}
                <option value="" disabled selected>
                    Выберите регион
                </option>
                {/* Динамическое формирование опций */}
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </StyledSelect>
            {/* Иконка стрелки */}
            <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 10l5 5 5-5z" />
            </ArrowIcon>
        </SelectWrapper>
    );
};

