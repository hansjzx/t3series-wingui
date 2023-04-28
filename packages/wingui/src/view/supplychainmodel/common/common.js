import { zAxios } from '@zionex/wingui-core/src/common/imports';

export function setGridComboList(targetGrid, columnNames, codeGroupCd, lookupObject) {
  if (targetGrid) {
    let columnArr = columnNames.split(",");
    let codeGroupArr = codeGroupCd.split(",").map(code => code.trim());
    let codeGroupSet = [...new Set(codeGroupArr)];

    codeGroupCd = codeGroupSet.join(', ');

    let param = new URLSearchParams();
    param.append("CODE", codeGroupCd);

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/mp/SRV_UI_CM_CODE",
      data: param
    })
    .then(function (res) {
      columnArr.map((columnName, idx) => {
        if (columnName.length != 0) {
          const value = lookupObject ? lookupObject.value : "ID";
          const label = lookupObject ? lookupObject.label : "CD_NM";
          targetGrid.gridView.setColumnProperty(columnName.trim(), 'lookupData', {value: value, label: label, list : res.data.RESULT_DATA.filter(code => code.GROUP == codeGroupArr[idx].trim())});
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    })
  }
}

export async function getCodeList(codeGroupCd) {
  let ret = {};

  let param = new URLSearchParams();
  param.append("CODE", codeGroupCd);

  ret = await zAxios({
    method: "post",
    header: { "content-type": "application/json" },
    url: baseURI() + "engine/mp/SRV_UI_CM_CODE",
    data: param
  })
  .then(function (res) {
    return res.data.RESULT_DATA;
  })
  .catch(function (err) {
    console.log(err);
  })

  return ret;
}

export const newRowEditCellStyle = (grid, dataCell) => {
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
