import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { blue } from "@mui/material/colors";

import MVPApp from "apps/MVPApp";
import MainApp from "apps/MainApp";
import ExampleHexGrid from "apps/ExampleHexGrid";
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
    {/* <ExampleHexGrid /> */}
  </ThemeProvider>
}

export default App;
