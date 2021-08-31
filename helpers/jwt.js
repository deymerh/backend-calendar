const jwt = require('jsonwebtoken');

const generateJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const paylaod = { uid, name };
    jwt.sign(paylaod, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h'
    }, (err, token) => {
      if (err) {
        console.log('Error en la generacion: ', err);
        reject('No se pudo generar el token');
      }
      resolve(token);
    });
  });
};

module.exports = {
  generateJWT
}