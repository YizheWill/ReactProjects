import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
const style = {
  marginTop: 30
};

const pageStyles = {
  width: 400
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div style={pageStyles}>
            <h3>登录/注册</h3>
            <TextField hintText="请输入用户名" floatingLabelText="用户名" onChange={(event, newValue) => this.setState({ username: newValue })} />
            <br />
            <TextField type="密码" hintText="请输入密码" floatingLabelText="密码" onChange={(event, newValue) => this.setState({ password: newValue })} />
            <br />
            <RaisedButton label="提交" primary={true} style={style} onClick={event => this.handleClick(event)} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
export default Login;
