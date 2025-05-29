import React, {useEffect, useMemo} from 'react';
import {useParams} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {Container, TableWrapper, Table, TableHeader} from './TableStyles';
import {fetchActives, updateActiveField, updateActiveThunk} from "../../store/activesSlice.js";
import styled from "styled-components";
import {AddOtherAssetsButton} from "./sections/Actives/AddOtherAssetsButton.jsx";

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

    console.log('dataUnisersol', data)

    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(fetchActives({inn, type: type}));
        }
    }, [inn, dispatch, data, type]);

    const handleValueChange = (id, field, newValue) => {
        const updatedRow = {[field]: newValue};

        dispatch(updateActiveThunk({id, type, inn, updatedRow}));
        dispatch(updateActiveField({id, field, value: newValue, type}));
    };

    const tableHeaders = useMemo(() => {
        return headers.map((header, i) => (
            <th key={i}>{header}</th>
        ));
    }, [headers]);

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
                        {data.map((row) => {
                            return (
                                <RowComponent
                                    key={row.id}
                                    row={row}
                                    onValueChange={handleValueChange}
                                />
                            );
                        })}
                        </tbody>
                    </Table>
                </TableWrapper>
            </Container>
            {
                Button && <ButtonBox>
                    <AddOtherAssetsButton titleBtn={'Добавить иные активы'}/>
                </ButtonBox>
            }
        </>
    );
};

export default React.memo(TableUniversal);
