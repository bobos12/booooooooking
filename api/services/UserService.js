import { IUserService } from './interfaces/IUserService.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { create_error } from '../utils/error.js';

export class UserService extends IUserService {
    constructor() {
        super();
    }

    async findUser(username) {
        return await User.findOne({ username });
    }

    async createUser(userData) {
        // Check if username or email already exists
        const existingUser = await User.findOne({ 
            $or: [
                { username: userData.username },
                { email: userData.email }
            ]
        });
        
        if (existingUser) {
            if (existingUser.username === userData.username) {
                throw create_error(400, "Username already exists");
            } else {
                throw create_error(400, "Email already exists");
            }
        }
        
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userData.password, salt);
        
        // Create new user
        const newUser = new User({
            ...userData,
            password: hash,
        });
        
        // Save user
        const savedUser = await newUser.save();
        
        // Remove password from response
        const { password, ...userDetails } = savedUser._doc;
        
        return userDetails;
    }

    async updateUser(id, userData) {
        // If password is being updated, hash it
        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
        }
        
        const updatedUser = await User.findByIdAndUpdate(id, { $set: userData }, { new: true });
        if (!updatedUser) {
            throw create_error(404, "User not found");
        }
        return updatedUser;
    }

    async deleteUser(id) {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw create_error(404, "User not found");
        }
        return "User deleted successfully";
    }

    async getUser(id) {
        const user = await User.findById(id);
        if (!user) {
            throw create_error(404, "User not found");
        }
        return user;
    }

    async getAllUsers(query) {
        const { limit, page = 1, countTotal } = query;
        
        // If countTotal is true, just return the count
        if (countTotal === 'true') {
            const totalUsers = await User.countDocuments();
            return {
                total: totalUsers,
                page: parseInt(page),
                limit: limit ? parseInt(limit) : 'all'
            };
        }
        
        // Build query
        const dbQuery = User.find();
        
        // Apply pagination only if limit is provided
        if (limit) {
            const limitValue = parseInt(limit);
            const skip = (parseInt(page) - 1) * limitValue;
            dbQuery.skip(skip).limit(limitValue);
        }
        
        // Execute query and return results
        return await dbQuery.exec();
    }
} 