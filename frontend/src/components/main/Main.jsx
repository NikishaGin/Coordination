import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { activesAPI, downloadAPI } from "../../api/index.js";
import downloadExcel from "../../utils/downloadExcel.js"
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

const TableContainer = styled.div`
  width: 100%;
  height: calc(100vh - 185px);
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;
`;

const Table = styled.table`
  width: auto;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: center;
  min-width: 100%;
  display: block;
`;

const Thead = styled.thead`
  color: rgb(255, 255, 255);
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid rgba(51, 60, 77, 0.6);
  white-space: nowrap;
  background-color: rgb(12, 16, 23);
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(2, 122, 242, 0.16)" : "transparent"};
  &:hover {
    background-color: ${({ isSelected }) =>
    isSelected ? "rgba(242, 162, 2, 0.16)" : "rgba(71, 83, 107, 0.2)"};
  }
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid rgba(51, 60, 77, 0.6);
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 22px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: hsl(210, 100%, 30%);
  border: 1px solid hsl(210, 100%, 40%);
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: hsl(210, 100%, 50%);
    border-color: hsl(210, 100%, 60%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: hsl(210, 100%, 20%);
    border-color: hsl(210, 100%, 30%);
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.2);
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(51, 153, 255, 0.7);
  }

  @media (max-width: 600px) {
    padding: 8px 8px;
    font-size: 0.75rem;
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

const Message = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 610px;
  height: 35px;
  border-radius: 15px;
  background-color: rgb(94, 111, 143);
  box-shadow: inset -3px -3px 3px 0 rgba(0,0,0,.5), 
              3px 3px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${({visible}) => (visible) ? 1 : 0};
  transition: opacity 2s linear;
`


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
  "Направление ходатайства в ГМУ",
  "Взаимодействие с ТНО",
  "Арест имущества",
  "Оценка имущества",
  "Принудительная реализация",
  "Торги 2 этап",
  "Результат принудительной реализации",
  "Сумма возврата имущества плательщику",
  "Обращение взыскания на дебиторскую задолженность",
  "Детализация индикаторов работы",
];


const formatPrice = (price) => {
  if (typeof price === "string") price = parseFloat(price);
  return price.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};





export const Main = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedInn, setSelectedInn] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

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
    } else {
      setShowMessage(true)
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer)
    }
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
      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th>
                <CustomCheckbox>
                  <input
                    type="checkbox"
                    checked={(selectedInn.length === filteredData.length) && (filteredData.length > 0)}
                    onChange={handleSelectAll}
                  />
                  <span></span>
                </CustomCheckbox>
              </Th>
              {headings.slice(1).map((heading, index) => (
                <Th key={`header-${index}`}>{heading}</Th>
              ))}
            </tr>
          </Thead>
          <Tbody>
            {filteredData.map((row, rowIndex) => (
              <Tr key={rowIndex} isSelected={selectedInn.includes(row.inn)} onClick={event => handleLink(event, row.inn)}>
                <Td onClick={event => event.stopPropagation()}>
                  <CustomCheckbox>
                    <input
                      type="checkbox"
                      checked={selectedInn.includes(row.inn)}
                      onChange={event => handleInnSelect(event, row.inn)}
                    />
                    <span></span>
                  </CustomCheckbox>
                </Td>
                <Td>{rowIndex + 1}</Td>
                <Td>{row.inn}</Td>
                <Td>{row.name}</Td>
                <Td>{formatPrice(row.post_sum)}</Td>
                <Td>{formatPrice(row.cur_debt)}</Td>
                <Td>{row.category}</Td>
                <Td>{formatPrice(row.total_sum)}</Td>
                <Td>{row.status_ip}</Td>
                <Td>{row.sosp_code}</Td>
                <Td></Td>
                <Td></Td>
                <Td>{formatPrice(row.arrest)}</Td>
                <Td>{formatPrice(row.evaluation)}</Td>
                <Td>{formatPrice(row.realization_property)}</Td>
                <Td>{formatPrice(row.price_reduction)}</Td>
                <Td>{formatPrice(row.realization_sum_2)}</Td>
                <Td>{formatPrice(row.return_sum)}</Td>
                <Td>{formatPrice(row.debitor)}</Td>
                <Td></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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
      <Message visible={showMessage}>Выберете регион и строки, которые необходимо включить в статистику</Message>
    </Container>
  );
};
