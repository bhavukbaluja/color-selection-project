import RouletteWheel from "./wheel/RouletteWheel";
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from "@mui/material";
import "./wheel/Wheel.scss";
import InviteVideo from "../assets/Invite_video.mp4";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
    
const HomePage=({hostName})=>{
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [mustSpin, setMustSpin] = useState(false);
    const [name, setName] = useState("");
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const videoRef = useRef(null);

    const unmuteVideo = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play(); // Ensure it resumes playing after unmuting
        }
    };
    return(
        <div container className="HomePage" 
         onClick={unmuteVideo}
        > 
            <Button variant="outlined" onClick={handleClickOpen} className="glowing-button">
                <span className="button-span">
                    <div>Spin the wheel to find out which color the couples will be wearing!</div>
                    <div>(Click Here)</div>
                </span>
            </Button>
            <span className="homepage-title">
                <div>
                    Join us in celebrating 50 years of love, laughter, and unforgettable memories as we honor the man who makes life brighter 
                </div>
                <div style={{textAlign: 'center', fontSize: '25px', fontWeight: 'bold'}}>
                    Dad
                </div>
            </span>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Spin the Wheel
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <RouletteWheel 
                        hostName={hostName} 
                        result={result} 
                        setResult={setResult} 
                        mustSpin={mustSpin} 
                        setMustSpin={setMustSpin}
                        name={name}
                        setName={setName}
                    />
                </DialogContent>
                {!mustSpin && result &&
                    (<DialogActions>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Button 
                                autoFocus 
                                onClick={handleClose} 
                                variant="contained"
                                color="primary"
                            >
                                Super Excited
                            </Button>
                        </Box>
                    </DialogActions>)
                }
            </BootstrapDialog>
            <video 
                src={InviteVideo} 
                autoPlay 
                loop 
                muted
                playsInline 
                ref={videoRef}
                onClick={unmuteVideo}
                style={{ width: "100%", height: "auto", maxWidth: '600px' }}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
export default HomePage;