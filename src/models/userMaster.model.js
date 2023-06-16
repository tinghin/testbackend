module.exports.getUserMaster = async (params, conn) => {
  const sql = `select * from user_master where status='Y'`;
  bind_values = {};
  return await conn.doQuery(sql, bind_values);
};
