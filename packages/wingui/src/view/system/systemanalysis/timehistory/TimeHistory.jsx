import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from '@mui/material';
import {
  ContentInner, SearchArea, ResultArea, SearchRow, InputField, BaseGrid, GridCnt,
  StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, useViewStore, zAxios
} from "@zionex/wingui-core/src/common/imports";

let thGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "username", dataType: "text", headerText: "USER_ID", visible: true, editable: false, width: 100 },
  { name: "userIp", dataType: "text", headerText: "USER_IP", visible: true, editable: false, width: 100 },
  { name: "userBrowser", dataType: "text", headerText: "USER_BROWSER", visible: true, editable: false, width: 100 },
  { name: "viewCd", dataType: "text", headerText: "MENU_CD", visible: true, editable: false, width: 100 },
  { name: "viewNm", dataType: "text", headerText: "MENU_NM", visible: true, editable: false, width: 100 },
  { name: "executionDttm", dataType: "datetime", headerText: "EXECUTION_DTTM", visible: true, editable: false, width: 80, format: "yyyy-MM-dd HH:mm:ss" },
  { name: "modifyDttm", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 80, format: "yyyy-MM-dd HH:mm:ss" },
  { name: "runningTime", dataType: "number", headerText: "RUNNING_TIME", visible: true, editable: false, width: 80, format: "#,###.0" },
]

function timehistory() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [thGrid, setThGrid] = useState(null);
  const [message, setMessage] = useState();
  const [thGridCount, setThGridCount] = useState();

  const { control, getValues, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      username: "",
      dateRage: [(new Date().format("yyyy-MM-dd")), (new Date().format("yyyy-MM-dd"))],
    }
  });
  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false }
  ]
  useEffect(() => {
    if (thGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)
      setOptions()
    }
  }, [thGrid])
  useEffect(() => {
    setThGrid(getViewInfo(vom.active, 'thGrid'))
  }, [viewData])
  const onSubmit = () => {
    loadData();
  };

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function exportExcel() {
    let options = {
      headerDepth: 1,
      footer: "default",
      allColumns: true,
      lookupDisplay: true,
      separateRows: false
    }

    exportGridtoExcel(thGrid.gridView, options);
  }

  function setOptions() {
    thGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    thGrid.gridView.displayOptions.fitStyle = "fill";
  }

  function loadData() {
    thGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let dateRange = getValues("dateRage");
    let fromdate = dateRange ? new Date(dateRange[0]).format('yyyyMMdd') : new Date('1970', '00', '01').format('yyyyMMdd');
    let todate = dateRange ? new Date(dateRange[1]).format('yyyyMMdd') : new Date().format('yyyyMMdd');

    zAxios.get(baseURI() + 'system/logs/view-execution', {
      params: {
        'start-date': fromdate,
        'end-date': todate,
        'menu-cd': getValues("menuCd"),
        'menu-nm': getValues("menuName"),
        'username': getValues("username")
      }
    }).then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        thGrid.dataProvider.fillJsonData(res.data);
      } else if (res.status === gHttpStatus.NO_CONTENT) {
        thGrid.dataProvider.clearRows();
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      thGrid.gridView.hideToast();
    });
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField type="dateRange" name={"dateRage"} label={"DATE_RANGE"} control={control} dateformat="yyyy-MM-dd"
            rules={{
              required: '기간은 필수값입니다.'
            }}
          />
          <InputField name="menuCd" label={transLangKey("MENU_CD")} readonly={false} disabled={false} control={control}
            rules={{
            }}
          />
          <InputField name="menuName" label={transLangKey("MENU_NM")} readonly={false} disabled={false} control={control}
            rules={{
            }}
          />
          <InputField name="username" label={transLangKey("USER_NAME")} readonly={false} disabled={false} control={control}
            rules={{
            }}
          />
        </SearchRow>
      </SearchArea>
      <ButtonArea gridCount={thGridCount}>
        <LeftButtonArea></LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup variant="contained" color="primary">
          </ButtonGroup>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="thGrid" items={thGridItems}></BaseGrid>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="thGrid" format={'{0} 건 조회되었습니다.'}></GridCnt>
      </StatusArea>
    </ContentInner>
  )
}

export default timehistory