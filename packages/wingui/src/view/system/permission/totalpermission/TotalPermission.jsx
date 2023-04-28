import React, { useState, useEffect } from "react";

import {
  ContentInner, LeftButtonArea, RightButtonArea, ResultArea, ButtonArea, BaseGrid,
  CommonButton,
  useViewStore, useStyles, zAxios
} from "@zionex/wingui-core/src/common/imports";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";

const baseGridItems = [
  {
    name: "username", dataType: "text", headerText: "USER_ID", editable: false, autoFilter: true,
    styleCallback: function (grid, dataCell) {
      let res = {}
      res.styleName = 'link-column';
      return res;
    },
  },
  { name: "displayName", dataType: "text", headerText: "USER_NM", editable: false, autoFilter: true },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", editable: false, autoFilter: true },
  { name: "businessValue", dataType: "text", headerText: "BUSINESS", editable: false, autoFilter: true }
];

const deleGridItems = [
  { name: "userId", dataType: "text", headerText: "DELEGATION_USER_ID", editable: false, width: 100 },
  { name: "displayName", dataType: "text", headerText: "DELEGATION_USER_NM", editable: false, width: 100 },
  { name: "applyStartDttm", dataType: "datetime", format: "yyyy-MM-dd", headerText: "APPY_STRT_DTTM", editable: false, width: 100 },
  { name: "applyEndDttm", dataType: "datetime", format: "yyyy-MM-dd", headerText: "APPY_END_DTTM", editable: false, width: 100 }
]

const userGroupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  {
    name: "grpCd", dataType: "text", headerText: "GRP_CD", editable: false, width: 100,
    styleCallback: function (grid, dataCell) {
      let res = {}
      res.styleName = 'link-column';
      return res;
    },
  },
  { name: "grpNm", dataType: "text", headerText: "GRP_NM", editable: false, width: 100 },
];

const pmsnGridItems = [
  {
    name: "menuGrp", dataType: "text", headerText: "MENU_GROUP", editable: false, width: 100, mergeRule: { criteria: "value" }, autoFilter: true,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let menuGrp = values[fieldNames.indexOf("menuGrp")];
      return transLangKey(menuGrp)
    }
  },
  { name: "menuCd", dataType: "text", headerText: "MENU_CD", editable: false, width: 100, autoFilter: true },
  {
    name: "menuNm", dataType: "text", headerText: "MENU_NM", editable: false, width: 100, autoFilter: true,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let menuNm = values[fieldNames.indexOf("menuCd")];
      return transLangKey(menuNm)
    }
  },
  { name: "PERMISSION_TYPE_READ", dataType: "boolean", headerText: "READ", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_UPDATE", dataType: "boolean", headerText: "UPDATE", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_DELETE", dataType: "boolean", headerText: "DELETE", editable: false, width: 100 }
]

function TotalPermission() {
  const history = useHistory();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [userGrid, setUserGrid] = useState(null);
  const [userGroupGrid, setUserGroupGrid] = useState(null);
  const [delegationGrid, setDelegationGrid] = useState(null);
  const [tpGrid, setTpGrid] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const globalButtons = [
    { name: "searchAreaExpand", visible: false }
  ]
  useEffect(() => {
    if (userGrid) {
      setGridOptions()
      loadData()
    }
    if (tpGrid) {
      tpGrid.gridView.orderBy(['menuGrp'], ['ascending']);
    }
    if(userGroupGrid) {
      setGrpGridOptions()
    }
    if (userGrid && userGroupGrid && delegationGrid && tpGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)
    }
  }, [userGrid, userGroupGrid, delegationGrid, tpGrid])

  useEffect(() => {
    setUserGrid(getViewInfo(vom.active, 'userGrid'))
    setUserGroupGrid(getViewInfo(vom.active, 'userGroupGrid'))
    setDelegationGrid(getViewInfo(vom.active, 'delegationGrid'))
    setTpGrid(getViewInfo(vom.active, 'tpGrid'))
  }, [viewData])

  function loadData() {
    userGrid.gridView.commit(true);

    userGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios({
      method: 'get',
      header: { 'content-type': 'application/json' },
      url: "/system/users",
      params: {
        'username': '', 'display-name': '', 'unique-value': ''
      },
      waitOn: false
    }).then(function (res) {
      userGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
      userGrid.gridView.hideToast();
    }).then(function () {
      userGrid.gridView.hideToast();
    });
  }
  const setGridOptions = () => {
    userGrid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.column === 'username') {
        let clickedRow = grid.getJsonRows()[clickData.dataRow]
        history.push({ pathname: '/setting/userrole/userpermission', state: { username: clickedRow.username } })
      }
      let username = grid.getValue(clickData.itemIndex, "username");
      let displayName = grid.getValue(clickData.itemIndex, "displayName");
      setDisplayName("(" + displayName + ")")

      loadGroupGrid(username)
      loadDelegationGrid(username)
      loadPermission(username)
    }
  }
  const setGrpGridOptions = () => {
    userGroupGrid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.column === 'grpCd') {
        let clickedRow = grid.getJsonRows()[clickData.dataRow]
        history.push({ pathname: '/setting/userrole/grouppermission', state: { grpCd: clickedRow.grpCd, grpNm: clickedRow.grpNm } })
      }
    }
  }
  function loadGroupGrid(username) {
    userGroupGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    return zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "/system/users/" + username + "/groups",
      waitOn: false
    }).then(function (res) {
      userGroupGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      userGroupGrid.gridView.hideToast();
    });
  }
  function loadDelegationGrid(username) {
    delegationGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    return zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "/system/users/" + username + "/delegations",
      waitOn: false
    }).then(function (res) {
      delegationGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      delegationGrid.gridView.hideToast();
    });
  }
  function loadPermission(username) {
    tpGrid.dataProvider.clearRows();
    tpGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    return zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "system/user/permissions/union",
      params: {
        'username': username
      },
      waitOn: false
    }).then(function (res) {
      tpGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      tpGrid.gridView.hideToast();
    });
  }
  function handleClick() {
    userGrid.gridView.activateAllColumnFilters('username', false);
    userGrid.gridView.activateAllColumnFilters('displayName', false);
    userGrid.gridView.activateAllColumnFilters('department', false);
    userGrid.gridView.activateAllColumnFilters('businessValue', false);
    loadData()
  }
  return (
    <ContentInner>
      <ResultArea sizes={[36, 60]} direction={"vertical"}>
        <Box>
          <ResultArea sizes={[40, 30, 30]} direction={"horizontal"}>
            <Box>
              <ButtonArea title={transLangKey("USER")}>
                <LeftButtonArea />
                <RightButtonArea>
                  <CommonButton title={transLangKey("REFRESH")} style={{ padding: 0 }} onClick={handleClick}><Icon.RefreshCcw size={16} /></CommonButton>
                </RightButtonArea>
              </ButtonArea>
              <Box style={{ height: "calc(100% - 28px)" }}>
                <BaseGrid id="userGrid" items={baseGridItems} ></BaseGrid>
              </Box>
            </Box>
            <Box>
              <ButtonArea title={transLangKey("USER_GRP")}></ButtonArea>
              <Box style={{ height: "calc(100% - 28px)" }}>
                <BaseGrid id="userGroupGrid" items={userGroupGridItems} ></BaseGrid>
              </Box>
            </Box>
            <Box>
              <ButtonArea title={transLangKey("DELEGATION")}></ButtonArea>
              <Box style={{ height: "calc(100% - 28px)" }}>
                <BaseGrid id="delegationGrid" items={deleGridItems} ></BaseGrid>
              </Box>
            </Box>
          </ResultArea>
        </Box>
        <Box>
          <ButtonArea title={transLangKey("TOTAL_PERMISSION") + displayName}></ButtonArea>
          <BaseGrid id="tpGrid" items={pmsnGridItems}></BaseGrid>
        </Box>
      </ResultArea>
    </ContentInner>
  )
}

export default TotalPermission