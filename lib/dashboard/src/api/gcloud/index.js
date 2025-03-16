

export const gcloudIsLoggedIn = async (scopes, service) => {
    try {
        const response = await fetch('http://localhost:8000/gcloud/auth/is_logged_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scopes: scopes,
                service: service
            })
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block codes:', error);
        return [];
    }
}

export const gcloudLogin = async (scopes, service) => {
    try {
        const response = await fetch('http://localhost:8000/gcloud/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scopes: scopes,
                service: service
            })
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block codes:', error);
        return [];
    }
}