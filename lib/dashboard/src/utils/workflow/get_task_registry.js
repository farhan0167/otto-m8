
export const FetchTaskRegistry = async () => {
    try {
        const response = await fetch('http://localhost:8000/get_block_types',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching task registry:', error);
        return null;
    }
}