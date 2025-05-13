import React from 'react';
import {CustomSelect} from "./CustomSelect.jsx";

export const StatusFilter = (props) => {
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
            options={[
                "ДВА",
                "ДИД",
                "ДВА/ДИД",
                "ДИА",
                "НДБА",
                "ДБА",
                "НДБА/ДИД",
                "ДБА/ДИД",
            ]}
        />
    </>
};

