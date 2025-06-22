import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { TextInput, Button } from 'react-native-paper';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    const { data: { session } = {}, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    else if (!session) Alert.alert('Check your inbox to verify your email');
    setLoading(false);
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />
      <Button mode="contained" onPress={signIn} loading={loading} style={{ marginBottom: 8 }}>
        Sign In
      </Button>
      <Button mode="outlined" onPress={signUp} loading={loading}>
        Sign Up
      </Button>
    </View>
  );
}
