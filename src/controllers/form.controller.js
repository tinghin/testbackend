const formService = require("../services/form.services");
const dbConnectUtils = require("../utils/dbConn.utils");

module.exports.getFormList = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    let params = {
      full_access: req.params.full_access,
      username: req.params.username,
    };
    let json = await formService.getFormList(params, conn);
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

module.exports.batchApprove = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    for (const id of req.body.form_id) {
      let params = {
        form_id: id,
        username: req.body.username,
        status: req.body.status,
      };
      await formService.updateFormMaster(params, conn);
    }
    await conn.doCommit();
    return res.send("Message: Approve Forms Successfully");
  } catch (err) {
    res.status(500).json({ message: "Error in invocation of API" });
    await conn.doRollback();
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};
