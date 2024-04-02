import React, { useState } from 'react';
import "../../styles/AdminPanel/AdminPanelBranchesView.scss"
import Add from '../../components/add/add';
import DataTable from '../../components/dataTable/dataTable';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 150 },
    { field: 'appointee', headerName: 'Branch Appointee', width: 200 },
  ];

  const rows: GridRowsProp = [
    { id: 1, location: 'Sarajevo', rating: '4.5', appointee: "Neko Nekic" },
    { id: 2, location: 'Mostar', rating: '3.5', appointee: "Neko Nekic 2" },
    { id: 3, location: 'Tuzla', rating: '4.0', appointee: "Neko Nekic 3" }
  ];

const AdminPanelBranchesView = () =>{
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleCreateNewBranch = () => {
        setSelectedRow(null); // Reset selectedRow when creating a new teller
        setOpen(true);
    };

    return (
        <div className="branches">
            <div className="info">
            <button onClick={handleCreateNewBranch}>Create a new branch</button>
            </div>
            <DataTable columns={columns} rows={rows} onEdit={handleEdit}/>
            {open && <Add slug={selectedRow ? "edit" : "branch"} data={selectedRow} columns={columns} setOpen={setOpen} />}
        </div>
    );  
}

export default AdminPanelBranchesView