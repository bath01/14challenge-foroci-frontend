/**
 * Écran d'inscription
 * Formulaire avec prénom, nom, email et mot de passe
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

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** Soumettre le formulaire d'inscription */
  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'L\'email et le mot de passe sont obligatoires.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
    } catch (error: any) {
      const message = error.message?.includes('409')
        ? 'Cet email est déjà utilisé.'
        : error.message || 'Une erreur est survenue. Réessaie.';
      Alert.alert('Inscription échouée', message);
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
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.brandName}>ForoCI</Text>
          <FlagBar width={40} height={4} />
          <Text style={styles.title}>Rejoins l'aventure !</Text>
          <Text style={styles.subtitle}>Crée ton compte et commence à t'entraîner</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Prénom et Nom en ligne */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Prénom</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor={TEXT_DIM}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Nom</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor={TEXT_DIM}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
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
            <Text style={styles.label}>Mot de passe *</Text>
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

          {/* Bouton inscription */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Text>
            {!isLoading && <Ionicons name="checkmark-circle" size={18} color="#FFF" />}
          </TouchableOpacity>
        </View>

        {/* Lien vers connexion */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}> Se connecter</Text>
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
    marginBottom: 32,
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
    textAlign: 'center',
  },
  form: {
    gap: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
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
    backgroundColor: CI_GREEN,
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
