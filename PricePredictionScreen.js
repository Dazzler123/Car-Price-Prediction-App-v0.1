import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { predictCarPrice } from './PredictPrice';

const PricePredictionScreen = () => {
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedFuelType, setSelectedFuelType] = useState('');
    const [odometer, setOdometer] = useState('');
    const [selectedYOM, setSelectedYOM] = useState('');
    const [predictedPrice, setPredictedPrice] = useState(null);

    const handleMakeChange = (make) => {
        setSelectedMake(make);
    };

    const handleModelChange = (model) => {
        setSelectedModel(model);
    };

    const handleFuelTypeChange = (fuelType) => {
        setSelectedFuelType(fuelType);
    };

    const handleOdometerChange = (text) => {
        // Validate input to allow only numeric characters
        if (/^\d+$/.test(text) || text === '') {
            setOdometer(text);
        }
    };

    const handleYOMChange = (yom) => {
        setSelectedYOM(yom);
    };

    const handleButtonPress = async () => {
        const data = {
            make: selectedMake,
            model: selectedModel,
            fuelType: selectedFuelType,
            odometer: parseInt(odometer),
            yom: parseInt(selectedYOM),
        };

        try {
            const price = await predictCarPrice(data);
            setPredictedPrice(price);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Car Price Prediction V0.1</Text>
            <Text style={styles.label}>Select Car Make:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedMake}
                onValueChange={(itemValue) => handleMakeChange(itemValue)}>
                <Picker.Item label="Toyota" value="toyota" />
                <Picker.Item label="Honda" value="honda" />
            </Picker>

            <Text style={styles.label}>Select Car Model:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedModel}
                onValueChange={(itemValue) => handleModelChange(itemValue)}>
                {selectedMake === 'toyota' && (
                    <>
                        <Picker.Item label="Corolla" value="corolla" />
                        <Picker.Item label="Camry" value="camry" />
                    </>
                )}
                {selectedMake === 'honda' && (
                    <>
                        <Picker.Item label="Civic" value="civic" />
                        <Picker.Item label="Accord" value="accord" />
                    </>
                )}
            </Picker>

            <Text style={styles.label}>Select Fuel Type:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedFuelType}
                onValueChange={(itemValue) => handleFuelTypeChange(itemValue)}>
                <Picker.Item label="Petrol" value="petrol" />
                <Picker.Item label="Diesel" value="diesel" />
            </Picker>

            <Text style={styles.label}>Odometer (KM):</Text>
            <TextInput
                style={styles.input}
                value={odometer}
                onChangeText={handleOdometerChange}
                keyboardType="numeric"
                placeholder="Enter Odometer"
            />

            <Text style={styles.label}>Select Year of Manufacture:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedYOM}
                onValueChange={(itemValue) => handleYOMChange(itemValue)}>
                <Picker.Item label="2022" value="2022" />
                <Picker.Item label="2021" value="2021" />
                <Picker.Item label="2020" value="2020" />
                {/* Add more years as needed */}
            </Picker>
            <Button
                title="Predict Price"
                onPress={handleButtonPress}
                color="green"
                style={styles.button}
            />
            {predictedPrice !== null && (
                <Text style={styles.lbl_predicted_price}>Rs. {predictedPrice} /=</Text>
            )}
            <Text style={styles.footer_label}>@2024 Designed & Implemented by Dasindu Hewagamage</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f1f2f6'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'blue',
        fontFamily: 'Accord',
        marginBottom: 30
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    picker: {
        width: '100%',
        marginBottom: 20
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20
    },
    button: {
        width: '100%',
        marginBottom: 20,
    },
    lbl_predicted_price: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
        fontFamily: 'Accord',
        marginTop: 40
    },
    footer_label: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'gray',
        fontFamily: 'Accord',
        marginTop: 50,
        marginBottom: 2
    },
});

export default PricePredictionScreen;
