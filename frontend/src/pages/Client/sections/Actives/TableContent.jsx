import React, { useRef } from "react";
import { EditableCell } from "./components/inputs/EditableCell.jsx";
import { InputCell, NumberCell } from "./components/table/TableStyles.js";
// import DebitForm from "./components/modalForm/DebitForm.jsx";
// import OtherAssetForm from "./components/modalForm/OtherAssetForm.jsx";
import { ActivesType } from "../../../../constants.js";
import { extractValuesFromObject } from "../../../../utils/extractValuesFromObject.js";
import { parseDate, parseNumber } from "../../../../utils/formatData.js";
import { CustomInput } from "./components/inputs/CustomInput.jsx";
import { MoneyInput } from "./components/inputs/MoneyInput.jsx";



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


const TextField = (
    key,
    onSaveValue,
    placeholder,
    { disabled=false, transform = (value) => value }={},
) => (row) => (
    <InputCell>
        <CustomInput
            value={!disabled ? extractValuesFromObject(row, key) : ''}
            valuePlaceholder={placeholder}
            onChange={onSaveValue(key, transform)}
            disabled={disabled}
        />
    </InputCell>
);

const NumberField = (
    key,
    onSaveValue,
) => (row) => (
    <InputCell>
        <MoneyInput
            value={extractValuesFromObject(row, key) || ''}
            onChange={onSaveValue(key, parseNumber)}
        />
    </InputCell>
);

// const SelectField = () => (row) => ();
//
// const DateField = () => (row) => ();





const RegistrationFields = onSaveValue => [];

const EncumbranceFields = onSaveValue => [];

const DebitForeclosureFields = onSaveValue => [];

const CommonFields = (type, onSaveValue) => [

    ...([ActivesType.TRANSPORT, ActivesType.PROPERTY].includes(type) ? RegistrationFields(onSaveValue) : []),
    ...(type !== ActivesType.DEBIT ? EncumbranceFields(onSaveValue) : []),

    ...(type === ActivesType.DEBIT ? DebitForeclosureFields(onSaveValue) : []),
]


export const TableContent = {
    [ActivesType.TRANSPORT]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'Марка',                 field: InfoField('description.name',        isAdmin, onSaveValue) },
            { headerName: 'VIN-номер',             field: InfoField('description.vin',         isAdmin, onSaveValue) },
            { headerName: 'Государственный номер', field: InfoField('description.stateNumber', isAdmin, onSaveValue) },
            { headerName: 'Год выпуска',           field: InfoField('description.yearRelease', isAdmin, onSaveValue, { type: 'year',   transform: parseInt }) },
            { headerName: 'Стоимость, ₽',          field: InfoField('cost',                    isAdmin, onSaveValue, { type: 'number', transform: parseNumber }) },
            ...CommonFields(ActivesType.TRANSPORT, onSaveValue),
        ],

    },
    [ActivesType.PROPERTY]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'Наименование',        field: InfoField('description.name',            isAdmin, onSaveValue) },
            { headerName: 'Площадь',             field: InfoField('description.landArea',        isAdmin, onSaveValue, { type: 'number', transform: parseNumber }) },
            { headerName: 'Кадастровый номер',   field: InfoField('description.cadastralNumber', isAdmin, onSaveValue) },
            { headerName: 'Адрес',               field: InfoField('description.address',         isAdmin, onSaveValue) },
            { headerName: 'Стоимость, ₽',        field: InfoField('cost',                        isAdmin, onSaveValue, { type: 'number', transform: parseNumber }) },
            { headerName: 'Размер доли в праве', field: InfoField('description.shareSize',       isAdmin, onSaveValue, { type: 'number', transform: parseNumber }) },
            ...CommonFields(ActivesType.PROPERTY, onSaveValue),
        ],
    },
    [ActivesType.DEBIT]: {
        tableFields: (isAdmin, onSaveValue) => [
            { headerName: 'ИНН дебитора',            field: InfoField('description.debitorInn',     isAdmin, onSaveValue, { type: 'inn' }) },
            { headerName: 'Наименование дебитора',   field: InfoField('description.name',           isAdmin, onSaveValue) },
            { headerName: 'Адрес дебитора',          field: InfoField('description.debitorAddress', isAdmin, onSaveValue) },
            { headerName: 'Дата ходатайства',        field: InfoField('description.debitorDate',    isAdmin, onSaveValue, { type: 'date', transform:  parseDate }) },
            { headerName: 'Сумма по ходатайству, ₽', field: InfoField('cost',                       isAdmin, onSaveValue, { type: 'number', transform: parseNumber }) },
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