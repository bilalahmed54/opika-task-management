import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import { useStyles } from "../componets/utils";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const CreateUpdateTask = () => {
  const classes = useStyles();
  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [dateHandler, setDateHandler] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    deadline: ""

  });
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTask = async () => {
    setShowLoading(true);

    if (params.id) {
      try {
        const res = await axios
          .put(`${process.env.REACT_APP_BACKEND_BASE_URL}/task/${params.id}`, {
            title: inputs.title,
            description: inputs.description,
            priority: inputs.priority,
            status: inputs.status,
            deadline: inputs.deadline
          })
        const data = res.data;
        if (data.message.includes('Task updated successfully')) {
          setShowLoading(false);
          setIsNotificationOpen(true);
          navigate('/');
        }

      } catch (error) {
        console.log('Error fetching data:', error);
      }
    } else {
      try {
        const res = await axios
          .post(`${process.env.REACT_APP_BACKEND_BASE_URL}/task`, {
            title: inputs.title,
            description: inputs.description,
            priority: inputs.priority,
            status: inputs.status,
            deadline: inputs.deadline
          })
        const data = res.data;
        if (data.message.includes('Task saved successfully')) {
          setShowLoading(false);
          setIsNotificationOpen(true);
          navigate('/');
        }

      } catch (error) {
        console.log('Error fetching data:', error);
      }
    }

  };

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsNotificationOpen(false);
  };

  const statusOptions = ['To Do', 'In Progress', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High'];

  useEffect(() => {
    if (params.id && state) {
      setInputs({
        title: state.currentRow.title,
        description: state.currentRow.description,
        status: state.currentRow.status,
        priority: state.currentRow.priority,
        deadline: state.currentRow.deadline
      })
    }

  }, [params]);

  const getFormattedDate = (dateStr) => {
    if (dateHandler) {
      return dateStr
    } else if (dateStr) {
      const date = dateStr.split('T')[0];
      return date;
    } else {
      return ""
    }
  }

  return (
    <div>
      {params.id ?
        <Snackbar
          open={isNotificationOpen}
          autoHideDuration={5000}
          onClose={handleClose}
          message="Task has been updated successfully"
        />
        :
        <Snackbar
          open={isNotificationOpen}
          autoHideDuration={5000}
          onClose={handleClose}
          message="Task has been added successfully"
        />
      }
      <form>
        <Box
          borderRadius={10}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={3}
          display="flex"
          flexDirection={"column"}
          width={"80%"}
        >
          <Typography
            className={classes.font}
            padding={3}
            color="grey"
            variant="h2"
            textAlign={"center"}
          >
            {params.id ? 'Update Task' : "Create Task"}
          </Typography>
          <InputLabel className={classes.font} sx={labelStyles}>
            Task Title
          </InputLabel>
          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="auto"
            variant="outlined"
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Task Description
          </InputLabel>
          <TextField
            type="text"
            className={classes.font}
            name="description"
            onChange={handleChange}
            value={inputs.description}
            margin="auto"
            variant="outlined"
          />
          <InputLabel className={classes.font} sx={labelStyles}>
            Task Priority
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={inputs.priority}
            label="priority"
            name='priority'
            onChange={handleChange}
            style={{ width: "100%" }}
            defaultValue={inputs.priority}
          >
            {priorityOptions.map(priority => {
              return <MenuItem value={priority}>{priority}</MenuItem>
            })}
          </Select>
          <InputLabel className={classes.font} sx={labelStyles}>
            Task status
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={inputs.status}
            defaultValue={inputs.status}
            name='status'
            label="status"
            onChange={handleChange}
            style={{ width: "100%" }}
          >
            {statusOptions.map(status => {
              return <MenuItem value={status}>{status}</MenuItem>
            })}
          </Select>
          <InputLabel className={classes.font} sx={labelStyles}>
            Task deadline
          </InputLabel>
          <input type='date' id='deadline' name='deadline'
            value={getFormattedDate(inputs.deadline)}
            style={{ height: "60px" }}
            placeholder="Deadline"
            className="input"
            onChange={handleChange} />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {!showLoading &&
              <Button
                variant="contained"
                onClick={handleTask}
              >
                {params.id ? 'Update Task' : "Add Task"}
              </Button>
            }
            {showLoading &&
              <Button variant='contained' classname='d-flex'>
                <CircularProgress style={{ color: "white", marginRight: "10px" }} size='1.2rem' />
                Loading
              </Button>
            }
            <Button variant='contained' color='error' onClick={() => navigate('/')} style={{ marginLeft: "7px", borderRadius: "4", mt: 2 }}>Cancel</Button>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default CreateUpdateTask;
