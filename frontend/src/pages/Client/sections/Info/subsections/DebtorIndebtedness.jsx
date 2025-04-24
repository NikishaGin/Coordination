import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import { ButtonContainer, Button } from "../../../../../components/buttons/Button.jsx";
import handlePriceInput from "../../../../../utils/handlePriceInput.js"
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";



const Container = styled(TableContainer)`
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }

    & th:nth-child(2), & td:nth-child(2) {
        width: 900px;
    }
`

const Input = styled.input`
    width: 100%;
    padding: 3px;
    border: ${({ view }) => (view) ? "1px solid hsl(210, 100%, 30%);" : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
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
    const tableRef = useRef(null);
    const { inn } = useParams()

    //  Исправить начальное состояние в Sidebar.jsx

    useEffect(() => {
        activesAPI.getDebt(inn).then(data => setDebit(data.data)).catch(console.log)
    }, [])


    const handleKeyPress = (event) => {
        // Разрешаем только цифры и специальные клавиши (например, Backspace)
        if (!/^\d$/.test(event.key) && event.key !== "Backspace") {
            event.preventDefault(); // Блокируем ввод недопустимых символов
        }
    };



    const onChangeHandler = (id, field, value, type) => {
        setChangedDebit(prevValue => {
            return {
                ...prevValue,
                [id]: {
                    ...prevValue[id],
                    type: prevValue[id]?.type || type,
                    [field]: value
                }
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
        console.log(changedDebit)
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
                        {[...debit, ...newDebit.map(id => ({ id }))].map((row, index) => {
                            const data = changedDebit[row.id] || row
                            return (
                                <Tr
                                    key={index}
                                    onMouseEnter={() => setViewInput(index)}
                                    onMouseLeave={() => setViewInput(-1)}
                                >
                                    <td>
                                        <Input
                                            value={data.debitor_inn}
                                            onChange={event => onChangeHandler(data.id, "debitor_inn", event.target.value, data.type)}
                                            onKeyPress={handleKeyPress}
                                            view={viewInput === index}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            value={data.debitor_names}
                                            onChange={event => onChangeHandler(data.id, "debitor_names", event.target.value, data.type)}
                                            view={viewInput === index}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            type="date"
                                            value={data.date}
                                            onChange={event => onChangeHandler(data.id, "date", event.target.value, data.type)}
                                            view={viewInput === index}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            value={data.total_sum}
                                            onChange={event => onChangeHandler(data.id, "total_sum", event.target.value, data.type)}
                                            onKeyPress={handlePriceInput.handleKeyPress}
                                            onKeyDown={handlePriceInput.handleKeyDown}
                                            onInput={handlePriceInput.handleInput}
                                            onPaste={handlePriceInput.handlePaste}
                                            view={viewInput === index}
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