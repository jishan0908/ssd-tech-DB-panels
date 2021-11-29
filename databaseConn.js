const { Sequelize } = require('sequelize');
try{
    const sequelize = new Sequelize('anjoybhaipanel', 'root', 'dotlines', {
    host: 'localhost',
    dialect: 'mysql',
    logging:false
    
  });
async()=>{await sequelize.authenticate();}
console.log('Connected to database ');
module.exports=sequelize; 

}catch(e){
console.log('Error occured from databaseconn.js',e.message)    
}

