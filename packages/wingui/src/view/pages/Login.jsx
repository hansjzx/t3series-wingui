import React, { useEffect, useState } from "react";
import { InputField, useUserStore, CommonButton } from "@zionex/wingui-core/src/common/imports";
import { useForm } from "react-hook-form";
import { Alert, Box, IconButton, InputAdornment, Snackbar, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { uiSettings } from "@wingui/common/uiSettings";
import { useMenuStore } from "@zionex/wingui-core/src/store/contentStore";
import { useContentStore } from "@zionex/wingui-core/src/store/contentStore";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";

const loginBox = {
  display: 'flex', justifyContent: 'center',
  alignItems: 'center',
}
const loginContentBox = {
  display: 'flex',
  alignItems: 'left',
  flexDirection: 'column',
  justifyContent: 'center'
}
function Login(props) {
  const [initMenu] = useMenuStore(state => [state.initMenu])
  const [toast, setToast] = useState(false);
  const [isLogin, login, passwordExpired] = useUserStore(state => [state.isLogin, state.login, state.passwordExpired])
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      rememberme: []
    }
  });
  useEffect(() => {
    useContentStore.getState().initContentData()
    let rememberCheck = JSON.parse(localStorage.getItem('rememberCheck'));
    if (rememberCheck) {
      const username = localStorage.getItem('username');
      setValue('rememberme', ['true'])
      setValue('username', username)
    } else {
      setValue('rememberme', [''])
    }
  }, [])
  useEffect(() => {
    rememberUsername()
  }, [watch('rememberme')]);
  useEffect(() => {
    if (isLogin) {
      useUserStore.getState().setUserInfo();
      initMenu(uiSettings.mode)

      props.history.push("/home");
    } else {
      if (passwordExpired) {
        props.history.push("/password");
      }
    }
  }, [isLogin, passwordExpired])

  function loginHandler() {
    rememberUsername()
    login({ username: getValues('username'), password: getValues('password'), }).then((res => {
      if (res) {
      } else {
        setToast(true)
      }
    }))
  }
  function rememberUsername() {
    if (getValues('rememberme').includes('true')) {
      localStorage.setItem('rememberCheck', true)
      localStorage.setItem('username', getValues('username'))
    } else {
      localStorage.setItem('rememberCheck', false)
      localStorage.setItem('username', '')
    }
  }
  function hideToast() {
    setToast(false)
  }
  return (
    <>
      <Box className="main" sx={loginBox}>
        <Box sx={loginContentBox}>
          <Box><img alt="T3SmaertSCM-Logo" src={baseURI() + "images/login/logo.png"} /></Box>
          <Box><InputField control={control} label={''} hiddenLabel={true} name="username" width="330px"></InputField></Box>
          <Box><InputField control={control} type="action" label={''} hiddenLabel={true}
            name="password"
            dataType={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            } width="330px" onKeyPress={(e) => { if (e.key === 'Enter') { loginHandler() } }}></InputField></Box>
          <Box><InputField control={control} type="check" name="rememberme" options={[{ label: "Remember me", value: "true" }]}></InputField></Box>
          <Box><CommonButton type="text" variant="contained" title={"Sign in"} onClick={loginHandler} style={{ width: "330px", height: "40px", margin: '6px' }}></CommonButton></Box>
          <Box><Typography variant="h7" align="center" style={{ margin: "0 20px" }}>{"Copyright © " + new Date().getFullYear() + " Zionex Inc. All Rights Reserved."}</Typography></Box>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000} open={toast}
      >
        <Alert onClose={hideToast} variant="outlined" severity="error" sx={{ width: "100%" }}>
          {transLangKey('MSG_LOGIN_FAIL')}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Login;