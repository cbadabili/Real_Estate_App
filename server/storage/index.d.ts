import { DatabaseStorage } from "../storage";
import { userRepository } from "../repositories/user-repository";
import { propertyRepository } from "../repositories/property-repository";
export declare const storage: DatabaseStorage;
export { userRepository, propertyRepository };
export type { IStorage } from "../storage";
