import express from "express";
import { create, deleteBill, getAll, getOne, update } from "../controller/billController.js";
import User from "../model/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const route = express.Router();

route.post("/create", create);
route.get("/getall", getAll);
route.get("/getone/:id", getOne);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteBill);


//Requests für Login und Register

route.post("/login", async (req, res) => {
  try {
      const { Email, Passwort } = req.body;

      // Überprüfe, ob der Benutzer existiert
      const user = await User.findOne({ Email });
      if (!user) {
          return res.status(401).json({ msg: "Ungültige Anmeldeinformationen" });
      }

      // Überprüfe das Passwort
      const isPasswordValid = await bcrypt.compare(Passwort, user.Passwort);
      if (!isPasswordValid) {
          return res.status(401).json({ msg: "Ungültige Anmeldeinformationen" });
      }

      // Erstelle und signiere das JWT-Token
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7h' });

      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Serverfehler" });
  }
});

route.post('/register', async (req, res) => {
  try {
      const { Name, Email, Passwort } = req.body;

      // Überprüfe, ob der Benutzer bereits existiert
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
          return res.status(400).json({ msg: 'Der Benutzer existiert bereits.' });
      }

      // Hash des Passworts erstellen
      const hashedPassword = await bcrypt.hash(Passwort, 10);

      // Erstelle einen neuen Benutzer mit dem gehashten Passwort
      const newUser = new User({
          Name,
          Email,
          Passwort: hashedPassword,
      });

      // Speichere den Benutzer in der Datenbank
      await newUser.save();

      res.status(201).json({ msg: 'Registrierung erfolgreich.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Serverfehler.' });
  }
});


export default route;