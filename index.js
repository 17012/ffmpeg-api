const express = require("express");
const Transcoder = require("stream-transcoder");
const bodyParser = require("body-parser");
const cors = require("cors");
inspect = require("util").inspect;
const Busboy = require("busboy");
var app = express();

app.use(cors());
app.use(bodyParser.json());
// var bodyParser = new StreamBodyParser(app);

app.post("/", function (req, res) {
  console.log(req.body);
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    console.log(
      "File [" +
        fieldname +
        "]: filename: " +
        filename +
        ", encoding: " +
        encoding +
        ", mimetype: " +
        mimetype
    );
    file.pipe(res);
  });
  busboy.on("field", function (
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    console.log("Field [" + fieldname + "]: value: " + val);
  });
  busboy.on("finish", function () {
    console.log("Done parsing form!");
    // res.writeHead(303, { Connection: "close", Location: "/" });
    // res.send('hello')
    res.end();
  });
  req.pipe(busboy);
});

app.get("/", (req, res) => res.send("17012"));

app.listen(3000);
