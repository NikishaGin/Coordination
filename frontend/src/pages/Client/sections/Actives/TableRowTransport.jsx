import React, { memo } from 'react';
import {TableRow, NumberCell, SelectCell, InputCell, DateCell, TableCell} from './components/table/TableStyles.js';
import {UniversalSelect} from "./components/inputs/UniversalSelect.jsx";
import {objStatusOptions, yesNoOptions, installedOptions, isFnsLizingOptions} from "./components/inputs/OptionsSelect.js"
import {CustomInput} from "./components/inputs/CustomInput.jsx";
import {MoneyInput} from "./components/inputs/MoneyInput.jsx";
import {DatePickerCell} from "./components/inputs/DatePickerCell.jsx";
import { EditableCell } from "./components/inputs/EditableCell.jsx";
import {formatNumber} from "../../../../utils/formatData.js";
import { useDispatch, useSelector } from "react-redux";
import { ROLES } from "../../../../types.js";
import { CustomCheckbox } from "./components/inputs/CustomCheckbox.jsx";
import { toggleSelectedRow } from "../../../../store/activesSlice.js";



export const TableRowTransport = memo(({ type, row, onValueChange }) => {
    const dispatch = useDispatch();
    const selectedRow = useSelector(state => state.actives.selectedRows[type])
    const role = useSelector((state) => state.user.role)

    const activeRow = selectedRow.includes(row.id);
    const isAdmin = role === ROLES.Admin

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
        const formattedDate = (date) ? date.toLocaleDateString('en-CA') : date;
        onValueChange(row.id, fieldName, formattedDate);
    };

    const setActiveRow = () => dispatch(toggleSelectedRow({ type, index: row.id }));

    return (
        <TableRow className={activeRow ? "active" : ""}>
            <TableCell>
                <CustomCheckbox>
                    <input
                        type="checkbox"
                        checked={activeRow}
                        onChange={setActiveRow}
                    />
                    <span></span>
                </CustomCheckbox>
            </TableCell>
            {/*Марка*/}
            <InputCell>
                <EditableCell
                    value={row.name || ''}
                    onSave={handleInputChange('name')}
                    isEditable={isAdmin}
                />
            </InputCell>
            {/*VIN-номер*/}
            <InputCell>
                <EditableCell
                    value={row.vin || ''}
                    onSave={handleInputChange('vin')}
                    isEditable={isAdmin}
                />
            </InputCell>
            {/*Гос. номер*/}
            <InputCell>
                <EditableCell
                    value={row.state_number || ''}
                    onSave={handleInputChange('state_number')}
                    isEditable={isAdmin}
                />
            </InputCell>
            {/*Год выпуска*/}
            <InputCell>
                <EditableCell
                    value={row.year || ''}
                    type="year"
                    onSave={handleInputChange('year')}
                    isEditable={isAdmin}
                />
            </InputCell>
            {/*Стоимость, ₽*/}
            <NumberCell>
                <EditableCell
                    value={formatNumber(row.cost) || ''}
                    type="number"
                    onSave={handleInputChange('cost')}
                    isEditable={isAdmin}
                />
            </NumberCell>
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
                    value={(row.obj_status_manual && (row.obj_status === "other")) ? row.obj_status_manual : ''}
                    valuePlaceholder={'Введите статус'}
                    onChange={handleInputChange('obj_status_manual')}
                    disabled={row.obj_status !== "other"}
                />
            </InputCell>
            {/*Дата начала регистрации*/}
            <DateCell>
                <DatePickerCell
                    value={row.registration_start_date}
                    onChange={handleDateChange('registration_start_date')}
                />
            </DateCell>
            {/*Дата окончания регистрации*/}
            <DateCell>
                <DatePickerCell
                    value={row.registration_end_date}
                    onChange={handleDateChange('registration_end_date')}
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
            {/*Дата обременения*/}
            <DateCell>
                <DatePickerCell
                    value={row.encumbrance_date}
                    onChange={handleDateChange('encumbrance_date')}
                />
            </DateCell>
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
            {/*Верифицирован объект*/}
            <SelectCell>
                <UniversalSelect
                    value={row.is_verified}
                    onChange={handleSelectChange('is_verified')}
                    options={yesNoOptions}
                />
            </SelectCell>
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
            {/*Передано на оценку*/}
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
            {/*Передано на реализацию*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_submit}
                    onChange={handleDateChange('realization_submit')}
                />
            </DateCell>
            {/*Сумма переданного имущества на реализацию, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.realization_property_sum ?? "")}
                    onChange={handleInputChange('realization_property_sum')}
                />
            </InputCell>
            {/*Дата первых торгов*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_date_1}
                    onChange={handleDateChange('realization_date_1')}
                />
            </DateCell>
            {/*Отчет о реализации (1 этап)*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_result_1}
                    onChange={handleDateChange('realization_result_1')}
                />
            </DateCell>
            {/*Сумма реализованного имущества (1 этап), ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.realization_sum_1 ?? "")}
                    onChange={handleInputChange('realization_sum_1')}
                />
            </InputCell>
            {/*Уведомление о нереализации (1 этап)*/}
            <DateCell>
                <DatePickerCell
                    value={row.not_realization_notification}
                    onChange={handleDateChange('not_realization_notification')}
                />
            </DateCell>
            {/*Причина признания 1 торгов не состоявшимися*/}
            <InputCell>
                <CustomInput
                    value={row.realisation1_failure_reason || ''}
                    valuePlaceholder={'Введите причину'}
                    onChange={handleInputChange('realisation1_failure_reason')}
                />
            </InputCell>
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
            {/*Дата вторых торгов*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_date_2}
                    onChange={handleDateChange('realization_date_2')}
                />
            </DateCell>
            {/*Отчет о реализации*/}
            <DateCell>
                <DatePickerCell
                    value={row.realization_result_2}
                    onChange={handleDateChange('realization_result_2')}
                />
            </DateCell>
            {/*Сумма реализованного имущества (2 этап), ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.realization_sum_2 ?? "")}
                    onChange={handleInputChange('realization_sum_2')}
                />
            </InputCell>
            {/*Уведомление о нереализации (2 этап)*/}
            <DateCell>
                <DatePickerCell
                    value={row.not_realization_notification_2}
                    onChange={handleDateChange('not_realization_notification_2')}
                />
            </DateCell>
            {/*Причина признания 2 торгов не состоявшимися*/}
            <InputCell>
                <CustomInput
                    value={row.realisation2_failure_reason || ''}
                    valuePlaceholder={'Введите причину'}
                    onChange={handleInputChange('realisation2_failure_reason')}
                />
            </InputCell>
            {/*Акт передачи имущества должнику*/}
            <DateCell>
                <DatePickerCell
                    value={row.property_to_debtor_act}
                    onChange={handleDateChange('property_to_debtor_act')}
                />
            </DateCell>
            {/*Сумма возврата имущества должнику, ₽*/}
            <InputCell>
                <MoneyInput
                    value={String(row.property_to_debtor_sum ?? "")}
                    onChange={handleInputChange('property_to_debtor_sum')}
                />
            </InputCell>
            {/*"Дата снятия ареста"*/}
            <DateCell>
                <DatePickerCell
                    value={row.arrest_end_date}
                    onChange={handleDateChange('arrest_end_date')}
                />
            </DateCell>
            {/*"Основания снятия ареста с имущества"*/}
            <InputCell>
                <CustomInput
                    value={row.arrest_end_cause || ''}
                    valuePlaceholder={'Укажите основание'}
                    onChange={handleInputChange('arrest_end_cause')}
                />
            </InputCell>
            {/*"Лицо, подавшее жалобу"*/}
            <InputCell>
                <CustomInput
                    value={row.person_filed_complaint || ''}
                    valuePlaceholder={'Введите лицо'}
                    onChange={handleInputChange('person_filed_complaint')}
                />
            </InputCell>
            {/*"Предмет жалобы"*/}
            <InputCell>
                <CustomInput
                    value={row.complaint_subject || ''}
                    valuePlaceholder={'Введите предмет жалобы'}
                    onChange={handleInputChange('complaint_subject')}
                />
            </InputCell>
            {/*"Орган, рассматривающий жалобу"*/}
            <InputCell>
                <CustomInput
                    value={row.complaint_source || ''}
                    valuePlaceholder={'Введите орган'}
                    onChange={handleInputChange('complaint_source')}
                />
            </InputCell>
            {/*"Дата жалобы"*/}
            <DateCell>
                <DatePickerCell
                    value={row.complaint_date}
                    onChange={handleDateChange('complaint_date')}
                />
            </DateCell>
            {/*"Результат рассмотрения жалобы"*/}
            <InputCell>
                <CustomInput
                    value={row.complaint_result || ''}
                    valuePlaceholder={'Введите результат'}
                    onChange={handleInputChange('complaint_result')}
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
        </TableRow>
    );
});

TableRowTransport.displayName = 'TableRowTransport';