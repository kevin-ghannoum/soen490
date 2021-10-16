import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import Login from './components/Login/Login';

const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <div className="App">
        <Login />
      </div>
    </ThemeProvider>
  );
};

export default App;
