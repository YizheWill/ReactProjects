import React from "react";
import AppBar from "material-ui/AppBar";
import "./HeaderBar.sass";
import LogoPic from "../../assets/img/logo.svg";

const HeaderBar = ({ toogleOpenDrawerMenu }) => <AppBar title={<img className="logo" src={LogoPic} />} position="absolute" titleStyle={{ hight: 20 }} iconClassNameRight="muidocs-icon-navigation-expand-more" className="app-head-bar" onLeftIconButtonTouchTap={() => toogleOpenDrawerMenu()} />;

export default HeaderBar;
