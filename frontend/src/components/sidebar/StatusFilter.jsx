import React from 'react';
import {CustomSelect} from "./CustomSelect.jsx";

export const StatusFilter = (props) => {
    return <>
        <CustomSelect
            value={props.statusIP}
            onChange={props.setStatusIP}
            placeholder="Статус ИП"
            options={[
                {value: "active", label: "На исполнении"},
                {value: "inactive", label: "Приостановлено"},
                {value: "inactive", label: "Отложено"},
                {value: "inactive", label: "Прекращено"},
                {value: "inactive", label: "Окончено"},
            ]}
        />
        <CustomSelect
            value={props.category}
            onChange={props.setCategory}
            placeholder="Категория"
            options={[
                {value: "individual", label: "ДВА"},
                {value: "legal", label: "ДИД"},
                {value: "legal", label: "ДВА/ДИД"},
                {value: "legal", label: "ДИА"},
                {value: "legal", label: "НДБА"},
                {value: "legal", label: "ДБА"},
                {value: "legal", label: "НДБА/ДИД"},
                {value: "legal", label: "ДБА/ДИД"},
            ]}
        />
    </>
};

