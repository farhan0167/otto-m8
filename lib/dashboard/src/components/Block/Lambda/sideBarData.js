import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Alert, Spinner } from 'react-bootstrap';

const LambdaFunctionSideBarData = ({ sideBarData, onDataChange }) => {
    const [items, setItems] = useState([]); // State to store dropdown items
    const [selectedItem, setSelectedItem] = useState(sideBarData.lambda_function_name); // State to store selected item
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:8000/get_lambdas'); // Replace with your endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setItems(data); // Set fetched items
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <Form.Group className="form-group" controlId="dropdown">
                <Form.Label>Lambda Function</Form.Label>
                {loading ? (
                    <Spinner animation="border" role="status" />
                ) : error ? (
                    <Alert variant="danger">Error fetching items: {error}</Alert>
                ) : (
                    <Dropdown>
                        <Dropdown.Toggle 
                          style={
                            { width: '100%', 
                              backgroundColor: 'white', 
                              color: 'black',
                              textAlign: 'left'
                            }} 
                          id="dropdown-basic"
                        >
                          {selectedItem || 'Select a Lambda Function'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width: '100%'}}>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <Dropdown.Item
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedItem(item.name);
                                            onDataChange('lambda_function_name', item.name);
                                        }}
                                        
                                    >
                                        {item.name}
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item disabled>No Lambdas available.</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Form.Group>
        </div>
    );
};

export default LambdaFunctionSideBarData;
