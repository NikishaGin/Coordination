import styled from "styled-components";
import { handlesInputNumber, handlesInputInn } from "./handleInput";


const borderInput = error => (error) ? "1px solid hsl(8, 74.80%, 50.20%);" : "1px solid hsl(210, 100%, 30%);"

const InputStyle = styled.input`
    width: 100%;
    padding: 3px;
    border: ${({ view, error }) => (view || error) ? borderInput(error) : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
    outline: none; // Убираем стандартное выделение при фокусе
`


const TextareaStyle = styled.textarea`
    width: 100%;
    padding: 3px;
    border: ${({ view, error }) => (view || error) ? borderInput(error) : "1px solid transparent"};
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
    border: ${({ view, error }) => (view || error) ? borderInput(error) : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
    outline: none; // Убираем стандартное выделение при фокусе
    cursor: pointer;
`



export default function({ type, width, options, value, view, error, onChange }) {

    if (["text", "date"].includes(type))
        return <InputStyle type={type} value={value ?? ""} view={view} error={error} onChange={onChange} style={{ width: (type == "text") ? width : "120px" }} />
    else if (type == "textarea")
        return <TextareaStyle value={value ?? ""} view={view} error={error} onChange={onChange} style={{ width }} />
    else if (type == "inn")
        return <InputStyle 
                    type="text" 
                    value={value ?? ""} 
                    view={view}
                    error={error}
                    onChange={onChange} 
                    style={{ width: "110px" }}
                    onKeyDown={handlesInputInn.handleKeyDown}
                    onPaste={handlesInputInn.handlePaste} 
                />
    else if (type == "number")
        return <InputStyle type="text" value={value} view={view} error={error} onChange={onChange} style={{ width: "140px" }}
                    onKeyPress={handlesInputNumber.handleKeyPress}
                    onKeyDown={handlesInputNumber.handleKeyDown}
                    onInput={handlesInputNumber.handleInput}
                    onPaste={handlesInputNumber.handlePaste}
                />
    else if (type == "select")
        return <SelectStyle value={value} view={view} error={error} onChange={onChange}>{options.map(item => <option value={item.value}>{item.text}</option>)}</SelectStyle>
}