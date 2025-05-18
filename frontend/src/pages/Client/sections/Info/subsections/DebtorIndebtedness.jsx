import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import {enqueueSnackbar} from 'notistack'
import {TableContainer, Tr} from "../../../../../components/tables/Table.jsx";
import {ButtonContainer, Button} from "../../../../../components/buttons/Button.jsx";
import {useParams} from "react-router";
import {activesAPI} from "../../../../../api/index.js";
import {useDispatch, useSelector} from "react-redux";
import {fetchDebit, updateDebitRow} from "../../../../../store/debitSlice.js";
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

export default function () {

    const dispatch = useDispatch();
    const debit = useSelector((state) => state.debit.data);

    console.log('DEBIT', debit)

    const [changedDebit, setChangedDebit] = useState({})
    const [newDebit, setNewDebit] = useState([])
    const [invalidInn, setInvalidInn] = useState([])

    const tableRef = useRef(null);
    const {inn} = useParams()

    const existingInn = debit.map(item => item.debitor_inn)
    const tableData = [...debit, ...newDebit].sort((a, b) => a.id - b.id)   //  sort !!!

    useEffect(() => {
        if (inn) {
            dispatch(fetchDebit(inn));
        }
    }, [dispatch, inn]);

    const handleInputChange = (id, field, event) => {
        const newValue = event.target.value; // Новое значение из поля ввода
        dispatch(updateDebitRow({id, field, value: newValue})); // Обновляем данные в Redux
    };

    const saveChange = async () => {

        const getChangedFields = (newObj, oldObj) => {
            return Object.fromEntries(
                Object.entries(newObj).filter(([key, value]) => key in oldObj && value !== oldObj[key])
            );
        };

        const getOldDataById = id => debit.find(row => row.id === parseInt(id));

        const updatedData = Object.fromEntries(
            Object.entries(changedDebit)
                .filter(([, value]) => value.type === "update")
                .map(([id, value]) => [id, getChangedFields(value.data, getOldDataById(id))])
                .filter(([, changes]) => Object.keys(changes).length > 0)
        );

        const insertedEntries = Object.entries(changedDebit).filter(([, value]) => value.type === "insert");
        const duplicateInn = [];
        const emptyInn = [];

        insertedEntries.forEach(([id, {data}]) => {
            if (!data.debitor_inn) emptyInn.push(parseInt(id));
            if (existingInn.includes(data.debitor_inn)) duplicateInn.push(data.debitor_inn);
        });

        if (emptyInn.length > 0) {
            setInvalidInn(prev => [...new Set([...prev, ...emptyInn])]);
            enqueueSnackbar("Заполните обязательное поле - \"ИНН дебитора\"", {variant: "info"});
            return;
        }

        if (duplicateInn.length > 0) {
            setInsertedExistingInn(prev => [...new Set([...prev, ...duplicateInn])]);
            enqueueSnackbar("Дебитор с таким ИНН уже существует", {variant: "info"});
            return;
        }

        let updateSuccess = false;
        let insertSuccess = false;

        // 🟡 Обновление существующих записей
        if (Object.keys(updatedData).length > 0) {
            try {
                await activesAPI.updateActives("debit", inn, updatedData);
                setDebit(prev => prev.map(item =>
                    changedDebit[item.id]?.type === "update"
                        ? {...item, ...changedDebit[item.id].data}
                        : item
                ));
                updateSuccess = true;
            } catch (error) {
                console.error("Ошибка при обновлении:", error);
            }
        } else {
            updateSuccess = true;
        }

        // 🟢 Вставка новых записей
        if (insertedEntries.length > 0) {
            try {
                const newData = insertedEntries.map(([, value]) => ({...value.data, inn}));
                const {data: ids} = await activesAPI.createNewActives("debit", inn, newData);
                const newRecords = newData.map((item, index) => ({...item, id: ids[index]}));

                setDebit(prev => [...prev, ...newRecords]);
                setNewDebit([]);
                insertSuccess = true;
            } catch (error) {
                console.error("Ошибка при вставке:", error);
            }
        } else {
            insertSuccess = true;
        }

        // ✅ Очистка
        setChangedDebit({});

        // ✅ Уведомления
        if (updateSuccess && insertSuccess) {
            enqueueSnackbar("Сохранено", {variant: "success"});
        } else if (updateSuccess) {
            enqueueSnackbar("Изменения сохранены, но не удалось сохранить новые данные", {variant: "success"});
        } else if (insertSuccess) {
            enqueueSnackbar("Новые данные сохранены, но не удалось сохранить изменения", {variant: "success"});
        } else {
            enqueueSnackbar("Ошибка в сохранении", {variant: "error"});
        }

    }

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
                    {
                        tableData.map(row => {
                            const data = {
                                ...row,
                                ...changedDebit[row.id]?.data,
                                type: row.type ?? changedDebit[row.id]?.type
                            }
                            return (
                                <Tr>
                                    <td>
                                        <EditableCell
                                            value={data.debitor_inn}
                                            onSave={(newVal) => handleInputChange(data.id, 'debitor_inn', { target: { value: newVal } })}
                                            isEditable={data.type === 'insert'}
                                            error={invalidInn.includes(data.id)}
                                            type="text"
                                        />
                                    </td>

                                    <td>
                                        <EditableCell
                                            value={data.debitor_names}
                                            onSave={(newVal) => handleInputChange(data.id, 'debitor_names', {target: {value: newVal}})}
                                        />
                                    </td>
                                    <td>
                                        <EditableCell
                                            value={data.date}
                                            onSave={(newVal) => handleInputChange(data.id, 'date', { target: { value: newVal } })}
                                            type="date"
                                            isEditable={true}
                                        />
                                    </td>
                                    <td>
                                        <EditableCell
                                            value={data.total_sum}
                                            onSave={(newVal) => handleInputChange(data.id, 'total_sum', {target: {value: Number(newVal)}})}
                                        />
                                    </td>
                                </Tr>
                            )
                        })}
                    </tbody>
                </table>
            </Container>
            <ButtonBox>
                <ButtonContainer>
                    <AddDebitButton/>
                </ButtonContainer>
                <ButtonContainer>
                    <Button onClick={saveChange}>Сохранить</Button>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}