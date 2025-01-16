import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";
import autorizacijaMiddleware from '../middleware/autorizacija.js';

const router = express.Router();
router.get("/", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const tasks = await collection.find({ userId: new ObjectId(req.userId) }).toArray();

        if (tasks.length === 0) {
            return res.status(404).json({ error: "Nema zadataka za ovog korisnika" });
        }
        res.json(tasks);
    } catch (error) {
        console.error("Greska u dohvacanju", error);
        res.status(500).send("Greska u dohvacanju.");
    }
});

router.post("/", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const tasks = req.body;
        if (!Array.isArray(tasks)) {
            return res.status(400).json({ error: "Nije polje." });
        }
        for (const task of tasks) {
            if (!task.naslov || !task.opis || typeof task.zavrsen !== "boolean" || !Array.isArray(task.tags)) {
                return res.status(400).json({ error: "Nedostaju podaci" });
            }
        }
        await collection.insertMany(tasks);
        res.status(201).json({ message: "Zadaci uspjesno dodani" });
    } catch (error) {
        console.error("Greska u dodavanju", error);
        res.status(500).send("Greska u dodavanju.");
    }
});

router.patch("/:id", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const taskId = req.params.id;

        const result = await collection.updateOne(
            { _id: new ObjectId(taskId), userId: new ObjectId(req.userId) },
            { $set: { zavrsen: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Nije pronadjen" });
        }
        res.status(200).json({ message: "Azuriran" });
    } catch (error) {
        console.error("Greska u azuriranju", error);
        res.status(500).send("Greska u azuriranju");
    }
});

router.delete("/:id", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const taskId = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(taskId), userId: new ObjectId(req.userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Nije pronadjen" });
        }
        res.status(200).json({ message: "Obrisan" });
    } catch (error) {
        console.error("Greska u brisanju", error);
        res.status(500).json({ error: "Greska u brisanju" });
    }
});

router.post("/novi", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");

        const { naslov, opis, tags } = req.body;
        if (!naslov || !opis || !Array.isArray(tags)) {
            return res.status(400).json({ error: "Nedostaju podaci" });
        }
        const noviTask = {
            naslov,
            opis,
            tags,
            zavrsen: false,
            userId: new ObjectId(req.userId),
        };

        const result = await collection.insertOne(noviTask);
        const insertedTask = { ...noviTask, _id: result.insertedId };
        res.status(201).json(insertedTask);
    } catch (error) {
        console.error("Greska u dodavanju", error);
        res.status(500).send("Greska u dodavanju.");
    }
});
export default router;