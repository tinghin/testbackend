const oracledb = require("oracledb");
oracledb.initOracleClient();
const POOL_ALIAS = "form_pool";

module.exports.createPool = async (pool_attr = {}) => {
  let pool = null;

  try {
    pool = oracledb.getPool(pool_attr.pool_alias);
  } catch (err) {
    pool = await oracledb.createPool({
      user: "wcmtest",
      password: "wcmtest",
      connectString:
        "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = rac-scan.ouhk.edu.hk)(PORT = 1521))(CONNECT_DATA =(SERVER= DEDICATED)(SERVICE_NAME = T19CDB)))",
      poolAlias: pool_attr.pool_alias,
      poolIncrement: pool_attr.poolIncrement || 2,
      autoCommit: pool_attr.auto_commit || false,
      _enableStats: true,
    });

    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    console.log(
      "Oracle client library version is " + oracledb.oracleClientVersionString
    );
    console.log(`The database connection pool has been created.`);
  }

  return pool;
};

module.exports.getPool = async (poolAlias = POOL_ALIAS) => {
  let pool = oracledb.getPool(poolAlias);
  //console.log(`The connection pool is already created.`)
  return pool;
};

module.exports.closePool = async (poolAlias = POOL_ALIAS) => {
  try {
    let pool = await this.getPool(poolAlias);
    await pool.close();
    console.log("The database connection pool has been closed.");
  } catch (err) {
    console.log("No alive database connection pool for close.");
  }
};

module.exports.getConnection = async (poolAlias = POOL_ALIAS) => {
  let conn;

  try {
    conn = await oracledb.getConnection(poolAlias);
  } catch (err) {
    let pool = await this.createPool();
    conn = await pool.getConnection();
  }

  //console.log('The database has been connected.')
  return conn;
};

module.exports.closeConnection = async (conn) => {
  try {
    if (conn) {
      await conn.close();
      //console.log('The database connection has been closed.')
    } else {
      console.log(`There is no alive database connection for close.`);
    }
  } catch (err) {
    console.log(`Unable to close database connection, reason: ${err.message}`);
  }
};

module.exports.keepConnection = async () => {
  let conn;
  try {
    conn = await this.getConnection();
    let sql = `select 1 from DUAL`;
    await conn.execute(sql, {});
  } catch (err) {
    console.log(`Unable to connect database, reason: ${err.message}`);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};
