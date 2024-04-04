import * as React from 'react';
import "./add.scss"
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

type Props = {
    slug: string;
    columns: GridColDef[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data?: any; // Optional prop for editing existing data
};

const Add: React.FC<Props> = ({ slug, columns, setOpen, data }) => {
    const [formData, setFormData] = useState({}); // State to hold form data for editing

    // useEffect to update formData when data prop changes (for editing)
    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic for adding or updating item based on slug value
        if (slug === 'teller') {
            // Logic for adding new teller
        } else if (slug === 'edit') {
            // Logic for updating existing item
        }
        setOpen(false);
    };

    return (
        <div className="add">
          <div className="modal">
            <span className="close" onClick={() => setOpen(false)}>
              X
            </span>
            <h1>{slug === 'teller' ? 'Add a new Teller' : slug === 'branch' ? 'Add a new Branch' : 'Edit'}</h1>
            <form onSubmit={handleSubmit}>
              {columns
                .filter((item) => item.field !== "id" && item.field !== "rating")
                .map((column) => (
                  <div className="item">
                    <label>{column.headerName}</label>
                    <input
                      type={column.type || 'text'} // Default to text type if not specified
                      placeholder={column.field}
                      value={formData[column.field] || ''} // Set input value for editing
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [column.field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              <button type="submit">Confirm</button>
            </form>
          </div>
        </div>
      );
}

export default Add;