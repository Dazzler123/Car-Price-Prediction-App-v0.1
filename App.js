import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import PricePredictionScreen from './PricePredictionScreen';


export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Car Price Prediction App V0.1</Text>
    //   <StatusBar style="auto" />
    // </View>
    <SafeAreaView style={{ flex: 1 }}>
        <PricePredictionScreen />
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: '#fff',
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
// });
