import express from 'express';
import { connectToDatabase } from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDatabase();
    const users = db.collection("users");

    if (!username || !password) {
      return res.status(400).json({ error: 'Korisničko ime i lozinka su obavezni.' });
    }

    const postojeciUser = await users.findOne({ username });
    if (postojeciUser) {
      return res.status(400).json({ error: 'Korisničko ime već postoji. Odaberite drugo korisničko ime' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword
    };

    const result = await users.insertOne(newUser);
    const token = jwt.sign({ userId: result.insertedId, username: username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Registracija uspješna! Dobrodošli.',
      userId: result.insertedId,
      token: token
    });
  } catch (error) {
    console.error('Greška prilikom registracije:', error);
    res.status(500).json({ error: 'Došlo je do pogreške prilikom registracije' });
  }
});

router.post('/login', async (req, res) => {
  console.log('Pokušaj prijave za korisnika:', req.body.username);

  try {
    const { username, password } = req.body;
    const db = await connectToDatabase();
    const users = db.collection("users");
    console.log('Spojeno na bazu podataka');

    if (!username || !password) {
      console.log('Nedostaju podaci za prijavu.');
      return res.status(400).json({ error: 'Korisničko ime i lozinka su obavezni' });
    }

    const user = await users.findOne({ username });
    if (!user) {
      console.log('Korisnik nije pronađen:', username);
      return res.status(400).json({ error: 'Neispravno korisničko ime ili lozinka' });
    }

    console.log('Korisnik pronađen:', username);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Pogrešna lozinka za korisnika:', username);
      return res.status(400).json({ error: 'Neispravno korisničko ime ili lozinka' });
    }

    console.log('Lozinka ispravna za korisnika:', username);

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    console.log('Token uspješno generiran za korisnika:', username);
    res.status(200).json({
      message: 'Prijava uspješna! Dobrodošli natrag',
      token
    });
  } catch (error) {
    console.error('Greška prilikom prijave:', error);
    res.status(500).json({ error: 'Došlo je do pogreške prilikom prijave. Pokušajte ponovo kasnije' });
  }
});

export default router;
