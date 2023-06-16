const form2Service = require("../services/form2.services");
const dbConnectUtils = require("../utils/dbConn.utils");
const moment = require("moment");

module.exports.getFormDetails = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    let params = {
      form_id: req.params.form_id,
    };
    let json = await form2Service.getFormDetails(params, conn);
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

module.exports.insertFormDetails = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    let params = {
      form_type_seq: req.body.form_type_seq,
      form_type: req.body.form_type,
      office: req.body.office,
      title: req.body.title,
      form_description: req.body.description,
      submission_date: req.body.submission_date
        ? moment(req.body.submission_date).format("YYYY/MM/DD")
        : null,
      meeting_period_from: req.body.meeting_period_from
        ? moment(req.body.meeting_period_from).format("YYYY/MM/DD")
        : null,
      meeting_period_to: req.body.meeting_period_to
        ? moment(req.body.meeting_period_to).format("YYYY/MM/DD")
        : null,
      username: req.body.username,
    };
    let form_id = await form2Service.insertFormDetails(params, conn);
    await conn.doCommit();
    return res.send(
      `Message: Create Form successfully (form_id:${form_id}). Redirect to Homepage after 2 seconds`
    );
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

module.exports.updateFormStatus = async (req, res) => {
  let conn;
  try {
    conn = await dbConnectUtils.init();
    let params = {
      form_id: req.body.form_id,
      form_comment: req.body.form_comment,
      status: req.body.status,
      username: req.body.username,
    };
    await form2Service.updateFormStatus(params, conn);
    await conn.doCommit();
    return res.send(
      `Message: ${req.body.status} form successfully. Redirect to Homepage after 2 seconds`
    );
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
