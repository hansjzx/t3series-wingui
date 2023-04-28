import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { FormArea, InputField, CommonButton, PopupDialog } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

function PopComment(props) {
  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (props.commentData && props.commentData.CMT != undefined) {
      setValue("cmt", props.commentData.CMT);
    } else setValue("cmt", "");
  }, [props.commentData]);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  // popup 확인
  const saveSubmit = () => {
    const cmt = getValues("cmt");
    let commentData = props.commentData;
    if (!commentData) commentData = {};

    commentData.CMT = cmt;

    if (props.confirm) {
      props.confirm(commentData);
    }
    if (props.onClose) props.onClose(false);
  };

  const onPopupSubmit = () => {
    saveSubmit();
  };
  return (
    <PopupDialog
      open={props.open}
      onClose={props.onClose}
      onSubmit={handleSubmit(saveSubmit, onError)}
      title="Comment"
      resizeHeight={170}
      resizeWidth={360}
      buttons={
        <>
          <CommonButton
            width="60px"
            onClick={() => {
              saveSubmit();
            }}>
            {transLangKey("SAVE")}
          </CommonButton>
          <CommonButton width="60px" onClick={props.onClose}>
            {transLangKey("CANCEL")}
          </CommonButton>
        </>
      }>
      <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
        <FormArea>
          <InputField type="textarea" name="cmt" label={transLangKey("COMMENT")} control={control} labelStyle={{ minWidth: "200px" }} />
        </FormArea>
      </Box>
    </PopupDialog>
  );
}

PopComment.propTypes = {
  open: PropTypes.bool.isRequired,
  commentData: PropTypes.object.isRequired,
  confirm: PropTypes.func,
  onClose: PropTypes.func,
};

PopComment.displayName = "PopComment";

export default PopComment;
