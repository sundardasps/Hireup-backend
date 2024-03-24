import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//---------------------------------------------JWT token----------------------------------------//

export function tokenJwt(exist) {
  const token = jwt.sign({ exist }, process.env.jwtSecretKey, {
    expiresIn: "30d",
  });
  return token;
}

//---------------------------------------------Password hasher----------------------------------------//

export function passwordHasher(password) {
  const pass = bcrypt.hash(password, 10);
  return pass;
}
