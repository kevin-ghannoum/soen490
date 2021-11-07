import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import LandingPage from './components/Shared/LandingPage';
import Sidebar from './components/Sidebar/Sidebar';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import localStorageService from './services/LocalStorageService';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getAccount, selectAccount } from './features/account/AccountSlice';
import { loginWithRefreshToken } from './services/AccountAPI';
const CreateEmployee = lazy(() => import('./components/CreateEmployee/CreateEmployee'));
const Login = lazy(() => import('./components/Login/Login'));
const CreateClientAccount = lazy(() => import('./components/CreateClientAccount/CreateClientAccount'));
const CreateProject = lazy(() => import('./components/Project/CreateProject'));
const ViewProject = lazy(() => import('./components/Project/ViewProject'));
const EditProject = lazy(() => import('./components/Project/EditProject'));
const LogHours = lazy(() => import('./components/LogHours/LogHours'));
const PageNotFound = lazy(() => import('./components/Shared/PageNotFound'));
const CreateBusinessAccount = lazy(() => import('./components/CreateBusinessAccount/CreateBusinessAccount'));
const TaskList = lazy(() => import('./components/Task/TaskList'));
const CreateTask = lazy(() => import('./components/Task/CreateTask'));
const EditTask = lazy(() => import('./components/Task/EditTask'));

const App = () => {
  const account = useAppSelector(selectAccount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!account.authenticated && localStorageService.getRefreshToken()) {
      loginWithRefreshToken(localStorageService.getRefreshToken() as string)
        .then((res) => {
          localStorageService.setToken({
            accessToken: res.data.access_token,
            idToken: res.data.id_token,
            refreshToken: localStorageService.getRefreshToken() as string,
          });
          localStorageService.setBearerToken();
          dispatch(getAccount());
        })
        .catch(() => {
          localStorageService.clearAllTokens();
        });
    }
  }, [account.authenticated, dispatch]);

  axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      return response;
    },
    (error) => {
      if (error.response.data.message === 'jwt expired') {
        const request = error.config;
        delete axios.defaults.headers.common.Authorization;
        delete request.headers.Authorization;

        loginWithRefreshToken(localStorageService.getRefreshToken() as string)
          .then((res) => {
            localStorageService.setToken({
              accessToken: res.data.access_token,
              idToken: res.data.id_token,
              refreshToken: localStorageService.getRefreshToken() as string,
            });
            localStorageService.setBearerToken();
          })
          .catch((err) => {
            localStorageService.clearAllTokens();
            return Promise.reject(new Error('Request failed due to credential, try re-login'));
          });
      } else {
        return Promise.reject(error);
      }
    }
  );

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
              <Route
                exact
                path="/tasks"
                render={() => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <TaskList />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/tasks/new"
                render={() => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <CreateTask edit="false" />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                exact
                path="/tasks/edit/:id"
                render={({ match }) => (
                  <React.Fragment>
                    <div style={{ paddingTop: '75px' }}>
                      <Sidebar />
                      <EditTask id={match.params.id} edit="true" />
                    </div>
                  </React.Fragment>
                )}
              />
              <Route exact path="/login" render={() => <Login />} />
              <Route exact path="/" render={() => <div>root</div>} />
              <Route path="*" render={() => <PageNotFound />} />
            </Switch>
          </Suspense>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
