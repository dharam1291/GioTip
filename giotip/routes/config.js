var config = {};

/******************* LDAP configuration   *************/
config.ldap = {};
config.session = {};

config.ldap.employeeType = 'newsEditor';
config.ldap.dn = 'ou=compass,ou=users,ou=system';
config.ldap.url = 'ldap://localhost:10389';
config.ldap.admindnPassword = 'secret';
config.ldap.admindn = 'uid=admin,ou=system';

config.session.secretkey = 'secretkeytobechangedbytelevisory';


/*********************** my Sql configuration ***********************/

config.db = {};
config.db.host = 'localhost';
config.db.user = 'root';
config.db.password = '';
config.db.database = 'giotipV1';
/****************** export module *********************/
module.exports = config;