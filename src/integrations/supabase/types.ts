// Import modular types
import * as ModularTypes from './types/index';

// Re-export all types from the modular system
export * from './types/index';

// For backward compatibility
export type Json = ModularTypes.Json;

// No need for duplicate type definitions
// The Database interface is now imported from the modular system
// This is just a re-export for backward compatibility
export type Database = ModularTypes.Database;

// Re-export helper types for backward compatibility
export type Tables<T extends keyof Database['public']['Tables']> = ModularTypes.Tables<T>
export type Insertable<T extends keyof Database['public']['Tables']> = ModularTypes.Insertable<T>
export type Updatable<T extends keyof Database['public']['Tables']> = ModularTypes.Updatable<T>
