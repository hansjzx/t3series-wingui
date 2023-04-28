import { newRowEditCellStyle } from '@wingui/view/supplychainmodel/common/common';

const generalConfigConst = {
  "confList": {
    "001": {
      "import": true,
      "export": true,
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 535
    },
    "002": {
      "insert_row": true,
      "remove_row": true,
      "width": 900,
      "height": 535,
      "lookupArr": [
        {
          "name": "CORP_ID",
          "code": "CORPOR_NM"
        },
        {
          "name": "LOCAT_TP_ID",
          "code": "LOC_TP"
        }
      ]
    },
    "003": {
      "insert_row": false,
      "remove_row": false,
      "width": 700,
      "height": 535
    },
    "004": {
      "insert_row": false,
      "remove_row": false,
      "width": 600,
      "height": 535
    },
    "005": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 535
    },
    "006": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 535,
      "loadParams": [
        {
          "name": "LANG_CD",
          "value": localStorage.getItem("languageCode") ? localStorage.getItem("languageCode") : 'ko'
        }
      ],
      "saveParams": [
        {
          "name": "LANG_CD",
          "value": localStorage.getItem("languageCode") ? localStorage.getItem("languageCode") : 'ko'
        }
      ],
    },
    "008": {
      "insert_row": true,
      "remove_row": true,
      "width": 900,
      "height": 535
    },
    "009": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "lookupArr": [
        {
          "name": "UOM_CD",
          "code": "UOM"
        }
      ]
    },
    "010": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 300,
      "lookupArr": [
        {
          "name": "UOM_CD",
          "code": "UOM"
        }
      ]
    },
    "011": {
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 300
    },
    "012": {
      "insert_row": true,
      "remove_row": true,
      "width": 500,
      "height": 300
    },
    "013": {
      "insert_row": false,
      "remove_row": false,
      "width": 620,
      "height": 400,
    },
    "014": {
      "insert_row": false,
      "remove_row": true,
      "width": 550,
      "height": 300
    },
    "015": {
      "insert_row": false,
      "remove_row": true,
      "width": 550,
      "height": 300,
      "saveUrl": "engine/mp/SRV_UI_CM_01_POP_14_S",
      "saveParams": [
        {
          "name": "CATAGY_VAL",
          "value": "DIVISIBLE"
        }
      ]
    },
    "016": {
      "insert_row": false,
      "remove_row": false,
      "width": 550,
      "height": 300
    },
    "017": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300
    },
    "018": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300
    },
    "019": {
      "insert_row": false,
      "remove_row": false,
      "width": 550,
      "height": 300
    },
    "020": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300,
      "lookupArr": [
        {
          "name": "CONF_NM",
          "code": "TRUE_FALSE",
          "value": "CD",
          "label": "CD_NM"
        },
      ]
    },
    "021": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300,
      "lookupArr": [
        {
          "name": "CONF_NM",
          "code": "TRUE_FALSE",
          "value": "CD",
          "label": "CD_NM"
        },
      ]
    },
    "023": {
      "insert_row": false,
      "remove_row": false,
      "width": 620,
      "height": 300
    },
    "024": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300,
      "lookupArr": [
        {
          "name": "TIME_UOM_CD",
          "code": "TIME_UOM"
        },
      ]
    },
    "026": {
      "insert_row": true,
      "remove_row": true,
      "width": 750,
      "height": 300
    },
    "027": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "lookupArr": [
        {
          "name": "RES_GRP_TP",
          "code": "RES_GRP_TP"
        },
      ]
    },
    "028": {
      "insert_row": true,
      "remove_row": true,
      "width": 1200,
      "height": 600,
      "lookupArr": [
        {
          "name": "LOCAT_TP_NM",
          "code": "LOCAT_LV_DESCRIP"
        },
        {
          "name": "UOM_CD",
          "code": "UOM"
        },
      ]
    },
    "029": {
      "insert_row": false,
      "remove_row": false,
      "width": 670,
      "height": 535,
    },
    "032": {
      "insert_row": true,
      "remove_row": true,
      "width": 1320,
      "height": 700,
      "saveUrl": "engine/mp/SRV_SP_UI_CM_01_POP_32_S",
      "lookupArr": [
        {
          "name": "FROM_LOCAT_NM",
          "code": "LOCAT_LV_DESCRIP"
        },
        {
          "name": "TO_LOCAT_NM",
          "code": "LOCAT_LV_DESCRIP"
        },
        {
          "name": "VEHICL_TP",
          "code": "VEHICL_TP"
        },
        {
          "name": "LEADTIME_TP_NM",
          "code": "LEAD_TIME_TP"
        }
      ]
    },
    "033": {
      "insert_row": true,
      "remove_row": true,
      "width": 1000,
      "height": 535,
      "lookupArr": [
        {
          "name": "FROM_LOCAT_TP",
          "code": "LOCAT_LV_DESCRIP"
        },
        {
          "name": "TO_LOCAT_TP",
          "code": "LOCAT_LV_DESCRIP"
        },
        {
          "name": "VEHICL_TP",
          "code": "VEHICL_TP"
        }
      ]
    },
    "035": {
      "insert_row": false,
      "remove_row": false,
      "width": 600,
      "height": 535,
      "lookupArr": [
        {
          "name": "TIME_UOM_NM",
          "code": "TIME_UOM"
        },
      ]
    },
    "037": {
      "insert_row": false,
      "remove_row": false,
      "width": 1000,
      "height": 535,
      "lookupArr": [
        {
          "name": "TIME_UOM_NM",
          "code": "TIME_UOM"
        },
      ]
    },
    "038": {
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 350
    },
    "040": {
      "insert_row": false,
      "remove_row": false,
      "width": 1200,
      "height": 535,
      "lookupArr": [
        {
          "name": "TIME_UOM_CD",
          "code": "TIME_UOM"
        },
      ]
    },
    "042": {
      "insert_row": true,
      "remove_row": true,
      "width": 750,
      "height": 350,
      "lookupArr": [
        {
          "name": "ITEM_TP_CD",
          "code": "ITEM_TP"
        }
      ]
    },
    "043": {
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 300,
      "lookupArr": [
        {
          "name": "PRDUCT_TP_DESC",
          "code": "PRODUCT_TP"
        }
      ]
    },
    "044": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300,
    },
    "045": {
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 535
    },
    "047": {
      "insert_row": true,
      "remove_row": true,
      "width": 700,
      "height": 650
    },
    "051": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 300
    },
    "111": {
      "insert_row": false,
      "remove_row": false,
      "width": 600,
      "height": 300
    },
    "301": {
      "insert_row": true,
      "remove_row": true,
      "width": 1400,
      "height": 500,
      "title": "POP_UI_IM_01",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "loadParams": [
      ],
      "saveUrl": "engine/mp/SRV_UI_IM_01_RST_SAVE",
      "lookupArr": [
        {
          "name": "TIME_BUCKET",
          "code": "TIME_BUCKET"
        },
        {
          "name": "STRT_DATE_TP",
          "code": "START_DATE_TP"
        },
        {
          "name": "DAY_OF_WEEK",
          "code": "DAY_OF_WEEK"
        },
        {
          "name": "VAR_TIME_BUCKET",
          "code": "TIME_BUCKET"
        },
      ],
    },
    "302": {
      "insert_row": false,
      "remove_row": true,
      "width": 1100,
      "height": 535,
      "title": "POP_UI_IM_02",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_04_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_ID",
          "code": "REF_TIME_UOM"
        },
        {
          "name": "PERIOD_TP",
          "code": "INV_ANLY_PRIOD"
        }
      ]
    },
    "303": {
      "insert_row": false,
      "remove_row": true,
      "width": 1400,
      "height": 535,
      "title": "POP_UI_IM_03",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_03_RST_SAVE",
      "lookupArr": [
        {
          "name": "BASE",
          "code": "QUADRANT_BASE"
        }
      ]
    },
    "304": {
      "insert_row": false,
      "remove_row": true,
      "width": 1200,
      "height": 535,
      "title": "POP_UI_IM_04",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_04_RST_SAVE",
      "lookupArr": [
        {
          "name": "PERIOD_TP",
          "code": "INV_ANLY_PRIOD"
        },
        {
          "name": "UOM_ID",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "305": {
      "insert_row": false,
      "remove_row": true,
      "width": 1200,
      "height": 535,
      "title": "POP_UI_IM_05",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_TAB_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_05_RST_SAVE_01",
      "lookupArr": [
        {
          "name": "SABC_CAL_BASE_ID",
          "code": "SABC_CAL_BASE"
        }
      ]
    },
    "306": {
      "insert_row": false,
      "remove_row": false,
      "width": 800,
      "height": 600,
      "title": "IM_TARGET_SVC_CALC_BASE",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_06_RST_SAVE",
      "lookupArr": [
        {
          "name": "TARGET_SVC_CAL_BASE",
          "code": "TARGET_SVC_CAL_BASE_TP"
        }
      ]
    },
    "307": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 600,
      "title": "POP_UI_IM_07",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_07_RST_SAVE"
    },
    "308": {
      "insert_row": false,
      "remove_row": false,
      "width": 800,
      "height": 600,
      "title": "POP_UI_IM_08",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_08_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "309": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 400,
      "title": "POP_UI_IM_09",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_09_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_02"
        }
      ]
    },
    "310": {
      "insert_row": false,
      "remove_row": true,
      "width": 900,
      "height": 535,
      "title": "POP_UI_IM_10",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_10_RST_SAVE",
      "lookupArr": [
        {
          "name": "CAL_TP_ID",
          "code": "AVG_SUPPLY_LT_CAL_METHOD"
        }
      ]
    },
    "311": {
      "insert_row": false,
      "remove_row": true,
      "width": 900,
      "height": 535,
      "title": "POP_UI_IM_11",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_11_RST_SAVE",
      "lookupArr": [
        {
          "name": "CAL_TP_ID",
          "code": "AVG_TRANSF_COST_CAL_METHOD"
        }
      ]
    },
    "312": {
      "insert_row": false,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_12",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_12_RST_SAVE"
    },
    "313": {
      "insert_row": false,
      "remove_row": true,
      "width": 1200,
      "height": 535,
      "title": "POP_UI_IM_13",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_13_RST_SAVE",
      "lookupArr": [
        {
          "name": "TIME_UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "314": {
      "insert_row": false,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_14",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_14_RST_SAVE"
    },
    "317": {
      "insert_row": false,
      "remove_row": false,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_17",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_17_RST_SAVE"
    },
    "318": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_18",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_06"
        }
      ]
    },
    "319": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_19",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_05"
        }
      ]
    },
    "320": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_20",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_08"
        }
      ]
    },
    "321": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_21",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_09"
        }
      ]
    },
    "322": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_22",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_07"
        }
      ]
    },
    "323": {
      "insert_row": true,
      "remove_row": true,
      "width": 650,
      "height": 535,
      "title": "POP_UI_IM_23",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_23_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_11"
        }
      ],
      "lookupArr": [
        {
          "name": "CURCY_CD_ID",
          "code": "CURRENCY"
        }
      ]
    },
    "324": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 750,
      "title": "POP_UI_IM_24",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_24_RST_SAVE",
    },
    "325": {
      "insert_row": false,
      "remove_row": true,
      "width": 900,
      "height": 535,
      "title": "POP_UI_IM_25",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_25_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "326": {
      "insert_row": false,
      "remove_row": false,
      "width": 700,
      "height": 535,
      "title": "POP_UI_IM_26",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_26_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "327": {
      "insert_row": false,
      "remove_row": false,
      "width": 750,
      "height": 535,
      "title": "POP_UI_IM_27",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_26_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "328": {
      "insert_row": false,
      "remove_row": true,
      "width": 1200,
      "height": 535,
      "title": "POP_UI_IM_28",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_28_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_ID",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "329": {
      "insert_row": false,
      "remove_row": true,
      "width": 1200,
      "height": 700,
      "title": "POP_UI_IM_29",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_29_RST_SAVE",
      "lookupArr": [
        {
          "name": "CAL_TP_ID",
          "code": "AVG_MFG_LT_CAL_METHOD"
        }
      ]
    },
    "330": {
      "insert_row": false,
      "remove_row": true,
      "width": 1000,
      "height": 535,
      "title": "POP_UI_IM_30",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_30_RST_SAVE",
      "lookupArr": [
        {
          "name": "CAL_TP_ID",
          "code": "DEMAND_RATE_CAL_METHOD"
        }
      ]
    },
    "331": {
      "insert_row": false,
      "remove_row": true,
      "width": 950,
      "height": 535,
      "title": "POP_UI_IM_31",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_31_RST_SAVE",
      "lookupArr": [
        {
          "name": "CAL_TP_ID",
          "code": "EOQ_DECISION_RULE"
        }
      ]
    },
    "332": {
      "insert_row": false,
      "remove_row": true,
      "width": 1100,
      "height": 750,
      "title": "POP_UI_IM_32",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_32_RST_SAVE",
      "lookupArr": [
        {
          "name": "UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "333": {
      "insert_row": true,
      "remove_row": true,
      "width": 670,
      "height": 535,
      "title": "POP_UI_IM_33",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_18_RST_SAVE",
      "saveParams": [
        {
          "name": "SEGMT_DIM_CD",
          "value": "VAL_10"
        }
      ],
    },
    "334": {
      "insert_row": true,
      "remove_row": true,
      "width": 800,
      "height": 400,
      "title": "LEGACY_PLANT_MGMT",
      "saveUrl": "engine/mp/SRV_UI_CM_01_POP_334_S",
    },
    "335": {
      "insert_row": false,
      "remove_row": true,
      "width": 1000,
      "height": 535,
      "title": "POP_UI_IM_35",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_35_RST_SAVE",
      "lookupArr": [
        {
          "name": "TIME_UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "336": {
      "insert_row": false,
      "remove_row": true,
      "width": 900,
      "height": 535,
      "title": "POP_UI_IM_36",
      "loadUrl": "engine/mp/SRV_UI_IM_01_RST_LOAD",
      "saveUrl": "engine/mp/SRV_UI_IM_36_RST_SAVE",
      "lookupArr": [
        {
          "name": "TIME_UOM_NM",
          "code": "REF_TIME_UOM"
        }
      ]
    },
    "337": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 535,
      "title": "POP_UI_IM_37",
      "saveUrl": "engine/mp/SRV_UI_IM_37_RST_SAVE"
    },
    "339": {
      "insert_row": false,
      "remove_row": false,
      "width": 500,
      "height": 535,
      "title": "POP_UI_CM_01_339",
      "saveUrl": "engine/mp/SRV_UI_CM_01_POP_339_S",
      "lookupArr": [
        {
          "name": "ATTR_02",
          "code": "REF_TIME_UOM"
        }
      ],
    },
  },
  popupGrid1Items001: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, "width": "140" },
    { name: "CORPOR_ID", dataType: "text", headerText: "CORPOR_ID", visible: true, editable: false, "width": "100", styleCallback: newRowEditCellStyle },
    { name: "CORPOR_NM", dataType: "text", headerText: "CORPOR_NM", visible: true, editable: true, "width": "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, "width": "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, "width": "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, "width": "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, "width": "70" },
  ],
  popupGrid1Items002: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP", visible: false, editable: false },
    { name: "CORP_ID", dataType: "text", headerText: "CORPOR_NM", visible: true, editable: false, width: "140", useDropdown: true, lookupDisplay: true, styleCallback: newRowEditCellStyle },
    { name: "LOCAT_TP_ID", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: true, width: "110", useDropdown: true, lookupDisplay: true },
    { name: "LOCAT_LV", dataType: "number", headerText: "LOCAT_LV", visible: true, editable: true, width: "80" },
    { name: "LOCAT_LV_DESCRIP", dataType: "text", headerText: "LOCAT_LV_DESCRIP", visible: true, editable: true, width: "140" },
    { name: "DMND_INTG_YN", dataType: "boolean", headerText: "DMND_INTG_YN", visible: true, editable: true, width: "100" },
    { name: "INV_POLICY_TARGET_YN", dataType: "boolean", headerText: "INV_POLICY_TARGET_YN", visible: true, editable: true, width: "120" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items003: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "180" },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false, width: "180" },
    { name: "CONF_CD", dataType: "text", headerText: "REGION_CD", visible: true, editable: false, width: "200" },
    { name: "CONF_NM", dataType: "text", headerText: "REGION_NM", visible: true, editable: false, width: "200" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items004: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false, width: "180" },
    { name: "CONF_CD", dataType: "text", headerText: "COUNTRY_CD", visible: true, editable: false, width: "80" },
    { name: "CONF_NM", dataType: "text", headerText: "COUNTRY_NM", visible: true, editable: false, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items005: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "ATTR_NM", dataType: "text", headerText: "ATTR_NM", visible: true, editable: false, width: "100" },
    { name: "CONVN_NM", dataType: "text", headerText: "CONVN_NM", visible: true, editable: true, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items006: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "ITEM_LV", dataType: "text", headerText: "ITEM_LV", editable: false, width: "100" },
    { name: "ATTR_ID", dataType: "text", headerText: "ATTR_ID", visible: false, editable: true, width: "100" },
    { name: "ATTR_NM", dataType: "text", headerText: "ATTR_NM", visible: true, editable: false, width: "100", validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
    { name: "CONVN_NM", dataType: "text", headerText: "CONVN_NM", visible: true, editable: true, width: "100" },
    { name: "HRCY_YN", dataType: "boolean", headerText: "HRCY_YN", visible: false, editable: true, width: "70" },
    { name: "PARENT_ATTR_CONVN_NM", dataType: "text", headerText: "PARENT_ATTR_CONVN_NM", visible: false, editable: true, width: "100" },
    { name: "ROOT_LV_YN", dataType: "boolean", headerText: "ROOT_LV_YN", visible: false, editable: false, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items008: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_CD", visible: false, editable: false },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", validRules: [{ criteria: "required" }] },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "BASE_PLAN_UOM_YN", dataType: "boolean", headerText: "BASE_PLAN_UOM_YN", visible: true, editable: true, width: "120" },
    { name: "BASE_WEIGHT_UOM_YN", dataType: "boolean", headerText: "BASE_WEIGHT_UOM_YN", visible: true, editable: true, width: "120" },
    { name: "TIME_BUCKET_YN", dataType: "boolean", headerText: "TIME_BUCKET", visible: true, editable: true, width: "80" },
    { name: "ACTUAL_REF_YN", dataType: "boolean", headerText: "ACTUAL_REF_YN", visible: true, editable: true, width: "120" },
    { name: "TIME_UOM_YN", dataType: "boolean", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items009: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "PACKING_TP", dataType: "text", headerText: "PACKING_TP", visible: true, editable: true, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "BASE_PACKING_YN", dataType: "boolean", headerText: "BASE_PACKING_YN", visible: true, editable: true, width: "120" },
    { name: "WEIGHT", dataType: "number", headerText: "WEIGHT", visible: true, editable: true, width: "80" },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: false, editable: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items010: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, defaultValue: generateId() },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "PALLET_CD", dataType: "text", headerText: "PALLET_TP", visible: true, editable: false, width: "150", validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "BASE_PALLET_YN", dataType: "boolean", headerText: "BASE_PALLET_YN", visible: true, editable: true, width: "120" },
    { name: "WEIGHT", dataType: "number", headerText: "WEIGHT", visible: true, editable: true, width: "100" },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "70" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "70" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "70" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "70" },
  ],
  popupGrid1Items011: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "DIF_GRADE", visible: true, editable: true, width: "180" },
    { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items012: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "DIF_GRADE", visible: true, editable: true, width: "180" },
    { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items013: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "MAT_CONST_TP", visible: true, editable: false, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items014: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100" },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "USE_YN", dataType: "boolean", headerText: "DISCRT_YN", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "120" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "120" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "120" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "120" },
  ],
  popupGrid1Items015: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100" },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "USE_YN", dataType: "boolean", headerText: "DIVISBL_YN", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "120" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "120" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "120" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "120" },
  ],
  popupGrid1Items016: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "STOCK_POLICY", visible: true, editable: false, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "150" },
    { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: "150" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items017: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "number", headerText: "EFFICY", visible: true, editable: true, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items018: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "number", headerText: "YIELD", visible: true, editable: true, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items019: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "DELIVY_PLAN_POLICY_NM", visible: true, editable: false, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "150" },
    { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: "150" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items020: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "ROUT_COST_OPTIMZ", visible: true, editable: true, width: "200", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "150" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items021: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "PARTIAL_PLAN_YN", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items023: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "MAT_CONST_NM", visible: true, editable: false, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items024: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CATAGY_CD", dataType: "text", headerText: "CATAGY_CD", visible: false, editable: false },
    { name: "DUE_DATE_FNC", dataType: "number", headerText: "DUE_DATE_FNC", visible: true, editable: true, width: "120" },
    { name: "TIME_UOM_CD", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "120" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "120" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "120" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "120" },
  ],
  popupGrid1Items026: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false },
    { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: true, width: "150" },
    { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "100" },
    { name: "VIRTUAL_VEHICL_YN", dataType: "boolean", headerText: "VIRTUAL_VEHICL_YN", visible: true, editable: true, width: "150" },
    { name: "MIXLOAD_YN", dataType: "boolean", headerText: "MIXLOAD_YN", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items027: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "RES_GRP_CD", dataType: "text", headerText: "RES_GRP_CD", visible: true, editable: false, width: "140" },
    { name: "RES_GRP_DESCRIP", dataType: "text", headerText: "RES_GRP_DESCRIP", visible: true, editable: true, width: "180" },
    { name: "RES_GRP_TP", dataType: "text", headerText: "RES_GRP_TP", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "120" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "120" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "120" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "120" },
  ],
  popupGrid1Items028: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "UOM_ID", dataType: "text", headerText: "UOM_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", useDropdown: true, lookupDisplay: true, styleCallback: newRowEditCellStyle },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "100", styleCallback: newRowEditCellStyle },
    { name: "CATAGY_GRP", dataType: "text", headerText: "LOT_SIZE_GRP", visible: true, editable: true, width: "100" },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "GRP_NO", dataType: "number", headerText: "GRP_NO", visible: true, editable: true, width: "100" },
    { name: "LOTSIZE_CD", dataType: "text", headerText: "LOTSIZE_CD", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "80" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "80" },
    { name: "EFFICY", dataType: "number", headerText: "EFFICY", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "80" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "80" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "80" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "80" },
  ],
  popupGrid1Items029: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false },
    { name: "CONF_NM", dataType: "text", headerText: "RES_CAPA_CAL_CRITERIA", visible: true, editable: false, width: "220" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
    { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: "180" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items032: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "FROM_LOCAT_NM", dataType: "text", headerText: "FROM_LOCAT", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "FROM_LOCAT_LV", dataType: "text", headerText: "FROM_LOCAT_LV", visible: true, editable: false, width: "90" },
    { name: "TO_LOCAT_NM", dataType: "text", headerText: "TO_LOCAT", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "TO_LOCAT_LV", dataType: "text", headerText: "TO_LOCAT_LV", visible: true, editable: false, width: "90" },
    { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "BOD_LEADTIME_PERIOD", dataType: "text", headerText: "BOD_LEADTIME_PERIOD", visible: true, editable: true, width: "160" },
    { name: "BOD_LEADTIME_SEQ", dataType: "number", headerText: "BOD_LEADTIME_SEQ", visible: true, editable: true, width: "120" },
    { name: "LEADTIME_TP_NM", dataType: "text", headerText: "LEADTIME_TP", visible: true, editable: true, width: "90", useDropdown: true, lookupDisplay: true },
    { name: "LEADTIME_MGMT_YN", dataType: "boolean", headerText: "LEADTIME_MGMT_YN", visible: true, editable: true, width: "110" },
    { name: "TRANSFER_MGMT_YN", dataType: "boolean", headerText: "TRANSFER_MGMT_YN", visible: true, editable: true, width: "110" },
    { name: "LT_ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "70" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items033: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "FROM_LOCAT_TP", dataType: "text", headerText: "FROM_LOCAT", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "FROM_LOCAT_LV", dataType: "text", headerText: "FROM_LOCAT_LV", visible: true, editable: false, width: "100" },
    { name: "TO_LOCAT_TP", dataType: "text", headerText: "TO_LOCAT", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "TO_LOCAT_LV", dataType: "text", headerText: "TO_LOCAT_LV", visible: true, editable: false, width: "100" },
    { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items035: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LIMIT_FNC_TIME", dataType: "number", headerText: "LIMIT_FNC_TIME", visible: true, editable: true, width: "220" },
    { name: "TIME_UOM_NM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "150" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "150" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "150" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "150" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "150" },
  ],
  popupGrid1Items037: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "PRDUCT_ACTUAL_PERIOD", dataType: "number", headerText: "PRDUCT_ACTUAL_PERIOD", visible: true, editable: true, width: "150" },
    { name: "TIME_UOM_NM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items038: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CHANNEL_ID", dataType: "text", headerText: "CHANNEL_ID", visible: false, editable: false },
    { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, visible: true, editable: true, width: "120" },
    { name: "VMI_YN", dataType: "boolean", headerText: "VMI_YN", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items040: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "ACTUAL_PERIOD", dataType: "number", headerText: "ACTUAL_PERIOD", visible: true, editable: true, width: "120" },
    { name: "TIME_UOM_CD", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items042: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "180" },
    { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false, width: "180" },
    { name: "ITEM_TP", dataType: "text", headerText: "LEGACY_ITEM_TP", visible: true, editable: true, width: "180" },
    { name: "CONVN_NM", dataType: "text", headerText: "CONVN_NM", visible: true, editable: true, width: "180" },
    { name: "ITEM_TP_CD", dataType: "text", headerText: "ITEM_TP", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "120" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items043: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "PRDUCT_TP", dataType: "text", headerText: "PRDUCT_TP", visible: true, editable: true, width: "180" },
    { name: "PRDUCT_TP_DESC", dataType: "text", headerText: "PRDUCT_TP_DESC", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "120" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items044: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    {
      name: "CONF_NM", dataType: "text", headerText: "SETUP_JC", visible: true, width: "180",
      "displayCallback": function (grid, index, value) {
        return transLangKey(value);
      }
    },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "120" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items045: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "180" },
    { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: true, width: "120" },
    { name: "CUST_DELIVY_MODELING_YN", dataType: "boolean", headerText: "ACC_DELIVY_MODELING_YN", visible: true, editable: true, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items047: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "180" },
    { name: "WAREHOUSE_TP", dataType: "text", headerText: "WAREHOUSE_TP", visible: false, editable: false, width: "150" },
    { name: "WAREHOUSE_TP_NM", dataType: "text", headerText: "WAREHOUSE_TP", visible: true, editable: true, width: "150"  },
    { name: "LOAD_CAPA_MGMT_BASE", dataType: "text", headerText: "LOAD_CAPA_MGMT_BASE", visible: true, editable: true, width: "200"  },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items051: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "SIMUL_SCALE_RANGE", dataType: "number", headerText: "SL_RANGE", visible: true, editable: true, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items111: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_ID", dataType: "text", headerText: "CONF_ID", visible: false, editable: false },
    {
      name: "CONF_NM", dataType: "text", headerText: "SETUP_JC", visible: true, width: "180",
      "displayCallback": function (grid, index, value) {
        return transLangKey(value);
      }
    },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "180" },
  ],
  popupGrid1Items301: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "PLAN_SNRIO_MGMT_MST_ID", dataType: "text", headerText: "PLAN_SNRIO_MGMT_MST_ID", visible: false, editable: false  },
    { name: "MODULE_NM", dataType: "text", headerText: "MODULE_VAL", visible: true, editable: false, width: "180" },
    { name: "SNRIO_VER_ID", dataType: "text", headerText: "SCENARIO_VER", visible: true, editable: false, width: "110", button: "action" },
    { name: "SNRIO_DESCRIP", dataType: "text", headerText: "SCENARIO_DESCRIP", visible: true, editable: false, width: "240" },
    { name: "TIME_BUCKET", dataType: "text", headerText: "BASE_TIME_BUCKET", visible: true, editable: true, width: "130", useDropdown: true, lookupDisplay: true },
    { name: "STRT_DATE_TP", dataType: "text", headerText: "START_DATE_TP", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "DAY_OF_WEEK", dataType: "text", headerText: "DAY_OF_WEEK", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "STRT_TIME", dataType: "text", headerText: "STRT_TIME", visible: true, editable: true, width: "80" },
    { name: "DURA", dataType: "number", headerText: "ZONE1_DURATION", visible: true, editable: true, width: "130" },
    { name: "BUCKET_TP_VAL", dataType: "text", headerText: "BUCKET_TYPE", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true ,
      values: ["Variable", "Single"],
      labels: ["Variable", "Single"]
    },
    { name: "VAR_TIME_BUCKET", dataType: "text", headerText: "VARIABLE_TIME_BUCKET", visible: true, editable: false, width: "150", useDropdown: true, lookupDisplay: true,
      styleCallback: function (grid, dataCell) {
        let style = {};
        let bucketTpVal = grid.getValue(dataCell.index.itemIndex, "BUCKET_TP_VAL");

        if (bucketTpVal === "Variable") {
          style.editable = true;
          style.styleName = "editable-column";
        } else {
          style.editable = false;
        }
        return style;
      }
    },
    { name: "DURA2", dataType: "number", headerText: "ZONE2_DURATION", visible: true, editable: false, width: "130",
      styleCallback: function (grid, dataCell) {
        let style = {};
        let bucketTpVal = grid.getValue(dataCell.index.itemIndex, "BUCKET_TP_VAL");

        if (bucketTpVal === "Variable") {
          style.editable = true;
          style.styleName = "editable-column";
        } else {
          style.editable = false;
        }
        return style;
      }
    },
    { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "50" },
    { name: "STRT_DATE", dataType: "datetime", headerText: "ZONE1_STRT_DATE", visible: true, editable: true, width: "130", format: "yyyy-MM-dd" },
    { name: "STRT_DATE2", dataType: "datetime", headerText: "ZONE2_STRT_DATE", visible: true, editable: false, width: "130", format: "yyyy-MM-dd" },
    { name: "END_DATE", dataType: "datetime", headerText: "END_DATE", visible: true, editable: false, width: "100", format: "yyyy-MM-dd" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "130" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "130" },
  ],
  popupGrid1Items302: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "PERIOD_TP", dataType: "text", headerText: "PERIOD_TP", visible: true, editable: false, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "PERIOD", dataType: "number", headerText: "PERIOD", visible: true, editable: true, width: "100" },
    { name: "UOM_ID", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "WTFAR", dataType: "number", headerText: "WTFAR", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items303: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "QUADRANT_NM", dataType: "group", orientation: "horizontal", headerText: "QUADRANT_NM", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "BASE", dataType: "text", headerText: "BASE", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
        { name: "COV_BDV", dataType: "number", headerText: "COV_BDV", visible: true, editable: true, width: "100" },
        { name: "SALES_QTY_BDV", dataType: "number", headerText: "SALES_QTY_BDV", visible: true, editable: true, width: "100" },
        { name: "REVENUE_BDV", dataType: "number", headerText: "REVENUE_BDV", visible: true, editable: true, width: "100" },
      ]
    },
    {
      name: "SVC_LV", dataType: "group", orientation: "horizontal", headerText: "SVC_LV", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "SVC_LV_01", dataType: "number", headerText: "SVC_LV_01", visible: true, editable: true, width: "80" },
        { name: "SVC_LV_02", dataType: "number", headerText: "SVC_LV_02", visible: true, editable: true, width: "80" },
        { name: "SVC_LV_03", dataType: "number", headerText: "SVC_LV_03", visible: true, editable: true, width: "80" },
        { name: "SVC_LV_04", dataType: "number", headerText: "SVC_LV_04", visible: true, editable: true, width: "80" },
      ]
    },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items304: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "PERIOD_TP", dataType: "text", headerText: "PERIOD_TP", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "PERIOD", dataType: "group", orientation: "horizontal", headerText: "PERIOD", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "PERIOD", dataType: "number", headerText: "PERIOD", visible: true, editable: true, width: "100" },
        { name: "UOM_ID", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
        { name: "WTFAR", dataType: "number", headerText: "WTFAR", visible: true, editable: true, width: "100" },
      ]
    },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items305_tabGrid1: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "INV_CLSS_TP", dataType: "text", headerText: "SABC_CLASS", visible: true, editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "STOCK_GRADE_BASE", dataType: "group", orientation: "horizontal", headerText: "STOCK_GRADE_BASE", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "UPPR_VAL", dataType: "number", headerText: "UPPR_VAL", visible: true, editable: true, width: "100" },
        { name: "LOWR_VAL", dataType: "number", headerText: "LOWR_VAL", visible: true, editable: true, width: "100" },
      ]
    },
    { name: "SVC_LV", dataType: "number", headerText: "SVC_LV", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items305_tabGrid2: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "INV_CLSS_TP", dataType: "text", headerText: "SABC_CLASS", visible: true, editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "STOCK_GRADE_BASE", dataType: "group", orientation: "horizontal", headerText: "STOCK_GRADE_BASE", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "UPPR_VAL", dataType: "number", headerText: "UPPR_VAL", visible: true, editable: true, width: "100" },
        { name: "LOWR_VAL", dataType: "number", headerText: "LOWR_VAL", visible: true, editable: true, width: "100" },
      ]
    },
    { name: "SVC_LV", dataType: "number", headerText: "SVC_LV", visible: true, editable: true, width: "100" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items305_tabGrid3: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "SABC_CAL_BASE_ID", dataType: "text", headerText: "SABC_CAL_BASE", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items306: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "TARGET_SVC_CAL_BASE", dataType: "text", headerText: "TARGET_SVC_CAL_BASE", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items307: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_ID", dataType: "text", headerText: "CONF_ID", visible: false, editable: false },
    { name: "SVC_LV", dataType: "number", headerText: "SVC_LV", visible: true, editable: true, width: "110" },
    { name: "SAFTFCT", dataType: "number", headerText: "SAFTFCT", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items308: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "ACTUAL_PERIOD", dataType: "number", headerText: "ACTUAL_PERIOD", visible: true, editable: true, width: "100" },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items309: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, defaultValue: generateId() },
    { name: "MGMT_NM", dataType: "text", headerText: "GRADE", visible: true, editable: true, width: "100" },
    { name: "SEQ", dataType: "number", headerText: "DISP_SEQ", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items310: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "CAL_TP_ID", dataType: "text", headerText: "CAL_TP_ID", visible: true, editable: true, width: "200", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items311: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "CAL_TP_ID", dataType: "text", headerText: "CAL_TP_ID", visible: true, editable: true, width: "200", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items312: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "INV_KEEPING_COST_RATE", dataType: "number", headerText: "STOCK_KEEPING_COST_RATE", visible: true, editable: true, width: "110" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items313: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "SHIPPING_ACTUAL_PERIOD", dataType: "number", headerText: "SHIPPING_ACTUAL_PERIOD", visible: true, editable: true, width: "100" },
    { name: "TIME_UOM_NM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "90", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items314: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "SALES_PROFIT_RATE", dataType: "number", headerText: "SALES_PROFIT_RATE", visible: true, editable: true, width: "140" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items317: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "SEGMT_DIM_CD", dataType: "text", headerText: "SEGMT_DIM_CD", visible: false, editable: false, width: "160" },
    { name: "SEGMT_DIM_NM", dataType: "text", headerText: "SEGMT_DIM_NM", visible: true, editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "PRIORT", dataType: "number", headerText: "SEQ", visible: true, editable: true, width: "80" },
    { name: "PRIM", dataType: "boolean", headerText: "PRIM", visible: true, editable: true, width: "80" },
    { name: "SECOND", dataType: "boolean", headerText: "SECONDARY", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items318: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items319: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items320: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],

  popupGrid1Items321: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items322: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_NM", visible: false, editable: true, width: "120" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items323: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_NM", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items324: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_LOCAT_NM", dataType: "text", headerText: "STOCK_LOCAT_NM", visible: true, editable: false, width: "120", mergeRule: { criteria: "value" } },
    { name: "STOCK_QTY_TP", dataType: "text", headerText: "STOCK_QTY_TP", visible: true, editable: true, width: "120" },
    { name: "PLAN_YN", dataType: "boolean", headerText: "PLAN_YN", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items325: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "ACTUAL_PERIOD", dataType: "number", headerText: "ACTUAL_PERIOD", visible: true, editable: true, width: "100" },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items326: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "80" },
    { name: "ATTR_VAL", dataType: "text", headerText: "ATTR_VAL", visible: true, editable: false, width: "100" },
    { name: "INV_PERIOD_VAL", dataType: "text", headerText: "INV_PERIOD_VAL", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items327: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "80" },
    { name: "ATTR_VAL", dataType: "text", headerText: "ATTR_VAL", visible: true, editable: false, width: "100" },
    { name: "INV_PERIOD_VAL", dataType: "text", headerText: "INV_PERIOD_VAL", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "100" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "100" },
    { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items328: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "PERIOD_TP_ID", dataType: "text", headerText: "PERIOD_TP_ID", visible: false, editable: false },
    { name: "PERIOD_TP", dataType: "text", headerText: "PERIOD_TP", editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "PERIOD_DEFINE", dataType: "group", orientation: "horizontal", headerText: "PERIOD_DEFINE", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "PERIOD", dataType: "number", headerText: "PERIOD", visible: true, editable: true, width: "100" },
        { name: "UOM_ID", dataType: "text", headerText: "UOM_NM", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true },
      ]
    },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items329: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "CAL_TP_ID", dataType: "text", headerText: "CAL_TP_ID", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items330: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "CAL_TP_ID", dataType: "text", headerText: "CAL_TP_ID", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items331: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "CAL_TP_ID", dataType: "text", headerText: "CAL_TP_ID", visible: true, editable: true, width: "180", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items332: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "PERIOD_TP_ID", dataType: "text", headerText: "PERIOD_TP_ID", visible: false, editable: false },
    { name: "PERIOD_TP", dataType: "text", headerText: "PERIOD_TP", editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "PERIOD_DEFINE", dataType: "group", orientation: "horizontal", headerText: "PERIOD_DEFINE", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "PERIOD", dataType: "number", headerText: "PERIOD", visible: true, editable: true, width: "80" },
        { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", useDropdown: true, lookupDisplay: true  },
      ]
    },

    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items333: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "STOCK_MGMT_SEGMT_DIM_MST_ID", dataType: "text", headerText: "STOCK_MGMT_SEGMT_DIM_MST_ID", visible: false, editable: false },
    { name: "UPPR_CATAGY_NM", dataType: "text", headerText: "UPPR_CATAGY_NM", visible: true, editable: true, width: "100" },
    { name: "FROM_QTY", dataType: "number", headerText: "FROM_QTY", visible: true, editable: true, width: "80" },
    { name: "TO_QTY", dataType: "number", headerText: "TO_QTY", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items334: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_ID", dataType: "text", headerText: "CONF_ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "PLANT_CD", visible: true, editable: false, width: "180", styleCallback: newRowEditCellStyle },
    { name: "CONF_NM", dataType: "text", headerText: "PLANT_NM", visible: true, editable: true, width: "180" },
    { name: "DESCRIP", dataType: "text", headerText: "PLANT_DESCRIP", visible: true, editable: true, width: "180" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
  ],
  popupGrid1Items335: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "SHIPPING_ACTUAL_PERIOD", dataType: "number", headerText: "SHIPPING_ACTUAL_PERIOD", visible: true, editable: true, width: "100" },
    { name: "TIME_UOM_NM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "90", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items336: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false },
    { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
    { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
    { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
    { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150" },
    { name: "SHIPPING_ACTUAL_PERIOD", dataType: "number", headerText: "SHIPPING_ACTUAL_PERIOD", visible: true, editable: true, width: "100" },
    { name: "TIME_UOM_NM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "90", useDropdown: true, lookupDisplay: true },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "100" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "100" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "100" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "100" },
  ],
  popupGrid1Items337: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "CONF_CD", dataType: "text", headerText: "SELECT_CRITERIA", visible: true, editable: false, width: "120" },
    { name: "ATTR_01", dataType: "text", headerText: "VAL", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "120" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],
  popupGrid1Items339: [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
    { name: "ATTR_01", dataType: "number", headerText: "ACTUAL_PERIOD", visible: true, editable: true, width: "80"},
    { name: "ATTR_02", dataType: "text", headerText: "ACTUAL_PERIOD", visible: true, editable: true, width: "80", useDropdown: true, lookupDisplay: true},
    { name: "ACTV_YN", dataType: "boolean", headerText: "TIME_UOM_NM", visible: false, editable: false, width: "120" },
    { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "180" },
    { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "180" },
    { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "180" },
    { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "180" },
  ],

}

export default generalConfigConst;
