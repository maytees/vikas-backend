import express from "npm:express@4.18.2";

const app = express();
const port = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface Link {
  url: string;
  shortened: string;
}

const dbFile = "./db.json";
const db: Link[] = JSON.parse(Deno.readTextFileSync(dbFile));

app.get("/", (req, res) => {
  res.send(db);
});

app.get("/:shortened", (req, res) => {
  const shortened = req.params.shortened;
  const link = db.find((link) => link.shortened === shortened);
  if (link) {
    res.redirect(link.url);
  } else {
    res.status(404).send("Not found");
  }
});

app.post("/link", (req, res) => {
  const { url } = req.body;
  const shortened: string = crypto.randomUUID().toString().substring(0, 8);

  if (!url) {
    res.status(400).send("Bad request; specifiy url in json body");
    return;
  }
  const link: Link = { url, shortened };
  db.push(link);
  Deno.writeTextFileSync(dbFile, JSON.stringify(db));

  res.status(200).send(link);
});

app.listen(port, () => {
  console.log(`Chat server up and running on port: ${port}`);
});
