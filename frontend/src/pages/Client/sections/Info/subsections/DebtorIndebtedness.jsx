import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import { ButtonContainer, Button } from "../../../../../components/buttons/Button.jsx";
import Input from "../../../../../components/inputs/Input.jsx"
import { formatNumber, transformDateForInput } from "../../../../../utils/formatData.js"
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";



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
    const [debit, setDebit] = useState([])
    const [changedDebit, setChangedDebit] = useState({})
    const [newDebit, setNewDebit] = useState([])
    const [viewInput, setViewInput] = useState(-1)
    const [invalidInn, setInvalidInn] = useState([])
    const [insertedExistingInn, setInsertedExistingInn] = useState([])
    const tableRef = useRef(null);
    const { inn } = useParams()

    const existingInn = debit.map(item => item.debitor_inn)
    const tableData = [...debit, ...newDebit].sort((a, b) => a.id - b.id)   //  sort !!!

    useEffect(() => {
        activesAPI
            .getDebt(inn)
            .then(data => setDebit(data.data.map(item => ({
                ...item,
                date: transformDateForInput(item.date),
                total_sum: formatNumber(item.total_sum)
            }))))
            .catch(console.log)
    }, [])


    const onChangeHandler = (id, field, value, type) => {
        if (field === "debitor_inn") {
            setInvalidInn(prevValue => ((0 < value.length) && (value.length < 10)) ? [...new Set([...prevValue, id])] : prevValue.filter(idValue => idValue !== id))
            setInsertedExistingInn(prevValue => prevValue.filter(inn => inn !== changedDebit[id]?.data?.debitor_inn))
        }
        setChangedDebit(prevValue => {
            const data = { ...prevValue[id]?.data, [field]: value }
            const isEmptyData = Object.values(data).every(s => s.length === 0)
            return {
                ...prevValue,
                [id]: ((type !== "insert") || (!isEmptyData && type === "insert")) ? {
                    ...prevValue[id],
                    type: (prevValue[id]?.type || type) || "update",
                    data: data
                } : undefined
            }
        })
    }

    const appendDebit = () => {
        const id = Date.now()
        setNewDebit(prevValue => [...prevValue, { id, type: "insert" }])
        const timer = setTimeout(() => {
            tableRef.current.scrollTo({
                top: tableRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }, 0)
        return () => clearTimeout(timer)
    }

    const resetChange = () => {
        setChangedDebit({})
        setNewDebit([])
        const timer = setTimeout(() => {
            tableRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }, 0)
        return () => clearTimeout(timer)
    }

    const saveChange = async () => {
        if (Object.keys(changedDebit).length === 0 && newDebit.length === 0) return;

        if (invalidInn.length > 0) {
            enqueueSnackbar("Неверный формат ИНН. Минимум 10 символов", { variant: "info" });
            return;
        }

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

        insertedEntries.forEach(([id, { data }]) => {
            if (!data.debitor_inn) emptyInn.push(parseInt(id));
            if (existingInn.includes(data.debitor_inn)) duplicateInn.push(data.debitor_inn);
        });

        if (emptyInn.length > 0) {
            setInvalidInn(prev => [...new Set([...prev, ...emptyInn])]);
            enqueueSnackbar("Заполните обязательное поле - \"ИНН дебитора\"", { variant: "info" });
            return;
        }

        if (duplicateInn.length > 0) {
            setInsertedExistingInn(prev => [...new Set([...prev, ...duplicateInn])]);
            enqueueSnackbar("Дебитор с таким ИНН уже существует", { variant: "info" });
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
                        ? { ...item, ...changedDebit[item.id].data }
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
                const newData = insertedEntries.map(([, value]) => ({ ...value.data, inn }));
                const { data: ids } = await activesAPI.createNewActives("debit", inn, newData);
                const newRecords = newData.map((item, index) => ({ ...item, id: ids[index] }));

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
            enqueueSnackbar("Сохранено", { variant: "success" });
        } else if (updateSuccess) {
            enqueueSnackbar("Изменения сохранены, но не удалось сохранить новые данные", { variant: "success" });
        } else if (insertSuccess) {
            enqueueSnackbar("Новые данные сохранены, но не удалось сохранить изменения", { variant: "success" });
        } else {
            enqueueSnackbar("Ошибка при сохранении", { variant: "error" });
        }

    }



    return (
        <>
            <Container hHeader="350px" ref={tableRef}>
                <table>
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
                                    <Tr
                                        key={data.id}
                                        onMouseEnter={() => setViewInput(data.id)}
                                        onMouseLeave={() => setViewInput(-1)}
                                        isSelected={insertedExistingInn.includes(data.debitor_inn)}
                                    >
                                        <td>
                                            {(data.type !== "insert") ? data.debitor_inn : (
                                                <Input
                                                    type="inn"
                                                    value={data.debitor_inn}
                                                    onChange={event => onChangeHandler(data.id, "debitor_inn", event.target.value, data.type)}
                                                    view={viewInput === data.id}
                                                    error={invalidInn.includes(data.id)}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <Input
                                                type="text"
                                                value={data.debitor_names}
                                                onChange={event => onChangeHandler(data.id, "debitor_names", event.target.value, data.type)}
                                                view={viewInput === data.id}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                type="date"
                                                value={data.date}
                                                onChange={event => onChangeHandler(data.id, "date", event.target.value, data.type)}
                                                view={viewInput === data.id}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={data.total_sum}
                                                onChange={event => onChangeHandler(data.id, "total_sum", event.target.value, data.type)}
                                                view={viewInput === data.id}
                                            />
                                        </td>
                                    </Tr>
                                )
                            })}
                    </tbody>
                </table>
            </Container>
            <SnackbarProvider
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                maxSnack={1}
                autoHideDuration={5000}
            />
            <ButtonBox>
                <ButtonContainer>
                    <Button onClick={appendDebit}>Добавить дебиторскую задолженность</Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button onClick={resetChange}>Сбросить изменения</Button>
                    <Button onClick={saveChange}>Сохранить</Button>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}