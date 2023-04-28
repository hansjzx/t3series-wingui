import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, IconButton } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, SearchArea, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100' },
  { name: 'WC', dataType: 'text', headerText: 'WC', visible: true, editable: false, width: '80' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '80' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '120' }
]

function PopCommResource(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);

  const { handleSubmit, getValues, control, clearErrors } = useForm({
    defaultValues: {
      locatTpNm: "",
      locatCd: "",
      locatNm: "",
      resCd: ""
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopResourceGrid`);
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

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    let param = new URLSearchParams();

    param.append('SP_COMM_SRH_RES_Q_01', getValues('locatTpNm'));
    param.append('SP_COMM_SRH_RES_Q_02', getValues('locatCd'));
    param.append('SP_COMM_SRH_RES_Q_03', getValues('locatNm'));
    param.append('SP_COMM_SRH_RES_Q_04', getValues('resCd'));

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_GET_RES_GRID_LIST',
      params: param
    })
      .then(function (res) {
        grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_RES" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} control={control} />
        <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} />
        <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} />
        <InputField name="resCd" label={transLangKey("RES_CD")} control={control} />
        <IconButton onClick={() => { popupLoadData() }}><Icon.Search /></IconButton>
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopResourceGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopCommResource;
