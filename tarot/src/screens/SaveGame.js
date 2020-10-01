import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { saveGame, showNotification } from "../actions";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import moment from "moment";
import "moment/locale/zh-cn";

const styles = {
  root: {
    display: "block",
    width: "90%",
    margin: "0 auto"
  },
  floatingLabelStyle: {
    color: "rgb(255, 255, 255)"
  },
  underlineFocusStyle: {
    borderColor: "rgb(255, 255, 255)"
  },
  button: {
    width: "30%",
    margin: "33px 20px"
  }
};

class SaveGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      observationsField: "",
      textFieldError: "",
      observationTitle: "",
      titleError: "",
      canSave: true
    };
  }

  handleSaveGame() {
    if (!this.state.canSave) return;

    if (!this.state.observationTitle || !this.state.observationsField) {
      if (!this.state.observationTitle) this.setState({ titleError: "没有输入日志标题" });
      if (!this.state.observationsField) this.setState({ textFieldError: "没有输入任何日志" });
      return;
    }

    this.saveGame();
  }

  saveGame() {
    this.setState({ observationsField: "", canSave: false });

    const date = moment();
    const save = {
      spreadType: this.props.spreadTypeState,
      choices: this.props.userChoiceState,
      observations: this.state.observationsField,
      timestamp: date,
      fullDate: date.format("ll"),
      hour: date.format("a HH[:]mm")
    };
    this.props.saveGame(save);

    this.props.showNotification({
      open: true,
      message: "抽牌记录保存成功",
      duration: 3000
    });

    setTimeout(() => this.props.navigate("/"), 300);
  }

  render() {
    return (
      <div>
        <TextField floatingLabelText="请输入日志标题" multiLine={true} rows={1} rowsMax={6} style={styles.root} floatingLabelStyle={styles.floatingLabelStyle} underlineFocusStyle={styles.underlineFocusStyle} errorText={this.state.titleError} onChange={(e, value) => this.setState({ observationTitle: value, titleError: "" })} value={this.state.observationTitle} />
        <TextField floatingLabelText="请输入日志内容" multiLine={true} rows={3} rowsMax={10} style={styles.root} floatingLabelStyle={styles.floatingLabelStyle} underlineFocusStyle={styles.underlineFocusStyle} errorText={this.state.textFieldError} onChange={(e, value) => this.setState({ observationsField: value, textFieldError: "" })} value={this.state.observationsField} />
        <RaisedButton label="保存日志" style={styles.button} disabled={!this.state.canSave} onTouchTap={() => this.handleSaveGame()} />
        <RaisedButton label="保存并发布" style={styles.button} disabled={!this.state.canSave} onTouchTap={() => this.handlePublishGame()} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  spreadTypeState: state.spreadTypeState.type,
  userChoiceState: state.userChoiceState
});

const mapDispatchToProps = dispatch => ({
  navigate: route => dispatch(push(route)),
  saveGame: state => dispatch(saveGame(state)),
  showNotification: notification => dispatch(showNotification(notification))
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveGame);
