/*

import React, {useEffect, useState} from 'react';
import {formatDate, formatNumber} from "../../../../utils/formatData.js";
import styled from "styled-components";
import {activesAPI} from "../../../../api/index.js";
import {useParams} from "react-router";
import { useSelector } from "react-redux";

const Container = styled.div`
  height: calc(100vh - 300px);
  background-color: #171722;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  &::-webkit-scrollbar-thumb {
    background: #2a2a4a;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  position: sticky;
  top: 0;  
  background-color: #2a2a40;

  th {
    padding: 12px 15px;
    text-align: left;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #333;
  transition: background-color 0.2s ease;

  &:nth-child(even) {
    background-color: #1e1e30;
  }

  &:hover {
    background-color: #2a2a50;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  color: #e0e0e0;
`;

const NumberCell = styled(TableCell)`
  text-align: right;
  font-family: 'Inter', monospace;
  color: #a0d0ff;
`;

const DateCell = styled(TableCell)`
  color: #c0c0c0;
`;

export const TableResolutions = () => {

    const {inn} = useParams();
    const pageKey = useSelector((state) => state.global.pageKey);

    const [resolutions, setResolutions] = useState([])

    useEffect(() => {
        activesAPI.getResolutions(inn, pageKey).then(data => setResolutions(data.data)).catch(console.log)
    }, [])

    return (
        <Container>
            <TableWrapper>
                <Table>
                    <TableHeader>
                        <tr>
                            <th>Номер постановления по статье 47 НК РФ</th>
                            <th>Дата постановления по статье 47 НК РФ</th>
                            <th>Сумма постановления по статье 47 НК РФ, ₽</th>
                            <th>Текущий остаток постановления по статье 47 НК РФ, ₽</th>
                            <th>Номер исполнительного производства</th>
                            <th>Дата возбуждения исполнительного производства</th>
                        </tr>
                    </TableHeader>
                    <tbody>
                    {resolutions.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell>{data.resolutions_number}</TableCell>
                            <DateCell>{formatDate(data.resolutions_date)}</DateCell>
                            <NumberCell>{formatNumber(data.resolutions_sum)}</NumberCell>
                            <NumberCell>{formatNumber(data.cur_debt)}</NumberCell>
                            <TableCell>{data.exec_number}</TableCell>
                            <DateCell>{formatDate(data.exec_date)}</DateCell>
                        </TableRow>
                    ))}
                    </tbody>
                </Table>
            </TableWrapper>
        </Container>
    );
};

 */


import React, { useState, useEffect, useRef, useCallback } from 'react';



export const TableResolutions = () => {
    // Ссылки на DOM-элементы
    const containerA = useRef(null);
    const containerB = useRef(null);

    // Высота заглушки для первого контейнера
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    // Флаг блокировки для избежания рекурсии
    const isScrolling = useRef(false);

    // Обновление высоты заглушки при изменении контента
    useEffect(() => {
        if (!containerB.current) return;

        const updateHeight = () => {
            if (containerB.current) {
                setPlaceholderHeight(containerB.current.scrollHeight);
            }
        };

        // Инициализация высоты
        updateHeight();

        // Следим за изменениями контента во втором контейнере
        const resizeObserver = new ResizeObserver(updateHeight);
        if (containerB.current) resizeObserver.observe(containerB.current);

        return () => resizeObserver.disconnect();
    }, []);




    // Обработчик скролла для первого контейнера
    const handleScrollA = useCallback(() => {
        if (isScrolling.current || !containerA.current || !containerB.current) return;

        isScrolling.current = true;

        const { scrollTop, clientHeight } = containerA.current;
        const scrollableHeight = placeholderHeight - clientHeight;
        const scrollPercent = scrollableHeight > 0
            ? scrollTop / scrollableHeight
            : 0;

        // Применяем процент ко второму контейнеру
        containerB.current.scrollTop = scrollPercent *
            (containerB.current.scrollHeight - containerB.current.clientHeight);

        // Снимаем блокировку после обновления DOM
        requestAnimationFrame(() => { isScrolling.current = false; });
    }, [placeholderHeight]);




    // Обработчик скролла для второго контейнера
    const handleScrollB = useCallback(() => {
        if (isScrolling.current || !containerA.current || !containerB.current) return;

        isScrolling.current = true;

        const { scrollTop, scrollHeight, clientHeight } = containerB.current;
        const scrollableHeight = scrollHeight - clientHeight;
        const scrollPercent = scrollableHeight > 0
            ? scrollTop / scrollableHeight
            : 0;

        // Применяем процент к первому контейнеру
        containerA.current.scrollTop = scrollPercent *
            (placeholderHeight - containerA.current.clientHeight);

        requestAnimationFrame(() => { isScrolling.current = false; });
    }, [placeholderHeight]);

    // Подписка на события скролла
    useEffect(() => {
        const nodeA = containerA.current;
        const nodeB = containerB.current;

        if (nodeA && nodeB) {
            nodeA.addEventListener('scroll', handleScrollA);
            nodeB.addEventListener('scroll', handleScrollB);
        }

        return () => {
            if (nodeA) nodeA.removeEventListener('scroll', handleScrollA);
            if (nodeB) nodeB.removeEventListener('scroll', handleScrollB);
        };
    }, [handleScrollA, handleScrollB]);

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Контейнер A (синхронизированная полоса прокрутки) */}
            <div
                ref={containerA}
                style={{
                    height: '600px',
                    overflowY: 'scroll',
                    border: '1px solid #ccc',
                    flex: 1
                }}
            >
                {/* Заглушка с высотой контента из контейнера B */}
                <div style={{ height: `${placeholderHeight}px` }} />
            </div>

            {/* Контейнер B (реальный контент) */}
            <div
                ref={containerB}
                style={{
                    height: '400px',
                    overflowY: 'scroll',
                    border: '1px solid #ccc',
                    flex: 1
                }}
            >
                {[...Array(100)].map((_, i) => (
                    <div key={i} style={{ padding: '10px' }}>
                        Элемент {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};
