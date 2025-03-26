import { Router } from "express"
import * as models from "../models.js"



const router = Router()


router.get("/get-regions/:page", async function (request, response) {
    const page = request.params.page
    const regions = await models.Meta.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('region')), 'regionCode']],
        include: [{
            model: Resolution,
            where: {
                is_derivative_debt: +((page === "DerivativeDebt") || (page === "DerivativeDebtArchive")),
                is_archive: +((page === "IndexArchive") || (page === "DerivativeDebtArchive"))
            },
            required: false
        }],
        order: [[Sequelize.col('region'), 'ASC']]
    }).map(region => region.get('regionCode'))
    response.end(JSON.stringify(regions))
})


router.get("/get-region-name/:regionCode", async function (request, response) {
  const regionCode = request.params.regionCode
  const regionName = await models.Regions.findOne({ attributes: ["regionName"], where: { regionCode } })
  response.end(JSON.stringify(regionName))
})


router.get("/get-debt-types", async function (_, response) {
    const allDebtType = await models.DebtType.findAll()
    response.end(JSON.stringify(allDebtType))
})








// router.get("/get-table/:page/:regionCode", async function (request, response) {
//   const page = request.params.page
//   const regionCode = request.params.regionCode
//   const connection = await pool.getConnection()
//   const table = await getTable(connection, page, regionCode)
//   connection.release()
//   response.end(JSON.stringify(table))
// })


// // router.get("/get-info", async function (request, response) {
// //   const inn = request.body.inn
// //   const connection = await pool.getConnection()
// //   const info = await getData.getInfo(connection, inn)
// //   connection.release()
// //   response.end(JSON.stringify(info))
// // })









// router.get("/get-info/:inn", async function (request, response) {
//   const inn = request.params.inn
//   const connection = await pool.getConnection()
//   const info = await getData.getInfo(connection, inn)
//   connection.release()
//   response.end(JSON.stringify(info))
// })


// router.get("/get-actives/:inn", async function (request, response) {
//   const inn = request.params.inn
//   const connection = await pool.getConnection()
//   const actives = await getData.getActives(connection, inn)
//   connection.release()
//   response.end(JSON.stringify(actives))
// })


// router.get("/get-detail/:inn", async function (request, response) {
//   const inn = request.params.inn
//   const connection = await pool.getConnection()
//   const detail = await getData.getDetail(connection, inn)
//   connection.release()
//   response.end(JSON.stringify(detail))
// })


// router.get("/get-indicators/:regionCode", async function (request, response) {
//   const regionCode = request.params.regionCode
//   const connection = await pool.getConnection()
//   const ind = await indicators(connection, regionCode)
//   connection.release()
//   response.end(JSON.stringify(ind))
// })


export default router