import React, { useEffect, createContext, useContext, useReducer } from "react";
import "./App.css";
import {
  useHistory,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import MyFollowing from "./components/Following";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();
const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      console.log(typeof user, user);
      // history.push("/"); 这样每次刷新就不至于回到主页了。
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      {/* switch will make sure that only one route works at a time */}
      <Route exact path="/" component={state ? Home : Signin} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/createpost" component={CreatePost} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/myfollowing" component={MyFollowing} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route exact path="/reset/:token" component={ResetPassword} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
