import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { PopupDialog, InputField, CommonButton, useUserStore, zAxios, FormRow, VLayoutBox, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { IconButton } from "@mui/material";

function PopNoticeDetail(props) {
  const [username] = useUserStore((state) => [state.username]);
  const getNoticeValue = (propName, def) => {
    if (props.notice) {
      return props.notice[propName];
    }
    else return def;
  }
  const { handleSubmit, getValues, setValue, control, formState: { errors }, clearErrors, watch } = useForm({
    defaultValues: {
      'createDttm': getNoticeValue('createDttm'),
      'createByDisplayName': getNoticeValue('createByDisplayName'),
      'content': getNoticeValue('content'),
      'noticeYn': [''],
      bastSelectYn: []
    }
  });

  const [popupMode, setPopupMode] = useState(props.popupMode)
  const [AttatchFiles, setAttachFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    if (props.open === true && props.notice) {
      loadFiles(props.notice.id);
      setValue('createDttm', getNoticeValue('createDttm'))
      setValue('createByDisplayName', getNoticeValue('createByDisplayName'))
      setValue('content', getNoticeValue('content'))
      setValue('noticeYn', getNoticeValue('noticeYn', false) === true ? ['Y'] : [''])
    }
    if (popupMode === 'NEW') {
      setValue('title', '')
    } else {
      setValue('title', getNoticeValue('title'))
    }
  }, [props.open, props.notice, popupMode])

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const loadFiles = (board_id) => {
    zAxios.get('noticeboard-file', {
      params: {
        BOARD_ID: board_id
      },
      fromPopup: true,
    }).then(function (response) {
      const attachFiles = [];

      if (response.data.length !== 0) {
        response.data.forEach(function (data) {
          var file = {
            id: data.id,
            name: data.fileName,
            size: data.fileSize,
            extension: '.' + data.fileType
          }
          attachFiles.push(file);
        });
      }
      setAttachFiles(attachFiles)
    }).catch(function (error) {
      console.log(error);
      setAttachFiles([])
    })
  }

  const handleFileUploaderChange = (choosenFiles) => {
    setUploadedFiles(choosenFiles)
  }

  const saveSubmit = () => {
    if (popupMode !== 'READ') {
      let notice = props.notice ? props.notice : {}

      let noticeYnArr = getValues('noticeYn')
      notice.content = getValues('content')
      notice.title = getValues('title')
      notice.noticeYn = noticeYnArr.length > 0 ? noticeYnArr[0] : 'N'
      if (!notice.noticeYn) {
        notice.noticeYn = 'N';
      }

      if (!notice.files) {
        notice.files = [];
      }

      props.confirm(notice, uploadedFiles, popupMode);
    }
    props.onClose(false);
  }

  const deleteFile = (id) => {
    showMessage(transLangKey('WARNING'), transLangKey('파일을 삭제하시겠습니까?'), function (answer) {
      if (!answer) {
        return;
      }

      const fileInfo = AttatchFiles.find((f) => f.id == id)
      if (!fileInfo) {
        return;
      }

      return axios({
        method: "POST",
        data: fileInfo,
        url: `file-storage/files/delete?ID=${id}&USER_ID=${username}`,
        fromPopup: true,
      }
      ).then(function (response) {
        if (response.status === gHttpStatus.SUCCESS) {
          let newAttatchFiles = [...AttatchFiles];
          var index = newAttatchFiles.indexOf(fileInfo);
          if (index !== -1) {
            newAttatchFiles.splice(index, 1);
          }
          setAttachFiles(newAttatchFiles);
        }
      }).catch(function (err) {
        console.log(err);
      });
    })
  }

  const downloadFile = async (id) => {
    return zAxios({
      fromPopup: true,
      method: "GET",
      url: baseURI() + `file-storage/file?ID=${id}`,
      responseType: 'blob'
    }
    ).then(function (response) {
      if (response.status === gHttpStatus.SUCCESS) {
        let fileName = decodeURI(response.headers["content-disposition"].split("filename=")[1]);
        fileName = fileName.replaceAll("\"", '')

        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
          window.navigator.msSaveOrOpenBlob(response.data, fileName);
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;

          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    }).catch(function (err) {
      console.log(err);
    });
  }
  function checkUpdate() {
    if (popupMode == 'NEW') {
      if (getValues('content') !== undefined) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
          if (answer) {
            props.onClose()
          }
        })
      } else {
        props.onClose()
      }
    } else if (popupMode === 'MODIFY') {
      if (props.notice.content !== getValues('content')) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
          if (answer) {
            props.onClose()
          }
        })
      } else {
        props.onClose()
      }
    } else if (popupMode === 'READ') {
      props.onClose()
    }
  }
  return (
    <PopupDialog type={popupMode == 'READ' ? 'OK' : 'OKCANCEL'} open={props.open} onClose={checkUpdate} onSubmit={handleSubmit(saveSubmit, onError)} title={getNoticeValue('title')} resizeHeight={650} resizeWidth={1050}>
      <VLayoutBox style={{ height: '100%' }} type={'noWrapFlex'}>
        {
          popupMode !== 'READ' ? (
            <FormRow>
              <InputField name='title' control={control} width="300px" label={transLangKey('NB_POST_TITLE')}></InputField>
              <InputField type="check" name={"bastSelectYn"} label="" control={control} options={[{ label: transLangKey("NB_NOTICE"), value: "Y" }]} />
            </FormRow>
          ) : null
        }
        {
          popupMode === 'READ' ? (
            <FormRow>
              <InputField name='createDttm' control={control} label={transLangKey('NB_POST_DATE')} type='datetime' readonly={true}></InputField>
              <InputField name='createByDisplayName' control={control} label={transLangKey('WRITER')} readonly={true}></InputField>
              {getNoticeValue('createBy') === username ? (<CommonButton type="text" onClick={() => setPopupMode('MODIFY')}>{transLangKey('MODIFY')}</CommonButton>) : null}
            </FormRow>
          ) : null
        }
        <FormRow style={{ flex: 'auto' }}>
          <InputField
            id="noticeBoardFileUploader"
            name='content'
            control={control}
            label='내용'
            placeholder="내용을 입력해주세요."
            width="100%"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            type='editor'
            wrapStyle={{ width: '100%', padding: 0 }}
            style={{ height: '100%', maxWidth: 'unset', flex: 1, margin: 0, border: '1px solid #e2e2e1' }}
            readonly={popupMode === 'READ' ? true : false}
            fileupload={true}
            handleFileUploaderChange={handleFileUploaderChange}
          />
        </FormRow>
        <FormRow>
          <Box style={{ paddingTop: '10px', overflow: 'auto', height: '100%', width: '100%', backgroundColor: '#e9e9e9' }}>
            {
              AttatchFiles.map((file) => {
                return <Box key={file.id} style={{ display: 'inline-flex', alignItems: 'center', padding: '0px 2px 0px 2px', marginRight: '10px', marginBottom: '5px', backgroundColor: '#e9e9e9', borderRadius: '4px' }}>
                  <NavLink to={'#'} key={`NavLink_${file.id}`} onClick={() => downloadFile(file.id)} >
                    <span key={`ListItemText_${file.id}`}>{file.name}</span>
                  </NavLink>
                  {
                    popupMode != 'READ' ? (
                      <div>
                        <IconButton key={`IconButton_${file.id}`} edge="end" aria-label="delete" onClick={() => { deleteFile(file.id) }}>
                          <DeleteIcon key={`DeleteIcon_${file.id}`} size='small' />
                        </IconButton>
                      </div>
                    ) : null
                  }
                </Box>
              }
              )
            }
          </Box>
        </FormRow>
      </VLayoutBox>
    </PopupDialog>
  );
}

PopNoticeDetail.displayName = 'PopNoticeDetail'

export default PopNoticeDetail;
