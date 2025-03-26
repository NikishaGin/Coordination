import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { activesAPI } from "../api/index.js"



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
    color: rgb(135, 206, 250);
    border-color: rgb(5, 30, 60);
    background-color: rgb(2, 15, 30);
  }
`;

// Стиль для контейнера таблицы
const TableContainer = styled.div`
  width: 100%; // Фиксированная ширина контейнера
  height: calc(100vh - 185px); // Высота с учетом header и padding
  overflow-x: auto; // Горизонтальная прокрутка при необходимости
  overflow-y: auto; // Вертикальная прокрутка при необходимости
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;
`;

// Стиль для таблицы
const Table = styled.table`
  width: auto; // Ширина таблицы зависит от содержимого
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: center;
  min-width: 100%; // Минимальная ширина для корректного отображения всех столбцов
  display: block; // Добавлено для корректной работы скролла
`;

// Стиль для строки заголовков
const Thead = styled.thead`
  color: rgb(255, 255, 255);
`;

// Стиль для ячеек заголовков
const Th = styled.th`
  position: sticky; // Фиксация заголовков
  top: 0; // Заголовки остаются вверху
  z-index: 10; // Чтобы заголовки были поверх остального контента
  padding: 10px;
  border-bottom: 1px solid rgba(51, 60, 77, 0.6);
  white-space: nowrap; // Запрещаем перенос текста
  background-color: rgb(12, 16, 23);
`;

// Стиль для строк данных
const Tbody = styled.tbody``;

// Стиль для ячеек данных
const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid rgba(51, 60, 77, 0.6);
  white-space: nowrap; // Запрещаем перенос текста
`;

// Контейнер для кнопок
const ButtonContainer = styled.div`
  display: flex;
  gap: 15px; // Отступ между кнопками
  margin-top: 22px;
`;

// Стиль для кнопок
const Button = styled.button`
  display: flex;
  align-items: center; // Выравнивание текста и иконки по центру
  gap: 8px; // Отступ между иконкой и текстом
  padding: 8px 16px; // Внутренние отступы
  font-size: 14px; // Размер шрифта
  font-weight: 500; // Жирность текста
  color: white; // Цвет текста
  background-color: hsl(210, 98%, 40%); // Более темный синий фон
  border: none; // Убираем границу
  border-radius: 4px; // Скругление углов
  cursor: pointer; // Курсор указывает на интерактивность
  transition: background-color 0.3s ease; // Плавный переход при наведении

  &:hover {
    background-color: hsl(210, 98%, 35%); // Еще темнее при наведении
  }

  &:focus {
    outline: none; // Убираем стандартное выделение при фокусе
    box-shadow: 0 0 4px rgba(51, 153, 255, 0.5); // Легкая тень при фокусе
  }
`;

// Стиль для иконки
const Icon = styled.svg`
  width: 16px; // Размер иконки
  height: 16px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
`;

const headings = [
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
  "Детализация индикаторов работы"
];



const formatPrice = price => {
  if (typeof price === "string")
    price = parseFloat(price)
  return price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})
}





export const Main = ({ selectedRegion }) => {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (selectedRegion.length > 0) {
      activesAPI.getTables("Index", selectedRegion).then(data => setTableData(data.data)).catch(console.log)
    }
  }, [selectedRegion])


  return (
    <Container>
      <Ul>
        <Li>не произведено</Li>
        <Li>произведено с нарушением</Li>
        <Li>произведено в срок</Li>
        <Li>в розыске</Li>
        <Li>обновление данных произведено за последние 7 дней</Li>
      </Ul>
      <TableContainer>
        <Table>
          <Thead>
            <tr>
              {headings.map((heading, index) => (
                <Th key={`header-${index}`}>{heading}</Th>
              ))}
            </tr>
          </Thead>
          <Tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
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
              </tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ButtonContainer>
        <Button>
          <Icon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </Icon>
          Статистика
        </Button>
        <Button>
          <Icon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </Icon>
          Статистика по ИП
        </Button>
      </ButtonContainer>
    </Container>
  );
};