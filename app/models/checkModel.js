'use strict';

var sql = require('./db.js');
var invoiceModel = require('./invoiceModel.js');
var supplierModel = require('../models/supplierModel');
var Check =function(check){
    this.check_description=check.check_description;
    this.check_amount=check.check_amount;
    this.check_number=check.check_number;
    this.supplier_id=check.supplier_id;
    this.store_id=check.store_id;
    this.is_paid=check.is_paid;
    this.is_for_sup=check.is_for_sup;
    this.invoice_ids=check.invoices_ids;
    this.check_date=check.check_date;
}

Check.addNewCheck = function (check_data,result){

    console.log('HERE WE GOOO --- 00000000')
    console.log(check_data)

    sql.beginTransaction(function(err){
        sql.query('INSERT INTO bank_check SET ?',check_data, function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                
                if(check_data.is_for_sup){
                    var check_id=res.insertId;
                    var data ={'check_id':check_id,'invoice_ids':check_data.invoice_ids};
                    invoiceModel.updateInvoiceCheckID(data,function(err,res){
                        if(err){
                            sql.rollback(function() {
                                throw err;
                            });
                        }else{
                            
                            if(check_data.is_paid){
                                console.log('HERE WE GOOO')
                                var new_supplier_amount=(parseInt(check_data.supplier_amount) - parseInt(check_data.check_amount));
                                var update_supplier_amount = {'new_supplier_amount':new_supplier_amount,'supplier_id':check_data.supplier_id};
                                supplierModel.updateAmount(update_supplier_amount,function(err,response){
                                    if(err){
                                        sql.rollback(function() {
                                            throw err;
                                        });
                                    }else{
                                        sql.commit(function(err) {
                                            if (err) { 
                                                sql.rollback(function() {
                                                    throw err;
                                                });
                                            }
                                            result(null,res);
                                        });
                                    }
                                })
                            }
                        }
                    })
                }else{
                    sql.commit(function(err) {
                        if (err) { 
                            sql.rollback(function() {
                                throw err;
                            });
                        }else{
                            result(null,res);
                        }
                    });
                }
            }
        });
    })

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