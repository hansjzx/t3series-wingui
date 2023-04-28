import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ATTRS', dataType: 'text', headerText: 'ATTR', visible: true, editable: false, width: '100', lang: true },
  { name: 'VAL_ID', dataType: 'text', headerText: 'VAL_ID', visible: false, editable: false, width: '100' },
  { name: 'VAL', dataType: 'text', headerText: 'VAL', visible: true, editable: true, width: '100'}
];

function PopItemClassificationNew2(props) {
  const [username] = useUserStore(state => [state.username]);
  const [grid, setGrid] = useState(null);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemLv: '',
      itemClassMstId: '',
      itemClassDtlId: '',
      itemClassVal: '',
      itemClassDescrip: '',
      itemGrp: '',
      itemGrpDescrip: '',
      seq: '',
      actvYn: ['']
    }
  });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    const setItemClass = async () => {
      setOptions();

      if (props.data !== null) {
        setValue('itemLv', props.data.itemLvNm);
        setValue('itemClassMstId', props.data.itemClassMstId);
        setValue('itemClassVal', props.data.itemClassVal);
        setValue('itemClassDescrip', props.data.descrip);

        let gridData = '';
        
        if (props.data.param === 'update') {
          setValue('itemClassDtlId', props.data.itemClassDtlId);
          setValue('itemGrp', props.data.itemGrp);
          setValue('itemGrpDescrip', props.data.itemGrpDescrip);
          setValue('seq', props.data.seq);
          setValue('actvYn', props.data.actvYn);

          gridData = await popupLoadData('003');
        } else {
          gridData = await popupLoadData('005');
        }

        if(gridData !== null) {
          grid.setData(gridData);
        }

        let itemGrp = await popupLoadData('006');

        if (itemGrp !== null) {
          setValue('itemGrp', itemGrp[0].ITEM_GRP_NM);
        }
      }
    }

    if (grid) {
      setItemClass();
    }
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, true, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });
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

  function popupLoadData(confKey) {
    let formData = new FormData();

    formData.append('CONF_KEY', confKey);
    formData.append('VIEW_ID', '');
    formData.append('ITEM_LV_ID', '');
    formData.append('ITEM_CLASS', getValues('itemClassVal'));
    formData.append('ITEM_CLASS_DTL_ID', getValues('itemClassDtlId'));

    return zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_CM_03_POP_01_Q',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          return res.data.RESULT_DATA;
        }

        return [];
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveData() {
    grid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = grid.dataProvider.getJsonRows();

        let formData = new FormData();
        formData.append('ITEM_CLASS_ID', getValues('itemClassMstId'));
        formData.append('ITEM_GRP', getValues('itemGrp'));
        formData.append('ITEM_GRP_DESCRIP', getValues('itemGrpDescrip'));
        formData.append('changes', JSON.stringify(changes));
        formData.append('SEQ', getValues('seq'));
        formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_CM_03_S2',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_S2_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title={ props.data.param === 'update' ? "POP_UI_CM_03_01" : "POP_UI_CM_03_03" } resizeHeight={600} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={'tab1'} indicatorColor="primary">
          <Tab label={transLangKey("ITEM_GRP")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }} >
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="itemLv" label={transLangKey("ITEM_LV")} control={control} disabled={true} />
            <InputField name="itemClassVal" label={transLangKey("ITEM_CLASS_VAL")} control={control} disabled={true} />
            <InputField name="itemClassDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />

            <Box style={{ height: "50%" }}>
              <BaseGrid id={`${props.id}_PopItemClassificationNew2Grid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
            </Box>

            <InputField name="itemGrp" label={transLangKey("ITEM_GRP")} control={control} disabled={props.data.param === 'update' ? true : false} />
            <InputField name="itemGrpDescrip" label={transLangKey("DESCRIP")} control={control} />
            <InputField name="seq" label={transLangKey("SEQ")} control={control} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopItemClassificationNew2;
