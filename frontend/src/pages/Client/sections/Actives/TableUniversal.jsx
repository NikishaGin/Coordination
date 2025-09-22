import React, { memo, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { clearActives, fetchGetActive, useActive, useLoadingStatus } from "../../../../store/active/activesSlice.js";
import { useRoleDetection } from "../../../../store/user/userSlice.js";
import { TableContent } from "./TableContent.jsx";
import { ActivesType } from "../../../../constants.js";



export default memo(({ type }) => {
    const dispatch = useDispatch();

    const data = useActive();
    const status = useLoadingStatus();
    const { isAdmin } = useRoleDetection();


    const onSaveValue = () => {}


    const { tableFields, addActive }  = TableContent[type === ActivesType.GROUND ? ActivesType.PROPERTY : type];
    const fields = tableFields(isAdmin, onSaveValue);
    const tableHeaders = useMemo(() => {
        return fields.map(({ headerName }) => {

        })
    }, [type]);





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








    return (
        <>{tableHeaders}</>
    )
});
