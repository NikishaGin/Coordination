const query = {
    getRegions: "SELECT DISTINCT region AS regionCode FROM meta LEFT JOIN resolutions res ON meta.inn = res.inn WHERE res.is_derivative_debt = ? AND is_archive = ? ORDER BY region ASC",
    getRegionName: "SELECT regionName FROM regions WHERE regionCode = ?",
    getDebtTypes: "SELECT * FROM debt_type"
}


export default query