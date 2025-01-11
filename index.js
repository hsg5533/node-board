const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const whitelist = ["http://localhost"]; // 접속 허용 주소
const app = express();
const conn = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "nodeboard",
});
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      console.log(file),
        fs.existsSync("./uploads/") ||
          fs.mkdirSync("./uploads/", { recursive: !0 }),
        callback(null, "./uploads/");
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
});
// cors 설정 (허용된 주소면 접속 허용)
app.use(
  cors({
    origin(req, res) {
      console.log("접속된 주소: " + req),
        -1 == whitelist.indexOf(req) && req
          ? res(Error("허가되지 않은 주소입니다."))
          : res(null, !0);
    },
    credentials: !0,
    optionsSuccessStatus: 200,
  })
);
// 허용된 주소면 데이터 접근 허용
app.all("/*", function (req, res, next) {
  let ip = req.headers.origin;
  (-1 == whitelist.indexOf(ip) && ip) ||
    (res.header("Access-Control-Allow-Origin", ip),
    res.header("Access-Control-Allow-Headers", "X-Requested-With"),
    next());
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

// 게시글 목록 보기
app.get("/view", function (req, res) {
  const sql = "select * from board";
  conn.query(sql, function (err, result) {
    if (err) console.log("query is not excuted: " + err);
    else res.send(result);
  });
});

// 게시글 쓰기
app.post("/insert", upload.single("img"), function (req, res) {
  const body = req.body;
  const sql = "SELECT count(*)+1 as bnum FROM board ";
  conn.query(sql, function (err, result) {
    if (err) {
      console.log("query is not excuted: " + err);
    } else {
      const sql =
        "insert into board (bnum,id,title,content,writedate) values(?,?,?,?,NOW())";
      const params = [result[0].bnum, body.id, body.title, body.content];
      conn.query(sql, params, function (err) {
        if (err) {
          console.log("query is not excuted: " + err);
        } else if (req.file != null) {
          // 만약 업로드 된 파일이 있다면
          const sql =
            "insert into file (bnum,savefile,filetype,writedate) values (?,?,?,now())";
          const params = [body.bnum, req.file.originalname, req.file.mimetype];
          conn.query(sql, params, function (err) {
            if (err) {
              console.log("query is not excuted: " + err);
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// 게시글 보기
app.get("/read/:bnum", function (req, res) {
  const sql = "select * from board where bnum=" + req.params.bnum;
  conn.query(sql, function (err, result) {
    if (err) {
      console.log("query is not excuted: " + err);
    } else {
      res.send(result);
    }
  });
});

// 게시글 수정
app.post("/update/:bnum", function (req, res) {
  const body = req.body;
  const sql =
    "update board set id=?, title=?, content=? where bnum=" + req.params.bnum;
  const params = [body.id, body.title, body.content];
  conn.query(sql, params, function (err) {
    if (err) {
      console.log("query is not excuted: " + err);
    } else {
      res.sendStatus(200);
    }
  });
});

// 게시글 삭제
app.delete("/delete/:bnum", function (req, res) {
  const sql = "delete from board where bnum=" + req.params.bnum;
  conn.query(sql, function (err) {
    if (err) {
      console.log("query is not excuted: " + err);
    } else {
      res.sendStatus(200);
    }
  });
});

// 이미지 파일 불러오기
app.get("/img/:bnum", function (req, res) {
  const sql = "select * from file where bnum=" + req.params.bnum;
  conn.query(sql, function (err, result) {
    if (err) {
      console.log("query is not excuted: " + err);
    } else if (result.length != 0) {
      fs.readFile("uploads/" + result[0].savefile, function (err, data) {
        res.writeHead(200, { "Context-Type": "text/html" });
        res.end(data);
      });
    } else {
      res.sendStatus(200);
    }
  });
});

// 서버 동작중인 표시
app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);
