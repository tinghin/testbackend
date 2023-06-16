const formModel = require("../models/form.model");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
module.exports.getFormList = async (params, conn) => {
  let jarr = [];

  const dataSet = await formModel.getFormList(params, conn);

  if (dataSet.length === 0) return jarr;

  jarr = dataSet.map((obj) => ({
    id: obj.FORM_ID,
    form_type_seq: obj.FORM_TYPE_SEQ,
    form_type: obj.FORM_TYPE,
    title: obj.TITLE,
    office: obj.OFFICE,
    status: obj.STATUS,
    submission_date: moment(obj.SUBMISSION_DATE).format("YYYY/MM/DD"),
    meeting_period_from: moment(obj.MEETING_PERIOD_FROM).format("YYYY/MM/DD"),
    meeting_period_to: moment(obj.MEETING_PERIOD_TO).format("YYYY/MM/DD"),
    meeting_period: `${
      obj.MEETING_PERIOD_FROM
        ? moment(obj.MEETING_PERIOD_FROM).format("YYYY/MM/DD")
        : ""
    } - ${
      obj.MEETING_PERIOD_TO
        ? moment(obj.MEETING_PERIOD_TO).format("YYYY/MM/DD")
        : ""
    }`,
    create_by: obj.CREATE_BY,
  }));

  return jarr;
};

module.exports.updateFormMaster = async (params, conn) => {
  await formModel.updateFormMaster(params, conn);
};

module.exports.insertFormMaster = async (params, conn) => {
  let form_id = uuidv4();
  params.form_id = form_id;
  await formModel.insertFormMaster(params, conn);
  return form_id;
};
