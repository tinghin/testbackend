const express = require("express");
const app = express();
const cors = require("cors");
const oracledb = require("./src/utils/oracledb.utils");
const port = 8080;
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(require("./src/routes/"));

let server;
(async () => {
  await oracledb.createPool();
  server = app.listen(port, () => {
    console.log(`Service is listening on ${port}`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.log(err);
  process.exit(1);
});
