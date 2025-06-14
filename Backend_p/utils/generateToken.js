//  generateToken.js

const jwt = require('jsonwebtoken');

 const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,  
  });
};

module.exports = generateToken;
