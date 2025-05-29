import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchGetRegions, setSelectedRegion} from "../../store/globalSlice.js";
import {CustomIcon, FilterGroup, Select, SelectWrapper} from "../select/Select.jsx";
import { useLocation } from "react-router";

export const SelectRegion = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const regions = useSelector((state) => state.global.regions);
    const selectedRegion = useSelector((state) => state.global.selectedRegion);

    useEffect(() => {
        let pageKey = "default";

        if (location.pathname.startsWith("/coordination")) {
            pageKey = "Index";
        } else if (location.pathname.startsWith("/derivative")) {
            pageKey = "DerivativeDebt";
        }

        dispatch(fetchGetRegions(pageKey));
        dispatch(setSelectedRegion(null)); // сбрасываем регион при смене страницы
    }, [dispatch, location.pathname]);



    const handleChange = (event) => {
        const selectedValue = event.target.value;
        dispatch(setSelectedRegion(selectedValue));
    };

    return (
        <FilterGroup>
            <SelectWrapper>
                <Select id="region" value={selectedRegion || ""} onChange={handleChange}>
                    <option value="" disabled hidden>
                        Выберите регион
                    </option>
                    {regions.map((item) => (
                        <option key={item.regionCode} value={item.regionCode}>
                            {item.regionName ? `${item.regionCode} - ${item.regionName}` : item.regionCode}
                        </option>
                    ))}
                </Select>
                <CustomIcon />
            </SelectWrapper>
        </FilterGroup>
    );
};


// export const SelectRegion = () => {
//     const dispatch = useDispatch();
//     const regions = useSelector((state) => state.global.regions);
//     const selectedRegion = useSelector((state) => state.global.selectedRegion);
//
//     useEffect(() => {
//         dispatch(fetchGetRegions('Index'));
//     }, [dispatch]);
//
//     const handleChange = (event) => {
//         const selectedValue = event.target.value;
//         dispatch(setSelectedRegion(selectedValue));
//     };
//
//     return (
//         <FilterGroup>
//             <SelectWrapper>
//                 <Select id="region" value={selectedRegion || ""} onChange={handleChange}>
//                     {/* Значение по умолчанию */}
//                     <option value="" disabled hidden>
//                         Выберите регион
//                     </option>
//                     {/* Остальные опции */}
//                     {regions.map((item) => (
//                         <option key={item.regionCode} value={item.regionCode}>
//                             {item.regionName ? `${item.regionCode} - ${item.regionName}` : item.regionCode}
//                         </option>
//                     ))}
//                 </Select>
//                 <CustomIcon /> {/* Добавляем кастомную иконку */}
//             </SelectWrapper>
//         </FilterGroup>
//     );
// };