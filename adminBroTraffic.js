const chalk=require('chalk');
const db=require('./databaseConn')//sequelize instance
const express = require('express')
const cstModel=require('./constructModels');
const bcrypt=require('bcrypt');
const fs =require('fs');
const fsextra=require('fs-extra');
const path = require('path');
let beforeEditDoc;
//requiring all the files,modules in order to achieve or DB panel application


// express server definition
const app = express()//The express server initialization
/*
  startMyModelFunction,self implemented asynchronous function
  basically it requires constructModels.js under root folder--./constructModels
  as we will be using "THE SEQUELIZE" ORM(object relation mapping ) to communicate with the 
  mysql database
  constructModel.js works the aid of a npm-package(sequelize-auto).In order to use sequelize-auto
  we have to keep in mind that WE SHOULD NEVER MODIFY a given model from the (Node js) environment.
  It is recommended to make any changes(if needed) in the database schemas from other database client
  for example cmd-mysql 
  In constructModels.js we configure the db-connections and set the options as required,in our example
  we used to parameters "directory"-->specifying where the auto-sequelize write 
  equivalent object relational model from the db schema and store to, and "additional" field
  to specify that we will be using timestamps as well.(Note timestamps fields createdAt and updatedAt)
  should be present in the given database tables
  Important NOTE: A thorough description is specified inside the databaseConn.js as this file
  is used almost everywhere in this project..it mainly establishes connetion with the database
  in our case we are using mysql database 
*/
const startMyModelFunction=async()=>{
  /*
  This function will only be executed if ./models folder is empty
  The 'cstModel.auto.run() works in the following manner'
  1)gets connected with our specified db,constucts the Sequelize ORM model
  from db schemas
  */
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
////////////////////////////////////////////////////////////////////////////////////
/*
Step 2,we will be using the initializeModels function,Note all our functions
are asynchronous for the ease of understanding and handling promises
initializeModels function will be called after startMyModelFunction
Once we are sure that ./models folder is not empty we can call the 
INITMODELS function with our db instance to initiallize our models
Curremnt we have The models,
1)mypanel,this is the main table where all the venture dbs' metrics are resided
2)user,all the role based users credentials for the admin panel
3)paneltracker table which simply keeps the logs of the crud operations
mainly(edit,create,delete,bulkDelete)and the corresponding user information
liable for such instuctions
*/
/////////////////////////////////////////////////////////////////////////////////////
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

/*
MOST IMPORTANT PART OF OUR DB-PANEL application
First thing to keep in mind that before calling this function
we have to make sure that our prerequisite functions(startMyModelFunctions and initializeModels)
gets executed without any error,Please note that we might face an error(temporarily) from our very first and second method
if ./models is empty,nothing to worry about!our application handles it with great certainty,
the cstModel.auto will be executed,which will automatically construct our mapping model,given that
our database instance is configured correctly,after a while once the ./models gets populated we we not get 
any more error from these blocks.Now lets begin understanding our core function "passConfigToAdminBro"
1)we require all the relevant modules admin-bro,plugin @admin-bro/express.
2)Then we have add an one line "specified by the documentation of admin-bro to enable role-based feature"
of our panel application"
--  const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'--
3)Now  We have to tell AdminBro that we will manage sequelize resources with it
--  AdminBro.registerAdapter(require('@admin-bro/sequelize'))  --
4)Now we have to configure the core options of the Adminbro package...
The basic structure will look like below
const adminBro = new AdminBro({
 
  resources[//specifies all the tables from db present in ./models
   {resource:db.models.mypanel,//name of the resource/db.models.table_name
    options:{//specify how our resource showld be viewed and interact with the admins/users
      navigation:{}//to create an icon and label of our resource
      properties:{},//our db.models.table_name.tablefields behaviour and display can be manipulated from here
      listProperties{},//specifies which table field will be shown once we want to display the resource
      
      actions:{//Now actions are very important,in short every crud operations in admin-bro introduces 
        before and after hooks and we can therefore manipulate the incoming request and context
        and send our desired response
        Note that I will be giving the reference at the end for more detailed understanding   
        new:{
          before:{}after:{}
        },
        edit:{
          before:{}after:{}
        }
        ...
      }
    }
    
  }
 ],

 rootPath: '/admin',///specifying the root path(in our case "localhost:8080/admin")
  loginPath: '/admin/login',
  logoutPath:'/admin/logout',
  branding: {
    companyName: 'Dotlines_DB_PANEL',//The brandming of our company
    //additional features are available in the docs which i will be attaching below
  },
})
REFERENCES:https://adminbro.com/
*/


const passConfigToAdminBro=async()=>{
// Pass all configuration settings to AdminBro
try{
  const {default:AdminBro, useCurrentAdmin} = require('admin-bro')
  const AdminBroExpressjs = require('@admin-bro/express')
  
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
              context.CONFIG_FILE_LOCATION=CONFIG_FILE_LOCATION
              context.SCHEMA_FILE_LOCATION=SCHEMA_FILE_LOCATION
              const schemas=[];
              const keys = Object.keys(request.payload);
  
              for(let i =0;i<keys.length;i++){
                if(keys[i].startsWith('SCHEMA_FILE_LOCATION')){
                  schemas.push(request.payload[keys[i]])
                }
              }
              if(schemas.length!=0){
                context.SCHEMA_FILE_LOCATION=schemas;
              }
              
             
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
                  const filePath=path.join('uploads',record.id().toString(),Date.now().toString(),CONFIG_FILE_LOCATION.name)
                  await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                  await fsextra.move(CONFIG_FILE_LOCATION.path,filePath)
                  await record.update({CONFIG_FILE_NAME:`/${filePath}`})
                }
                if(SCHEMA_FILE_LOCATION){
                   let loc='';
                   for(let i=0;i<SCHEMA_FILE_LOCATION.length;i++){
                    const filePath=path.join('schemaUploads',record.id().toString(),Date.now().toString(),SCHEMA_FILE_LOCATION[i].name)
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
            if(request.method==='get'){
              beforeEditDoc=context.record.params;
            } 
            
            if(request.method==='post'){
              const{CONFIG_FILE_LOCATION,SCHEMA_FILE_LOCATION, ...otherParams}=request.payload
              
              context.CONFIG_FILE_LOCATION=CONFIG_FILE_LOCATION
              context.SCHEMA_FILE_LOCATION=SCHEMA_FILE_LOCATION
              
              const schemas=[];
              const keys = Object.keys(request.payload);
  
              for(let i =0;i<keys.length;i++){
                if(keys[i].startsWith('SCHEMA_FILE_LOCATION')){
                  schemas.push(request.payload[keys[i]])
                }
              }
              if(schemas.length!=0){
                context.SCHEMA_FILE_LOCATION=schemas;
              }
              
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
                      
            
            if(record.isValid()){
              if(CONFIG_FILE_LOCATION){
                  const filePath=path.join('uploads',record.id().toString(),Date.now().toString(),CONFIG_FILE_LOCATION.name)
                  await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                  await fsextra.move(CONFIG_FILE_LOCATION.path,filePath)
                  await record.update({CONFIG_FILE_NAME:`/${filePath}`})
                }
              if(SCHEMA_FILE_LOCATION){
                   let loc='';
                   for(let i=0;i<SCHEMA_FILE_LOCATION.length;i++){
                    const filePath=path.join('schemaUploads',record.id().toString(),Date.now().toString(),SCHEMA_FILE_LOCATION[i].name)
                    await fs.promises.mkdir(path.dirname(filePath),{recursive:true})
                    await fsextra.move(SCHEMA_FILE_LOCATION[i].path,filePath)
                    loc=loc+`/${filePath}`+';'
                   }
                   await record.update({SCHEMA_FILE_NAME:loc})
                   
                 
                }
                
            await db.models.paneltracker.create({ actions:'EDITED', updated_by:context.currentAdmin.user_id,
            username: context.currentAdmin.email,venture_name:record.params.Name,previouschangedfield:JSON.stringify(beforeEditDoc) });
          
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
        
          after: async (request,context,response) => {
           
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
/*
Once we are done with the admin-bro options we have to bind/build our router
to handle admin bro routes,
Note that we could use our own route if necessary along with the adminbro express routes
If needed we can  use adminbro documentation for enabling such options
REFERENCE->adminbro.com
Another thing to consider is that we are using buildAuthenticateRouter
for admin-bro builtin authentication routes which works with express-ssession 
under and the hood and cookies
*/ 
// Build and use a router which will handle all AdminBro routes

let router = express.Router()



router=AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    
    const user = await db.models.user.findOne({where:{email: email }})
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
         
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