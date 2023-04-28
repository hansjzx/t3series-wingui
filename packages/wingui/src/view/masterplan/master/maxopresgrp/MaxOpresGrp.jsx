import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelImportButton, GridExcelExportButton, GridAddRowButton, GridSaveButton,
  GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import PopRouteGrp from './PopRouteGrp';
import PopMaxOpersGrpNew from './PopMaxOpersGrpNew';

let gridMaxOperResColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_CLASS_DTL_ID', dataType: 'text', headerText: 'FROM_ROUTE_CLASS_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100', button: 'action' },
  { name: 'ROUTE_GRP_DESCRIP', dataType: 'text', headerText: 'ROUTE_GRP_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'MAX_RESOURCE_COUNT', dataType: 'number', headerText: 'MAX_RESOURCE_COUNT', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: '100' },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: '100' }
];

function MaxOpresGrp() {
  const [username] = useUserStore(state => [state.username]);
  const [routeGrpPopupOpen, setPopupRouteGrp] = useState(false);
  const [popupFlag, setPopupFlag] = useState(false);
  const [maxOpersGrpNewPopupOpen, setPopupMaxOpersGrpNew] = useState(false);

  const [gridMaxOperRes, setGrid] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      routeGrp: '',
      routeGrpDescrip: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  useEffect(() => {
    const grdObj = getViewInfo(vom.active, 'gridMaxOperRes');

    if (grdObj) {
      if (grdObj.dataProvider) {
        if (gridMaxOperRes !== grdObj) {
          setGrid(grdObj);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (gridMaxOperRes) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGrid();
  
        await loadMaxOperationResGrp();
      }
    }

    initLoad();
  }, [gridMaxOperRes]);

  function setOptionsGrid() {
    setVisibleProps(gridMaxOperRes, true, true, true);

    gridMaxOperRes.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridMaxOperRes.gridView.columnByName('ROUTE_GRP').buttonVisibility = 'always';

    gridMaxOperRes.gridView.onCellButtonClicked = function (grid, index, column) {
      setPopupFlag(true);
      setPopupRouteGrp(true);
    }
  }

  function onSubmit() {
    loadMaxOperationResGrp();
  }

  function refresh() {
    reset();

    gridMaxOperRes.dataProvider.clearRows();
  }

  function openPopupRouteGrp() {
    setPopupFlag(false);
    setPopupRouteGrp(true);
  }

  function onSetRouteGrp(gridRow) {
    if (popupFlag) {
      let itemIndex = gridMaxOperRes.gridView.getCurrent().dataRow;

      gridMaxOperRes.dataProvider.setValue(itemIndex, 'ROUTE_CLASS_DTL_ID', gridRow.ROUTE_CLASS_DTL_ID);
      gridMaxOperRes.dataProvider.setValue(itemIndex, 'ROUTE_GRP', gridRow.ROUTE_GRP);
      gridMaxOperRes.dataProvider.setValue(itemIndex, 'ROUTE_GRP_DESCRIP', gridRow.ROUTE_GRP_DESCRIP);
    } else {
      setValue('routeGrp', gridRow.ROUTE_GRP);
      setValue('routeGrpDescrip', gridRow.ROUTE_GRP_DESCRIP);
    }
  }

  function openPopupMaxOpresGrpNew() {
    setPopupMaxOpersGrpNew(true);
  }

  function loadMaxOperationResGrp() {
    let formData = new FormData();

    formData.append('ROUTE_GRP', getValues('routeGrp'));
    formData.append('ROUTE_GRP_DESCRIP', getValues('routeGrpDescrip'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_35_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMaxOperRes.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveMaxOperationResGrp() {
    gridMaxOperRes.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridMaxOperRes.dataProvider.getAllStateRows().updated
        );

        changes.forEach(function (row) {
          let rowData = gridMaxOperRes.dataProvider.getJsonRow(row);

          if (rowData.CREATE_DTTM instanceof Date) {
            rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.MODIFY_DTTM instanceof Date) {
            rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddT00:00:00");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddT00:00:00");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_35_S1',
              data: formData
            })
              .then(function () {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_35_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadMaxOperationResGrp();
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

  function deleteMaxOperationResGrp(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DATE instanceof Date) {
        rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddT00:00:00");
      }
      if (rowData.END_DATE instanceof Date) {
        rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddT00:00:00");
      }
      if (rowData.CREATE_DTTM instanceof Date) {
        rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.MODIFY_DTTM instanceof Date) {
        rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });
  
    formData.append('WRK_TYPE', 'DELETE');
    formData.append('checked', JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_35_S1',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='routeGrp' label={transLangKey('ROUTE_GRP')} title={transLangKey('SEARCH')}
                onClick={() => { openPopupRouteGrp() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="routeGrpDescrip" label={transLangKey("ROUTE_GRP_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type='icon' grid='gridMaxOperRes' options={exportExcelOptions} />
            {/*<GridExcelImportButton type='icon' grid='gridMaxOperRes' />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" onClick={() => { openPopupMaxOpresGrpNew() }}></GridAddRowButton>
            <GridDeleteRowButton type="icon" grid="gridMaxOperRes" onDelete={deleteMaxOperationResGrp}></GridDeleteRowButton>
            <GridSaveButton type="icon" onClick={() => { saveMaxOperationResGrp() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: 'calc(100% - 90px)' }}>
          <BaseGrid id='gridMaxOperRes' items={gridMaxOperResColumns} />
        </Box>
      </ContentInner>
      {routeGrpPopupOpen && (<PopRouteGrp open={routeGrpPopupOpen} onClose={() => { setPopupRouteGrp(false); }} confirm={onSetRouteGrp}></PopRouteGrp>)}
      {maxOpersGrpNewPopupOpen && (<PopMaxOpersGrpNew open={maxOpersGrpNewPopupOpen} onClose={() => { setPopupMaxOpersGrpNew(false); }} confirm={onSubmit}></PopMaxOpersGrpNew>)}
    </>
  )
}

export default MaxOpresGrp;
