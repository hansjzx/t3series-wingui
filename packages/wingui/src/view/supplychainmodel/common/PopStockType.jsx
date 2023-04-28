import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'LOCAT_ITEM_ID', dataType: 'text', headerText: 'LOCAT_ITEM_ID', visible: false, editable: false, width: '100' },
  { name: 'INV_QTY_TP_ID', dataType: 'text', headerText: 'INV_QTY_TP_ID', visible: false, editable: false, width: '100' },
  { name: 'INV_QTY_TP_NM', dataType: 'text', headerText: 'STOCK_TP', visible: true, editable: false, width: '100' },
  { name: 'QTY', dataType: 'number', headerText: 'QTY', visible: true, editable: false, width: '100' },
  { name: 'PLAN_YN', dataType: 'boolean', headerText: 'PLAN_YN', visible: true, editable: true, width: '100' }
];

function PopStockType(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopStockTypeGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill',
    });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0 ) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    let urlInfo;
    let param = new URLSearchParams();
    if (props.data.param === 'warehouse') {
      urlInfo = "engine/mp/SRV_UI_IM_12_Q5";
      param.append('WAREHOUSE_INV_MST_ID', props.data.mstId);
    } else {
      urlInfo = "engine/mp/SRV_UI_IM_13_Q5";
      param.append('INTRANSIT_INV_MST_ID', props.data.mstId);
    }

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: urlInfo,
      params: param
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    grid.gridView.commit(true);

    let changeRowData = [];
    let changes = [];

    changes = changes.concat(
      grid.dataProvider.getAllStateRows().updated
    );

    changes.forEach(function (row) {
      let rowData = grid.dataProvider.getJsonRow(row);

      if (props.data.locationItemId) {
        rowData.LOCAT_ITEM_ID = props.data.locationItemId;
      }

      changeRowData.push(rowData);
    });

    if (changeRowData.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          formData.append('CUTOFF_DATE', new Date(props.data.cutoffDate).format('yyyy-MM-ddT00:00:00'));
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);
  
          zAxios.post(baseURI() + 'engine/mp/SRV_UI_IM_12_S3', formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_IM_12_S3_P_RT_MSG;
                if (msg === "MSG_0001") {
                  props.confirm();
                  close();
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
      });
    }
  }

  function close() {
    grid.gridView.commit(true);
    props.onClose();
    grid.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={handleSubmit(saveData, onError)} title="STOCK_QTY_TP" resizeHeight={400} resizeWidth={400}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopStockTypeGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopStockType;
