import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let girdAttibuteValueColumns = [
  { name: 'ATTRS', dataType: 'text', headerText: 'ATTR', visible: true, editable: false, width: '100', lang: true },
  { name: 'VAL_ID', dataType: 'text', headerText: 'VAL_ID', visible: false, editable: false, width: '100' },
  { name: 'VAL', dataType: 'text', headerText: 'VAL', visible: true, editable: true, width: '100'}
];

function PopRouteClassificationNew2(props) {
  const [username] = useUserStore(state => [state.username]);
  const [grid, setGrid] = useState(null);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      routeClassMstId: '',
      routeClassDtlId: '',
      routeClassVal: '',
      routeClassDescrip: '',
      routeGrp: '',
      routeGrpDescrip: '',
      actvYn: ['']
    }
  });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    const setRouteClass = async () => {
      setOptions();

      if (props.data !== null) {
        setValue('routeClassMstId', props.data.routeClassMstId);
        setValue('routeClassVal', props.data.routeClassVal);
        setValue('routeClassDescrip', props.data.descrip);

        let gridData = '';
        
        if (props.data.param === 'update') {
          setValue('routeClassDtlId', props.data.routeClassDtlId);
          setValue('routeGrp', props.data.routeGrp);
          setValue('routeGrpDescrip', props.data.routeGrpDescrip);
          setValue('actvYn', props.data.actvYn);

          gridData = await popupLoadData('002');
        } else {
          gridData = await popupLoadData('004');
        }

        let routeGrp = await popupLoadData('005');

        if (gridData !== null) {
          grid.setData(gridData);
        }

        if (getValues('routeGrp') === '') {
          setValue('routeGrp', routeGrp[0].ROUTE_GRP_NM);
        }
      }
    }

    if (grid) {
      setRouteClass();
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
    formData.append('ROUTE_CLASS', getValues('routeClassVal'));
    formData.append('ROUTE_CLASS_DTL_ID', getValues('routeClassDtlId'));

    return zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_ROUTE_CLASS_POP_01_Q',
      data: formData
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
        formData.append('ROUTE_CLASS_ID', getValues('routeClassMstId'));
        formData.append('ROUTE_GRP', getValues('routeGrp'));
        formData.append('ROUTE_GRP_DESCRIP', getValues('routeGrpDescrip'));
        formData.append('changes', JSON.stringify(changes));
        formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_S2',
          data: formData
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_S2_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title={ props.data.param === 'update' ? "UPDATE_ROUTE_GRP" : "NEW_ROUTE_GRP" } resizeHeight={600} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={'tab1'} indicatorColor="primary">
          <Tab label={transLangKey("ROUTE_GRP")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="routeClassVal" label={transLangKey("ROUTE_CLASS_VAL")} control={control} disabled={true} />
            <InputField name="routeClassDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <Box style={{ height: "50%" }}>
              <BaseGrid id={`${props.id}_PopRouteClassificationNew2Grid`} items={girdAttibuteValueColumns} afterGridCreate={afterGridCreate} />
            </Box>
            <InputField name="routeGrp" label={transLangKey("ROUTE_GRP")} control={control} disabled={props.data.param === 'update' ? true : false} />
            <InputField name="routeGrpDescrip" label={transLangKey("DESCRIP")} control={control} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopRouteClassificationNew2;
