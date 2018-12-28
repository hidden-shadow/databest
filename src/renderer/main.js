import "../../static/styles.scss"

import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'

import App from './App'
import router from './router'
import { serializeToYaml } from "builder-util";

// import VueCodemirror from 'vue-codemirror'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/lib/codemirror.css'

// // theme css
// import 'codemirror/theme/paraiso-light.css'
// // active-line.js
// import 'codemirror/addon/selection/active-line.js'
// // styleSelectedText
// import 'codemirror/addon/selection/mark-selection.js'
// import 'codemirror/addon/search/searchcursor.js'
// // highlightSelectionMatches
// import 'codemirror/addon/scroll/annotatescrollbar.js'
// import 'codemirror/addon/search/matchesonscrollbar.js'
// import 'codemirror/addon/search/searchcursor.js'
// import 'codemirror/addon/search/match-highlighter.js'

Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(ElementUI, { locale })

Vue.use(require('vue-shortkey'))

const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

window.openWindow = function () {
	let childWindow = new BrowserWindow({
		width: 600,
		height: 500,
		title: 'New Connection'
	});

	return childWindow;
}

// let win = openWindow();
// win.loadURL('https://google.com')
// win.querySelector('body').innerHtml = 'test';

// const dialog = electron.remote.dialog
// console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))

// window.jQuery = window.$ = require('jquery');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// import Mysql from './../classes/Mysql';
// const mysql_driver = new Mysql();

// mysql_driver.query('SELECT * FROM users').then(function(response) {
// 	console.log(response);
// }).catch(function(error) {
// 	console.log(error);
// });

/* eslint-disable no-new */

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')