import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "7838",
  port: 5432
})
db.connect()

app.get("/", async(req, res) => {
  const data = await db.query("SELECT * FROM items ORDER BY id");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: data.rows,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  console.log(item)
  try
  {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item])
    res.redirect("/")
  }
  catch(err)
  {
    console.error("Error is: ", err.message)
    res.redirect("/")
  }
});

app.post("/edit", async (req, res) => {
  const title = req.body.updatedItemTitle
  const id = req.body.updatedItemId
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [title, id])
  res.redirect("/")
});

app.post("/delete", async(req, res) => {
  const deleteId = req.body.deleteItemId
  await db.query("DELETE FROM items WHERE id = $1", [deleteId])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
