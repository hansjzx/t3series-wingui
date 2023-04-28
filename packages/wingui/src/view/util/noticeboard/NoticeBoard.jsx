import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, SearchArea, SearchRow, StatusArea, ButtonArea, RightButtonArea,
  InputField, GridAddRowButton, GridDeleteRowButton, BaseGrid, zAxios, useUserStore, useViewStore, Pagination, ResultArea, CommonButton
} from '@zionex/wingui-core/src/common/imports';

import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";
import PopNoticeDetail from "./PopNoticeDetail";
import PopNoticeSetting from "./PopNoticeSetting";

import './noticeboard.css'

function NoticeBoard() {
  const [username, systemAdmin] = useUserStore((state) => [state.username, state.systemAdmin]);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);

  const [diabledPagination, setDisabledPagination] = useState(true);
  const [noticeGridItems, setNoticeGridItems] = useState([
    { name: "id", dataType: "text", headerText: "id", visible: false, editable: false, width: "50", textAlignment: "near" },
    {
      name: "title", dataType: "text", headerText: "NB_POST_TITLE", visible: true, editable: false, width: "500", textAlignment: "near",
      displayCallback: function (grid, index, value) {
        let retVal = value;
        if (grid.getValue(index.itemIndex, "noticeYn")) {
          retVal = "[공지] " + retVal
        }
        return retVal;
      },
      styleCallback: function (grid, dataCell) {
        let ret = {};
        let noticeYn = grid.getValue(dataCell.index.itemIndex, "noticeYn");
        if (noticeYn) {
          ret.styleName = "text-font-bold column-textAlignt-near";
        }
        return ret;
      },
    },
    { name: "content", dataType: "text", headerText: "content", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "noticeYn", dataType: "boolean", headerText: "NB_NOTOCE_YN", visible: false, editable: false, width: "50", textAlignment: "center" },
    { name: "createByDisplayName", dataType: "text", headerText: "WRITER", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "createBy", dataType: "text", headerText: "createBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "createDttm", dataType: "datetime", headerText: "NB_POST_DATE", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "modifyBy", dataType: "text", headerText: "modifyBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "modifyDttm", dataType: "datetime", headerText: "modifyDttm", visible: false, editable: false, width: "100", textAlignment: "center" },
    {
      name: "deleteYn", dataType: "boolean", headerText: "NB_DELETE_YN", visible: true, editable: false, width: "50", textAlignment: "center",
      styleCallback: function (grid, dataCell) {
        let ret = {};
        let createBy = grid.getValue(dataCell.index.itemIndex, 'createBy')
        if (systemAdmin || username === createBy) {
          ret.editable = true;
          ret.renderer = { editable: true };
          ret.styleName = 'editable-column';
        } else {
          ret.styleName = 'text-center';
        }
        return ret;
      }
    },
    { name: "deleteBy", dataType: "text", headerText: "deleteBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "deleteDttm", dataType: "datetime", headerText: "deleteDttm", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "files", dataType: "text", headerText: "files", visible: false, editable: false, width: "50", textAlignment: "center" },
  ]);

  const { handleSubmit, reset, control, setValue, getValues, watch, register, clearErrors } = useForm({
    defaultValues: {
      option: '1',
      search: ''
    }
  });

  const searchOptions = [
    { label: transLangKey('NB_POST_TITLE'), value: '1' },
    { label: transLangKey('NB_POST_CONTENT'), value: '2' },
    { label: transLangKey('NB_POST_TITLE') + ' + ' + transLangKey('NB_POST_CONTENT'), value: '3' }
  ]

  const [noticeGrid, setNoticeGrid] = useState(null);
  const [settings, setSettings] = useState({
    currentPage: 0, // 현재 페이지
    totalPages: 1, // 전체 페이지
    perPageSize: 15, // 페이지 수 기본 값 설정
  })
  const [currentNotice, setCurrentNotice] = useState(null)
  const [openDetailPop, setOpenDetailPop] = useState(false);
  const [openSettingPop, setOpenSettingPop] = useState(false);
  const [popupMode, setPopupMode] = useState('READ')

  const globalButtons = [
    {
      name: "search",
      action: (e) => { loadPage(1) },
      visible: true,
      disable: false
    }
  ]

  useEffect(() => {
    if (noticeGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)
    }
  }, [noticeGrid])

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setNoticeGrid(gridObj);

    gridObj.gridView.onCellDblClicked = (grid, clickData) => {
      if (clickData.cellType != "check" && clickData.column != "head" && clickData.cellType == "data" && clickData.column == 'title') {
        const dataPropvider = grid.getDataSource();
        const data = dataPropvider.getJsonRow(clickData.dataRow)
        if (data != null) {
          setCurrentNotice(data)
          setPopupMode('READ');
          setOpenDetailPop(true);
        }
      }
    }
  };

  const loadPage = (page) => {
    zAxios.get(baseURI() + 'noticeboard', {
      params: {
        'SEARCH': getValues('search'),
        'OPTION': getValues('option'),
        'PAGE': page - 1,
        'SIZE': settings.perPageSize
      }
    }).then(function (response) {
      let newSetting = { ...settings }
      if (response.status === gHttpStatus.SUCCESS) {
        if (response.data.pageContent.totalPages == 0) {
          setDisabledPagination(true)
        } else {
          setDisabledPagination(false)
        }
        newSetting.currentPage = response.data.pageContent.number + 1;
        newSetting.totalPages = response.data.pageContent.totalPages

        newSetting.mTotal = response.data.pageContent.totalElements;
        newSetting.localDataSource = response.data.certainList.concat(response.data.pageContent.content);
        setSettings(newSetting)
        noticeGrid.dataProvider.fillJsonData(newSetting.localDataSource)
      }
    })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (response) { });
  }

  const deleteBoard = () => {
    noticeGrid.gridView.commit();
    let deleteRows = noticeGrid.gridView.getJsonRows().filter(r => r.deleteYn == true)
    if (deleteRows.length == 0) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_SELECT_DELETE'), { close: false })
      return;
    }
    deleteRows.map(r => {
      r.deleteBy = username;
      r.deleteYn = 'Y'
      r.noticeYn = r.noticeYn ? 'Y' : 'N'
    })

    let formData = new FormData();
    formData.append('changes', JSON.stringify(deleteRows));

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'noticeboard/delete',
      data: formData
    }).catch(function (error) {
      console.log(err);
    }).then(function () {
      loadPage(1);
    });
  }

  const newNotice = () => {
    setCurrentNotice({
      id: '',
      title: '새 글'
    })
    setPopupMode('NEW');
    setOpenDetailPop(true);
  }

  const confirmDetailPop = (notice, uploadedFiles, mode) => {
    saveFiles(notice, uploadedFiles, mode);
  }

  const saveData = (notice, mode) => {
    if (mode === 'MODIFY') {
      const updateData = {
        id: notice.id,
        title: notice.title,
        content: notice.content,
        createDttm: notice.createDttm,
        createBy: notice.createBy,
        modifyBy: username,
        deleteYn: 'N',
        noticeYn: notice.noticeYn ? 'Y' : 'N',
        files: notice.files
      };

      let formData = new FormData();
      formData.append('changes', JSON.stringify(updateData));

      zAxios.post(baseURI() + 'noticeboard', formData).then(function (response) {
      }).catch(function (response) {
        console.log('err', response)
      }).then(function () {
        loadPage(1);
      });
    } else {
      const createData = {
        title: notice.title,
        content: notice.content,
        createBy: username,
        deleteYn: 'N',
        noticeYn: notice.noticeYn,
        files: notice.files
      };

      let formData = new FormData();
      formData.append('changes', JSON.stringify(createData));

      zAxios.post(baseURI() + 'noticeboard', formData).then(function (response) {
      }).catch(function (response) {
        console.log('err', response)
      }).then(function () {
        loadPage(1);
      });
    }
  }

  const saveFiles = (notice, files, mode) => {
    let formData = new FormData();

    let fileSizeCheck = false;
    let fileExistCheck = false;
    files.map(function (file) {
      if (file !== undefined) {
        fileExistCheck = true;
        formData.append('FILES', file);
        if (file.size === 0 || file.size > 128000000) fileSizeCheck = true
      }
    });

    if (fileSizeCheck) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_WARNING_FILESIZE'), { close: false })
    } else {
      formData.append('CATEGORY', 'noticeboard');
      formData.append('USER_ID', username);
      if (fileExistCheck) {
        zAxios.post('file-storage/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            if (response.data) {
              let data = response.data;
              if (data.success === true) {
                data.data.forEach(function (element) {
                  notice.files.push(element.id);
                });

                saveData(notice, mode);
              } else if (data.success === false) {
                console.error(data.message);
                showMessage('Error', "파일 업로드를 실패했습니다.", { close: false });
              }
            }
            else {
              console.log('응답 데이타가 없습니다.')
            }
          } else {
            console.log('응답 상태', response.status)
          }
        }).catch(function (error) {
          console.log(error);
        }).then(function () { });
      } else {
        saveData(notice, mode);
      }
    }
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name='option' label={transLangKey("OPTION")} type='select' width={'200px'} control={control} options={searchOptions} ></InputField>
          <InputField name='search' label={transLangKey("CONTENT")} width={'300px'} control={control}></InputField>
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid='noticeGrid' onClick={newNotice}></GridAddRowButton>
          <GridDeleteRowButton grid='noticeGrid' onClick={deleteBoard}></GridDeleteRowButton>
          {systemAdmin ? <CommonButton title={transLangKey('NOTICEBOARD_OPTION_SET')} onClick={() => { setOpenSettingPop(true) }} ><Icon.Settings /></CommonButton> : null}
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="noticeGrid" items={noticeGridItems} afterGridCreate={afterGridCreate} className="noticeboard" ></BaseGrid>
      </ResultArea>
      <Pagination diabled={diabledPagination} settings={settings} onClick={loadPage} />
      <StatusArea></StatusArea>
      {openDetailPop ? <PopNoticeDetail open={openDetailPop} notice={currentNotice} confirm={confirmDetailPop} popupMode={popupMode} onClose={() => setOpenDetailPop(false)} ></PopNoticeDetail> : null}
      {openSettingPop ? <PopNoticeSetting open={openSettingPop} onClose={() => setOpenSettingPop(false)} ></PopNoticeSetting> : null}
    </ContentInner>
  )
}

export default NoticeBoard;