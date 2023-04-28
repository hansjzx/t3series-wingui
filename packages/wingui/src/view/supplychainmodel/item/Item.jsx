import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, StatusArea, GridCnt,
  GridExcelExportButton, GridAddRowButton, GridDeleteRowButton, GridSaveButton, InputField, BaseGrid, useViewStore, useUserStore, zAxios
} from "@zionex/wingui-core/src/common/imports";
import getHeaders from "@zionex/wingui-core/src/utils/getHeaders";
import ItemSearchBox from '../common/ItemSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridItemColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 90},
  {
    name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 110,
    styleCallback: function (grid, dataCell) {
      let ret = {}
      if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
        ret.editable = true;
        ret.styleName = 'editable-text-column';
      } else {
        ret.editable = false;
        ret.styleName = 'text-column';
      }
      return ret;
    },
  },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: true, width: 120, autoFilter: true },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: true, width: 80 },
  { name: "ITEM_TP_ID", dataType: "text", headerText: "ITEM_TP", visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true, autoFilter: true },
  { name: "UOM_ID", dataType: "text", headerText: "UOM", visible: true, editable: true, width: 70, useDropdown: true, lookupDisplay: true },
  { name: "UOM_NM", dataType: "text", headerText: "UOM", visible: false, editable: true, width: 60 },
  { name: "MIN_ORDER_SIZE", dataType: "number", headerText: "MIN_ORDER_SIZE", visible: true, editable: true, width: 90 },
  { name: "MAX_ORDER_SIZE", dataType: "number", headerText: "MAX_ORDER_SIZE", visible: true, editable: true, width: 90 },
  { name: "RTS", dataType: "datetime", headerText: "RTS", visible: true, editable: true, width: 100, format: "yyyy-MM-dd" },
  { name: "EOS", dataType: "datetime", headerText: "EOS", visible: true, editable: true, width: 100, format: "yyyy-MM-dd" },
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: true, editable: true, width: 60, autoFilter: true },
  { name: "DP_PLAN_YN", dataType: "boolean", headerText: "DP_PLAN_YN", visible: true, editable: true, width: 100, autoFilter: true },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: 100 },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: false, width: 110 },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: 110, useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_ID_AD1", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD1", visible: false, editable: false, width: 110 },
  { name: "PARENT_ITEM_LV_ID_AD2", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD2", visible: false, editable: false, width: 110 },
  { name: "PARENT_ITEM_LV_ID_AD3", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD3", visible: false, editable: false, width: 110 },
  { name: 'ATTR_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'CM_ITEM_ATTR', expandable: true, expanded: false,
    childs: [
      { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_11', dataType: 'text', headerText: 'ITEM_ATTR_11', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_12', dataType: 'text', headerText: 'ITEM_ATTR_12', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_13', dataType: 'text', headerText: 'ITEM_ATTR_13', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_14', dataType: 'text', headerText: 'ITEM_ATTR_14', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_15', dataType: 'text', headerText: 'ITEM_ATTR_15', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_16', dataType: 'text', headerText: 'ITEM_ATTR_16', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_17', dataType: 'text', headerText: 'ITEM_ATTR_17', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_18', dataType: 'text', headerText: 'ITEM_ATTR_18', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_19', dataType: 'text', headerText: 'ITEM_ATTR_19', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_20', dataType: 'text', headerText: 'ITEM_ATTR_20', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_21', dataType: 'text', headerText: 'ITEM_ATTR_21', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_22', dataType: 'text', headerText: 'ITEM_ATTR_22', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_23', dataType: 'text', headerText: 'ITEM_ATTR_23', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_24', dataType: 'text', headerText: 'ITEM_ATTR_24', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_25', dataType: 'text', headerText: 'ITEM_ATTR_25', visible: false, editable: false, width: '80', groupShowMode: 'expand' }
    ]
  },
  { name: "DISPLAY_COLOR", dataType: "text", headerText: "DISPLAY_COLOR", visible: true, editable: true, width: 100 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" }
    ]
  }
]

function Item() {
  const [username] = useUserStore(state => [state.username])
  const [gridItem, setGridItem] = useState(null);
  const [message] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, control, getValues } = useForm({
    defaultValues: {
    }
  });

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 1,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridItem');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridItem != grdObj1)
          setGridItem(grdObj1);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (gridItem) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)

      setGridOption();
      setGridComboList(gridItem,
        'ITEM_TP_ID, UOM_ID',
        'ITEM_TYPE, UOM'
        );
      loadItem();
    }

  }, [gridItem]);

  const onSubmit = () => {
    loadItem();
  };

  function refresh() {
    currentItemRef.reset();
    reset();
    gridItem.dataProvider.clearRows();
  }

  const setGridOption = () => {
    setVisibleProps(gridItem, true, true, true);
    gridItem.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    gridItem.gridView.displayOptions.fitStyle = "fill";
    gridItem.gridView.filteringOptions.automating.lookupDisplay = true;
    //setColorPickerRenderer(gridItem.gridView, 'DISPLAY_COLOR');
    gridItem.gridView.setPasteOptions({selectBlockPaste: true});
  }

  function loadItem() {
    let param = new URLSearchParams();
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('ATTR_01', getValues("attr01") === undefined ? "" : getValues("attr01"));
    param.append('ATTR_02', getValues("attr02") === undefined ? "" : getValues("attr02"));
    param.append('ATTR_03', getValues("attr03") === undefined ? "" : getValues("attr03"));
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_OPC_GRID_LOAD');
    zAxios({
      method: 'post',
      headers: getHeaders({}, true),
      url: baseURI() + 'engine/mp/SRV_UI_CM_18_Q1',
      data: param
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          gridItem.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const onDelete = (targetGrid, deleteRows) => {
    showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
      if (answer) {
        if (deleteRows.length > 0) {
          let formData = new FormData();
          formData.append('WRK_TYPE', 'DELETE');
          formData.append('changes', JSON.stringify(deleteRows));
          formData.append('USER_ID', username);
          formData.append('timeout', 0);
          formData.append('CURRENT_OPERATION_CALL_ID', 'RST_CPT_08_Button');
  
          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_18_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_18_S1_P_RT_MSG;
                  msg === "MSG_0002" ? loadItem() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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
    });
  }

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === 'gridItem') {
      loadItem();
    }
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          let rowState = targetGrid.dataProvider.getRowState(row);
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.EOS = new Date(data.EOS).format('yyyy-MM-ddT00:00:00');
          data.RTS = new Date(data.RTS).format('yyyy-MM-ddT00:00:00');
          if (data.EOS === " ") {
            data.EOS = null;
          }
          if (data.RTS === " ") {
            data.RTS = null;
          }
          if (rowState === "created") {
            data.ID = generateId();
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          let formData = new FormData();
          formData.append('WRK_TYPE', 'SAVE');
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);
          formData.append('timeout', 0);
          formData.append('CURRENT_OPERATION_CALL_ID', 'RST_CPT_09_Button');

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_18_S1', formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_18_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadItem() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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
    });
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
          <InputField name="attr01" label={transLangKey("ITEM_ATTR_01")} readonly={false} disabled={false} control={control} />
          <InputField name="attr02" label={transLangKey("ITEM_ATTR_02")} readonly={false} disabled={false} control={control} />
          <InputField name="attr03" label={transLangKey("ITEM_ATTR_03")} readonly={false} disabled={false} control={control} />
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton type="icon" grid="gridItem" options={exportOptions} />
          {/*<GridExcelImportButton type="icon" grid="gridItem" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton type="icon" grid="gridItem"></GridAddRowButton>
          {/* <GridDeleteRowButton type="icon" grid="gridItem" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
          <GridDeleteRowButton type="icon" grid="gridItem" onDelete={onDelete}></GridDeleteRowButton>
          <GridSaveButton type="icon" onClick={() => { saveData(gridItem) }} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="gridItem" items={gridItemColumns}></BaseGrid>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="gridItem" format={'{0} 건 조회되었습니다.'}></GridCnt>
      </StatusArea>
    </ContentInner>
  )
}

export default Item
