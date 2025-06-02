import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {Container, TableWrapper, Table, TableHeader} from './TableStyles';
import {fetchActives, updateActiveField, updateActiveThunk} from "../../store/activesSlice.js";
import styled from "styled-components";
import {AddOtherAssetsButton} from "./sections/Actives/AddOtherAssetsButton.jsx";
import Snackbar from "./Snacbar.jsx";
import LinearColor from "../../LinearColor.jsx";

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 16px;
  position: sticky;
  bottom: 0;
  z-index: 2;
`;

const TableUniversal = ({type, headers, selectorKey, RowComponent, Button}) => {
    const {inn} = useParams();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.actives[selectorKey]);

    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(fetchActives({inn, type: type}));
        }
    }, [inn, dispatch, data, type]);

    const handleValueChange = async (id, field, newValue) => {
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
    };

    const tableHeaders = useMemo(() => {
        return headers.map((header, i) => (
            <th key={i}>{header}</th>
        ));
    }, [headers]);


    // Оптимизированный рендеринг строк
    const renderRows = useMemo(() => {
        return data.map((row) => (
            <RowComponent
                key={row.id}
                row={row}
                onValueChange={handleValueChange}
            />
        ));
    }, [data, handleValueChange]);

    return (
        <>
            <Container>
                <TableWrapper>
                    <Table>
                        <TableHeader>
                            <tr>
                                {tableHeaders}
                            </tr>
                        </TableHeader>
                        <tbody>
                        {renderRows}
                        </tbody>
                    </Table>
                </TableWrapper>
            </Container>
            {
                Button && <ButtonBox>
                    <AddOtherAssetsButton titleBtn={'Добавить иные активы'}/>
                </ButtonBox>
            }
            <Snackbar
                message="Данные успешно сохранены!"
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
        </>
    );
};

export default React.memo(TableUniversal);
