import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import { getAllClientCategories, getAllStatusesIP } from "../../store/main/mainSlice.js";
import { fetchGetClientCategories, fetchGetStatusesIP } from "../../store/main/mainThunks.js";

export const StatusFilter = (props) => {
    const dispatch = useDispatch();

    const categories = getAllClientCategories();
    const statuses = getAllStatusesIP();

    useEffect(() => {
        dispatch(fetchGetStatusesIP());
        dispatch(fetchGetClientCategories())
    }, [dispatch]);

    const handleSelectStatuses = event => props.setStatusIP(event.target.value);
    const handleSelectCategories = event => props.setCategory(event.target.value);

    return (
        <FilterGroup>
            <SelectWrapper style={{marginBottom: '16px'}}>
                    <Select
                        value={props.statusIP}
                        onChange={handleSelectStatuses}
                    >
                        <option value="">Все статусы</option>
                        {statuses.map((status, index) => (
                            <option key={index}>{status}</option>
                        ))}
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>

            <SelectWrapper>
                    <Select
                        value={props.category}
                        onChange={handleSelectCategories}
                    >
                        <option value="">Все категории</option>
                        {categories.map(({ id, category }) => (
                            <option key={id} value={id}>
                                {category}
                            </option>
                        ))}
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>
        </FilterGroup>
    );
};
