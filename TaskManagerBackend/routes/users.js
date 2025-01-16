import express from 'express';
import bcrypt from 'bcrypt';
import { connectToDatabase } from "../db.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ 
        message: 'Registriran uspješno',
        user_id: result.insertedId 
    });
  } catch (error) {
    console.error('Greška:', error);
    res.status(500).json({ error: 'Dogodila se greška na serveru' });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await connectToDatabase();
        const users = db.collection("users");

        if (!username || !password) {
            return res.status(400).json({ error: 'Username i password su obavezni' });
        }

        const user = await users.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Neispravno korisnicko ime ili lozinka' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Neispravno korisnicko ime ili lozinka' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ 
            message: 'Prijava uspjesna',
            token
        });
    } catch (error) {
        console.error('Greska u prijavi', error);
        res.status(500).json({ error: 'Greska u prijavi' });
    }
})

export default router;
