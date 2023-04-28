import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { useViewStore, BaseGrid, PopupDialog, InputField, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../../common/common';

const planResultDetailGridItems = [
  { name: "woCd", dataType: "text", headerText: "FP_WO_CD", visible: true, editable: false, width: 130 },
  { name: "plantCd", dataType: "text", headerText: "FP_PLANT", visible: true, editable: false, width: 130 },
  { name: "resourceCd", dataType: "text", headerText: "FP_RESOURCE", visible: true, editable: false, width: 130 },
  { name: "itemCd", dataType: "text", headerText: "FP_ITEM", visible: true, editable: false, width: 130 },
  { name: "planQty", dataType: "number", headerText: "FP_PLAN_QTY", visible: true, editable: false, width: 80,
    footer: { text: transLangKey("SUM"), expression: "sum" }
  },
  { name: "totalQty", dataType: "number", headerText: "FP_TOTAL_QTY", visible: true, editable: false, width: 80 },
  { name: "policyNm", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "stepNm", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "totalStart", dataType: "datetime", headerText: "FP_START_TS", visible: true, editable: false, width: 125 },
  { name: "totalEnd", dataType: "datetime", headerText: "FP_END_TS", visible: true, editable: false, width: 125 }
];

function PlanResultDetailPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [planResultDetailGrid, setPlanResultDetailGrid] = useState(null);
  const { control, setValue } = useForm({
    defaultValues: {
      detailDate: '',
      plant: '',
      resourceCd: '',
      itemCd: ''
    }
  });
  
  useEffect(() => {
    const params = props.params;
    setValue('detailDate', params.detailDate);
    setValue('plant', params.plantCd);
    setValue('resourceCd', params.resourceCd);
    setValue('itemCd', params.itemCd);
  }, [props.params]);

  useEffect(() => {
    setPlanResultDetailGrid(getViewInfo(vom.active, 'planResultDetailGrid'));
  }, [viewData]);

  useEffect(() => {
    if (planResultDetailGrid) {
      setNoneEditableGrid(planResultDetailGrid);
      setGridOptions(planResultDetailGrid.gridView);
      loadPlanResultDetail();
    }
  }, [planResultDetailGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'planResultDetailGrid') {
      planResultDetailGrid.gridView.setFooters({ visible: true });
    }
  }

  function loadPlanResultDetail() {
    const params = props.params;
    zAxios.get(baseURI() + 'factoryplan/plan-result/versions/' + params.versionCd + "/detail", {
      params: {
        'version-cd': params.versionCd,
        'plant-cd': encodeURI(params.plantCd),
        'resource-cd': params.resourceCd,
        'item-cd': params.itemCd,
        'start-date': params.detailDate,
      },
      fromPopup: true
    }).then(function (res) {
      planResultDetailGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  
  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title={transLangKey("FP_PLAN_RESULT_DETAIL")} resizeHeight={600} resizeWidth={1000}>
        <Box>
          <InputField control={control} label={transLangKey("DATE")} name="detailDate" style={{ width: "220px" }} disabled />
          <InputField control={control} label={transLangKey("FP_PLANT")} name="plant" style={{ width: "220px" }} disabled />
          <InputField control={control} label={transLangKey("FP_RESOURCE")} name="resourceCd" style={{ width: "220px" }} disabled />
          <InputField control={control} label={transLangKey("FP_ITEM")} name="itemCd" style={{ width: "220px" }} disabled />
        </Box>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="planResultDetailGrid" items={planResultDetailGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default PlanResultDetailPopup;
