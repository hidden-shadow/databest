'use strict'

const mysqlssh = require('mysql-ssh');
const fs = require('fs');

class Mysql {
	
	constructor() {
		
	}

	query = async (sql) => {
		return new Promise(function(resolve, reject) {
			mysqlssh.connect({
				host: '138.201.243.66',
				user: 'root',
				password: 'KJOtdj2246jo2!25jo35Gnaket#^124'
			}, {
				host: '138.201.243.66',
				user: 'platform_admin',
				password: 'hgcHaJQ78ziK',
				database: 'platform_crm'
			})
			.then(client => {
				client.query(sql, function (error, results, fields) {
					// if (error) throw error;
					mysqlssh.close();
		
					resolve({error, results, fields});
				})
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getTables = (db_name) => {
		let sql = `SELECT table_name FROM information_schema.tables where table_schema='${db_name}';`;

		return new Promise((resolve, reject) => {
			this.query(sql).then(function(response) {
				resolve(response);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

	getTableData = (tb_name) => {
		let sql = `SELECT * FROM '${tb_name}' LIMIT 50;`;

		return new Promise((resolve, reject) => {
			this.query(sql).then(function(response) {
				resolve(response);
			})
			.catch(err => {
				reject(err);
			})
		})
	}

}

export default Mysql;