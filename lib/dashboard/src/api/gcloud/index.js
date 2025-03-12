

export const gcloudIsLoggedIn = async () => {
    try {
        const response = await fetch('http://localhost:8000/gcloud/auth/is_logged_in', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block codes:', error);
        return [];
    }
}

export const gcloudLogin = async () => {
    try {
        const response = await fetch('http://localhost:8000/gcloud/auth/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block codes:', error);
        return [];
    }
}