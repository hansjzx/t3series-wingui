import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Popover, Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { SearchArea, InputField, BaseGrid, useViewStore, zAxios, ResultArea, CommonButton, RightButtonArea, LeftButtonArea, useUserStore, ButtonArea } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { loadOption, isEmptyArray, isEmpty } from "@wingui/view/demandplan/DpUtil";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";

function PopMapUserTransfer(props) {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      transferType: "MOVE",
    },
  });

  useEffect(() => {}, []);

  function saveData() {
    if (isEmpty(props.authTp)) {
      showMessage(transLangKey("MSG_CONFIRM"), "Auth Type is Empty");
    } else {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
        if (answer) {
          const toUserId = getValues("toUserId");
          if (isEmpty(toUserId)) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey("Select UserId"));
          } else {
            let param = new URLSearchParams();
            param.append("AUTH_TP_ID", props.authTp);
            param.append("FROM_OPERATOR_ID", props.operationId);
            param.append("TO_OPERATOR_ID", getValues("toUserId"));
            param.append("TRANSFER_TYPE", getValues("transferType"));
            param.append("USER_ID", username);

            zAxios({
              method: "post",
              url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_15_S3",
              data: param,
            })
              .then(function (response) {
                if (response.status === gHttpStatus.SUCCESS) {
                  const rsData = response.data;
                  if (rsData.RESULT_SUCCESS) {
                    const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_15_S3_P_RT_MSG"];
                    resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
                }
              })
              .catch(function (err) {
                console.log(err);
              })
              .then(function () {});
          }

          props.onClose();
        }
      });
    }
  }

  function setUserCd(items) {
    setValue("toUserId", items[0].USER_ID);
    setValue("toUserName", items[0].EMP_NM);
  }

  return (
    <>
      <Popover
        PaperProps={{ sx: { boxShadow: "rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px" } }}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}>
        <Box style={{ height: 220 }}>
          <Box>
            <InputField
              type={"action"}
              name="toUserId"
              useLabel={false}
              label={transLangKey("USER_ID")}
              control={control}
              readonly={true}
              onClick={() => {
                setUserPopupOpen(true);
              }}>
              <Icon.Search />
            </InputField>
          </Box>
          <Box>
            <InputField name="toUserName" label={transLangKey("EMP_NM")} control={control} readonly={false} disabled={false} />
          </Box>
          <Box>
            <InputField
              type="select"
              name="transferType"
              label={transLangKey("FIXED_PLAN_CONSUMPTION_TYPE")}
              control={control}
              readonly={false}
              disabled={false}
              options={[
                { label: "Copy", value: "COPY" },
                { label: "Move", value: "MOVE" },
              ]}
            />
          </Box>
          <Box>
            <Button
              style={{ marginLeft: "4px", width: "96%" }}
              variant={"contained"}
              endIcon={<SendIcon />}
              onClick={() => {
                saveData();
              }}>
              {"Transfer"}
            </Button>
          </Box>
        </Box>
      </Popover>
      {userPopupOpen && <PopSelectUser open={userPopupOpen} onClose={() => setUserPopupOpen(false)} confirm={setUserCd} multiple={false} />}
    </>
  );
}

PopMapUserTransfer.propTypes = {
  open: PropTypes.bool,
  operationId: PropTypes.string,
  authTp: PropTypes.string,
};

PopMapUserTransfer.displayName = "PopMapUserTransfer";

export default PopMapUserTransfer;
