

export const healthCheck = async (deployment_url) => {
    try {
        const response = await fetch(`${deployment_url}/health_check`);
        if (!response.ok) {
            throw new Error('Failed to fetch health check');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching health check:', error);
    }
}