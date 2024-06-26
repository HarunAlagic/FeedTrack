import { GridColDef } from "@mui/x-data-grid";
import "./update.scss";
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


interface User {
  id: number;
  [key: string]: any;
}

const Update = (props: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("https://feedtrack-backend.vercel.app/api/users")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
          console.log(data[0].id);
          setUsers(data);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Provera validnosti podataka
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{4,15}$/;
    const validRoles = ["superAdmin", "tellerAdmin", "branchAdmin"];
    const currentErrors: { [key: string]: string } = {};

    props.columns.forEach(column => {
      if (column.field !== "id") {
        const value = formData[column.field];
        if (column.field === "email" && !emailRegex.test(value)) {
          currentErrors[column.field] = "Invalid email format";
        } else if (column.field === "mobilenumber" && !phoneRegex.test(value)) {
          currentErrors[column.field] = "Invalid phone number format";
        } else if (column.field === "role" && !validRoles.includes(value)) {
          currentErrors[column.field] = "Invalid role";
        } else if (column.field === "lastname" && value.length < 2) { // Ovde je promenjeno
          currentErrors[column.field] = "Last name must be at least 2 characters long";
        }
      }
    });

    // Ako postoje greške, postavljamo ih i zaustavljamo slanje podataka
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    console.log(JSON.stringify(formData));

    fetch(`https://feedtrack-backend.vercel.app/api/users/${selectedUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        console.log('Data sent successfully');
        props.setOpen(false);
      } else {
        console.error('Error sending data:', response.statusText);
      }
    })
    .catch(error => console.error('Error sending data:', error));
  };

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div className="update">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Update {props.slug}</h1>
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <Select
            value={selectedUserId || ""}
            onChange={handleUserChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select user
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id.toString()}>
                {user.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Box>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label className={errors[column.field] ? 'error-label' : ''}>{column.headerName}</label>
                <input 
                  type={column.type} 
                  name={column.field} 
                  placeholder={column.field} 
                  onChange={handleChange2} 
                  required
                />
                {errors[column.field] && <span className="error">{errors[column.field]}</span>}
              </div>
            ))}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Update;
