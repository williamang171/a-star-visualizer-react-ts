import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { blue } from "@mui/material/colors";

import MainApp from "apps/MainApp";
import Navbar from "components/Navbar";

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Navbar />
    <Box sx={{ mb: 2 }} />
    {/* <MVPApp /> */}
    <MainApp />
  </ThemeProvider>
}

export default App;
