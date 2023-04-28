


import wingui3 from "@zionex/wingui-core/src/component/grid/wingui3-custom";

wingui3.util.grid.SummaryFooter = function (gridWrap,gridView, dateColumnNames, summaryColumn) {
  this.grid1 = gridWrap.grid1
  this.gridView = gridView;
  this.dataProvider = gridView.getDataSource();
  this.dateColumnNames = dateColumnNames;
  this.summaryColumn = summaryColumn;

  this.data = {};
  this.changedInfo = {};

  this.groupData = {};
  this.groupEditedInfo = {};

  this.create = function (measureColumnName, groupMeasureName, totalMeasureNames) {
    //console.log('SummaryFooter create',measureColumnName,groupMeasureName,totalMeasureNames)
    
    this.measureColumnName = measureColumnName;
    this.groupMeasureName = groupMeasureName;
    this.measureNames = totalMeasureNames;

    this.gridView.groupPanel.visible = true;
    this.gridView.setFooters({ visible: true, items: this.measureNames.map(() => ({height : 25})) });
    this.gridView.setOptions({ summaryMode: "aggregate" });
    this.gridView.stateBar.width = 16;
    
    this.gridView.rowGroup.mergeExpanderVisibility = 'always';
    this.gridView.groupBy([]);
    this.gridView.setRowGroup({
      mergeMode: true,
      expandedAdornments: "footer",
      visible: true,
      expression: "sum",
      summaryMode: 'aggregate',
      sorting: true,      
      footerStatement: 'Sum:',
      footerCellMerge: true,
      levels: [
        {
          footerStyles: {
            background: '#ffffbb00',
            foreground: '#ff4b0700',
          },
          footerBarStyles: {
            background: '#ffffbb00'
          },
          barStyles: {
            background: '#ffffbb00'
          }
        }
      ]
    });


    this.gridView.setColumnProperty(this.measureColumnName, 'footers', this.measureNames.map((measureName) => (
      {
        text: transLangKey(measureName).toString(), //이넘은 표시되지 않고 prefix/suffix가 표시됨..
        prefix: transLangKey(measureName).toString() + '(',
        suffix: ')'
      }
    )));

    this.gridView.setColumnProperty(this.measureColumnName, 'groupFooter', {
      text: transLangKey(this.groupMeasureName.toString()), //이넘은 표시되지 않고 prefix/suffix가 표시됨..
      numberFormat: "#,000",
      expression: "",
      prefix: transLangKey(this.groupMeasureName.toString()) + '(',
      suffix: ')'
    });
    
    var columnNames = this.dateColumnNames.concat(this.summaryColumn.getSummaryColumnNames());
    var summaryFooter = this;

    for (var i = 0, n = columnNames.length; i < n; i++) {
      this.gridView.setColumnProperty(columnNames[i], 'footers', this.measureNames.map(()=>({
        "numberFormat": "#,000",
        valueCallback: function (gridView,column, footerIndex, columnFooter, value) {
          return summaryFooter.getSummary(footerIndex, column, gridView);
        },
      })));
      
      this.gridView.setColumnProperty(columnNames[i], 'groupFooter', {
        "numberFormat": "#,000",
        //expression: "sum",   이넘이 설정되면 valueCallback이 호출되지 않음.
        valueCallback: function (gridView, column, groupFooterIndex, group, value) {
          return summaryFooter.getGroupSummary(groupFooterIndex, column, gridView);
        },
      });
      
    }
  };

  this.setChangedMeasure = function (row, fieldName, dataRow) {
    var measureName = row[this.measureColumnName];
    if (measureName in this.changedInfo) {
      this.changedInfo[measureName].push(fieldName);
    } else {
      this.changedInfo[measureName] = [fieldName];
    }

    if (summaryColumn.hasSummaryColumnName(fieldName)) {
      this.changedInfo[measureName].push(summaryColumn.getSummaryColumnName(fieldName));
    }

    var totalSummaryInfos = summaryColumn.getTotalSummaryInfos();
    if (totalSummaryInfos) {
      for (var i = 0, n = totalSummaryInfos.length; i < n; i++) {
        this.changedInfo[measureName].push(totalSummaryInfos[i].columnName);
      }
    }

    if (measureName === this.groupMeasureName) {
      var index = this.gridView.getItemIndex(dataRow);
      while (index !== -1) {
        var editedKey = index + '@' + measureName;
        if (editedKey in this.groupEditedInfo) {
          this.groupEditedInfo[editedKey].push(fieldName);
        } else {
          this.groupEditedInfo[editedKey] = [fieldName];
        }

        if (summaryColumn.hasSummaryColumnName(fieldName)) {
          this.groupEditedInfo[editedKey].push(summaryColumn.getSummaryColumnName(fieldName));
        }

        if (totalSummaryInfos) {
          for (var i = 0, n = totalSummaryInfos.length; i < n; i++) {
            this.groupEditedInfo[editedKey].push(totalSummaryInfos[i].columnName);
          }
        }

        index = this.gridView.getGroupIndex(index);
      }
    }
  };

  this.getSummary = function (footerIndex, column, gridView) {
    
    var measureName = this.measureNames[footerIndex];

    /*
    if (!(footerIndex in this.data)) {
      this.data[footerIndex] = {};
    }

    var edited = false;

    
    if (measureName in this.changedInfo) {
      var fieldNames = this.changedInfo[measureName];

      var fieldIndex = fieldNames.indexOf(column.fieldName);
      if (fieldIndex !== -1) {
        fieldNames.splice(fieldIndex, 1);
        if (fieldNames.length === 0) {
          delete this.changedInfo[measureName];
        }
        edited = true;
      }
    }

    //값을 수정하지 않을 경우, 필터링 되지 않았을 경우 
    var summaryValues = this.data[footerIndex];
    if (!gridView.isFiltered() && !edited && (column.fieldName in summaryValues)) {
      return summaryValues[column.fieldName];
    }
    */
    
    //값을 수정하거나 필터링 수행 시 Summary 값 다시 계산
    var summaryValue = 0;
    for (var i = 0, n = gridView.getItemCount(); i < n; i++) {
      if (gridView.getDataRow(i) > -1 && gridView.getValue(i, this.measureColumnName) == measureName) {
        var value = gridView.getValue(i, column.fieldName);

        if (!isNaN(value)) {
          summaryValue += value;
        }
      }
    }

    //summaryValues[column.fieldName] = summaryValue;

    return summaryValue;
  };

  this.getGroupSummary = function (groupFooterItemIndex, column, gridView) {

    if (!(groupFooterItemIndex in this.groupData)) {
      this.groupData[groupFooterItemIndex] = {};
    }

    var editedKey = this.gridView.getGroupIndex(groupFooterItemIndex) + '@' + this.groupMeasureName;

    var edited = false;
    if (editedKey in this.groupEditedInfo) {
      var fieldNames = this.groupEditedInfo[editedKey];

      var fieldIndex = fieldNames.indexOf(column.fieldName);
      if (fieldIndex !== -1) {
        fieldNames.splice(fieldIndex, 1);
        if (fieldNames.length === 0) {
          delete this.groupEditedInfo[editedKey];
        }
        edited = true;
      }
    }

    var summaryValues = this.groupData[groupFooterItemIndex];
    if (!edited && column.fieldName in summaryValues) {
      return summaryValues[column.fieldName];
    }

    var model = gridView.getModel(groupFooterItemIndex, true);

    var parentModel = gridView.getParentModel(model, true);
    if (!parentModel.dataRows) {
      return 0;
    }

    var summaryValue = 0;
    for (var i = 0, n = parentModel.dataRows.length; i < n; i++) {
      var row = this.dataProvider.getJsonRow(parentModel.dataRows[i]);
      if (row[this.measureColumnName] === this.groupMeasureName) {
        var value = row[column.fieldName];

        if (!isNaN(value)) {
          summaryValue += value;
        }
      }
    }

    summaryValues[column.fieldName] = summaryValue;

    return summaryValue;
  };
};

export default wingui3;