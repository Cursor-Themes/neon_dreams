// Neon Dreams Theme Showcase - TypeScript

// Interface definitions
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

// Type aliases and unions
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  timestamp: Date;
};

type UserRole = 'admin' | 'user' | 'moderator';
type EventType = 'create' | 'update' | 'delete';

// Generic interface
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: number, updates: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}

// Abstract class with generics
abstract class BaseService<T extends { id: number }> {
  protected abstract repository: Repository<T>;
  
  async getById(id: number): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error(`Error fetching entity with id ${id}:`, error);
      return null;
    }
  }

  abstract validate(entity: T): boolean;
}

// Implementation class
class UserService extends BaseService<User> {
  private userCache: User[] = [];
  protected repository: Repository<User>;

  constructor(repo: Repository<User>) {
    super();
    this.repository = repo;
  }

  // Method with complex return type
  async getUsersWithFilters(
    role: UserRole,
    ageRange: [number, number],
    activeOnly: boolean = true
  ): Promise<ApiResponse<User[]>> {
    try {
      const allUsers = await this.repository.findAll();
      
      const filteredUsers = allUsers.filter((user: User) => {
        const ageCheck = user.age ? 
          user.age >= ageRange[0] && user.age <= ageRange[1] : 
          false;
        return ageCheck && (!activeOnly || this.isUserActive(user));
      });

      return {
        data: filteredUsers,
        status: 'success' as const,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        data: [],
        status: 'error' as const,
        timestamp: new Date()
      };
    }
  }

  // Method with function overloads
  validate(entity: User): boolean;
  validate(entity: User, strict: boolean): boolean;
  validate(entity: User, strict?: boolean): boolean {
    const basicValidation = entity.name.length > 0 && 
                           entity.email.includes('@');
    
    if (strict) {
      return basicValidation && 
             entity.age !== undefined && 
             entity.age > 0;
    }
    
    return basicValidation;
  }

  private isUserActive(user: User): boolean {
    // Complex logic here
    return user.preferences.notifications && user.age !== undefined;
  }
}

// Utility types and mapped types
type PartialUser = Partial<User>;
type UserUpdatePayload = Pick<User, 'name' | 'email'> & {
  preferences?: Partial<UserPreferences>;
};

type UserKeys = keyof User;
type RequiredUserFields = Required<Pick<User, 'id' | 'name' | 'email'>>;

// Generic function with constraints
function createApiResponse<T extends Record<string, any>>(
  data: T,
  status: 'success' | 'error' = 'success'
): ApiResponse<T> {
  return {
    data,
    status,
    timestamp: new Date()
  };
}

// Advanced generics with conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

function assertNonNull<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error('Value cannot be null or undefined');
  }
}

// Enum with string values
enum HttpStatus {
  OK = 'OK',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

// Class with static methods and private fields
class ApiClient {
  private static readonly BASE_URL = 'https://api.example.com';
  private readonly apiKey: string;
  #requestCount = 0; // Private field

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  static createHeaders(contentType: string = 'application/json'): HeadersInit {
    return {
      'Content-Type': contentType,
      'Accept': 'application/json'
    };
  }

  async request<TResponse = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<TResponse> {
    this.#requestCount++;
    
    const url = `${ApiClient.BASE_URL}${endpoint}`;
    const headers = {
      ...ApiClient.createHeaders(),
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  get requestCount(): number {
    return this.#requestCount;
  }
}

// Export types and implementations
export type { User, UserPreferences, ApiResponse, UserRole };
export { UserService, ApiClient, HttpStatus, createApiResponse }; 