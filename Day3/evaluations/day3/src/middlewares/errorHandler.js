const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    
    console.error(`[${new Date().toISOString()}] ${err.message}`);
  
    res.status(status).json({
      error: status === 500 && process.env.NODE_ENV === 'production' 
        ? "Erreur interne serveur" 
        : err.message
    });
  };
  
  const notFound = (req, res) => {
    res.status(404).json({ error: "Route non trouvée" });
  };
  
  module.exports = { errorHandler, notFound };