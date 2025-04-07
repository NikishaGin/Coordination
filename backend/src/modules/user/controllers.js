import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../../connection.js"



const SECRET_KEY = "i5n3b4f5br65HY567JHGFRHb55vgcfvghjkokm87654dse76UHYGF765tyhj&GvyHgfg6GBGV"


function auth(userInfo, password) {
    if (!userInfo) return { code: 1 }
    const passwordHash = userInfo.password.replace(/^\$2y\$/, "$2a$")
    if (bcrypt.compareSync(password, passwordHash)) {
        const info = { ...userInfo, password: undefined }
        const token = jwt.sign(info, SECRET_KEY, { expiresIn: "1m" })
        return { code: 0, userInfo: { ...info, token } }
    } else
        return { code: 2 }
}


export function loginUser(request, response) {
    const login = request.body.login
    const password = request.body.password
    db("users")
        .select([
            "password",
            db.ref("name").as("firstname"),
            db.ref("surname").as("secondname"),
            db.ref("patronymic").as("lastname"),
            "role"
        ])
        .where({ username: login })
        .then(data => response.end(JSON.stringify(auth(data[0], password))))
        .catch(console.log)
}


export function verifyUser(request, response) {
    const token = request.headers.authorization
    let result
    try {
        const data = jwt.verify(token, SECRET_KEY)
        result = {
            isVerify: true,
            exp: data.exp
        }
    } catch {
        result = { isVerify: false }
    }
    response.end(JSON.stringify(result))
}


/*
export function destroyUser(request, response) {

}
*/