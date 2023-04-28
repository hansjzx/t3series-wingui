import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, GridCnt, SearchRow, InputField, GridExcelExportButton, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray, dimensionItems } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = new Array(
  ...dimensionItems,
  ...[
    { name: "ITEM", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "ACCOUNT", dataType: "string", visible: false, editable: false, type: "string" },
    // { name: "CATEGORY", dataType: "string", headerText: "Measure", visible: true, editable: false, width: "120", title: "Measure", type: "string", lang: true },
    { name: "DATE", dataType: "text", headerText: "DATE", visible: true, editable: false, width: "100", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," } },
  ]
);

let userGrp;
let versionOptionData;
function CompareVersion(props) {
  //1.
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2.
  const [grid1, setGrid1] = useState(null);

  const [versionOption1, setVersion1Option] = useState([]);
  const [versionOption2, setVersion2Option] = useState([]);
  const [bucketOption, setBucketOption] = useState([]);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

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
      visible: true,
      disable: false,
    },
  ];

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: { bucket: "M", dateRange: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 2))], itemCd: "", itemNm: "", accountCd: "", accountNm: "", valueOption: "Q" },
  });

  useEffect(() => {
    setViewInfo(vom.active, "globalButtons", globalButtons);
  }, [grid1]);

  useEffect(() => {
    loadBucket();
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

  const loadBucket = async () => {
    const buckets = await loadOption(true, "SRV_GET_REPORT_BUKT", {}, "CD", "NM", false, true);
    //console.log("buckets", buckets);
    if (!isEmptyArray(buckets)) {
      setBucketOption(buckets);
      setValue("bucketType", buckets[0].value);
    }
  };

  const loadVersion = async () => {
    // let buck = getValues("bucket") === "ALL" ? "" : getValues("bucket");
    // //TODO.. 요기 이상함 버킷을 전달하지 않아야 버전 값이 넘어온다.
    // versionOptionData = await loadOption(true, "SRV_SP_UI_DP_40_Q0", { PLAN_TP_ID: "", BUKT_CD: "" }, "CD", "CD_NM", false, true);
    // hanguls..version 가져오는 서비스 변경해 봄
    versionOptionData = await loadOption(true, "SRV_GET_SP_UI_DP_00_VERSION_Q1", { PLAN_TP_ID: "", CL_YN: "Y", VER_CNT: "10" }, "ID", "VER_ID", false, true);

    //console.log("versions", versions);
    setVersion1Option(versionOptionData);
    setVersion2Option(versionOptionData);
    if (!isEmptyArray(versionOptionData)) {
      setValue("versionId1", versionOptionData[0].value);
      if (versionOptionData.length > 1) {
        setValue("versionId2", versionOptionData[1].value);
      }
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
          console.log("loadUserGroup====>", res.data);
          userGrp = res.data.grpCd;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  function loadGrid1Data() {
    //grid1.gridView.showToast(progressSpinner + "Load Data...", true);
    let version1Data = versionOptionData.find((item) => item.value === getValues("versionId1"));
    let authTpId1;
    if (version1Data) {
      authTpId1 = version1Data.data.AUTH_TP_ID;
    }

    let version2Data = versionOptionData.find((item) => item.value === getValues("versionId1"));
    let authTpId2;
    if (version2Data) {
      authTpId2 = version2Data.data.AUTH_TP_ID;
    }

    let param = new URLSearchParams();

    let dateRange = getValues("dateRange");
    let fromdate = dateRange ? dateRange[0].format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = dateRange ? dateRange[1].format("yyyy-MM-ddT00:00:00") : "99991231";

    param.append("VER_ID_01", getValues("versionId1"));
    param.append("VER_ID_02", getValues("versionId2"));
    param.append("BUCK", getValues("bucket") === "ALL" ? "" : getValues("bucket"));
    param.append("STRT_DATE", fromdate);
    param.append("END_DATE", todate);
    param.append("OPTION", getValues("valueOption"));
    param.append("ITEM_CD", getValues("itemCd"));
    param.append("ACCT_CD", getValues("accountCd"));

    param.append("UI_ID", vom.active);
    param.append("GRID_ID", "RST_CPT_01");
    param.append("USER_ID", username);
    param.append("AUTH_TP", userGrp);
    param.append("AUTH_TP_ID_01", authTpId1);
    param.append("AUTH_TP_ID_02", authTpId2);

    param.append("ITEM_ATTR_01", "");
    param.append("ITEM_ATTR_02", "");
    param.append("ITEM_ATTR_03", "");
    param.append("ACCT_ATTR_01", "");
    param.append("ACCT_ATTR_02", "");
    param.append("ACCT_ATTR_03", "");

    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetReport",
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

  const openAccountPopup = () => {
    setAccountPopupOpen(true);
  };

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

  function setAccountCd(accounts) {
    let accountCdArr = [];
    let accountNmArr = [];
    accounts.forEach(function (account) {
      accountCdArr.push(account.ACCOUNT_CD);
      accountNmArr.push(account.ACCOUNT_NM);
    });
    setValue("accountCd", accountCdArr.join("|"));
    setValue("accountNm", accountNmArr.join("|"));
  }

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
            <InputField type="select" name="bucket" label={transLangKey("BUCKET_TP")} control={control} readonly={false} disabled={false} options={bucketOption} />
            <InputField type="select" name="versionId1" label={transLangKey("VER_01")} control={control} options={versionOption1} />
            <InputField type="select" name="versionId2" label={transLangKey("VER_02")} control={control} options={versionOption2} />
            <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
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
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              control={control}
              onClick={() => {
                openAccountPopup();
              }}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
            <InputField
              type="radio"
              name="valueOption"
              label={transLangKey("OPTION")}
              control={control}
              options={[
                { label: transLangKey("QTY"), value: "Q" },
                { label: transLangKey("AMT"), value: "A" },
              ]}
            />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_DP_40")}></ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_40-RST_CPT_01" afterGridCreate={afterGridCreate1} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}
export default CompareVersion;
