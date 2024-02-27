const BASE_URL = 'YOUR_BACKEND_BASE_URL_HERE'; // Replace with your backend base URL

export const predictCarPrice = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        return responseData.predictedPrice;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch data from the server');
    }
};