const oracledb = require("./oracledb.utils");

class DBConnection {
  constructor() {
    this.conn = null;
  }

  async connect() {
    await this.getConnection();
  }

  async getConnection(poolAlias = oracledb.POOL_ALIAS) {
    if (!this.conn) {
      this.conn = await oracledb.getConnection(poolAlias);
      console.log("Database connection is obtained.");
    }
    return this.conn;
  }

  async close() {
    await this.closeConnection();
  }

  async closeConnection() {
    if (this.conn) {
      try {
        this.conn.close();
        console.log("Database connection is released.");
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }

  async execute(sql, bind_params) {
    console.log(sql);
    console.log("%o", bind_params);
    try {
      let resultSet = await this.conn.execute(sql, bind_params);
      return resultSet;
    } catch (err) {
      console.log(err);
    }
  }

  async doQuery(sql, bind_params) {
    let resultSet = await this.execute(sql, bind_params);
    return resultSet.rows ?? resultSet.outBinds ?? resultSet.rowsAffected ?? [];
  }

  async getNextval(sequence_table) {
    let sql = `select ${sequence_table}.NEXTVAL from DUAL`;
    let result = await this.doQuery(sql, {});

    return result[0].NEXTVAL;
  }

  async doCommit() {
    if (this.conn) {
      await this.conn.commit();
      console.log("Data changes has been committed.");
    }
  }

  async doRollback() {
    if (this.conn) {
      await this.conn.rollback();
      console.log("Data changes has been rolled back.");
    }
  }
}

//get the database connection by one functions
module.exports.init = async (poolAlias = oracledb.POOL_ALIAS) => {
  const dbconn = new DBConnection();
  await dbconn.getConnection(poolAlias);
  return dbconn;
};
