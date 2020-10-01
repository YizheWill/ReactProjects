import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

import New from "material-ui/svg-icons/av/fiber-new";
import IconA from "material-ui/svg-icons/content/font-download";
import Settings from "material-ui/svg-icons/action/settings";
import Help from "material-ui/svg-icons/action/help";
import Build from "material-ui/svg-icons/action/build";
import SavedGames from "material-ui/svg-icons/device/storage";

const DrawerMenu = ({ open, onRequestChange, navigate }) => {
  const handleOnRequestChange = () => onRequestChange();

  const handleMenuItem = route => {
    onRequestChange();
    setTimeout(() => navigate(route), 100);
  };

  return (
    <Drawer docked={false} width={280} open={open} onRequestChange={() => handleOnRequestChange()}>
      <MenuItem primaryText="开始抽牌" leftIcon={<New />} onTouchTap={() => handleMenuItem("/")} />
      <MenuItem primaryText="塔罗日志" leftIcon={<SavedGames />} onTouchTap={() => handleMenuItem("/saved-games")} />
      <MenuItem primaryText="阿尔卡那" leftIcon={<IconA />} onTouchTap={() => handleMenuItem("/arcanums")} />
      <Divider />
      <MenuItem primaryText="更多设置" leftIcon={<Settings />} onTouchTap={() => handleMenuItem("/configs")} />
      <MenuItem primaryText="登录/注册" leftIcon={<Build />} onTouchTap={() => handleMenuItem("/signin")} />
    </Drawer>
  );
};

const mapDispatchToProps = dispatch => ({
  navigate: route => dispatch(push(route))
});

export default connect(null, mapDispatchToProps)(DrawerMenu);
