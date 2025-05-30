import {service} from "../../queries/selectors.js";
import {isPasswordValid, generateToken} from "./service.js"


export async function loginUser(request, response) {
    const {login, password=""} = request.body
    if (!(login && password)) {
        response.status(400).json({details: "Отсутствуют обязательные поля: логин и пароль"})
        return
    }
    const {passwordHash = "", ...userInfo} = (await service.getUser(login))[0]
    if (!passwordHash) {
        response.status(404).json({code: 1, details: "Пользователя с таким логином не существует"})
        return
    }
    if (!isPasswordValid(password, passwordHash)) {
        response.status(403).json({code: 2, details: "Некорректный пароль"})
        return
    }
    const token = generateToken(userInfo)
    response.status(200).json({code: 0, userInfo: { ...userInfo, token }})
}


export async function checkServiceMode(_, response) {
    const data = await service.checkServiceMode()
    const serviceMode = Boolean(data.value)
    console.log(serviceMode)
    response.status(200).json(serviceMode)
}


export async function changeServiceMode(_, response) {
    await service.changeServiceMode()
    response.status(200)
}