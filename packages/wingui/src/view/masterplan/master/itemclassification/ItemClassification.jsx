import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton,
  GridAddRowButton, GridSaveButton, GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios, CommonButton
} from '@zionex/wingui-core/src/common/imports';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopItemClass from './PopItemClass';
import PopItemClassificationNew1 from './PopItemClassificationNew1';
import PopItemClassificationNew2 from './PopItemClassificationNew2';

let gridClassColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_SCOPE_MST_ID', dataType: 'text', headerText: 'ITEM_SCOPE_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: true, width: '100' },
  { name: 'CONTINU_PRDUCT_YN', dataType: 'boolean', headerText: 'CONTINU_PRDUCT_YN', visible: true, editable: true, width: '150' },
  { name: 'PROD_MIX_YN', dataType: 'boolean', headerText: 'PROD_MIX_YN', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ITEM_ATTR_11', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ITEM_ATTR_12', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ITEM_ATTR_13', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ITEM_ATTR_14', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ITEM_ATTR_15', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ITEM_ATTR_16', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ITEM_ATTR_17', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ITEM_ATTR_18', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ITEM_ATTR_19', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ITEM_ATTR_20', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true }
];

let gridItemGroupColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV', visible: false, editable: false, width: '100' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: false, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_01', dataType: 'boolean', headerText: 'USE_ATTR_01', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_02', dataType: 'boolean', headerText: 'USE_ATTR_02', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_03', dataType: 'boolean', headerText: 'USE_ATTR_03', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_04', dataType: 'boolean', headerText: 'USE_ATTR_04', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_05', dataType: 'boolean', headerText: 'USE_ATTR_05', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_06', dataType: 'boolean', headerText: 'USE_ATTR_06', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_07', dataType: 'boolean', headerText: 'USE_ATTR_07', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_08', dataType: 'boolean', headerText: 'USE_ATTR_08', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_09', dataType: 'boolean', headerText: 'USE_ATTR_09', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_10', dataType: 'boolean', headerText: 'USE_ATTR_10', visible: false, editable: false, width: '100' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: true, width: '100' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: true, width: '100' },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: false, editable: false, width: '100' },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: false, editable: false, width: '100' },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: false, editable: false, width: '100' },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: false, editable: false, width: '100' },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: false, editable: false, width: '100' },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: true, editable: false, width: '100' },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: false, editable: false, width: '100' },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: false, editable: false, width: '100' },
  { name: 'ITEM_GRP', dataType: 'text', headerText: 'ITEM_GRP', visible: true, editable: false, width: '100', button: 'action' },
  { name: 'ITEM_GRP_DESCRIP', dataType: 'text', headerText: 'ITEM_GRP_DESCRIP', visible: true, editable: true, width: '100' },
  { name: 'SEQ', dataType: 'number', headerText: 'SEQ', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' }
];

function ItemClassification() {
  const [username] = useUserStore(state => [state.username]);
  const languageCode = useContentStore(state => state.languageCode);

  const [gridClass, setGridClass] = useState(null);
  const [gridItemGroup, setGridItemGroup] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [selectData, setSelectData] = useState({});

  const [itemLvOption, setItemLvOption] = useState([]);

  const [itemClassPopupOpen, setPopupItemClass] = useState(false);
  const [itemClassificationNew1PopupOpen, setPopupItemClassificationNew1] = useState(false);
  const [itemClassificationNew2PopupOpen, setPopupItemClassificationNew2] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      itemLv: '',
      itemClassVal: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridClass');
    const grdObj2 = getViewInfo(vom.active, 'gridItemGroup');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridClass !== grdObj1) {
          setGridClass(grdObj1);
        }
      }
    }

    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridItemGroup !== grdObj2)
          setGridItemGroup(grdObj2);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (gridClass) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGridClass();
        setCombobox();
        setComboList();

        await loadClassification();
      }
    }

    initLoad();
  }, [gridClass]);

  useEffect(() => {
    if (gridItemGroup) {
      setOptionsGridItemGroup();
    }
  }, [gridItemGroup]);

  function setOptionsGridClass() {
    setVisibleProps(gridClass, true, true, true);

    gridClass.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridClass.gridView.setColumnProperty('ITEM_LV_NM', 'mergeRule', { criteria: 'value' });

    gridClass.gridView.onDataLoadComplated = function () {
      gridClass.gridView.setFocus();
    }

    gridClass.gridView.onCellClicked = function (grid, index) {
      if (index.cellType === "data") {
        if (!(index.editable || (grid.getColumn(index.fieldIndex).renderer.type === 'check' && grid.getColumn(index.fieldIndex).renderer.editable) || grid.getColumn(index.fieldIndex).button === 'action')) {
          let grid1Val = grid.getValues(index.itemIndex);

          if (grid1Val != null) {
            setSelectData({
              itemLvNm: grid1Val.ITEM_LV_NM,
              itemClassMstId: grid1Val.ID,
              itemClassVal: grid1Val.ITEM_CLASS_VAL,
              decrip: grid1Val.DESCRIP,
              param: 'insert'
            });

            loadItemGroup(grid1Val.ID);
          }
        }
      }
    };
  }

  function setOptionsGridItemGroup() {
    setVisibleProps(gridItemGroup, true, true, true);

    gridItemGroup.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridItemGroup.gridView.columnByName('ITEM_GRP').buttonVisibility = 'always';

    gridItemGroup.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "ITEM_GRP") {
        openPopupItemClassificationNew2('update');
      }
    }
  }

  function onSubmit() {
    loadClassification();
  }

  function onSubmit2() {
    loadItemGroup(selectData.itemClassMstId);
  }

  function refresh() {
    setComboList();

    reset();

    gridClass.dataProvider.clearRows();
    gridItemGroup.dataProvider.clearRows();
  }

  async function setCombobox() {
    let dataArr = await getCodeList('ITEM_SCOPE');
    let filteringArr = dataArr.filter(code => code.GROUP == 'ITEM_SCOPE').map(data => ({ value: data.ID, label: data.CD_NM }));

    setItemLvOption(filteringArr);
  }

  function setComboList() {
    let formData = new FormData();
    formData.append('CONF_KEY', '004');
    formData.append('VIEW_ID', 'POP_UI_CM_03_03');
    formData.append('ITEM_LV_ID', '');
    formData.append('ITEM_CLASS', '');
    formData.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_03_POP_01_Q',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          for (var i = 0, len = dataArr.length; i < len; i++) {
            var row = dataArr[i];
            if (row !== null) {
              gridClass.gridView.setColumnProperty(
                row.ATTR_NM,
                "lookupData",
                {
                  value: "ID",
                  label: "CONVN_NM",
                  list: dataArr
                }
              );
            }
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openPopupItemClass() {
    if (getValues('itemLv') !== '') {
      setPopupItemClass(true);
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5014'), { close: false });
    }
  }

  function onSetItemClss(gridRow) {
    setValue('itemClassVal', gridRow.ITEM_CLASS_VAL);
  }

  function openPopupItemClassificationNew1() {
    setPopupItemClassificationNew1(true);
  }

  function openPopupItemClassificationNew2(param) {
    gridClass.gridView.commit(true);
  
    let grid1Val = gridClass.gridView.getValues(gridClass.gridView.getCurrent().itemIndex);
    let grid2Val = gridItemGroup.gridView.getValues(gridItemGroup.gridView.getCurrent().itemIndex);
    let itemClassDtlId = '';
    let itemGrp = '';
    let itemGrpDescrip = '';
    let seq = '';
    let actvYn = [''];

    if (param === 'update') {
      itemClassDtlId = grid2Val.ID;
      itemGrp = grid2Val.ITEM_GRP;
      itemGrpDescrip = grid2Val.ITEM_GRP_DESCRIP;
      seq = grid2Val.SEQ
      actvYn = ['', 'Y'];
    }

    setSelectData({
      itemLvNm: grid1Val.ITEM_LV_NM,
      itemClassMstId: grid1Val.ID,
      itemClassVal: grid1Val.ITEM_CLASS_VAL,
      decrip: grid1Val.DESCRIP,
      itemClassDtlId: itemClassDtlId,
      itemGrp: itemGrp,
      itemGrpDescrip: itemGrpDescrip,
      seq: seq,
      actvYn: actvYn,
      param: param
    });

    setPopupItemClassificationNew2(true);
  }

  function loadClassification() {
    let formData = new FormData();

    formData.append('ITEM_LV', getValues('itemLv'));
    formData.append('CLSS', getValues('itemClassVal'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_03_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridClass.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveClassification() {
    gridClass.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5148'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridClass.dataProvider.getAllStateRows().created,
          gridClass.dataProvider.getAllStateRows().updated,
          gridClass.dataProvider.getAllStateRows().deleted,
          gridClass.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridClass.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_13_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_13_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadClassification();
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

  function deleteClassification() {
    let deletes = gridClass.gridView.getCheckedItems();
    let deleteRows = [];

    deletes.forEach(function (row) {
      let rowData = gridClass.dataProvider.getJsonRow(row);

      deleteRows.push(rowData);
    });

    if (deleteRows.length > 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5130'), function (answer) {
        if (answer) {
          let formData = new FormData();
  
          formData.append('delete', JSON.stringify(deleteRows));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_CM_03_S6',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_S6_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadClassification();
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    } else {
      showMessage(transLangKey('DELETE'), 'No row(s) checked to Delete', { close: false });
    }
  }

  function loadItemGroup(itemClassMstId) {
    let formData = new FormData();

    formData.append('ITEM_CLASS_MST_ID', itemClassMstId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_03_Q2',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridItemGroup.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveItemGroup() {
    gridItemGroup.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridItemGroup.dataProvider.getAllStateRows().created,
          gridItemGroup.dataProvider.getAllStateRows().updated,
          gridItemGroup.dataProvider.getAllStateRows().deleted,
          gridItemGroup.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridItemGroup.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();

          formData.append('WRK_TYPE', "SAVE");
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_CM_03_S3',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_S3_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadItemGroup(selectData.itemClassMstId);
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  function deleteItemGroup() {
    let deletes = gridItemGroup.gridView.getCheckedItems();
    let deleteRows = [];

    deletes.forEach(function (row) {
      let rowData = gridItemGroup.dataProvider.getJsonRow(row);

      deleteRows.push(rowData);
    });

    if (deleteRows.length > 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5130'), function (answer) {
        if (answer) {
          let formData = new FormData();

          formData.append('WRK_TYPE', "DELETE");
          formData.append('ID', JSON.stringify(deleteRows));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_CM_03_S3',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_S3_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadItemGroup(selectData.itemClassMstId);
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    } else {
      showMessage(transLangKey('DELETE'), 'No row(s) checked to Delete', { close: false });
    }
  }

  function batchCreateItemGroup() {
    gridItemGroup.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5111'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('all', JSON.stringify(gridItemGroup.dataProvider.getJsonRows(0, -1)));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_CM_03_BATCH',
          data: formData
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_03_BATCH_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            if (res.status === gHttpStatus.SUCCESS) {
              loadItemGroup(selectData.itemClassMstId);
            }
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} options={itemLvOption} />
            <InputField type='action' name='itemClassVal' label={transLangKey('ITEM_CLASS_VAL')} title={transLangKey('SEARCH')} onClick={() => { openPopupItemClass() }} control={control}>
              <Icon.Search />
            </InputField>
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "50%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridClass' options={exportExceloptions} />
              {/*<GridExcelImportButton type='icon' grid='gridClass' />*/}
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupItemClassificationNew1() }}></GridAddRowButton>
              <GridDeleteRowButton type="icon" onClick={() => { deleteClassification() }}></GridDeleteRowButton>
              <GridSaveButton type="icon" onClick={() => { saveClassification() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: 'calc(100% - 53px)' }}>
            <BaseGrid id='gridClass' items={gridClassColumns} />
          </Box>
        </Box>

        <Box style={{ height: "50%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { batchCreateItemGroup() }}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupItemClassificationNew2('insert') }}></GridAddRowButton>
              <GridDeleteRowButton type="icon" grid="gridItemGroup" onClick={() => { deleteItemGroup() }}></GridDeleteRowButton>
              <GridSaveButton type="icon" onClick={() => { saveItemGroup() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: 'calc(100% - 53px)' }}>
            <BaseGrid id='gridItemGroup' items={gridItemGroupColumns} />
          </Box>
        </Box>
      </ContentInner>
      {itemClassPopupOpen && (<PopItemClass open={itemClassPopupOpen} onClose={() => { setPopupItemClass(false); }} confirm={onSetItemClss} data={getValues('itemLv')}></PopItemClass>)}
      {itemClassificationNew1PopupOpen && (<PopItemClassificationNew1 open={itemClassificationNew1PopupOpen} onClose={() => { setPopupItemClassificationNew1(false); }} data={itemLvOption} confirm={onSubmit}></PopItemClassificationNew1>)}
      {itemClassificationNew2PopupOpen && (<PopItemClassificationNew2 open={itemClassificationNew2PopupOpen} onClose={() => { setPopupItemClassificationNew2(false); }} data={selectData} confirm={onSubmit2}></PopItemClassificationNew2>)}
    </>
  )
}

export default ItemClassification;
