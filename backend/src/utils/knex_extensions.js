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
        [alias]: this.client.raw('COALESCE(??, 0)', [field])
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
            ref => `IFNULL(${ref}, '')`
        );

        return rawExpr.as(name);
    });

    return this.select(...selects);
}

function selectNullProtected(...fields) {
    const selects = fields.map(field => {
        const name = field.includes('.')
            ? field.split('.').pop() : field;

        return this.client.raw(`IFNULL(??, 0) as ??`, [field, name]);
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
 * @param {string} sumField - новео поле которое будет содержать полученный статус
 * @param {boolean} keepOriginal – флаг, указывающий, надо ли также сохранять старые флаги.
 * @returns {object} - knex-запрос с результатом
 */
function reduceFlagsToStatusField(table, newField, flagsMapping, keepOriginal = false) {
    const {
        _: defaultVal = "Ошибка статуса",
        ...switchMapping
    } = flagsMapping;

    const casesStr = Object.entries(switchMapping)
        .map(([field, label]) =>
            `WHEN \`${table}\`.\`${field}\` IS NOT NULL THEN '${label}'`
        )
        .join(' ');

    const rawCase = `CASE ${casesStr} ELSE '${defaultVal}' END`;

    const columns = [
        this.client.raw(`${rawCase} AS \`${newField}\``)
    ];

    if (keepOriginal) {
        for (const field of Object.keys(switchMapping)) {
            columns.push(`${table}.${field}`);
        }
    }

    return this.select(...columns);
}


/**
 * Превращает набор значений статусного поля (числовых или строковых)
 * в конкретное значение статуса, удаляя при необходимости флаги из данных.
 *
 * ```
 * // Вот это:
 * CASE
 *     WHEN users.status = 1 THEN "Активен"
 *     WHEN users.status = 2 THEN "Заблокирован"
 *     ELSE "Неизвестный статус"
 * END
 *
 * // Будет реализовано вот так:
 * .mapStatusToTextField("users", "status", {
 *     1: "Активен",
 *     2: "Заблокирован",
 *     _: "Неизвестный статус"  // значение по умолчанию
 * }, "status_text")
 * ```
 *
 * @param {string} table – Имя таблицы, из которой берётся поле со статусом.
 * @param {string} originField – Название исходного поля со статусом.
 * @param {Object<string|number, string>} statusMapping – Маппинг кодов статусов и их текстовых представлений.
 *                                                        Ключ '_' задаёт текст по умолчанию, если значение не совпадает.
 * @param {string} [newField=originField] – Имя нового поля, в которое будет помещён результат.
 *                                          Не влияет на наличие или отсутствие других полей в SELECT.
 * @returns {function(): import('knex').QueryBuilder} – Функция для использования в цепочке knex-запроса.
 */
function mapStatusToTextField(table, originField, statusMapping, options = {}) {
    const {
        keepOriginal = false,
        newField = originField
    } = options;

    const {
        _: defaultText = 'Неизвестный статус',
        ...cases
    } = statusMapping;

    const caseExpr = Object.entries(cases)
        .map(([ key, value ]) => {
            const formattedKey = isNaN(key) ? `'${key}'` : key;

            if (typeof value === "string")
                return `WHEN \`${table}\`.\`${originField}\` = ${formattedKey} THEN '${value}'`;
            else {
                const [[fieldName, text]] = Object.entries(value);
                return `WHEN \`${table}\`.\`${originField}\` = ${formattedKey} THEN CONCAT('${text}', '\"', IFNULL(${table}.${fieldName}, ''), '\"')`;
            }
        }).join(' ');

    const fullCase = `CASE ${caseExpr} ELSE '${defaultText}' END`;

    const selections = [];

    if (keepOriginal) {
        selections.push(`${table}.${originField}`);
    }

    selections.push(this.client.raw(`${fullCase} AS \`${newField}\``));

    return this.select(...selections);
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


function sumTwoFields(field1, field2, alias = `${field1}_${field1}_sum`) {
    return this.select(
        this.client.raw(
            'IFNULL(??, 0.00) + IFNULL(??, 0.00) AS ??',
            [field1, field2, alias]
        )
    );
}


function nullToFlag(field1, field2, alias = `${field1}_${field2}_flag`, reverse = false) {
    const condition = reverse
        ? 'IF(?? IS NULL AND ?? IS NULL, true, false)'
        : 'IF(?? IS NOT NULL OR ?? IS NOT NULL, true, false)';

    return this.select(
        this.client.raw(condition + ' AS ??', [field1, field2, alias])
    );
}


const JOIN_TYPES = {
    left:  'leftJoin',
    right: 'rightJoin',
    inner: 'innerJoin',
};

/**
 * Функция для join с подзапросом и выборкой всех полей из него.
 * @param {object} query - knex query builder
 * @param {function|object} subQuery - подзапрос (функция, возвращающая query, или готовый query)
 * @param {string} alias - псевдоним для подзапроса
 * @param {string} joinType - тип join: left, right, inner (по умолчанию left)
 * @param {string} leftField - поле слева для join (например, 'meta.inn')
 * @param {string} rightField - поле справа для join (например, 'a.inn')
 */
function joinSubQuery(
    subQuery,
    alias,
    onClause,
    joinType = JOIN_TYPES.left,
) {
    const subQueryBuilder = typeof subQuery === 'function'
        ? subQuery(this.client)
        : subQuery;

    this.client[joinType](
        subQueryBuilder.as(alias),
        onClause,
    );

    return this.client.select(`${alias}.*`);
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
        mapStatusToTextField,
        sumFieldsOfFewTables,
        sumTwoFields,
        nullToFlag,
        selectNullProtected,
        joinSubQuery,
    };

    Object.entries(extensions).forEach(
        ([ extName, ext ]) =>
            knexClass.QueryBuilder.extend(extName, ext)
    )
}