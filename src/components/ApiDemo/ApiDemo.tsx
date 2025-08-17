/**
 * API Demo Component
 * Demonstrates API integration with React hooks
 */

import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { useApi, useMutation, usePaginatedApi } from '../../hooks/useApi';
import { apiService, type User, type CreateUserRequest } from '../../services/apiService';
import type { ApiError } from '../../services/httpClient';
import './ApiDemo.css';

export const ApiDemo: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // ===== Fetch Users with Pagination =====
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    refetch: refetchUsers,
  } = usePaginatedApi(
    (page, limit) => apiService.users.getUsers({ page, limit }),
    5, // 5 users per page
    {
      immediate: true,
      onSuccess: (data) => console.log('✅ Users loaded:', data),
      onError: (error) => console.error('❌ Failed to load users:', error),
    }
  );

  // ===== Fetch Single User =====
  const {
    data: selectedUser,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useApi(
    () => apiService.users.getUser(selectedUserId),
    {
      immediate: false,
      onSuccess: (data) => console.log('✅ User loaded:', data),
      onError: (error) => console.error('❌ Failed to load user:', error),
    }
  );

  // ===== Create User Mutation =====
  const {
    loading: createLoading,
    error: createError,
    execute: createUser,
  } = useMutation(
    (userData: CreateUserRequest) => apiService.users.createUser(userData),
    {
      onSuccess: (data) => {
        console.log('✅ User created:', data);
        refetchUsers(); // Refresh the users list
      },
      onError: (error) => console.error('❌ Failed to create user:', error),
    }
  );

  // ===== Delete User Mutation =====
  const {
    loading: deleteLoading,
    error: deleteError,
    execute: deleteUser,
  } = useMutation(
    (userId: string) => apiService.users.deleteUser(userId),
    {
      onSuccess: () => {
        console.log('✅ User deleted');
        refetchUsers(); // Refresh the users list
        if (selectedUserId) {
          setSelectedUserId(''); // Clear selection
        }
      },
      onError: (error) => console.error('❌ Failed to delete user:', error),
    }
  );

  // ===== Event Handlers =====

  const handleLoadUser = (userId: string) => {
    setSelectedUserId(userId);
    setTimeout(() => refetchUser(), 100); // Small delay to ensure state update
  };

  const handleCreateUser = async () => {
    const userData: CreateUserRequest = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      role: 'user',
    };
    await createUser(userData);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  // ===== Render Helpers =====

  const renderError = (error: ApiError | null, title: string) => {
    if (!error) return null;

    const getErrorColor = (type: string): { variant: 'filled'; color: 'red' | 'orange' | 'blue' } => {
      switch (type) {
        case 'NETWORK_ERROR':
        case 'TIMEOUT_ERROR':
          return { variant: 'filled', color: 'orange' };
        case 'AUTHENTICATION_ERROR':
        case 'AUTHORIZATION_ERROR':
          return { variant: 'filled', color: 'red' };
        case 'VALIDATION_ERROR':
          return { variant: 'filled', color: 'blue' };
        default:
          return { variant: 'filled', color: 'red' };
      }
    };

    return (
      <Card className="api-demo__error">
        <div className="api-demo__error-header">
          <h4>{title}</h4>
          <Badge {...getErrorColor(error.type)} size="small">
            {error.type}
          </Badge>
        </div>
        <p>{error.message}</p>
        {error.status && (
          <p><strong>Status:</strong> {error.status}</p>
        )}
        {error.data && (
          <pre className="api-demo__error-data">
            {JSON.stringify(error.data, null, 2)}
          </pre>
        )}
      </Card>
    );
  };

  const renderUser = (user: User) => (
    <Card key={user.id} className="api-demo__user-card">
      <div className="api-demo__user-header">
        <h4>{user.name}</h4>
        <Badge 
          variant="filled"
          color={user.role === 'admin' ? 'red' : user.role === 'user' ? 'blue' : 'gray'}
          size="small"
        >
          {user.role}
        </Badge>
      </div>
      <p className="api-demo__user-email">{user.email}</p>
      <div className="api-demo__user-actions">
        <Button
          variant="secondary"
          size="small"
          onClick={() => handleLoadUser(user.id)}
          disabled={userLoading}
          loading={userLoading && selectedUserId === user.id}
        >
          Load Details
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => handleDeleteUser(user.id)}
          disabled={deleteLoading}
          loading={deleteLoading}
        >
          Delete
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="api-demo">
      <div className="api-demo__header">
        <h2>API Integration Demo</h2>
        <p>Demonstrates API calls with loading states, error handling, and pagination</p>
      </div>

      {/* Users List Section */}
      <section className="api-demo__section">
        <div className="api-demo__section-header">
          <h3>Users Management</h3>
          <div className="api-demo__actions">
            <Button
              variant="primary"
              onClick={handleCreateUser}
              disabled={createLoading}
              loading={createLoading}
            >
              Create User
            </Button>
            <Button
              variant="secondary"
              onClick={refetchUsers}
              disabled={usersLoading}
              loading={usersLoading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Create User Error */}
        {renderError(createError, 'Create User Error')}

        {/* Delete User Error */}
        {renderError(deleteError, 'Delete User Error')}

        {/* Users List Error */}
        {renderError(usersError, 'Failed to Load Users')}

        {/* Users List */}
        {usersLoading && !usersData ? (
          <Card className="api-demo__loading">
            <p>Loading users...</p>
          </Card>
        ) : usersData ? (
          <div>
            <div className="api-demo__users-grid">
              {usersData.data.map(renderUser)}
            </div>

            {/* Pagination */}
            <div className="api-demo__pagination">
              <Button
                variant="secondary"
                size="small"
                onClick={prevPage}
                disabled={!hasPrev || usersLoading}
              >
                Previous
              </Button>
              <span className="api-demo__pagination-info">
                Page {usersData.pagination.page} of {usersData.pagination.totalPages}
                ({usersData.pagination.total} total users)
              </span>
              <Button
                variant="secondary"
                size="small"
                onClick={nextPage}
                disabled={!hasNext || usersLoading}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <Card className="api-demo__empty">
            <p>No users available</p>
          </Card>
        )}
      </section>

      {/* Selected User Details Section */}
      {selectedUserId && (
        <section className="api-demo__section">
          <div className="api-demo__section-header">
            <h3>User Details</h3>
          </div>

          {/* User Details Error */}
          {renderError(userError, 'Failed to Load User Details')}

          {/* User Details */}
          {userLoading ? (
            <Card className="api-demo__loading">
              <p>Loading user details...</p>
            </Card>
          ) : selectedUser ? (
            <Card className="api-demo__user-details">
              <div className="api-demo__user-details-header">
                <h4>{selectedUser.name}</h4>
                <Badge 
                  variant="filled"
                  color={selectedUser.role === 'admin' ? 'red' : selectedUser.role === 'user' ? 'blue' : 'gray'}
                >
                  {selectedUser.role}
                </Badge>
              </div>
              <div className="api-demo__user-details-content">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
              </div>
            </Card>
          ) : null}
        </section>
      )}

      {/* API Configuration Info */}
      <section className="api-demo__section">
        <div className="api-demo__section-header">
          <h3>API Configuration</h3>
        </div>
        <Card className="api-demo__config">
          <div className="api-demo__config-grid">
            <div>
              <strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}
            </div>
            <div>
              <strong>Environment:</strong> {import.meta.env.MODE}
            </div>
            <div>
              <strong>Timeout:</strong> {import.meta.env.VITE_API_TIMEOUT}ms
            </div>
            <div>
              <strong>Logging:</strong> {import.meta.env.VITE_ENABLE_API_LOGGING}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};