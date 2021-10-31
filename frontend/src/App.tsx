import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { mainTheme } from './configs/MuiConfig';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from './components/Shared/LandingPage';
import CreateEmployee from './components/CreateEmployee/CreateEmployee';

const CreateProject = lazy(() => import('./components/Project/CreateProject'));
const ViewProject = lazy(() => import('./components/Project/ViewProject'));
const EditProject = lazy(() => import('./components/Project/EditProject'));
const PageNotFound = lazy(() => import('./components/Shared/PageNotFound'));
// const CreateBusinessAccount = lazy(() => import('./components/CreateBusinessAccount/CreateBusinessAccount'));

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={mainTheme}>
        <div className="App">
          <Suspense fallback={<LandingPage/>}>
            <Switch>
              <Route exact path="/project" render={() => <CreateProject edit="false" />} />
              <Route exact path="/project/:id" render={({ match }) => <EditProject id={match.params.id} />} />
              <Route exact path="/projects" render={() => <ViewProject />} />
              <Route exact path="/error" render={() => <PageNotFound />} />
              <Route exact path="/employee" render={() => <CreateEmployee/>} />
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
