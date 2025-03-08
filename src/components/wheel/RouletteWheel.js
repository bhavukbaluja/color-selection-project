import { TextField, Button } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import "./Wheel.scss";

const RouletteWheel = ({ NodeUrl, result, setResult, mustSpin, setMustSpin, name, setName }) => {
  const [error, setError] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [usedColors, setUsedColors] = useState([]);
  const data = [
    { option: "Black" },
    { option: "Pink" },
    { option: "Blue" },
    { option: "Red" },
    { option: "Lavender" },
  ];

  const bgColors = ["#000", "#dc4baf", "#499eed", "#cc0000", "#e5c2d1"];
  const textColors = ["#ffffff", "#000", "#ffffff", "#ffffff", "#000"];

  
  const fetchUsedColors = useCallback(async () => {
    try {
      const response = await axios.get(NodeUrl + "get-data");
      setUsedColors(response.data.map((entry) => entry.color));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [NodeUrl]); // Depend only on NodeUrl
  
  // useEffect(() => {
  //   fetchUsedColors();
  // }, [fetchUsedColors]);
  


  const getUniqueColorIndex = () => {
    const availableColors = data.filter((segment) => !usedColors.includes(segment.option));
    if (availableColors.length === 0) {
      alert("All colors have been used! Contact Admin");
      return -1;
    }
    const newPrize = availableColors[Math.floor(Math.random() * availableColors.length)];
    return data.findIndex((segment) => segment.option === newPrize.option);
  };

  const handleSpinClick = async () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    await fetchUsedColors();
    const newPrizeNumber = getUniqueColorIndex();
    if(newPrizeNumber!==-1){
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    const colorWon = data[prizeNumber].option;
    setResult(colorWon);

    // Send data to the backend after the spin stops
    saveResult(name, colorWon);
  };

  const saveResult = async (userName, colorWon) => {
    try {
      await axios.post(NodeUrl + "save-data", { name: userName, color: colorWon });
      fetchUsedColors();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const getColorForOption = (option) => {
    const index = data.findIndex(item => item.option === option);
    return index !== -1 ? bgColors[index] : "transparent"; // Default color if not found
  };
  return (
    <>
    { (mustSpin || !result) &&
      <div className="roulette-wheel" container>
        <div>
          <span className="floating-rainbow-text">
            <b>Note:</b> Please enter both your name and your partner's name in the box below before spinning the wheel.
          </span>
        </div>
        <div>
          <TextField
            required
            id="name-input"
            label="Name"
            name="name"
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
            onStopSpinning={onStopSpinning} // Call this when the wheel stops spinning
            textColors={textColors}
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
      }
      {!mustSpin && result && (
        <div className="roulette-wheel" container>
          <h1>Congratulations,</h1>
          <h2>{name}</h2>
          <h3 className="mt-4 text-xl font-bold">🎉You have got: {result} Color🎉</h3>
          <div
            className="color-box"
            style={{
              backgroundColor: getColorForOption(result),
            }}
          ></div>
          <ul>
            <li>Each couple should fill out the form only once.</li>
            <li>Please ensure that both partners wear Western attire in the assigned color.</li>
            <li>A special prize will be awarded to the best-dressed couple, chosen by the birthday boy! 🎉</li>
          </ul>
        </div>
      )}
    </>
  );
  
};

export default RouletteWheel;