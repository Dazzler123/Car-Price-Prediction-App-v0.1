import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { predictCarPrice } from './PredictPrice';

const BASE_URL = 'http://127.0.0.1:8000';

// Function to initialize year of manufacture dropdown values
const initializedYOMs = () => {
    const YOMs = [];
    for (let i = 1960; i <= 2024; i++) {
        YOMs.push(String(i));
    }
    return YOMs;
};

const PricePredictionScreen = () => {
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');

    const [vehicleModels, setVehicleModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');

    const [selectedFuelType, setSelectedFuelType] = useState('Petrol');
    const [odometer, setOdometer] = useState('');
    const [selectedYOM, setSelectedYOM] = useState(String(new Date().getFullYear()));
    const [predictedPrice, setPredictedPrice] = useState(null);

    useEffect(() => {
        fetchVehicleMakesFromAPI();
    }, []);

    const fetchVehicleMakesFromAPI = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/vehicle/v1-get-vehicle-makes`);
            if (!response.ok) {
                throw new Error('Failed to fetch vehicle makes');
            }
            const data = await response.json();
            console.log(data);
            setVehicleMakes(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const fetchVehicleModelsForMake = async (make) => {
        try {
            console.log(make)
            const response = await fetch(`${BASE_URL}/api/vehicle/v1-get-matching-vehicle-models?make=${make}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vehicle models');
            }
            const data = await response.json();
            console.log(data);
            setVehicleModels(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleMakeChange = (make) => {
        setSelectedMake(make);
        fetchVehicleModelsForMake(make); // Update to use the selected make
    };


    const handleModelChange = (model) => {
      const formattedModel = model.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setSelectedModel(formattedModel);
        // fetchVehicleModelsForMake(selectedMake);
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
            yom: selectedYOM,
        };

        console.log(data)

            try {
                const response = await fetch(`${BASE_URL}/api/vehicle/v1-predict-vehicle-price`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Failed to predict vehicle price');
                }

                const result = await response.json();
                console.log('Prediction Result:', result);
                setPredictedPrice(result); // Assuming result is the predicted price
            } catch (error) {
                console.error('Error predicting car price:', error.message);
            }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Car Price Prediction V0.1</Text>
            <Text style={styles.label}>Select Car Make:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedMake}
                onValueChange={handleMakeChange}>
                {vehicleMakes.map((make, index) => (
                    <Picker.Item key={index} label={make} value={make} />
                ))}
            </Picker>

            <Text style={styles.label}>Select Car Model:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedModel}
                onValueChange={handleModelChange}>
                <Picker.Item label="Select Model" value="" />
                {vehicleModels.map((model, index) => (
                    <Picker.Item key={index} label={model} value={model} />
                ))}
            </Picker>

            <Text style={styles.label}>Select Fuel Type:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedFuelType}
                onValueChange={(itemValue) => handleFuelTypeChange(itemValue)}>
                <Picker.Item label="Petrol" value="Petrol" />
                <Picker.Item label="Diesel" value="Diesel" />
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
                            {initializedYOMs().map((yom, index) => (
                                <Picker.Item key={index} label={yom} value={yom} />
                            ))}
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
