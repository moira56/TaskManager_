import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const autorizacijaMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Nije dostavljen token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Token nije valjan' });
    }

    req.user_id = decoded.user_id;

    next();
  } catch (error) {
    console.error('Greska u autentifikaciji', error);
    res.status(500).json({ error: 'Greska' });
  }
};

export default autorizacijaMiddleware;
