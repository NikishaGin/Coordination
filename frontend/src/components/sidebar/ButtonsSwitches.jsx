import React from 'react';
import styled from "styled-components";

const ToggleButton = styled.button`
  box-sizing: border-box; // Включаем границы в размеры элемента
  position: relative;
  flex: 1;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ active }) =>
    active ? 'white' : 'rgb(148, 160, 184)'
};
  background-color: ${({ active }) =>
    active ? 'hsl(210, 100%, 23%)' : 'transparent'
};
  border: ${({ active }) =>
    active ? '1px solid hsl(210, 100%, 30%)' : '1px solid rgba(51, 60, 77, 0.6)'
};
  cursor: pointer;
  transition: all 0.3s ease;

  /* Эффект при наведении */
  &:hover {
    background-color: ${({ active }) =>
    active ? 'rgba(0, 59, 117, 0.8)' : 'rgba(51, 60, 77, 0.3)' // цвет заливки для неактивной кнопки
};
    border: ${({ active }) =>
    active ? '1px solid hsl(210, 100%, 60%)' : '1px solid rgba(51, 60, 77, 0.8)'
};
  }

  /* Эффект при нажатии */
  &:active {
    background-color: ${({ active }) =>
    active ? 'rgba(51, 153, 255, 0.6)' : 'rgba(51, 60, 77, 0.4)'
};
    transform: scale(0.98);
  }
`;

export const ButtonsSwitches = (props) => {
    const isActive = props.selectedButton === props.value;

    const handleChange = (value) => props.setSelectedButton(value);

    return (
        <ToggleButton
            active={isActive}
            onClick={() => handleChange(props.value)}
        >
            {props.title}
        </ToggleButton>
    );
};