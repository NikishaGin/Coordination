import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { VariableSizeList } from 'react-window';
import { Container, TableHeader } from './TableStyles.js';
import Snackbar from "../Snacbar.jsx";
import {
    clearActives,
    fetchGetActive,
    useActive,
    useLoadingStatus
} from "../../../../../../store/active/activesSlice.js";
import {useRoleDetection} from "../../../../../../store/user/userSlice.js";



const TableUniversal = ({type, headers, RowComponent, Button}) => {
    const dispatch = useDispatch();

    const data = useActive();
    const status = useLoadingStatus();
    const { isAdmin } = useRoleDetection();

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const rowHeightsRef = useRef({});
    const defaultHeight = 60;

    const widthList = useRef(400);
    const heightList = useRef(400);

    const containerRef = useRef(null);
    const tableRef = useRef(null);
    const listRef = useRef(null);
    const headerRef = useRef(null);



    useEffect(() => {
        return () => {
            dispatch(clearActives());
        };
    }, [dispatch]);


    useEffect(() => {
        if ((!data || data.length === 0) && status === 'idle') {
            dispatch(fetchGetActive(type));
        }
    }, [dispatch, data, type, status]);


    useEffect(() => {
        if (!containerRef.current || !tableRef.current || !headerRef.current) return;
        widthList.current = tableRef.current?.scrollWidth
        heightList.current = (containerRef.current?.clientHeight ?? 400) - (headerRef.current?.clientHeight ?? 72);
    }, [type])

    //
    // useEffect(() => {
    //     const bodyContainer = bodyRef.current;
    //     const headerContainer = headerRef.current;
    //
    //     if (!bodyContainer || !headerContainer) return;
    //
    //     const handleScroll = () => {
    //         headerContainer.scrollLeft = bodyContainer.scrollLeft;
    //     };
    //
    //     bodyContainer.addEventListener('scroll', handleScroll);
    //
    //     return () => {
    //         bodyContainer.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);



    const handleValueChange = useCallback(async (id, field, newValue) => {

        /*
        const updatedRow = {[field]: newValue};
        try {
            const response = await dispatch(updateActiveThunk({id, type, inn, updatedRow}))
            if (response) {
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
        }
         */

    }, [dispatch, type]);






    const tableHeaders = useMemo(() => (
        headers.map((header, i) => <th key={i}>{header}</th>)
    ), [headers]);


    const getRowHeight = useCallback((index) => {
        return rowHeightsRef.current[index] || defaultHeight;
    }, []);

    const setRowHeight = useCallback((index, height) => {
        if (rowHeightsRef.current[index] !== height) {
            rowHeightsRef.current[index] = height;
            if (listRef.current) {
                listRef.current.resetAfterIndex(index);
            }
        }
    }, []);


    const RowRenderer = useCallback(({index, style}) => {
        const row = data[index];
        const rowRef = useRef(null);

        const colorRow = (index % 2 === 0) ? '#1e1e30' : 'transparent'

        useEffect(() => {
            if (rowRef.current) {
                const height = rowRef.current.getBoundingClientRect().height;
                setRowHeight(index, Math.max(height, defaultHeight));
            }
        }, [index, row]);

        return (
            <div
                key={index}
                ref={rowRef}
                style={{
                    ...style,
                    display: 'table',
                    tableLayout: 'fixed',
                    width: '100%',
                    minWidth: '1300px',
                    borderBottom: '1px solid #333',
                    backgroundColor: colorRow
                }}
                className="virtual-row"
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a50';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorRow;
                }}
            >
                <RowComponent
                    row={row}
                    onValueChange={handleValueChange}
                />
            </div>
        );
    }, [data, handleValueChange, setRowHeight]);



    return (
        <>
            <Container
                className={type}
                style={{height: (isAdmin && !!Button) ? "calc(100vh - 360px)" : "calc(100vh - 320px)"}}
                ref={containerRef}
            >
                {
                    (status === 'loading') ? "Загрузка..."
                        : (data?.length === 0) ? "Данные отсутствуют"
                            : (
                                <div className="table-container" ref={tableRef}>
                                    <TableHeader ref={headerRef}>
                                        {tableHeaders}
                                    </TableHeader>
                                    <VariableSizeList
                                        ref={listRef}
                                        width={widthList.current}
                                        height={heightList.current}
                                        itemCount={data.length}
                                        itemSize={getRowHeight}
                                        className="virtual-table-body"
                                    >
                                        {RowRenderer}
                                    </VariableSizeList>
                                </div>
                            )
                }
            </Container>
            {(isAdmin && !!Button) && Button}
            <Snackbar
                message="Данные успешно сохранены!"
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
        </>
    );
};

export default React.memo(TableUniversal);