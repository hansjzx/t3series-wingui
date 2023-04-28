import { zAxios, } from "@zionex/wingui-core/src/common/imports";
import wingui3 from "@wingui/component/grid/gridCustom";


const loadDelegationCntData = (userId) => {
  let param = new URLSearchParams();
  //param.append("DELEGATION_USER_ID", authentication.getUsername());
  param.append("DELEGATION_USER_ID", userId);

  return zAxios({
    method: "post",
    header: { "content-type": "application/json" },
    url: "engine/dp/SRV_GET_UI_DP_DELEGATION_COUNT",
    data: param,
  })
    .then(function (res) {
      let result = res.data.RESULT_DATA;
      return result;
      //        if (data && data.length > 0) {
      //          delegationCnt.current = data[0].DELEGATION_COUNT;
      //        }
    })
    .catch(function (err) {
      console.log(err);
      return []
    });

};


//  const loadPlanTpData = (planTypeCd) => {
//          console.log("@@loadPlanTp in")
//
//      let param = new URLSearchParams();
//      param.append("SP_UI_DP_00_CONF_Q1_01", "DP_PLAN_TYPE");
//      param.append("SP_UI_DP_00_CONF_Q1_02", planTypeCd);
//      param.append("SP_UI_DP_00_CONF_Q1_03", "");
//
//      return zAxios({
//        method: "post",
//        url: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
//        data: param,
//      })
//        .then(function (res) {
//        //if (res.status === gHttpStatus.SUCCESS) {
//          let response = res.data.RESULT_DATA;
//          return res.data.RESULT_DATA;
//        })
//        .catch(function (err) {
//          console.log(err);
//          return []
//        });
//
//    };

//  const loadItemGradeData = () => {
//    let param = new URLSearchParams();
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/SRV_GET_ITEM_GRADE",
//      data: param,
//    })
//      .then(function (res) {
//        let result = res.data.RESULT_DATA;
//        return result;
//      })
//      .catch(function (err) {
//        console.log(err);
//        return [];
//      });
//  };

//  const loadItemCovData =  () => {
//    let param = new URLSearchParams();
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/SRV_GET_ITEM_COV",
//      data: param,
//    })
//      .then(function (res) {
//        let result = res.data.RESULT_DATA;
//        return result;
//      })
//      .catch(function (err) {
//        console.log(err);
//        return []
//      });
//
//  };

const loadVersionData = (plantTp) => {
  let param = new URLSearchParams();
  param.append("PLAN_TYPE", plantTp);

  return zAxios({
    method: "post",
    url: "engine/dp/GetEntryVersions",
    data: param,
  })
    .then(function (res) {
      let result = res.data.RESULT_DATA;
      return result;
    })
    .catch(function (err) {
      console.log(err);
      return []
    });
};

//  const loadBucketData = (mainBucketCd, varBucketCd, fromDate, toDate) => {
//    let param = new URLSearchParams();
//    param.append("MAIN_BUKT_CD", mainBucketCd);
//    param.append("VAR_BUKT_CD", varBucketCd);
//    param.append("FROM_DATE", fromDate);
//    param.append("TO_DATE", toDate);
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/SRV_GET_DP_BUKT",
//      data: param,
//    })
//      .then(function (res) {
//        let result = res.data.RESULT_DATA;
//        return result;
//      })
//      .catch(function (err) {
//        console.log(err);
//        return []
//      });
//  };

//  const loadCurrencyData = (version) => {
//
//    let param = new URLSearchParams();
//    param.append("P_VER_ID", version);
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/SRV_GET_SP_UI_DP_CURRENCY_COMBO",
//      data: param,
//    })
//      .then(function (res) {
//          let result = res.data.RESULT_DATA;
//          return result;
//      })
//      .catch(function (err) {
//        console.log(err);
//        return []
//      });
//  };

const loadAuthTypeData = (userId) => {
  let param = new URLSearchParams();
  param.append("SP_UI_DP_00_EMP_AUTH_TP_Q1_01", userId);
  param.append("SP_UI_DP_00_EMP_AUTH_TP_Q1_02", "UI_DP_95");

  return zAxios({
    method: "post",
    url: "engine/dp/SRV_GET_SP_UI_DP_00_EMP_AUTH_TP_Q1",
    data: param,
  })
    .then(function (res) {
      //setAuthTpData(res.data.RESULT_DATA);
      let result = res.data.RESULT_DATA;
      return result;
    })
    .catch(function (err) {
      console.log(err);
      return []
    });
};

//  const loadOperatorStatusData = (version, userId, authType) => {
//    let param = new URLSearchParams();
//    param.append("AUTH_TYPE", authType);
//    param.append("OPERATOR_ID", userId);
//    param.append("VER_CD", version);
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/GetOperatorStatus",
//      data: param,
//    })
//      .then(function (res) {
//        let statusData = res.data.RESULT_DATA;
//        return statusData
//      })
//      .catch(function (err) {
//        console.log(err);
//        return []
//      });
//  };

//  const loadDisaggRuleData = (authTp) => {
//
//    let param = new URLSearchParams();
//    param.append("AUTH_TP_CD", authTp);
//    param.append("VIEW_ID", "UI_DP_95" );
//    param.append("GRID_ID", "UI_DP_95-RST_CPT_01");
//    param.append("INDEX", 0);
//
//    return zAxios({
//      method: "post",
//      url: "engine/dp/SRV_GET_SP_UI_DP_AUTH_DIS_OPT_COMBO_Q1",
//      data: param,
//    })
//      .then(function (res) {
//        let result = res.data.RESULT_DATA;
//        return result;
//      })
//      .catch(function (err) {
//        console.log(err);
//        return []
//      });
//  };

const loadActiveUserTaskData = (verCd, userId, authType) => {

  let param = new URLSearchParams();
  param.append("TASK_CATEGORY", "ALL");
  param.append("OPERATOR_ID", userId);
  param.append("AUTH_TYPE", authType);
  param.append("VER_CD", verCd);

  return zAxios({
    method: "post",
    header: { "content-type": "application/json" },
    url: "engine/dp/IsActiveUserTask",
    data: param,
  })
    .then(function (res) {
      let result = res.data.RESULT_DATA;
      return result;
    })
    .catch(function (err) {
      console.log(err);
      return [];
    });
};

const loadDimensionData = (viewCd, grpCd, username, gridCd) => {
  if (!viewCd || !grpCd || !username || !gridCd) return;

  let param = new URLSearchParams();
  param.append("UI_ID", viewCd);
  param.append("GRID_ID", gridCd);
  param.append("AUTH_TP", grpCd);
  param.append("USER_ID", username);

  return zAxios({
    method: "post",
    url: "engine/dp/SRV_GET_SP_UI_DP_95_DIM",
    data: param,
  })
    .then(function (res) {
      let result = res.data.RESULT_DATA;
      return result;
    }).catch(function (err) {
      console.log(err);
      return []
    });

};

const loadMeasureData = (viewCd, grpCd, username, gridCd) => {
  if (!viewCd || !grpCd || !username || !gridCd) return;

  let param = new URLSearchParams();
  param.append("UI_ID", viewCd);
  param.append("GRID_ID", gridCd);
  param.append("AUTH_TP", grpCd);
  param.append("USER_ID", username);

  return zAxios({
    method: "post",
    url: "engine/dp/SRV_GET_SP_UI_DP_95_MES",
    data: param,
  })
    .then(function (res) {
      let retData = res.data.RESULT_DATA;
      //grid.gridView.measureData = res.data.RESULT_DATA;
      return retData
    })
    .catch(function (err) {
      console.log(err);
      return [];
    });
};

const loadCrossTabData = (viewCd, grpCd, userName, gridCd) => {
  if (!viewCd || !grpCd || !userName || !gridCd) return;

  let param = {
    "view-cd": viewCd,
    "grp-cd": grpCd || "COMMON",
    username: userName || "",
  };
  return zAxios({
    method: "get",
    url: "system/users/preferences/crosstab-info",
    params: param,
  })
    .then(function (res) {
      let retData = res.data;
      return retData
    })
    .catch(function (err) {
      console.log(err);
      return []
    });
};

const loadPreferenceData = (viewCd, grpCd, userName, gridCd) => {
  if (!viewCd || !userName || !gridCd) return;

  let param = {
    "view-cd": viewCd,
    "grp-cd": grpCd || "COMMON",
    username: userName || "",
  };

  return zAxios({
    method: "get",
    url: "system/users/preferences/pref-info",
    params: param,
  })
    .then(function (res) {
      let retData = res.data;
      return retData;
    })
    .catch(function (err) {
      console.log(err);
      return []
    });
};

function gridDataFillReady(gridView, dataProvider, resultData) {
  wingui3.util.grid.filter.saveFilters(gridView, ["CATEGORY"]);

  let versionInfo = gridView.gridWrap.versionData[0];
  let viewBuck = gridView.gridWrap.BUCKET;
  let totalSummaryInfos = [
    {
      columnName: "TOTAL_SUM",
      summaryType: "sum",
    },
  ];
  let varDate1 = null;
  let varDate2 = null;
  let varBuck1 = null;
  let varBuck2 = null;
  let buck = null;
  let endDate = null;

  /* get start month, and apply grid calendar
   * 0 : SUN
   * 1 : MON
   * */
  let stdWeek = versionInfo["STD_WEEK"];
  let dayOfWeek = 0;
  switch (stdWeek) {
    case "Mon":
      dayOfWeek = 1;
      break;
    case "Sun":
      dayOfWeek = 0;
      break;
  }
  wingui3.util.date.calendar.setFirstDayOfWeek(dayOfWeek);

  if (viewBuck && viewBuck == "PB") {
    varDate1 = versionInfo["VAR_DATE"];
    if (varDate1 && typeof varDate1 == "string") {
      varDate1 = varDate1.substr(0, 10);
      varDate1 = wingui3.util.date.toDate(varDate1, "-");
    }
    varDate2 = versionInfo["VAR_DATE2"];
    if (varDate2 && typeof varDate2 == "string") {
      varDate2 = varDate2.substr(0, 10);
      varDate2 = wingui3.util.date.toDate(varDate2, "-");
    }
    varBuck1 = versionInfo["VAR_BUKT"];
    varBuck2 = versionInfo["VAR_BUKT2"];
  }
  endDate = versionInfo["TO_DATE"];
  if (endDate && typeof endDate == "string") {
    endDate = endDate.substr(0, 10);
    endDate = wingui3.util.date.toDate(endDate, "-");
  }

  buck = versionInfo["BUKT"];

  gridView.gridWrap.initEntry(/\d{4}.\d{2}.\d{2}/, viewBuck, varBuck1, varDate1, varBuck2, varDate2, buck, endDate);
  gridView.gridWrap.addSummaryColumns(null, totalSummaryInfos);

  return resultData;
}

const getEditMeasure=(gridView) => {
    let editMeasures = []
      if (gridView.prefInfo) {
        editMeasures = gridView.prefInfo.filter(function (columnInfo) {
          return columnInfo.gridCd == "RST_CPT_01" && columnInfo.crosstabItemCd == "GROUP-VERTICAL-VALUES" && columnInfo.editMeasureYn;
        }).map(function (columnInfo) { return columnInfo.fldApplyCd });
      }
    return editMeasures;
}

const gridAfterSetData = (gridView, dataProvider, resultData) => {
  if (!resultData || resultData.length == 0) {
    return;
  }

  let measureNames = getRowTotalMeasures(gridView);

  console.log("$$measureNames==>",measureNames)

  if (measureNames && measureNames.length > 0) {
    let groupMeasureName = measureNames[0];
    gridView.gridWrap.addSummaryFooter('CATEGORY', groupMeasureName, measureNames);
  }
  let authType = gridView.gridWrap.AUTH_TP;//getValues("AUTH_TP_ID");
  let selfEditMeasure = measureNames.filter(function (row) {
    return row == authType + "_QTY";
  });

  applyEditMeasureStyle(gridView);
  //let dataProvider = gridView.getDataSource();
  let isComment = gridView.prefInfo.filter(function (row) {
    return row.fldCd == "COMMENT"
  }).map(function (row) {
    return row.editTargetYn
  });

  if (isComment !== undefined && isComment[0] == true && selfEditMeasure.length > 0) {
    //setCommentStyle(gridView);
  }
  setNullValueCellStyle(gridView);
  setDTFUneditableStyle(gridView);
  setBaselineStyle(gridView);

  gridView.setCellStyleCallback((grid, dataCell) => {
        let ret = {};
        let rowIdx =  dataCell.index.dataRow;
        let colName = dataCell.dataColumn.name;
        let dataProvider = grid.getDataSource();
        if(grid.customStyles) {
          const customStyles = grid.customStyles;
          const styleItems = grid.styleItems;
          //cell에 등록된 style 정보를 가져온다.
          let thisStyleInfo=customStyles.get(rowIdx,colName);
          if(thisStyleInfo) {
            const accStyle = thisStyleInfo.accStyle
            for (let styleName of accStyle) {
              if(!styleName)
                continue;
              let prcd=false;
              if(styleItems) {
                const styleItem = styleItems.filter(v=> v.styleName == styleName)
                if(styleItem.length > 0) {
                  let style = styleItem[0].style;
                  ret = {...ret,...style};
                  if(grid.specificStyle && grid.specificStyle[styleName] !==undefined) {
                    if(ret.styleName) {
                      ret.styleName += (" " + grid.specificStyle[styleName])
                    }
                    else {
                      ret.styleName = grid.specificStyle[styleName]
                    }
                    prcd=true;
                  }
                }
              }
              if(prcd == false) {
                if(ret.styleName) {
                  ret.styleName += (" " + styleName)
                }
                else {
                  ret.styleName = styleName
                }
              }
            }
//                  //이후 처리, 값의 변경에 따른 처리
//                  let val = dataProvider.getValue(rowIdx,colName);
//                  if(val == 0) {
//                    console.log('fdsafds')
//                  }
            return ret;
          }
        }
      }
  )
  setMergeCell(gridView);

  gridView.gridWrap.setBucketHeaderText((checkVersionBucket(gridView) == "W"));

  wingui3.util.grid.filter.loadFilters(gridView, ['CATEGORY']);
  wingui3.util.grid.sorter.orderBy(gridView, gridView.dataColumns.filter(function (dataColumn) {
    return dataColumn.fieldName.startsWith('DIMENSION');
  }).map(function (dataColumn) {
    return dataColumn.fieldName;
  }));

  if (isComment !== undefined && isComment[0] == true && selfEditMeasure.length > 0) {
    setCellCommnetButton(gridView, selfEditMeasure);
  }
  preventColumnSort(gridView);
}

const setNullValueToZero = (gridView, data, measures) => { // excel import 쪽에서 처리 
  if (!data || !measures)
    return;

  let validationData = data.map(function (rw) {
    let keys = Object.keys(rw).filter(function (key) {
      return key.includes(",VALUE") && measures.includes(rw["CATEGORY"])
    }).filter(function (key) {
      return rw[key] < 0 || rw[key] === ''
    });
    return keys;
  });

  for (let rowIdx in validationData) {
    let columns = validationData[rowIdx];
    for (let idx = 0; idx < columns.length; idx++) {
      gridView.setValue(rowIdx, columns[idx], 0);
    }
  }
}

function setNullValueCellStyle(gridView) {
  let dataProvider = gridView.getDataSource();
  gridView.beginUpdate();
  try {
    let editMeasures = [];
    if (gridView.prefInfo) {
      editMeasures = gridView.prefInfo.filter(function (columnInfo) {
        return columnInfo.gridCd == gridView.orgId && columnInfo.crosstabItemCd == "GROUP-VERTICAL-VALUES" && columnInfo.editMeasureYn;
      }).map(function (columnInfo) { return columnInfo.fldApplyCd });
    }

    let data = dataProvider.getJsonRows();
    let validationData = data.map(function (rw) {
      let keys = Object.keys(rw).filter(function (key) {
        return key.includes(",VALUE") && editMeasures.includes(rw["CATEGORY"])
      }).filter(function (key) {
        return rw[key] == null
      });
      return keys;
    });
    let rowsIndex = Object.keys(validationData).filter(function (key) {
      return validationData[key].length
    });
    rowsIndex.map(function (Index) {
      if (validationData[Index].length !== 0)
        gridView.setCellStyles(gridView, Index, validationData[Index], 'uneditable');
      return;
    });
  } finally {
    gridView.endUpdate();
  }
}

function setDTFUneditableStyle(gridView) {
  let dataProvider = gridView.getDataSource();
  gridView.beginUpdate();
  try {
    let dateColumnNames = gridView.dataColumns.filter(function (dataColumn) {
      return dataColumn.columnIdOrg == 'DATE';
    }).map(function (dataColumn) {
      return dataColumn.name;
    });
    let unEditableStyle1_Rows = [];//default
    for (let i = 0; i < dataProvider.getRowCount(); i++) {
      unEditableStyle1_Rows.push(i);
    }

    let dtfDate = getDTFdateFormat(gridView);
    if (unEditableStyle1_Rows.length) {
      let unEditableStyle1_Fields = dateColumnNames.filter(function (columnName) {
        return getDateFromString(columnName.replace("DATE_", "").substring(0, 10)) <= dtfDate
      });

      gridView.unSetCellStyles(gridView, unEditableStyle1_Rows, unEditableStyle1_Fields, STYLE_ID_EDIT_MEASURE);
      gridView.setCellStyles(gridView, unEditableStyle1_Rows, unEditableStyle1_Fields, 'uneditable'); //cellStyle in wingui-custom.js
      //console.log("DTF style===>",gridView.customStyles)
    }
  } finally {
    gridView.endUpdate();
  }
}

function setBaselineStyle(gridView) {
  let dataProvider = gridView.getDataSource();
  let dates = dataProvider.getFieldNames().filter(function (col) {
    if (!col.startsWith("DATE_")) {
      return false;
    }
    let colDate = col.replace("DATE_", "").replace(",VALUE", "").substring(0, 10);
    return getDateFromString(colDate) <= new Date();
  })

  let baseColumnName = null;
  if (dates && dates.length) {
    baseColumnName = dates.reduce(function (previous, current) {
      return previous > current ? previous : current;
    });
  }
  if (baseColumnName != null) {
    let baselineColumnProperty = gridView.getColumnProperty(baseColumnName, "header");

    baselineColumnProperty.styleName = gridView.dynamicCSSSelector({ "background": "#87CEFA" });
    baselineColumnProperty.text = baselineColumnProperty.text + " (now)";
    gridView.setColumnProperty(baseColumnName, "header", baselineColumnProperty);
  }
}

function setMergeCell(gridView) {
  if (!gridView.prefInfo)
    return;

  const dimensions = gridView.prefInfo.filter(function (row) {
    return row["dimMeasureTp"] === "DIMENSION" && row["fldActiveYn"] === true && row["gridCd"].includes(gridView.orgId)
  }).map(function (row) {
    return row["fldCd"]
  });

  for (let i = 0, n = dimensions.length; i < n; i++) {
    //gridView.setColumnProperty(dimensions[i], "mergeRule", { criteria : "prevvalues+value"});
    gridView.columnByName(dimensions[i]).mergeRule = { criteria: "prevvalues+value" }
  }
}

function preventColumnSort(gridView) {
  let dateFieldNames = gridView.getColumnNames(true, true).filter(function (columnName) {
    return columnName.includes("DATE_") && columnName.includes("VALUE");
  });
  for (let j in dateFieldNames) {
    let colName = dateFieldNames[j];
    let proxy = gridView.columnByName(colName);
    if (proxy) {
      proxy.sortable = false;
      gridView.setColumn(proxy);
    }
  }
  let proxy = gridView.columnByName("CATEGORY");
  if (proxy) {
    proxy.sortable = false;
    gridView.setColumn(proxy);
  }
}

function setCellCommnetButton(gridView, measureName) {
  let dtfDate = getDTFdateFormat(gridView);
  let dateColNames = gridView.getColumnNames(true, true).filter(function (column) {
    return column.includes("DATE_");
  }).filter(function (fieldName) {
    return getDateFromString(fieldName.replace("DATE_", "").substring(0, 10)) > dtfDate;
  });

  const onCellButtonClicked = function (grid, itemIndex, column) {
    let dataProvider = grid.getDataSource();
    let dataRow = grid.getDataRow(itemIndex);
    let colName = column.fieldName;

    let row = dataProvider.getJsonRow(dataRow)

    let comCol = colName.replace("VALUE", "COMMENT")
    let cmt = row[comCol];
    let dateStr = colName.replace(",VALUE", "");
    dateStr = dateStr.replace("DATE_", "");

    let commentData = { ROW_IDX: dataRow, COL_IDX: dataProvider.getFieldIndex(colName), CM_COL_NAME: comCol, DATE_STR: dateStr, CMT: cmt, VAL_COL_NAME: colName }
    if (gridView.gridWrap.showPopComment)
      gridView.gridWrap.showPopComment(commentData)
  };

  const render_span = {
    flex: 1,
    textAlign: 'right',
    overflow: 'hidden'
  }
  const cmtBtn = {
    "min-height": '16px',
    "min-width": '16px',
    "margin-left": '2px',
    "border": '1px solid #efefef',
    background: 'url(\"' + baseURI() + "images/icons/document.png" + '\") center center no-repeat',
    display: 'none'
  }
  const marker = {
    width: 0,
    height: 0,
    'border-left': '3px solid #0d3773',
    'border-top': '3px solid #0d3773',
    'border-bottom': '3px solid #0d3773',
    'border-right': '3px solid #0d3773',
    position: 'absolute', top: '0px', left: '0px', display: 'block',
    visibility: 'hidden'
  }

  const render_span_class = gridView.dynamicCSSSelector(render_span);
  const cmtBtn_class = gridView.dynamicCSSSelector(cmtBtn)
  const marker_class = gridView.dynamicCSSSelector(marker);

  gridView.registerCustomRenderer('imgbtn_render', {
    initContent: function (parent) {
      let span = this._span = document.createElement("span");
      span.className = render_span
      parent.appendChild(span);

      let cmt_marker = this._cmt_marker = document.createElement("div");
      cmt_marker.className = marker_class
      this._rightOffset = parent.offsetWidth - 2;
      parent.appendChild(cmt_marker);

      parent.appendChild(this._button1 = document.createElement("button"));
      this._button1.className = cmtBtn_class;

      const btn = this._button1;
      $(parent).mouseover(() => { $(btn).css("display", 'inline'); })
      $(parent).mouseout(() => { $(btn).css("display", 'none'); })
    },
    canClick: function () {
      return true;
    },
    clearContent: function (parent) {
      parent.innerHTML = "";
    },
    render: function (grid, model, width, height, info) {
      info = info || {};
      let span = this._span;
      span.textContent = model.value;
      this._value = model.value;

      try {
        let colName = model.dataColumn.name;
        colName = colName.replace('VALUE', 'COMMENT')

        const dataProvider = grid.getDataSource();
        let cmt = dataProvider.getValue(model.index.dataRow, colName)
        if (cmt) {
          this._cmt_marker.style.visibility = 'visible'
          this._cmt_marker.style.left = (this._cmt_marker.parentElement.offsetWidth - 6) + 'px'
        }
        else {
          this._cmt_marker.style.visibility = 'hidden'
        }
      }
      catch (e) {
      }
    },
    click: function (event) {
      let grid = this.grid.handler;
      let index = this.index.toProxy();
      let column = this.index.column;

      event.preventDefault;
      if (event.target == this._button1) {
        onCellButtonClicked(grid, index.itemIndex, column)
      }
    }
  });

  for (let i in dateColNames) {
    let dateColumn = dateColNames[i];

    gridView.setColumnProperty(dateColumn, "styleCallback", function (grid, dataCell) {
      let ret = {}
      let val = grid.getValue(dataCell.index.itemIndex, "CATEGORY")
      if (val == measureName) {
        ret.renderer = "imgbtn_render"
      }
      return ret;
    }
    )
  }
}

function getDTFdateFormat(gridView) {
  let dtf = getDTF(gridView);
  if (dtf) {
    let date = getDateFromString(dtf);
    if (dtf == getStartDate(gridView) && getVersionInfo(gridView).BUKT !== 'D') {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }
  return;
}

function getOnlyUpdatedRows(gridView, excelupload = false) {
  console.log("getOnlyUpdatedRows excelupload==>",excelupload)
  let dataProvider = gridView.getDataSource();

  let changeRowData = [];
  let changes = [];

  changes = changes.concat(
    dataProvider.getAllStateRows().created,
    dataProvider.getAllStateRows().updated,
    dataProvider.getAllStateRows().deleted,
    dataProvider.getAllStateRows().createAndDeleted
  );
  if (changes.length === 0)
    return changes

  changes.forEach(function (row) {
    let rowObj = dataProvider.getJsonRow(row);
    rowObj['ROW_STATUS'] = dataProvider.getRowState(row).toUpperCase();
    rowObj['__rowId'] = row;
    changeRowData.push(rowObj);
  });

  //2. get only updatedCell of grid
  //수정된 dataRow
  let updatedRows = dataProvider.getStateRows("updated");
  //수정된 셀 정보
  const updatedRowCells = dataProvider.getUpdatedCells(updatedRows);

  updatedRowCells.map(function (row) {
    let valueField = row.updatedCells.filter(row => row.fieldName.indexOf('VALUE') >= 0);
    for (let i = 0; i < valueField.length; i++) {
      const cell = valueField[i];
      row.updatedCells.push({ fieldName: cell.fieldName.replace("VALUE", "COMMENT") })
    }
  })

  const isUpdatedCell = (rowId, key) => {
    if (excelupload) {
      return true;
    }    

    const row = updatedRowCells.filter(row => row.__rowId == rowId)
    if (row.length > 0) {
      const idx = row[0].updatedCells.findIndex(cellInfo => cellInfo.fieldName == key);
      return idx >= 0
    }
    return false;
  }
  //1. get changes param
  let setMeasureRows = changeRowData;

  //DTF 이전 칼럼 제외한 수정가능한 칼럼만
  let dtfDate = getDTFdateFormat(gridView);
  let dateColNames = gridView.getColumnNames(true, true).filter(function (column) {
    return column.includes("DATE_");
  }).filter(function (fieldName) {
    return getDateFromString(fieldName.replace("DATE_", "").substring(0, 10)) > dtfDate;
  });

  //3. extract updated cells of rows to changes param
  let newParams = new Array();
  for (let i = 0, n = setMeasureRows.length; i < n; i++) {
    let setMeasureRow = new Object();
    let valueExist = false;
    let updatedRow = setMeasureRows[i]
    const rowId = updatedRow.__rowId;

    Object.keys(updatedRow).map(function (key, index) {
      if (!key.includes("DATE") || isUpdatedCell(rowId, key)) {
        if (dateColNames.includes(key)) {
          setMeasureRow[key] = setMeasureRows[i][key];
          valueExist = true
        }
        else {
          if (key !== '__rowId') {
            setMeasureRow[key] = setMeasureRows[i][key];
            valueExist = true
          }
        }
      }
    });

    if (valueExist)
      newParams.push(setMeasureRow);
  }
  return newParams;
}

function checkVersionBucket(gridView) {
  let viewBuck = gridView.gridWrap.BUCKET; //getValues('BUCKET');
  let versionData = gridView.gridWrap.versionData
  if (viewBuck && viewBuck == "PB") {
    let versionInfo = versionData ? versionData[0] : null;
    if (versionInfo != null) {
      return versionInfo['BUKT'];
    } else {
      return 'PW';
    }
  } else {
    return viewBuck;
  }
}

function getRowTotalMeasures(gridView) {
  /***********************************************************************
  **********************************************************************/
  let extrctCode = "MEASURE_CD"
  let MData = []
  let MES_INFO = gridView.gridWrap.MES_INFO;
  if (MES_INFO)
    MES_INFO.map(v => MData.push(v))

  let activatedLevelMeasures = MData.filter(function (row) {
    let measureCode = row[extrctCode];
    if (measureCode == null) {
      return false;
    } else if (row.LEVEL_CD == null) {
      return false;
    } else if (row.ACTV_YN == false) {
      return false;
    }
    return measureCode.slice(-3) == "QTY" && (!measureCode.includes("PR"));
  });

  // 3. get qty of authority type
  let authType = gridView.gridWrap.AUTH_TP;//getValues("AUTH_TP_ID");	
  // 4. if qty of same level is none, set footer by activated level measures (refer 2.)	
  let sameValue = activatedLevelMeasures.filter(function (row) {
    return row.LEVEL_CD == authType;
  }).map(function (row) {
    return row[extrctCode];
  });
  let otherValues = activatedLevelMeasures.map(function (row) {
    return row[extrctCode];
  });
  return sameValue.length > 0 ? sameValue : otherValues;
}

/*
function setCommentStyle(gridView) {
  let dataProvider = gridView.getDataSource();

  gridView.addCellStyle(gridView, "cmtEDITStyle", {
    'editable': true,
    'background': '#ffffd2',
    'figureName': 'leftTop',
    'figureBackground': '#FF0000FF',
    'figureSize': '7'
  });

  gridView.beginUpdate();
  try {

    let cmtColumnNames = gridView.dataColumns.filter(function (dataColumn) {
      return dataColumn.columnIdOrg == 'COMMENT';
    }).map(function (dataColumn) {
      return dataColumn.name;
    });

    if (cmtColumnNames.length < 1) {
      return;
    }

    let gridPsnzInfoDB = TAFFY(gridView.prefInfo);
    let editMeasuresDB = TAFFY(gridPsnzInfoDB().filter({ gridCd: gridView.gridCd, editMeasureYn: true }).get());
    let editMeasures = editMeasuresDB().select('fldApplyCd');
    let targetMeasure;
    for (let i = 0; i < editMeasures.length; i++) {
      targetMeasure = editMeasures[i];
      if (targetMeasure.endsWith("_QTY")) {
        break;
      }
    }

    let dataProvider = gridView.getDataSource();
    let rowCount = dataProvider.getRowCount();
    let rowSearchOptions = { fields: ['CATEGORY'] };
    let measureCount = dataProvider.getDistinctValues("CATEGORY", rowCount).length;

    for (let i = 0; i < rowCount; i = i + measureCount) {

      rowSearchOptions.startIndex = i;
      rowSearchOptions.values = [targetMeasure];
      let targetMeasureIndex = dataProvider.searchDataRow(rowSearchOptions);
      let sourceMeasureData;

      if (targetMeasureIndex >= 0) {
        sourceMeasureData = dataProvider.getJsonRow(targetMeasureIndex);

        for (let j = 0; j < cmtColumnNames.length; j++) {
          let colName = cmtColumnNames[j];
          let cmt = sourceMeasureData[colName]
          if (cmt != null && cmt != "") {
            let targetColName = colName.replace("COMMENT", "VALUE")
            gridView.setCellStyle(gridView, targetMeasureIndex, targetColName, 'cmtEDITStyle');

          }
        }
      }
    }
  } finally {
    gridView.endUpdate();
  }
}
*/


function getDTF(gridView) {
  let versionInfo = getVersionInfo(gridView);
  if (versionInfo) {
    let dateTimeFence = versionInfo['DTF_DATE'];
    return dateTimeFence;
  }
}

const getVersionInfo = (gridView) => {
  if (gridView.gridWrap.versionData)
    return gridView.gridWrap.versionData[0];
}



function getStartDate(gridView) {
  let versionInfo = getVersionInfo(gridView);
  if (versionInfo) {
    let dateTimeFence = versionInfo['FROM_DATE'];
    return dateTimeFence;
  }
}

function applyEditMeasureStyle(gridView) {
  let dataProvider = gridView.getDataSource();
  let dataColumns = gridView.dataColumns;
  let dataColumnsDB = TAFFY(dataColumns);
  let columnIdOrgs = dataColumnsDB().select('columnIdOrg');
  let gridPrefInfoDB = TAFFY(gridView.prefInfo);
  let editMeasuresDB = TAFFY(gridPrefInfoDB().filter({ gridCd: gridView.gridCd, editMeasureYn: true }).get());
  let editTargetsDB = TAFFY(gridPrefInfoDB().filter({ gridCd: gridView.gridCd, editTargetYn: true }).get());
  let editMeasures = editMeasuresDB().select('fldApplyCd');
  let editTargets = editTargetsDB().select('fldCd');

  if (editMeasures !== undefined && editMeasures.length > 0 && editTargets !== undefined && editTargets.length > 0) {
    let targetRowIndexes = [];
    let targetFieldNames = [];

    let conditionColumn = 'CATEGORY';
    let conditionOperator = 'equal';
    let conditionValues = editMeasures;

    let conditionColumnValid = true;
    if (conditionColumn !== undefined && conditionColumn.length > 0) {
      conditionColumnValid = columnIdOrgs.includes(conditionColumn);
      if (!conditionColumnValid) {
        console.error('\nColumn', conditionColumn, 'is not exists in', gridView.id + '.');
        return;
      }
    }

    let dataRowCount = dataProvider.getRowCount();
    for (let i = 0; i < dataRowCount; i++) {
      let conditionCellValue = (dataProvider.getFieldValues(conditionColumn, i, i))[0];

      let isTarget = isSatisfiedValue(conditionOperator, conditionCellValue, conditionValues);

      if (isTarget) {
        targetRowIndexes.push(i);
      }
    }

    let styleExceptCellsDB = TAFFY(gridView.styleExceptCells);

    for (let i = 0; i < editTargets.length; i++) {
      let editTargetDataColumns = TAFFY(dataColumns)().filter({ columnIdOrg: editTargets[i] }).get();

      let editTargetDataColumnFieldName = TAFFY(editTargetDataColumns)().select('fieldName');
      targetFieldNames = targetFieldNames.concat(editTargetDataColumnFieldName);
      targetFieldNames = targetFieldNames.unique();

      if (targetRowIndexes.length > 0 && targetFieldNames.length > 0) {
        if (styleExceptCellsDB().count() > 0) {
          gridView.beginUpdate();
          try {
            for (let r_idx = 0; r_idx < targetRowIndexes.length; r_idx++) {
              for (let f_idx = 0; f_idx < targetFieldNames.length; f_idx++) {
                if ((styleExceptCellsDB().filter({
                  rowIndex: targetRowIndexes[r_idx],
                  fieldName: targetFieldNames[f_idx]
                }).get()).length <= 0) {
                  gridView.setCellStyle(gridView, targetRowIndexes[r_idx], targetFieldNames[f_idx], STYLE_ID_EDIT_MEASURE);
                } else {
                  let styleID = (styleExceptCellsDB().filter({
                    rowIndex: targetRowIndexes[r_idx],
                    fieldName: targetFieldNames[f_idx]
                  }).get()[0]).styleID;
                  gridView.setCellStyle(gridView, targetRowIndexes[r_idx], targetFieldNames[f_idx], styleID);
                }
              }
            }
          } finally {
            gridView.endUpdate();
          }
        } else {
          //console.log(targetRowIndexes,targetFieldNames)
          gridView.setCellStyles(gridView, targetRowIndexes, targetFieldNames, STYLE_ID_EDIT_MEASURE);
        }
      }

      targetFieldNames = [];
    }
  }
}

function setGridCrosstabInfo(gridView, crossTab) {
  if (crossTab) {
    if (crossTab instanceof Array && crossTab.length > 0) {
      gridView.crossTabInfo = crossTab[0][gridView.orgId];
    } else {
      gridView.crossTabInfo = crossTab[gridView.orgId];
    }
  }
}

function setGridPreferenceInfo(gridView, prefInfo) {
  if (prefInfo !== undefined) {
    /*
    let tempDB = TAFFY(prefInfo);
    gridView.prefInfo = tempDB().filter({gridCd: gridView.orgId}).get();

    tempDB = null;
    */
    gridView.prefInfo = prefInfo.filter(item => item.gridCd == gridView.orgId || !item.gridCd);

  }
}

function getDateFromString(dateString) {
  if (dateString) {
    let temp = dateString.replaceAll(/\D/gi, '');
    if (temp.length > 6) {
      dateString = new Date(temp.substr(0, 4) + '-' + temp.substr(4, 2) + '-' + temp.substr(6, 2));
    } else {
      dateString = new Date(temp.substr(0, 4) + '-' + temp.substr(4, 2));
    }
  }
  return dateString;
}


function isSatisfiedValue(cellAttributeConditionOperator, conditionCellValue, cellAttributeConditionValues) {
  cellAttributeConditionOperator = cellAttributeConditionOperator.toUpperCase();

  let targetNullAcceptOperator = ['EQUAL', 'NOTEQUAL'];
  if (!targetNullAcceptOperator.includes(cellAttributeConditionOperator)) {
    if (conditionCellValue === undefined || conditionCellValue === null || conditionCellValue.length <= 0) {
      return false;
    }
  }

  if (cellAttributeConditionOperator === 'BETWEEN') {
    if (cellAttributeConditionValues.length >= 2) {
      return conditionCellValue >= cellAttributeConditionValues[0] * 1
        && conditionCellValue <= cellAttributeConditionValues[1] * 1;
    } else {
      return false;
    }
  } else {
    for (let m = 0; m < cellAttributeConditionValues.length; m++) {
      let cellAttributeConditionValue = cellAttributeConditionValues[m];

      if (typeof conditionCellValue === 'boolean') {
        cellAttributeConditionValue = (cellAttributeConditionValue === 'true');
      }

      if (cellAttributeConditionOperator === 'STARTSWITH') {
        if (conditionCellValue.toString().startsWith(cellAttributeConditionValue)) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'ENDSWITH') {
        if (conditionCellValue.toString().endsWith(cellAttributeConditionValue)) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'EQUAL') {
        if (typeof conditionCellValue === 'boolean') {
          if (conditionCellValue === cellAttributeConditionValue) {
            return true;
          }
        } else {
          if (cellAttributeConditionValue.toUpperCase() === 'EMPTY') {
            if (!conditionCellValue) {
              return true;
            }
          } else {
            if (conditionCellValue === cellAttributeConditionValue) {
              return true;
            }
          }
        }
      } else if (cellAttributeConditionOperator === 'NOTEQUAL') {
        if (typeof conditionCellValue === 'boolean') {
          if (conditionCellValue !== cellAttributeConditionValue) {
            return true;
          }
        } else {
          if (cellAttributeConditionValue.toUpperCase() === 'EMPTY') {
            if (conditionCellValue) {
              return true;
            }
          } else {
            if (conditionCellValue !== cellAttributeConditionValue) {
              return true;
            }
          }
        }
      } else if (cellAttributeConditionOperator === 'GREATEREQUAL') {
        if (conditionCellValue >= cellAttributeConditionValue) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'LESSEQUAL') {
        if (conditionCellValue <= cellAttributeConditionValue) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'GREATER') {
        if (conditionCellValue > cellAttributeConditionValue) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'LESS') {
        if (conditionCellValue < cellAttributeConditionValue) {
          return true;
        }
      } else if (cellAttributeConditionOperator === 'INCLUDES') {
        if (conditionCellValue.toString().includes(cellAttributeConditionValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

export {
  loadDelegationCntData,
  loadVersionData,
  loadAuthTypeData,
  loadActiveUserTaskData,
  loadDimensionData,
  loadMeasureData,
  loadCrossTabData,
  loadPreferenceData,
  gridDataFillReady,
  gridAfterSetData,
  getOnlyUpdatedRows ,
  getDTFdateFormat,
  setGridCrosstabInfo,
  setGridPreferenceInfo,
  getDateFromString,
  isSatisfiedValue

}