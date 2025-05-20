import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../store/userSlice.js";
import { userAPI } from '../api';



const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Container = styled.div`
  width: 35vw;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(148, 160, 184, 0.4);
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
  background-color: rgb(12, 16, 23);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;

  &:focus-within label {
    color: rgb(2, 122, 242); // Цвет лейбла при фокусе на инпуте
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
  color: black;
  background-color: rgb(245, 246, 250);
  box-shadow: rgb(189, 199, 219) 0px -1px 0px inset;
  padding: 8px 22px;
  border: 1px solid rgb(245, 246, 250);
  cursor: pointer;
  width: 100%;
  border-radius: 8px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
  border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgb(168, 170, 178); // Изменение фона при наведении
    box-shadow: rgb(150, 160, 180) 0px -1px 0px inset; // Изменение тени
    border-color: rgb(200, 210, 230); // Изменение цвета границы
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
      if (serviceMode && (result.data.userInfo.role !== "admin"))
        setMessageError("Сервис временно недоступен")
      else if (result.data.code === 0) {
        dispatch(setUserInfo(result.data.userInfo));
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