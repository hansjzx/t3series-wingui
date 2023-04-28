import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContentInner, SearchArea, ResultArea, SearchRow, InputField, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import Pagination from "@zionex/wingui-core/src/component/Pagination";

let historyGridItems = [
  { name: "username", dataType: "text", headerText: "USER_ID", visible: false, editable: false },
  { name: "displayName", dataType: "text", headerText: "USER_NM", visible: true, editable: false },
  { name: "accessIp", dataType: "text", headerText: "USER_IP", visible: true, editable: false },
  { name: "accessDttm", dataType: "datetime", headerText: "LOGIN_DTTM", visible: true, editable: false },
  { name: "logoutDttm", dataType: "datetime", headerText: "LOGOUT_DTTM", visible: true, editable: false }
];

function LoginHistory() {
  const [diabledPagination, setDisabledPagination] = useState(true);
  const [historyGrid, setHistoryGrid] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      displayName: '',
      accessDttmFrom: (new Date()).format('yyyy-MM-dd 00:00:00'),
      accessDttmTo: (new Date()).format('yyyy-MM-dd HH:mm:ss')
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => { loadData(1) },
      visible: true,
      disable: false
    }
  ]
  const [settings, setSettings] = useState({
    currentPage: 0,
    totalPages: 1,
    perPageSize: 100
  });
  useEffect(() => {
    setHistoryGrid(getViewInfo(vom.active, 'historyGrid'))
  }, [viewData])
  useEffect(() => {
    if (historyGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)
    }
  }, [historyGrid])

  function loadData(page) {
    historyGrid.gridView.showToast(progressSpinner + 'Load Data...', true);
    zAxios.get(baseURI() + 'system/logs/system-access', {
      params: {
        'display-name': getValues('displayName'),
        'accessdttm-from': (new Date(getValues('accessDttmFrom'))).format('yyyy-MM-ddTHH:mm:ss'),
        'accessdttm-to': (new Date(getValues('accessDttmTo'))).format('yyyy-MM-ddTHH:mm:ss'),
        'page': page - 1,
        'size': settings.perPageSize
      },
      waitOn: false
    }).then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setDisabledPagination(false)
        historyGrid.dataProvider.fillJsonData(res.data.content);
        setSettings({
          currentPage: parseInt(res.data.number) + 1,
          totalPages: parseInt(res.data.totalPages),
          perPageSize: parseInt(res.data.size)
        });
      } else if (res.status === gHttpStatus.NO_CONTENT) {
        setDisabledPagination(true)
        historyGrid.dataProvider.clearRows();
        setSettings({
          currentPage: 0,
          totalPages: 0,
          perPageSize: settings.perPageSize
        });
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      historyGrid.gridView.hideToast();
    })
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("USER_NM")} name="displayName"></InputField>
          <InputField control={control} type="datetime" name="accessDttmFrom" label={transLangKey("LOGIN_DTTM")} dateformat="yyyy-MM-dd HH:mm:ss"></InputField>
          <InputField control={control} type="datetime" name="accessDttmTo" label={transLangKey("LOGOUT_DTTM")} dateformat="yyyy-MM-dd HH:mm:ss" />
        </SearchRow>
      </SearchArea>
      <ResultArea sizes={[100]} direction={"vertical"}>
        <BaseGrid id="historyGrid" items={historyGridItems}></BaseGrid>
      </ResultArea>
      <Pagination diabled={diabledPagination} onClick={loadData} settings={settings} />
    </ContentInner>
  );
}

export default LoginHistory