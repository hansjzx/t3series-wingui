import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridSaveButton, InputField, ResultArea, RightButtonArea, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopPlanScenario from './PopPlanScenario';
import PopPlanScenarioStep from './PopPlanScenarioStep';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let masterGridItems = [
  { name: 'MST_ID', dataType: 'text', headerText: 'MST_ID', visible: false, editable: false, width: 50 },
  { name: 'MODULE_ID', dataType: 'text', headerText: 'MODULE_ID', visible: false, editable: false, width: 50 },
  { name: 'MODULE_NM', dataType: 'text', headerText: 'MODULE_VAL', visible: true, editable: false, width: 100 },
  { name: 'SNRIO_VER_ID', dataType: 'text', headerText: 'SCENARIO_VER', visible: true, editable: false, width: 100 },
  { name: 'DMND_MODULE_ID', dataType: 'text', headerText: 'DMND_MODULE_ID', visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
  { name: 'DESCRIP', dataType: 'text', headerText: 'SCENARIO_DESCRIP', visible: true, editable: true, width: 150 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 50 },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 120, format: 'yyyy-MM-dd hh:mm:ss' },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 50 },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 120, format: 'yyyy-MM-dd hh:mm:ss' }
]

let detailGridItems = [
  { name: 'MST_ID', dataType: 'text', headerText: 'MST_ID', visible: false, editable: false, width: 50 },
  { name: 'DTL_ID', dataType: 'text', headerText: 'DTL_ID', visible: false, editable: false, width: 50 },
  { name: 'STEP', dataType: 'number', headerText: 'STEP', visible: true, editable: false, width: 50, button: 'action', buttonVisibility: 'always' },
  { name: 'PROCESS_DESCRIP', dataType: 'text', headerText: 'PROCESS_DESCRIP', visible: true, editable: false, width: 200 },
  { name: 'PROCESS_TP_ID', dataType: 'text', headerText: 'PROCESS_TP_ID', visible: false, editable: false, width: 50 },
  { name: 'PROCESS_TP_NM', dataType: 'text', headerText: 'PROCESS_TP', visible: true, editable: false, width: 100 },
  { name: 'CONFRM_MTD_ID', dataType: 'text', headerText: 'CONFRM_MTD_ID', visible: false, editable: false, width: 50 },
  { name: 'CONFRM_MTD_NM', dataType: 'text', headerText: 'CONFRM_METHD', visible: true, editable: false, width: 100 },
  { name: 'LOWR_DMND_CREATE_YN', dataType: 'boolean', headerText: 'SUB_DMND_GENERATE_YN', visible: true, editable: false, width: 120 },
  { name: 'UI_ID', dataType: 'text', headerText: 'UI_ID', visible: false, editable: false, width: 50 },
  { name: 'UI_ID_01', dataType: 'text', headerText: 'UI_ID_01', visible: false, editable: false, width: 50 },
  { name: 'UI_ID_02', dataType: 'text', headerText: 'UI_ID_02', visible: false, editable: false, width: 50 },
  { name: 'UI_ID_03', dataType: 'text', headerText: 'UI_ID_03', visible: false, editable: false, width: 50 },
  { name: 'UI_ID_04', dataType: 'text', headerText: 'UI_ID_04', visible: false, editable: false, width: 50 },
  { name: 'UI_ID_05', dataType: 'text', headerText: 'UI_ID_05', visible: false, editable: false, width: 50 },
  { name: 'PROC_NM', dataType: 'text', headerText: 'PROCEDURE', visible: true, editable: false, width: 100 },
  { name: 'CONFRM_PLAN_SNRIO_MGMT_DTL_ID', dataType: 'text', headerText: 'CONFRM_PLAN_SNRIO_MGMT_DTL_ID', visible: false, editable: false, width: 50 },
  {
    name: "CONFRM_SUBJECT_PLAN", dataType: "group", orientation: "horizontal", headerText: "CONFRM_SUBJECT_PLAN",
    childs: [
      { name: 'CONFRM_PLAN_SNRIO_STEP', dataType: 'text', headerText: 'STEP', visible: true, editable: false, width: 50 },
      { name: 'CONFRM_PLAN_SNRIO_PROCESS', dataType: 'text', headerText: 'PROCESS', visible: true, editable: false, width: 120 }
    ]
  },
  { name: 'PLAN_POLICY_MGMT_ID', dataType: 'text', headerText: 'PLAN_POLICY_MGMT_ID', visible: false, editable: false, width: 50 },
  { name: 'PLAN_POLICY_MGMT_VER', dataType: 'text', headerText: 'PLAN_POLICY_VERSION', visible: true, editable: false, width: 120 },
  { name: 'PLAN_POLICY_MGMT_DESC', dataType: 'text', headerText: 'PLAN_POLICY_DESCRIP', visible: true, editable: false, width: 200 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: 50 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" }
    ]
  }
]

function PlanScenario(props) {
  const [masterGrid, setMasterGrid] = useState(null);
  const [detailGrid, setDetailGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [planScenarioPopupOpen, setPlanScenarioPopupOpen] = useState(false);
  const [planScenarioStepPopupOpen, setPlanScenarioStepPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [detailData, setDetailData] = useState();
  const module = props.module ? props.module : '';
  const [moduleOptions, setModuleOptions] = useState([]);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleId: ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      await setMasterGridOptions(masterGrid);
      await setSelectOptions();
    }

    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadMasterData(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false },
    ]);

    if (masterGrid && detailGrid) {
      initLoad();
    }
  }, [masterGrid, detailGrid]);

  function afterMasterGridCreate(gridObj, gridView, dataProvider) {
    setMasterGrid(gridObj);
    setMasterGridOptions(gridObj);
    setGridComboList(gridObj,
      'DMND_MODULE_ID',
      'DEMAND_MODULE_TP'
      );
  };

  function afterDetailGridCreate(gridObj, gridView, dataProvider) {
    setDetailGrid(gridObj);
    setDetailGridOptions(gridObj);
  };

  function setMasterGridOptions(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, true, true);

    grid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.itemIndex !== undefined) {
        setPopupData(grid.getValues(clickData.itemIndex));
        loadDetailData(grid.getValue(clickData.itemIndex, 'MST_ID'));
      }
    };
  }

  function setSelectOptions() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'BASE_LOV');
    params.append('VAL_01', '');
    params.append('VAL_02', '');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA.filter(code => code.GRP_CD == 'MODULE_TP');
        let rstArr = [];

        if (module !== '') {
          dataArr = dataArr.filter(code => code.COMN_CD == module);
        }

        for (let i = 0, len = dataArr.length; i < len; i++) {
          let row = dataArr[i];
          if (row !== null) {
            let listItemObj = { value: row.ID, label: row.COMN_CD };
            rstArr.push(listItemObj);
          }
        }

        setModuleOptions(rstArr);
        setValue('moduleId', rstArr[0].value);

        loadMasterData();
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function setDetailGridOptions(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, true, true);

    grid.gridView.onCellButtonClicked = function (grid, clickData, column) {
      setDetailData(grid.getValues(clickData.itemIndex));
      openPlanScenarioStepPopup();
    }
  }

  function loadMasterData() {
    let params = new URLSearchParams();

    params.append('MODULE_CD', module);
    params.append('DESCRIP', '');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q1',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        masterGrid.dataProvider.clearRows();
        detailGrid.dataProvider.clearRows();
        masterGrid.setData(res.data.RESULT_DATA);
        setPopupData({});
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function loadDetailData(masterId) {
    let params = new URLSearchParams();

    params.append('MST_ID', masterId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q3',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        detailGrid.dataProvider.clearRows();
        detailGrid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function refresh() {
    reset({
      ...getValues()
    });
    setPopupData({});
    masterGrid.dataProvider.clearRows();
    detailGrid.dataProvider.clearRows();
  }

  function saveData() {
    let formData = new FormData();
    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      masterGrid.dataProvider.getAllStateRows().created,
      masterGrid.dataProvider.getAllStateRows().updated,
      masterGrid.dataProvider.getAllStateRows().deleted,
      masterGrid.dataProvider.getAllStateRows().createAndDeleted
    );

    changedRow.forEach(function (row) {
      let data = masterGrid.dataProvider.getJsonRow(row);
      changes.push(data);
    });

    formData.append('changes', JSON.stringify(changes));
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_16_S1", formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_16_S1_P_RT_MSG;
          msg === "MSG_0001" ? loadMasterData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
        } else {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
        }
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  function deleteMasterData() {
    masterGrid.gridView.commit(true);

    if (masterGrid.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
      return;
    }

    showMessage(transLangKey('WARNING'), transLangKey('MSG_5134'), function (answer) {
      if (answer) {
        showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
          if (answer) {
            let checkedRow = masterGrid.gridView.getCheckedRows();

            let formData = new FormData();
            let checked = [];

            checkedRow.forEach(function (row) {
              checked.push(masterGrid.dataProvider.getJsonRow(row));
            });

            formData.append('checked', JSON.stringify(checked));

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_16_S4", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_16_S4_P_RT_MSG;
                  msg === "MSG_0002" ? loadMasterData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        });
      }
    });
  }

  function deleteDetailData() {
    let checkedRow = detailGrid.gridView.getCheckedRows();

    let formData = new FormData();
    let checked = [];

    checkedRow.forEach(function (row) {
      checked.push(detailGrid.dataProvider.getJsonRow(row));
    });

    formData.append('checked', JSON.stringify(checked));

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_16_S3", formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_16_S3_P_RT_MSG;
          msg === "MSG_0002" ? loadDetailData(popupData.MST_ID) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
        } else {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
        }
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  function openPlanScenarioPopup() {
    setPlanScenarioPopupOpen(true);
  }

  function closePlanScenarioPopup() {
    setPlanScenarioPopupOpen(false);
  }

  function openPlanScenarioStepPopup() {
    setPlanScenarioStepPopupOpen(true);
  }

  function closePlanScenarioStepPopup() {
    setPlanScenarioStepPopupOpen(false);
    setDetailData();
  }

  return (
    <>
      <ContentInner>
        <InputField type="select" name="moduleId" label={transLangKey("MODULE_VAL")} style={{ display: "none" }} control={control} options={moduleOptions}/>
        <ResultArea sizes={[50,50]} direction={"vertical"}>
          <Box>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="masterGrid" onClick={openPlanScenarioPopup} />
                <GridDeleteRowButton type="icon" grid="masterGrid" onClick={deleteMasterData} />
                <GridSaveButton type="icon" grid="masterGrid" onSave={saveData} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="masterGrid" items={masterGridItems} afterGridCreate={afterMasterGridCreate} />
            </Box>
          </Box>
          <Box>
            <RightButtonArea>
              <GridAddRowButton type="icon" grid="detailGrid" onClick={openPlanScenarioStepPopup} />
              <GridDeleteRowButton type="icon" grid="detailGrid" onDelete={deleteDetailData} />
            </RightButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="detailGrid" items={detailGridItems} afterGridCreate={afterDetailGridCreate} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {planScenarioPopupOpen && (<PopPlanScenario open={planScenarioPopupOpen} onClose={closePlanScenarioPopup} confirm={loadMasterData} module={module} />)}
      {planScenarioStepPopupOpen && (<PopPlanScenarioStep open={planScenarioStepPopupOpen} onClose={closePlanScenarioStepPopup} confirm={() => loadDetailData(popupData.MST_ID)} data={popupData} detailData={detailData} />)}
    </>
  )
}

export default PlanScenario;
