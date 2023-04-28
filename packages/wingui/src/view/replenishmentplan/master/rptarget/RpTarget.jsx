import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridExcelExportButton, GridSaveButton, LeftButtonArea, ResultArea,
  RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import { setGridComboList  } from "@wingui/view/supplychainmodel/common/common";

let gridRpTargetColumns = [
  { name: "ID", headerText: "ID", dataType: "text", visible: false },
  { name: "LOCAT_TP_NM", headerText: "LOCAT_TP_NM", dataType: "text", width: "80", visible: true, editable: false },
  { name: "LOCAT_LV", headerText: "LOCAT_LV", dataType: "text", width: "80", visible: true, editable: false },
  { name: "LOCAT_CD", headerText: "LOCAT_CD", dataType: "text", width: "100", visible: true, editable: false },
  { name: "LOCAT_NM", headerText: "LOCAT_NM", dataType: "text", width: "160", visible: true, editable: false },
  { name: "ITEM_CD", headerText: "ITEM_CD", dataType: "text", width: "100", visible: true, editable: false },
  { name: "ITEM_NM", headerText: "ITEM_NM", dataType: "text", width: "140", visible: true, editable: false },
  { name: "ITEM_TP_ID", headerText: "ITEM_TP", dataType: "text", width: "100", visible: true, editable: false, useDropdown: true, lookupDisplay: true },
  { name: "GRADE", headerText: "GRADE", dataType: "text", width: "80", visible: true, editable: false },
  { name: "ACT_SHIP_YN", headerText: "ACT_SHIP_YN", dataType: "boolean", width: "100", visible: true, editable: false },
  { name: "REPLSH_YN", headerText: "REPLSH_YN", dataType: "boolean", width: "80", visible: true, editable: true, headerCheckable: true },
  { name: "MODIFY_BY", headerText: "MODIFY_BY", dataType: "text", width: "80", visible: true, editable: false },
  { name: "MODIFY_DTTM", headerText: "MODIFY_DTTM", dataType: "datetime", width: "120", visible: true, editable: false }
];

function RpTarget() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);
  const [gridRpTarget, setGridRpTarget] = useState(null);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData])

  const globalButtons = [
    { name: 'search', action: (e) => { loadRpTarget() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  }

  useEffect(() => {
    if (gridRpTarget) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      loadRpTarget();
    }
  }, [gridRpTarget]);

  function afterGridRpTarget(gridObj) {
    setGridRpTarget(gridObj);
    setGridRpTargetOptions(gridObj);
  }

  const refresh = () => {
    currentLocationRef.reset();
    currentItemRef.reset();

    gridRpTarget.dataProvider.clearRows();
  }

  function setGridRpTargetOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.displayOptions.fitStyle = 'even';

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    setGridComboList(gridObj, "ITEM_TP_ID", "ITEM_TYPE");
  }

  function loadRpTarget() {
    gridRpTarget.gridView.commit(true);

    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_04_Q1',
      params: param
    })
    .then(function (res) {
      gridRpTarget.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }


  function saveRpTarget() {
    gridRpTarget.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridRpTarget.dataProvider.getAllStateRows().created,
          gridRpTarget.dataProvider.getAllStateRows().updated,
          gridRpTarget.dataProvider.getAllStateRows().deleted,
          gridRpTarget.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridRpTarget.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('CHANGES', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_04_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_04_S1_P_RT_MSG), { close: false });
              loadRpTarget();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  function updateBatch() {
    gridRpTarget.gridView.commit(true);

    showMessage(transLangKey('BATCH_UPDATE'), transLangKey('MSG_5136'), function (answer) {
      if (answer) {
        let param = new URLSearchParams();

        formData.append('TYPE', "ALL");
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          header: { 'content-type': 'application/json' },
          url: baseURI() + 'engine/mp/SRV_UI_IM_04_S1',
          params: param
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_04_S1_P_RT_MSG), { close: false });
            loadRpTarget();
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridRpTarget' options={exportExcelOptions} />
                <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={() => { updateBatch() }}><Icon.Database/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={saveRpTarget} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: '100%' }}>
              <BaseGrid id='gridRpTarget' items={gridRpTargetColumns} afterGridCreate={afterGridRpTarget} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default RpTarget;
