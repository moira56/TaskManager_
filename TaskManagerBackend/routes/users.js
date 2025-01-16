import express from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from "../db.js";

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Korisničko ime i lozinka su obavezni' });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Korisnik s tim imenom već postoji' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'Korisnik uspješno registriran' });
  } catch (error) {
    console.error('Greška tijekom registracije:', error);
    res.status(500).json({ error: 'Došlo je do problema tijekom registracije' });
  }
});

export default router;