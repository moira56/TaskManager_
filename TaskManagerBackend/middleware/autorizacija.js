import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const autorizacijaMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    console.log('Authorization Header: Bearer [MASKED]');
  } else {
    console.log('Authorization Header: Nema tokena');
  }

  try {
    if (!token) {
      return res.status(401).json({ error: 'Nije dostavljen token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Nevaljani JWT token' });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Greska', error);
    res.status(500).json({ error: 'Greska' });
  }
};
export default autorizacijaMiddleware;