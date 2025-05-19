const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database("./db/database.db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ secret: "secure123", resave: false, saveUninitialized: true }));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        req.session.user = "admin";
        res.redirect("/dashboard");
    } else {
        res.send("Грешни данни");
    }
});

app.get("/dashboard", (req, res) => {
    if (req.session.user === "admin") {
        res.sendFile(path.join(__dirname, "views", "dashboard.html"));
    } else {
        res.redirect("/");
    }
});

app.post("/add-offer", (req, res) => {
    const { project, client, deadline, price } = req.body;
    db.run("INSERT INTO offers (project, client, deadline, price) VALUES (?, ?, ?, ?)", [project, client, deadline, price]);
    res.redirect("/dashboard");
});

app.get("/offers", (req, res) => {
    db.all("SELECT * FROM offers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => console.log("Сървърът работи на порт " + PORT));