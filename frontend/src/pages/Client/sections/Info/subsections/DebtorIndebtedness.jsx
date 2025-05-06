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
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }

    & th:nth-child(1), & td:nth-child(1) {
        width: 110px;
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

// ИНН - с 10 до 12 символов




export default function () {
    const [debit, setDebit] = useState([])
    const [changedDebit, setChangedDebit] = useState({})
    const [newDebit, setNewDebit] = useState([])
    const [viewInput, setViewInput] = useState(-1)
    const [invalidInn, setInvalidInn] = useState([])
    const [errors, setErrors] = useState([])
    const tableRef = useRef(null);
    const { inn } = useParams()

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
        if (field == "debitor_inn")
            setInvalidInn(prevValue => ((value.length > 0) && (value.length < 10)) ? [...new Set([...prevValue, id])] : prevValue.filter(idValue => idValue != id))
        setChangedDebit(prevValue => {
            const data = { ...prevValue[id]?.data, [field]: value }
            const isEmptyData = Object.values(data).every(s => s.length == 0)
            return {
                ...prevValue,
                [id]: ((type != "insert") || (!isEmptyData && type == "insert")) ? {
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




    const saveChange = () => {
        /*
        0*) Проверяем валлидность ИНН (не менее 10 символов) 
            и при ошибки подсвечиваем поле ввода

        1)  Извлекаем обновлённые данные

        2)  Извлекаем новые вставленные данные

        3)  Для обновлённых данных отфильтровываем 
            только те измененные поля, которые реально 
            изменились, сравнивая с исходными данными



        4)  Для вставленных данных проверяем, чтобы обязательно 
            был ИНН и было заполненно ещё какое-то поле

        5) Обновлённые данные нельзя стереть
        */

                
        if (invalidInn.length == 0) {
            const entries = Object.entries(changedDebit)
            const getChangedFields = (newObj, oldObj) => {
                const changedEntries = Object.entries(newObj).filter(([key, value]) => key in oldObj && value !== oldObj[key])
                return Object.fromEntries(changedEntries);
            }
            const getRelatedOldObj = key => debit.find(row => row.id == key)
    
            const updatedEntries = Object.entries(changedDebit).filter(([ _, changeInfo ])=> changeInfo.type === "update")
            const changesArr = updatedEntries
                .map( ([ id, changeInfo ]) => [ id, getChangedFields(changeInfo.data, getRelatedOldObj(id)) ])
                .filter(([_, value]) =>  Object.keys(value).length > 0)
            const updatedData = Object.fromEntries(changesArr)
    

            console.log(updatedData)

    
            const insertedEntries = Object.entries(changedDebit).filter(([ _, changeInfo ])=> changeInfo.type === "insert")
            









            //console.log(updatedData)
            //activesAPI.updateActives("debit", inn, updatedData).catch(console.log)
        } else
            enqueueSnackbar("Неверный формат ИНН. Минимум 10 символов", {variant: "info"})












        


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
                                    >
                                        <td>
                                            <Input
                                                type="inn"
                                                value={data.debitor_inn}
                                                onChange={event => onChangeHandler(data.id, "debitor_inn", event.target.value, data.type)}
                                                view={viewInput === data.id}
                                                error={invalidInn.includes(data.id)}
                                            />
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
                maxSnack={(invalidInn.length > 0) ? 1 : 3}
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