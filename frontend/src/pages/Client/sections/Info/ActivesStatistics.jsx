import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, DownloadCloud } from "lucide-react";
import { useParams } from "react-router";
import { activesAPI, downloadAPI } from "../../../../api/index.js";
import { Button} from "../../../../components/buttons/Button.jsx";
import { downloadExcel } from '../../../../utils/downloadExcel.js';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';


const ChartContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 2rem; // Add margin to create space before the button

    @media (min-width: 1024px) {
        grid-template-columns: 3fr 2fr;
        align-items: center;
    }
`;

const ChartSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (max-width: 1023px) {
        order: -1; // Move info section above chart on mobile
    }
`;

const PieChartWrapper = styled.div`
    width: 100%;
    height: 25rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TotalValueContainer = styled.div`
    text-align: center;
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }

    p:first-child {
        color: rgb(255, 255, 255);
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    p:last-child {
        color: rgb(255, 255, 255);
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

const TooltipWrapper = styled.div`
    background-color: white;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    border-radius: 0.375rem;

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
        color: #374151;
        font-size: 0.875rem;
    }

    p:last-child {
        margin-top: 0.25rem;
        color: #6b7280;
        font-size: 0.75rem;
    }
`;

const LegendContainer = styled.div`
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LegendTitle = styled.h3`
    color: rgb(255, 255, 255);
    font-size: 1.125rem;
    margin-bottom: 1rem;
    text-align: center;
`;

const LegendWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    background-color: rgba(255, 255, 255, 0.03);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.08);
    }
`;

const LegendLabel = styled.div`
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

const LegendValue = styled.span`
    font-size: 0.875rem;
    color: rgb(255, 255, 255);
    font-weight: 500;
`;

const NoDataWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 16rem;
    color: #6b7280;

    svg {
        color: #9ca3af;
        margin-bottom: 0.75rem;
    }
`;

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
    width: 100%;
    grid-column: 1 / -1;
`;

const StatsButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #3a3a6a;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4a4a7a;
    }

    svg {
        color: #ffffff;
    }
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

export default function PieChartAssets() {
    const pageKey = useSelector((state) => state.global.pageKey);
    const isderived = ["/derivative-archive", "/derivative"].includes(pageKey);

    const [assets, setAssets] = useState(null); // Состояние для хранения данных об активах
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const { inn }  = useParams(); // Получаем ИНН из параметров URL

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

    // Рендер кастомных легенд
    const renderCustomLegend = () => (
        <LegendContainer>
            <LegendTitle>Структура активов</LegendTitle>
            <LegendWrapper>
                {chartData.map((entry, index) => {
                    const percent = Math.round((entry.value / totalCost) * 100);
                    return (
                        <LegendItem key={`legend-${index}`}>
                            <LegendLabel>
                                <LegendColorBox style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{entry.name}</span>
                            </LegendLabel>
                            <LegendValue>{formatNumber(entry.value)} ₽ ({percent}%)</LegendValue>
                        </LegendItem>
                    );
                })}
            </LegendWrapper>
        </LegendContainer>
    );

    const handleDownload = async (e) => {
        e.preventDefault();

        try{
            enqueueSnackbar("Начало загрузки...", { variant: "info" });

            const response = await downloadAPI.getDebtorActivesStat(inn, isderived);
            downloadExcel(response);

            enqueueSnackbar("Загружено",  { variant: "info" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Ошибка загрузки файла", { variant: "error" });
        }
    };

    // Основной JSX, содержащий диаграмму и общую стоимость
    return (
        <>
            <ChartContainer>
                <ChartSection>
                    <PieChartWrapper>
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
                            </PieChart>
                        </ResponsiveContainer>
                    </PieChartWrapper>
                </ChartSection>

                <InfoSection>
                    <TotalValueContainer>
                        <p>Общая стоимость активов:</p>
                        <p>{formatNumber(totalCost)} ₽</p>
                    </TotalValueContainer>

                    {renderCustomLegend()}
                </InfoSection>

                <ButtonBox>
                    <StatsButton onClick={handleDownload}>
                        <DownloadCloud size={18} />
                        Выгрузка ИД по собственности
                    </StatsButton>
                </ButtonBox>
                <SnackbarProvider
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    maxSnack={1}
                    autoHideDuration={5000}
                />
            </ChartContainer>
        </>
    );
}