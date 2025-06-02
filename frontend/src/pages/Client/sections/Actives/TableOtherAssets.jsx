import React, { memo } from 'react';
import {TableRow as StyledTableRow, TableCell, NumberCell, SelectCell, InputCell, DateCell} from '../../TableStyles.js';
import {UniversalSelect} from "./UniversalSelect.jsx";
import {CustomInput} from "./CustomInput.jsx";
import {MoneyInput} from "./MoneyInput.jsx";
import {DatePickerCell} from "./DatePickerCell.jsx";
import {formatNumber} from "../../../../utils/formatData.js";

const objStatusOptions = [
    {text: "Арест", value: "arrest"},
    {text: "Оценка", value: "grade"},
    {text: "Реализация", value: "sale"},
    {text: "Розыск", value: "wanted"},
    {text: "Обжалование в суде испол. действия", value: "appeal"},
    {text: "Лизинг (залог иного лица)", value: "lizing"},
    {text: "Иное", value: "other"},
];

const yesNoOptions = [
    {value: 1, text: "Да"},
    {value: 0, text: "Нет"},
];

const installedOptions = [
    {value: 1, text: "Установлено"},
    {value: 0, text: "Не установлено"},
];

const isFnsLizingOptions = [
    {value: 1, text: "Является"},
    {value: 2, text: "Не является"},
    {value: 0, text: "Не является, нет залога"},
];

export const TableOtherAssets = memo(({ row, onValueChange }) => {

    const handleSelectChange = (fieldName) => (val) => {
        onValueChange(row.id, fieldName, Number(val));
    };

    const handleStringSelectChange = (fieldName) => (val) => {
        onValueChange(row.id, fieldName, val);
    };

    const handleInputChange = (fieldName) => (val) => {
        onValueChange(row.id, fieldName, val); // val — уже число или null
    };

    const handleDateChange = (fieldName) => (date) => {
        const formattedDate = date.toLocaleDateString('en-CA');
        onValueChange(row.id, fieldName, formattedDate);
    };



    return (
        <StyledTableRow>
            {/*Наименование*/}
            <TableCell>{row.name}</TableCell>
            {/*Стоимость, ₽*/}
            <NumberCell>{formatNumber(row.cost)}</NumberCell>
            {/*Верифицирован объект*/}
            <SelectCell>
                <UniversalSelect
                    value={row.is_verified}
                    onChange={handleSelectChange('is_verified')}
                    options={yesNoOptions}
                />
            </SelectCell>
            {/*Статус объекта*/}
            <SelectCell>
                <UniversalSelect
                    value={row.obj_status}
                    onChange={handleStringSelectChange('obj_status')}
                    options={objStatusOptions}
                />
            </SelectCell>
            {/*Иной статус*/}
            <InputCell>
                <CustomInput
                    value={row.obj_status_manual || ''}
                    valuePlaceholder={'Введите статус'}
                    onChange={handleInputChange('obj_status_manual')}
                />
            </InputCell>
            {/*Арест имущества*/}
            <DateCell>
                <DatePickerCell
                    value={row.arrest_propperty}
                    onChange={handleDateChange('arrest_propperty')}
                />
            </DateCell>
            {/*Сумма ареста, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.arrest_sum ?? "")}
                    onChange={handleInputChange('arrest_sum')}
                />
            </InputCell>
            {/*Заведение розыскного дела*/}
            <DateCell>
                <DatePickerCell
                    value={row.wanted_open}
                    onChange={handleDateChange('wanted_open')}
                />
            </DateCell>
            {/*Прекращение розыскного дела*/}
            <DateCell>
                <DatePickerCell
                    value={row.wanted_close}
                    onChange={handleDateChange('wanted_close')}
                />
            </DateCell>
            {/*Результат розыска*/}
            <SelectCell>
                <UniversalSelect
                    value={row.wanted_result}
                    onChange={handleSelectChange('wanted_result')}
                    options={installedOptions}
                />
            </SelectCell>
            {/*Передана на оценку*/}
            <DateCell>
                <DatePickerCell
                    value={row.evaluation_submit}
                    onChange={handleDateChange('evaluation_submit')}
                />
            </DateCell>
            {/*Принятие результатов оценки*/}
            <DateCell>
                <DatePickerCell
                    value={row.evaluation_accept}
                    onChange={handleDateChange('evaluation_accept')}
                />
            </DateCell>
            {/*"Сумма оценки, ₽"*/}
            <InputCell>
                <MoneyInput
                    value={String(row.evaluation_sum ?? "")}
                    onChange={handleInputChange('evaluation_sum')}
                />
            </InputCell>
            {/*Передана на реализацию*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_submit}
                    onChange={handleDateChange('realization_submit')}
                />
            </DateCell>
            {/*Сумма переданного имущества, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.realization_sum_1 ?? "")}
                    onChange={handleInputChange('realization_sum_1')}
                />
            </InputCell>
            {/*Дата первых торгов*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_date_1}
                    onChange={handleDateChange('realization_date_1')}
                />
            </DateCell>
            {/*Отчет о реализации*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_result_1}
                    onChange={handleDateChange('realization_result_1')}
                />
            </DateCell>
            {/*Сумма реализованного имущества, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.realization_property_sum ?? "")}
                    onChange={handleInputChange('realization_property_sum')}
                />
            </InputCell>
            {/*Уведомление о нереализации (1 этап)*/}
            <DateCell>
                <DatePickerCell
                    value={row.not_realization_notification}
                    onChange={handleDateChange('not_realization_notification')}
                />
            </DateCell>
            {/*Постановление о снижении цены*/}
            <DateCell>
                <DatePickerCell
                    value={row.price_reduction_resolution}
                    onChange={handleDateChange('price_reduction_resolution')}
                />
            </DateCell>
            {/*Сумма снижения цены, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.price_reduction_sum ?? "")}
                    onChange={handleInputChange('price_reduction_sum')}
                />
            </InputCell>
            {/*Является ли ФНС залогодержателем*/}
            <SelectCell>
                <UniversalSelect
                    value={row.is_fns_lizing}
                    onChange={handleSelectChange('is_fns_lizing')}
                    options={isFnsLizingOptions}
                />
            </SelectCell>
            {/*Наименование залогодержателя (лизингодателя)*/}
            <InputCell>
                <CustomInput
                    value={row.lizing_name || ''}
                    valuePlaceholder={'Введите наименование'}
                    onChange={handleInputChange('lizing_name')}
                />
            </InputCell>
            {/*Дата обременения*/}
            <DateCell>
                <DatePickerCell
                    value={row.encumbrance_date}
                    onChange={handleDateChange('encumbrance_date')}
                />
            </DateCell>
            {/*Вид обременения*/}
            <InputCell>
                <CustomInput
                    value={row.encumbrance_type || ''}
                    valuePlaceholder={'Введите обременение'}
                    onChange={handleInputChange('encumbrance_type')}
                />
            </InputCell>
            {/*Комментарий*/}
            <InputCell>
                <CustomInput
                    value={row.comment || ''}
                    valuePlaceholder={'Введите комментарий'}
                    onChange={handleInputChange('comment')}
                />
            </InputCell>
        </StyledTableRow>
    );
});

TableOtherAssets.displayName = 'TableOtherAssets';