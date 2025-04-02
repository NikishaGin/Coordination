import React, { useState, useEffect } from 'react';
import { ArrowIcon, SelectWrapper, StyledSelect } from './Sidebar.jsx';
import { serviceAPI } from "../../api/index.js"


export const SelectRegion = () => {
    const [listRegions, setListRegions] = useState([]);

    useEffect(() => {
        serviceAPI.getRegions("Index").then(data => setListRegions(data.data)).catch(console.log)
    }, []);

    return (
        <SelectWrapper>
            <StyledSelect>
                {/* Значение по умолчанию */}
                <option value="" disabled selected>
                    Выберите регион
                </option>
                {/* Остальные опции */}
                {listRegions.map(item => <option key={item.regionCode} value={item.regionCode}>{item.regionCode} - {item.regionName}</option>)}
            </StyledSelect>
            {/* Иконка стрелки */}
            <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 10l5 5 5-5z" />
            </ArrowIcon>
        </SelectWrapper>
    );
};

