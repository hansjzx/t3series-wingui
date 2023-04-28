import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField, CommonButton, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";
import { useMenuStore } from "@zionex/wingui-core/src/store/contentStore";
import { uiSettings } from "@wingui/common/uiSettings";

const PasswordBox = {
  display: 'flex', justifyContent: 'center',
  alignItems: 'center', background: '#f6f6f6 !important'
}
const PasswordContentBox = {
  display: 'flex',
  alignItems: 'left',
  flexDirection: 'column',
  justifyContent: 'center',
  background: '#fff !important',
  width: '940px',
  padding: '35px'
}
const helperText = {
  required: transLangKey('PW_ERROR_MSG_0012'),
  confirmPassword: transLangKey('PW_ERROR_MSG_0013')
};
function Password(props) {
  const [initMenu] = useMenuStore(state => [state.initMenu])
  const [isLogin, setIsLogin] = useUserStore(state => [state.isLogin, state.setIsLogin])
  const [helperPolicyText, setHelperPolicyText] = useState(transLangKey('PW_ERROR_MSG_0012'))
  const [errorPassword, setErrorPassword] = useState(false)
  const [username] = useUserStore(state => [state.username])
  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  function savePassword() {
    let param = {
      newPassword: getValues('password'),
      confirmPassword: getValues('confirmPassword')
    }

    zAxios.post(baseURI() + 'system/users/password', param, {
      errorMessage: false
    })
      .then(res => {
        if (res.data.status === 200) {
          setErrorPassword(false)
          setIsLogin(true)
        }
      }).catch((error) => {
        if (error.response.data.status === 400) {
          setHelperPolicyText(error.response.data.message);
          setErrorPassword(true)
        }
      })
  }
  useEffect(() => {
    setValue('username', username)
  }, [])
  useEffect(() => {
    if (isLogin) {
      useUserStore.getState().setUserInfo();
      initMenu(uiSettings.mode)

      props.history.push("/home");
    }
  }, [isLogin])
  return (<>
    <Box className="main" sx={PasswordBox}>
      <Box sx={PasswordContentBox}>
        <Box sx={{ fontSize: '35px', marginBottom: '15px', borderRadius: '16px' }}>
          <Typography variant="h4" style={{ color: '#4682b4' }}>{"First, you need to change the password for your account."}</Typography>
        </Box>
        <Box><InputField control={control} label={transLangKey("USER_ID")} name="username" disabled={true} width="420px"></InputField></Box>
        <Box>
          <InputField control={control} dataType='password' label={transLangKey("PASSWORD")} name="password"
            error={errorPassword} rules={{ required: true }}
            helperText={helperPolicyText} width="420px"></InputField>
        </Box>
        <Box>
          <InputField control={control} dataType='password' label={transLangKey("CONFIRM_PASSWORD")} name="confirmPassword"
            rules={{ required: true, validate: { confirmPassword: value => value === getValues('password') } }}
            helperText={helperText} width="420px">
          </InputField>
        </Box>
        <Box><CommonButton type="text" variant="contained" title={"Save Password"} onClick={handleSubmit(savePassword)} style={{ width: "420px", height: "40px", margin: '6px' }}></CommonButton></Box>
      </Box>
    </Box>
  </>
  )
}

export default Password;