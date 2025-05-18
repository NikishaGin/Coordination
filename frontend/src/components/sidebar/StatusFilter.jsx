import React, {useEffect} from 'react';
import {CustomSelect} from "./CustomSelect.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchGetDebitTypes} from "../../store/globalSlice.js";

export const StatusFilter = (props) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.global.debitTypes);

    useEffect(() =>  {
        dispatch(fetchGetDebitTypes())
    }, [])

    return <>
        <CustomSelect
            value={props.statusIP}
            onChange={event => props.setStatusIP(event.target.value)}
            placeholder="Статус ИП"
            options={[
                "На исполнении",
                "Приостановлено",
                "Отложено",
                "Прекращено",
                "Окончено",
            ]}
        />
        <CustomSelect
            value={props.category}
            onChange={event => props.setCategory(event.target.value)}
            placeholder="Категория"
            options={categories}
        />
    </>
};

