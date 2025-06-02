import styled from "styled-components";
import {handlesInputInn} from "../inputs/handleInput.js"
import {setInputValueInn} from "../../store/globalSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Search } from 'lucide-react';

const FilterGroup = styled.div`
  margin-bottom: 24px;
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 10px 10px 36px;
    background-color: #232339;
    border: 1px solid #333;
    border-radius: ${props => props.theme.borderRadius.sm};
    color: #ffffff;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #a0a0ff;
    }
    
    &::placeholder {
      color: #888;
    }
  }
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
`;


export const SearchInn = () => {
    const dispatch = useDispatch();
    const inputValueInn = useSelector(state => state.global.filters.inputValueInn);

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            dispatch(setInputValueInn(value));
        }
    };

    return (
        <FilterGroup>
            <SearchInput>
                <Search size={18} />
                <input
                    type="text"
                    inputMode="numeric"
                    value={inputValueInn}
                    onChange={handleChange}
                    placeholder="Поиск по ИНН"
                />
            </SearchInput>
        </FilterGroup>
    );
};




