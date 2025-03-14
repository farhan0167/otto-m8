import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";


export const DatePickerField = ({ 
    field,
    blockData,
    onDataChange,
 }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(blockData[field.name]));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDataChange(field.name, date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300, marginBottom: 2 }}>
        <p style={{fontWeight: '600', marginBottom: '0'}}>{field.display_name}</p>
        <DatePicker
          label="Select a Date"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
    </LocalizationProvider>
  );
};
