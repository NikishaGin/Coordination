import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {Container, TableWrapper, TableHeader, Table2} from './TableStyles';
import { clearActives, fetchActives, updateActiveField, updateActiveThunk } from "../../store/activesSlice.js";
import Snackbar from "./Snacbar.jsx";
import { VariableSizeList } from 'react-window';


const TableUniversal = ({ type, headers, selectorKey, RowComponent, Button }) => {
    const { inn } = useParams();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.actives[selectorKey]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const status = useSelector((state) => state.actives.status[selectorKey]);

    const rowHeightsRef = useRef({});
    const defaultHeight = 60;
    const listRef = useRef(null);
    const headerRef = useRef(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        return () => {
            dispatch(clearActives());
        };
    }, [dispatch, inn]);

    useEffect(() => {
        if ((!data || data.length === 0) && status === 'idle') {
            dispatch(fetchActives({ inn, type }));
        }
    }, [inn, dispatch, data, type, status]);

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

    const handleValueChange = useCallback(async (id, field, newValue) => {
        const updatedRow = { [field]: newValue };
        try {
            const response = await dispatch(updateActiveThunk({ id, type, inn, updatedRow })).unwrap();
            dispatch(updateActiveField({ id, field, value: newValue, type }));
            if (response) {
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
        }
    }, [dispatch, type, inn]);

    const tableHeaders = useMemo(() => {
        return headers.map((header, i) => (
            <th key={i}>{header}</th>
        ));
    }, [headers]);

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

    const RowRenderer = useCallback(({ index, style }) => {
        const row = data[index];
        const rowRef = useRef(null);

        useEffect(() => {
            if (rowRef.current) {
                const height = rowRef.current.getBoundingClientRect().height;
                setRowHeight(index, Math.max(height, defaultHeight));
            }
        }, [index, row]);

        return (
            <div
                ref={rowRef}
                style={{
                    ...style,
                    display: 'table',
                    tableLayout: 'fixed',
                    width: '100%',
                    minWidth: '1300px',
                    borderBottom: '1px solid #333',
                    backgroundColor: index % 2 === 0 ? '#1e1e30' : 'transparent'
                }}
                className="virtual-row"
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a50';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1e1e30' : 'transparent';
                }}
            >
                <RowComponent
                    row={row}
                    onValueChange={handleValueChange}
                />
            </div>
        );
    }, [data, handleValueChange, setRowHeight]);

    const getListHeight = () => {
        const containerHeight = document.querySelector('.table-container')?.clientHeight;
        return containerHeight ? containerHeight - 48 : 400;
    };

    return (
        <>
            <Container className="table-container">
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
                                    <Table2>
                                        <TableHeader ref={headerRef}>
                                            <tr>{tableHeaders}</tr>
                                        </TableHeader>
                                    </Table2>
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
            {Button}
            <Snackbar
                message="Данные успешно сохранены!"
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
        </>
    );
};

export default React.memo(TableUniversal);


// const TableUniversal = ({type, headers, selectorKey, RowComponent, Button}) => {
//     const {inn} = useParams();
//     const dispatch = useDispatch();
//     const data = useSelector((state) => state.actives[selectorKey]);
//     const [snackbarVisible, setSnackbarVisible] = useState(false);
//
//     const status = useSelector((state) => state.actives.status[selectorKey]);
//
//     useEffect(() => {
//         return () => {
//             dispatch(clearActives());
//         };
//     }, [dispatch, inn]);
//
//     useEffect(() => {
//         if ((!data || data.length === 0) && status === 'idle') {
//             dispatch(fetchActives({inn, type}));
//         }
//     }, [inn, dispatch, data, type, status]);
//
//     const handleValueChange = useCallback(async (id, field, newValue) => {
//         const updatedRow = { [field]: newValue };
//         try {
//             const response = await dispatch(updateActiveThunk({ id, type, inn, updatedRow })).unwrap();
//             dispatch(updateActiveField({ id, field, value: newValue, type }));
//             if (response) {
//                 setSnackbarVisible(true);
//             }
//         } catch (error) {
//             console.error("Ошибка при обновлении:", error);
//         }
//     }, [dispatch, type, inn]);
//
//
//     const tableHeaders = useMemo(() => {
//         return headers.map((header, i) => (
//             <th key={i}>{header}</th>
//         ));
//     }, [headers]);
//
//
//     // Оптимизированный рендеринг строк
//     const renderRows = useMemo(() => {
//         return data.map((row) => (
//             <RowComponent
//                 key={row.id}
//                 row={row}
//                 onValueChange={handleValueChange}
//             />
//         ));
//     }, [data, handleValueChange]);
//
//     return (
//         <>
//             <Container>
//                 <TableWrapper>
//                     {status === 'loading' ? (
//                         'Загрузка...'
//                     ) : data && data.length > 0 ? (
//                         <Table>
//                             <TableHeader>
//                                 <tr>{tableHeaders}</tr>
//                             </TableHeader>
//                             <tbody>{renderRows}</tbody>
//                         </Table>
//                     ) : (
//                         'Данные отсутствуют'
//                     )}
//                 </TableWrapper>
//             </Container>
//             {
//                 Button && <ButtonBox>
//                     <AddOtherAssetsButton titleBtn={'Добавить иные активы'}/>
//                 </ButtonBox>
//             }
//             <Snackbar
//                 message="Данные успешно сохранены!"
//                 visible={snackbarVisible}
//                 onClose={() => setSnackbarVisible(false)}
//             />
//         </>
//     );
// };
//
// export default React.memo(TableUniversal);



// const handleValueChange = async (id, field, newValue) => {
//     const updatedRow = { [field]: newValue };
//     try {
//         const response = await dispatch(updateActiveThunk({ id, type, inn, updatedRow })).unwrap();
//         dispatch(updateActiveField({ id, field, value: newValue, type }));
//         if (response) {
//             setSnackbarVisible(true);
//         }
//     } catch (error) {
//         console.error("Ошибка при обновлении:", error);
//     }
// };




// useEffect(() => {
//     if (!data || data.length === 0) {
//         dispatch(fetchActives({inn, type: type}));
//     }
// }, [inn, dispatch, data, type]);






















// const TableUniversal = ({ type, headers, selectorKey, RowComponent, Button }) => {
//     const { inn } = useParams();
//     const dispatch = useDispatch();
//     const data = useSelector((state) => state.actives[selectorKey]);
//     const [snackbarVisible, setSnackbarVisible] = useState(false);
//     const status = useSelector((state) => state.actives.status[selectorKey]);
//
//     const rowHeightsRef = useRef({});
//     const defaultHeight = 60;
//     const listRef = useRef(null);
//
//     useEffect(() => {
//         return () => {
//             dispatch(clearActives());
//         };
//     }, [dispatch, inn]);
//
//     useEffect(() => {
//         if ((!data || data.length === 0) && status === 'idle') {
//             dispatch(fetchActives({ inn, type }));
//         }
//     }, [inn, dispatch, data, type, status]);
//
//     const handleValueChange = useCallback(async (id, field, newValue) => {
//         const updatedRow = { [field]: newValue };
//         try {
//             const response = await dispatch(updateActiveThunk({ id, type, inn, updatedRow })).unwrap();
//             dispatch(updateActiveField({ id, field, value: newValue, type }));
//             if (response) {
//                 setSnackbarVisible(true);
//             }
//         } catch (error) {
//             console.error("Ошибка при обновлении:", error);
//         }
//     }, [dispatch, type, inn]);
//
//     const tableHeaders = useMemo(() => {
//         return headers.map((header, i) => (
//             <th key={i}>{header}</th>
//         ));
//     }, [headers]);
//
//     const getRowHeight = useCallback((index) => {
//         return rowHeightsRef.current[index] || defaultHeight;
//     }, []);
//
//     const setRowHeight = useCallback((index, height) => {
//         if (rowHeightsRef.current[index] !== height) {
//             rowHeightsRef.current[index] = height;
//             if (listRef.current) {
//                 listRef.current.resetAfterIndex(index);
//             }
//         }
//     }, []);
//
//     const RowRenderer = useCallback(({ index, style }) => {
//         const row = data[index];
//         const rowRef = useRef(null);
//
//         useEffect(() => {
//             if (rowRef.current) {
//                 const height = rowRef.current.getBoundingClientRect().height;
//                 setRowHeight(index, Math.max(height, defaultHeight));
//             }
//         }, [index, row]);
//
//         return (
//             <div
//                 ref={rowRef}
//                 style={{
//                     ...style,
//                     display: 'table',
//                     tableLayout: 'fixed',
//                     width: '100%',
//                     minWidth: '1300px',
//                     borderBottom: '1px solid #333',
//                     backgroundColor: index % 2 === 0 ? '#1e1e30' : 'transparent'
//                 }}
//                 className="virtual-row"
//                 onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = '#2a2a50';
//                 }}
//                 onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1e1e30' : 'transparent';
//                 }}
//             >
//                 <RowComponent
//                     row={row}
//                     onValueChange={handleValueChange}
//                 />
//             </div>
//         );
//     }, [data, handleValueChange, setRowHeight]);
//
//     const getListHeight = () => {
//         const containerHeight = document.querySelector('.table-container')?.clientHeight;
//         return containerHeight ? containerHeight - 48 : 400;
//     };
//
//     return (
//         <>
//             <Container className="table-container">
//                 <TableWrapper>
//                     {status === 'loading' ? (
//                         'Загрузка...'
//                     ) : data && data.length > 0 ? (
//                         <>
//                             <Table>
//                                 <TableHeader>
//                                     <tr>{tableHeaders}</tr>
//                                 </TableHeader>
//                             </Table>
//                             <VariableSizeList
//                                 ref={listRef}
//                                 height={getListHeight()}
//                                 itemCount={data.length}
//                                 itemSize={getRowHeight}
//                                 width="100%"
//                                 className="virtual-table-body"
//                                 style={{
//                                     overflow: 'auto',
//                                     minWidth: '1300px'
//                                 }}
//                             >
//                                 {RowRenderer}
//                             </VariableSizeList>
//                         </>
//                     ) : (
//                         'Данные отсутствуют'
//                     )}
//                 </TableWrapper>
//             </Container>
//             {Button && (
//                 <ButtonBox>
//                     <AddOtherAssetsButton titleBtn={'Добавить иные активы'}/>
//                 </ButtonBox>
//             )}
//             <Snackbar
//                 message="Данные успешно сохранены!"
//                 visible={snackbarVisible}
//                 onClose={() => setSnackbarVisible(false)}
//             />
//         </>
//     );
// };
//
// export default React.memo(TableUniversal);

// const TableUniversal = ({ type, headers, selectorKey, RowComponent, Button }) => {
//     const { inn } = useParams();
//     const dispatch = useDispatch();
//     const data = useSelector((state) => state.actives[selectorKey]);
//     const [snackbarVisible, setSnackbarVisible] = useState(false);
//
//     const status = useSelector((state) => state.actives.status[selectorKey]);
//
//     // Calculate row height based on padding and content
//     const ROW_HEIGHT = 60; // 12px padding top + 12px padding bottom + 20px content height
//
//     useEffect(() => {
//         return () => {
//             dispatch(clearActives());
//         };
//     }, [dispatch, inn]);
//
//     useEffect(() => {
//         if ((!data || data.length === 0) && status === 'idle') {
//             dispatch(fetchActives({ inn, type }));
//         }
//     }, [inn, dispatch, data, type, status]);
//
//     const handleValueChange = useCallback(async (id, field, newValue) => {
//         const updatedRow = { [field]: newValue };
//         try {
//             const response = await dispatch(updateActiveThunk({ id, type, inn, updatedRow })).unwrap();
//             dispatch(updateActiveField({ id, field, value: newValue, type }));
//             if (response) {
//                 setSnackbarVisible(true);
//             }
//         } catch (error) {
//             console.error("Ошибка при обновлении:", error);
//         }
//     }, [dispatch, type, inn]);
//
//     const tableHeaders = useMemo(() => {
//         return headers.map((header, i) => (
//             <th key={i}>{header}</th>
//         ));
//     }, [headers]);
//
//     // Row renderer function for react-window
//     const RowRenderer = useCallback(({ index, style }) => {
//         const row = data[index];
//         return (
//             <div
//                 style={{
//                     ...style,
//                     display: 'table',
//                     tableLayout: 'fixed',
//                     width: '100%',
//                     minWidth: '1300px',
//                     borderBottom: '1px solid #333',
//                     backgroundColor: index % 2 === 0 ? '#1e1e30' : 'transparent'
//                 }}
//                 className="virtual-row"
//                 onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = '#2a2a50';
//                 }}
//                 onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1e1e30' : 'transparent';
//                 }}
//             >
//                 <RowComponent
//                     row={row}
//                     onValueChange={handleValueChange}
//                 />
//             </div>
//         );
//     }, [data, handleValueChange]);
//
//     // Calculate the total height for the virtualized list
//     const getListHeight = () => {
//         const containerHeight = document.querySelector('.table-container')?.clientHeight;
//         return containerHeight ? containerHeight - 48 : 400; // Subtract header height
//     };
//
//     return (
//         <>
//             <Container className="table-container">
//                 <TableWrapper>
//                     {status === 'loading' ? (
//                         'Загрузка...'
//                     ) : data && data.length > 0 ? (
//                         <>
//                             <Table>
//                                 <TableHeader>
//                                     <tr>{tableHeaders}</tr>
//                                 </TableHeader>
//                             </Table>
//                             <List
//                                 height={getListHeight()}
//                                 itemCount={data.length}
//                                 itemSize={ROW_HEIGHT}
//                                 width="100%"
//                                 className="virtual-table-body"
//                                 style={{
//                                     overflow: 'auto',
//                                     minWidth: '1300px'
//                                 }}
//                             >
//                                 {RowRenderer}
//                             </List>
//                         </>
//                     ) : (
//                         'Данные отсутствуют'
//                     )}
//                 </TableWrapper>
//             </Container>
//             {Button && (
//                 <ButtonBox>
//                     <AddOtherAssetsButton titleBtn={'Добавить иные активы'}/>
//                 </ButtonBox>
//             )}
//             <Snackbar
//                 message="Данные успешно сохранены!"
//                 visible={snackbarVisible}
//                 onClose={() => setSnackbarVisible(false)}
//             />
//         </>
//     );
// };
//
// export default React.memo(TableUniversal);