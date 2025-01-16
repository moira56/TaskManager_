const JWT_SECRET = process.env.JWT_SECRET;

const autorizacijaMiddleware = async (req, res, next) => {
  console.log('Authorization Header:', req.headers.autorizacijaMiddleware);

  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token nije dostavljen' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Nevaljan JWT token' });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Greska u autentifikaciji', error);
    res.status(500).json({ error: 'Greska u autentifikaciji' });
  }
};
export default autorizacijaMiddleware;