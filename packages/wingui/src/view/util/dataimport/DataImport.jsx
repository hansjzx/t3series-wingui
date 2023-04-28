import React, { useState, useEffect, useRef, useCallback } from "react";
import { Grid, Card, CardContent, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Chip, Avatar, Divider, Typography, Backdrop, Container
} from "@mui/material";
import { useForm } from 'react-hook-form';
import AccordionComponent from "@zionex/wingui-core/src/component/Accordion";
import { CommonButton, ContentInner, InputField, ResultArea, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import "./dataimport.css";
import TableRowsIcon from '@mui/icons-material/TableRows';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import FileUploader from "@zionex/wingui-core/src/component/input/FileUploader";
import { showMessage } from "@zionex/wingui-core/src/utils/common";

const accordionStyle = {
  borderRadius: '0 !important',
  '& .MuiAccordionSummary-root': {
    minHeight: '36px',
    bgcolor: 'rgb(0 0 0 / 5%) !important'
  },
  '& .MuiAccordionSummary-content': {
    margin: 0
  },
  '& .MuiAccordionDetails-root': {
    padding: '10px 15px'
  }
}

const exportOptions1 = [
  { label: transLangKey('WITHOUT_DATA'), value: '0' },
  { label: transLangKey('WITH_DATA'), value: '1' }
];
const exportOptions2 = [
  { label: 'CSV', value: '0' },
  { label: 'TSV', value: '1' }
];
const importOptions1 = [
  { label: 'Insert', value: '0' },
  { label: 'Update', value: '1' },
  { label: 'Merge Insert', value: '2' },
  { label: 'Delete and Insert', value: '3' }
];


function DataImport() {
  const { control, getValues, setValue, watch, resetField } = useForm({
    defaultValues: {
      module: '',
      exportOption1: '0',
      exportOption2: '0',
      importOption1: '0',
      importOption2: '0'
    }
  });
  const [moduleList, setModuleList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  const [importFiles, setImportFiles] = useState([]);
  const fileUploaderRef = useRef(null);
  
  useEffect(() => {
    zAxios
      .get(baseURI() + 'data/bulk/schema/modules')
      .then(function (response) {
        const data = response.data.map(data => ({ label: data, value: data }));
        setModuleList(data);
        setValue('module', data[0].value);
      })
      .catch(function (e) {
        console.error(e);
      });
  }, []);
  
  useEffect(() => {
    loadTableTree();
    clear(null);
  }, [watch('module')]);
  
  function clear(table) {
    fileUploaderRef.current.clearFiles();
    setImportFiles([]);
    resetField('exportOption1');
    resetField('exportOption2');
    resetField('importOption1');
    resetField('importOption2');
    setCurrentTable(table);
  }
  
  function loadTableTree() {
    zAxios
      .get(baseURI() + 'data/bulk/schema/tables', {
        params: {
          'JOB_MODULE': getValues('module')
        }
      })
      .then(function (response) {
        setTableData(response.data ? response.data : []);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  
  function setTableIconBgColor(table) {
    if (!table.importable) {
      return '#d17474';
    } else if (table.imported) {
      return '#74d174';
    } else if (table.essential) {
      return 'red';
    } else {
      return '#b2b2b2';
    }
  }
  
  function setTableIcon(table) {
    if (!table.importable) {
      return 'fa-lock';
    } else if (table.imported) {
      return 'fa-check';
    } else if (table.essential) {
      return 'fa-minus';
    } else {
      return 'fa-minus';
    }
  }
  
  function loadTableStatus(table) {
    zAxios
      .get(baseURI() + 'data/bulk/table/status', {
        params: {
          'JOB_TABLE': table.table
        },
        waitOn: false
      })
      .then(function (response) {
        const tableStatus = response.data;
        table['currentCount'] = Intl.NumberFormat().format(tableStatus.count);
        table['currentStatus'] = tableStatus.enable ? 'Idle' : 'Running';
        clear(table);
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  
  function setTableTree() {
    return (
      <Box sx={{ mt: '20px !important' }}>
        {
          tableData.map((tableGroup, tableGroupIndex) => {
            const importedItem = tableGroup.find(tableItem => tableItem.imported);
            const notImportedStyle = { minHeight: '36px', backgroundColor: '#fedede !important', color: '#bf1414' };
            const style = importedItem ? accordionStyle : { ...accordionStyle,  '& .MuiAccordionSummary-root': notImportedStyle };
            return (
              <AccordionComponent title={`Level ${tableGroupIndex + 1}`} style={style} key={tableGroupIndex} defaultExpanded>
                <List sx={{ p: '0 !important' }}>
                  {
                    tableGroup.map((table, index) => {
                      const borderBottom = (tableGroup.length - 1 === index) ? 'none' : '1px solid rgba(0, 0, 0, 0.125)';
                      const fontWeight = (currentTable?.table === table.table) ? 'bold' : 'normal';
                      const bgcolor = (currentTable?.table === table.table) ? 'rgba(0, 0, 0, 0.04)' : 'unset';
                      return (
                        <ListItemButton key={table.table} sx={{ p: '0.1rem 0.6rem !important', borderBottom, bgcolor }} onClick={() => loadTableStatus(table)}>
                          <ListItemIcon sx={{ minWidth: '26px' }}>
                            <Avatar sx={{ bgcolor: setTableIconBgColor(table), width: '20px', height: '20px', fontSize: '1rem' }}>
                              <i className={`fa ${setTableIcon(table)}`} style={{ fontSize: '14px' }}></i>
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText sx={{ width: '40%', '& .MuiTypography-root': { fontWeight } }} primary={transLangKey(table.table)}/>
                          <Chip sx={{ height: '20px', bgcolor: '#dce8ff', color: 'blue', fontWeight }} color="info" label={table.dataCount}/>
                        </ListItemButton>
                      )
                    })
                  }
                </List>
              </AccordionComponent>
            );
          })
        }
      </Box>
    );
  }
  
  function handleFileUploaderChange(files) {
    setImportFiles(files);
  }
  
  function exportExcel() {
    const module = '?JOB_MODULE=' + getValues('module'),
      table = '&JOB_TABLE=' + currentTable.table,
      option1 = '&EXPORT_OPTION=' + getValues('exportOption1'),
      option2 = '&SEPARATOR_OPTION=' + getValues('exportOption2');
    const url = `${baseURI()}data/bulk/export${module}${table}${option1}${option2}`;
    zAxios({
      fromPopup: true,
      method: "GET",
      url,
      responseType: 'blob'
    })
      .then(function (response) {
        let fileName = decodeURI(response.headers["content-disposition"].split("filename=")[1]);
        fileName = fileName.replaceAll("\"", '')
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(function (e) {
        console.error(e); 
      });
  }
  
  function importExcel() {
    if (importFiles.length < 1) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('선택된 파일이 없습니다.'), { close: false });
      return;
    }

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        importFiles.forEach(file => {
          formData.append('FILES', file);
        });
        formData.append('JOB_MODULE', getValues('module'));
        formData.append('JOB_TABLE', currentTable.table);
        formData.append('IMPORT_OPTION', getValues('importOption1'));
        formData.append('SEPARATOR_OPTION', getValues('importOption2'));
        formData.append('JOB_LEVEL', currentTable.level);
        formData.append('JOB_STEP', currentTable.step);
        formData.append('DELETE_INCLUDE', currentTable.lowLevelDeleteInclude);

        zAxios.post(baseURI() + 'data/bulk/import/files',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
          .then(function (response) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('ALERT_MSG_SAVE_AND_IMPORT'), { close: false }, function (answer) {
              if (answer) {
                loadTableTree();
                loadTableStatus(currentTable);
              }
            });
          }).catch(function (response) {
          showMessage('Error', response.data.message, { close: false });
        }).then(function () {
        });
      }
    });
  }
  
  const convertImportOption = useCallback(() =>
      watch('importOption2') === '0' ? ['.csv'] : ['.tsv'],
    [watch('importOption2')]);

  const importDisabled = useCallback(() => {
    if (!currentTable) {
      return false;
    } else {
      return !currentTable.importable || !currentTable.enable;
    }
  },
    [currentTable]);
  
  function setTableStatus() {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 10 }}>
          <TableRowsIcon />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', pl: 4 }}>{transLangKey('LABEL_TABLE_STATUS')} </Typography>
        </Box>
        <Box sx={{ pl: 15, '& > div:not(:last-of-type)': { mb: 5 } }}>
          <Box>
            <span style={{ fontWeight: 'bold' }}>{transLangKey('LABEL_TABLE_NAME')} </span>
            <span>{currentTable?.table}</span>
          </Box>
          <Box>
            <span style={{ fontWeight: 'bold' }}>{transLangKey('LABEL_DATA_COUNT')} </span>
            <span>{currentTable?.currentCount}</span>
          </Box>
          <Box>
            <span style={{ fontWeight: 'bold' }}>{transLangKey('LABEL_IMPORT_JOB_STATUS')} </span>
            <span>{currentTable?.currentStatus}</span>
          </Box>
        </Box>
      </>
    );
  }

  function setTableDetails() {
    return (
      <>
        <Backdrop sx={{ position: 'absolute', zIndex: 2, backdropFilter: 'blur(3px)' }} open={!currentTable} >
          <span style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>{transLangKey('MSG_SELECT_TABLE')}</span>
        </Backdrop>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
          <Box sx={{ p: 20, pb: 30 }}>
            {setTableStatus()}
          </Box>
          <Divider sx={{ bgcolor: 'unset', opacity: 'unset' }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, pt: 10 }}>
            <Box sx={{ flex: 1, p: 20, position: 'relative' }}>
              {setImportOptions()}
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: 'unset', opacity: 'unset', height: 'auto !important' }} />
            <Box sx={{ flex: 1, p: 20 }}>
              {setExportOptions()}
            </Box>
          </Box>
        </Box>
      </>
    );
  }
  
  function setImportOptions() {
    return (
      <>
        <Backdrop sx={{ position: 'absolute', zIndex: 2 }} open={importDisabled()} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 10 }}>
          <UploadIcon />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', pl: 4 }}>{transLangKey('DATA_IMPORT')}</Typography>
        </Box>
        <Box sx={{ pl: 15 }} className="optionBox">
          <Box className="importOption1">
            <span>{`1. ${transLangKey('SAVE_OPTION')}`}</span>
            <InputField name="importOption1" type="radio" control={control} options={importOptions1} />
          </Box>
          <Box className="importOption2">
            <span>{`2. ${transLangKey('FILE_FORMAT')}`}</span>
            <InputField name="importOption2" type="radio" control={control} options={exportOptions2} />
          </Box>
          <Box className="excelFileImport">
            <span>{`3. ${transLangKey('SAVE_FILE')}`}</span>
            <FileUploader id="xlsToDbFileUploader" ref={fileUploaderRef} dragdropElem={null} accept={convertImportOption()} multiple={currentTable?.multiple} onChange={handleFileUploaderChange}/>
          </Box>
          <CommonButton type="text" style={{ margin: '10px 0px 0px 14px' }} onClick={() => importExcel()}>{transLangKey('EXEC')}</CommonButton>
        </Box>
      </>
    );
  }
  
  function setExportOptions() {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 10 }}>
          <DownloadIcon />
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', pl: 4 }}>{transLangKey('SAVE_DATA')}</Typography>
        </Box>
        <Box sx={{ pl: 15 }} className="optionBox">
          <Box className="exportOption1">
            <span>{`1. ${transLangKey('SAVE_OPTION')}`}</span>
            <InputField name="exportOption1" type="radio" control={control} options={exportOptions1} />
          </Box>
          <Box className="exportOption2">
            <span>{`2. ${transLangKey('FILE_FORMAT')}`}</span>
            <InputField name="exportOption2" type="radio" control={control} options={exportOptions2} />
          </Box>
          <CommonButton type="text" style={{ margin: '10px 0px 0px 14px' }} onClick={() => exportExcel()}>{transLangKey('EXEC')}</CommonButton>
        </Box>        
      </>
    );
  }

  return (
    <ContentInner>
      <ResultArea>
        <Grid container spacing={12} sx={{ height: 1, mt: 0 }}>
          <Grid item sx={{ pb: 10, height: 1 }}>
            <Card sx={{ height: 1, width: '470px' }} variant="outlined">
              <CardContent sx={{ height: 1, overflow: 'auto' }} className="tableTree">
                <InputField type="select" control={control} options={moduleList} label={transLangKey('MODULE_VAL')} name="module" />
                {setTableTree()}
              </CardContent>
            </Card>
          </Grid>
          <Grid item sx={{ pb: 10, flex: 1 }}>
            <Card sx={{ height: 1, position: 'relative' }} variant="outlined">
              <CardContent sx={{ pb: '16px !important', height: 1 }} className="tableDetails">
                <Container maxWidth="xl" sx={{ height: 1 }}>
                  {setTableDetails()}
                </Container>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ResultArea>
    </ContentInner>
  );
}

export default DataImport;
