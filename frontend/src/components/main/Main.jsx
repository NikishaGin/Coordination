import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { TableContainer, Tr } from "../tables/Table.jsx";
import { ButtonContainer, Button } from "../buttons/Button.jsx";
import { activesAPI, downloadAPI } from "../../api/index.js";
import downloadExcel from "../../utils/downloadExcel.js"
import { formatNumber } from "../../utils/formatData.js"
import { useSelector } from "react-redux";



const Container = styled.div`
  padding-right: 24px;
  padding-left: 24px;
  height: 100%;
`;

const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
`;

const Li = styled.li`
  padding-left: 8px;
  padding-right: 8px;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-radius: 999px;
  text-align: center;

  &:nth-child(1) {
    color: rgb(252, 156, 156);
    border-color: rgb(60, 2, 2);
    background-color: rgb(30, 1, 1);
  }

  &:nth-child(2) {
    color: rgb(255, 223, 130);
    border-color: rgb(60, 50, 5);
    background-color: rgb(30, 25, 2);
  }

  &:nth-child(3) {
    color: rgb(161, 232, 161);
    border-color: rgb(4, 47, 4);
    background-color: rgb(2, 29, 2);
  }

  &:nth-child(4) {
    color: rgb(255, 178, 102);
    border-color: rgb(80, 40, 5);
    background-color: rgb(40, 20, 2);
  }

  &:nth-child(5) {
    color: rgb(240, 135, 250);
    border-color: rgb(60, 5, 54);
    background-color: rgb(30, 2, 17);
  }

  &:nth-child(6) {
    color: rgb(135, 206, 250);
    border-color: rgb(5, 30, 60);
    background-color: rgb(2, 15, 30);
  }
`;


const Icon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;

// Стиль для кастомного чекбокса
const CustomCheckbox = styled.label`
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
  /*cursor: pointer;*/

  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  span:hover {
    border-color: rgb(2, 122, 242);
  }

  input[type="checkbox"]:checked + span {
    background-color: rgb(2, 122, 242);
    border-color: rgb(2, 122, 242);
  }

  input[type="checkbox"]:checked + span::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -60%) rotate(45deg);
  }


span {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 1px solid rgba(51, 60, 77, 0.6);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
`;


const headings = [
  "",
  "№",
  "ИНН",
  "Наименование",
  "Сумма по постановлениям",
  "Остаток по постановлениям",
  "Категория должника",
  "Сумма активов и дебиторской задолженности",
  "Статус ИП",
  "Код СОСП",
  "Арест имущества",
  "Оценка имущества",
  "Принудительная реализация",
  "Торги 2 этап",
  "Результат принудительной реализации",
  "Сумма возврата имущества плательщику",
  "Обращение взыскания на дебиторскую задолженность",
];



export const Main = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedInn, setSelectedInn] = useState([]);
  const inputValue = useSelector((state) => state.global.inputValue);
  const selectedRegion = useSelector((state) => state.global.selectedRegion);

  const navigate = useNavigate()


  useEffect(() => {
    activesAPI
      .getTables("Index", selectedRegion)
      .then((data) => setTableData(data.data))
      .catch(console.log);
  }, [selectedRegion]);

  const filteredData = inputValue
    ? tableData.filter((row) => row.inn.toString().includes(inputValue))
    : tableData;


  const handleSelectAll = event => {
    if (event.target.checked)
      setSelectedInn(filteredData.map(item => item.inn));
    else
      setSelectedInn([]);
  };


  const handleInnSelect = (event, inn) => {
    if (event.target.checked)
      setSelectedInn([...selectedInn, inn]);
    else
      setSelectedInn(selectedInn.filter(value => value != inn));
  };


  const handleLink = (event, inn) => {
    if (event.target.type === 'checkbox') return;
    navigate(`/client/${inn}`)
  }


  const downloadStatistics = flagButton => {
    if (selectedInn.length > 0) {
      if (flagButton) {
        downloadAPI.getStatistics(false, selectedRegion, selectedInn).then().catch(console.log)
      } else {
        downloadAPI.getStatisticsIP(false, selectedRegion, selectedInn).then(downloadExcel).catch(console.log)
      }
    } else 
      enqueueSnackbar("Выберете регион и строки, которые необходимо включить в статистику", {variant: "info"})
  }


  return (
    <Container>
      <Ul>
        <Li>не произведено</Li>
        <Li>произведено с нарушением</Li>
        <Li>произведено в срок</Li>
        <Li>в розыске</Li>
        <Li>залог перед ФНС</Li>
        <Li>обновление данных произведено за последние 7 дней</Li>
      </Ul>
      <TableContainer hHeader="185px">
        <table>
          <thead>
            <tr>
              <th>
                <CustomCheckbox>
                  <input
                    type="checkbox"
                    checked={(selectedInn.length === filteredData.length) && (filteredData.length > 0)}
                    onChange={handleSelectAll}
                  />
                  <span></span>
                </CustomCheckbox>
              </th>
              {headings.slice(1).map((heading, index) => (
                <th key={`header-${index}`}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <Tr key={rowIndex} isSelected={selectedInn.includes(row.inn)} cursor={true} onClick={event => handleLink(event, row.inn)}>
                <td onClick={event => event.stopPropagation()}>
                  <CustomCheckbox>
                    <input
                      type="checkbox"
                      checked={selectedInn.includes(row.inn)}
                      onChange={event => handleInnSelect(event, row.inn)}
                    />
                    <span></span>
                  </CustomCheckbox>
                </td>
                <td>{rowIndex + 1}</td>
                <td>{row.inn}</td>
                <td>{row.name}</td>
                <td>{formatNumber(row.post_sum)}</td>
                <td>{formatNumber(row.cur_debt)}</td>
                <td>{row.category}</td>
                <td>{formatNumber(row.total_sum)}</td>
                <td>{row.status_ip}</td>
                <td>{row.sosp_code}</td>
                <td>{formatNumber(row.arrest)}</td>
                <td>{formatNumber(row.evaluation)}</td>
                <td>{formatNumber(row.realization_property)}</td>
                <td>{formatNumber(row.price_reduction)}</td>
                <td>{formatNumber(row.realization_sum_2)}</td>
                <td>{formatNumber(row.return_sum)}</td>
                <td>{formatNumber(row.debitor)}</td>
              </Tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <ButtonContainer>
        <Button onClick={() => downloadStatistics(true)}>
          <Icon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </Icon>
          Статистика
        </Button>
        <Button onClick={() => downloadStatistics(false)}>
          <Icon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </Icon>
          Статистика по ИП
        </Button>
      </ButtonContainer>
      <SnackbarProvider
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        maxSnack={1}
        autoHideDuration={5000}
      />
    </Container>
  );
};
