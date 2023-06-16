const form2Model = require("../models/form2.model");
const formService = require("./form.services");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

module.exports.getFormDetails = async (params, conn) => {
  let jarr = {};

  const dataSet = await form2Model.getFormDetails(params, conn);

  if (dataSet.length === 0) return jarr;

  let data = dataSet[0];

  jarr.form_id = data.FORM_ID;
  jarr.create_date = moment(data.CREATE_DATE).format("YYYY/MM/DD");
  jarr.submission_date = data.SUBMISSION_DATE
    ? moment(data.SUBMISSION_DATE).format("YYYY/MM/DD")
    : null;
  jarr.meeting_period_from = data.MEETING_PERIOD_FROM
    ? moment(data.MEETING_PERIOD_FROM).format("YYYY/MM/DD")
    : null;
  jarr.meeting_period_to = data.MEETING_PERIOD_TO
    ? moment(data.MEETING_PERIOD_TO).format("YYYY/MM/DD")
    : null;
  jarr.create_by = data.CREATE_BY;
  jarr.office = data.OFFICE;
  jarr.title = data.TITLE;
  jarr.description = data.FORM_DESCRIPTION;
  jarr.status = data.STATUS;
  jarr.comment = data.FORM_COMMENT;

  return jarr;
};

module.exports.updateFormStatus = async (params, conn) => {
  await formService.updateFormMaster(params, conn);
  await form2Model.updateFormStatus(params, conn);
};

module.exports.insertFormDetails = async (params, conn) => {
  let form_id = await formService.insertFormMaster(params, conn);
  params.form_id = form_id;
  let details_id = uuidv4();
  params.details_id = details_id;
  await form2Model.insertFormDetails(params, conn);
  return details_id;
};
