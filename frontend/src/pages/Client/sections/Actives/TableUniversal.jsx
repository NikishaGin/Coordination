import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearActives, fetchGetActive, useActive, useLoadingStatus } from "../../../../store/active/activesSlice.js";
import { useRoleDetection } from "../../../../store/user/userSlice.js";
import { TableContent } from "./TableContent.jsx";
import { ActivesType } from "../../../../constants.js";
import { VariableSizeList } from "react-window";
import Snackbar from "./components/Snacbar.jsx";

import { Container, TableHeader } from "./components/table/TableStyles_1.js";
import { TableCell, TableWrapper } from "./components/table/TableStyles.js";
import { TableRow } from "@mui/material";
import { CustomCheckbox } from "./components/inputs/CustomCheckbox.jsx";





export default memo(({ type }) => {
    const dispatch = useDispatch();

    const data = useActive(type);
    const status = useLoadingStatus();
    const { isAdmin } = useRoleDetection();

    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const rowHeightsRef = useRef({});
    const defaultHeight = 60;
    const listRef = useRef(null);
    const headerRef = useRef(null);
    const bodyRef = useRef(null);


    useEffect(() => {
        return () => {
            dispatch(clearActives());
        };
    }, [dispatch]);



    useEffect(() => {
        console.log('!!!!!!!!!!!!!!!!!!!')
        if ((!data || data.length === 0) && status === 'idle') {
            dispatch(fetchGetActive(type));
        }
    }, [dispatch, data, type, status]);






    useEffect(() => {
        const bodyContainer = bodyRef.current;
        const headerContainer = headerRef.current;
        if (!bodyContainer || !headerContainer) return;
        const handleScroll = () => {
            headerContainer.scrollLeft = bodyContainer.scrollLeft;
        };
        bodyContainer.addEventListener('scroll', handleScroll);
        return () => {
            bodyContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const onSaveValue = (key, transform) => value => {
        console.log("onSaveValue");
    }

    const active = type === ActivesType.GROUND ? ActivesType.PROPERTY : type;
    const { tableFields, addActive }  = TableContent[active];
    const fields = tableFields(isAdmin, onSaveValue);


    const tableHeader = useMemo(() => {
        return (
            <TableHeader ref={headerRef}>
                <tr>
                    <th></th>
                    {
                        fields.map(({ headerName }, index) => (
                            <th key={index}>{headerName}</th>
                        ))
                    }
                </tr>
            </TableHeader>
        )
    }, [type]);



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


    const getListHeight = () => {
        const containerHeight = document.querySelector('.table-container')?.clientHeight;
        return containerHeight ? containerHeight - 48 : 400;
    };




    const RowRenderer = useCallback(({ index, style }) => {
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
                <TableRow>

                    <TableCell>
                        <CustomCheckbox>
                            <input
                                type="checkbox"
                                // checked={activeRow}
                                // onChange={setActiveRow}
                            />
                            <span></span>
                        </CustomCheckbox>
                    </TableCell>
                    {fields.map(({ field }) => field(row))}
                </TableRow>
            </div>
        );
    }, [data, onSaveValue, setRowHeight]);















    return (
        <>
            <Container className={`table-container ${type}`} withButton={!!addActive && isAdmin}>
                <TableWrapper>
                    {status === 'loading' ? (
                        'Загрузка...'
                    ) : data && data.length > 0 ? (
                        <>
                            <div className="scroll-container" ref={bodyRef} onScroll={(e) => {
                                if (headerRef.current) {
                                    headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
                                }
                            }}>
                                <div className="inner-scroll" style={{ minWidth: '1300px' }}>
                                    {tableHeader}
                                    <VariableSizeList
                                        ref={listRef}
                                        height={getListHeight()}
                                        itemCount={data.length}
                                        itemSize={getRowHeight}
                                        width="100%"
                                        className="virtual-table-body"
                                    >
                                        {RowRenderer}
                                    </VariableSizeList>
                                </div>
                            </div>
                        </>
                    ) : (
                        'Данные отсутствуют'
                    )}
                </TableWrapper>
            </Container>
            {(!!addActive && isAdmin) && addActive}
            <Snackbar
                message="Данные успешно сохранены!"
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
        </>
    );
});
