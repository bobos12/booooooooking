import { UserService } from './UserService.js';

class ServiceContainer {
    constructor() {
        this.services = new Map();
        this.initializeServices();
    }

    initializeServices() {
        // Register services
        this.services.set('userService', new UserService());
        // Add more services here as needed
    }

    get(serviceName) {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service;
    }
}

// Create a singleton instance
const serviceContainer = new ServiceContainer();

export default serviceContainer; 