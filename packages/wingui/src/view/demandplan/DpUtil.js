import { zAxios, } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

const excelExportOptions = {
  lookupDisplay: true,
  allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  //importExceptFields: { 0: "id" },
};

const labelColors = [
  "#a7d915",
  "#f89df2",
  "#ebef7c",
  "#ff9c52",
  "#D8E404",
  "#fada66",
  "#89c0f1",
  "#ef4356",
  "#26BDE2",
  "#fca40b",
  "#f15093",
  "#A08BDE",
  "#58c460",
  "#0A97D9",
  "#f5cbea",
  "#8ae5f3",
  "#81a0fd",
  "#909ab7",
  "#c5c5f5",
  "#D1DE3F",
  "#E8D9B5",
  "#eccb09",
  "#94AE4A",
  "#dc9def",
  "#e5bda4",
  "#7556f5",
  "#20afcd",
  "#ff666a",
  "#489bec",
  "#f1b000",
  "#69ec69",
  "#f18dd3",
  "#f6d929",
  "#be5ee8",
  "#cdec3b",

];

const makeCrossTabFieldsAndColumns = (grid, fields, columns, initLayout, direction, columnPrefix, columnPostfix, resultData, valueNumberFormat) => {
  let layout = Object.assign([], initLayout);
  //init
  grid.dataProvider.setFields(fields);
  grid.gridView.setColumns(columns);

  if (resultData == null || resultData.length == 0) {
    return;
  }
  let dataFieldNames = [];
  dataFieldNames = Object.keys(resultData[0]);

  let dynamicNames = [];
  let names = [];
  for (let dataFieldIdx = 0, dataFieldLen = dataFieldNames.length; dataFieldIdx < dataFieldLen; dataFieldIdx++) {
    let fieldName = dataFieldNames[dataFieldIdx];

    if (columnPostfix === null) {
      if (fieldName.startsWith(columnPrefix)) {
        dynamicNames.push(fieldName);
      }
    } else {
      if (fieldName.startsWith(columnPrefix) && fieldName.indexOf(columnPostfix) > -1) {
        dynamicNames.push(fieldName);
        fieldName = fieldName.split(columnPostfix)[0].replace(columnPrefix, "");
        names.push(fieldName);
      }
    }
  }

  dynamicNames.sort(function (a, b) {
    let ac = a.replace(columnPrefix, "").replace(columnPostfix, "");
    let bc = b.replace(columnPrefix, "").replace(columnPostfix, "");
    if (ac > bc) {
      return 1;
    } else if (ac < bc) {
      return -1;
    } else {
      return 0;
    }
  });

  let groupNameArray = [];
  let groupCols = [];
  dynamicNames.map(function (header) {
    let headerText = transLangKey(header.replace(columnPrefix, ""));
    grid.dataProvider.addField({
      fieldName: header,
      dataType: "number",
      textAlignment: "rg-far",
    });

    let groupName;
    groupName = header.split(columnPostfix)[0].replace(columnPrefix, "");
    if (groupNameArray.indexOf(groupName) === -1) {
      groupNameArray.push(groupName);
    }

    groupCols.push({
      name: header,
      fieldName: header,
      header: {
        text: headerText,
      },
      width: 80,
      editable: false,
      styleName: "right-column",
      numberFormat: valueNumberFormat,
    });

    layout.push(header);
  });

  grid.gridView.setColumnLayout([]); //초기화
  grid.gridView.setColumns(columns.concat(groupCols));
  grid.gridView.setColumnLayout(layout);
}


const saveJson = (targetGrid, procedureName, afterFun, additionlParam) => {
  targetGrid.gridView.commit(true);
  showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
    if (answer) {
      let changes = [];
      changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);
      let changeRowData = [];
      changes.forEach(function (row) {
        let data = targetGrid.dataProvider.getJsonRow(row);
        changeRowData.push(data);
      });
      if (changeRowData.length === 0) {
        showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
      } else {
        let formData = new FormData();
        const changeKeys = Object.keys(changeRowData[0]).filter((key) => (typeof(changeRowData[0][key]) === "object"));
        let changeData = [];
        for (let i=0, n=changeRowData.length; i<n; i++) {
          changeData = changeRowData[i];
          for(let j=0, m=changeKeys.length; j<m; j++) {
            changeRowData[i][changeKeys[j]] = new Date(changeData[changeKeys[j]]).format("yyyy-MM-ddT00:00:00")
          }
        }
        formData.append('changes', JSON.stringify(changeRowData));
        formData.append('procedure', procedureName);
        formData.append('P_USER_ID', authentication.getUsername());

        if (!isEmpty(additionlParam)) {
          var keys = Object.keys(additionlParam); 
          for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            //console.log("key : " + key + ", value : " + additionlParam[key])
            formData.append(key, additionlParam[key]);
          }
        }

        zAxios({
          method: "post",
          headers: { "content-type": "application/json" },
          url: baseURI() + "common/json-save",
          data: formData,
        })
          .then((response) => { 
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                const resultMSG = rsData.IM_DATA[procedureName+"_P_RT_MSG"];
                console.log("json save result===>",resultMSG)
                resultMSG === "MSG_0001" ? afterFun() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
              } else {
                  showMessage(transLangKey("MSG_CONFIRM"), response.statusText);
              }
          })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
          });
      }
    }
  });
};

const loadReferDropDown = (grid, dataArr, columns) => {
  /* columns
          [ {cd: "column1", nm: "display field name1"},
            {cd: "column2", nm: "display field name2"},
          ]
     (ex) column1: company, column2: department
  * */
  let keys = new Array(columns.length).fill(0).map(() => []);
  let stringKeys = new Array(columns.length).fill(0).map(() => []);
  let values = new Array(columns.length).fill(0).map(() => []);
  let lookups = [];
  let property = [];
  for (let i = 0, n = dataArr.length; i < n; i++) {
    let item = dataArr[i];
    let transColNames = [];
    let keyArr = columns.map((col) => (item[col.cd]));
    for (let j = columns.length - 1; j >= 0; j--) {
      transColNames[j] = transLangKey(item[columns[j].nm]);
      let rs = (j === 0 ? keyArr.slice(0, j + 1).flat() : keyArr.slice(0, j + 1));
      if (stringKeys[j] !== undefined && !stringKeys[j].includes(rs.toString())) {
        keys[j].push(rs);
        stringKeys[j].push(rs.toString());
        values[j].push(transColNames[j]);
      }
    }
  }
  // console.log("stringKeys", stringKeys, "keys", keys, "values", values);
  for (let i = 0, n = keys.length; i < n; i++) {
    lookups.push({
      id: columns[i].cd,
      levels: i + 1,
      keys: keys[i],
      values: values[i]
    });
    property.push(columns[i].cd);
    grid.gridView.setColumnProperty(columns[i].cd, "lookupSourceId", columns[i].cd);
    grid.gridView.setColumnProperty(columns[i].cd, "lookupKeyFields", property);
  }
  grid.gridView.setLookups(lookups);
}

const loadOption = (useDataserver, pName, params, optionValueCol, optionLabelCol, allFlag, transLangLabel) => {
  let objArray = [];
  let keyArray = [];
  let url;
  let data;

  if (useDataserver) {
    url = baseURI() + "engine/dp/" + pName;
    data = new URLSearchParams();
    for (let key in params) {
      data.append(key, params[key]);
    }
  } else {
    url = baseURI() + "common/combos";
    data = Object.assign(params, JSON.stringify(params));
    data['PROCEDURE_NAME'] = pName;
  }

  return zAxios({
    method: "post",
    headers: getHeaders({}, true),
    url: url,
    data: data,
  }).then((response) => {
    if (useDataserver) {
      if (response.data.RESULT_SUCCESS && response.data.RESULT_DATA.length > 0) {
        return response.data.RESULT_DATA;
      }
    } else {
      if (response.status === gHttpStatus.SUCCESS && response.data.length > 0) {
        return response.data;
      }
    }
    return []
  }).catch((err) => {
    console.warn(err);
    return []
  }).then((resultData) => {
    if (allFlag) {
      objArray.push({ value: "ALL", label: transLangKey("ALL"), data: {} });
      keyArray.push("ALL");
    }
    for (let i = 0, len = resultData.length; i < len; i++) {
      let row = resultData[i];
      if (row !== null) {
        const arrVal = (row[optionValueCol] === "" || row[optionValueCol] === null) ? "ALL" : row[optionValueCol];
        if (!keyArray.includes(arrVal)) {
          keyArray.push(arrVal);
          objArray.push({
            value: arrVal,
            label: transLangLabel ? transLangKey(row[optionLabelCol]) : row[optionLabelCol],
            data: row
          });
        }
      }
    }
    // console.log(pName, " loadOption result==>", objArray);

    return objArray;
  });
};

const isEmptyArray = (array) => {
  return typeof array === "undefined" || array == null || array.length == 0
}

const isEmpty = (value) => {
  return typeof value === "undefined" || value == null || value === ""
}


  const getYYYYMMDD = (date) => {
      let year = date.getFullYear().toString();

      let month = date.getMonth() + 1;
      month = month < 10 ? '0' + month.toString() : month.toString();

      let day = date.getDate();
      day = day < 10 ? '0' + day.toString() : day.toString();

      return year + month + day ;
  }

const newRowEditCellStyle = (grid, dataCell) => {
  let ret = {};
  const rowState = dataCell.item.rowState;
  if (rowState === "created" || rowState === "appending" || rowState === "inserting") {
    ret.editable = true;
    ret.styleName = "rg-center editable-text-column";
  } else {
    ret.editable = false;
    ret.styleName = "rg-center text-column";
  }
  return ret;
}

function nvl(value, defaultValue = "") {
    if (value === undefined) return defaultValue;
    if (value) return value;
    else return defaultValue;
}

const dimensionItems = [...Array(40).keys()].map(key => (key < 9 ? "0":"")+(key + 1).toString()).map((id)=> (
  { name: "DIMENSION_"+id, dataType: "string", headerText: "DIMENSION_"+id, visible: false,
    editable: false, width: "120", title: "DIMENSION_"+id, type: "string", merge: true , styleName: "white-row"}
));

export {
  labelColors, 
  newRowEditCellStyle,
  excelExportOptions,
  makeCrossTabFieldsAndColumns,
  saveJson,
  loadReferDropDown,
  loadOption,
  isEmptyArray,
  isEmpty,
  nvl,
  getYYYYMMDD,
  dimensionItems

}