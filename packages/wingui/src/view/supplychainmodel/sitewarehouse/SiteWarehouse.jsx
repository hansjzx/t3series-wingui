import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  BaseGrid, ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import PopSiteWarehouse from './PopSiteWarehouse';
import LocationSearchBox from '../common/LocationSearchBox';

let gridWarehouseColumns = [
  { name: 'WH_MGMT_ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: 50 },
  { name: 'LOCAT_MGMT_ID', dataType: 'text', headerText: 'LOC_MGMT_ID', visible: false, editable: false, width: 50 },
  { name: 'LOC_DTL_ID', dataType: 'text', headerText: 'DTL_ID', visible: false, editable: false, width: 50 },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' }
    ]
  },
  { name: 'WAREHOUSE_TP_ID', dataType: 'text', headerText: 'WAREHOUSE_TP_ID', visible: false, editable: false, width: 50 },
  { name: 'WAREHOUSE_TP', dataType: 'text', headerText: 'WAREHOUSE_TP', visible: true, editable: false, width: 80, autoFilter: true },
  { name: 'WAREHOUSE_TP_NM', dataType: 'text', headerText: 'WAREHOUSE_NM', visible: true, editable: false, width: 120, autoFilter: true },
  { name: 'LOAD_CAPA_MGMT_BASE', dataType: 'text', headerText: 'LOAD_CAPA_MGMT_BASE', visible: true, editable: false, width: 120, autoFilter: true },
  { name: 'CAPA_LIMIT_VAL', dataType: 'number', headerText: 'CAPA_LIMIT_VAL', visible: true, editable: true, width: 80 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 60, autoFilter: true },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 80 },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 120 },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 80 },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 120 }
]

function SiteItem() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridWarehouse, setGridWarehouse] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [newSiteWarehousePopupOpen, setNewSiteWarehousePopupOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const { reset } = useForm({
    defaultValues: { }
  });

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
      const grdObj1 = getViewInfo(vom.active, "gridWarehouse");
      if (grdObj1) {
        if (grdObj1.dataProvider) {
          if (gridWarehouse != grdObj1)
            setGridWarehouse(grdObj1);
        }
      }

      if (locationSearchBoxRef) {
        if (locationSearchBoxRef.current) {
          setCurrentLocationRef(locationSearchBoxRef.current);
        }
      }
    }, [viewData]);

  useEffect(() => {
    if (gridWarehouse) {
      setGridOptions();
      loadData();
    }

    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false },
    ]);
  }, [gridWarehouse]);

  function setGridOptions() {
    gridWarehouse.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridWarehouse.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridWarehouse, true, true, true);

    const columnStyleCallback = function (currentGrid, cell) {
      let ret = {};

      if (gridWarehouse.dataProvider.getValue(cell.item.dataRow, 'LOAD_CAPA_MGMT_BASE') === 'Pallet Layer/Location Limit') {
        ret.editable = false;
        ret.styleName = 'text-column text-end';
      } else {
        ret.editable = true;
        ret.styleName = 'editable-text-column text-end';
      }

      return ret;
    }

    let loadCapacityLimitColumn = gridWarehouse.gridView.columnByName('CAPA_LIMIT_VAL');
    loadCapacityLimitColumn.styleCallback = columnStyleCallback;
  }

  function openNewSiteWarehousePopup() {
    setNewSiteWarehousePopupOpen(true);
  }

  function closeNewSiteWarehousePopup() {
    setNewSiteWarehousePopupOpen(false);
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append('LOC_TP', currentLocationRef.getLocationType());
    params.append('LOC_LV', currentLocationRef.getLocationLevel());
    params.append('LOC_CD', currentLocationRef.getLocationCode());
    params.append('LOC_NM', currentLocationRef.getLocationName());
    params.append('WH_TP', "");;
    params.append('LOAD_CAPA_BASE', "");
    params.append('ACTIVE_YN', "A");

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_13_Q1',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridWarehouse.dataProvider.clearRows();
        gridWarehouse.setData(res.data.RESULT_DATA)
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  const onBeforeDelete = (targetGrid) => {
    targetGrid.gridView.commit(true);
    if (targetGrid.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
      return false;
    }

    return true;
  }

  function deleteData(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append('WRK_TYPE', 'DELETE');
    formData.append('checked', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_13_POP_02_S2", formData)
    .then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_13_POP_02_S1", formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_13_POP_02_S1_P_RT_MSG;
                msg === "MSG_0002" ? loadItemShipmentSchedule() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
              } else {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
              }
            }
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function refresh() {
    currentLocationRef.reset();
    reset();
    gridWarehouse.gridView.commit(true);
    gridWarehouse.dataProvider.clearRows();
  }

  function saveData() {
    gridWarehouse.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changedRow = [];
        let changes = [];

        changedRow = changedRow.concat(
          gridWarehouse.dataProvider.getAllStateRows().created,
          gridWarehouse.dataProvider.getAllStateRows().updated,
          gridWarehouse.dataProvider.getAllStateRows().deleted,
          gridWarehouse.dataProvider.getAllStateRows().createAndDeleted
        );

        changedRow.forEach(function (row) {
          let data = gridWarehouse.dataProvider.getJsonRow(row);
          changes.push(data);
        });

        if (changes.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('changes', JSON.stringify(changes));
            formData.append('USER_ID', username);

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_13_POP_02_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_13_POP_02_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridWarehouse" options={exportOptions} />
            {/*<GridExcelImportButton type="icon" grid="gridWarehouse" />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" grid="gridWarehouse" onClick={openNewSiteWarehousePopup} />
            <GridDeleteRowButton type="icon" grid="gridWarehouse" onBeforeDelete={onBeforeDelete} onDelete={deleteData} />
            <GridSaveButton type="icon" onClick={saveData} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridWarehouse" items={gridWarehouseColumns} />
        </ResultArea>
      </ContentInner>

      {newSiteWarehousePopupOpen && (<PopSiteWarehouse open={newSiteWarehousePopupOpen} onClose={closeNewSiteWarehousePopup} confirm={loadData} />)}
    </>
  )
}

export default SiteItem;
