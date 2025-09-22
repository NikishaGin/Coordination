import React, { useRef } from "react";
import { EditableCell } from "./components/inputs/EditableCell.jsx";
import { InputCell, NumberCell } from "./components/table/TableStyles.js";
// import DebitForm from "./components/modalForm/DebitForm.jsx";
// import OtherAssetForm from "./components/modalForm/OtherAssetForm.jsx";
import { ActivesType } from "../../../../constants.js";
import { extractValuesFromObject } from "../../../../utils/extractValuesFromObject.js";
import { parseDate } from "../../../../utils/formatData.js";



const InfoField = (
    key,
    isAdmin,
    onSaveValue,
    { type='text', transform=(value) => value }={},
) => (row) => {
    const Cell = type === 'number' ? NumberCell : InputCell ;
    return (
        <Cell>
            <EditableCell
                type={type}
                value={extractValuesFromObject(row, key) || ''}
                onSave={onSaveValue(key, transform)}
                isEditable={isAdmin}
            />
        </Cell>
    )
};


const CommonFields = (type, onSaveValue) => [

]



export const TableContent = {
    [ActivesType.TRANSPORT]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'Марка',                 field: InfoField('description.name',        isAdmin, onSaveValue) },
            { headerName: 'VIN-номер',             field: InfoField('description.vin',         isAdmin, onSaveValue) },
            { headerName: 'Государственный номер', field: InfoField('description.stateNumber', isAdmin, onSaveValue) },
            { headerName: 'Год выпуска',           field: InfoField('description.yearRelease', isAdmin, onSaveValue, { type: 'year',   transform: Number }) },
            { headerName: 'Стоимость, ₽',          field: InfoField('cost',                    isAdmin, onSaveValue, { type: 'number', transform: Number }) },
            ...CommonFields(ActivesType.TRANSPORT, onSaveValue),
        ],

    },
    [ActivesType.PROPERTY]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'Наименование',        field: InfoField('description.name',            isAdmin, onSaveValue) },
            { headerName: 'Площадь',             field: InfoField('description.landArea',        isAdmin, onSaveValue) },
            { headerName: 'Кадастровый номер',   field: InfoField('description.cadastralNumber', isAdmin, onSaveValue) },
            { headerName: 'Адрес',               field: InfoField('description.address',         isAdmin, onSaveValue) },
            { headerName: 'Стоимость, ₽',        field: InfoField('cost',                        isAdmin, onSaveValue, { type: 'number', transform: Number }) },
            { headerName: 'Размер доли в праве', field: InfoField('description.shareSize',       isAdmin, onSaveValue, { type: 'number', transform: Number }) },
            ...CommonFields(ActivesType.PROPERTY, onSaveValue),
        ],
    },
    [ActivesType.DEBIT]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'ИНН дебитора',            field: InfoField('description.debitorInn',     isAdmin, onSaveValue, { type: 'inn' }) },
            { headerName: 'Наименование дебитора',   field: InfoField('description.name',           isAdmin, onSaveValue) },
            { headerName: 'Адрес дебитора',          field: InfoField('description.debitorAddress', isAdmin, onSaveValue) },
            { headerName: 'Дата ходатайства',        field: InfoField('description.debitorDate',    isAdmin, onSaveValue, { type: 'date', transform:  parseDate }) },
            { headerName: 'Сумма по ходатайству, ₽', field: InfoField('cost',                       isAdmin, onSaveValue, { type: 'number', transform: Number }) },
            ...CommonFields(ActivesType.DEBIT, onSaveValue),
        ],
        // addActive: <AddButton titleBtn="Добавить дебиторскую задолженность" Form={DebitForm}/>
    },
    [ActivesType.OTHER]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'Наименование', field: InfoField('description.name', isAdmin, onSaveValue) },
            { headerName: 'Стоимость, ₽', field: InfoField('cost',             isAdmin, onSaveValue, { type: 'number', transform: Number }) },
            ...CommonFields(ActivesType.OTHER, onSaveValue),
        ],
        // addActive: <AddButton titleBtn="Добавить иные активы" Form={OtherAssetForm}/>
    },
}