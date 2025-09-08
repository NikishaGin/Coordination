import React, { useEffect } from 'react';
import { useLocation } from "react-router";
import { useDispatch } from 'react-redux';
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import { getAllRegions, getSelectedRegionId, setSelectedRegion, fetchGetRegions } from "../../store/main/mainSlice.js";
import { useRoleDetection} from "../../store/user/userSlice.js";



export const SelectRegion = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const regions = getAllRegions();
    const selectedRegionId = getSelectedRegionId();
    const { isUser } = useRoleDetection();
    const limitOnUse = isUser && (regions.length === 1);

    useEffect(() => {
        dispatch(fetchGetRegions());
    }, [dispatch, location.pathname]);

    useEffect(() => {
        if (limitOnUse) {
            const regionId = regions[0].id;
            dispatch(setSelectedRegion(regionId));
        }
    }, [regions])

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegion(selectedValue));
    };


    return (
        <FilterGroup>
            <SelectWrapper>
                <Select value={selectedRegionId || ""} onChange={handleChange} disabled={limitOnUse}>
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