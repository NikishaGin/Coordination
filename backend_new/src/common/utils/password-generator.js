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

// Преобразование существующих хэш паролей из БД, сгенерированных в PHP, в Bcrypt-хэш
function phpToBcryptHash(hash) {
    return hash.replace(/^\$2y\$/, "$2a$")
}

// Проверка пароля
function isPasswordValid(password, passwordHash) {
    return bcrypt.compareSync(password, phpToBcryptHash(passwordHash))
}


const password = "BackendCat"
const passwordHash = generatePasswordHash(password)
const isValid = isPasswordValid(password, passwordHash)

console.clear()
if (isValid)
    console.log(`Хэш пароля '${password}':     ${passwordHash}`)
else
    console.log("Хэш пароль не сгенерировался. Повторите ещё раз")
process.exit(0)