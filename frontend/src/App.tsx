import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';

const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <div className="App">
        <CreateEmployee />
      </div>
    </ThemeProvider>
  );
};

export default App;
