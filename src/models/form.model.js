module.exports.getFormList = async (params, conn) => {
  let sql = ``;
  let bind_values = {};

  if (params.full_access === "Y") {
    sql = `select a.* from(
            select m.form_id, m.form_type_seq, m.form_type, f1.title, m.office, m.status, f1.submission_date, m.create_by, f1.meeting_period_from, f1.meeting_period_to from form_master m
            join form1_details f1 on m.form_id = f1.form_id
            union
            select m.form_id, m.form_type_seq, m.form_type, f2.title, m.office,m.status, f2.submission_date, m.create_by,f2.meeting_period_from, f2.meeting_period_to  from form_master m
           join form2_details f2 on m.form_id = f2.form_id)a
           where a.status not in ('Close', 'Draft') 
      `;
  } else {
    sql = `select a.* from(
          select m.form_id, m.form_type_seq, m.form_type, f1.title, m.office,m.status, f1.submission_date,f1.meeting_period_from, f1.meeting_period_to, m.create_by from form_master m
            join form1_details f1 on m.form_id = f1.form_id
            union
            select m.form_id, m.form_type_seq, m.form_type, f2.title, m.office,m.status, f2.submission_date, f2.meeting_period_from, f2.meeting_period_to,m.create_by  from form_master m
           join form2_details f2 on m.form_id = f2.form_id)a
           where a.create_by = :username `;
    bind_values.username = params.username;
  }

  return await conn.doQuery(sql, bind_values);
};

module.exports.insertFormMaster = async (params, conn) => {
  let sql = `insert into form_master(form_id, form_type_seq, form_type, office, status, create_date, create_by, update_date, update_by)
                values(:form_id, :form_type_seq, :form_type, :office, :status,sysdate, :username, sysdate, :username)`;
  let bind_values = {
    form_id: params.form_id,
    form_type_seq: params.form_type_seq,
    form_type: params.form_type,
    office: params.office,
    status: params.status,
    username: params.username,
  };
  await conn.doQuery(sql, bind_values);
};

module.exports.updateFormMaster = async (params, conn) => {
  let sql = `update form_master set update_date = sysdate, update_by = :username, status=:status where form_id = :form_id`;
  let bind_values = {
    form_id: params.form_id,
    username: params.username,
    status: params.status,
  };
  return await conn.doQuery(sql, bind_values);
};
