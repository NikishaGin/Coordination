import React, {useState, useEffect, useContext} from 'react';
import { ArrowIcon, SelectWrapper, StyledSelect } from './Sidebar.jsx';
import { serviceAPI } from "../../api/index.js"
import {useDispatch, useSelector} from "react-redux";
import {setSelectedRegion} from "../../store/globalSlice.js";


export const SelectRegion = () => {
    const dispatch = useDispatch(); // Получаем функцию dispatch
    const [listRegions, setListRegions] = useState([]);
    const selectedRegion = useSelector((state) => state.global.selectedRegion);

    useEffect(() => {
        serviceAPI.getRegions("Index")
            .then(data => setListRegions(data.data))
            .catch(console.log)
    }, []);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegion(selectedValue)); // Обновляем выбранный регион
    };

    return (
        <SelectWrapper>
            <StyledSelect value={selectedRegion} onChange={handleChange}>
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

