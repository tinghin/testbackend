module.exports.insertFormDetails = async (params, conn) => {
  let sql = `insert into form1_details(details_id,form_id, title, form_description, submission_date, form_comment, meeting_period_from, meeting_period_to)
                  values(:details_id, :form_id, :title, :form_description, to_date(:submission_date,'YYYY/MM/DD'),null, to_date(:meeting_period_from,'YYYY/MM/DD'),to_date(:meeting_period_to,'YYYY/MM/DD'))`;
  let bind_values = {
    details_id: params.details_id,
    form_id: params.form_id,
    title: params.title,
    form_description: params.form_description,
    submission_date: params.submission_date,
    meeting_period_from: params.meeting_period_from,
    meeting_period_to: params.meeting_period_to,
  };
  await conn.doQuery(sql, bind_values);
};

module.exports.getFormDetails = async (params, conn) => {
  let sql = `select m.form_id, m.create_date, m.create_by,m.office, f1.title, f1.form_description, f1.submission_date,f1.meeting_period_from, f1.meeting_period_to,
                 m.status, f1.form_comment from form_master m join form1_details f1 on m.form_id = f1.form_id
                 where m.form_id = :form_id`;
  let bind_values = {
    form_id: params.form_id,
  };
  return await conn.doQuery(sql, bind_values);
};

module.exports.updateFormStatus = async (params, conn) => {
  let sql = `update form1_details set form_comment = :form_comment where form_id = :form_id`;
  let bind_values = {
    form_id: params.form_id,
    form_comment: params.form_comment,
  };
  await conn.doQuery(sql, bind_values);
};

module.exports.updateFormDetails = async (params, conn) => {
  let sql = `update form1_details set title=:title, form_description=:form_description, 
        meeting_period_from = to_date(:meeting_period_from, 'YYYY/MM/DD'), meeting_period_to=to_date(:meeting_period_to, 'YYYY/MM/DD') where form_id = :form_id`;
  let bind_values = {
    form_id: params.form_id,
    title: params.title,
    form_description: params.form_description,
    meeting_period_from: params.meeting_period_from,
    meeting_period_to: params.meeting_period_to,
  };
  await conn.doQuery(sql, bind_values);
};
