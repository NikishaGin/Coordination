import React, { useEffect } from 'react';
import { useLocation } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import { UsersRole } from "../../constants.js";
import { fetchGetRegions } from "../../store/main/mainThunks.js";

export const SelectRegion = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const regions = useSelector((state) => state.main.allRegions);
    const selectedRegionId = useSelector((state) => state.main.selectedRegionId)
    const role = useSelector((state) => state.user.role)
    const isUser = role === UsersRole.USER;

    useEffect(() => {
        dispatch(fetchGetRegions());
    }, [dispatch, location.pathname]);


    // useEffect(() => {
    //     if (isUser && isExistsRegion) {
    //         dispatch(setSelectedRegionForPage({ pageKey, regionCode }));
    //         document.getElementById("region").value = regionCode;
    //     }
    // }, [regions])


    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegionForPage({ pageKey, regionCode: selectedValue }));
    };


    return (
        <FilterGroup>
            <SelectWrapper>
                <Select value={selectedRegionId || ""} onChange={handleChange} disabled={isUser}>
                    <option value="" disabled hidden>
                        Выберите регион
                    </option>
                    {regions.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.regionCode} - {item.regionName}
                        </option>
                    ))}
                </Select>
                <CustomIcon />
            </SelectWrapper>
        </FilterGroup>
    );
};