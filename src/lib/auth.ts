// Mock authentication service
// In a real app, this would integrate with your backend/Supabase

export interface User {
  id: string
  name: string
  email: string
  dateOfBirth: string
  height: string
  weight: string
  phone: string
  plan: "free" | "premium"
  sosContacts: SOSContact[]
  profilePicture?: string
}

export interface SOSContact {
  id: string
  name: string
  phone: string
}

class AuthService {
  private currentUser: User | null = null
  private users: User[] = []

  constructor() {
    // Load from localStorage on initialization
    const savedUser = localStorage.getItem('heartclutch-user')
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser)
    }

    const savedUsers = localStorage.getItem('heartclutch-users')
    if (savedUsers) {
      this.users = JSON.parse(savedUsers)
    }
  }

  async signUp(userData: Omit<User, 'id' | 'plan' | 'sosContacts'>) {
    const user: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      plan: "free",
      sosContacts: []
    }

    this.users.push(user)
    this.currentUser = user
    this.saveToStorage()
    
    return user
  }

  async signIn(email: string, password: string) {
    // Mock sign in - in real app would verify credentials
    const user = this.users.find(u => u.email === email)
    if (user) {
      this.currentUser = user
      this.saveToStorage()
      return user
    }
    throw new Error('Invalid credentials')
  }

  async signInWithGoogle() {
    // Mock Google OAuth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Demo User",
      email: "demo@example.com",
      dateOfBirth: "1990-01-01",
      height: "175",
      weight: "70",
      phone: "+1234567890",
      plan: "free",
      sosContacts: []
    }

    this.users.push(mockUser)
    this.currentUser = mockUser
    this.saveToStorage()
    
    return mockUser
  }

  signOut() {
    this.currentUser = null
    localStorage.removeItem('heartclutch-user')
  }

  getCurrentUser() {
    return this.currentUser
  }

  async updateUser(updates: Partial<User>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      
      // Update in users array
      const index = this.users.findIndex(u => u.id === this.currentUser!.id)
      if (index !== -1) {
        this.users[index] = this.currentUser
      }
      
      this.saveToStorage()
      return this.currentUser
    }
    throw new Error('No user logged in')
  }

  async upgradeToPremium() {
    if (this.currentUser) {
      return this.updateUser({ plan: "premium" })
    }
    throw new Error('No user logged in')
  }

  private saveToStorage() {
    if (this.currentUser) {
      localStorage.setItem('heartclutch-user', JSON.stringify(this.currentUser))
    }
    localStorage.setItem('heartclutch-users', JSON.stringify(this.users))
  }
}

export const authService = new AuthService()