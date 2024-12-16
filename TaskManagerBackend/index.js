import express from "express";
import cors from "cors";

const PORT = 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskManagerBackend");
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na portu ${PORT}`);
});
