import { TextField, Button } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import "./Wheel.scss";

// Get the environment variable directly here
const NodeUrl = process.env.REACT_APP_NODE_URL || "http://localhost:9090/";

const RouletteWheel = ({ result, setResult, mustSpin, setMustSpin, name, setName }) => {
  const [error, setError] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [usedColors, setUsedColors] = useState([]);

  // Log the URL for debugging
  console.log("Using NodeUrl:", NodeUrl);

  const data = [
    { option: "Black" },
    { option: "Pink" },
    { option: "Blue" },
    { option: "Red" },
    { option: "Lavender" },
  ];

  const bgColors = ["#000", "#dc4baf", "#499eed", "#cc0000", "#e5c2d1"];
  const textColors = ["#ffffff", "#000", "#ffffff", "#ffffff", "#000"];

  // Fetch used colors
  const fetchUsedColors = useCallback(async () => {
    try {
      const response = await axios.get(`${NodeUrl}get-data`);
      if (Array.isArray(response.data)) {
        setUsedColors(response.data.map((entry) => entry.color));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("NodeUrl being used:", NodeUrl);
    }
  }, []);

  useEffect(() => {
    // Fetch colors once on component mount
    fetchUsedColors();
  }, [fetchUsedColors]);

  // Function to get a unique color index
  const getUniqueColorIndex = () => {
    const availableColors = data.filter((segment) => !usedColors.includes(segment.option));

    if (availableColors.length === 0) {
      alert("All colors have been used! Contact Admin.");
      return 0; // Fallback to first index instead of -1
    }
    setMustSpin(true);

    const newPrize = availableColors[Math.floor(Math.random() * availableColors.length)];
    return data.findIndex((segment) => segment.option === newPrize.option);
  };

  const handleSpinClick = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    
    // Get a new prize number and start spinning
    const newPrizeNumber = getUniqueColorIndex();
    
    if (typeof newPrizeNumber === "number" && newPrizeNumber >= 0 && newPrizeNumber < data.length) {
      setPrizeNumber(newPrizeNumber);
    } else {
      console.error("Invalid prize number:", newPrizeNumber);
      setPrizeNumber(0); // Set a fallback value
    }
  };

  // Handle wheel stopping
  const onStopSpinning = () => {
    setMustSpin(false);
    const colorWon = data[prizeNumber]?.option || "Unknown";
    setResult(colorWon);

    // Send data to backend
    saveResult(name, colorWon);
  };

  // Save result to backend
  const saveResult = async (userName, colorWon) => {
    try {
      await axios.post(`${NodeUrl}save-data`, { name: userName, color: colorWon });
      fetchUsedColors(); // Refresh the used colors
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("NodeUrl being used:", NodeUrl);
    }
  };

  // Get the color associated with an option
  const getColorForOption = (option) => {
    const index = data.findIndex((item) => item.option === option);
    return index !== -1 ? bgColors[index] : "transparent";
  };

  return (
    <>
      {(mustSpin || !result) && (
        <div className="roulette-wheel">
          <div>
            <span className="floating-rainbow-text">
              <b>Note:</b> Please enter both your name and your partner's name before spinning the wheel.
            </span>
          </div>
          <div>
            <TextField
              required
              id="name-input"
              label="Name"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
              helperText={error ? "Please enter your name" : ""}
              sx={{ width: "70vw", maxWidth: "400px" }}
            />
          </div>
          <div>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              backgroundColors={bgColors}
              textColors={textColors}
              onStopSpinning={onStopSpinning}
            />
          </div>
          <div>
            <Button
              onClick={handleSpinClick}
              variant="contained"
              color="primary"
              sx={{ width: "70vw", padding: "15px", maxWidth: "400px" }}
            >
              Spin the Wheel & Submit your Name
            </Button>
          </div>
        </div>
      )}

      {!mustSpin && result && (
        <div className="roulette-wheel">
          <h1>Congratulations,</h1>
          <h2>{name}</h2>
          <h3 className="mt-4 text-xl font-bold">🎉You have got: {result} Color🎉</h3>
          <div
            className="color-box"
            style={{ backgroundColor: getColorForOption(result) }}
          ></div>
          <ul>
            <li>Each couple should fill out the form only once.</li>
            <li>Please ensure both partners wear the assigned color.</li>
            <li>The best-dressed couple will receive a special prize! 🎉</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default RouletteWheel;   