import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { ButtonArea, RightButtonArea, InputField, GridAddRowButton, GridDeleteRowButton, BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItemLoc from '../common/PopCommItemLoc';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

const wrapStyle = {width: "300px"};
const labelStyle = {width: "200px", maxWidth: "200px"};

let grid4Items=[
 { name: "GLOBAL_PLAN_BOM_ID", dataType: "text", headerText: "GLOBAL_PLAN_BOM_ID", visible: false, editable: false, width: "150" },
 { name: "CONSUME_LOCAT_ITEM_ID", dataType: "text", headerText: "CONSUME_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
 { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "150" },
 { name: "SUPPLY_LOCAT_ITEM_ID", dataType: "text", headerText: "SUPPLY_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
 { name: "SRCING_POLICY_ID", dataType: "text", headerText: "SRCING_POLICY", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
 { name: "SRCING_RULE", dataType: "number", headerText: "SRCING_RULE", visible: true, editable: true, width: "80", numberFormat: '#,###' },
 { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
 { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60" },
 { name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: true, width: "80" },
 { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: true, width: "80" },
 { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: true, width: "80", button:"action" },
 { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: true, width: "120" }
]

function PopPlanningBomGrid1New(props) {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: { }
  });

  const [grid4, setgrid4]  = useState(null);
  const [locDtlId, setLocDtlId] = useState('');
  const [locatMgmtId, setLocatMgmtId] = useState('');
  const [itemMstId, setItemMstId] = useState('');
  const [popupData, setPopupData] = useState({});
  const [consumeLocatTpPopupOpen, setPopupConsumeLocatTp] = useState(false);
  const [itemLocPopupOpen, setPopupItemLoc] = useState(false);
  const [supplyLocatTpPopupOpen, setPopupSupplyLocatTp] = useState(false);
  const [tabValue, setTabValue] = React.useState('tab1');

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'grid4');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid4 != grdObj1)
          setgrid4(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid4) {
      setOptionsGrid();
      setGridComboList(grid4,
        'SRCING_POLICY_ID',
        'SOURCING_RULE'
        );
    }
  }, [grid4]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 'tab3') {
      loadDataGrid();
    }
  };

  // popup Open - LOCAT_TP
  function openPopup1() {
    setPopupConsumeLocatTp(true);
  }

  // popup close - LOCAT_TP
  function onSetConsumeLocatTp(gridRow) {
    setLocDtlId(gridRow.LOCAT_ID);
    setLocatMgmtId(gridRow.LOCAT_MGMT_ID);
    setValue('consumeLocatDtlId', gridRow.LOCAT_ID);
    setValue('consumeLocatTp', gridRow.LOCAT_TP_NM);
    setValue('consumeLocatLv', gridRow.LOCAT_LV);
    setValue('consumeLocatCd', gridRow.LOCAT_CD);
    setValue('consumeLocatNm', gridRow.LOCAT_NM);
  }

  // popup Open - ItemCd
  function openPopup2() {
    setPopupData({'CONSUME_LOCAT_MGMT_ID':locatMgmtId, 'SUPPLY_LOCAT_MGMT_ID':''});
    setPopupItemLoc(true);
  }

  // popup close - ItemCd
  function onSetItemCd(gridRows) {
    let itemMstIdArr = [];
    let itemCdArr = [];
    let itemNmArr = [];
    let itemTpNmArr = [];
    let itemUomNmArr = [];

    gridRows.forEach(function (row) {
      itemMstIdArr.push(row.ITEM_ID);
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
      itemTpNmArr.push(row.ITEM_TP);
      itemUomNmArr.push(row.UOM_NM);
    });

    setItemMstId(itemMstIdArr.join("|"));
    setValue('itemCd', itemCdArr.join("|"));
    setValue('itemNm', itemNmArr.join("|"));
    setValue('itemTp', itemTpNmArr.join("|"));
    setValue('itemUomNm', itemUomNmArr.join("|"));
  }

  // popup close - GIRD LOCAT_TP
  function onSetGridLocatTp(gridRow) {
    grid4.gridView.commit(true);
    let itemIndex = grid4.gridView.getCurrent().dataRow;

    grid4.dataProvider.setValue(itemIndex, 'LOCAT_TP', gridRow.LOCAT_TP_NM);
    grid4.dataProvider.setValue(itemIndex, 'LOCAT_LV', gridRow.LOCAT_LV);
    grid4.dataProvider.setValue(itemIndex, 'LOCAT_CD', gridRow.LOCAT_CD);
    grid4.dataProvider.setValue(itemIndex, 'LOCAT_NM', gridRow.LOCAT_NM);
    grid4.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_ITEM_ID', gridRow.LOCAT_MST_ID);
  }

  const setOptionsGrid = () => {
    setVisibleProps(grid4, true, true, true);
    // grid4.gridView.setHeader({height: 50 });
    grid4.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    //click
    grid4.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === "LOCAT_CD") {
        setPopupSupplyLocatTp(true);
      }
    }
  }

  function loadDataGrid() {
    let dataArr;
    let tabUrl;
    let param = new URLSearchParams();
    param.append('BOD_TP', '');
    param.append('LOC_DTL_ID', locDtlId);
    param.append('ITEM_MST_ID', itemMstId);
    param.append('timeout', 0);
    param.append('PREV_OPERATION_CALL_ID', 'OPC_UI_CM_11_RST_CPT_01_CELL_DOUBLE_CLICK_01');
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_07_WINDOW_01_SETDATA_MODIFY_POPUP_24');

    tabUrl = baseURI() + 'engine/mp/SRV_UI_CM_11_POP_Q1';

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          grid4.dataProvider.fillJsonData(dataArr);

          if (grid4.dataProvider.getRowCount() == 0) {
            grid4.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function onError(errors) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    grid4.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          grid4.dataProvider.getAllStateRows().created,
          grid4.dataProvider.getAllStateRows().updated,
          grid4.dataProvider.getAllStateRows().deleted,
          grid4.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(grid4.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          if (answer) {
            let formData = new FormData();
            formData.append('BOD_TP_ID', '');
            formData.append('LOC_DTL_ID', locDtlId);
            formData.append('ITEM_MST_ID', itemMstId);
            formData.append('USER_ID', username);
            formData.append('timeout', 0);
            formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_01_WINDOW_01_CPT_99_01_CLICK_01');

            zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_11_POP_S1', formData)
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  const rsData = res.data;
                  if (rsData.RESULT_SUCCESS) {
                    const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_11_POP_S1_P_RT_MSG;
                    if (msg === "MSG_0001") {
                      props.confirm();
                      props.onClose(false);
                    } else {
                      showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
                    }
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('BOD_TP_ID', '');
            formData.append('LOC_DTL_ID', locDtlId);
            formData.append('ITEM_MST_ID', itemMstId);
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);
            formData.append('timeout', 0);
            formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_01_WINDOW_01_CPT_99_01_CLICK_01');

            zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_11_POP_S1', formData)
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  const rsData = res.data;
                  if (rsData.RESULT_SUCCESS) {
                    const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_11_POP_S1_P_RT_MSG;
                    if (msg === "MSG_0001") {
                      props.confirm();
                      props.onClose(false);
                    } else {
                      showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
                    }
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  const deleteRow = (targetGrid) => {
    targetGrid.gridView.commit(true);

    let deleteRows = [];
    let createdDeleteRowIndex = [];
    targetGrid.gridView.getCheckedRows().forEach(function(indx) {
      if (!targetGrid.dataProvider.getAllStateRows().created.includes(indx)) {
        deleteRows.push(targetGrid.dataProvider.getJsonRow(indx));
      } else {
        createdDeleteRowIndex.push(indx);
      }
    });

    if (!deleteRows.length) {
      if (!createdDeleteRowIndex.length) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'));
      } else {
        showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
          if (answer) {
            targetGrid.dataProvider.removeRows(createdDeleteRowIndex);
          }
        });
      }
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          targetGrid.gridView.showToast(progressSpinner + 'Deleting data...',true);

          let formData = new FormData();
          formData.append('CHANGES', JSON.stringify(deleteRows));
          formData.append('timeout', 0);
          formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_01_WINDOW_01_CPT_24_05_CLICK_01');

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_11_POP_S3', formData)
          .then(function (response) {
            if (response.status === gHttpStatus.SUCCESS) {
              targetGrid.dataProvider.removeRows(targetGrid.gridView.getCheckedRows());
            }
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            targetGrid.gridView.hideToast();
          });
        }
      });
    }
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_11_01" resizeHeight={500} resizeWidth={400}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey('CONSUME_LOCAT')} value="tab1" />
          <Tab label={transLangKey('ITEM')} value="tab2" />
          <Tab label={transLangKey('SUPPLY_LOCAT')} value="tab3" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <InputField type="action" name="consumeLocatTp" label={transLangKey("CONSUME_LOCAT_NM")} onClick={() => { openPopup1() }} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle}>
              <Icon.Search />
            </InputField>
            <InputField name="consumeLocatLv" label={transLangKey("CONSUME_LOCAT_LV")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="consumeLocatCd" label={transLangKey("CONSUME_LOCAT_CD")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="consumeLocatNm" label={transLangKey("CONSUME_LOCAT_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => { openPopup2() }} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="itemUomNm" label={transLangKey("ITEM_UOM_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab3" ? "block" : "none" }}>
          <ButtonArea>
            <RightButtonArea>
              <GridAddRowButton grid="grid4"></GridAddRowButton>
              <GridDeleteRowButton grid="grid4" onClick={() => { deleteRow(grid4) }}></GridDeleteRowButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid4" items={grid4Items}></BaseGrid>
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    {consumeLocatTpPopupOpen && (<PopLocatTp open={consumeLocatTpPopupOpen} onClose={() => { setPopupConsumeLocatTp(false); }} confirm={onSetConsumeLocatTp}></PopLocatTp>)}
    {itemLocPopupOpen && (<PopCommItemLoc open={itemLocPopupOpen} onClose={() => { setPopupItemLoc(false); }} confirm={onSetItemCd} data={popupData}></PopCommItemLoc>)}
    {supplyLocatTpPopupOpen && (<PopLocatTp open={supplyLocatTpPopupOpen} onClose={() => { setPopupSupplyLocatTp(false); }} confirm={onSetGridLocatTp}></PopLocatTp>)}
    </>
  );
}
export default PopPlanningBomGrid1New;
