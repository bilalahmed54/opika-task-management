import axios from "axios";
import Paper from '@mui/material/Paper';
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Stack } from "@mui/material";

export default function TaskListing() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const columns = [
    { field: 'title', headerName: 'Title', flex: 0.15, sortable: true, },
    { field: 'description', headerName: 'Description', flex: 0.25, sortable: true, },
    { field: 'priority', headerName: 'Priority', flex: 0.05, sortable: true, },
    {
      field: 'status',
      headerName: 'Status',
      type: 'number',
      flex: 0.05,
      sortable: true,
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      description: 'Task Deadline.',
      sortable: true,
      flex: 0.15,
      valueGetter: (_value, row) => {
        const date = row.deadline.split('T')[0];
        return date;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.15,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const handleEdit = (_e) => {
          const currentRow = params.row;
          navigate(
            `/task/${params.row.id}`,
            {
              state: {
                currentRow
              }
            }
          )
        };

        const handleDelete = async () => {
          setShowLoading(true);
          const response = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/task/${params.row.id}`);
          getTasks();
        }

        return (
          <Stack direction="row" spacing={2} style={{ marginTop: "10px" }} >
            <Button variant="contained" color="primary" size="small" onClick={handleEdit}>Edit</Button>
            <Button variant="contained" color="error" size="small" onClick={handleDelete}>Delete</Button>
          </Stack >
        );
      },
    }
  ];

  const [rows, setRows] = useState([]);
  useEffect(() => {
    getTasks()
  }, [])

  const getTasks = async () => {
    setShowLoading(true);
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/task`);
    const data = response.data.data;

    const updatedRows = data.map(row => {
      return {
        ...row,
        id: row._id
      }
    })

    setRows(updatedRows);
    setShowLoading(false)
  }

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <>
      <div style={{ textAlignLast: "end", marginTop: "30px", marginRight: "50px" }}>
        <Button variant='contained' onClick={() => navigate('/task')}>Add Task</Button>
      </div>
      {showLoading ? (
        <div style={{ textAlign: "center", top: "50%", left: "50%", position: "absolute" }}>
          <CircularProgress color="primary" />
        </div>

      ) :
        <Paper sx={{ height: "100%", width: '100%', marginTop: "70px", marginLeft: "20px", marginRight: "20px" }}>
          {rows.length > 0 ? <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20, 50]}
            // checkboxSelection
            sx={{ border: 0 }}
          /> :
            <div style={{ textAlign: "center", top: "50%", left: "50%", position: "absolute" }}>No Tasks to show</div>
          }

        </Paper>
      }
    </>
  );
}
