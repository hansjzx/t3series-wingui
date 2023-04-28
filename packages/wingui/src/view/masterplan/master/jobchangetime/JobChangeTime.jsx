import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ContentInner, GridSaveButton, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea,
  GridExcelExportButton, GridAddRowButton, GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import PopJobChangeTimeNew from './PopJobChangeTimeNew';
import PopRouteGroup from './PopRouteGroup';

let gridJobChangeColumns = [
  { name: "ID", headerText: "ID", dataType: "text", visible: false },
  { name: "RES_ID", headerText: "RES_ID", dataType: "text", visible: false },
  {
    name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", headerText: "LOCAT_TP_NM", dataType: "text", width: "120", visible: true, editable: false, merge: true, groupShowMode: 'expand' },
      { name: "LOCAT_LV", headerText: "LOCAT_LV", dataType: "text", width: "120", visible: true, editable: false, merge: true, groupShowMode: 'expand' },
      { name: "LOCAT_CD", headerText: "LOCAT_CD", dataType: "text", width: "120", visible: true, editable: false, merge: true, groupShowMode: 'always' },
      { name: "LOCAT_NM", headerText: "LOCAT_NM", dataType: "text", width: "120", visible: true, editable: false, merge: true, groupShowMode: 'always' }
    ]
  },
  { name: "RES_CD", headerText: "RES_CD", width: "100", dataType: "text", visible: true, merge: true },
  { name: "RES_DESCRIP", headerText: "RES_DESCRIP", dataType: "text", width: "150", visible: true, editable: false, merge: true },
  { name: "FROM_ROUTE_CLASS_DTL_ID", headerText: "FROM_ROUTE_CLASS_DTL_ID", dataType: "text", visible: false },
  { name: "FROM_ROUTE_GRP_CD", headerText: "FROM_ROUTE_GRP_CD", dataType: "text", width: "130", button: "action", visible: true, editable: false },
  { name: "FROM_ROUTE_GRP_DESCRIP", headerText: "FROM_ROUTE_GRP_DESCRIP", dataType: "text", width: "130", visible: true, editable: false},
  { name: "TO_ROUTE_CLASS_DTL_ID", headerText: "TO_ROUTE_CLASS_DTL_ID", dataType: "text", visible: false },
  { name: "TO_ROUTE_GRP_CD", headerText: "TO_ROUTE_GRP_CD", dataType: "text", width: "130", button: "action", visible: true, editable: false },
  { name: "TO_ROUTE_GRP_DESCRIP", headerText: "TO_ROUTE_GRP_DESCRIP", dataType: "text", width: "130", visible: true, editable: false},
  { name:"JC_CAPACITY", headerText:"JC_CAPACITY", dataType:"number", width:110, visible: true, editable:true},
  { name:"JC_TIME", headerText:"JC_TIME", dataType:"number", width:110, visible: true, editable:true},
  { name:"UOM_ID", headerText:"TIME_UOM_NM", dataType:"text", width:100, visible:true, editable:true, useDropdown: true, lookupDisplay: true },
  { name: "ACTV_YN", headerText: "ACTV_YN", dataType: "boolean", visible: true, editable: true, width: "60" },
  {
    name: "auditGroup", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", headerText: "CREATE_BY", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: "expand" },
      { name: "CREATE_DTTM", headerText: "CREATE_DTTM", dataType: "datetime", width: "150", visible: true, editable: false, groupShowMode: "expand" },
      { name: "MODIFY_BY", headerText: "MODIFY_BY", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: "always" },
      { name: "MODIFY_DTTM", headerText: "MODIFY_DTTM", dataType: "datetime", width: "150", visible: true, editable: false, groupShowMode: "expand" }
    ]
  }
];

function JobChangeTime() {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [gridJobChange, setGridJobChange] = useState(null);

  const [JobChangeTimeNewOpen, setJobChangeTimeNewOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const [clickFrom, setClickFrom] = useState('');
  const [resourcePopupOpen, setPopResource] = useState(false);
  const [routeGroupPopupOpen, setRouteGroupPopupOpen] = useState(false);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridJobChange');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridJobChange(grdObj1)
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData])


  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      resCd: '',
      resDescrip: ''
    }
  });

  const globalButtons = [
    {
      name: 'search',
      action: (e) => { onSubmit() },
      visible: true,
      disable: false
    },
    {
      name: 'refresh',
      action: (e) => { refresh() },
      visible: true,
      disable: false
    }
  ]

  const exportExceloptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    async function initLoad() {
      if (gridJobChange) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptions();

        await loadData();
      }
    }
    initLoad();
  }, [gridJobChange]);

  const onSubmit = () => {
    loadData();
  };

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function onSetRouteGroup(gridRow, clickFrom) {
    let itemIndex = gridJobChange.gridView.getCurrent().dataRow;
    if (clickFrom == "FROM_ROUTE_GRP_CD") {
      gridJobChange.dataProvider.setValue(itemIndex, 'FROM_ROUTE_GRP_CD', gridRow.ROUTE_GRP);
      gridJobChange.dataProvider.setValue(itemIndex, 'FROM_ROUTE_GRP_DESCRIP', gridRow.ROUTE_GRP_DESCRIP);
      gridJobChange.dataProvider.setValue(itemIndex, 'FROM_ROUTE_CLASS_DTL_ID', gridRow.ROUTE_CLASS_DTL_ID);
    } else if (clickFrom == "TO_ROUTE_GRP_CD") {
      gridJobChange.dataProvider.setValue(itemIndex, 'TO_ROUTE_GRP_CD', gridRow.ROUTE_GRP);
      gridJobChange.dataProvider.setValue(itemIndex, 'TO_ROUTE_GRP_DESCRIP', gridRow.ROUTE_GRP_DESCRIP);
      gridJobChange.dataProvider.setValue(itemIndex, 'TO_ROUTE_CLASS_DTL_ID', gridRow.ROUTE_CLASS_DTL_ID);
    }
  }

  function onSetRouteGroupClose() {
    setClickFrom('');
  }

  const refresh = () => {
    currentLocationRef.reset();
    reset();
    gridJobChange.dataProvider.clearRows();
  }

  function setOptions() {
    setVisibleProps(gridJobChange, true, true, true);
    gridJobChange.gridView.displayOptions.fitStyle = 'fill';
    wingui.util.grid.sorter.orderBy(gridJobChange.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'RES_CD', 'RES_DESCRIP']);
    gridJobChange.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridJobChange.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "value" });
    gridJobChange.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "value" });
    gridJobChange.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "value" });
    gridJobChange.gridView.setColumnProperty("RES_CD", "mergeRule", { criteria: "value" });
    gridJobChange.gridView.setColumnProperty("RES_DESCRIP", "mergeRule", { criteria: "value" });

    setGridComboList(gridJobChange, "UOM_ID", "TIME_UOM");

    gridJobChange.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "FROM_ROUTE_GRP_CD" || column.fieldName === "TO_ROUTE_GRP_CD") {
        setClickFrom(column.fieldName);
      }
    }

    gridJobChange.gridView.columnByName("FROM_ROUTE_GRP_CD").buttonVisibility = "always";
    gridJobChange.gridView.columnByName("TO_ROUTE_GRP_CD").buttonVisibility = "always";
  }

  useLayoutEffect(()=> {
    if (clickFrom !== '') {
      setRouteGroupPopupOpen(true);
    } else {
      setRouteGroupPopupOpen(false);
    }
  }, [clickFrom])

  async function loadData() {
    let formData = new FormData();

    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('RES_CD', getValues("resCd"));
    formData.append('RES_DESCRIP', getValues("resDescrip"));

    gridJobChange.gridView.commit(true);

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_23_Q1',
      data: formData
    })
    .then(function (res) {
      gridJobChange.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }


  function saveJobChange() {
    gridJobChange.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridJobChange.dataProvider.getAllStateRows().created,
          gridJobChange.dataProvider.getAllStateRows().updated,
          gridJobChange.dataProvider.getAllStateRows().deleted,
          gridJobChange.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridJobChange.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();

          formData.append('WRK_TYPE', "SAVE");
          formData.append('USER_ID', username);
          formData.append('CHANGES', JSON.stringify(changeRowData));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_23_S1',
            data: formData
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_23_S1_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
            loadData();
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      }
    });
  }

  function savePopupData(created) {
    let formData = new FormData();

    formData.append('WRK_TYPE', created[0].WRK_TYPE ?? '');
    formData.append('RES_ID', created[0].RES_ID ?? '');
    formData.append('FROM_ROUTE_CLASS_DTL_ID', created[0].FROM_ROUTE_CLASS_DTL_ID ?? '');
    formData.append('TO_ROUTE_CLASS_DTL_ID', created[0].TO_ROUTE_CLASS_DTL_ID ?? '');

    if (created[0].JC_CAPACITY !== '') {
      formData.append('JC_CAPACITY', created[0].JC_CAPACITY);
    }
    if (created[0].JC_TIME !== '') {
      formData.append('JC_TIME', created[0].JC_TIME);
    }

    formData.append('UOM_ID', created[0].UOM_ID ?? '');
    formData.append('ACTV_YN', created[0].ACTV_YN[0] === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_23_S1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_23_S1_P_RT_MSG;
        showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

        if (res.status === gHttpStatus.SUCCESS) {
          loadData();
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function deleteJobChange() {
    gridJobChange.gridView.commit(true);

    let checkedRows = gridJobChange.gridView.getCheckedRows();

    if (checkedRows.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRows.forEach(function (row) {
            checked.push(gridJobChange.dataProvider.getJsonRow(row));
          })

          formData.append('USER_ID', username);
          formData.append('WRK_TYPE', "DELETE");
          formData.append('changes', JSON.stringify(checked));

          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_MP_23_S1',
            data: formData
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_23_S1_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          })
          .then(function () {
            loadData();
          });
        }
      });
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <InputField type='action' name='resCd' label={transLangKey('RES_CD')} title={transLangKey('SEARCH')} onClick={() => {setPopResource(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='resDescrip' label={transLangKey('RES_DESCRIP')} control={control} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridJobChange' options={exportExceloptions}></GridExcelExportButton>
                {/*<GridExcelImportButton type='icon' grid='gridJobChange'></GridExcelImportButton>*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => {setJobChangeTimeNewOpen(true)}}></GridAddRowButton>
                <GridDeleteRowButton type="icon" onClick={deleteJobChange}></GridDeleteRowButton>
                <GridSaveButton type="icon" onClick={saveJobChange}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: '100%' }}>
              <BaseGrid id='gridJobChange' items={gridJobChangeColumns}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => {setPopResource(false)}} confirm={onSetResource}></PopCommResource>)}
      {routeGroupPopupOpen && (<PopRouteGroup open={routeGroupPopupOpen} onClose={() => {onSetRouteGroupClose()}} confirm={onSetRouteGroup} clickFrom={clickFrom}></PopRouteGroup>)}
      {JobChangeTimeNewOpen && (<PopJobChangeTimeNew open={JobChangeTimeNewOpen} onClose={() => { setJobChangeTimeNewOpen(false) }} confirm={savePopupData}></PopJobChangeTimeNew>)}
    </>
  )
}

export default JobChangeTime;
