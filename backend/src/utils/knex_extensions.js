/**
 * TODO: Сделать более удобные интерфейсы
 */


/**
 * Переименовывает названия полей, при необходимости, сохраняет также старые поля.
 * (Вместо select("name as name"), чтобы контролировать перименования из одной точки,
 * возможно, не пригодится).
 * @param {string} table - имя таблицы, из которой брать поля
 * @param {object} renamedFields - объект переименований
 * @param {object} fields - список селлекуии без переименования
 * @param {boolean} keepOriginal - флаг, указывающий, надо ли также сохранять старые имена полей.
 * (Появятся два поля с разными именами, ссылающиеся на одну колонку, на всякий пожарный)
 * @returns {object} - knex-запрос с результатом
 */
function selectFromTable(
    table, 
    fields = [], 
    renamedFields = {},
    // where = {},
    keepOriginal = false
) {
    const selected = fields.map(
        field => this.client.ref(`${table}.${field}`)
    );

    const original = keepOriginal
        ? Object.keys(renamedFields).map(
            field => this.client.ref(`${table}.${field}`)
        ) 
        : [];

    const renamed = Object.entries(renamedFields).map(
        ([ orig, alias ]) =>
            this.client.ref(`${table}.${orig}`).as(alias)
    );

    return this.select(...selected, ...original, ...renamed);
}


/**
 * Безопасно подсчитывает сумму значений выбранного поля, заменяя NULL на 0.00
 * @param {string} field - имя поля для суммирования
 * @param {string} [alias=field] - псевдоним результата
 * @returns {object} - knex-запрос с результатом
 */
function sumSafe(field, alias = field) {
    return this.sum({
        [ alias ]: this.client.raw('IFNULL(??, 0.00)', [ field ])
    });
}


/**
 * Форматирует NULL поля как пустые строки.
 * @param {string[]} fields - массив полей
 * @returns {object} - knex-запрос с результатом
 */
function nullToEmptyStr(fields) {
    const selects = fields.map(field => {
        const name = field.includes('.')
            ? field.split('.').pop()
            : field;

        const rawExpr = this.client.raw(
            fref => `IFNULL(${ref}, '')`
        );

        return rawExpr.as(name);
    });

    return this.select(...selects);
}


/**
 * Подсчитывает число записей с заполненным (не NULL) выбранным полем
 * @param {string} field - имя поля для подсчета
 * @param {string} [alias=field] - псевдоним результата
 * @returns {object} - knex-запрос с результатом
 */
function countNotNull(field, alias = field) {
    return this.sum({
        [ alias ]: this.client.raw('IF(?? IS NULL, 0, 1)', [ field ])
    });
}


/**
 * Суммирует значение одного поля, если другое поле не NULL
 * @param {string} checkField - поле, наличие значения которого проверяется
 * @param {string} sumField - поле, которое суммируется
 * @param {string} [alias=sumField] - псевдоним результата
 * @returns {object} - knex-запрос с результатом
 */
function sumIfCheckedFieldNotNull(checkField, sumField, alias = sumField) {
    return this.sum({
        [ alias ]: this.client.raw(
            'IF(?? IS NOT NULL, IFNULL(??, 0.00), 0.00)',
            [ checkField, sumField ]
        ),
    });
}


/**
 * Превращает набор значений логических флагов в конкретное значение статуса,
 * удаляя при необходимости флаги из данных.
 * ```
 *  // Вот это:
 *  CASE
 *      WHEN resolutions.end_date       IS NOT NULL THEN "Окончено"
 *      WHEN resolutions.stop_date      IS NOT NULL THEN "Приостановлено"
 *      WHEN resolutions.pending_date   IS NOT NULL THEN "Отложено"
 *      WHEN resolutions.terminate_date IS NOT NULL THEN "Прекращено"
 *      ELSE "На исполнении"
 *  END
 *  // Будет реализовано вот так:
 *  .mapFlagsToStatus("resolutions", {
 *      end_date:       "Окончено",
 *      stop_date:      "Приостановлено",
 *      pending_date:   "Отложено",
 *      terminate_date: "Прекращено",
 *      _:              "На исполнении"  // _ заменяет default
 *  })
 *  .
 *  ```
 * @param {string} table - таблица, флаги которой должны маппиться
 * @param {string} sumField - поле, которое суммируется
 * @param {string} [alias=sumField] - псевдоним результата
 * @returns {object} - knex-запрос с результатом
 */
function reduceFlagsToStatusField(table, statusField, flagsMapping, keepFlags = false) {
    return function () {
        const {
            _: defaultVal = "Ошибка статуса",
            ...switchMapping
        } = flagsMapping

        const casesStr = Object.entries(switchMapping)
            .map(([ field, label ]) =>
                `WHEN \`${table}\`.\`${field}\` IS NOT NULL THEN '${label}'`
            )
            .join(' ')

        const rawCase = `CASE ${casesStr} ELSE '${defaultVal}' END`

        return this.select(
            this.client.raw(`${rawCase} AS \`${statusField}\``)
        );
    };
}


/**
 * Суммирует значения одного и того же поля из разных таблиц с защитой от NULL.
 * @param {string[]} tables - список названий таблиц
 * @param {string} field - имя поля, которое нужно суммировать
 * @param {string} [alias=field] - псевдоним результата
 * @returns {object} - knex-запрос с результатом
 */
function sumFieldsOfFewTables(tables, field, alias = field) {
    const expr = tables
        .map(t => `IFNULL(\`${t}\`.\`${field}\`, 0.00)`)
        .join(" + ");

    return this.select(
        this.client.raw(`${expr} AS \`${alias}\``)
    );
}


/**
 * Позволяет использовать методы через точку:
 * ```
 * db("table")
 *      .sumSafe(...)
 * ```
 */
export const mountKnexExtensions = knexClass => {
    // Через объект, чтобы работала подсветка:
    const extensions = {
        selectFromTable,
        sumSafe,
        nullToEmptyStr,
        countNotNull,
        sumIfCheckedFieldNotNull,
        reduceFlagsToStatusField,
        sumFieldsOfFewTables,
    };

    Object.entries(extensions).forEach(
        ([ extName, ext ]) =>
            knexClass.QueryBuilder.extend(extName, ext)
    )
}
