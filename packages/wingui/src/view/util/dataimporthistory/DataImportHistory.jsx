import React, { useEffect, useState } from "react";
import {
  BaseGrid,
  ContentInner,
  GridCnt, InputField,
  ResultArea,
  SearchArea,
  SearchRow,
  StatusArea, useViewStore, zAxios
} from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { useForm } from 'react-hook-form';

const dataImportHistoryGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "jobModule", dataType: "text", headerText: "LABEL_JOB_MODULE", visible: true, editable: false, width: 130, autoFilter: true, textAlignment: 'center' },
  { name: "jobTable", dataType: "text", headerText: "LABEL_JOB_TABLE", visible: true, editable: false, width: 350, autoFilter: true, textAlignment: 'center' },
  { name: "importOption", dataType: "text", headerText: "GRID_HEADER_TITLE_TXT_IMPORT_OPTION", visible: true, editable: false, width: 150, textAlignment: 'center' },
  { name: "separatorOption", dataType: "text", headerText: "GRID_HEADER_TITLE_TXT_SEPARATOR", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "successSum", dataType: "number", headerText: "GRID_HEADER_TITLE_TXT_SUCCESS", visible: true, editable: false, width: 120 },
  { name: "failSum", dataType: "number", headerText: "GRID_HEADER_TITLE_TXT_FAIL", visible: true, editable: false, width: 120, styleName: 'error-column' },
  { name: "startDttm", dataType: "datetime", headerText: "GRID_HEADER_TITLE_TXT_START", visible: true, editable: false, width: 180 },
  { name: "endDttm", dataType: "datetime", headerText: "GRID_HEADER_TITLE_TXT_END", visible: true, editable: false, width: 180 },
  { name: "completeYn", dataType: "text", headerText: "GRID_HEADER_TITLE_TXT_COMPLETE", visible: true, editable: false, width: 80, textAlignment: 'center' },
  { name: "errorFileName", dataType: "text", headerText: "GRID_HEADER_TITLE_TXT_ERROR_LOG", visible: true, editable: false, width: 350, styleName: 'link-column' },
  { name: "errorFileStorageId", dataType: "text", headerText: "", visible: false, editable: false, width: 0 },
  { name: "jobDescription", dataType: "text", headerText: "GRID_HEADER_TITLE_TXT_JOB_DESCRIPTION", visible: true, editable: false, width: 350 },
];

function DataImportHistory() {
  const { control, getValues, setValue } = useForm({
    defaultValues: { jobModule: '', jobTable: '' }
  });
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [dataImportHistoryGrid, setDataImportHistoryGrid] = useState(null);
  const [moduleList, setModuleList] = useState([]);
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    zAxios
      .get(baseURI() + 'data/bulk/schema/modules')
      .then(function (response) {
        const data = response.data.map(data => ({ label: data, value: data }));
        data.unshift({ label: transLangKey('ALL'), value: 'ALL' });
        setModuleList(data);
        setValue('jobModule', data[0].value);
      })
      .catch(function (e) {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    if (dataImportHistoryGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      console.log()
      setGridOptions(dataImportHistoryGrid.gridView);

      loadData();
    }
  }, [dataImportHistoryGrid]);

  useEffect(() => {
    setDataImportHistoryGrid(getViewInfo(vom.active, 'dataImportHistoryGrid'));
  }, [viewData]);

  function setGridOptions(gridView) {
    if (gridView.id === 'dataImportHistoryGrid') {      
      const importOption = gridView.columnByName('importOption');
      importOption.lookupDisplay = true;
      importOption.lookupData = {
        value: 'value',
        label: 'label',
        list: [
          { label: 'Insert', value: '0' },
          { label: 'Update', value: '1' },
          { label: 'Merge Insert', value: '2' },
          { label: 'Delete and Insert', value: '3' }
        ]
      };
      gridView.setColumn(importOption);
      const separatorOption = gridView.columnByName('separatorOption');
      separatorOption.lookupDisplay = true;
      separatorOption.lookupData = {
        value: 'value',
        label: 'label',
        list: [
          { label: 'CSV', value: '0' },
          { label: 'TSV', value: '1' }
        ]
      };
      gridView.setColumn(separatorOption);
      gridView.onCellClicked = function (grid, clickData) {

        if (clickData.column === 'errorFileName') {
          const value = grid.getValue(clickData.itemIndex, clickData.column);
          if (value) {
            const errorFileStorageId = grid.getValue(clickData.itemIndex, 'errorFileStorageId');
            // zAxios
            //   .get(baseURI() + 'file-storage/file', {
            //     params: {
            //       'ID': errorFileStorageId
            //     },
            //     responseType: 'blob',
            //     waitOn: false
            //   })
            //   .then(function (response) {
            //   })
            //   .catch(function (e) {
            //     console.error(e);
            //   })
            //   .then(function () {
            //   });
            
          }          
        }
      }
    }
  }
  
  function loadData() {
    const { gridView, dataProvider } = dataImportHistoryGrid;
    gridView.showToast(progressSpinner + 'Load Data...', true);
    zAxios
      .get(baseURI() + 'data/bulk/job/history', {
        params: {
          'JOB_MODULE': getValues('jobModule') === 'ALL' ? '' : getValues('jobModule'),
          'JOB_TABLE': getValues('jobTable'),
          'JOB_STATUS': 0,
          'JOB_ERROR': 0
        }
      })
      .then(function (response) {
        dataProvider.fillJsonData(response.data);
      })
      .catch(function (e) {
        console.error(e);
      })
      .then(function () {
        gridView.hideToast();
      });
  }
  
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadData();
    }
  }
  
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField type="select" control={control} options={moduleList} label={transLangKey('LABEL_JOB_MODULE')} name="jobModule" />
          <InputField type="text" control={control} label={transLangKey('LABEL_JOB_TABLE')} name="jobTable" onKeyPress={(e) => handleKeyPress(e)}/>
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <BaseGrid items={dataImportHistoryGridItems} id="dataImportHistoryGrid" className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="dataImportHistoryGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </ContentInner>
  );
}

export default DataImportHistory;
