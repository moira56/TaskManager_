import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const tasks = await collection.find({}).toArray();
        res.json(tasks);
    } catch (error) {
        console.error("Greska: ", error);
        res.status(500).send("Greska");
    }
});

router.post("/", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");

        const tasks = req.body;

        if (!Array.isArray(tasks)) {
            return res.status(400).json({ error: "Mora biti polje" });
        }
        for (const task of tasks) {
            if (!task.naslov || !task.opis || typeof task.zavrsen !== "boolean" || !Array.isArray(task.tags)) {
                return res.status(400).json({ error: "Svi podaci moraju biti ispunjeni" });
            }
        }

        await collection.insertMany(tasks);
        res.status(201).json({ message: "Zadaci dodani" });
    } catch (error) {
        console.error("Greska", error);
        res.status(500).send("Greska");
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const taskId = req.params.id;

        const result = await collection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { zavrsen: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Zadatak nije pronađen" });
        }

        res.status(200).json({ message: "Azuriran zadatak" });
    } catch (error) {
        console.error("Greska", error);
        res.status(500).send("Greska");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const taskId = req.params.id;

        const result = await collection.deleteOne({ _id: new ObjectId(taskId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Zadatak nije pronađen" });
        }

        res.status(200).json({ message: "Obrisan zadatak" });
    } catch (error) {
        console.error("Greska", error);
        res.status(500).json({ error: "Greska" });
    }
});

router.post("/novi", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");

        const { naslov, opis, tags } = req.body;
        const user_id = req.body.userId;

        if (!naslov || !opis || !Array.isArray(tags)) {
            return res.status(400).json({ error: "Svi podaci moraju biti ispunjeni" });
        }

        const noviTask = {
            naslov,
            opis,
            tags,
            zavrsen: false,
            user_id
        };

        const result = await collection.insertOne(noviTask);

        const insertedTask = { ...noviTask, _id: result.insertedId };
        res.status(201).json(insertedTask);
    } catch (error) {
        console.error("Greska", error);
        res.status(500).send("Greska");
    }
});

export default router;