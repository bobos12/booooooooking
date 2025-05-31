import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const createUser = async (data) => {
    const salt = bcrypt.genSaltSync(10); // generate salt with 10 rounds
    const hash = bcrypt.hashSync(data.password, salt); // hash password with salt
    const user = new User({ ...data, password: hash }); // create User model instance with hashed password
    return user.save(); // save user to database and return result (Promise)
};
