import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoginUser } from "../store/user/userSlice.js";
import { userAPI } from '../api';
import {ROLES} from "../types.js";



const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  width: 35vw;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
  
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  input {
    width: 100%;
    padding: 10px 10px;
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
`;

const Label = styled.label`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  align-self: flex-start; // Выравнивание по левому краю
  transition: color 0.3s ease; // Плавное изменение цвета
`;

const Input = styled.input`
  padding: 8px 12px;
  height: 2.5rem;
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;
  background-color: rgb(5, 7, 10);
  color: rgb(255, 255, 255);
  width: 100%;
  cursor: text;

  &:focus {
    border-color: rgb(2, 122, 242); // Цвет границы при фокусе
    outline: rgba(2, 107, 212, 0.5) solid 2px;
  }
`;

const Button = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 22px;
  cursor: pointer;
  width: 100%;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #4a4a7a;
  }
`;

// Ошибка в форме в случае неверных данных
const ErrorText = styled.div`
  height: 2rem;
  color: red;
`


export const Login = () => {
  const [messageError, setMessageError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serviceMode = useSelector(state => state.global.serviceMode)
  const { register, handleSubmit } = useForm()




  // Обработка формы авторизации
  const onSubmitLogin = async formData => {
    if (formData.username && formData.password) {
      const result = await userAPI.loginUser(formData.username, formData.password);
      if (serviceMode && (result.data.userInfo.role !== ROLES.Admin))
        setMessageError("Сервис временно недоступен")
      else if (result.data.code === 0) {
        dispatch(fetchLoginUser(result.data.userInfo));
        navigate("/coordination", { replace: true });
      }
      else if (result.data.code === 1)
        setMessageError("Пользователя с таким логином не существует");
      else if (result.data.code === 2)
        setMessageError("Неверный пароль");
    } else
      setMessageError("Заполните логин и пароль");
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmitLogin)}>
        <Container>
          <FieldGroup>
            <Label htmlFor="username">Имя пользователя *</Label>
            <Input id="username" {...register("username")} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="password">Пароль *</Label>
            <Input id="password" type="password" {...register("password")} />
          </FieldGroup>
          <ErrorText>{messageError}</ErrorText>
          <Button type='submit'>Войти</Button>
        </Container>
      </form>
    </Wrapper>
  );
};