import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { InputField, zAxios } from "@zionex/wingui-core/src/common/imports";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";

let versionPlants = {};
function VersionPlantSearchCondition(props, ref) {
  const history = useHistory();
  const location = useLocation();

  const [plants, setPlants] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      planningDate: new Date(),
      versionCd: '',
      plantCd: []
    }
  });
  const watchAllFields = watch();

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return { planningDate: getValues('planningDate'), versionCd: getValues('versionCd'), plantCd: getValues('plantCd') };
    },
    handleSubmit: (success, error) => handleSubmit(success, error)()
  }));

  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      setValue('planningDate', location.state.planningDate);
      zAxios.get(baseURI() + 'factoryplan/versions', {
        params: {
          'planning-date': location.state.planningDate.format('yyyy-MM-dd').replaceAll('-', '')
        },
        waitOn: false
      }).then(function (res) {
        res.data.forEach(version => {
          versionPlants[version.versionCd] = version.plants.map(plant => ({ value: plant.plantCd, label: plant.plantNm }));
        });

        setSelectOptions(res.data.map(v => ({ value: v.versionCd, label: `${v.versionCd} : ${v.descripText ? v.descripText : ''}` })));

        setValue('versionCd', location.state.versionCd);

        // plant setting
        let plants = [], plantCd = [];
        if (versionPlants[location.state.versionCd]) {
          plants = versionPlants[location.state.versionCd];
          plantCd = versionPlants[location.state.versionCd].map(plant => plant.value);
        }
        setPlants(plants);
        setValue('plantCd', plantCd);

        if (props.initialized) props.initialized();
        history.replace({ state: null });
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
      });
    }
  }, [location]);

  useEffect(() => {
    if (!location.state) {
      getVersionList();
    }
    if (props.onChange) props.onChange({ planningDate: watchAllFields.planningDate });
  }, [watchAllFields.planningDate]);

  useEffect(() => {
    if (!location.state) {
      let plants = [], plantCd = [];
      if (versionPlants[watchAllFields.versionCd]) {
        plants = versionPlants[watchAllFields.versionCd];
        plantCd = versionPlants[watchAllFields.versionCd].map(plant => plant.value);
      }
      setPlants(plants);
      setValue('plantCd', plantCd);
    }
    if (props.onChange) props.onChange({ versionCd: watchAllFields.versionCd });
  }, [watchAllFields.versionCd]);

  useEffect(() => {
    if (props.onChange) props.onChange({ plantCd: watchAllFields.plantCd });
  }, [watchAllFields.plantCd]);

  function getVersionList() {
    zAxios.get(baseURI() + 'factoryplan/versions', {
      params: {
        'planning-date': getValues('planningDate').format('yyyy-MM-dd').replaceAll('-', '')
      },
      waitOn: false
    }).then(function (res) {
      res.data.forEach(version => {
        versionPlants[version.versionCd] = version.plants.map(plant => ({ value: plant.plantCd, label: plant.plantNm }));
      });

      setSelectOptions(res.data.map(v => ({ value: v.versionCd, label: `${v.versionCd} : ${v.descripText ? v.descripText : ''}` })))

      if (location.state === null || location.state === undefined) {
        setValue('versionCd', (res.data.length) > 0 ? res.data[0].versionCd : '');
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  return (
    <>
      <InputField control={control} type="datetime" dateformat="yyyy-MM-dd" name="planningDate" label={transLangKey('FP_LABEL_PLANNING_DATE')} />
      <InputField control={control} rules={{ required: transLangKey('FP_MSG_SELECT_VERSION') }} type="select" label={transLangKey('SIMULATION_VERSION')} name="versionCd" options={selectOptions} renderValue={(selected) => selected} />
      <InputField control={control} type="multiSelect" label={transLangKey('FP_VERSION_PLANT')} name="plantCd" options={plants} />
    </>
  );
}

export default forwardRef(VersionPlantSearchCondition);
