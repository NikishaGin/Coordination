import React, {useState, useEffect, useMemo} from "react";
import {useLocation, useNavigate} from "react-router";
import { useDispatch } from "react-redux";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { DownloadCloud } from 'lucide-react';
import styled from "styled-components";
import { TableContainer, Tr } from "../tables/Table.jsx";
import { ButtonContainer } from "../buttons/Button.jsx";
import {
    useFilteredClients,
    usePageMeta,
    useSelectedRegionId,
    pageDetection,
    fetchGetClients,
} from "../../store/main/mainSlice.js";
import {formatNumber } from "../../utils/formatData.js"
import { DownloadAPI } from "../../store/API.js";
import { downloadExcel } from "../../utils/downloadExcel.js"



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

const StatusIndicators = styled.div`
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
    "Розыск имущества, ₽",
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
    "Розыск имущества, ₽",
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
    isLeasing: "status pledged-to-tax",
    isUpdated: "status data-updated"
}



export const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedClientId, setSelectedClientId] = useState([]);

    const { isDerived, isArchived } = usePageMeta();
    const selectedRegionId = useSelectedRegionId();
    const filteredData = useFilteredClients();


    useEffect(() => {
        dispatch(pageDetection(location.pathname));
    }, [dispatch, location.pathname]);

    useEffect(() => {
        if (selectedRegionId)
            dispatch(fetchGetClients());
    }, [dispatch, isDerived, isArchived, selectedRegionId]);


    const headings = useMemo(
        () => !isDerived ? headingsCoordination : headingsDerivative,
        [isDerived]
    );

    const handleSelectAllClients = event => {
        if (event.target.checked)
            setSelectedClientId(filteredData.map(item => item.id));
        else
            setSelectedClientId([]);
    };


    const handleSelectClient = (event, id) => {
        if (event.target.checked)
            setSelectedClientId([...selectedClientId, id]);
        else
            setSelectedClientId(selectedClientId.filter(value => value !== id));
    };


    const handleLink = (event, id) => {
        if (event.target.type === 'checkbox') return;
        navigate(`/client/${id}`)
    }


    const downloadStatistics = async target => {
        if (!selectedClientId.length > 0) {
            enqueueSnackbar("Выберете регион и строки, которые необходимо включить в статистику", { variant: "info" })
            return
        }
        try {
            enqueueSnackbar("Начало загрузки...", { variant: "info" });
            const data = { isDerived, isArchived, clientIds: selectedClientId };
            const response = await target(data);
            downloadExcel(response);
            enqueueSnackbar("Загружено", { variant: "info" });
        } catch (error) {
            console.log(error);
            enqueueSnackbar("Ошибка загрузки файла", { variant: "error" });
        }
    };

    const renderTableCells = (row, rowIndex, isDerived) => {
        if (!isDerived)
            return (
                <>
                    <td>{rowIndex + 1}</td>
                    <td>{row.tno?.CodeTNO}</td>
                    <td>{row.inn}</td>
                    <td className={(row.indicators.isUpdated) && codeIndicators.isUpdated}>{row.name}</td>
                    <td>{formatNumber(row.amounts?.resolution?.amount, { defaultValue: 0 })}</td>
                    <td>{formatNumber(row.amounts?.resolution?.balance, { defaultValue: 0 })}</td>
                    <td>{row.category.category}</td>
                    <td className={(row.indicators.isLeasing) && codeIndicators.isLeasing}>{formatNumber(row.amounts?.actives?.totalSum, { defaultValue: 0 })}</td>
                    <td>{row.interaction.GMU}</td>
                    <td>{row.interaction.TNO}</td>
                    <td className={codeIndicators[row.indicators?.arrest]}>{formatNumber(row.amounts?.actives?.arrest, { defaultValue: 0 })}</td>
                    <td>{row.securingArrest}</td>
                    <td className={codeIndicators[row.indicators?.evaluation]}>{formatNumber(row.amounts?.actives?.wanted, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.evaluation]}>{formatNumber(row.amounts?.actives?.evaluation, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.submitRealizationFirstStage]}>{formatNumber(row.amounts?.actives?.realizationFirst, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.submitRealizationSecondStage]}>{formatNumber(row.amounts?.actives?.realizationSecond, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.realizationSecondStage]}>{formatNumber(row.amounts?.actives?.realizationResult, { defaultValue: 0 })}</td>
                    <td>{formatNumber(row.amounts?.actives?.refundProperty, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.collectionAccountsReceivable]}>{formatNumber(row.amounts?.actives?.debitForeclosure, { defaultValue: 0 })}</td>
                    <td>{row.statusIP}</td>
                    <td>{row.sosp?.CodeSOSP}</td>
                </>
            );
        else
            return (
                <>
                    <td>{rowIndex + 1}</td>
                    <td>{row.tno?.CodeTNO}</td>
                    <td>{row.inn}</td>
                    <td className={(row.indicators.isUpdated) ?? codeIndicators.isUpdated}>{row.name}</td>
                    <td>{formatNumber(row.resolution?.amount, { defaultValue: 0 })}</td>
                    <td>{formatNumber(row.resolution?.balance, { defaultValue: 0 })}</td>
                    <td>{row.category.category}</td>
                    <td className={(row.indicators.isLeasing) && codeIndicators.isLeasing}>{formatNumber(row.amounts?.actives?.totalSum, { defaultValue: 0 })}</td>
                    <td>{row.interaction.GMU}</td>
                    <td>{row.interaction.TNO}</td>
                    <td className={codeIndicators[row.indicators?.arrest]}>{formatNumber(row.amounts?.actives?.arrest, { defaultValue: 0 })}</td>
                    <td>{row.securingArrest}</td>
                    <td className={codeIndicators[row.indicators?.evaluation]}>{formatNumber(row.amounts?.actives?.wanted, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.evaluation]}>{formatNumber(row.amounts?.actives?.evaluation, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.submitRealizationFirstStage]}>{formatNumber(row.amounts?.actives?.realizationFirst, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.submitRealizationSecondStage]}>{formatNumber(row.amounts?.actives?.realizationSecond, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.realizationSecondStage]}>{formatNumber(row.amounts?.actives?.realizationResult, { defaultValue: 0 })}</td>
                    <td>{formatNumber(row.amounts?.actives?.refundProperty, { defaultValue: 0 })}</td>
                    <td className={codeIndicators[row.indicators?.collectionAccountsReceivable]}>{formatNumber(row.amounts?.actives?.debitForeclosure, { defaultValue: 0 })}</td>
                    <td>{row.statusIP}</td>
                    <td>{row.sosp?.CodeSOSP}</td>
                </>
            );
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
                                        checked={(selectedClientId.length === filteredData.length) && (filteredData.length > 0)}
                                        onChange={handleSelectAllClients}
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
                                selectedClientId={selectedClientId}
                                handleSelectClient={handleSelectClient}
                                handleLink={handleLink}
                                renderTableCells={renderTableCells}
                                isDerived={isDerived}
                            />
                        ))}
                        </tbody>
                    </table>
                </TableContainer>
            </MainContent>
            <ButtonContainer>
                <StatsButton onClick={() => downloadStatistics(DownloadAPI.getCommonStatistics)}>
                    <DownloadCloud size={18}/>
                    Статистика
                </StatsButton>

                <StatsButton onClick={() => downloadStatistics(DownloadAPI.getResolutionsStatistics)}>
                    <DownloadCloud size={18}/>
                    Статистика по ИП
                </StatsButton>

                <StatsButton onClick={() => downloadStatistics(DownloadAPI.getActivesStatistics)}>
                    <DownloadCloud size={18}/>
                    Статистика НП
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

const MemoizedRow = React.memo(({ row, rowIndex, selectedClientId, handleSelectClient, handleLink, renderTableCells, isDerived }) => {
    return (
        <Tr key={rowIndex} isSelected={selectedClientId.includes(row.id)} cursor={true}
            onClick={event => handleLink(event, row.id)}>
            <td onClick={event => event.stopPropagation()}>
                <CustomCheckbox>
                    <input
                        type="checkbox"
                        checked={selectedClientId.includes(row.id)}
                        onChange={event => handleSelectClient(event, row.id)}
                    />
                    <span></span>
                </CustomCheckbox>
            </td>
            {renderTableCells(row, rowIndex, isDerived)}
        </Tr>
    );
});
