const loginService = require("../services/login.services");
const dbConnectUtils = require("../utils/dbConn.utils");

module.exports.validateUser = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    let params = { username: req.body.username, password: req.body.password };
    let json = await loginService.validateUser(params, conn);
    return res.json(json);
  } catch (err) {
    res.status(500).json({ message: "Error in invocation of API" });
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};
