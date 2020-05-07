'use strict';

var sql = require('./db.js');

var Check =function(check){
    this.check_description=check.check_description;
    this.check_amount=check.check_amount;
    this.supplier_id=check.supplier_id;
    this.store_id=check.store_id;
    this.is_paid=check.is_paid;
    this.is_for_sup=check.is_for_sup;
    this.invoice_ids=check.invoice_ids;
    this.check_date=check.check_date;
}

Check.addNewCheck = function (check_data,result){
    console.log(check_data);

    sql.query('INSERT INTO bank_check SET ?',check_data, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    });

}

Check.getChecks = function (result){
    sql.query('SELECT * FROM bank_check ',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Check;