import React from "react";
import OtherAssetForm from "./components/modalForm/OtherAssetForm.jsx";
import { EditableCell } from "./components/inputs/EditableCell.jsx";
import { InputCell } from "./components/table/TableStyles.js";
import { ActivesType } from "../../../../constants.js";



export const TableContent = {
    [ActivesType.TRANSPORT]: {

        tableFields: [
            {
                key: "description.name",
                headerName: "Марка",
                field: (row) => (
                    <InputCell>
                        <EditableCell
                            value={row. || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            },
            {
                key: "description.vin",
                headerName: "VIN-номер",
                field: (row) => (
                    <InputCell>
                        <EditableCell
                            value={row. || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            },
            {
                key: "description.stateNumber",
                headerName: "Государственный номер",
                field: (row) => (
                    <InputCell>
                        <EditableCell
                            value={row. || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            },
            {
                key: "description.yearRelease",
                headerName: "Год выпуска",
                field: (row) => (
                    <InputCell>
                        <EditableCell
                            value={row. || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            },
            {
                key: "name",
                headerName: "Марка",
                field: (row) => (
                    <InputCell>
                        <EditableCell
                            value={row.name || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            },




        ],

    },
    [ActivesType.PROPERTY]: {},
    [ActivesType.GROUND]: {},
    [ActivesType.DEBIT]: {},
    [ActivesType.OTHER]: {

        tableFields: [
            {
                key: "id",
                headerName: "id",
                field: (
                    <InputCell>
                        <EditableCell
                            value={row.name || ''}
                            onSave={handleInputChange('name')}
                            isEditable={isAdmin}
                        />
                    </InputCell>
                )
            }
        ],


        addActive: <AddButton titleBtn="Добавить иные активы" Form={OtherAssetForm}/>
    },
}