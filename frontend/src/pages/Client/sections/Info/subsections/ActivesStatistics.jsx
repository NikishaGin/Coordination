import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";
import { Button, ButtonContainer } from "../../../../../components/buttons/Button.jsx";

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PieChartContainer = styled.div`
  width: 100%;
  height: 25rem;
`;
const TotalValueContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;

  p:first-child {
    color: rgb(255, 255, 255);
    font-size: 1rem; // text-sm
  }

  p:last-child {
    margin-top: 0.35rem;
    color: rgb(255, 255, 255);
    font-size: 1.25rem; // text-xl
    font-weight: 600;
  }
`;
const TooltipWrapper = styled.div`
  background-color: white;
  padding: 0.75rem;
  border: 1px solid #e5e7eb; // border-gray-200
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  border-radius: 0.375rem; // rounded-md

  p {
    font-weight: 500;
    font-size: 1.5rem;
    margin: 0;
    color: black;
  }

  p:first-child {
    font-weight: 500;
    font-size: 1rem;
  }

  p:nth-child(2), p:nth-child(3) {
    margin-top: 0.25rem;
    color: #374151; // text-gray-700
    font-size: 0.875rem;
  }

  p:last-child {
    margin-top: 0.25rem;
    color: #6b7280; // text-gray-500
    font-size: 0.75rem;
  }
`;
const LegendWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 0.875rem;
    color: rgb(255, 255, 255);
  }
`;
const LegendColorBox = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem;
  margin-right: 0.5rem;
`;
const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
  color: #6b7280;

  svg {
    color: #9ca3af; // text-gray-400
    margin-bottom: 0.75rem;
  }
`;


const ButtonBox = styled(ButtonContainer)`
    margin-top: 50px;
    justify-content: center;
`

const Icon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;


// Форматирование числа по российскому стандарту без десятичных знаков
const formatNumber = (value) =>
    value == null ? null : new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);

// Компонент, отображающий сообщение "Нет данных"
const NoDataDisplay = ({ message = "Нет данных" }) => (
    <NoDataWrapper>
        <AlertCircle size={36} />
        <p>{message}</p>
    </NoDataWrapper>
);

// Цвета для секторов диаграммы
const COLORS = ["#4F46E5", "#65A30D", "#0891B2", "#D97706", "#9333EA"];

// Названия типов активов
const ASSET_NAMES = {
    transport: "Транспорт",
    ground: "Земля",
    property: "Недвижимость",
    debit: "Дебиторская задолженность",
    another: "Прочие активы"
};

// Парсинг стоимости актива: возвращает число или 0
const parseCost = (asset) => parseFloat(asset?.cost) || 0;

export default function () {
    const [assets, setAssets] = useState(null); // Состояние для хранения данных об активах
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const { inn } = useParams(); // Получаем ИНН из параметров URL

    // Получение статистики активов при изменении ИНН
    useEffect(() => {
        if (!inn) return;

        setLoading(true);
        activesAPI.getActivesStatistics(inn) // Запрос к API
            .then(({ data }) => setAssets(data)) // Сохраняем полученные данные
            .catch(console.error) // Обрабатываем ошибку
            .finally(() => setLoading(false)); // Отключаем индикатор загрузки
    }, [inn]);

    // Подготовка данных для отображения в диаграмме
    const getChartData = () => {
        if (!assets) return [];

        return Object.entries(ASSET_NAMES)
            .map(([key, name]) => {
                const cost = parseCost(assets[key]); // Стоимость актива
                const quantity = assets[key]?.count || 0; // Кол-во активов
                return cost > 0 ? { id: key, name, value: cost, quantity } : null;
            })
            .filter(Boolean); // Убираем null
    };

    // Расчёт общей стоимости всех активов
    const getTotalCost = () => {
        if (!assets) return 0;

        return Object.keys(ASSET_NAMES)
            .reduce((sum, key) => sum + parseCost(assets[key]), 0);
    };

    // Компонент легенды под диаграммой
    const renderLegend = ({ payload }) => (
        <LegendWrapper>
            {payload.map(({ value, color }, i) => (
                <LegendItem key={i}>
                    <LegendColorBox style={{ backgroundColor: color }} />
                    <span>{value}</span>
                </LegendItem>
            ))}
        </LegendWrapper>
    );

    // Компонент всплывающей подсказки при наведении на сектор диаграммы
    const renderTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const { value, payload: data } = payload[0];
        const name = data.name;
        const quantity = data.quantity || 0;
        const percent = Math.round((value / getTotalCost()) * 100); // % от общего числа

        return (
            <TooltipWrapper>
                <p><strong>{name}</strong></p>
                {(payload[0].payload.id === "transport") && <p>Рыночная стоимость: <strong>{formatNumber(value)} ₽</strong></p>}
                {(["ground", "property"].includes(payload[0].payload.id)) && <p>Кадастровая стоимость: <strong>{formatNumber(value)} ₽</strong></p>}
                {(payload[0].payload.id === "debit") && <p>Дебиторская задолженность: <strong>{formatNumber(value)} ₽</strong></p>}
                {(payload[0].payload.id === "another") && <p>Сумма взыскания: <strong>{formatNumber(value)} ₽</strong></p>}
                <p>Количество: <strong>{formatNumber(quantity)}</strong></p>
                <p>{percent}% от общей суммы</p>
            </TooltipWrapper>
        );
    };

    // Получение готовых данных для графика и суммы
    const chartData = getChartData();
    const totalCost = getTotalCost();

    // Отображение загрузки или отсутствия данных
    if (loading) return <p>Загрузка...</p>;
    if (chartData.length === 0) return <NoDataDisplay message="Нет данных о стоимости активов" />;

    // Основной JSX, содержащий диаграмму и общую стоимость
    return (
        <>
            <ChartWrapper>
                <PieChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                innerRadius={35}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                animationDuration={800}
                                animationBegin={200}
                                animationEasing="ease-out"
                                minAngle={10}
                            >
                                {/* Раскрашиваем каждый сектор отдельным цветом */}
                                {chartData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={renderTooltip} />
                            <Legend content={renderLegend} layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                    </ResponsiveContainer>
                </PieChartContainer>

                {/* Блок с общей стоимостью всех активов */}
                <TotalValueContainer>
                    <p>Общая стоимость активов:</p>
                    <p>{formatNumber(totalCost)} ₽</p>
                </TotalValueContainer>
            </ChartWrapper>


            <ButtonBox>
                <Button>
                    <Icon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </Icon>
                    Выгрузка ИД по собственности
                </Button>
            </ButtonBox>
        </>
    );
}
