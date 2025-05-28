import { actives, selectFieldsOccupancy, tableActives } from "../../queries/selectors.js"


function parseDate(date) {
    const validDate = date ?? (Date.now() + 24*60*60*1000)
    return new Date(validDate)
}


function addDate(date, { dey=0, month=0 } = {}) {
    const newDate = date
    newDate.setDate(date.getDate() + dey)
    newDate.setMonth(date.getMonth() + month)
    return newDate
}


const indicatorsGetters = {
    arrest(execDate, row) {
        const now = new Date()
        const hasArrest = row.arrest_property && row.arrest_sum
        const hasWantedList = row.wanted_open && row.wanted_result === "1"
        const wantedClose = parseDate(row.wanted_close)

        const deadlineArrest   = addDate(execDate, { dey: 5 })
        const deadlineWanted5  = addDate(wantedClose, { dey: 5 })
        const deadlineWanted10 = addDate(wantedClose, { dey: 10 })

        const arrestActual     = (deadlineArrest   >= now) &&  hasArrest && !row.wanted_open
        const wantedActual     = (deadlineWanted5  >= now) &&  hasArrest && hasWantedList
        const arrestExpired    = (deadlineArrest   <  now) &&  hasArrest && !row.wanted_open
        const wantedExpired    = (deadlineWanted5  <  now) &&  hasArrest && hasWantedList
        const arrestMissed     = (deadlineArrest   <  now) && !hasArrest && !row.wanted_open
        const wantedMissed     = (deadlineWanted10 <  now) && !hasArrest && hasWantedList

        return (
            (arrestActual  || wantedActual)  ? 3 :
                (arrestExpired || wantedExpired) ? 2 :
                    (arrestMissed  || wantedMissed)  ? 1 :
                        0
        )
    },

    wanted(execDate, row) {
        const now = new Date()
        const hasArrest = row.arrest_property && row.arrest_sum
        const WantedOpen = parseDate(row.wanted_open)

        const deadlineWanted1 = addDate(execDate, { dey: 10, month: 2 })
        const deadlineWanted2 = addDate(WantedOpen, { month: 2 })

        const arrestActual    = (deadlineWanted1 >= now) && !hasArrest       && row.wanted_open
        const wantedActual    = (deadlineWanted2 >= now) &&  row.wanted_open && row.wanted_close
        const arrestExpired   = (deadlineWanted1 <  now) && !hasArrest       && row.wanted_open
        const wantedExpired   = (deadlineWanted2 <  now) &&  row.wanted_open && row.wanted_close
        const arrestMissed    = (deadlineWanted1 >= now) && !hasArrest      && !row.wanted_open
        const wantedMissed    = (deadlineWanted2 <  now) && row.wanted_open &&  row.wanted_close

        return (
            (arrestActual  || wantedActual)  ? 3 :
                (arrestExpired || wantedExpired) ? 2 :
                    (arrestMissed  || wantedMissed)  ? 1 :
                        0
        )
    },

    evaluation(execDate, row) {
        const now = new Date()
        const hasArrest = row.arrest_property && row.arrest_sum
        const arrestProperty = parseDate(row.arrest_property)
        const evaluationSubmit = parseDate(row.evaluation_submit)

        const deadlineEvaluation = addDate(arrestProperty, { month: 1 })
        const deadlineEvaluation2 = addDate(evaluationSubmit, { month: 1 })

        const arrestActual    = (deadlineEvaluation >= now) && hasArrest && !row.evaluation_accept
        const wantedActual    = (deadlineEvaluation2 >= now) &&  row.evaluation_accept
        const arrestExpired   = (deadlineEvaluation <  now) && hasArrest && row.evaluation_accept
        const wantedExpired   = (deadlineEvaluation2 < now) &&  row.evaluation_accept
        const arrestMissed    = (deadlineEvaluation >= now) && hasArrest && !row.evaluation_submit
        const wantedMissed    = (deadlineEvaluation2 >=  now) && !row.evaluation_accept

        return (
            (arrestActual  || wantedActual)  ? 3 :
                (arrestExpired || wantedExpired) ? 2 :
                    (arrestMissed  || wantedMissed)  ? 1 :
                        0
        )
    },

    submitRealizationFirstStage(execDate, row) {
        const now = new Date()
        const evaluationSubmit = parseDate(row.evaluation_submit)

        const deadline = addDate(evaluationSubmit, { month: 1 })

        if ((evaluationSubmit >= now) && )
            return 3
        else if ()
            return 2
        else if ()
            return 1
        else
            return 0
    },

    realizationFirstStage(execDate, row) {

    },
    submitRealizationSecondStage(execDate, row) {

    },
    realizationSecondStage(execDate, row) {

    },
    collectionAccountsReceivable(execDate, row) {

    },
}


export async function insertIndicatorsToActives(rows, inn) {
    const execMinDate = new Date(await actives.getExecMinDate(inn))
    for (const row of rows) {
        const indicators = {}

        for (const [ name, getter ] of Object.entries(indicatorsGetters)) {
            indicators[name] = getter(execMinDate, row)
        }

        row.indicators = indicators
    }
}


export async function aggregateIndicators(inn) {
    const IS_UPDATED_DELTA =  7 * 24 * 60 * 60 * 1000

    const maxLoadDate =  await actives.getMaxLoadDate(inn)
    const isUpdated = (Date.now() - new Date(maxLoadDate)) <= IS_UPDATED_DELTA;
    const isLizing = await actives.isLizingFNS(inn)

    const activesTables = await tableActives(inn, selectFieldsOccupancy)

    const activesValues = Object.values(activesTables)

    console.log(activesTables)
    // console.log(activesValues.flat())

    for (const activeRows of activesValues) {
        await insertIndicatorsToActives(activeRows, inn)
    }


}