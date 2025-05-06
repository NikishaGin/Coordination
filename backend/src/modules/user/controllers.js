import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../../connection.js"



const SECRET_KEY = "i5n3b4f5br65HY567JHGFRHb55vgcfvghjkokm87654dse76UHYGF765tyhj&GvyHgfg6GBGV"


function auth(userInfo, password) {
    if (!userInfo) return { code: 1 }
    const passwordHash = userInfo.password.replace(/^\$2y\$/, "$2a$")
    if (bcrypt.compareSync(password, passwordHash)) {
        const info = { ...userInfo, password: undefined }
        
        const token = jwt.sign(info, SECRET_KEY, { expiresIn: "72h" })
        return { code: 0, userInfo: { ...info, token } }
    } else
        return { code: 2 }
}


function userIdentification(token) {
    let result
    try {
        const userInfo = jwt.verify(token, SECRET_KEY)
        result = {
            isVerify: true,
            userInfo
        }
    } catch {
        result = { isVerify: false }
    }
    return result    
}



export function loginUser(request, response) {
    const login = request.body.login
    const password = request.body.password
    db("users")
        .select([
            "id",
            "password",
            db.ref("name").as("firstname"),
            db.ref("surname").as("secondname"),
            db.ref("patronymic").as("lastname"),
            db.ref("region").as("regionCode"),
            "role"
        ])
        .where({ username: login })
        .then(data => response.end(JSON.stringify(auth(data[0], password))))
        .catch(console.log)
}


export function verifyUser(request, response) {
    const token = request.headers.authorization
    const data = userIdentification(token)
    const result = {
        isVerify: data.isVerify,
        exp: data.userInfo?.exp
    }
    response.end(JSON.stringify(result))
}


/*
export function destroyUser(request, response) {

}
*/


export default userIdentification