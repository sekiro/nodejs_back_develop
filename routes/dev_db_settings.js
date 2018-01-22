exports.devDbInfo = require('knex')({
  dialect: 'mysql',
  connection: {
    host:'192.168.33.10',
    user:'dev_admin',
    password:'dies9029',
    database:'sasami',
    port:'3306'        
  }
});
