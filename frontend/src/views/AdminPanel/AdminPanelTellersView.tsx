import React, { useState } from 'react';
import "../../styles/AdminPanel/AdminPanelTellersView.scss"
import Add from '../../components/addBranchTeller/add';
import DataTable from '../../components/dataTableBranchTeller/dataTable';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'branch', headerName: 'Branch ID', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 150 },
    { field: 'appointee', headerName: 'Teller', width: 200 },
  ];

  const rows: GridRowsProp = [
    { id: 1, branch: '1', rating: '4.5', appointee: "Neko Nekic" },
    { id: 2, branch: '2', rating: '3.5', appointee: "Neko Nekic 2" },
    { id: 3, branch: '3', rating: '4.0', appointee: "Neko Nekic 3" }
  ];

const AdminPanelTellersView = () =>{
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleCreateNewTeller = () => {
        setSelectedRow(null); // Reset selectedRow when creating a new teller
        setOpen(true);
    };

    return (
        <div className="tellers">
            <div className="info">
            <button onClick={handleCreateNewTeller}>Create a new teller</button>
            </div>
            <DataTable columns={columns} rows={rows} onEdit={handleEdit}/>
            {open && <Add slug={selectedRow ? "edit" : "teller"} data={selectedRow} columns={columns} setOpen={setOpen} />}
        </div>
    );  
}

export default AdminPanelTellersView