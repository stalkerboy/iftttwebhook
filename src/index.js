import oracledb from "oracledb";
import DBConfig from "../config/dbconfig";
import Webhook from "../config/webhook";
import axios from "axios";

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection(DBConfig);

    const binds = {};

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    };

    const sql = `SELECT TO_CHAR(CURRENT_DATE, 'DD-Mon-YYYY HH24:MI') AS CD FROM DUAL`;
    let result = await connection.execute(sql, binds, options);
    console.log("Current date query results: ");
    console.log(result.rows[0]["CD"]);

    axios
      .post(`${Webhook.URL}${Webhook.EVENT}${Webhook.KEY}`, {
        value1: "fail1",
        value2: "success",
        value3: "fail3",
      })
      .then(function (response) {
        console.log("axios posted");
      })
      .catch(function (error) {
        console.log("axios post error", error);
      });
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// run();

const delay = (time, a) => new Promise((resolve) => setTimeout(() => resolve(a), time));

async function recur() {
  return Promise.all([delay(1000 * 30), run()]).then(recur);
}
// recur();

run();
