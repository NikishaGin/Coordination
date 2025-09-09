import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import {
    useAllRegions,
    useSelectedRegionId,
    setSelectedRegion,
    fetchGetRegions,
    usePageMeta
} from "../../store/main/mainSlice.js";
import { useRoleDetection} from "../../store/user/userSlice.js";



export const SelectRegion = () => {
    const dispatch = useDispatch();

    const { isDerived, isArchived } = usePageMeta();
    const regions = useAllRegions();
    const selectedRegionId = useSelectedRegionId();
    const { isUser } = useRoleDetection();
    const limitOnUse = isUser && (regions.length === 1);
    const disabled = isUser && (regions.length <= 1);

    useEffect(() => {
        dispatch(fetchGetRegions());
    }, [dispatch, isDerived, isArchived]);

    useEffect(() => {
        if (limitOnUse) {
            const regionId = regions[0].id;
            dispatch(setSelectedRegion(regionId));
        }
    }, [regions])

    const handleChange = (event) => {
        const selectedValue = Number(event.target.value);
        dispatch(setSelectedRegion(selectedValue));
    };


    return (
        <FilterGroup>
            <SelectWrapper>
                <Select value={selectedRegionId || ""} onChange={handleChange} disabled={disabled}>
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