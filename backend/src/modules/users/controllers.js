import md5 from "md5"
import jwt from "jsonwebtoken"
import { Users } from './models.js';



export async function loginUser(req, res, next) {
    const login = req.body.login
    const password = req.body.password
    const user = Users.findOne({
        attributes: ["password", "region", "surname", "name", "patronymic", "role"],
        where: { username: login }
    })

}

export async function verifyUser(req, res, next) {
    
}

export async function destroySession(req, res, next) {
    
}