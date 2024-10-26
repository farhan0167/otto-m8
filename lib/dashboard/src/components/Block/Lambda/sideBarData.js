import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const LambdaFunctionSideBarData = ({sideBarData, onDataChange}) => {
    const [items, setItems] = useState([]); // State to store dropdown items
    const [selectedItem, setSelectedItem] = useState(''); // State to store selected item
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
        <Form.Group className='form-group' controlId="dropdown">
            <Form.Label>Lambda Function</Form.Label>
            {loading ? (
            <Spinner animation="border" role="status" />
            ) : error ? (
                <Alert variant="danger">Error fetching items: {error}</Alert>
            ) : (
                <Form.Control
                    as="select"
                    value={selectedItem}
                    onChange={(e) => {
                        setSelectedItem(e.target.value);
                        onDataChange('lambda_function_name', e.target.value);
                    }}
                >
                    <option value="" disabled>
                    Select a Lambda Function
                    </option>
                    {items.length > 0? items.map((item) => (
                    <option key={item.id} value={item.name}>
                        {item.name} {/* Adjust according to your data structure */}
                    </option>
                    )):
                    <option disabled>No Lambdas available.</option> 
                    }
                </Form.Control>
            )}
        </Form.Group>
    </div>
  )
}

export default LambdaFunctionSideBarData