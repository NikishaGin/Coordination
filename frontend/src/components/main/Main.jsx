import React, {useState, useEffect, useMemo} from "react";
import {useLocation, useNavigate} from "react-router";
import styled from "styled-components";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { TableContainer, Tr } from "../tables/Table.jsx";
import { ButtonContainer } from "../buttons/Button.jsx";
import { downloadAPI } from "../../api/index.js";
import { downloadExcel } from "../../utils/downloadExcel.js"
import {formatNumber } from "../../utils/formatData.js"
import { useDispatch, useSelector } from "react-redux";
import { fetchTableData } from "../../store/tableDataSlice.js";
import { DownloadCloud } from 'lucide-react';

const Container = styled.div`
    background-color: ${props => props.theme.colors.background};
    padding-right: 24px;
    padding-left: 24px;
    height: 100%;
`;

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

const StatsButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
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

export const StatusIndicators = styled.div`
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    margin-top: 11.5px;

    .status {
        font-size: 14px;
        padding: 4px 12px;
        border-radius: 4px;
        white-space: nowrap;
    }

    .not-executed {
        background-color: #602020;
        color: #fff;
    }

    .executed-with-violation {
        background-color: #946000;
        color: #fff;
    }

    .executed-on-time {
        background-color: #1a5336;
        color: #fff;
    }

    .in-search {
        background-color: #7e4e00;
        color: #fff;
    }

    .pledged-to-tax {
        background-color: #4a2d79;
        color: #fff;
    }

    .data-updated {
        background-color: #1a3b5c;
        color: #fff;
    }
`;
const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 11.5px; /* Расстояние между индикаторами и таблицей */

`;



const headingsCoordination = [
    "",
    "№",
    "Код НО",
    "ИНН",
    "Наименование",
    "Сумма по постановлениям, ₽",
    "Остаток по постановлениям, ₽",
    "Категория должника",
    "Сумма активов и дебиторской задолженности, ₽",
    "Направление ходатайства в ГМУ",
    "Взаимодействие с ТНО",
    "Арест имущества, ₽",
    "Обеспечение арестом",
    "Оценка имущества, ₽",
    "Принудительная реализация, ₽",
    "Торги 2 этап, ₽",
    "Результат принудительной реализации, ₽",
    "Сумма возврата имущества плательщику, ₽",
    "Сумма по обращениям на взыскания дебиторской задолженности, ₽",
    "Статус ИП",
    "Код СОСП",
];

const headingsDerivative = [
    "",
    "№",
    "Код НО",
    "ИНН",
    "Наименование",
    "Сумма исполнительного листа, ₽",
    "Остаток исполнительного листа, ₽",
    "Категория должника",
    "Сумма активов и дебиторской задолженности, ₽",
    "Направление ходатайства в ГМУ",
    "Взаимодействие с ТНО",
    "Арест имущества, ₽",
    "Обеспечение арестом",
    "Оценка имущества, ₽",
    "Принудительная реализация, ₽",
    "Торги 2 этап, ₽",
    "Результат принудительной реализации, ₽",
    "Сумма возврата имущества плательщику, ₽",
    "Сумма по обращениям на взыскания дебиторской задолженности, ₽",
    "Статус ИП",
    "Код СОСП",
];

const codeIndicators = {
    1: "status not-executed",
    2: "status executed-with-violation",
    3: "status executed-on-time",
    isLizingFNS: "status pledged-to-tax",
    isUpdated: "status data-updated"
}



export const Main = () => {
    const location = useLocation();

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [selectedInn, setSelectedInn] = useState([]);

    const filters = useSelector((state) => state.global.filters);
    const tableData = useSelector((state) => state.tableData.tableData);

    const pageKey = useSelector((state) => state.global.pageKey);
    const headings = useMemo(() => {
        if (["/coordination-archive", "/coordination"].includes(location.pathname)) {
            return headingsCoordination;
        } else if (["/derivative-archive", "/derivative"].includes(location.pathname)) {
            return headingsDerivative;
        } else {
            return { headings: [] };
        }
    }, [location.pathname]);

    const selectedRegionByPage = useSelector((state) => state.global.selectedRegionByPage);
    const selectedRegion = selectedRegionByPage?.[pageKey] || null;


    useEffect(() => {
        dispatch(fetchTableData({pageKey, region: selectedRegion}));
    }, [dispatch, pageKey, selectedRegion]);

    const filteredData = useMemo(() => {
        let data = [...tableData];

        if (filters.inputValueInn)
            data = data.filter((row) => row.inn.startsWith(filters.inputValueInn));

        if (filters.category)
            data = data.filter((row) => row.category === filters.category);

        if (filters.status_ip)
            data = data.filter((row) => row.status_ip === filters.status_ip);

        if (filters.name_filtered_field && filters.sum)
            data = data.filter((row) => row[filters.name_filtered_field] >= filters.sum);

        return data;
    }, [tableData, filters]);


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


    const downloadStatistics = async flagButton => {
        if (!selectedInn.length > 0) {
            enqueueSnackbar("Выберете регион и строки, которые необходимо включить в статистику", { variant: "info" })
            return
        }
        const target = flagButton ? downloadAPI.getStatistics : downloadAPI.getStatisticsIP;
        try {
            enqueueSnackbar("Начало загрузки...", { variant: "info" });
            const isDerived = +["DerivativeDebt", "DerivativeDebtArchive"].includes(pageKey)
            const isArchive = +["IndexArchive", "DerivativeDebtArchive"].includes(pageKey)
            const response = await target(selectedInn, isDerived, isArchive);
            downloadExcel(response);
            enqueueSnackbar("Загружено", { variant: "info" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Ошибка загрузки файла", { variant: "error" });
        }
    };

    const renderTableCells = (row, rowIndex, pageKey) => {
        if (pageKey === "Index" || pageKey === "IndexArchive") {
            return (
                <>
                    <td>{rowIndex + 1}</td>
                    <td>{row.kno}</td>
                    <td>{row.inn}</td>
                    <td className={(row.indicators.isUpdated) ?? codeIndicators.isUpdated}>{row.name}</td>
                    <td>{formatNumber(row.post_sum)}</td>
                    <td>{formatNumber(row.cur_debt)}</td>
                    <td>{row.category}</td>
                    <td className={(row.indicators.isLizingFNS) && codeIndicators.isLizingFNS}>{formatNumber(row.total_sum)}</td>
                    <td>{row.interaction_gmu}</td>
                    <td>{row.interaction_tno}</td>
                    <td className={codeIndicators[row.indicators.arrest]}>{formatNumber(row.arrest_sum)}</td>
                    <td>{row.securingArrest}</td>
                    <td className={codeIndicators[row.indicators.evaluation]}>{formatNumber(row.evaluation_sum)}</td>
                    <td className={codeIndicators[row.indicators.submitRealizationFirstStage]}>{formatNumber(row.realization_property_sum)}</td>
                    <td className={codeIndicators[row.indicators.submitRealizationSecondStage]}>{formatNumber(row.price_reduction_sum)}</td>
                    <td className={codeIndicators[row.indicators.realizationSecondStage]}>{formatNumber(row.realization_sum_2)}</td>
                    <td>{formatNumber(row.return_sum)}</td>
                    <td className={codeIndicators[row.indicators.collectionAccountsReceivable]}>{formatNumber(row.debitor)}</td>
                    <td>{row.status_ip}</td>
                    <td>{row.sosp_code}</td>
                </>
            );
        } else if (pageKey === "DerivativeDebt" || pageKey === 'DerivativeDebtArchive') {
            return (
                <>
                    <td>{rowIndex + 1}</td>
                    <td>{row.kno}</td>
                    <td>{row.inn}</td>
                    <td className={(row.indicators.isUpdated) ?? codeIndicators.isUpdated}>{row.name}</td>
                    <td>{formatNumber(row.cur_debt)}</td>
                    <td>{formatNumber(row.post_sum)}</td>
                    <td>{row.category}</td>
                    <td className={(row.indicators.isLizingFNS) && codeIndicators.isLizingFNS}>{formatNumber(row.total_sum)}</td>
                    <td>{row.interaction_gmu}</td>
                    <td>{row.interaction_tno}</td>
                    <td className={codeIndicators[row.indicators.arrest]}>{formatNumber(row.arrest_sum)}</td>
                    <td>{row.securingArrest}</td>
                    <td className={codeIndicators[row.indicators.evaluation]}>{formatNumber(row.evaluation_sum)}</td>
                    <td className={codeIndicators[row.indicators.submitRealizationFirstStage]}>{formatNumber(row.realization_property_sum)}</td>
                    <td className={codeIndicators[row.indicators.submitRealizationSecondStage]}>{formatNumber(row.price_reduction_sum)}</td>
                    <td className={codeIndicators[row.indicators.realizationSecondStage]}>{formatNumber(row.realization_sum_2)}</td>
                    <td>{formatNumber(row.return_sum)}</td>
                    <td className={codeIndicators[row.indicators.collectionAccountsReceivable]}>{formatNumber(row.debitor)}</td>
                    <td>{row.status_ip}</td>
                    <td>{row.sosp_code}</td>
                </>
            );
        } else {
            return null;
        }
    };


    return (
        <Container>
            <MainContent>
                <StatusIndicators>
                    <div className="status not-executed">Не произведено</div>
                    <div className="status executed-with-violation">Произведено с нарушением</div>
                    <div className="status executed-on-time">Произведено в срок</div>
                    <div className="status in-search">В розыске</div>
                    <div className="status pledged-to-tax">Залог перед ФНС</div>
                    <div className="status data-updated">Данные обновлены за последние 7 дней</div>
                </StatusIndicators>
                <TableContainer>
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
                            <MemoizedRow
                                key={row.inn}
                                row={row}
                                rowIndex={rowIndex}
                                selectedInn={selectedInn}
                                handleInnSelect={handleInnSelect}
                                handleLink={handleLink}
                                renderTableCells={renderTableCells}
                                pageKey={pageKey}
                            />
                        ))}
                        </tbody>
                    </table>
                </TableContainer>
            </MainContent>
            <ButtonContainer>
                <StatsButton onClick={() => downloadStatistics(true)}>
                    <DownloadCloud size={18}/>
                    Статистика
                </StatsButton>

                <StatsButton onClick={() => downloadStatistics(false)}>
                    <DownloadCloud size={18}/>
                    Статистика по ИП
                </StatsButton>
            </ButtonContainer>
            <SnackbarProvider
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                maxSnack={1}
                autoHideDuration={5000}
            />
        </Container>
    );
};

const MemoizedRow = React.memo(({ row, rowIndex, selectedInn, handleInnSelect, handleLink, renderTableCells, pageKey }) => {
    return (
        <Tr key={rowIndex} isSelected={selectedInn.includes(row.inn)} cursor={true}
            onClick={event => handleLink(event, row.inn)}>
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
            {renderTableCells(row, rowIndex, pageKey)}
        </Tr>
    );
});
