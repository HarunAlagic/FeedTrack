import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './feedbacks.scss';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from './../../components/dataTable/DataTable';
import Add from '../../components/add/Add';

interface Feedback {
    id: number;
    [key: string]: any;
}

const Feedbacks = () => {
    const [open, setOpen] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); 
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/feedbacks`)
            .then((response) => response.json())
            .then((data: Feedback[]) => {
                if (data.length > 0) {
                    const feedback = data[0];
                    const feedbackKeys = Object.keys(feedback);
                    const generatedColumns = feedbackKeys.map((key) => {
                        return {
                            field: key,
                            headerName: key.charAt(0).toUpperCase() + key.slice(1),
                            width: 150,
                            type: typeof feedback[key] === 'boolean' ? 'boolean' : 'string',
                        };
                    }).filter(column => column !== null) as GridColDef[];
                    setColumns(generatedColumns);
                    setFeedbacks(data);
                }
            })
            .catch((error) => console.error('Error fetching feedbacks:', error));
    }, []);

    const deleteFeedback = (id: number) => {
        fetch(`http://localhost:3000/api/feedbacks/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.ok) {
                    const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== id);
                    setFeedbacks(updatedFeedbacks);
                } else {
                    console.error('Error deleting feedback:', response.statusText);
                }
            })
            .catch((error) => console.error('Error deleting feedback:', error));
    };

    return (
        <div className="feedbacks">
            <div className="info">
                <h1>Feedbacks</h1>
                <button onClick={() => setOpen(true)}>Add New Feedback</button>
            </div>
            <DataTable slug="feedbacks" columns={columns} rows={feedbacks} onDelete={deleteFeedback} />
            {open && <Add slug="feedback" columns={columns} setOpen={setOpen} />}
        </div>
    );
};

export default Feedbacks;
