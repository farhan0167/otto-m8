
export const fetch_task_registry = async () => {
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


export const fetch_block_data = async (core_block_type, process_type) => {
    const endpoint = `http://localhost:8000/get_block_initial_data/` + 
      `?core_block_type=${core_block_type}` +
      `&process_type=${process_type}`
      
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            // Parse the error response
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Unknown error occurred');
        }
        const data = await response.json();
        return data
    } catch (error) {
        // Catch any errors and display the message
        throw new Error(`Error fetching block data1: ${error.message}`);
    }
}

export const get_block_code = async (core_block_type, process_type) => {
    try {
        const response = await fetch(`http://localhost:8000/get_block_codes?core_block_type=${core_block_type}&process_type=${process_type}`);
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching block codes:', error);
        return [];
    }
};

export const delete_block = async (blockMetadata, vendorName, blockName) => {
    try {
        const response = await fetch(`http://localhost:8000/delete_block_type`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              block_metadata: blockMetadata,
              vendor_name: vendorName,
              display_name: blockName
            })
        });
        const data = await response.json();
        console.log(data)
        return data
    } catch (error) {
        console.error('Error deleting block:', error);
        return [];
    }
};

export const save_block_code = async (
    token,
    code,
    newFilePath,
    finalFileName,
    core_block_type,
    reference_core_block_type
) => {
    try {
        let response = await fetch('http://localhost:8000/save_block_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                source_code: code,
                source_path: newFilePath,
                file_name: finalFileName,
                core_block_type,
                reference_core_block_type
            }),
        });
        if (!response.ok) {
            // Parse the error response
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Unknown error occurred');
        }
        response = response.json()
        return response
    } catch (error) {
        console.error('Error saving block code:', error.message);
        return {};
    }
}