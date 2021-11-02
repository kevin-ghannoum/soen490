import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';

const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <div className="App">
        <div>First Page</div>
      </div>
    </ThemeProvider>
  );
};

export default App;
