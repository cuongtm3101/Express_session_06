const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const mysql = require("mysql2");

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "cms_schema",
});

let db = pool.promise();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hahahhaa");
});

app.get("/blogs", (req, res) => {
  res.sendFile("/blogs.html", { root: "./public" });
});

app.get("/users", (req, res) => {
  res.sendFile("/users.html", { root: "./public" });
});

// API routes
// users

app.get("/api/v1/users", async (req, res) => {
  try {
    console.log("Hello world");
    // Truy vấn vào CSDL
    let [result, column] = await db.execute("SELECT * FROM tbl_user");
    // let result = (await db.execute("SELECT * FROM tbl_user"))[0]
    // let column = (await db.execute("SELECT * FROM tbl_user"))[1]
    // array destructuring
    res.status(200).json(result);

    // SELECT ra toàn bộ bản ghi có trong bảng user
    // Trả về toàn bộ bản ghi đó
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

app.get("/api/v1/users/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    // Truy vấn vào CSDL
    let [result, column] = await db.execute(
      "SELECT * FROM tbl_user WHERE user_id = ?",
      [id]
    );
    // let result = (await db.execute("SELECT * FROM tbl_user"))[0]
    // let column = (await db.execute("SELECT * FROM tbl_user"))[1]
    // array destructuring
    res.status(200).json(result);

    // SELECT ra toàn bộ bản ghi có trong bảng user
    // Trả về toàn bộ bản ghi đó
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

app.put("/api/v1/users/:id", async (req, res) => {
  try {
    let { id } = req.params; // object destructuring
    const { name, email, phone, website } = req.body;
    console.log(id);
    // Truy vấn vào CSDL
    await db.execute(
      "UPDATE tbl_user SET name = ?, email = ?, phone = ?, website = ? WHERE user_id = ?",
      [name, email, phone, website, id]
    );
    // let result = (await db.execute("SELECT * FROM tbl_user"))[0]
    // let column = (await db.execute("SELECT * FROM tbl_user"))[1]
    // array destructuring
    res.status(200).json({
      message: "Update successfully",
      status: "success",
    });

    // SELECT ra toàn bộ bản ghi có trong bảng user
    // Trả về toàn bộ bản ghi đó
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

app.delete("/api/v1/users/:id", async (req, res) => {
  try {
    let { id } = req.params; // object destructuring
    // Truy vấn vào CSDL
    await db.execute("DELETE FROM tbl_user WHERE user_id = ?", [id]);
    // let result = (await db.execute("SELECT * FROM tbl_user"))[0]
    // let column = (await db.execute("SELECT * FROM tbl_user"))[1]
    // array destructuring
    res.status(200).json({
      message: "Delete successfully",
      status: "success",
    });

    // SELECT ra toàn bộ bản ghi có trong bảng user
    // Trả về toàn bộ bản ghi đó
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

app.get("*", (req, res) => {
  res.send("PAGE NOT FOUND");
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
