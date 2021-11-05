import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from './components/Shared/LandingPage';
import Sidebar from './components/Sidebar/Sidebar';
const CreateEmployee = lazy(() => import('./components/CreateEmployee/CreateEmployee'));
const Login = lazy(() => import('./components/Login/Login'));
const CreateClientAccount = lazy(() => import('./components/CreateClientAccount/CreateClientAccount'));
const CreateProject = lazy(() => import('./components/Project/CreateProject'));
const ViewProject = lazy(() => import('./components/Project/ViewProject'));
const EditProject = lazy(() => import('./components/Project/EditProject'));
const LogHours = lazy(() => import('./components/LogHours/LogHours'));
const PageNotFound = lazy(() => import('./components/Shared/PageNotFound'));
const CreateBusinessAccount = lazy(() => import('./components/CreateBusinessAccount/CreateBusinessAccount'));

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={mainTheme}>
        <div className="App">
          <Suspense fallback={<LandingPage />}>
            <Switch>
              <Route exact path="/project" render={() => <CreateProject edit="false" />} />
              <Route exact path="/project/:id" render={({ match }) => <EditProject id={match.params.id} />} />
              <Route exact path="/projects" render={() => <ViewProject />} />
              <Route exact path="/employees" render={() => <LogHours />} />
              <Route exact path="/error" render={() => <PageNotFound />} />
              <Route exact path="/businessAccount/new" render={() => <CreateBusinessAccount />} />
              <Route exact path="/clientAccount/new" render={() => <CreateClientAccount />} />
              <Route exact path="/employeeAccount/new" render={() => <CreateEmployee />} />
              <Route exact path="/login" render={() => <Login />} />
              <Route exact path="/" render={() => <div style={{paddingTop: "75px"}}> <Sidebar /> root</div>} />
              <Route path="*" render={() => <PageNotFound />} />
            </Switch>
          </Suspense>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
