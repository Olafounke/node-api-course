const validate = (schema) => (req, res, next) => {
  try {
    if (!schema) {
      throw new Error("Le schéma de validation est manquant ou mal importé.");
    }
    
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        error: "Erreur de validation des données",
        errors: error.errors.map(err => ({ champ: err.path ? err.path[0] : 'inconnu', error: err.message }))
      });
    }
    

    console.error("Erreur attrapée par le validateur :", error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = validate;