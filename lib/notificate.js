'use strict';

//FB notifications
const mongoose = require('mongoose');
const async = require('async');
const express = require('express');
const fbNotification = require('./notificationsFB.js')
const Delivery_note = require('../models/Delivery_note')
var Schema = mongoose.Schema;

async function mainNotificateEvents(result3){
    for await (const usersEvents of result3){
    const event_id = usersEvents.newEvent
    var message = {
        collapseKey: '4Events',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            event_id: event_id,
        },
        notification: {
            title: "4Events: Nuevo evento para " + usersEvents.userName,
            icon: "ic_launcher",
            body: "Nuevo evento que puede ser de tu agrado con el título " + usersEvents.nameEvent + ' en ' + usersEvents.cityEvent
        }
    };

    const tokensFb = usersEvents.tokensFB;

       await fbNotification.sendNotification(message, tokensFb, function (err, data) {  
            if (err) return JSON.stringify({ ok: false, message: err }); 
            var resultArray = [];
            if (data) {
                if (data.message.results){
                    
                    for (const dataR of data.message.results){
                        resultArray.push(JSON.stringify(dataR))
                    }

                }

                var delivery = new Delivery_note({
                    _id: new mongoose.Types.ObjectId(),
                    begin_date: new Date,
                    text: "Nuevo evento que puede ser de tu agrado con el título " + usersEvents.nameEvent + ' en ' + usersEvents.cityEvent,
                    user: usersEvents.user,
                    event: usersEvents.newEvent,
                    multicast_id: data.message.multicast_id,
                    success: data.message.success,
                    failure: data.message.failure,
                    canonical_ids: data.message.canonical_ids,
                    results: resultArray
                });
                
                    delivery.save((err, deliverySaved)=> {
                        if (err){
                            console.log('error: ' + err)
                        } else {
                            console.log(JSON.stringify(deliverySaved))
                        } 
                    });         
            }
        });
    
    };
    
}

module.exports = mainNotificateEvents;