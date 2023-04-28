import React, { useEffect } from "react";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";

function NoContent() {
  useEffect(() => {
  }, []);
  return (
    <>
      <div className="row justify-content-md-center">
        <div className="col-md-auto" >
          <Icon.AlertOctagon size={36} className="text-center" />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-auto" >
          <h3>{transLangKey('MSG_NO_CONTENT')}</h3>
        </div>
      </div>
    </>
  )
}

export default NoContent;