// Парсинг дат
function parseDate(date) {
    return (date) ? new Date(date) : null
}


// Добавление к дате определённого срока
function addDate(date, { day=0, month=0 } = {}) {
    if (!date) return null
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + day)
    newDate.setMonth(newDate.getMonth() + month)
    return newDate
}


// Поиск агрегированных индикаторов
export function findAggregatedIndicators(rowCurr, row, fieldSum, fieldIndicators) {
    const arrestSumCurr = rowCurr[fieldSum] ?? 0
    const arrestSum = row[fieldSum] ?? 0
    if (arrestSumCurr < arrestSum) {
        rowCurr[fieldSum] = arrestSum
        rowCurr.indicators[fieldIndicators] = row.indicators[fieldIndicators]
    }
}


// Логика индикаторов
export const indicatorsGetters = {
    // Арест имущества
    arrest(execDate, row) {
        const now = new Date()
        const wantedClose = parseDate(row.wanted_close)

        const deadlineArrest   = addDate(execDate, { day: 5 })
        const deadlineWanted1  = addDate(wantedClose, { day: 5 })
        const deadlineWanted2  = addDate(wantedClose, { day: 10 })

        const hasArrest = row.arrest_property && row.arrest_sum
        const hasWantedList = row.wanted_open && row.wanted_result === "1"

        const actual1  = (deadlineArrest  >= now) &&  hasArrest && !row.wanted_open
        const actual2  = (deadlineWanted1 >= now) &&  hasArrest && hasWantedList
        const expired1 = (deadlineArrest  <  now) &&  hasArrest && !row.wanted_open
        const expired2 = (deadlineWanted1 <  now) &&  hasArrest && hasWantedList
        const missed1  = (deadlineArrest  <  now) && !hasArrest && !row.wanted_open
        const missed2  = (deadlineWanted2 <  now) && !hasArrest && hasWantedList

        return (
            (actual1  || actual2)  ? 3 :
                (expired1 || expired2) ? 2 :
                    (missed1  || missed2)  ? 1 :
                        0
        )
    },

    // Розыск имущества
    wanted(execDate, row) {
        const now = new Date()
        const WantedOpen = parseDate(row.wanted_open)

        const deadlineWanted1 = addDate(execDate, { day: 10, month: 2 })
        const deadlineWanted2 = addDate(WantedOpen, { month: 2 })

        const hasArrest = row.arrest_property && row.arrest_sum

        const actual1  = (deadlineWanted1 >= now) && !hasArrest       &&  row.wanted_open
        const actual2  = (deadlineWanted2 >= now) && row.wanted_open  &&  row.wanted_close
        const expired1 = (deadlineWanted1 <  now) && !hasArrest       &&  row.wanted_open
        const expired2 = (deadlineWanted2 <  now) && row.wanted_open  &&  row.wanted_close
        const missed1  = (deadlineWanted1 >= now) && !hasArrest       && !row.wanted_open
        const missed2  = (deadlineWanted2 <  now) && row.wanted_open  &&  row.wanted_close

        return (
            (actual1  || actual2)  ? 3 :
                (expired1 || expired2) ? 2 :
                    (missed1  || missed2)  ? 1 :
                        0
        )
    },

    evaluation(execDate, row) {
        const now = new Date()
        const arrestProperty = parseDate(row.arrest_property)
        const evaluationSubmit = parseDate(row.evaluation_submit)

        const deadlineEvaluation1 = addDate(arrestProperty, { month: 1 })
        const deadlineEvaluation2 = addDate(evaluationSubmit, { month: 1 })

        const hasArrest = row.arrest_property && row.arrest_sum

        const actual1  = (deadlineEvaluation1 >= now) && hasArrest              && !row.evaluation_accept
        const actual2  = (deadlineEvaluation2 >= now) && row.evaluation_accept
        const expired1 = (deadlineEvaluation1 <  now) && hasArrest              && row.evaluation_accept
        const expired2 = (deadlineEvaluation2 <  now) && row.evaluation_accept
        const missed1  = (deadlineEvaluation1 >= now) && hasArrest              && !row.evaluation_submit
        const missed2  = (deadlineEvaluation2 >= now) && !row.evaluation_accept

        return (
            (actual1  || actual2)  ? 3 :
                (expired1 || expired2) ? 2 :
                    (missed1  || missed2)  ? 1 :
                        0
        )
    },

    submitRealizationFirstStage(execDate, row) {
        const now = new Date()
        const evaluationSubmit = parseDate(row.evaluation_submit)

        const deadline = addDate(evaluationSubmit, { month: 1 })

        const hasEvaluation = row.evaluation_accept && row.evaluation_sum

        const actual  = (deadline >= now) && hasEvaluation && !row.realization_submit
        const expired = (deadline <  now) && hasEvaluation &&  row.realization_submit
        const missed  = (deadline >= now) && hasEvaluation &&  row.realization_submit

        return (
            (actual)  ? 3 :
                (expired) ? 2 :
                    (missed)  ? 1 :
                        0
        )
    },

    realizationFirstStage(execDate, row) {
        const now = new Date()
        const realizationSubmit = parseDate(row.realization_submit)

        const deadline = addDate(realizationSubmit, { month: 2, day: 15 })

        const actual  = (deadline >= now) && row.realization_submit && ( row.realization_result_1 ||  row.not_realization_notification)
        const expired = (deadline <  now) && row.realization_submit && ( row.realization_result_1 ||  row.not_realization_notification)
        const missed  = (deadline >= now) && row.realization_submit && (!row.realization_result_1 || !row.not_realization_notification)

        return (
            (actual)  ? 3 :
                (expired) ? 2 :
                    (missed)  ? 1 :
                        0
        )
    },

    submitRealizationSecondStage(execDate, row) {
        const now = new Date()
        const notRealizationNotification = parseDate(row.not_realization_notification_2)

        const deadline = addDate(notRealizationNotification, { day: 7 })

        const actual  = (deadline >= now) &&  row.price_reduction_resolution
        const expired = (deadline <  now) &&  row.price_reduction_resolution
        const missed  = (deadline >= now) && !row.price_reduction_resolution

        return (
            (actual)  ? 3 :
                (expired) ? 2 :
                    (missed)  ? 1 :
                        0
        )
    },

    realizationSecondStage(execDate, row) {
        const now = new Date()
        const priceReductionResolution = parseDate(row.price_reduction_resolution)

        const deadline = addDate(priceReductionResolution, { month: 2, day: 15 })

        const actual  = (deadline >= now) && row.not_realization_notification_2 && ( row.realization_result_2 ||  row.not_realization_notification_2)
        const expired = (deadline <  now) && row.not_realization_notification_2 && ( row.realization_result_2 ||  row.not_realization_notification_2)
        const missed  = (deadline >= now) && row.not_realization_notification_2 && (!row.realization_result_2 || !row.not_realization_notification_2)

        return (
            (actual)  ? 3 :
                (expired) ? 2 :
                    (missed)  ? 1 :
                        0
        )
    },

    collectionAccountsReceivable(execDate, row) {
        const now = new Date()
        const data = parseDate(row.data)

        const deadline = addDate(data, { day: 7 })

        const actual  = (deadline >= now) &&  row.dz_foreclose_date
        const expired = (deadline <  now) &&  row.dz_foreclose_date
        const missed  = (deadline >= now) && !row.dz_foreclose_date

        return (
            (actual)  ? 3 :
                (expired) ? 2 :
                    (missed)  ? 1 :
                        0
        )
    },
}