import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = 'http://13.53.43.167:8000';

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
            setVehicleMakes(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const fetchVehicleModelsForMake = async (make) => {
        try {
            const response = await fetch(`${BASE_URL}/api/vehicle/v1-get-matching-vehicle-models?make=${make}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vehicle models');
            }
            const data = await response.json();
            setVehicleModels(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleMakeChange = (make) => {
        setSelectedMake(make);
        fetchVehicleModelsForMake(make);
    };

    const handleModelChange = (model) => {
        setSelectedModel(model);
    };

    const handleFuelTypeChange = (fuelType) => {
        setSelectedFuelType(fuelType);
    };

    const handleOdometerChange = (text) => {
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
            odometer: odometer === '' ? 0 : parseInt(odometer),
            yom: selectedYOM,
        };

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
            setPredictedPrice(result);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>AutoPricePredict</Text>
            <Text style={styles.subHeading}>Intelligent Vehicle Price Estimator</Text>

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
                onValueChange={handleFuelTypeChange}>
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

            <Text style={styles.label}>Year of Manufacture:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedYOM}
                onValueChange={handleYOMChange}>
                {initializedYOMs().map((yom, index) => (
                    <Picker.Item key={index} label={yom} value={yom} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <Text style={styles.buttonText}>Predict Price</Text>
            </TouchableOpacity>

            {predictedPrice !== null && (
                <Text style={styles.prediction}>Predicted Price: Rs. {predictedPrice} /=</Text>
            )}
            <Text style={styles.footer}>@2024 Designed & Implemented by Dasindu Hewagamage</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 7,
        marginTop: 27,
    },
    subHeading: {
        fontSize: 18,
        color: '#696969',
        marginBottom: 55,
    },
    label: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    picker: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        height: 40,
        fontSize: 15,
        borderColor: '#ddd',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 15,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#2ecc71',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    prediction: {
        fontSize: 20,
        color: '#e74c3c',
        marginTop: 20,
        fontWeight: 'bold',
    },
    footer: {
        fontSize: 15,
        color: '#aaa',
        marginTop: 20,
    },
});

export default PricePredictionScreen;
