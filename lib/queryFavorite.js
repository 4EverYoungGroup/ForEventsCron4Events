'use strict';

const express = require('express');
const async = require('async');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');
const mainSearchFavorite = require('./searchFavorite');
const Favorite_search = require('../models/Favorite_search');


var Schema = mongoose.Schema; 
var usersResult = [];
var totEvents = 0;

async function mainQueryFavorite(newEvent){
    
    usersResult = [];
    totEvents = 0
    try{
        let numUsers = await User.count().exec();
    }catch(err){
        console.log('Total de usuarios error:' + err);
    }
    
    await User.find().cursor().eachAsync( async function(user){ 
        const favorites = user.favorite_searches;
        totEvents = 0
        if (favorites.length >0){
            for await (const filterResult of favorites){
                var filterquery = {};
                filterquery._id = filterResult;
                try{
                    const resultFilter = await Favorite_search.findOne(filterquery).exec();
                    
                    //Begin search in the Favorite_search with query stored
                    const var1 = JSON.parse(resultFilter.query);
                    const filter3 = mainSearchFavorite(var1);
                    filter3._id = newEvent._id
                    const resultEvent =  await Event.count(filter3).exec();
                    totEvents += resultEvent;
                } catch(err){
                    return err;
                };
                
            };
                if (totEvents > 0){

                    if (user.tokensFB === undefined ||user.tokensFB.length === 0 ){

                    }else{
                        const result = {totEvents: totEvents, user:user._id, userName:user.firstName, 
                            newEvent: newEvent._id, nameEvent: newEvent.name, cityEvent: newEvent.city, 
                            tokensFB: user.tokensFB }
                        usersResult.push(result);
                    };
                                    
                }        
        }
    });

    return  usersResult;
    

};

module.exports = mainQueryFavorite;
