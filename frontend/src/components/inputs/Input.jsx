import styled from "styled-components";
import { formatNumber, formatDate, transformDateForInput } from "../../utils/formatData.js"
import { handlesInputNumber, handlesInputInn } from "./handleInput";



const InputStyle = styled.input`
    width: 100%;
    padding: 3px;
    border: ${({ view }) => (view) ? "1px solid hsl(210, 100%, 30%);" : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
`


const TextareaStyle = styled.textarea`
    width: 100%;
    padding: 3px;
    border: ${({ view }) => (view) ? "1px solid hsl(210, 100%, 30%);" : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
    max-height: 100px;
    box-sizing: border-box;
    resize: none;
`


const SelectStyle = styled.select`
    width: 100%;
    padding: 3px;
    border: ${({ view }) => (view) ? "1px solid hsl(210, 100%, 30%);" : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
    outline: none; // Убираем стандартное выделение при фокусе
    cursor: pointer;
`

/*
type: "text"
type: "textarea"
type: "date"
type: "inn"
type: "number"
type: "select" 
*/




export default function({ type, width, options, value, view, onChange }) {

    if (["text", "date"].includes(type))
        return <InputStyle type={type} value={(type == "date") ? transformDateForInput(value) : value} view={view} onChange={onChange} style={{ width }} />
    else if (type == "textarea") {
        console.log("input",  value)
        return <TextareaStyle view={view} onChange={onChange} style={{ width }}>{value}</TextareaStyle>
    }
    else if (type == "inn")
        return <InputStyle type="text" value={value} view={view} onChange={onChange} style={{ width }} onKeyPress={handlesInputInn.handleKeyPress} onPaste={handlesInputInn.handlePaste} />
    else if (type == "number")
        return <InputStyle type="text" value={(value)} view={view} onChange={onChange} style={{ width }}
                    onKeyPress={handlesInputNumber.handleKeyPress}
                    onKeyDown={handlesInputNumber.handleKeyDown}
                    onInput={handlesInputNumber.handleInput}
                    onPaste={handlesInputNumber.handlePaste}
                />
    else if (type == "select")
        return <SelectStyle value={value} view={view} onChange={onChange}>{options.map(item => <option value={item.value}>{item.text}</option>)}</SelectStyle>
}