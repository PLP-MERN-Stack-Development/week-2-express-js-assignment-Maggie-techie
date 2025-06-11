const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== 'my-secret-key') {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }

  next(); // Authorized, proceed
};

module.exports = auth;
