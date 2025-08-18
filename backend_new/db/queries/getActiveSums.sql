-- @param {String} $1:clientIdsArray

SELECT
    actives.clientId,
    SUM(description.cost) AS totalSum,
    SUM(arrests.amount) AS arrest,
    SUM(evaluations.amount) AS evaluation,
    SUM(refund_property.amount) AS refundProperty
FROM actives
         LEFT JOIN description_actives AS description ON actives.id = description.id
         LEFT JOIN arrests ON actives.id = arrests.activeId
         LEFT JOIN evaluations ON actives.id = evaluations.activeId
         LEFT JOIN refund_property ON actives.id = refund_property.activeId
WHERE
    actives.clientId IN ?
  AND
    actives.isVisible = 1
GROUP BY actives.clientId