import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export interface LoginResponse {
  id: number;
  username: string;
  name: string;
  token: string;
}

export interface VerifyResponse {
  valid: boolean;
  data?: any;
  error?: string;
}

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<any>(`${API_URL}/login`, {
        username,
        password,
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Error al iniciar sesión');
    }
  }

  async verifyToken(token: string): Promise<VerifyResponse> {
    const response = await axios.post<VerifyResponse>(`${API_URL}/verify`, {
      token,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/logout`);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminData');
  }

  getAdminData(): any {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
  }

  setAdminData(data: any): void {
    localStorage.setItem('adminData', JSON.stringify(data));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async updateProfile(id: number, name?: string, password?: string) {
    const token = this.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.put(`${API_URL}/admins/${id}`, { name, password }, { headers });
    return response.data;
  }
}

export default new AuthService();
