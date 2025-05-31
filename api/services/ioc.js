const { IUserService } = require('./interfaces/IUserService');
const { injectable } = require('inversify');

class UserService extends IUserService {
    async findUser(username) {
        // Example implementation
        return { username };
    }
    async createUser(userData) {
        return { id: 1, ...userData };
    }
    async updateUser(id, userData) {
        return { id, ...userData };
    }
    async deleteUser(id) {
        return { deleted: true, id };
    }
    async getUser(id) {
        return { id, username: 'example' };
    }
    async getAllUsers(query) {
        return [{ id: 1, username: 'example' }];
    }
}

injectable()(UserService);

module.exports = { UserService };