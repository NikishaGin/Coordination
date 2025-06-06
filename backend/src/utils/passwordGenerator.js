import bcrypt from "bcryptjs"



// Генератор хэша пароля (аналогично вашей функции проверки)
function generatePasswordHash(password) {
    const saltRounds = 10; // Количество раундов соли (можно настроить)
    const hash = bcrypt.hashSync(password, saltRounds);

    // Преобразование формата для совместимости (если нужно)
    return bcryptToPhpHash(hash);
}

// Преобразование bcrypt-хэша в PHP-совместимый формат (обратное вашему phpToBcryptHash)
function bcryptToPhpHash(hash) {
    return hash.replace(/^\$2a\$/, "$2y$");
}


const password = "gmu"
const passwordHash = generatePasswordHash(password)

console.log("passwordHash", passwordHash)