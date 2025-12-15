import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuthStore } from '../store';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setIsLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setIsLoading(true);
      
      try {
        const { token } = await authService.login(credentials);
        
        const user = await authService.getUserByCredentials(credentials);
        
        if (!user) {
          throw new Error('User not found');
        }

        await login(user, token);
        
        return { user, token };
      } catch (error) {
        setIsLoading(false);

        throw error;
      }
    },
    onError: (_error) => {
      setIsLoading(false);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },

    onError: (_error) => {
      // Handle logout error silently
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => authService.getUserById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};