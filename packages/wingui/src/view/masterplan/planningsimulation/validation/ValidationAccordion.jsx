import React, { useEffect, useState } from 'react';
import {transLangKey} from "@zionex/wingui-core/src/lang/i18n-func";

function ValidationAccordion(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function loadModel(tableName, validationType, modelList) {
    modelList.forEach(model => model.DESCRIPTION = transLangKey(model.DESCRIPTION));

    if (modelList === null || modelList.length <= 0) {
      return;
    }

    let title = '';
    title += tableName;
    title += ' | ';
    title += transLangKey(validationType);

    props.clickValidationList(modelList, title);
  }

  return (
    <>
      <div className="accordion" id="validationAccordion">
        {
          Object.entries(data).map((tableMap, tableIndex) => {
            let buttonCss = tableIndex === 0 ? "accordion-button" : "accordion-button collapsed";
            let collapseCss = tableIndex === 0 ? "accordion-collapse collapse show" : "accordion-collapse collapse";
            let expended = tableIndex === 0 ? "true" : "false";

            let tableName = tableMap[0];
            let validationMap = tableMap[1];

            return (
              <div className="accordion-item" key={tableIndex}>
                <h2 className="accordion-header" id={"heading" + tableName}>
                  <button className={buttonCss} type="button" data-bs-toggle="collapse" data-bs-target={'#colsapace' + tableName} aria-expanded={expended} aria-controls={'colsapace' + tableName}>
                    <i className="list-group-item-accordion" style={{ fontStyle: "normal" }}>
                      { tableName }
                      <span className="badge badge-in-accordion rounded-pill bg-info me-2 align-middle">{ validationMap.count }</span>
                    </i>
                  </button>
                </h2>

                <div id={'colsapace' + tableName} className={collapseCss} aria-labelledby={'heading' + tableName} data-bs-parent="#validationAccordion">
                  <div className="accordion-body">
                    <div className="list-group">
                      {
                        Object.entries(validationMap).map((validationTypeMap, index) => {
                          let validationType = validationTypeMap[0];
                          let validations = validationTypeMap[1];

                          if (validationType !== 'count') {
                            return (
                              <i key={index} onClick={() => loadModel(tableName, validationType, validations)} className="list-group-item list-group-item-action list-group-item-accordion fa fa-in-accordion" aria-hidden="true">
                                { transLangKey(validationType) }
                                <span className="badge badge-in-accordion rounded-pill bg-info align-middle">{ validations.count }</span>
                              </i>
                            )
                          }
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default ValidationAccordion;
