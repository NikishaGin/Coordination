import styled from "styled-components";


export const CustomCheckbox = styled.label`
    display: inline-block;
    position: relative;
    width: 18px;
    height: 18px;
    /*cursor: pointer;*/

    input[type="checkbox"] {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    span:hover {
        border-color: rgb(2, 122, 242);
    }

    input[type="checkbox"]:checked + span {
        background-color: rgb(2, 122, 242);
        border-color: rgb(2, 122, 242);
    }

    input[type="checkbox"]:checked + span::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -60%) rotate(45deg);
    }

    span {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 1px solid rgba(51, 60, 77, 0.6);
        border-radius: 2px;
        transition: all 0.3s ease;
    }
`;