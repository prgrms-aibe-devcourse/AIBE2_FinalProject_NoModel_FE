/**
 * API Service Layer
 * Type-safe service methods for API operations
 */

import { httpClient, type ApiResponse } from './httpClient';
import { API_ENDPOINTS } from '../config/api';

// ===== Type Definitions =====

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'viewer';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  memberIds?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== Authentication Service =====

export const authService = {
  /**
   * Login user
   */
  async login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.auth.logout);
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.auth.refresh, { refreshToken });
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return httpClient.get<User>(API_ENDPOINTS.auth.profile);
  },
};

// ===== User Service =====

export const userService = {
  /**
   * Get all users with pagination
   */
  async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_ENDPOINTS.users.list}?${searchParams.toString()}`;
    return httpClient.get<PaginatedResponse<User>>(endpoint);
  },

  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<ApiResponse<User>> {
    return httpClient.get<User>(API_ENDPOINTS.users.get(id));
  },

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return httpClient.post<User>(API_ENDPOINTS.users.create, userData);
  },

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return httpClient.put<User>(API_ENDPOINTS.users.update(id), userData);
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.users.delete(id));
  },
};

// ===== Project Service =====

export const projectService = {
  /**
   * Get all projects with pagination
   */
  async getProjects(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_ENDPOINTS.projects.list}?${searchParams.toString()}`;
    return httpClient.get<PaginatedResponse<Project>>(endpoint);
  },

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<ApiResponse<Project>> {
    return httpClient.get<Project>(API_ENDPOINTS.projects.get(id));
  },

  /**
   * Create new project
   */
  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return httpClient.post<Project>(API_ENDPOINTS.projects.create, projectData);
  },

  /**
   * Update project
   */
  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return httpClient.put<Project>(API_ENDPOINTS.projects.update(id), projectData);
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.projects.delete(id));
  },
};

// ===== Task Service =====

export const taskService = {
  /**
   * Get all tasks with pagination
   */
  async getTasks(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_ENDPOINTS.tasks.list}?${searchParams.toString()}`;
    return httpClient.get<PaginatedResponse<Task>>(endpoint);
  },

  /**
   * Get tasks by project ID
   */
  async getTasksByProject(projectId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const endpoint = `${API_ENDPOINTS.tasks.byProject(projectId)}?${searchParams.toString()}`;
    return httpClient.get<PaginatedResponse<Task>>(endpoint);
  },

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    return httpClient.get<Task>(API_ENDPOINTS.tasks.get(id));
  },

  /**
   * Create new task
   */
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return httpClient.post<Task>(API_ENDPOINTS.tasks.create, taskData);
  },

  /**
   * Update task
   */
  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return httpClient.put<Task>(API_ENDPOINTS.tasks.update(id), taskData);
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.tasks.delete(id));
  },
};

// ===== Combined API Service =====

export const apiService = {
  auth: authService,
  users: userService,
  projects: projectService,
  tasks: taskService,
};

export default apiService;