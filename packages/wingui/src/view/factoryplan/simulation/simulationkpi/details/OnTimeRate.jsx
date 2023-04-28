import React from 'react';
import { Box, LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '34%',
  top: '33%',
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgb(36 153 239 / 13%)',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#2499ef'
  },
  [`& .${linearProgressClasses.bar1Determinate}`]: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  cursor: 'pointer'
}));

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    "& > .MuiBox-root": {
      flexGrow: 1,
      position: "relative",
      margin: "0 4rem",
      height: "100%"
    }
  },
  progressLabel: {
    position: "absolute",
    width: "100%",
    height: "34%",
    top: "32%",
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    "& span": {
      width: "100%",
      color: "white",
      fontSize: "20px"
    }
  }
});

function OnTimeRate(props) {
  const classes = useStyles();
  
  function handleDoubleClick() {
    props.onDblClick(null, null, 'ordertracking');
  }
  
  return (
    <Box className={classes.root}>
      <Box>
        <BorderLinearProgress variant="determinate" value={props.data} />
        <Box className={classes.progressLabel} onDoubleClick={handleDoubleClick}>
          <span style={{ transform: `translateX(-${(100 - props.data) / 2}%)` }}>{`${props.data} %`}</span>
        </Box>
      </Box>
    </Box>
  );
}

export default OnTimeRate;
