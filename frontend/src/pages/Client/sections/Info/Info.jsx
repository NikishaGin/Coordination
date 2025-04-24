import { Sidebar, Main } from "../../Sidebar.jsx"
import Resolutions from "./subsections/Resolutions.jsx";
import ActivesStatistics from "./subsections/ActivesStatistics.jsx";
import DebtorIndebtedness from "./subsections/DebtorIndebtedness.jsx";
import { useSelector } from "react-redux";




export default function() {
    const selectedSection = useSelector((state) => state.global.detailInfo.subsection);

    return (
        <>
            <Sidebar sections={["Постановления", "Статистика по активам", "Дебиторская задолженность"]} />
            <Main>
                {(selectedSection === "Постановления") && <Resolutions />}
                {(selectedSection === "Статистика по активам") && <ActivesStatistics />}
                {(selectedSection === "Дебиторская задолженность") && <DebtorIndebtedness />}
            </Main>
        </>
    )
}