process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import https from "https";
import fs from "fs";
const Transcoder = require("stream-transcoder");
const bodyParser = require("body-parser");
const cors = require("cors");
const inspect = require("util").inspect;
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
    res.setHeader("content-type", "video/mp4");

    ffmpeg(file)
      .videoCodec("libx264")
      .audioCodec("libfdk_aac")
      .format("mp4")
      .outputOptions("-movflags frag_keyframe+empty_moov")
      .on("error", function (err, stdout, stderr) {
        console.log(err.message); //this will likely return "code=1" not really useful
        console.log("stdout:\n" + stdout);
        console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
      })
      .pipe(res, { end: true });
  });
  busboy.on("field", function (
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    console.log("Field [" + fieldname + "]: value: " + inspect(val));
  });
  busboy.on("finish", function () {
    console.log("Done parsing form!");
  });
  req.pipe(busboy);
});

app.get("/", (req, res) => res.send("17012 ;p"));

const port = process.env.PORT || 17012;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
