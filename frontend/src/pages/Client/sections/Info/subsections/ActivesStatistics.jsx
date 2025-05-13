import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {AlertCircle} from "lucide-react";


const formatNumber = (value) => {
    if (value === undefined || value === null) return null;

    return new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 0,
    }).format(value);
};

const NoDataDisplay = ({ message = "Нет данных" }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle size={36} className="text-gray-400 mb-3" />
            <p>{message}</p>
        </div>
    );
};


// Color palette for the chart
const COLORS = [
    "#4F46E5", // Transport - Indigo
    "#65A30D", // Ground - Lime
    "#0891B2", // Property - Cyan
    "#D97706", // Debit - Amber
    "#9333EA"  // Another - Purple
];

// Asset type names in Russian
const ASSET_NAMES = {
    transport: "Транспорт",
    ground: "Земля",
    property: "Недвижимость",
    debit: "Дебиторская задолженность",
    another: "Прочие активы"
};

export default function () {
    const [actives, setActives] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const mockData = {
        transport: { count: 5, cost: 1250000 },
        ground: { count: 2, cost: 3750000 },
        property: { count: 3, cost: 8500000 },
        debit: { count: 10, cost: 2100000 },
        another: { count: 7, cost: 90000 },
        total_sum: 16550000
    };

    useEffect(() => {
        setIsLoading(true);

        // If mockData is provided, use it directly (for demo purposes)
        if (mockData) {
            setActives(mockData);
            setIsLoading(false);
        }

    }, []);

    // Transform the data for the pie chart
    const prepareChartData = () => {
        if (!actives || Object.keys(actives).length === 0) return [];

        const assetTypes = ["transport", "ground", "property", "debit", "another"];

        return assetTypes
            .filter(type => actives[type]?.cost && actives[type].cost > 0)
            .map(type => ({
                name: ASSET_NAMES[type],
                value: actives[type].cost,
                rawValue: actives[type].cost
            }));
    };

    const chartData = prepareChartData();
    const hasData = chartData.length > 0;

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
                    <p className="font-medium text-base">{payload[0].name}</p>
                    <p className="text-gray-700 text-sm mt-1">
                        Стоимость: <span className="font-semibold">{formatNumber(payload[0].value)} ₽</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        {Math.round((payload[0].value / actives.total_sum) * 100)}% от общей суммы
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom legend renderer
    const renderCustomizedLegend = (props) => {
        const { payload } = props;

        return (
            <div className="flex flex-wrap justify-center mt-6 gap-4">
                {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div
                            className="w-4 h-4 rounded-sm mr-2"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-700">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };


    if (!hasData) {
        return <NoDataDisplay message="Нет данных о стоимости активов" />;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                            animationDuration={800}
                            animationBegin={200}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            content={renderCustomizedLegend}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">Общая стоимость активов:</p>
                <p className="text-gray-800 text-xl font-semibold mt-1">
                    {formatNumber(actives.total_sum) || "0"} ₽
                </p>
            </div>
        </div>
    );
};
