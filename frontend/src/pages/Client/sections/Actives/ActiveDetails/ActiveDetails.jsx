import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { ButtonContainer, Button } from "../../../../../components/buttons/Button.jsx";
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import SelectFields from "./SelectFields.jsx"
import configTables from "./settingsTable.js";
import { formatNumber, formatDate, transformDateForInput } from "../../../../../utils/formatData.js"
import Input from "../../../../../components/inputs/Input.jsx";
import { activesAPI } from "../../../../../api/index.js";
import { enqueueSnackbar, SnackbarProvider } from "notistack";


const Container = styled(TableContainer)`
    height: calc(100vh - 250px - 60px);
    
    & table {
        display: table;
    }

    & th:nth-child(1), & td:nth-child(1) {
        min-width: 1000px;
        white-space: normal !important;
    }
    
    & th#comment, & td#comment {
        min-width: 600px;
        white-space: normal !important;
    }
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
`




export default function({ nameActive }) {
    const [data, setData] = useState([])
    const [selectedColumn, setSelectedColumn] = useState([])
    const [changedValue, setChangedValue] = useState({})
    const [viewInput, setViewInput] = useState(-1)
    const tableRef = useRef(null);
    const config = configTables(nameActive)

    const { inn } = useParams()


    useEffect(() => {
        activesAPI.getActives(inn, nameActive).then(response => {
            setData(response.data.map((row) => {
                return {
                    id: row.id,
                    ...config.flat().reduce((obj, { field, type, editable }) => {
                        if ((type == "date") && editable)
                            return { ...obj, [field]: transformDateForInput(row[field]) }
                        else if ((type == "date") && !editable)
                            return { ...obj, [field]: formatDate(row[field]) }
                        else if (type == "number")
                            return { ...obj, [field]: formatNumber(row[field]) }
                        else
                            return { ...obj, [field]: row[field] }
                    }, {})
                }
            }))
        }).catch(console.log)
    }, [])

    const onChangeHandler = (id, field, value) => {
        setChangedValue(prevValue => {
            return {
                ...prevValue,
                [id]: {
                    ...prevValue[id],
                    [field]: value
                }
            }
        })
    }


    const resetChange = () => {
        setChangedValue({})
        const timer = setTimeout(() => {
            tableRef.current.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }, 0)
        return () => clearTimeout(timer)
    }

    const saveChange = async () => {
        if (Object.keys(changedValue).length === 0) return

        const getChangedFields = (newObj, oldObj) => {
            return Object.fromEntries(
                Object.entries(newObj).filter(([key, value]) => key in oldObj && value !== oldObj[key])
            );
        };

        const getOldDataById = id => data.find(row => row.id === parseInt(id));

        const updatedData = Object.fromEntries(
            Object.entries(changedValue)
                .map(([id, value]) => [id, getChangedFields(value, getOldDataById(id))])
                .filter(([, changes]) => Object.keys(changes).length > 0)
        );

        let updateSuccess = false;

        // 🟡 Обновление существующих записей
        if (Object.keys(updatedData).length > 0) {
            try {
                await activesAPI.updateActives(nameActive, inn, updatedData);
                setData(prevValue => prevValue.map(item => ({ ...item, ...changedValue[item.id] })));
                setChangedValue({})
                updateSuccess = true;
            } catch (error) {
                console.error("Ошибка при обновлении:", error);
            }
        }

        if (updateSuccess)
            enqueueSnackbar("Сохранено", { variant: "success" });
        else
            enqueueSnackbar("Ошибка при сохранении", { variant: "error" });
    }


    return (
        <>
            <Container hHeader="350px" ref={tableRef}>
                <table>
                    <thead>
                    <tr>
                        {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(({ name, field }) => <th id={field}>{name}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => {
                        const data = {
                            ...row,
                            ...changedValue[row.id]
                        }

                        return (
                            <Tr
                                key={index}
                                onMouseEnter={() => setViewInput(index)}
                                onMouseLeave={() => setViewInput(-1)}
                            >
                                {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(item => {
                                    if (item.editable) {
                                        return <td id={item.field} width={item.width}><Input type={item.type} value={data[item.field]} onChange={event => onChangeHandler(data.id, item.field, event.target.value)} options={item.options} view={viewInput === index} /></td>
                                    } else
                                        return <td width={item.width}>{data[item.field]}</td>

                                })}
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
                    <SelectFields config={config.slice(1)} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} />
                </ButtonContainer>
                <ButtonContainer>
                    <Button onClick={resetChange}>Сбросить изменения</Button>
                    <Button onClick={saveChange}>Сохранить</Button>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}