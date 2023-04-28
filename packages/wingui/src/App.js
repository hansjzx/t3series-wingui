import React, { useState, useEffect } from 'react';

import './App.css';

import { HashRouter, Redirect, Route } from 'react-router-dom';
import SideBar from '@zionex/wingui-core/src/layout/SideBar';
import Content from '@zionex/wingui-core/src/layout/Content';
import { useContentStore, useMenuStore } from '@zionex/wingui-core/src/store/contentStore'
import { uiSettings } from "@wingui/common/uiSettings";
import appTheme from '@zionex/wingui-core/src/common/AppTheme'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import lo from '@zionex/wingui-core/src/lang/LanguageObject';
import settings, { initSettings } from '@zionex/wingui-core/src/common/settings';
import Login from './view/pages/Login';
import Password from './view/pages/Password';
import { useHistory } from 'react-router-dom';
let initApp = false;

function App() {
  const history = useHistory();
  const [route, setRoute] = useState(null);
  const [menus, initMenu] = useMenuStore(state => [state.menus, state.initMenu])
  const [logout, isLogin, passwordExpired] = useUserStore(state => [state.logout, state.isLogin, state.passwordExpired])
  const [settingOptions, setSettingOptions] = useState({});
  const [setMenuType] = useContentStore(state => [state.setMenuType])

  if (isLogin && initApp == false) {
    initSettings(function () {
      vom.init();
      com.init();

      lo.init();

      initMenu(uiSettings.mode)
      setSettingOptions(settings);

      if (localStorage.getItem('menuType')) {
        setMenuType(localStorage.getItem('menuType'))
      }

      if (localStorage.getItem('preference-group') === null) {
        localStorage.setItem('preference-group', '[]');
      }
      flatpickr.setDefaults({ locale: localStorage.getItem("languageCode") })
      flatpickr.l10ns.default.weekAbbreviation = transLangKey("FP_WEEK_ABBREVIATION");
    });
    initApp = true;
  }
  useEffect(() => {
    window.addEventListener("focus", function (event) {
      var userinfo = useUserStore.getState().getUserInfo();
      if (userinfo) {
      } else {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0024'), { close: false, closeX: false }, function (answer) {
          if (answer) {
            logout()
            if (Object.values(settings).length > 0) {
              let loginUrl = settings.authentication.loginUrl;
              let start = loginUrl.indexOf('#');
              if (start === -1) {
                window.location.href = window.location.origin + '/#' + loginUrl.replace(origin, '');
              }
            } else {
              history.push('/login')
            }
          }
        })
      }
    });
  }, [])
  useEffect(() => {
    if (isLogin) {
      setRoute(<>
        <SideBar menus={menus} />
        <Content settings={settingOptions} menus={menus} />
      </>)
    } else {
      if (passwordExpired) {
        setRoute(<Redirect to={{ pathname: "/password" }} />)
      } else {
        setRoute(<Redirect to={{ pathname: "/login" }} />)
      }
    }
  }, [isLogin, menus])
  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <HashRouter>
            <Route path="/password" render={(props) => <Password {...props} />} />
            <Route path="/login" render={(props) => <Login {...props} />} />
            {route}
          </HashRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}

export default App;
