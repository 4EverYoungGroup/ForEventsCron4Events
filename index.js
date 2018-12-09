'use strict';
 // index.js
 const express = require("express");
 const cron = require("node-cron");
 var path = require('path');
 const mainQueryFavorite = require("./lib/queryFavorite");
 const mainQuerynewEvents = require("./lib/newEvents");
 const mainNotificateEvents = require("./lib/notificate");
 const Event = require("./models/Event")

var app = express();

// Cargamos el conector a la base de datos
require('./lib/connectMongoose');

// schedule tasks to be run on the server   
cron.schedule("* * * * *", async function() {
    console.log("running a task every minute");
    const result = await mainQuerynewEvents();
    for await (const resultado of result){
    
        const result3 = await mainQueryFavorite(resultado);
        if (result3.length !== 0){
          // First we send the tokens and text to Firebase so that a message is sent to them.
          try{
            const notificate = await mainNotificateEvents(result3);
          }catch(err){
            console.log('error: ' + err)
          };

         //Second, we will mark the event as notified
          try{
            const eventUpdated = await Event.findOneAndUpdate({_id: resultado._id}, {$set:{notified: true, notification: new Date()}}, {new:true}).exec();
          }catch(err){
            console.log('error2: ' + err)
          };
          
        };    
    }
  });

  app.listen(3006);
