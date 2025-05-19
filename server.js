
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(__dirname));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/offers", (req, res) => res.sendFile(path.join(__dirname, "offers.html")));
app.get("/requests", (req, res) => res.sendFile(path.join(__dirname, "requests.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.listen(process.env.PORT || 3000, () => console.log("Сървърът е активен."));
