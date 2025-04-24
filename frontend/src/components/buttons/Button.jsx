import styled from "styled-components";



export const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 22px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: hsl(210, 100%, 30%);
  border: 1px solid hsl(210, 100%, 40%);
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: hsl(210, 100%, 50%);
    border-color: hsl(210, 100%, 60%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: hsl(210, 100%, 20%);
    border-color: hsl(210, 100%, 30%);
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.2);
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(51, 153, 255, 0.7);
  }

  @media (max-width: 600px) {
    padding: 8px 8px;
    font-size: 0.75rem;
  }
`;


export const NavItem = styled.div`
  text-align: center;
  padding: 10px;
  background-color: ${({active}) => (active) ? "rgba(21, 101, 192, 0.3)" : "rgba(25, 118, 210, 0.1)"} ;
  border: 1px solid rgba(25, 118, 210, 0.3);
  border-radius: 10px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
      cursor: ${({active}) => (active) ? "default" : "pointer"};
  }
`