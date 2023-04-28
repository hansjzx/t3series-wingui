import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'

import '@wingui/view/supplychainmodel/common/common.css';

const oneRowStyle = { minWidth: "200px", marginRight: "50px" };

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'SEQ', dataType: 'text', headerText: 'SEQ', visible: false, editable: false, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: false, editable: false, width: '100' },
  { name: 'CONVN_NM', dataType: 'text', headerText: 'ATTR', visible: true, editable: false, width: '100' },
  { name: 'SELECT_YN', dataType: 'boolean', headerText: 'SELECT_YN', visible: true, editable: false, width: '100',
    styleCallback: function (grid, dataCell) {
      var ret = {}
      var actvYn = grid.getValue(dataCell.index.itemIndex, 'ACTV_YN')

      if (actvYn) {
        ret.styleName = 'editable-boolean-column';
        ret.renderer = { editable: true };
      }

      return ret
    },
  }
];

function PopItemClassificationNew1(props) {
  const [username] = useUserStore(state => [state.username]);
  const languageCode = useContentStore(state => state.languageCode);

  const [grid, setGrid] = useState(null);

  const [tabValue, setTabValue] = React.useState("tab1");

  const [itemLvOption, setItemLvOption] = useState([]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemLv: '',
      genId: '',
      descrip: '',
      continuPrductYn: [''],
      prodMixYn: [''],
      actvYn: ['', 'Y']
    }
  });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    const itemLvSet = async () => {
      if (props.data !== null) {
        setItemLvOption(props.data);
        setValue('itemLv', props.data[0].value);
      }
    }
    
    if (grid) {
      setOptions();
    }

    itemLvSet();
    autoGenId();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    popupLoadData();
  }

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function autoGenId() {
    let formData = new FormData();

    formData.append('VER_TP', 'ITEM_CLASSIFICATION');
    formData.append('VAL_01', getValues('itemLv'));

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_COMM_AUTO_GEN_ID',
      data: formData
    })
      .then(function (res) {
        setValue('genId', res.data.RESULT_DATA[0].GEN_ID);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function popupLoadData() {
    let formData = new FormData();

    formData.append('CONF_KEY', '002');
    formData.append('VIEW_ID', 'POP_UI_CM_03_03');
    formData.append('ITEM_LV_ID', '');
    formData.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_CM_03_POP_01_Q',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        grid.gridView.commit(true);

        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          grid.dataProvider.getAllStateRows().created,
          grid.dataProvider.getAllStateRows().updated,
          grid.dataProvider.getAllStateRows().deleted,
          grid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(grid.dataProvider.getJsonRow(row));
        });

        let formData = new FormData();

        formData.append('ITEM_SCOPE_MST_ID', getValues('itemLv'));
        formData.append('ITEM_CLASS_VAL', getValues('genId'));
        formData.append('DESCRIP', getValues('descrip'));
        formData.append('CONTINU_PRDUCT_YN', getValues('continuPrductYn').join("")  === 'Y' ? true : false);
        formData.append('PROD_MIX_YN', getValues('prodMixYn').join("")  === 'Y' ? true : false);
        formData.append('changes', JSON.stringify(changeRowData));
        formData.append('ACTV_YN', getValues('actvYn').join("")  === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_CM_03_S1_INS',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            props.confirm();
            props.onClose(false);
          })
          .catch(function (e) {
            console.error(e);

            props.confirm();
            props.onClose(false);
          });
      }
    });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_CM_03_02" resizeHeight={500} resizeWidth={500}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tab1" />
            <Tab label={transLangKey("ATTR")} value="tab2" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px"}}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
            <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} options={itemLvOption} />
            <InputField name="genId" label={transLangKey("ITEM_CLASS_VAL")} control={control} disabled={true} />
            <InputField name="descrip" label={transLangKey("DESCRIP")} control={control} style={oneRowStyle} />

            <InputField type="check" name="continuPrductYn" control={control} options={[{ label: transLangKey("CONTINU_PRDUCT"), value: "Y" }]} />
            <InputField type="check" name="prodMixYn" control={control} options={[{ label: transLangKey("PROD_MIX_YN"), value: "Y" }]} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
              <BaseGrid id={`${props.id}_PopItemClassificationNew1Grid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
          </Box>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopItemClassificationNew1;
