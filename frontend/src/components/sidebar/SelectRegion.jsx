import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageKey, fetchGetRegions, setSelectedRegionForPage } from "../../store/globalSlice.js";
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import { useLocation } from "react-router";
import {ROLES} from "../../types.js";

export const SelectRegion = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const regions = useSelector((state) => state.global.regions);
    const pageKey = useSelector((state) => state.global.pageKey);
    const role = useSelector((state) => state.user.role)
    const regionCode = useSelector((state) => state.user.regionCode)
    const isUser = role === ROLES.User;
    const isExistsRegion = regions.map(item => item.regionCode).includes(regionCode)
    const selectedRegionByPage = useSelector((state) => state.global.selectedRegionByPage);

    useEffect(() => {
        let key = "default";

        if (location.pathname === "/coordination-archive") {
            key = "IndexArchive";
        } else if (location.pathname === "/coordination") {
            key = "Index";
        } else if (location.pathname === "/derivative-archive") {
            key = "DerivativeDebtArchive";
        } else if (location.pathname === "/derivative") {
            key = "DerivativeDebt";
        }
        dispatch(setPageKey(key));
        dispatch(fetchGetRegions(key));
        // не сбрасываем выбранный регион — он сохраняется в state по pageKey
    }, [dispatch, location.pathname]);


    useEffect(() => {
        if (isUser && isExistsRegion) {
            dispatch(setSelectedRegionForPage({ pageKey, regionCode }));
            document.getElementById("region").value = regionCode;
        }
    }, [regions])


    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegionForPage({ pageKey, regionCode: selectedValue }));
    };

    const selectedRegion = selectedRegionByPage?.[pageKey] || "";

    return (
        <FilterGroup>
            <SelectWrapper>
                <Select id="region" value={selectedRegion || ""} onChange={handleChange} disabled={isUser && isExistsRegion}>
                    <option value="" disabled hidden>
                        Выберите регион
                    </option>
                    {regions.map((item) => (
                        <option key={item.regionCode} value={item.regionCode}>
                            {item.regionName ? `${item.regionCode} - ${item.regionName}` : item.regionCode}
                        </option>
                    ))}
                </Select>
                <CustomIcon />
            </SelectWrapper>
        </FilterGroup>
    );
};