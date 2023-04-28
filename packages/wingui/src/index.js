import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'realgrid/dist/realgrid-style.css'
import * as serviceWorker from './serviceWorker';
import lo from '@zionex/wingui-core/src/lang/LanguageObject';
import authentication from '@zionex/wingui-core/src/service/Authentication';
import baseURI from '@zionex/wingui-core/src/utils/baseURI';
import co from '@zionex/wingui-core/src/component/viewconfig/ViewContentLoader';
import com from '@zionex/wingui-core/src/component/viewconfig/ViewComponentManager'
import vom from '@zionex/wingui-core/src/component/viewconfig/ViewObjectManager';
import vsm from '@zionex/wingui-core/src/component/viewconfig/ViewServiceManager';
import menu from '@zionex/wingui-core/src/service/Menu';
import getHeaders, { getCookie } from '@zionex/wingui-core/src/utils/getHeaders';
import settings, { initSettings } from '@zionex/wingui-core/src/common/settings';
import axios from 'axios';
import permission from '@zionex/wingui-core/src/service/Permission';
import feather from 'feather-icons';
import * as Icon from 'react-feather';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.css'

import flatpickr from "flatpickr";
window.flatpickr
import "flatpickr/dist/flatpickr.min.css";

import App from './App';

import {
  Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend
} from 'chart.js';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

if (sessionStorage.getItem('token')) {
  useUserStore.getState().setUserInfo();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export * from '@zionex/wingui-core/src/common/const';
export * from '@zionex/wingui-core/src/utils/common';
export * from '@zionex/wingui-core/src/component/grid/grid';
export * from '@zionex/wingui-core/src/component/gantt/gantt';
export * from '@zionex/wingui-core/src/component/kendo/kendo'
export * from '@zionex/wingui-core/src/lang/i18n-func';
export {
  Icon,
  authentication,
  baseURI,
  co,
  com,
  vom,
  vsm,
  lo,
  menu,
  getHeaders,
  settings,
  initSettings,
  permission,
  axios,
  feather,
  flatpickr,
  getCookie
};


//for VueJS support
export * from "@zionex/wingui-viewconfig/src/viewconfig/component/grid/gridFunc";

export * from "@zionex/wingui-viewconfig/src/vue/utils";
export * from '@zionex/wingui-viewconfig/src/vue/i18n';
export * from '@zionex/wingui-viewconfig/src/vue/utils';
export * from '@zionex/wingui-viewconfig/src/vue/grid';
export * from '@zionex/wingui-viewconfig/src/vue/excel/import';
export * from '@zionex/wingui-viewconfig/src/vue/excel/export';
export * from '@zionex/wingui-viewconfig/src/vue/pageNavigator';