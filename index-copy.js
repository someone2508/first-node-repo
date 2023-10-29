const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Hi from / get request!");
  //   res.send("I am your cute little response form the api!");
  res.json({
    status: "success",
    message: "Hi am another more cuter response!",
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: "success",
    message: `I am a post api response!`,
  });
});

app.patch("/", (req, res) => {
  console.log(req.body);
  res.send({
    status: "success",
    message: "I am a patch api call!",
  });
});

app.delete("/", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    status: "success",
    message: "Its a delete endpoint!",
  });
});

app.listen(3000, () => {
  console.log("Server started listening at port 3000!");
});
