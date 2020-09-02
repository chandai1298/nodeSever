const port = process.env.PORT || 1300;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "12345",
  database: "luanvan",
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("start");
});

//notification
var FCM = require("fcm-node");
var schedule = require("node-schedule");
var serverKey =
  "AAAABHijFh4:APA91bHHja5Kf7kmtTiAmkFlxAY6d89_GeLpjtD8ItQhkTEgg6PuiflhWWUdViAUfKNBioaDI0lDQBOegu1b7HVg_vwWYWDpDDKFn_g5z6zSO4G7LsI9DSkvz0hlfm6-RVZu58FIFS7W";
var fcm = new FCM(serverKey);

let stt = "";
schedule.scheduleJob("0 * * * * *", function () {
  // con.query(
  //   `select status from overview where title="Nhắc nhở từ vựng" and id_user=1`,
  //   function (error, rows, fields) {
  //     if (error) console.log(error);
  //     else {
  //       stt = rows[0].status === "true" ? true : false;
  //       if (stt) {
  //         fcm.send(
  //           {
  //             to:
  //               "do4thMIyT9-nrOaEtgycmu:APA91bGC8tco9BKseFP1dhUPOCpc6VLyZbNvvnP_slnP6CQ7-DOKn1lGujEadXSbusAqUYbSSg3o7bqO2_2qqIz8cIp8qOVVS9eu9R7RSVPHP-gOym1YKwIUIC-am2bT068i3mBK6H_m",
  //             notification: {
  //               title: "chó Hoài",
  //               body: "Me may",
  //               soundName: "plucky.mp3",
  //             },
  //             data: {
  //               my_key: "my value",
  //               my_another_key: "my another value",
  //             },
  //           },
  //           function (err, response) {
  //             if (err) {
  //               console.log("Something has gone wrong!");
  //             } else {
  //               console.log("Successfully sent with response: ", response);
  //             }
  //           }
  //         );
  //       } else console.log("ko gwi ");
  //     }
  //   }
  // );
});
con.connect(function (error) {
  if (error) console.log(error);
  else console.log("connected");
});

// Information APP
//du lieu Home
app.get("/getDataApp_Home", function (req, res) {
  con.query("select * from `category`", function (error, rows, fields) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});

// du lieu config
app.post("/getConfig", function (req, res) {
  var user = req.body;
  var query =
    "select * from `overview` where id_user=" +
    user.id_user +
    " and type=" +
    user.type;
  con.query(query, [user.id_user, user.type], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/initConfig", function (req, res) {
  var user = req.body;
  var query = "call insertConfig(?)";
  con.query(query, [user.id], (err, rows, fields) => {
    if (!err) {
      res.send("ok");
    } else {
      console.log(err);
    }
  });
});
// lay ten bai hoc va cac link lien ket toi bai hoc
app.post("/getLession", function (req, res) {
  var category = req.body;
  var query =
    "select l.id, l.id_category, l.link, l.name,l.image,l.imageCheck from `lession` l JOIN `category` c on l.id_category = c.id where c.id=" +
    category.id +
    " and c.isActive=1 and l.isActive=1";

  con.query(query, [category.id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/getPart", function (req, res) {
  con.query("select * from `part` where type=?", [req.body.type], function (
    error,
    rows,
    fields
  ) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});
//danh sach cau hoi trong tung part trong tung de thi
app.post("/getQuestionPart", function (req, res) {
  var category = req.body;
  var query =
    "select q.id,q.id_part,q.title_question,q.id_lession,q.question,q.dapanA,q.dapanB,q.dapanC,q.dapanD,q.answer,q.image,q.sound,q.description\
  from `question` as q,`lession` as l,`category` as c, `part` as p, (SELECT q.sound as ss\
  from `question` q where q.id_part= " +
    category.id_part +
    " GROUP BY q.sound) as q2 \
   WHERE c.id=l.id_category and l.id=q.id_lession and c.id=" +
    category.id +
    " and p.id=q.id_part and l.id=" +
    category.id_lession +
    " and q.sound=q2.ss;";
  con.query(
    query,
    [category.id, category.id_part, category.id_lession],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
// Information USER
app.post("/getUser", function (req, res) {
  var user = req.body;
  var query =
    "SELECT Id,Username,Name,Email,Avatar,RoleId,IsActive FROM `User` where Id= " +
    user.Id;
  con.query(query, [user.Id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/searchFriend", function (req, res) {
  var user = req.body;
  var query =
    "select u.`Name`, u.Username, u.Avatar from `user` u\
    where u.`Name` like ? or u.Username like ? or u.Email like ?";
  con.query(query, [user.name, user.name2, user.name3], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/getTotalFriend", function (req, res) {
  var user = req.body;
  var query =
    "select count(*) as count from `friend` f where f.id_user = " + user.Id;
  con.query(query, [user.Id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/getScoreFriend", function (req, res) {
  var user = req.body;
  var query =
    "SELECT u.`Name`,u.Avatar, r.total_score, u.Username from (select  f.id_friend as id\
    from `user` u join `friend` f on u.Id = f.id_user\
    where u.Id =?) as id_friend join `user` u  join `rank` r on id_friend.id = u.Id and r.id_user=u.Id";
  con.query(query, [user.Id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.get("/getTopRank", function (req, res) {
  var user = req.body;
  var query =
    "select u.`Name`, r.total_score,u.Avatar\
    from `user` u join `rank` r on u.id = r.id_user\
    ORDER BY r.total_score desc limit 10";
  con.query(query, (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

app.get("/getData", function (req, res) {
  con.query("select * from `User`", function (error, rows, fields) {
    if (error) console.log(error);
    else {
      console.log("ok");
      res.send(rows);
    }
  });
});
app.post("/getWord", function (req, res) {
  var user = req.body;
  //   var query = "CALL login ('" + user.username + "','" + user.password + "')";
  var query = "select * from `Dictionary` where word='" + user.word + "'";
  con.query(query, [user.word], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/getAllWords", function (req, res) {
  var user = req.body;
  var query = "call limitPage(?,?)";
  con.query(query, [user.limit, user.page], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

app.post("/sendData", function (req, res) {
  var query =
    "INSERT INTO `User` (username, email, password)  VALUES ('" +
    req.body.username +
    "', '" +
    req.body.email +
    "','" +
    req.body.password +
    "')";
  con.query(query, function (error, rows, fields) {
    if (error) console.log(error);
    else {
      res.send(rows);
    }
  });
});
app.post("/checkLogin", function (req, res) {
  var user = req.body;
  var query = "select * from `User` where Username='" + user.username + "'";
  con.query(query, [user.username], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.post("/RankOfUser", function (req, res) {
  var user = req.body;
  var query = "SELECT * FROM `rank` where id_user=" + user.id;
  con.query(query, [user.id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.put("/UpdateAvatar", function (req, res) {
  var user = req.body;
  var query = "UPDATE `User` SET Avatar = ? WHERE Id = ?";
  con.query(query, [user.Avatar, user.Id], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
app.put("/UpdateScore", function (req, res) {
  var user = req.body;
  var query =
    "UPDATE `rank` SET crown = ?, current_score = ?, total_score = ? WHERE id_user = ?";
  con.query(
    query,
    [user.crown, user.current_score, user.total_score, user.id_user],
    (err, rows, fields) => {
      if (!err) {
        res.send("Cập nhật thành công!");
      } else {
        console.log(err);
      }
    }
  );
});
app.put("/UpdateHint", function (req, res) {
  var user = req.body;
  var query = "UPDATE `rank` SET hint = ? WHERE id_user = ?";
  con.query(query, [user.hint, user.id_user], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
//cap nhat thong tin user
app.put("/UpdateName", function (req, res) {
  var user = req.body;
  var query = "UPDATE `User` SET Name = ? WHERE Id = ?";
  con.query(query, [user.Name, user.Id], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
app.put("/UpdatePassWord", function (req, res) {
  var user = req.body;
  var query = "UPDATE `User` SET Password = ? WHERE Id = ?  and Password= ?";
  con.query(
    query,
    [user.PasswordN, user.Id, user.Password],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows.affectedRows == 1 ? "Cập nhật thành công!" : "Thất bại!");
      } else {
        console.log(err);
      }
    }
  );
});
app.put("/UpdateEmail", function (req, res) {
  var user = req.body;
  var query = "UPDATE `User` SET Email = ? WHERE Id = ?";
  con.query(query, [user.Email, user.Id], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
app.put("/UpdateOverviewSetting", function (req, res) {
  var user = req.body;
  var query = "UPDATE `overview` SET status =? WHERE title = ? and id_user= ?";
  con.query(query, [user.status, user.title, user.Id], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
app.put("/UpdateTokenNotification", function (req, res) {
  var user = req.body;
  var query = "UPDATE `notification` SET token =? WHERE id_user= ?";
  con.query(query, [user.token, user.id_user], (err, rows, fields) => {
    if (!err) {
      res.send("Cập nhật thành công!");
    } else {
      console.log(err);
    }
  });
});
