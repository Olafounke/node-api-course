const authorize = (roleRequired) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== roleRequired) {
      return res.status(403).json({ message: "Accès refusé : Role admin requis" });
    }
    next();
  };
};

module.exports = authorize;