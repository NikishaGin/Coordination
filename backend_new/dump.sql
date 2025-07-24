INSERT INTO coordination_new.users (regionCode, role, login, passwordHash, firstName, lastName, secondName)
SELECT
    region,
    CASE
        WHEN role = 'user'  THEN 'User'
        WHEN role = 'admin' THEN 'Admin'
        WHEN role = 'limited_admin' THEN 'LimitedAdmin'
        WHEN (role = 'gmu_limited_admin') OR (role = 'gmu_arkhangelsk_admin') THEN 'LimitedAdminGMU'
    END,
    username,
    password,
    name,
    surname,
    patronymic
FROM coordination.users;


INSERT INTO coordination_new.regions (regionCode, regionName, sonoName)
SELECT
    regionCode,
    regionName,
    sonoName
FROM coordination.regions;


INSERT INTO coordination_new.debtor_persons (regoinId, inn, name, category, codeTNO, codeSOSP)


INSERT INTO coordination_new.settings (serviceMode) VALUE (False);

