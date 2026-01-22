import bcrypt from 'bcryptjs';

// Mock users data
export const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: '$2a$10$8WP0BS9GwbCwOp7NOUIcZuFzcyP.yvcXVfkFnkH41xznAJCj2c3j2', // password: 'demo123'
    name: 'Demo User',
  },
];

// Mock vehicles data
export const mockVehicles = [
  {
    id: '1',
    vin: 'WBADT43452G730905',
    address: '123 Fleet St, New York, NY',
    expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/vehicle1.jpg',
    title: 'BMW 5 Series',
    fuelLevel: 75,
    engineStatus: true,
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: '40.7128,-74.0060',
  },
  {
    id: '2',
    vin: '2HGEJ6A35DH520876',
    address: '456 Auto Ave, Los Angeles, CA',
    expiryTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/vehicle2.jpg',
    title: 'Honda Civic',
    fuelLevel: 45,
    engineStatus: true,
    lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: '34.0522,-118.2437',
  },
  {
    id: '3',
    vin: '5TDJKRFH8LS123456',
    address: '789 Drive Way, Chicago, IL',
    expiryTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    image: '/vehicle3.jpg',
    title: 'Toyota Highlander',
    fuelLevel: 85,
    engineStatus: false,
    lastUpdate: new Date().toISOString(),
    location: '41.8781,-87.6298',
  },
];

export type User = typeof mockUsers[0];
export type Vehicle = typeof mockVehicles[0];

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Find user by email
export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find(user => user.email === email);
}

// Create new user
export async function createUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: String(mockUsers.length + 1),
    email,
    password: hashedPassword,
    name,
  };
  mockUsers.push(newUser);
  return newUser;
}

// Get all vehicles
export function getAllVehicles(): Vehicle[] {
  return mockVehicles;
}

// Get vehicle by ID
export function getVehicleById(id: string): Vehicle | undefined {
  return mockVehicles.find(v => v.id === id);
}

// Create vehicle
export function createVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
  const newVehicle: Vehicle = {
    ...vehicle,
    id: String(Math.max(...mockVehicles.map(v => parseInt(v.id))) + 1),
  };
  mockVehicles.push(newVehicle);
  return newVehicle;
}

// Update vehicle
export function updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
  const index = mockVehicles.findIndex(v => v.id === id);
  if (index === -1) return undefined;
  mockVehicles[index] = { ...mockVehicles[index], ...updates };
  return mockVehicles[index];
}

// Delete vehicle
export function deleteVehicle(id: string): boolean {
  const index = mockVehicles.findIndex(v => v.id === id);
  if (index === -1) return false;
  mockVehicles.splice(index, 1);
  return true;
}
