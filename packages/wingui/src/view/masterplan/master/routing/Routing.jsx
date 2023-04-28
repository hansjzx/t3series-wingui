import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, CommonButton, ContentInner, GridSaveButton, GridExcelExportButton, InputField,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';
import PopRoutingBatchUpdate from './PopRoutingBatchUpdate';

let gridRoutingColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', editable: false, width: '80' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', editable: false, width: '80' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', editable: false, width: '160' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', editable: false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', editable: false, width: '160' },
  { name: 'ITEM_TP_ID', dataType: 'dropdown', headerText: 'ITEM_TP', editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', editable: false, width: '100' },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', editable: false, width: '200' },
  { name: 'BASE_ALLOC_RULE_ID', dataType: 'dropdown', headerText: 'BASE_ALLOC_RULE', editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'BASE_ALLOC_PRIORT', dataType: 'number', headerText: 'BASE_ALLOC_PRIOR', editable: true, width: '100' },
  { name: 'BASE_ALLOC_PROPTN', dataType: 'number', headerText: 'BASE_ALLOC_PROPTN', editable: true, width: '80' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', editable: true, width: '80' },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

function Routing() {
  const [username] = useUserStore(state => [state.username]);
  const [gridRouting, setGridRouting] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [batchUpdatePopupOpen, setBatchUpdatePopupOpen] = useState(false);

  const { reset, control, getValues } = useForm({
    defaultValues: {
      routeCd: '',
      routeDescrip: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridRouting');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridRouting != grdObj1) {
          setGridRouting(grdObj1);
        }
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

     if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      setViewInfo(vom.active, 'globalButtons', globalButtons);

      if (gridRouting) {
  
        setOptionsGridRouting();

        await loadRouting();
      }
    }

    initLoad();
  }, [gridRouting]);

  function onSubmit() {
    loadRouting();
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridRouting.dataProvider.clearRows();
  }

  const setOptionsGridRouting = () => {
    gridRouting.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    gridRouting.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridRouting, true, true, false);

    gridRouting.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'value' });
    gridRouting.gridView.setColumnProperty('ITEM_TP_ID', 'mergeRule', { criteria: 'value' });

    setGridComboList(gridRouting, 'ITEM_TP_ID, BASE_ALLOC_RULE_ID', 'ITEM_TYPE, SOURCING_RULE');
  }

  function loadRouting() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ROUTE_CD', getValues('routeCd'));
    formData.append('ROUTE_DESCRIP', getValues('routeDescrip'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_38_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridRouting.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveRouting() {
    gridRouting.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridRouting.dataProvider.getAllStateRows().created,
          gridRouting.dataProvider.getAllStateRows().updated,
          gridRouting.dataProvider.getAllStateRows().deleted,
          gridRouting.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = gridRouting.dataProvider.getJsonRow(row);
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {

          let formData = new FormData();
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_38_S1',
            data: formData
          })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_38_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            if (res.status === gHttpStatus.SUCCESS) {
              loadRouting();
            }
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      }
    });
  }

  function openBatchUpdatePopup() {
    setBatchUpdatePopupOpen(true);
  }

  function closeBatchUpdatePopup() {
    setBatchUpdatePopupOpen(false);

    loadRouting();
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>
            <InputField name="routeCd" label={transLangKey("ROUTE_CD")} control={control} />
            <InputField name="routeDescrip" label={transLangKey("ROUTE_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridRouting" options={exportOptions} />
            {/*<GridExcelImportButton type="icon" grid="gridRouting" />*/}
            <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={openBatchUpdatePopup}><Icon.Database/></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton type="icon" onClick={() => { saveRouting() }} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridRouting" items={gridRoutingColumns}></BaseGrid>
        </ResultArea>
      </ContentInner>

      <PopRoutingBatchUpdate open={batchUpdatePopupOpen} onClose={ closeBatchUpdatePopup } />
    </>
  )
}

export default Routing
