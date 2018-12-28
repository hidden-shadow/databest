<template>
	<div id="wrapper">
		<div id="top-section">
			<el-row>
				<el-col :span="5">
					<div id="top-left-section">
						<div class="top-section-btns">
							<el-button size="mini" class="fleft" @click="new_connection()"><i class="far fa-cog"></i></el-button>

							<el-button size="mini" class="fright" @click="new_script_window()"><i class="far fa-edit"></i></el-button>
						</div>
					</div>
				</el-col>
				<el-col :span="19">
					<div id="top-right-section">
						<el-col :span="19">
							<div>
								
							</div>
						</el-col>
						<el-col :span="24">
							<div class="top-section-btns">
								<el-checkbox-group v-model="top_right_btns_selected" size="mini">
									<el-checkbox-button v-for="btn in top_right_btns" :label="btn.id" :key="btn.id">
										<span v-html="btn.text"></span>
									</el-checkbox-button>
								</el-checkbox-group>
							</div>
						</el-col>
					</div>
				</el-col>
			</el-row>
		</div>

		<main>
			<el-row>
				<el-col :span="5">
					<div id="main-panel">
						<el-menu default-active="1-1" id="navbar-menu" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
							<el-submenu :index="nav_item.index" v-for="(nav_item, nav_index) in nav_items" :label="nav_item.name" :key="nav_item.name">
								<template slot="title">
									<i class="far fa-database"></i>
									<span>{{ nav_item.name }}</span>
								</template>
								<el-submenu :index="nav_item.index+'-1'">
									<template slot="title"><i class="far fa-table"></i> <span>Tables</span></template>
									<el-menu-item :index="nav_item.index+'-1-1'" v-on:click="getTables(nav_index, 'platform_crm')"><i class="fas fa-sync-alt"></i> load tables</el-menu-item>
									<el-menu-item :index="table.index" v-on:click="getTableView(table.name)"  v-for="table in nav_item.tables" :label="table.name" :key="table.name"><i class="fas fa-chevron-double-right"></i> {{ table.name }}</el-menu-item>
								</el-submenu>
								<el-menu-item :index="nav_item.index+'-2'"><i class="far fa-list-alt"></i> <span>Views</span></el-menu-item>
								<el-menu-item :index="nav_item.index+'-3'"><i class="far fa-function"></i> <span>Functions</span></el-menu-item>
								<el-menu-item :index="nav_item.index+'-4'"><i class="far fa-scroll"></i> <span>Queries</span></el-menu-item>
								<el-menu-item :index="nav_item.index+'-5'"><i class="far fa-file-chart-line"></i> <span>Reports</span></el-menu-item>
								<el-menu-item :index="nav_item.index+'-6'"><i class="far fa-undo-alt"></i> <span>Backups</span></el-menu-item>
							</el-submenu>
						</el-menu>
					</div>
				</el-col>

				<el-col :span="19">
					<div id="main-section">
						<el-tabs v-model="tabsValue" type="card" closable @tab-remove="removeTab">
							<el-tab-pane v-for="(tab, tab_index) in tabs" :key="tab.name" :label="tab.title" :name="tab.name">
								<div class="main-table-wrapper">
									<div v-if="tab.type == 'script'">
										<el-button class="sql-formatter-btn" size="mini" @click="sql_formatter(tab_index)">Formatter</el-button>
										<div @keyup.enter="script_exec($event, tab_index)">
											<codemirror v-model="tab.sql" :options="cmOptions"></codemirror>
										</div>
									</div>
									<div v-else>
										<div>
											<el-input class="quick-sql" placeholder="" v-model="tab.sql" @keyup.enter.native="quick_sql_run(tab_index)" size="small"></el-input>
										</div>
									</div>

									<el-table ref="multipleTable" :data="tab.table.data" size="mini" stripe border highlight-current-row empty-text="no data to show!" @sort-change="tableSortChange" @selection-change="handleSelectionChange">
										<el-table-column type="selection" width="55" sortable></el-table-column>
										<el-table-column v-for="column in tab.table.columns" :label="column.name" :key="column.name" :property="column.name" resizable sortable :min-width="column.width">
											<template slot-scope="scope">
												<div v-if="column.type == 7">
													<el-date-picker
														:name="scope.$index+'-'+column.name"
														type="datetime"
														placeholder="Select date and time"
														size="small"
														editable
														:default-value="scope.row[column.name]">
													</el-date-picker>
												</div>
												<div v-else>
													{{ scope.row[column.name] }}
												</div>
											</template>
										</el-table-column>
									</el-table>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-col>
			</el-row>
		</main>

		<el-dialog
			v-if="connection_dialog.visible"
			title="Create new connection"
			:visible.sync="connection_dialog.visible"
			width="50%"
			:before-close="handleClose"
			id="connection-dialog">

				<el-steps :active="connection_dialog.active" align-center>
					<el-step v-for="step in connection_dialog.steps" :label="step.key" :key="step.key" :title="step.title"></el-step>
				</el-steps>
				
				<div class="connection-dialog-content">
					<div :class="connection_dialog.steps[0].active">
						<el-row class="input-row" style="margin-bottom: 20px;">
							<el-col :span="4" style="margin-bottom: 5px;">
								<span class="input-label">Connection name</span>
							</el-col>
							<el-col :span="24">
								<el-input
									size="small"
									placeholder="Connection name"
									v-model="connection_dialog.name">
								</el-input>
							</el-col>
						</el-row>

						<strong>Select connection type</strong>

						<ul class="connection-type">
							<li v-for="(type, type_index) in connection_types" :key="type_index" :class="'connection-item ' + type.active" @click="connection_dialog_type(type_index)"><img class="connection-icon" :src="'../../../static/images/' + type.icon"> {{ type.name }}</li>
						</ul>
					</div>
					
					<div :class="connection_dialog.steps[1].active">
						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Server Host</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="localhost"
									v-model="connection_dialog.general.host">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Port</span>
							</el-col>
							<el-col :span="6">
								<el-input
									size="small"
									placeholder="3306"
									v-model="connection_dialog.general.port">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Database</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Database"
									v-model="connection_dialog.general.database">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Username</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Username"
									v-model="connection_dialog.general.username">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Password</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Password"
									v-model="connection_dialog.general.password">
								</el-input>
							</el-col>
						</el-row>
					</div>

					<div :class="connection_dialog.steps[2].active">
						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Host</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Host"
									v-model="connection_dialog.ssl.host">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Username</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Username"
									v-model="connection_dialog.ssl.username">
								</el-input>
							</el-col>
						</el-row>

						<el-row class="input-row">
							<el-col :span="4">
								<span class="input-label">Password</span>
							</el-col>
							<el-col :span="15">
								<el-input
									size="small"
									placeholder="Password"
									v-model="connection_dialog.ssl.password">
								</el-input>
							</el-col>
						</el-row>
					</div>
				</div>

				<span slot="footer" class="dialog-footer">
					<el-button v-for="(button, btn_index) in connection_dialog.buttons" :key="btn_index" size="mini" :type="button.type" @click="connection_dialog_action(btn_index)" v-if="button.visible">{{ button.text }}</el-button>
				</span>
		</el-dialog>
	</div>
</template>

<script>
	import { Loading } from 'element-ui'
	import { setTimeout } from 'timers'

	import Mysql from './../../classes/Mysql';
	const mysql_driver = new Mysql();

	import sqlFormatter from "sql-formatter";

	const fs = require('fs');

	import { codemirror } from 'vue-codemirror'

	import 'codemirror/lib/codemirror.css'

	import 'codemirror/mode/javascript/javascript.js'
	import 'codemirror/theme/base16-dark.css'
	import 'codemirror/mode/sql/sql.js'

	import CodeMirror from 'codemirror'
	CodeMirror.defineMode('mymode', () => {
	return {
		token(stream, state) {
		if (stream.match("const")) {
			return "style1"
		} else if (stream.match("bbb")) {
			return "style2"
		} else {
			stream.next()
			return null
		}
		}
	}
	})
	
	export default {
		components: {
			codemirror
		},
		
		data() {
			return {
				cmOptions: {
					tabSize: 4,
					mode: 'text/x-mysql',
					theme: 'base16-dark',
					lineNumbers: true,
					line: true,
				},
	  
				// Navigation
				nav_items: [
					{
						index: '0',
						name: 'TGJU Crm',
						tables: []
					},
					{
						index: '1',
						name: 'TGJU Platform',
						tables: []
					},
					{
						index: '2',
						name: 'TGJU Mono',
						tables: []
					}
				],

				// Tables
				multipleSelection: [],

				// Top Right Buttons
				top_right_btns: [{
					id: 1,
					text: '<i class="far fa-angle-left"></i>'
				}, {
					id: 2,
					text: '<i class="far fa-angle-right"></i>'
				}],
				top_right_btns_selected: [1],


				// Top Left Buttons
				top_left_btns: [{
					id: 1,
					text: '<i class="far fa-cog"></i>'
				}, {
					id: 2,
					text: '<i class="far fa-eye"></i>'
				}, {
					id: 3,
					text: '<i class="far fa-search"></i>'
				}],
				top_left_btns_selected: [],


				// Tabs
				tabsValue: '',
				tabs: [],
				tabIndex: 0,

				connection_types: [
					{
						active: '',
						name: 'MariaDB',
						icon: 'mariadb-icon.svg',
					},{
						active: '',
						name: 'MySQL',
						icon: 'mysql-icon.svg',
					},{
						active: '',
						name: 'PostgreSQL',
						icon: 'postgresql-icon.svg',
					},{
						active: '',
						name: 'SQLite',
						icon: 'sqlite-icon.svg',
					},{
						active: '',
						name: 'Oracle',
						icon: 'oracle-icon.svg',
					}
				],

				connection_dialog_source: {
					visible: false,
					active: 0,
					name: '',
					type: '',
					steps: [{
						key: 0,
						title: 'connection type',
						active: 'active',
					}, {
						key: 1,
						title: 'connection settings',
						active: '',
					}, {
						key: 2,
						title: 'ssl settings',
						active: '',
					}],
					buttons: {
						cancel: {
							visible: true,
							text: 'Cancel',
							type: 'default',
						},
						back: {
							visible: false,
							text: 'Back',
							type: 'primary',
						},
						next: {
							visible: true,
							text: 'Next',
							type: 'primary',
						},
						finish: {
							visible: false,
							text: 'Finish',
							type: 'success',
						}
					},
					general: {
						host: '',
						port: '',
						database: '',
						username: '',
						password: '',
					},
					ssl: {

					}
				},

				connection_dialog: {

				}
			}
		},

		methods: {
			onCmReady(cm) {
				console.log('the editor is readied!', cm)
			},
			onCmFocus(cm) {
				console.log('the editor is focus!', cm)
			},
			onCmCodeChange(newCode) {
				console.log('this is new code', newCode)
				this.code = newCode
			},

			// Tables
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			tableSortChange(sort) {
				let tab_index;
				this.tabs.forEach( (tab, key) => {
					if ( tab.name == this.tabsValue ) {
						tab_index = key;
					}
				});

				let sql = this.tabs[tab_index].sql;
				let sort_dir = sort.order == 'ascending' ? 'ASC' : 'DESC';
				sql = sql.replace(/( LIMIT.*)/, ` ORDER BY \`${sort.prop}\` ${sort_dir} `+"$1")
				this.tabs[tab_index].sql = sql;
				this.quick_sql_run(tab_index);
			},


			new_script_window() {
				let tab_index = this.addTab('script', 'script');
			},

			new_connection() {
				let source = this.getObject('connection_dialog_source');
				this.connection_dialog = source;
				this.connection_dialog.visible = true;
			},

			connection_dialog_reset() {
				this.connection_dialog = {};
			},

			getObject(key) {
				return JSON.parse(JSON.stringify(this[key]));
			},

			connection_dialog_type(type_index) {
				let _this = this;
				_this.connection_dialog.type = _this.connection_types[type_index].name;

				for ( let item of this.connection_types ) {
					item.active = ( item.name == _this.connection_dialog.type ) ? 'active' : '';
				}
			},

			connection_dialog_action(action) {
				if ( action == 'next' ) {
					this.connection_dialog.active++
				} else if ( action == 'back' ) {
					this.connection_dialog.active--;
				} else if ( action == 'cancel' ) {
					this.connection_dialog_reset();
					return;
				} else if ( action == 'finish' ) {
					let new_connection = {
						name: this.connection_dialog.name,
						type: this.connection_dialog.type,
						general: this.connection_dialog.general,
						ssl: this.connection_dialog.ssl,
					};
					this.store_connections(new_connection);
					this.connection_dialog_reset();
					return;
				}
				
				if ( this.connection_dialog.active == 0 ) {
					this.connection_dialog.buttons.back.visible = false;
					this.connection_dialog.buttons.next.visible = true;
					this.connection_dialog.buttons.finish.visible = false;
				} else if ( this.connection_dialog.steps.length - 1 == this.connection_dialog.active ) {
					this.connection_dialog.buttons.next.visible = false;
					this.connection_dialog.buttons.back.visible = true;
					this.connection_dialog.buttons.finish.visible = true;
				} else {
					this.connection_dialog.buttons.next.visible = true;
					this.connection_dialog.buttons.back.visible = true;
					this.connection_dialog.buttons.finish.visible = false;
				}

				this.connection_dialog_content();
			},

			connection_dialog_content() {
				let _this = this;
				for ( let item of this.connection_dialog.steps ) {
					item.active = ( item.key == _this.connection_dialog.active ) ? 'active' : '';
				}
			},

			store_data() {
				let data = {};

				data['nav_items'] = this.nav_items;
				
				data['tabs'] = this.tabs;
				data['tabsValue'] = this.tabsValue;
				data['tabIndex'] = this.tabIndex;

				data = JSON.stringify(data);
				
				fs.writeFile('data.json', data, (err) => {  
					if (err) throw err;
				});
			},

			restore_data() {
				let data = fs.readFileSync('data.json');
				if ( !data ) return;
				
				data = JSON.parse(data);

				if ( data['nav_items'] ) this.nav_items = data['nav_items'];
				
				if ( data['tabs'] ) this.tabs = data['tabs'];
				if ( data['tabsValue'] ) this.tabsValue = data['tabsValue'];
				if ( data['tabIndex'] ) this.tabIndex = data['tabIndex'];
			},

			// restore_connections() {
			// 	let connections = fs.readFileSync('connections.json');
			// 	if ( !connections ) return;
				
			// 	data = JSON.parse(data);

			// 	if ( data['nav_items'] ) this.nav_items = data['nav_items'];
				
			// 	if ( data['tabs'] ) this.tabs = data['tabs'];
			// 	if ( data['tabsValue'] ) this.tabsValue = data['tabsValue'];
			// 	if ( data['tabIndex'] ) this.tabIndex = data['tabIndex'];
			// },

			store_connections(new_connection) {
				fs.readFile("connections.json", "utf8", function(err, connections) {
					if (err) throw err;
					
					if ( connections ) {
						connections = JSON.parse(connections);
					} else {
						connections = [];
					}

					connections.push(new_connection);

					connections = JSON.stringify(connections);
					
					fs.writeFile('connections.json', connections, (err) => {  
						if (err) throw err;
					});
				});
			},

			// Query
			script_exec(e, tab_index) {
				console.log(this.nav_items);
				if ( !e.ctrlKey ) return;
				this.quick_sql_run(tab_index);
			},

			sql_formatter(tab_index) {
				this.tabs[tab_index].sql = sqlFormatter.format(this.tabs[tab_index].sql);
			},

			quick_sql_run(tab_index) {
				let _this = this;
				let sql_run_loading = Loading.service({
					target: '#main-section',
					text: 'running the sql ...'
				});

				let sql = _this.tabs[tab_index].sql;

				mysql_driver.query(sql).then(function(response) {
					sql_run_loading.close();

					if ( response.error ) {
						alert(response.error);
					} else {
						let i = 0;
						_this.tabs[tab_index].table.columns = [];
						for ( let field of response.fields ) {
							let width = 100;
							if ( field.name == 'id' ) width = 100;
							else if ( field.columnType == 7 ) width = 250;

							_this.tabs[tab_index].table.columns[i] = {
								name: field.name,
								type: field.columnType,
								width: width,
							};
							i++;
						}

						i = 0;
						_this.tabs[tab_index].table.data = [];
						for ( let row of response.results ) {
							let this_row = {};
							for ( let col in row ) {
								this_row[col] = _this.truncate_str(row[col]);
							}
							_this.tabs[tab_index].table.data[i] = this_row;
							i++;
						}
					}
				}).catch(function(error) {
					alert(error);
				});
			},
			getTables(nav_index, db_name) {
				let _this = this;

				mysql_driver.getTables(db_name).then(function(response) {
					if ( response.error ) {
						alert(response.error);
					} else {
						let i = 0;
						_this.nav_items[nav_index].tables = [];
						for ( let table of response.results ) {
							_this.nav_items[nav_index].tables[i] = {
								index: `1-1-${i+2}`,
								name: table.table_name,
							};
							i++;
						}
					}
				}).catch(function(error) {
					alert(error);
				});
			},
			getTableView(tb_name) {
				let tab_index = this.addTab(tb_name, 'table');
				this.tabs[tab_index].sql = `SELECT * FROM ${tb_name} LIMIT 50`;
				this.quick_sql_run(tab_index);
			},

			// Navigation
			handleNodeClick(data) {
			},
			handleOpen(key, keyPath) {
			},
			handleClose(key, keyPath) {
			},

			// Tabs
			addTab(tabName, type) {
				let newTabName = ++this.tabIndex + '';
				this.tabs.push({
					title: tabName,
					name: newTabName,
					content: '',
					type,
					sql: '',
					table: {
						columns: [],
						data: []
					}
				});
				this.tabsValue = newTabName;

				return this.tabs.length - 1;
			},
			removeTab(targetName) {
				let tabs = this.tabs;
				let activeName = this.tabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}

				this.tabsValue = activeName;
				this.tabs = tabs.filter(tab => tab.name !== targetName);
			},

			// Others
			truncate_str(string) {
				if ( typeof string == 'string' && string.length > 100 )
					return string.substring(0,5)+'...';
				else
					return string;
			}
		},
		computed: {
			codemirror() {
			return this.$refs.myCm.codemirror
			}
		},

		beforeMount() {
			this.restore_data();

			setTimeout(() => {
				setInterval(() => {
					this.store_data();
				}, 1000);
			}, 2000);
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>