'use strict';

var sql = require('./db.js');

var Store =function(store){
    this.store_name=store.new_store_name;
    this.amount=store.new_store_init_amount;
}

Store.addNewStore = function (store_details,result){
    console.log(store_details)
    sql.query('INSERT INTO store SET ?',store_details, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })
}

Store.getAllStores = function(result){
    sql.query('SELECT * FROM store order by store_id desc',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Store;