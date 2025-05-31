import serviceContainer from '../services/ServiceContainer.js';

const userService = serviceContainer.get('userService');

export const createUser = async (req, res, next) => {
    try {
        const userDetails = await userService.createUser(req.body);
        res.status(201).json(userDetails);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers(req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
