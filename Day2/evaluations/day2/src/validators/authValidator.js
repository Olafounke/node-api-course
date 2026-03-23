const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Le format du mail est invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

const loginSchema = z.object({
  email: z.string().email("Le format du mail est invalide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe")
});

module.exports = { registerSchema, loginSchema };