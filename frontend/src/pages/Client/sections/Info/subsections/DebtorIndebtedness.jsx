import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {TableContainer, Tr} from "../../../../../components/tables/Table.jsx";
import {ButtonContainer} from "../../../../../components/buttons/Button.jsx";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {fetchDebit, saveDebitRow} from "../../../../../store/debitSlice.js";
import {EditableCell} from "./EditableCell.jsx";
import {AddDebitButton} from "./AddDebitButton.jsx";

const Container = styled(TableContainer)`
  height: calc(100vh - 250px - 60px);

  & table {
    display: table;
  }

  & th {
    white-space: normal;
  }

  & th:nth-child(1), & td:nth-child(1) {
    width: 135px;
  }

  & th:nth-child(3), & td:nth-child(3) {
    width: 120px;
  }

  & th:nth-child(4), & td:nth-child(4) {
    width: 140px;
  }
`
const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
`

export function cleanTotalSum(value) {
    if (!value) return 0; // Если значение пустое, возвращаем 0
    const cleanedValue = value.replace(/\s+/g, '').replace(',', '.'); // Убираем пробелы и заменяем запятую
    const numericValue = Number(cleanedValue); // Преобразуем в число
    return isNaN(numericValue) ? 0 : numericValue; // Возвращаем 0, если результат не является числом
}

export default function () {

    const dispatch = useDispatch();
    const debit = useSelector((state) => state.debit.data);

    const tableRef = useRef(null);
    const {inn} = useParams()

    useEffect(() => {
        if (inn) {
            dispatch(fetchDebit(inn));
        }
    }, [dispatch, inn]);


    const handleInputChange = (id, field, newValue) => {
        const current = debit.find(item => item.id === id) || {};
        let updatedRow = { ...current, [field]: newValue };
        dispatch(saveDebitRow({ inn, updatedRow }));
    };


    return (
        <>
            <Container hHeader="350px" ref={tableRef} className="table-container">
                <table >
                    <thead>
                    <tr>
                        <th>ИНН дебитора</th>
                        <th>Наименование дебитора</th>
                        <th>Дата ходатайства о взыскании ДЗ</th>
                        <th>Сумма дебиторской задолженности, ₽</th>
                    </tr>
                    </thead>
                    <tbody>
                    {debit.map((row) => (
                        <Tr key={row.id}>
                            <td>
                                <EditableCell
                                    value={row.debitor_inn}
                                    onSave={(newVal) => handleInputChange(row.id, 'debitor_inn', newVal)}
                                    isEditable={row.type === 'insert'}
                                    type="text"
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={row.debitor_names}
                                    onSave={(newVal) => handleInputChange(row.id, 'debitor_names', newVal)}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={row.date}
                                    onSave={(newVal) => handleInputChange(row.id, 'date', newVal)} // Сохраняем дату в ISO-формате
                                    type="date"
                                    isEditable={true}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={row.total_sum}
                                    onSave={(newVal) => handleInputChange(row.id, 'total_sum', Number(newVal))}
                                />
                            </td>
                        </Tr>
                    ))}
                    </tbody>
                </table>
            </Container>
            <ButtonBox>
                <ButtonContainer>
                    <AddDebitButton/>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}





// const saveChange = async () => {
//
//     const getChangedFields = (newObj, oldObj) => {
//         return Object.fromEntries(
//             Object.entries(newObj).filter(([key, value]) => key in oldObj && value !== oldObj[key])
//         );
//     };
//
//     const getOldDataById = id => debit.find(row => row.id === parseInt(id));
//
//     const updatedData = Object.fromEntries(
//         Object.entries(changedDebit)
//             .filter(([, value]) => value.type === "update")
//             .map(([id, value]) => [id, getChangedFields(value.data, getOldDataById(id))])
//             .filter(([, changes]) => Object.keys(changes).length > 0)
//     );
//
//     const insertedEntries = Object.entries(changedDebit).filter(([, value]) => value.type === "insert");
//     const duplicateInn = [];
//     const emptyInn = [];
//
//     insertedEntries.forEach(([id, {data}]) => {
//         if (!data.debitor_inn) emptyInn.push(parseInt(id));
//         if (existingInn.includes(data.debitor_inn)) duplicateInn.push(data.debitor_inn);
//     });
//
//     if (emptyInn.length > 0) {
//         setInvalidInn(prev => [...new Set([...prev, ...emptyInn])]);
//         enqueueSnackbar("Заполните обязательное поле - \"ИНН дебитора\"", {variant: "info"});
//         return;
//     }
//
//     if (duplicateInn.length > 0) {
//         setInsertedExistingInn(prev => [...new Set([...prev, ...duplicateInn])]);
//         enqueueSnackbar("Дебитор с таким ИНН уже существует", {variant: "info"});
//         return;
//     }
//
//     let updateSuccess = false;
//     let insertSuccess = false;
//
//     // 🟡 Обновление существующих записей
//     if (Object.keys(updatedData).length > 0) {
//         try {
//             await activesAPI.updateActives("debit", inn, updatedData);
//             setDebit(prev => prev.map(item =>
//                 changedDebit[item.id]?.type === "update"
//                     ? {...item, ...changedDebit[item.id].data}
//                     : item
//             ));
//             updateSuccess = true;
//         } catch (error) {
//             console.error("Ошибка при обновлении:", error);
//         }
//     } else {
//         updateSuccess = true;
//     }
//
//     // 🟢 Вставка новых записей
//     if (insertedEntries.length > 0) {
//         try {
//             const newData = insertedEntries.map(([, value]) => ({...value.data, inn}));
//             const {data: ids} = await activesAPI.createNewActives("debit", inn, newData);
//             const newRecords = newData.map((item, index) => ({...item, id: ids[index]}));
//
//             setDebit(prev => [...prev, ...newRecords]);
//             setNewDebit([]);
//             insertSuccess = true;
//         } catch (error) {
//             console.error("Ошибка при вставке:", error);
//         }
//     } else {
//         insertSuccess = true;
//     }
//
//     // ✅ Очистка
//     setChangedDebit({});
//
//     // ✅ Уведомления
//     if (updateSuccess && insertSuccess) {
//         enqueueSnackbar("Сохранено", {variant: "success"});
//     } else if (updateSuccess) {
//         enqueueSnackbar("Изменения сохранены, но не удалось сохранить новые данные", {variant: "success"});
//     } else if (insertSuccess) {
//         enqueueSnackbar("Новые данные сохранены, но не удалось сохранить изменения", {variant: "success"});
//     } else {
//         enqueueSnackbar("Ошибка в сохранении", {variant: "error"});
//     }
//
// }