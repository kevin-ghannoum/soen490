import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from './components/Shared/LandingPage';
import Sidebar from './components/Sidebar/Sidebar';
import React from 'react';
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
              <Route
                exact
                path="/project"
                render={() => (
                  <React.Fragment>
                    <Sidebar />
                    <CreateProject edit="false" />
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/project/:id"
                render={({ match }) => (
                  <React.Fragment>
                    <Sidebar />
                    <EditProject id={match.params.id} />
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/projects"
                render={() => (
                  <React.Fragment>
                    <Sidebar />
                    <ViewProject />
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/employees"
                render={() => (
                  <React.Fragment>
                    <Sidebar />
                    <LogHours />
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/error"
                render={() => (
                  <React.Fragment>
                    <Sidebar />
                    <PageNotFound />
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/businessAccount/new"
                render={() => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <CreateBusinessAccount />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/clientAccount/new"
                render={() => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <CreateClientAccount />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/employeeAccount/new"
                render={() => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <CreateEmployee />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route exact path="/login" render={() => <Login />} />
              <Route
                exact
                path="/"
                render={() => (
                  <div style={{ paddingTop: '75px' }}>
                    <Sidebar /> root
                  </div>
                )}
              />
              <Route path="*" render={() => <PageNotFound />} />
            </Switch>
          </Suspense>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
