import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../../connection.js"



const SECRET_KEY = "i5n3b4f5br65HY567JHGFRHb55vgcfvghjkokm87654dse76UHYGF765tyhj&GvyHgfg6GBGV"


function auth(userInfo, password) {
    if (!userInfo) return { code: 1 }
    const passwordHash = userInfo.password.replace(/^\$2y\$/, "$2a$")
    bcrypt.compare(password, passwordHash, (error, result) => {
        if (error) {
            console.log(error)
            return { code: 3 }
        }
        if (result) {
            const info = { ...userInfo, password: undefined }
            const token = jwt.sign(info, SECRET_KEY, { expiresIn: "1m" })
            return { code: 0, userInfo: info, jwtToken: token }
        } else
            return { code: 2 }
    })
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
            "role"
        ])
        .where({ username: login })
        .then(data => response.end(JSON.stringify(auth(data[0], password))))
        .catch(console.log)
}


export function verifyUser(request, response) {
    request.headers['x-access-token']
}



/*
export function destroySession(request, response) {
    
}
*/