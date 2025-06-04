import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchGetRegions, setSelectedRegionForPage} from "../../store/globalSlice.js";
import {CustomIcon, FilterGroup, Select, SelectWrapper} from "../select/Select.jsx";
import { useLocation } from "react-router";

export const SelectRegion = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const regions = useSelector((state) => state.global.regions);
    const selectedRegionByPage = useSelector((state) => state.global.selectedRegionByPage);

    const [pageKey, setPageKey] = useState("default");

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

        setPageKey(key);

        dispatch(fetchGetRegions(key));
        // не сбрасываем выбранный регион — он сохраняется в state по pageKey
    }, [dispatch, location.pathname]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegionForPage({ pageKey, regionCode: selectedValue }));

    };

    const selectedRegion = selectedRegionByPage?.[pageKey] || "";

    return (
        <FilterGroup>
            <SelectWrapper>
                <Select id="region" value={selectedRegion || ""} onChange={handleChange}>
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
