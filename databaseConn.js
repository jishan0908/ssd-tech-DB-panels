require('dotenv/config');

const { Sequelize } = require('sequelize');
try{
    const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: process.env.DBDIALECT,
    logging:false
    
  });
async()=>{await sequelize.authenticate();}
console.log('Connected to database ');
module.exports=sequelize; 

}catch(e){
console.log('Error occured from databaseconn.js',e.message)    
}

