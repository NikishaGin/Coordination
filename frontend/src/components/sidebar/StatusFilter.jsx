import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CustomIcon, FilterGroup, Select, SelectWrapper} from "../select/Select.jsx";

export const StatusFilter = (props) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.main.allClientCategories);
    //
    // useEffect(() => {
    //     dispatch(fetchGetDebitTypes());
    // }, []);

    return (
        <FilterGroup>
            <SelectWrapper style={{marginBottom: '16px'}}>
                    <Select
                        id="status"
                        value={props.statusIP}
                        onChange={(event) => props.setStatusIP(event.target.value)}
                    >
                        <option value="">Все статусы</option>
                        <option value="На исполнении">На исполнении</option>
                        <option value="Приостановлено">Приостановлено</option>
                        <option value="Отложено">Отложено</option>
                        <option value="Прекращено">Прекращено</option>
                        <option value="Окончено">Окончено</option>
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>


            <SelectWrapper>
                    <Select
                        id="category"
                        value={props.category}
                        onChange={(event) => props.setCategory(event.target.value)}
                    >
                        <option value="">Все категории</option>
                        {categories?.map((category, idx) => (
                            <option key={idx} value={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>
        </FilterGroup>
    );
};
