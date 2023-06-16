const userMasterModel = require("../models/userMaster.model");

module.exports.validateUser = async (params, conn) => {
  let jarr = [];

  const dataSet = await userMasterModel.getUserMaster(params, conn);
  //   if (dataSet.length === 0) return jarr;
  //   jarr = dataSet.map((obj) => ({
  //     user_id: obj.USER_ID,
  //     username: obj.USERNAME,
  //     OFFICE: obj.OFFICE,
  //   }));
  userList = dataSet.map((obj) => ({
    username: obj.USERNAME,
    password: obj.USER_PASSWORD,
    office: obj.OFFICE,
    title: obj.TITLE,
    full_access: obj.FULL_ACCESS,
  }));
  const userIndex = userList.findIndex(
    (user) =>
      user.username === params.username && user.password === params.password
  );

  if (userIndex > -1) {
    jarr.push(userList[userIndex]);
  }

  return jarr;
};
