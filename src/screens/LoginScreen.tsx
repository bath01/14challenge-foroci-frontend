/**
 * Écran de connexion
 * Formulaire email/mot de passe avec intégration API
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DARK_BG, CARD, BORDER, CI_ORANGE, CI_GREEN,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_DIM,
  FONT_FAMILY, FONT_FAMILY_SEMIBOLD, FONT_FAMILY_BOLD, FONT_FAMILY_EXTRABOLD,
  FONT_SIZE, SPACING, BORDER_RADIUS,
} from '../constants/theme';
import FlagBar from '../components/ui/FlagBar';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** Soumettre le formulaire de connexion */
  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'Remplis ton email et ton mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (error: any) {
      Alert.alert(
        'Connexion échouée',
        error.message || 'Vérifie tes identifiants et réessaie.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* En-tête avec logo */}
        <View style={styles.header}>
          <Text style={styles.brandName}>ForoCI</Text>
          <FlagBar width={40} height={4} />
          <Text style={styles.title}>Content de te revoir !</Text>
          <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={TEXT_DIM} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ton@email.com"
                placeholderTextColor={TEXT_DIM}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={18} color={TEXT_DIM} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Min. 6 caractères"
                placeholderTextColor={TEXT_DIM}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={TEXT_DIM}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton connexion */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
            {!isLoading && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
          </TouchableOpacity>
        </View>

        {/* Lien vers inscription */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}> Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: FONT_SIZE.display,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_EXTRABOLD,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    fontFamily: FONT_FAMILY_BOLD,
    color: TEXT_PRIMARY,
    marginTop: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
    marginTop: SPACING.xs,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.body,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY_SEMIBOLD,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: SPACING.lg,
    height: 50,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.xl,
    color: TEXT_PRIMARY,
    fontFamily: FONT_FAMILY,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CI_ORANGE,
    borderRadius: BORDER_RADIUS.lg,
    height: 50,
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY_BOLD,
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
    color: TEXT_SECONDARY,
    fontFamily: FONT_FAMILY,
  },
  footerLink: {
    fontSize: FONT_SIZE.md,
    color: CI_ORANGE,
    fontFamily: FONT_FAMILY_BOLD,
  },
});
