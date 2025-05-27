import { actives } from "../../queries/selectors.js"


const day = 24*60*60*1000


const indicators = {



    arrest(execDate, row) {
        const hasArrest = row.arrest_property && row.arrest_sum
        const isWantedCase = row.wanted_close && row.wanted_result === "1"
        const now = new Date()

        // Для случаев с розыскным делом
        if (isWantedCase) {
            const closeDate = new Date(row.wanted_close)
            const arrestDate = row.arrest_property ? new Date(row.arrest_property) : null
            const deadline = hasArrest ? 5 : 10


            const cutoffDate = new Date(closeDate)
            cutoffDate.setDate(closeDate.getDate() + deadline)

            return !hasArrest
                ? (now > cutoffDate ? 1 : 0)
                : (arrestDate > cutoffDate ? 2 : 3)
        }

        // Для обычных случаев (без розыскного дела)
        const execCutoff = new Date(execDate)
        execCutoff.setDate(execDate.getDate() + 5)

        return !hasArrest
            ? (now > execCutoff ? 1 : 0)
            : (new Date(row.arrest_property) > execCutoff ? 2 : 3)
    },




    wanted(execDate, row) {

    },
    evaluation(execDate, row) {

    },
    submitRealizationFirstStage(execDate, row) {

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



export async function calculateIndicators(inn, aggregated=false) {
    const { execMinDate, maxLoadDate, isLizingFNS, data } = await actives.getFieldsOccupancy(inn)
    const isLizing = Object.entries(isLizingFNS).reduce((currSum, [_, data]) => currSum + data[0].value, 0) > 0
    const isUpdated = Date.now() - Math.max(...Object.entries(maxLoadDate).map(([_, data]) => new Date(data[0].value))) < 7*day
    const execDate = new Date(execMinDate[0].value)
    data.map(row => {

    })


}