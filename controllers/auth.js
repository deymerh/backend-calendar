const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async (req, res = response) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya existe'
      });
    }
    user = new User(req.body);
    //Encript password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    //Save in DB
    await user.save();
    res.status(201).json({ ok: true, msg: 'User registered', uid: user.id, name: user.name });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Email no existe'
      });
    }
    //Confirm the passwords
    const validatePasswords = bcrypt.compareSync(password, user.password);
    if (!validatePasswords) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta'
      })
    }
    //Generate JWT
    const token = await generateJWT(user.id, user.name);
    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
  } catch (error) {
    console.log('Este es el PERRO ERROR', error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador!!!!'
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;
  const token = await generateJWT(uid, name);
  res.json({ ok: true, uid, name, msg: `renew token: ${token}` });
};

module.exports = {
  registerUser,
  loginUser,
  revalidateToken
};