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
            return res.status(404).json({ error: "Nisu pronađeni zadaci za ovog korisnika" });
        }
        res.json(tasks);
    } catch (error) {
        console.error("Pogreška prilikom dohvaćanja zadataka", error);
        res.status(500).send("Došlo je do pogreške prilikom dohvaćanja zadataka");
    }
});

router.post("/", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const tasks = req.body;
        if (!Array.isArray(tasks)) {
            return res.status(400).json({ error: "Ulazni podaci moraju biti polje" });
        }
        for (const task of tasks) {
            if (!task.naslov || !task.opis || typeof task.zavrsen !== "boolean" || !Array.isArray(task.tags)) {
                return res.status(400).json({ error: "Neispravni podaci za zadatak" });
            }
        }
        await collection.insertMany(tasks);
        res.status(201).json({ message: "Zadaci su uspješno spremljeni" });
    } catch (error) {
        console.error("Pogreška prilikom dodavanja zadataka", error);
        res.status(500).send("Došlo je do pogreške prilikom dodavanja zadataka");
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
            return res.status(404).json({ error: "Zadatak nije pronađen ili nije moguće ažurirati" });
        }
        res.status(200).json({ message: "Zadatak je uspješno označen kao dovršen" });
    } catch (error) {
        console.error("Pogreška prilikom ažuriranja zadatka", error);
        res.status(500).send("Došlo je do pogreške prilikom ažuriranja zadatka");
    }
});

router.delete("/:id", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");
        const taskId = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(taskId), userId: new ObjectId(req.userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Zadatak nije pronađen za brisanje" });
        }
        res.status(200).json({ message: "Zadatak je uspješno obrisan" });
    } catch (error) {
        console.error("Pogreška prilikom brisanja zadatka", error);
        res.status(500).json({ error: "Došlo je do pogreške prilikom brisanja zadatka" });
    }
});

router.post("/novi", autorizacijaMiddleware, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("tasks");

        const { naslov, opis, tags } = req.body;
        if (!naslov || !opis || !Array.isArray(tags)) {
            return res.status(400).json({ error: "Naslov, opis i oznake su obavezni" });
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
        console.error("Pogreška prilikom dodavanja novog zadatka", error);
        res.status(500).send("Došlo je do pogreške prilikom dodavanja novog zadatka");
    }
});

export default router;
