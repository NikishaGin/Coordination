import * as models from "./models.js";
import {isPasswordValid, generateToken} from "./service.js"



export async function loginUser(request, response) {
    const {login, password=""} = request.body
    if (!(login && password)) {
        response.status(400).json({details: "Отсутствуют обязательные поля: логин и пароль"})
        return
    }
    const {passwordHash = "", ...userInfo} = await models.getUser(login)
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


export async function getServiceMode(_, response) {
    try {
        const data = await models.getServiceMode()
        const serviceMode = Boolean(data.value)
        response.status(200).json(serviceMode)
    } catch (error) {
        console.log(error)
        response.status(500)
    }
}


export async function toggleServiceMode(_, response) {
    try {
        const data = await models.getServiceMode()
        const serviceMode = Boolean(data.value)
        await models.setServiceMode(!serviceMode)
        response.status(200)
    } catch (error) {
        console.log(error)
        response.status(500)
    }
}