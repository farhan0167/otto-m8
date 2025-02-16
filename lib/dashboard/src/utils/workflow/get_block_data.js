
export const fetch_block_data = async (core_block_type, process_type) => {
    const endpoint = `http://localhost:8000/get_block_initial_data/` + 
      `?core_block_type=${core_block_type}` +
      `&process_type=${process_type}`
      
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block data:', error);
        return [];
    }
}