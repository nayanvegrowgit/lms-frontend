import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createTheme, styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  align: "right",
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  width: 200,
  lineHeight: "60px",
  marginBottom: "5px",
}));

export default function Elevation() {
  return (
    <Box rowGap={2} display={"flex"} justifyContent={"flex-end"} gap="5px">
      <Item key={1} elevation={2}>
        {`elevation=2`}
      </Item>
      <Item key={2} elevation={1}>
        {`elevation=2`}
      </Item>
      <Item key={3} elevation={2}>
        {`elevation=2`}
      </Item>
      <Item key={4} elevation={1}>
        {`elevation=2`}
      </Item>
    </Box>
  );
}
