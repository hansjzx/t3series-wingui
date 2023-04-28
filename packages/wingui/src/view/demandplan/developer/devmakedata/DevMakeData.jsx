import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton, Button } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, CommonButton, InputField, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { baseURI, gridComboLoad, loadComboList, showMessage, transLangKey, vom } from "@wingui";
import DataSaverOn from "@mui/icons-material/DataSaverOn";

const gridItems = [
  { name: "UI_ID", dataType: "text", headerText: "UI_ID", visible: true, editable: false, width: "70" },
  { name: "TABLE_NM", dataType: "text", headerText: "TABLE_NM", visible: false, editable: false, width: "80" },
  { name: "CNT", dataType: "text", headerText: "CNT", visible: true, editable: false, width: "70" },
];
function DevMakeData() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGrid1Data();
      },
      visible: false,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        refresh();
      },
      visible: false,
      disable: false,
    },
    {
      name: "personalization",
      action: (e) => {
        //setPersonalizeOpen(true);
      },
      visible: false,
      disable: false,
    },
  ];

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      dateRange: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 4))],
      bucket: "PW",
      isDelete: "false",
    },
  });

  useEffect(() => {
    if (grid) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid]);

  const setGridOption = (grid) => {
    grid.gridView.displayOptions.fitStyle = "fill";
  };

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid(gridObj);
    setGridOption(gridObj);
  };

  const makeMeasureData = (targetGrid) => {
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("Would you like to create MeasureData? "), function (answer) {
      if (answer) {
        let param = new URLSearchParams();
        param.append("UI_ID", "SRH_TAB");
        param.append("STRT_DATE", getValues("dateRange")[0].format("yyyy-MM-dd"));
        param.append("END_DATE", getValues("dateRange")[1].format("yyyy-MM-dd"));
        param.append("BUCKET", getValues("bucket"));
        param.append("DATA_TP", "EXAM");
        param.append("DEL_YN", getValues("isDelete"));
        param.append("USER_ID", username);

        zAxios({
          method: "post",
          header: { "content-type": "application/json" },
          url: baseURI() + "engine/dp/SRV_GET_DP_MAKE_EX_MEASURE",
          data: param,
        })
          .then(function (response) {
            if (response.status === gHttpStatus.SUCCESS) {
              let msg = response.data.RESULT_DATA.IM_DATA.SP_DP_MAKE_EX_MEASURE_P_RT_MSG;

              console.log("msg====>", msg);
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            //loadGrid1Data();
          });
      }
    });
  };

  const makeActualSalesData = (targetGrid) => {
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("Would you like to create ActualSales? "), function (answer) {
      if (answer) {
        let param = new URLSearchParams();
        param.append("UI_ID", "SRH_TAB");
        param.append("STRT_DATE", getValues("dateRange")[0].format("yyyy-MM-dd"));
        param.append("END_DATE", getValues("dateRange")[1].format("yyyy-MM-dd"));
        param.append("BUCKET", getValues("bucket"));
        param.append("DATA_TP", "EXAM");
        param.append("DEL_YN", getValues("isDelete"));
        param.append("USER_ID", username);

        zAxios({
          method: "post",
          header: { "content-type": "application/json" },
          url: baseURI() + "engine/dp/SRV_GET_DP_MAKE_ACTUAL_SALES",
          data: param,
        })
          .then(function (response) {
            if (response.status === gHttpStatus.SUCCESS) {
              let msg = response.data.RESULT_DATA.IM_DATA.SP_DP_MAKE_ACTUAL_SALES_P_RT_MSG;
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            //loadGrid1Data();
          });
      }
    });
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField
              type="select"
              name="bucket"
              label={transLangKey("BUCK")}
              control={control}
              options={[
                { label: "Month", value: "M" },
                { label: "Week", value: "W" },
                { label: "Partial Week", value: "PW" },
              ]}
            />
            <InputField
              type="select"
              name="isDelete"
              label={transLangKey("DEL")}
              control={control}
              options={[
                { label: "Date Range Delete", value: "false" },
                { label: "All Delete", value: "true" },
              ]}
            />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <Button
              variant={"outlined"}
              endIcon={<DataSaverOn />}
              onClick={() => {
                makeMeasureData(grid);
              }}>
              {"Make Measure"}
            </Button>
            <Button
              variant={"outlined"}
              endIcon={<DataSaverOn />}
              onClick={() => {
                makeActualSalesData(grid);
              }}>
              {"Make ActualSales"}
            </Button>
          </LeftButtonArea>
          <RightButtonArea></RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid" items={gridItems} viewCd={vom.active} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate1} />
        </ResultArea>
      </ContentInner>
    </>
  );
}

export default DevMakeData;
