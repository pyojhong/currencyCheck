import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from '../styles/styles';
import HomeScreen from './HomeScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HomeScreen></HomeScreen>
    </View>
  );
}
