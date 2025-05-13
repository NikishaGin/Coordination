import React, { useState } from "react";
import { Sidebar, Main } from "../../Sidebar.jsx"
import Resolutions from "./subsections/Resolutions.jsx";
import ActivesStatistics from "./subsections/ActivesStatistics.jsx";
import DebtorIndebtedness from "./subsections/DebtorIndebtedness.jsx";


export default function() {
    const [selectedSubsection, setSelectedSubsection] = useState("Дебиторская задолженность")

    return (
        <>
            <Sidebar
                subsections={["Постановления", "Статистика по активам", "Дебиторская задолженность"]}
                selectedSubsection={selectedSubsection}
                setSelectedSubsection={setSelectedSubsection}
            />
            <Main>
                {(selectedSubsection === "Постановления") && <Resolutions />}
                {(selectedSubsection === "Статистика по активам") && <ActivesStatistics />}
                {(selectedSubsection === "Дебиторская задолженность") && <DebtorIndebtedness />}
            </Main>
        </>
    )
}