import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridValidRowModel } from '@mui/x-data-grid';
import "./dataTable.scss"
import { useState } from 'react';

type Props = {
    columns: GridColDef[],
    rows: readonly GridValidRowModel[];
    onEdit: (row: any) => void;
}

const editItem = (row, setSelectedRow) => {
    setSelectedRow(row);
};

const handleDelete = (id: number) => {
    //delete the item
    console.log(id + "has been deleted");
};


const dataTable = (props: Props) => {

    const [selectedRow, setSelectedRow] = useState(null);
        
    const actionColumn: GridColDef = {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
          return (
            <div className="action">
              <div className="edit" onClick={() => props.onEdit(params.row)}>
                <img src="/edit.svg" alt="" />
              </div>
              <div className="delete" onClick={() => handleDelete(params.row.id)}>
                <img src="/delete.svg" alt="" />
              </div>
            </div>
          );
        },
      };

    return (
        <div className="dataTable">
          <DataGrid
            className='dataGrid'
            rows={props.rows}
            columns={[...props.columns, actionColumn]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slots={{toolbar: GridToolbar}}
            slotProps={{
                toolbar:{
                    showQuickFilter: true,
                    quickFilterProps:{ debounceMs: 500 },
                },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableDensitySelector
            disableColumnSelector
          />
        </div>
      );
};

export default dataTable