import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, InputField, SearchArea, SearchRow, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, CommonButton,
  useViewStore
} from '@zionex/wingui-core/src/common/imports';
import MultiColumnListPopover from "@zionex/wingui-core/src/component/input/MultiColumnListPopover";
import { IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

const colDef = [
  { name: 'value', headerText: 'CODE', minWidth: 170, visible: false },
  { name: 'label', headerText: 'NAME', minWidth: 100 },
  { name: 'test1', headerText: 'TEST', minWidth: 100, visible: false },
];

const colDef2 = [
  { name: 'high', headerText: '대', minWidth: 50 },
  { name: 'medium', headerText: '중', minWidth: 50 },
  { name: 'low', headerText: '소', minWidth: 50 },
];

function createData(label, value) {
  return { label, value };
}

const rows = [
  //{name: 'India', code: 'IN', population:1324171354,size:3287263}
  createData('Indiajfdslafjdlf', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy이탈리아 이태리 뭐그런 긴 이름', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const rows2 = [
  { high: 'aaa', medium: 'aa', low: 'aa' },
  { high: 'bbb', medium: 'bb', low: 'b' },
  { high: 'ccc', medium: 'cc', low: 'c' },
]

const defOption = [
  {
    label: '전체', value: '',
  },
  {
    label: '정말로 긴 라벨을 가지고 있네', value: 'Y',
  },
  {
    label: 'N', value: '공룡N',
  },
  {
    label: 'D', value: '사슴D',
  },
]

function Sample01() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      ptext: '',
      lv2: 'test',
      nolabelInput: 'aaaa',
      pdateRange: ['2022-01-01', '2022-12-31'],
      pselect: 'Nfdsafdafdafds',
      select2: 'B',
    }
  })
  const globalButtons = [
    { name: "search", action: (e) => { handleSubmit(onSubmit, onErrorInput)() }, visible: true, disable: false }
  ]
  const [planBuild, setPlanBuild] = useState(false);
  const [testOption, setTestOption] = useState(defOption)

  const [options1, setOptions1] = useState([
    {
      label: 'Yfdafdafdfdsafdsafdsafdsafdsafdsafdsfdsafdsfsd', value: 'Ydfdsafdf',
    },
    {
      label: 'Nfdsafdsa', value: 'Nfdsafdafdafds',
    },
    {
      label: 'Daaaaaa',  value: 'Afdasfdaf',
    },
    {
      label: 'Bfdasfdsf', value: 'B',
    }
  ]);
  const [options2, setOptions2] = useState([
    {
      label: 'Daaaaaa',  value: 'Afdasfdaf',
    },
    {
      label: 'Bfdasfdsf', value: 'B',
    }
  ]);
  useEffect(() => {
    //만약 value 로 'Russia'를 입력할 경우 inputKey는 label
    // setValue('popoverInput', 'Russia');

    //IT 라는 value의 매핑 key는 value 
    setValue('popoverInput', 'IT');
    //b 라는 value의 매핑 key는 low
    setValue('popoverInput2', 'b');

    setViewInfo(vom.active, 'globalButtons', globalButtons)
  }, [])
  function setTestValue() {
    setValue("ptext", '변경된')
    setValue("lv2", '변경된test')
    setValue("pnumber", 999)
    setValue("pdateRange", ['2022-01-02', '2022-12-01'])
    setValue("pautocomplete", 'ㅜ')
    setValue("pselect", 'Nfdsafdafdafds')
    setValue("pmultiSelect", ['Ydfdsafdf'])
    setValue("pcheck", ['D', 'F'])
    setValue("pradio", 'test2')
    setValue("pradio2", 'test1')
  }
  function onSubmit() {
    //load data
    console.log("load data")
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="ptext" label={transLangKey("TEXT")} control={control} value='' rules={{ required: transLangKey("MSG_0006") }} />
          <InputField name="lv2" label={transLangKey("TEXT With Button")} control={control} button={(<IconButton onClick={setTestValue}><MoreHorizIcon /></IconButton>)} />
          <InputField name="pnumber" label={transLangKey("NUMBER")} control={control} dataType='number' type='text' value={23} />
          <InputField name="pactiion" label={transLangKey("Action")} control={control} type='action'><Icon.Search /></InputField>
          <InputField name="nolabelInput" control={control} height={"35px"} ></InputField>
        </SearchRow>
        <SearchRow>
          <InputField type="select" name="pselect" label={transLangKey("SELECT")} control={control} inputStyle={{ width: '200px' }} options={options1} value={'Ydfdsafdf'} />
          <InputField type="autocomplete" name="pautocomplete" label={transLangKey("AutoComplete")} control={control} options={testOption} value={'Y'} />
          <InputField type="multiSelect" name="pmultiSelect" label={transLangKey("multiSelect")} control={control} value={['Ydfdsafdf', 'Nfdsafdafdafds']} options={options1} />
        </SearchRow>
        <SearchRow>
          <InputField name="pdate" label={transLangKey("DATE")} value={'2022-01-01'} control={control} type='datetime' />
          <InputField name="pdatetime" label={transLangKey("DATETIME")} value={'2022-01-01 00:00:00'} control={control} type='datetime' dateformat="yyyy-MM-dd HH:mm:ss" />
          <InputField name="pdateRange" label={transLangKey("Date Range")} control={control} type='dateRange' />
          <InputField name="pselectMonth" label={transLangKey("selectMonth")} value={'2022-01-01'} control={control} type='datetime' openTo='month' />
          <InputField name="pselectYear" label={transLangKey("selectYear")} value={'2022-01-01'} control={control} type='datetime' openTo='year' />
        </SearchRow>
        <SearchRow>
          <InputField name="ptext2" label={transLangKey("TEXT")} control={control} value='fds' />
          <InputField name="pcheck" label={transLangKey("check")} value={['Y', 'N']} width={'200px'} height={'100px'} control={control} type="check"
            options={[{ label: 'D', value: 'D', }, { label: 'F', value: 'F', }, { label: 'G', value: 'G', }, { label: 'E', value: 'E', }, { label: 'A', value: 'A', }]}
          />
          <InputField name="pradio" label={transLangKey("라디오버튼")} control={control} width='none' type="radio"
            options={[{ label: transLangKey("ACTV_YN"), value: 'Y', }, { label: transLangKey("테스트1"), value: 'test1', }, { label: transLangKey("테스트2"), value: 'test2', }, { label: transLangKey("테스트3"), value: 'test3', }]}
          />
          <InputField type="check" name={"noLabelCheckbox"} control={control} options={[{ label: transLangKey("no Label Checkbox"), value: "Y" }]} />
          <InputField type="radio" name={"noLabelRadio"} control={control} options={[{ label: transLangKey("no Label RadioButton"), value: "Y" }]} />
        </SearchRow>
        <SearchRow>
          <InputField name="ptextarea" label={transLangKey("TextArea")} control={control} value='fdsafdfds' showWeekNumbers type='textarea' />
          <InputField name="ptime" label={transLangKey("Time")} control={control} showWeekNumbers type='time' />
          <InputField name="popoverInput" label={transLangKey("Custom Input")} control={control} type="popover" displayText="[value] label" width="300px" inputKey="value"
            options={rows}
            childComponent={
              <MultiColumnListPopover items={colDef} />
            }
          />
          <InputField name="popoverInput2" label={"Custom Input2"} control={control} type="popover" displayText="low" inputKey="low"
            options={rows2}
            childComponent={
              <MultiColumnListPopover items={colDef2} />
            }
          />
        </SearchRow>
        <SearchRow>
          <InputField inputType="labelText" name="labeltext" label={transLangKey("name")} control={control} ></InputField>
          <InputField inputType="labelText" type="datetime" name="labeltext" label={transLangKey("datime")} control={control} ></InputField>
          <InputField inputType="labelText" type="select" name="select2" label={transLangKey("SELECT")} control={control} inputStyle={{ width: '200px' }} options={options2} value={'Ydfdsafdf'} />
          <InputField inputType="labelText" type="radio" name="pradio2" label={transLangKey("라디오")} control={control} width='400px'
            options={[{ label: transLangKey("테스트1"), value: 'test1', }, { label: transLangKey("테스트2"), value: 'test2', }]}
          />
        </SearchRow>
        <SearchRow>
          <InputField inputType="labelText" variant="standard" name="labeltext" label={transLangKey("name")} useLabel={false} labelStyle={{ backgroundColor: "#ffffff" }} control={control} ></InputField>
          <InputField inputType="labelText" variant="standard" type="datetime" name="labeltext" label={transLangKey("datime")} useLabel={false} labelStyle={{ backgroundColor: "#ffffff" }} control={control} ></InputField>
          <InputField inputType="labelText" variant="standard" type="select" name="select2"  label={transLangKey("SELECT")} useLabel={false} control={control} inputStyle={{ width: '200px' }} options={options2} value={'Ydfdsafdf'} />
          <InputField inputType="labelText" variant="standard" type="radio" name="pradio2" label={transLangKey("라디오")} useLabel={false} control={control} width='400px' labelStyle={{ backgroundColor: "#ffffff" }}
            options={[{ label: transLangKey("테스트1"), value: 'test1', }, { label: transLangKey("테스트2"), value: 'test2', }]}
          />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <ButtonArea>
          <LeftButtonArea></LeftButtonArea>
          <RightButtonArea>
            <CommonButton type="text" title={"check"} onClick={handleSubmit(onSubmit, onErrorInput)}>{"check"}</CommonButton>
          </RightButtonArea>
        </ButtonArea>
      </ResultArea>
    </ContentInner>
  );
}


export default Sample01
