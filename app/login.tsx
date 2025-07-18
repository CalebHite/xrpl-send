import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createUser, login } from '@/scripts/account';
import { useUser } from './context/UserContext';

export type User = {
  username: string;
  name: string;
  nickname: string;
  picture: string;
  phone_number: string;
  app_metadata: {
    xrp_address: string;
    xrp_seed: string;
    xrp_public_key: string;
    xrp_secret: string;
    friends: string[];
  };
};

interface ErrorResponse {
  message: string;
}

export default function Login() {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      console.log('Attempting login with:', { username, password: '***' });
      const user = await login(username, password);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        const axiosError = error as AxiosError<ErrorResponse>;
        Alert.alert(
          'Error',
          axiosError.response?.data?.message || 'Failed to login. Please check your credentials and try again.'
        );
      }
    }
  };

  const handleSignup = async () => {
    try {
      if (!username || !password || !name || !phoneNumber) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      const user = await createUser(username, password, name, phoneNumber);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      Alert.alert(
        'Error',
        axiosError.response?.data?.message || 'Failed to create account. Please try again.'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome</ThemedText>
      <View style={styles.inputContainer}>
        {!isSignup && (
         <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#666"
          secureTextEntry={true}
        />
        <ThemedText
          onPress={handleLogin}
          style={styles.button}
        >
          Login
        </ThemedText>
        <ThemedText
          onPress={() => setIsSignup(!isSignup)}
          style={styles.highlight}
        >
          Signup
        </ThemedText>
        </View>
        )}
        {isSignup && (
          <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#666"
          secureTextEntry={true}
        />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor="#666"
          />
          <ThemedText
            onPress={handleSignup}
            style={styles.button}
          >
            Signup
          </ThemedText>
          <ThemedText
            onPress={() => setIsSignup(!isSignup)}
            style={styles.highlight}
          >
            Back
          </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 15,
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
  },
  highlight: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
}); 