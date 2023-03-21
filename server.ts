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
let db: Link[] = JSON.parse(Deno.readTextFileSync(dbFile));

// Stands for update db
const udb = () => {
  db = JSON.parse(Deno.readTextFileSync(dbFile));
};

// @ts-ignore What is the type?
app.get("/", (req, res) => {
  res.send(db);
});

// @ts-ignore What is the type?
app.get("/:shortened", (req, res) => {
  const shortened = req.params.shortened;
  udb();
  const link = db.find((link) => link.shortened === shortened);
  if (link) {
    res.redirect(link.url);
  } else {
    res.status(404).send("Not found");
  }
});

// @ts-ignore What is the type?
app.get("/link/:shortened", (req, res) => {
  const shortened = req.params.shortened;
  udb();
  const link = db.find((link) => link.shortened === shortened);
  if (link) {
    res.status(200).send(link.url);
  } else {
    res.status(404).send("Not found");
  }
});

// @ts-ignore What is the type?
app.post("/link", (req, res) => {
  const { url, length } = req.body;
  const shortened: string = crypto.randomUUID().toString().replace(/-/g, "")
    .substring(
      0,
      length ? length : 5,
    );

  if (!url) {
    res.status(400).send("Bad request; specifiy url in json body");
    return;
  }
  const link: Link = { url, shortened };
  udb();
  db.push(link);
  Deno.writeTextFileSync(dbFile, JSON.stringify(db));

  res.status(200).send(link.shortened);
});

app.listen(port, () => {
  console.log(`Chat server up and running on port: ${port}`);
});
