import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext';
import { Table } from 'react-bootstrap';
import TraceView from './TraceView';

const WorkflowTrace = () => {
    const params = useParams();
    const template_id = params.id;
    const [traces, setTraces] = useState([]);
    const [trace, setTrace] = useState(null);
    const [showTrace, setShowTrace] = useState(false);

    const { token, logout } = useAuth();

    const handleShowTrace = (trace) => {
        setTrace(trace);
        setShowTrace(true);
    };
    const handleCloseTrace = () => {
        setShowTrace(false);
        setTrace(null);
    };

    useEffect(() => {
        const fetchWorkflowTrace = async () => {
          try {
            const response = await fetch(`http://localhost:8000/trace/${template_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}` 
              },
            });
            const data = await response.json();
            console.log(data);
            setTraces(data);
          } catch (error) {
            console.error('Error fetching workflow trace:', error);
          }
        };
    
        fetchWorkflowTrace();
      }, [template_id, token]);

  return (
    <>  <div style={{'height': '100vh'}}>
            <h2>Trace</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>time start</th>
                        <th>time end</th>
                        <th>total time (s)</th>
                        <th>trace</th>
                    </tr>
                </thead>
                <tbody>
                    {traces.length > 0 && traces.map((trace, index) => (
                        <tr key={index}>
                            <td>{trace.start_timestamp}</td>
                            <td>{trace.end_timestamp}</td>
                            <td>{trace.execution_time}</td>
                            <td>
                                <button onClick={() => handleShowTrace(trace.log)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <TraceView show={showTrace} setShow={setShowTrace} trace={trace} handleCloseTrace={handleCloseTrace}/>
        </div>
    </>
  )
}

export default WorkflowTrace