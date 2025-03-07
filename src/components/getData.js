import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";
import axios from "axios";

const GetData = ({ hostName }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(hostName + "get-data");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteEntry = async (id) => {
        try {
            await axios.delete(`${hostName}delete-data/${id}`);
            fetchData(); // Refresh data after deletion
            alert("Entry deleted successfully!");
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const resetData = async () => {
        try {
            await axios.post(`${hostName}reset-data`);
            fetchData(); // Refresh data after reset
            alert("All data has been reset!");
        } catch (error) {
            console.error("Error resetting data:", error);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "auto", marginTop: 4 }}>
            <Typography variant="h5" sx={{ textAlign: "center", margin: 2 }}>
                Saved Data
            </Typography>

            <Button 
                variant="contained" 
                color="error" 
                onClick={resetData} 
                sx={{ display: "block", margin: "10px auto" }}
            >
                Reset All Data
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><b>Name</b></TableCell>
                        <TableCell><b>Color Won</b></TableCell>
                        <TableCell><b>Action</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.color}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => deleteEntry(row.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default GetData;
