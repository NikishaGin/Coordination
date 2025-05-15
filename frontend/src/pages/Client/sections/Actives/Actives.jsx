import React, { useState } from "react";
import { Sidebar, Main } from "../../Sidebar.jsx";
import ActiveDetails from "./ActiveDetails/ActiveDetails.jsx"


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
                {(selectedSubsection === "Транспорт") && <ActiveDetails nameActive="transport" />}
                {(selectedSubsection === "Недвижимость") && <ActiveDetails nameActive="property" />}
                {(selectedSubsection === "Земельные участки") && <ActiveDetails nameActive="ground" />}
                {(selectedSubsection === "Дебиторская задолженность") && <ActiveDetails nameActive="debit" />}
                {(selectedSubsection === "Иные активы") && <ActiveDetails nameActive="another" />}
            </Main>
        </>
    )
}