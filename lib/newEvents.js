'use strict';

const async = require('async');
const express = require('express');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const mainSearchFavorite = require('./searchFavorite');
const Favorite_search = require('../models/Favorite_search');

var Schema = mongoose.Schema; 

async function mainQuerynewEvents(){
    try{
        const newEvents = Event.find({notified: false, active: true}, '_id name city').exec();
       
        return newEvents;
    }catch(err){

        return err;
    }
}

module.exports = mainQuerynewEvents;