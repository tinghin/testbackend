//get the database connection by one functions
module.exports.writeConditions = async (
  conditions,
  params,
  where_clauses,
  bind_params
) => {
  for (let i = 0; i < conditions.length; i++) {
    let condition = conditions[i];

    condition.opt = condition.opt || [];
    if (!Array.isArray(condition.opt)) {
      condition.opt = [condition.opt];
    }

    if (!Array.isArray(condition.col)) {
      condition.col = [condition.col];
    }

    for (let col of condition.col) {
      await this.writeCondition(
        condition.op,
        col,
        condition.key,
        params,
        condition.opt,
        where_clauses,
        bind_params
      );
    }
  }
};

module.exports.writeConditionForDateRange = async (
  condition,
  column,
  startdate_key,
  enddate_key,
  params,
  clause,
  bindParams
) => {
  //or ( start >= stdate and end <= edate )
  //and (start >= sdate and end <= edate )
  if (condition !== null && column !== null) {
    let nbindParams = {};
    let columnName = `trunc(${column})`;
    let conjOperator = condition.toLowerCase();

    let startdate_clause = "";
    if (params[startdate_key]) {
      let bindStartValue = params[startdate_key];
      let operator_start = ">=";
      let bindStartKey = `to_date(:${startdate_key}, '${global.format.datetime.oracledb}')`;
      nbindParams[startdate_key] = bindStartValue;

      startdate_clause = `${columnName} ${operator_start} ${bindStartKey}`;
    }

    let enddate_clause = "";
    if (params[enddate_key]) {
      let bindEndValue = params[enddate_key];
      let operator_end = "<=";
      let bindEndKey = `to_date(:${enddate_key}, '${global.format.datetime.oracledb}')`;
      nbindParams[enddate_key] = bindEndValue;

      enddate_clause = `${columnName} ${operator_end} ${bindEndKey}`;
    }

    let predicate = "";

    if (startdate_clause.length > 0 && enddate_clause.length > 0) {
      predicate = `${conjOperator} ( ${startdate_clause} and ${enddate_clause})`;
    } else if (startdate_clause.length > 0) {
      predicate = `${conjOperator} ${startdate_clause}`;
    } else if (enddate_clause.length > 0) {
      predicate = `${conjOperator} ${enddate_clause}`;
    }

    if (predicate.length > 0) {
      clause.push(predicate);
      Object.assign(bindParams, nbindParams);
    }
  }
};

module.exports.writeCondition = async (
  sql_operators,
  table_column,
  input_param_key,
  input_params,
  clause_operators,
  clause_statments,
  bind_params
) => {
  let bind_value = input_params[input_param_key];
  let bind_key = `:${input_param_key}`;
  let bind_key_values = {};
  let operator = "=";

  let nested_full_condition = "";
  let nested_sql_operators = "";

  if (!bind_value) {
    //if no value presents, no need to write the where clause
    return;
  }

  if (Array.isArray(bind_value) && !clause_operators.includes("in")) {
    //auto detect if the bind_value should be a WhereIn selection
    clause_operators.push("in");
    return writeCondition(
      sql_operators,
      table_column,
      input_param_key,
      input_params,
      clause_operators,
      clause_statments,
      bind_params
    );
  }

  if (clause_operators.includes("ignoreCase")) {
    if (typeof bind_value === "string") {
      table_column = `UPPER(${table_column})`;
      bind_value = bind_value.toUpperCase();
    }
  }

  sql_operators = sql_operators.toLowerCase();

  if (clause_operators.length <= 0) {
    bind_key_values[input_param_key] = bind_value;
  } else {
    for (const clause_operator of clause_operators) {
      if (operator === "=") {
        switch (clause_operator.toLowerCase()) {
          case "in":
          case "not in":
            operator = clause_operator;

            if (Array.isArray(bind_value)) {
              let inStmt_bind_keys = [];
              let bind_values = [...new Set(bind_value)]; //remove duplicates
              table_column = `('inSelect', ${table_column})`;
              bind_values.map((bind_value, index) => {
                let bind_key_index = `${input_param_key}_${index}`; //bind_key already contains ":"
                inStmt_bind_keys.push(`('inSelect', :${bind_key_index})`);
                bind_key_values[bind_key_index] = bind_value;
              });

              bind_key = `(${inStmt_bind_keys.join(", ")})`;
              //table_column = (inSelect, USER_SEQ)
              //operator = in
              //bind_key = ((inSelect, :user_seq_1), (inSelect, :user_seq_2))
              //bind_params = {user_seq_1: 123, user_seq_2: 234}
            } else {
              bind_key = `(${bind_key})`;
              bind_key_values[input_param_key] = bind_value;
            }
            break;
          case "like":
            operator = clause_operator;
            if (!bind_value.startsWith("%") && !bind_value.endsWith("%")) {
              bind_value = `%${bind_value}%`;
            }
            bind_key_values[input_param_key] = bind_value;
            break;
          case "date":
          case "dateBegin":
          case "dateEnd":
            if (clause_operator === "dateBegin") {
              operator = ">=";
            } else if (clause_operator === "dateEnd") {
              operator = "<=";
            }
            table_column = `trunc(${table_column})`;
            bind_key = `to_date(${bind_key}, '${global.format.datetime.oracledb}')`;
            bind_key_values[input_param_key] = bind_value;
          case "null":
            operator = "is";
            bind_key = `NULL`;
            break;
          case "not null":
            operator = "is";
            bind_key = `not NULL`;
            break;
          default:
            bind_key_values[input_param_key] = bind_value;
            break;
        }
      } else {
        //special nested case
        switch (clause_operator.toLowerCase()) {
          case "or null":
            nested_sql_operators = "or";
            nested_full_condition = `${table_column} is NULL`;
            break;
          case "or not null":
            nested_sql_operators = "or";
            nested_full_condition = `${table_column} is not NULL`;
            break;
          default:
            throw new Error(
              `"${clause_operator}" operator can only be used when the previous operator is "="`
            );
        }
      }
    }
  }

  let condition = "";
  if (nested_full_condition) {
    condition = `${sql_operators} ( ${table_column} ${operator} ${bind_key} ${nested_sql_operators} ${nested_full_condition} )`;
  } else {
    condition = `${sql_operators} ${table_column} ${operator} ${bind_key}`;
  }
  clause_statments.push(condition);
  Object.assign(bind_params, bind_key_values);
};
