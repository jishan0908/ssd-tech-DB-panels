const chalk=require('chalk');
const db=require('./databaseConn')//sequelize instance
const express = require('express')
const cstModel=require('./constructModels');
const bcrypt=require('bcrypt');
const fs =require('fs');
const fsextra=require('fs-extra');
const path = require('path');

let beforeEditDoc,afterEditDoc;


// express server definition
const app = express()
// router = AdminBroExpress.buildRouter(adminBro, router)
// let testRoute=app.get('/api/test',(req,res)=>{
//   res.send('Hello Zizu,endpoint /api/test');
// })


const startMyModelFunction=async()=>{
try{
    console.log(chalk.green.inverse('Print thhe cstModel info--'));
    console.log('typeof cstModel ',typeof cstModel);
    console.log(chalk.yellow.inverse('Printing the object cstModel'));
    console.log(cstModel);
    cstModel.auto.run();

}catch(e){
   console.log(chalk.red.inverse('Error occured startMyModelFunction'),e.message);
}

}
const initializeModels=async()=>{
  try{
  const INITMODELS=require('./models/init-models');
  console.log(typeof INITMODELS);
  INITMODELS(db);
  console.log('db.models',db.models);
  }catch(e){
    console.log(chalk.red.inverse('Error from initializeModels function'),e.message);
  }
}


const passConfigToAdminBro=async()=>{
// Pass all configuration settings to AdminBro
try{
  const {default:AdminBro, useCurrentAdmin} = require('admin-bro')
  const AdminBroExpressjs = require('@admin-bro/express')
  const uploadFeature = require('@admin-bro/upload')
  // We have to tell AdminBro that we will manage sequelize resources with it
  const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
  AdminBro.registerAdapter(require('@admin-bro/sequelize'))

  

const adminBro = new AdminBro({
  resources: [
    
    { resource: db.models.mypanel,
      
       options: {

       navigation: {name:'Digital_ventures',icon:'Accessibility'},
       properties:{
        CONFIG_FILE_LOCATION:{//virtual property dropbox,not in schema
          components:{
            edit: AdminBro.bundle('./components/config-file-location.edit.tsx')
          }
        },
        SCHEMA_FILE_LOCATION:{//virtual property dropbox,not in schema
          components:{
            edit: AdminBro.bundle('./components/schema-file-location.edit.tsx')
          }
        },
      
        CONFIG_FILE_NAME:{
            
              isVisible:{new:false,edit:false,show:true}
            
        },
        SCHEMA_FILE_NAME:{
           isVisible:{new:false,edit:false,show:true}
        }
       }, 
      
       listProperties: ['SL', 'Name', 'IP_DB','NAS_DRIVE','Monitoring_Panel','DB_BACKUP','createdAt','updatedAt'] ,
       actions:{
        new: {

          before:async(request,context)=>{
            
            if(request.method==='post'){
              
              
              const{CONFIG_FILE_LOCATION,SCHEMA_FILE_LOCATION, ...otherParams}=request.payload
              console.log(chalk.red.inverse('before hook-->  new action ----->>>   '),request.payload);
              //console.log('schema_file_location--->  ',SCHEMA_FILE_LOCATION)
              context.CONFIG_FILE_LOCATION=CONFIG_FILE_LOCATION
              context.SCHEMA_FILE_LOCATION=SCHEMA_FILE_LOCATION
              const schemas=[];
              const keys = Object.keys(request.payload);
  
              for(let i =0;i<keys.length;i++){
                if(keys[i].startsWith('SCHEMA_FILE_LOCATION')){
                  //console.log('Schema files -->',keys[i]);
                  schemas.push(request.payload[keys[i]])
                }
              }
              //console.log(schemas);
              if(schemas.length!=0){
                context.SCHEMA_FILE_LOCATION=schemas;
              }
              
              console.log('context.SCHEMA_FILE_LOCATION--> ',context.SCHEMA_FILE_LOCATION)
              console.log('context.CONFIG_FILE_LOCATION--> ',context.CONFIG_FILE_LOCATION)
              //context.CONFIG_FILE_LOCATION.path=path.join(__dirname,'public',CONFIG_FILE_LOCATION.name);
              return{
                ...request,
                payload:otherParams,
              }

            }
            return request
          },
          
          after: async (response,request,context) => {



            const {record,CONFIG_FILE_LOCATION,SCHEMA_FILE_LOCATION}=context
            if(record.isValid()){
              if(CONFIG_FILE_LOCATION){
                  const filePath=path.join('uploads',record.id().toString(),CONFIG_FILE_LOCATION.name)
                  await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                  await fsextra.move(CONFIG_FILE_LOCATION.path,filePath)
                  await record.update({CONFIG_FILE_NAME:`/${filePath}`})
                }
                if(SCHEMA_FILE_LOCATION){
                   let loc='';
                   for(let i=0;i<SCHEMA_FILE_LOCATION.length;i++){
                    const filePath=path.join('schemaUploads',record.id().toString(),SCHEMA_FILE_LOCATION[i].name)
                    await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                    await fsextra.move(SCHEMA_FILE_LOCATION[i].path,filePath)
                    loc=loc+`/${filePath}`+';'
                   }
                   await record.update({SCHEMA_FILE_NAME:loc})
                   
                 
                }
                
            await db.models.paneltracker.create({ actions:'Create New', updated_by:context.currentAdmin.user_id,
            username: context.currentAdmin.email,venture_name:record.params.Name,previouschangedfield:'New venture record created' });
          
            } 

            return response
          },
        },
        edit: {
           before:async(request,context)=>{
            
            if(request.method==='post'){
              console.log(chalk.white.inverse('BEFORE action EDIT POST'));
              const{CONFIG_FILE_LOCATION,SCHEMA_FILE_LOCATION, ...otherParams}=request.payload
              //console.log(chalk.red.inverse('before hook-->  new action ----->>>   '),request.payload);
              //console.log('schema_file_location--->  ',SCHEMA_FILE_LOCATION)
              context.CONFIG_FILE_LOCATION=CONFIG_FILE_LOCATION
              context.SCHEMA_FILE_LOCATION=SCHEMA_FILE_LOCATION
              
              const schemas=[];
              const keys = Object.keys(request.payload);
  
              for(let i =0;i<keys.length;i++){
                if(keys[i].startsWith('SCHEMA_FILE_LOCATION')){
                  //console.log('Schema files -->',keys[i]);
                  schemas.push(request.payload[keys[i]])
                }
              }
              //console.log(schemas);
              if(schemas.length!=0){
                context.SCHEMA_FILE_LOCATION=schemas;
              }
              console.log('context.SCHEMA_FILE_LOCATION--> ',context.SCHEMA_FILE_LOCATION)
              console.log('context.CONFIG_FILE_LOCATION--> ',context.CONFIG_FILE_LOCATION)
        
              return{
                ...request,
                payload:otherParams,
              }

            }
            return request
          },
          
          after: async (response,request,context) => {

                        
           if(request.method==='post'){
           
            const {record,CONFIG_FILE_LOCATION,SCHEMA_FILE_LOCATION}=context
            console.log('after----CONFIG_FILE_LOCATION--->  ',CONFIG_FILE_LOCATION);
            console.log('after----SCHEMA_FILE_LOCATION--->  ',SCHEMA_FILE_LOCATION);
            console.log('after----typeof  SCHEMA_FILE_LOCATION--->  ',typeof SCHEMA_FILE_LOCATION);
            
            
            
            if(record.isValid()){
              if(CONFIG_FILE_LOCATION){
                  const filePath=path.join('uploads',record.id().toString(),CONFIG_FILE_LOCATION.name)
                  await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                  await fsextra.move(CONFIG_FILE_LOCATION.path,filePath)
                  await record.update({CONFIG_FILE_NAME:`/${filePath}`})
                }
              if(SCHEMA_FILE_LOCATION){
                   let loc='';
                   for(let i=0;i<SCHEMA_FILE_LOCATION.length;i++){
                    const filePath=path.join('schemaUploads',record.id().toString(),SCHEMA_FILE_LOCATION[i].name)
                    await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                    await fsextra.move(SCHEMA_FILE_LOCATION[i].path,filePath)
                    loc=loc+`/${filePath}`+';'
                   }
                   await record.update({SCHEMA_FILE_NAME:loc})
                   
                 
                }
                
            // await db.models.paneltracker.create({ actions:'EDITED', updated_by:context.currentAdmin.user_id,
            // username: context.currentAdmin.email,venture_name:record.params.Name,previouschangedfield:'New venture record created' });
          
            }


          }

            return response
          },
          
          
      
         
        },
        delete: {
          
          after: async (request,context) => {
            if(request.notice!=undefined){
              if(request.notice.type=='success'){
                
                  await db.models.paneltracker.create({ actions:'DELETE', updated_by:context.session.adminUser.user_id,
                  username: context.session.adminUser.email,venture_name:request.record.title,previouschangedfield:JSON.stringify(request.record.params) });
                      
              }
            }
            return request
          },
        },
        bulkDelete: {
          // before:async(request,context)=>{
          //   console.log(chalk.blue.inverse('bulkDete called BEFORE hook'))
          //   console.log(chalk.white.inverse('THe whole request---> '),request);
          //   return request;

          // },
          
          after: async (request,context,response) => {
            console.log(chalk.blue.inverse('bulkDete called after hook'))
            console.log(chalk.green.inverse('request--->'),request);
            let prevField=request.records;
           
            if(request.notice!=undefined){
              if(request.notice.type=='success'){

                  for(let i =0;i<prevField.length;i++){
                    await db.models.paneltracker.create({ actions:'BULK_DELETE', updated_by:context.session.adminUser.user_id,
                    username: context.session.adminUser.email,venture_name:prevField[i].title,previouschangedfield:JSON.stringify(prevField[i]) });
                  } 
              }
            }
            return request
          },
        }
       
       }
      },
      
       
    },
    { resource: db.models.user, 
      options: {
        //isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',

      navigation: {name:'Authorized_users',icon:'User'},
      listProperties: ['user_id','email','createdAt','updatedAt'] ,
      properties:{
        encryptedPassword: {
          isVisible: false,
        },
        password: { //adding virtual field
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        list:{
          isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        },
        new: {

          before: async (request,context) => {
            console.log(chalk.yellow.inverse('Inside the create new feature'));
            console.log(chalk.cyan.inverse('executiono of hooks---- before inserting new record'))

            console.log(chalk.green.inverse('printing request.payload'),request.payload);
            console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\');


            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      }
    
    
      }
    },
    { resource: db.models.paneltracker, 
      options: {
      navigation: {name:'Tracker_user_actions',icon:'Cognitive'},
      //listProperties: ['user_id','email','createdAt','updatedAt'] ,
      actions: {
        list:{
          isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        },
      }
      
    
    
    
      }
    },
      // ...your options go here
  
  ],
  rootPath: '/admin',
  loginPath: '/admin/login',
  logoutPath:'/admin/logout',
  branding: {
    companyName: 'Dotlines_DB_PANEL',
  },
})
// Build and use a router which will handle all AdminBro routes
// console.log(chalk.white.inverse('typeof AdminBroExpressjs---->>>  '),typeof AdminBroExpressjs);
// console.log(chalk.white.inverse(' AdminBroExpressjs---->>>  '),AdminBroExpressjs);

let router = express.Router()

/*
const project = await Project.findOne({ where: { title: 'My Title' } });
if (project === null) {
  console.log('Not found!');
} else {
  console.log(project instanceof Project); // true
  console.log(project.title); // 'My Title'
}



*/

router=AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    console.log(chalk.greenBright.inverse('From buildAuthenticationRouter authenticate:'));
    console.log('email----> ',email);
    console.log('password--->> ',password)
    const user = await db.models.user.findOne({where:{email: email }})
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
         console.log(chalk.yellow.inverse('Credentials matched'));
         console.log('user-->',user.dataValues.email)
          return user
      }
    }
    return false;
  },
  cookiePassword: 'somePasswordThatIsTopSecret',
 })
 
app.use(adminBro.options.rootPath, router)
app.use('/uploads', express.static('uploads'));
app.use('/schemaUploads',express.static('schemaUploads'))

}catch(e){
  console.log(chalk.red.inverse('Error occured in passConfigToAdminBro function()'),e.message);
}
}




// Running the server
const run = async () => {
  await app.listen(8080, () => console.log(`Example app listening on port 8080!`))
  if(fs.readdirSync('./models').length === 0){
    console.log(chalk.blue('models directory is empty'));
    await startMyModelFunction();//auto.run() with in function if this function is called crud throws errors
  
  }
  await initializeModels();
  await passConfigToAdminBro();//with adminbro router
  
}
run();