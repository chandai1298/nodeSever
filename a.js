const port = process.env.PORT || 1300;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "35.220.157.219",
  port: "3306",
  user: "root",
  password: "12345", //empty for window
  database: "learning",
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("start");
});

const fs = require("fs");
let sao = "";
let sao2 = "";
let sao3 = "";
let sao4 = "";
let tru = "";
let tru2 = "";
let tru3 = "";
let tru4 = "";
let word = "";
let pronounced = "";
con.connect(function (error) {
  fs.readFile("vietanh.dict", "utf-8", (err, data) => {
    if (err) throw err;
    var res = data.split("@");
    for (let index = 1; index < res.length; index++) {
      var item = res[index];
      word = item.split("\n")[0].split(" /")[0].trim();
      // if (word === "across") {
      // pronounced =
      //   item.split("\n")[0].split(" /")[1] === undefined
      //     ? ""
      //     : item.split("\n*  ")[0].split(" ")[1].trim();
      if (item.split("*  ")[1] !== undefined) {
        sao = item.split("*  ")[1].split("\n- ")[0].toString().trim();
        tru = item
          .split("*  ")[1]
          .replace(sao.trim() + "\n", "")
          .trim();
      }
      if (item.split("*  ")[2] !== undefined) {
        sao2 = item.split("* ")[2].split("\n- ")[0].toString().trim();
        tru2 = item
          .split("*  ")[2]
          .replace(sao2.trim() + "\n", "")
          .trim();
      }
      if (item.split("*  ")[3] !== undefined) {
        sao3 = item.split("* ")[3].split("\n- ")[0].toString().trim();
        tru3 = item
          .split("*  ")[3]
          .replace(sao3.trim() + "\n", "")
          .trim();
      }
      if (item.split("*  ")[4] !== undefined) {
        sao4 = item.split("* ")[4].split("\n- ")[0].toString().trim();
        tru4 = item
          .split("*  ")[4]
          .replace(sao4.trim() + "\n", "")
          .trim();
      }
      if (sao === "") tru = item.replace(word, "").trim();

      var query =
        "INSERT INTO DictionaryVieToEn \
    (Word,  Type1, Content1, Type2,  Content2,  Type3,  Content3,  Type4,  Content4)\
      VALUES  ('" +
        word +
        "', ' "  +
        sao +
        "', ' " +
        tru +
        "', ' " +
        sao2 +
        "', ' " +
        tru2 +
        "', ' " +
        sao3 +
        "',' " +
        tru3 +
        "', ' " +
        sao4 +
        "', ' " +
        tru4 +
        "')";
      con.query(query, function (error, rows, fields) {
        if (error) console.log(error);
        else {
          console.log(rows);
        }
      });
      sao = "";
      sao2 = "";
      sao3 = "";
      sao4 = "";
      tru = "";
      tru2 = "";
      tru3 = "";
      tru4 = "";
      word = "";
      // pronounced = "";
      // }
    }
    // console.log(word);

    // console.log(word);
    // console.log(pronounced);
    // console.log(sao);
    // console.log(sao2);
    // console.log(sao3);
    // console.log(sao4);
    // console.log(tru);
    // console.log(tru2);
    // console.log(tru3);
    // console.log(tru4);

    // con.query(query, function (error, rows, fields) {
    //   if (error){}
    //   // console.log(error);
    //   else {
    //     console.log(rows);
    //   }
    // });
  });
});
