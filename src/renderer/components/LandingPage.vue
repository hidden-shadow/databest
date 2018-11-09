<template>
	<div id="wrapper">
		<div id="top-section">
			<el-row>
				<el-col :span="5">
					<div id="top-left-section">
						<div class="top-section-btns">
							<el-checkbox-group v-model="top_left_btns_selected" size="mini">
								<el-checkbox-button v-for="btn in top_left_btns" :label="btn.id" :key="btn.id">
									<span v-html="btn.text"></span>
								</el-checkbox-button>
							</el-checkbox-group>

							<el-button size="mini" class="fright" v-click=""><i class="far fa-cog"></i></el-button>
						</div>
					</div>
				</el-col>
				<el-col :span="19">
					<div id="top-right-section">
						<el-col :span="19">
							<div>
								<el-input id="quick-sql" placeholder="SELECT * FROM cards WHERE id > 5" v-model="quick_sql" @keyup.enter.native="quick_sql_run()">
									<template slot="prepend">cards</template>
								</el-input>
							</div>
						</el-col>
						<el-col :span="5">
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
						<!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->

						<el-menu default-active="1-1" id="navbar-menu" @open="handleOpen" @close="handleClose" background-color="#545c64"
						 text-color="#fff" active-text-color="#ffd04b">
							<el-submenu index="1">
								<template slot="title">
								<i class="far fa-database"></i>
									<span>TGJU Server Mono</span>
								</template>
								<el-menu-item index="1-1"><i class="far fa-table"></i> <span>Tables</span></el-menu-item>
								<el-menu-item index="1-2"><i class="far fa-list-alt"></i> <span>Views</span></el-menu-item>
								<el-menu-item index="1-3"><i class="far fa-function"></i> <span>Functions</span></el-menu-item>
								<el-menu-item index="1-4"><i class="far fa-scroll"></i> <span>Queries</span></el-menu-item>
								<el-menu-item index="1-5"><i class="far fa-file-chart-line"></i> <span>Reports</span></el-menu-item>
								<el-menu-item index="1-6"><i class="far fa-undo-alt"></i> <span>Backups</span></el-menu-item>
							</el-submenu>
							<el-menu-item index="2">
								<i class="far fa-database"></i>
								<span>TGJU Server Platform</span>
							</el-menu-item>
							<el-menu-item index="3">
								<i class="far fa-database"></i>
								<span>TGJU Server CWP</span>
							</el-menu-item>
							<el-menu-item index="4">
								<i class="far fa-database"></i>
								<span>Loghatban</span>
							</el-menu-item>
						</el-menu>
					</div>
				</el-col>
				<el-col :span="19">
					<div id="main-section">
						<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
							<el-tab-pane v-for="(item, index) in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
								{{item.content}}
							</el-tab-pane>
						</el-tabs>
						<div id="main-table-wrapper">
							<el-table ref="multipleTable" :data="tableData3" height="100%" stripe @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55" sortable>
								</el-table-column>
								<el-table-column label="Date" width="120" sortable>
									<template slot-scope="scope">{{ scope.row.date }}</template>
								</el-table-column>
								<el-table-column property="name" label="Name" width="120" sortable>
								</el-table-column>
								<el-table-column property="address" label="Address" show-overflow-tooltip sortable>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-col>
			</el-row>
		</main>
	</div>
</template>

<script>
	import { Loading } from 'element-ui'
	import { setTimeout } from 'timers'

	// openWindow();
	// console.log(test);

	export default {
		data() {
			return {
				tableData3: [{
					date: '2016-05-03',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-02',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-04',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-01',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-08',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-06',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}, {
					date: '2016-05-07',
					name: 'Tom',
					address: 'No. 189, Grove St, Los Angeles'
				}],
				multipleSelection: [],
				quick_sql: 'SELECT * FROM cards WHERE id > 5',
				top_right_btns: [{
					id: 1,
					text: '<i class="far fa-angle-left"></i>'
				}, {
					id: 2,
					text: '<i class="far fa-angle-right"></i>'
				}],
				top_right_btns_selected: [1],
				top_left_btns: [{
					id: 1,
					text: '<i class="far fa-edit"></i>'
				}, {
					id: 2,
					text: '<i class="far fa-eye"></i>'
				}, {
					id: 3,
					text: '<i class="far fa-search"></i>'
				}],
				top_left_btns_selected: [],

				data: [{
					label: 'TGJU Server Platform',
					children: [{
						label: 'Level two 1-1',
						children: [{
							label: 'Level three 1-1-1'
						}]
					}]
				}, {
					label: 'TGJU Server Mono',
					children: [{
						label: 'Level two 2-1',
						children: [{
							label: 'Level three 2-1-1'
						}]
					}, {
						label: 'Level two 2-2',
						children: [{
							label: 'Level three 2-2-1'
						}]
					}]
				}, {
					label: 'Loghatban',
					children: [{
						label: 'Level two 3-1',
						children: [{
							label: 'Level three 3-1-1'
						}]
					}, {
						label: 'Level two 3-2',
						children: [{
							label: 'Level three 3-2-1'
						}]
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				editableTabsValue2: '2',
				editableTabs2: [{
					title: 'platform_categories',
					name: '1',
					content: ''
				}, {
					title: 'exchange_tmp',
					name: '2',
					content: ''
				}],
				tabIndex: 2
			}
		},

		methods: {
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
			quick_sql_run() {
				let sql_run_loading = Loading.service({
					target: '#main-section',
					text: 'running the sql ...'
				});

				setTimeout(function () {
					sql_run_loading.close();

					new Notification('sql run finished', {
						body: this.quick_sql
					});
				}, 10);
			},
			handleNodeClick(data) {
				console.log(data);
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			addTab(targetName) {
				let newTabName = ++this.tabIndex + '';
				this.editableTabs2.push({
					title: 'New Tab',
					name: newTabName,
					content: 'New Tab content'
				});
				this.editableTabsValue2 = newTabName;
			},
			removeTab(targetName) {
				let tabs = this.editableTabs2;
				let activeName = this.editableTabsValue2;
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

				this.editableTabsValue2 = activeName;
				this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
			},
			onMounted(editor) {
				this.editor = editor;
			},
			onCodeChange(editor) {
				console.log(this.editor.getValue());
			}
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>