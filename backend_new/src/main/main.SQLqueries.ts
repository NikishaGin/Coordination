import {Prisma} from "../generated/prisma/client";

export const sqlAggregatedActivesData = (
    clientIds: number[],
    additionalCondition: Prisma.Sql,
) => Prisma.sql`
SELECT
   actives.clientId,
   SUM(
       IF(
           (
               wanteds.endDate IS NOT NULL 
                   AND 
               wanteds.result = 'END_PROPERTY_SEARCH_ACTIVITIES'
           ),
           0,
           actives.cost
       )
   )                                                 AS totalSum,
   SUM(arrests.amount)                               AS arrest,
   SUM(
        IF(
           (
                wanteds.beginDate IS NOT NULL 
                    AND
                wanteds.endDate IS NULL
           ), 
           actives.cost,
           0
       )
   )                                                 AS wanted,
   SUM(evaluations.amount)                           AS evaluation,
   SUM(realizationFirst.submitAmount)                AS realizationFirst,
   SUM(realizationSecond.submitAmount)               AS realizationSecond,
   SUM(realizationFirst.realizedPropertyAmount) +
   SUM(realizationSecond.realizedPropertyAmount)     AS realizationResult,
   SUM(refund_property.amount)                       AS refundProperty,
   SUM(debit_foreclosure.requestAmount)              AS debitForeclosure,
   
   MAX(actives.uploadDate)                           AS lastUploadDate,
   COUNT(actives.isLeasing = 'IS_PLEDGE_HOLDER') > 0 AS isLeasing,
   COUNT(
           arrests.beginDate IS NOT NULL
               AND
           arrests.amount IS NOT NULL
   ) = COUNT(arrests.id)                             AS isArrestAllActives,
   COUNT(
           actives.cost IS NOT NULL
               AND
           arrests.beginDate IS NULL
               AND
           arrests.amount IS NULL
   ) > 0                                             AS isExistsNoArrestedActive
FROM actives
LEFT JOIN arrests ON actives.id = arrests.activeId
LEFT JOIN wanteds ON actives.id = wanteds.activeId                    
LEFT JOIN evaluations ON actives.id = evaluations.activeId
LEFT JOIN realizations AS realizationFirst
    ON
        realizationFirst.id = evaluations.activeId
      AND
        realizationFirst.stage = 'FIRST'
LEFT JOIN realizations AS realizationSecond
    ON
        realizationSecond.id = evaluations.activeId
      AND
        realizationSecond.stage = 'SECOND'
LEFT JOIN refund_property ON actives.id = refund_property.activeId
LEFT JOIN debit_foreclosure ON actives.id = debit_foreclosure.activeId
WHERE 
    actives.clientId IN (${Prisma.join(clientIds)})
  ${additionalCondition} 
  AND
    actives.isVisible = 1
GROUP BY actives.clientId
`;