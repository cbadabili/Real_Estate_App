
import { DatabaseStorage } from "../storage";
import { userRepository } from "../repositories/user-repository";
import { propertyRepository } from "../repositories/property-repository";

// Single source of truth for storage
export const storage = new DatabaseStorage();

// Export repositories for direct access when needed
export { userRepository, propertyRepository };

// Export storage interface types
export type { IStorage } from "../storage";
