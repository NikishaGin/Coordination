import React, { useState } from "react";
import { Sidebar, Main } from "../../Sidebar.jsx";
import Transport from "./subsections/Transport.jsx"
import Property from "./subsections/Property.jsx"
import Ground from "./subsections/Ground.jsx"
import DebtorIndebtedness from "./subsections/DebtorIndebtedness.jsx"
import Another from "./subsections/Another.jsx"



export default function () {
    const [selectedSubsection, setSelectedSubsection] = useState("Транспорт")

    return (
        <>
            <Sidebar
                subsections={["Транспорт", "Недвижимость", "Земельные участки", "Дебиторская задолженность", "Иные активы"]}
                selectedSubsection={selectedSubsection}
                setSelectedSubsection={setSelectedSubsection}
            />
            <Main>
                {(selectedSubsection === "Транспорт") && <Transport />}
                {(selectedSubsection === "Недвижимость") && <Property />}
                {(selectedSubsection === "Земельные участки") && <Ground />}
                {(selectedSubsection === "Дебиторская задолженность") && <DebtorIndebtedness />}
                {(selectedSubsection === "Иные активы") && <Another />}
            </Main>
        </>
    )
}