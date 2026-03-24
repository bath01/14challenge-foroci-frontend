/**
 * Contexte d'authentification global
 * Gère l'état de connexion, le token JWT et la persistance via AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, LoginDto, RegisterDto } from '../types';
import { login as apiLogin, register as apiRegister, setAuthToken } from '../services/api';

const TOKEN_KEY = 'foroci_auth_token';
const USER_KEY = 'foroci_auth_user';

interface AuthContextType {
  /** Utilisateur connecté (null si déconnecté) */
  user: AuthUser | null;
  /** Token JWT actif */
  token: string | null;
  /** Chargement initial (vérification du token persisté) */
  isLoading: boolean;
  /** Connexion avec email/mot de passe */
  signIn: (data: LoginDto) => Promise<void>;
  /** Inscription d'un nouveau compte */
  signUp: (data: RegisterDto) => Promise<void>;
  /** Déconnexion */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurer la session au démarrage
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem(USER_KEY);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setAuthToken(savedToken);
        }
      } catch {
        // Session expirée ou corrompue, on ignore
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const signIn = useCallback(async (data: LoginDto) => {
    const response = await apiLogin(data);
    setToken(response.token);
    setUser(response.user);
    setAuthToken(response.token);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }, []);

  const signUp = useCallback(async (data: RegisterDto) => {
    const response = await apiRegister(data);
    setToken(response.token);
    setUser(response.user);
    setAuthToken(response.token);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook pour accéder au contexte d'authentification */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
