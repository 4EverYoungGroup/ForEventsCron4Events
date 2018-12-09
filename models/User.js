'use strict';

const mongoose = require('mongoose');
const Favorite_search = require('./Favorite_search');
const City = require('./City');
const Transaction = require('./Transaction');
const Event = require('./Event')
var Schema = mongoose.Schema;


//first, we created the scheme
const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    email: { type: String, index: true },
    address: String,
    city: String,
    zip_code: String,
    province: String,
    country: String,
    password: String,
    birthday: Date,
    gender: String,
    create_date: Date,
    delete_date: Date,
    alias: String,
    idn: String,
    company_name: String,
    mobile_number: String,
    phone_number: String,
    profile: String,
    favorite_searches: [{type: Schema.Types.ObjectId, ref: 'Favorite_search'}],
    city: {type: Schema.Types.ObjectId, ref: 'City'},
    transactions:[{type: Schema.Types.ObjectId, ref: 'Transaction'}],
    events:[{type: Schema.Types.ObjectId, ref: 'Event'}],
    tokensFB: [{ type: String }],
    location: {
        type: { type: String},
        coordinates: [Number]
    }
});
userSchema.index({ "location": "2dsphere" });

//Allowed Tags to Profile
userSchema.statics.allowedProfile = function(){
    return ['User', 'Organizer', 'Admin'];
};

//User profile
userSchema.statics.userProfileS = function(userId, profile){
    if (userId.length === 24){
        var exists = User.count({_id: userId, profile: profile}) ;
        return exists.exec() 
   } else{
        throw new Error('The id must contain 24 characters or not exists!');
    }
};
//Insert New User
userSchema.statics.insertUser = function(user){
    user._id = new mongoose.Types.ObjectId();
   user.save((err, userSaved)=> {
    if (err){
        next(err);
        return (err);
    } else {
        return userSaved;
    } 
});

 return user;
}


userSchema.statics.insertFavorite_search = function(userId, favoriteId, cb){
    User.findOneAndUpdate({_id: userId}, 
            { $push: { favorite_searches: favoriteId} },
           function (error, success) {
                 if (error) {
                    return cb({ code: 400, ok: false, message: 'error_saving_data'}); 
                } else {
                    return cb(null,success);
                 }
             });
}
userSchema.statics.deleteFavorite_search = function(userId, favoriteId, cb){
    User.findOneAndUpdate({_id: userId}, 
            { $pull: { favorite_searches: favoriteId}}, {safe: true, upsert: true},
           function (error, success) {
                 if (error) {
                    return cb({ code: 400, ok: false, message: 'error_deleting_data'}); 
                } else {
                    return cb(null,success);
                 }
             });
}

userSchema.statics.getList = function (filters, limit, skip, sort, fields, includeTotal, cb) {


    //filters = {};
    const query = User.find(filters)
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    query.select(fields);
    query.populate({ path: 'city', match: { province: { $regex: new RegExp('mad', "ig") } } });

    //query.populate({ path: 'city', match: { province: { $regex: new RegExp('mad', "ig") } } });

    //console.log(filters);
    return query.exec(function (err, rows) {
        if (err) return cb(err);

        const result = {
            rows: rows,
        };

        if (!includeTotal) return cb(null, result);

        // incluir propiedad total
        User.countDocuments(filters, (err, total) => {
            if (err) return cb(err);
            result.total = total;
            return cb(null, result);
        });
    });
}




var User = mongoose.model('User', userSchema);

//JCM
module.exports = User;