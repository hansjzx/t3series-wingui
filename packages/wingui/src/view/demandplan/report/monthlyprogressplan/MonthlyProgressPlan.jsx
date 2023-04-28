import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, useIconStyles, StatusArea, GridCnt, SearchRow, InputField, GridExcelExportButton, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray, dimensionItems } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = new Array(
  ...dimensionItems,
  ...[
    { name: "ITEM", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "CATEGORY", dataType: "string", headerText: "Measure", visible: true, editable: false, width: "120", title: "Measure", type: "string", lang: true },
    { name: "DATE", dataType: "text", headerText: "DATE", visible: true, editable: false, width: "100", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "-" } },
  ]
);

let userGrp;
function MonthlyProgressPlan(props) {
  //1.
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2.
  const [grid1, setGrid1] = useState(null);

  const [versionOption1, setVersion1Option] = useState([]);
  //  const [bucketOption, setBucketOption] = useState([]);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  //  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid1);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        refresh();
      },
      visible: true,
      disable: false,
    },
    {
      name: "personalization",
      action: (e) => {
        setPersonalizeOpen(true);
      },
      visible: false,
      disable: false,
    },
  ];

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: { itemCd: "", itemNm: "" },
  });

  useEffect(() => {
    setViewInfo(vom.active, "globalButtons", globalButtons);
  }, [grid1]);

  useEffect(() => {
    loadVersion();
    loadUserGroup();
  }, []);

  function onSubmit(data) {
    loadGrid1Data(data);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function exportExcel() {
    grid1.exportExcel();
  }

  const setGrid1Options = (grid) => {
    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });
  };

  const loadVersion = async () => {
    let versionOptionData = await loadOption(true, "SRV_GET_CLOSE_VERSION", { PLAN_TP_ATTR: "M" }, "VER_ID", "VER_ID", false, true);

    //console.log("versions", versions);
    setVersion1Option(versionOptionData);
    if (!isEmptyArray(versionOptionData)) {
      setValue("versionId1", versionOptionData[0].value);
    }
  };

  const loadUserGroup = async () => {
    return zAxios({
      fromPopup: true,
      method: "get",
      url: "/system/users/" + username + "/groups/default",
    })
      .then(function (res) {
        if (res.data) {
          //console.log("loadUserGroup====>", res.data);
          userGrp = res.data.grpCd;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  function loadGrid1Data() {
    //grid1.gridView.showToast(progressSpinner + "Load Data...", true);
    let version1Data = versionOption1.find((item) => item.value === getValues("versionId1"));
    let authTpId1;
    let closeLevelId;
    if (version1Data) {
      authTpId1 = version1Data.data.AUTH_TP_ID;
      closeLevelId = version1Data.data.CL_LV_MGMT_ID;
    }

    let param = new URLSearchParams();

    //report
    param.append("VER_ID", getValues("versionId1"));
    param.append("CL_LV_MGMT_ID", closeLevelId);
    param.append("ITEM_CD", getValues("itemCd"));
    param.append("MATCH_OPTION", "WHOLE-WORD");
    param.append("AUTH_TP_ID", authTpId1);
    param.append("SUPPLY_MTD_TBL", "TB_CM_ACTUAL_SHIPMENT");

    //dim info
    param.append("USER_ID", username);
    param.append("UI_ID", vom.active);
    param.append("GRID_ID", "RST_CPT_01");
    param.append("AUTH_TP", userGrp);

    param.append("ALL_DMND_YN", "true");

    param.append("ITEM_ATTR_01", "");
    param.append("ITEM_ATTR_02", "");
    param.append("ITEM_ATTR_03", "");
    param.append("ITEM_GRADE", "");
    param.append("ITEM_COV", "");

    /*
                        <parameter id="VER_ID" reference-id="DATA_01:SVC_GET_CLOSE_VERSION" extract-by="VER_ID"/>
                        <parameter id="CL_LV_MGMT_ID" reference-id="DATA_01:SVC_GET_CLOSE_VERSION" extract-by="CL_LV_MGMT_ID"/>
                        <parameter id="ITEM_CD" reference-id="SRH_CPT_T1_05_04" />
                        <parameter id="VIEW_CD" reference-id="COMMON:VIEW_ID" />
                        <!--DIM INFO-->
                        <parameter id="UI_ID" reference-id="COMMON:VIEW_ID"/>
                        <parameter id="GRID_ID" value="RST_CPT_01" />
                        <parameter id="MATCH_OPTION" value="WHOLE-WORD" /><!-- WHOLE-WORD -->
                        <parameter id="ALL_DMND_YN" reference-id="SRH_CPT_T1_02_00"/>
                        <parameter id="USER_ID" reference-id="SRH_CPT_T1_02_04" />
                        <parameter id="AUTH_TP" reference-id="DATA_01:SVC_GET_DEFAULT_GROUP"  extract-by="grpCd" />
                        <parameter id="AUTH_TP_ID" reference-id="SRH_CPT_T1_04_04" extract-by="ID" />
                        <!-- attribute -->
                        <parameter id="ITEM_ATTR_01" reference-id="SRH_CPT_ATTR_01_04"/>
                        <parameter id="ITEM_ATTR_02" reference-id="SRH_CPT_ATTR_02_04"/>
                        <parameter id="ITEM_ATTR_03" reference-id="SRH_CPT_ATTR_03_04"/>
                        <!-- Grade & COV -->
                        <parameter id="ITEM_GRADE" reference-id="SRH_CPT_ATTR_99_04"/>
                        <parameter id="ITEM_COV" reference-id="SRH_CPT_ATTR_00_04"/>
                        <parameter id="SUPPLY_MTD_TBL" value="TB_CM_ACTUAL_SHIPMENT"/>

*/

    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetProgressPlanData",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          grid1.setData(dataArr);
        }
        //grid1.gridView.hideToast();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const openItemPopup = () => {
    setItemPopupOpen(true);
  };

  // const openAccountPopup = () => {
  //   setAccountPopupOpen(true);
  // };

  function setItemCd(items) {
    let itemCdArr = [];
    let itemNmArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue("itemCd", itemCdArr.join("|"));
    setValue("itemNm", itemNmArr.join("|"));
  }

  // function setAccountCd(accounts) {
  //   let accountCdArr = [];
  //   let accountNmArr = [];
  //   accounts.forEach(function (account) {
  //     accountCdArr.push(account.ACCOUNT_CD);
  //     accountNmArr.push(account.ACCOUNT_NM);
  //   });
  //   setValue("accountCd", accountCdArr.join("|"));
  //   setValue("accountNm", accountNmArr.join("|"));
  // }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Options(gridObj);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId1" label={transLangKey("VER_01")} control={control} options={versionOption1} style={{ display: "none" }} />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              control={control}
              onClick={() => {
                openItemPopup();
              }}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_PROGRESS_MM_PLAN-RST_CPT_01" afterGridCreate={afterGridCreate1} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}
export default MonthlyProgressPlan;
