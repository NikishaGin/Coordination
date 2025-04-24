import { Sidebar, Main } from "../../Sidebar.jsx";
import Transport from "./subsections/Transport.jsx"
import Property from "./subsections/Property.jsx"
import Ground from "./subsections/Ground.jsx"
import DebtorIndebtedness from "./subsections/DebtorIndebtedness.jsx"
import Another from "./subsections/Another.jsx"
import { useSelector } from "react-redux";



export default function () {
    const selectedSection = useSelector((state) => state.global.detailInfo.subsection);

    return (
        <>
            <Sidebar sections={["Транспорт", "Недвижимость", "Земельные участки", "Дебиторская задолженность", "Иные активы"]} />
            <Main>
                {(selectedSection === "Транспорт") && <Transport />}
                {(selectedSection === "Недвижимость") && <Property />}
                {(selectedSection === "Земельные участки") && <Ground />}
                {(selectedSection === "Дебиторская задолженность") && <DebtorIndebtedness />}
                {(selectedSection === "Иные активы") && <Another />}
            </Main>
        </>
    )
}