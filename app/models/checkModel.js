'use strict';

var sql = require('./db.js');
var invoiceModel = require('./invoiceModel.js');
var supplierModel = require('../models/supplierModel');
var storeModel = require('../models/storeModel');
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

    sql.beginTransaction(function(err){
        sql.query('SELECT * FROM bank_check WHERE check_number = ' +check_data.check_number,function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                if(res.length == 0 ){
                    var insert_check_data={};
                    if(check_data.is_for_sup){
                        insert_check_data={'store_id':check_data.store_id,'supplier_id':check_data.supplier_id,'check_number':check_data.check_number,'check_amount':check_data.check_amount,'check_date':check_data.check_date,'is_paid':check_data.is_paid,'invoice_ids':check_data.invoice_ids,'is_for_sup':check_data.is_for_sup};
                    }else{
                        insert_check_data={'store_id':check_data.store_id,'supplier_id':check_data.supplier_id,'check_description':check_data.check_description,'check_number':check_data.check_number,'check_amount':check_data.check_amount,'check_date':check_data.check_date,'is_paid':check_data.is_paid,'invoice_ids':check_data.invoice_ids,'is_for_sup':check_data.is_for_sup};
                    }
                    sql.query('INSERT INTO bank_check SET ?',insert_check_data, function(err,res){
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
                                            var new_supplier_amount=(parseInt(check_data.supplier_amount) - parseInt(check_data.check_amount));
                                            var update_supplier_amount = {'new_supplier_amount':new_supplier_amount,'supplier_id':check_data.supplier_id};
                                            supplierModel.updateAmount(update_supplier_amount,function(err,response){
                                                if(err){
                                                    sql.rollback(function() {
                                                        throw err;
                                                    });
                                                }else{
                                                    var new_store_amount=(parseInt(check_data.store_amount) - parseInt(check_data.check_amount));
                                                    var update_store_amount = {'new_store_amount':new_store_amount,'store_id':check_data.store_id};
                                                    storeModel.updateAmount(update_store_amount,function(err,response){
                                                        if(err){
                                                            sql.rollback(function(){
                                                                throw err;
                                                            })
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
                                })
                            }else{
                                /* Update only store amount if the check type is expense */
                                var new_store_amount=(parseInt(check_data.store_amount) - parseInt(check_data.check_amount));
                                var update_store_amount = {'new_store_amount':new_store_amount,'store_id':check_data.store_id};
                                storeModel.updateAmount(update_store_amount,function(err,response){
                                    if(err){
                                        sql.rollback(function(){
                                            throw err;
                                        })
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
                    });

                }else{
                    result('DUPLICATE_CHECK_NUM',res);
                }
            }
        })

    })
}
Check.updateCheck = function(req,result){
   
    sql.beginTransaction(function(err){
        var check_data={'check_amount':req.check_amount,'check_number':req.check_number,'check_date':req.check_date,'store_id':req.store_id,'supplier_id':req.supplier_id,'store_amount':req.store_amount,'supplier_amount':req.supplier_amount};
        var sqlQuery='UPDATE bank_check SET check_amount = '+check_data.check_amount + ', check_number = ' + check_data.check_number + ',check_date= ' + "'" + check_data.check_date  + "' WHERE bank_check_id = " + req.check_id;
        console.log(sqlQuery)
        console.log(req.check_date)
        sql.query(sqlQuery,function(err,res){
            if(err){
                console.log(err)
            }else{
                result(res)
            }
        });
    })
}
Check.getChecks = function (result){
    sql.query('SELECT bc.*, sup.*, str.* FROM bank_check AS bc LEFT JOIN supplier as sup on bc.supplier_id = sup.supplier_id LEFT JOIN store as str on bc.store_id = str.store_id ORDER BY bc.check_order DESC , bc.bank_check_id DESC limit 30',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Check.pinCheck = function (check_data,result){
    var bank_check_id=check_data.bank_check_id;
    sql.query('UPDATE bank_check SET check_order = 1 WHERE bank_check_id= '+ bank_check_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Check.unPinCheck = function (check_data,result){
    var bank_check_id=check_data.bank_check_id;
    
    sql.query('UPDATE bank_check SET check_order = 0 WHERE bank_check_id= '+ bank_check_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Check.setCheckPaid = function (request,result){
    
    sql.beginTransaction(function(err){

        sql.query('UPDATE bank_check SET is_paid = 1 WHERE bank_check_id= '+ request.bank_check_id,function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                if(request.is_for_sup == 'Supplier'){
                    var new_supplier_amount=(parseInt(request.supplier_amount) - parseInt(request.check_amount));
                    var update_supplier_amount = {'new_supplier_amount':new_supplier_amount,'supplier_id':request.supplier_id};
                    supplierModel.updateAmount(update_supplier_amount,function(err,response){
                        if(err){
                            sql.rollback(function() {
                                throw err;
                            });
                        }else{
                            var new_store_amount=(parseInt(request.amount) - parseInt(request.check_amount));
                            var update_store_amount = {'new_store_amount':new_store_amount,'store_id':request.store_id};
                            storeModel.updateAmount(update_store_amount,function(err,response){
                                if(err){
                                    sql.rollback(function(){
                                        throw err;
                                    })
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
                    }) 
                }else{
                    var new_store_amount=(parseInt(request.amount) - parseInt(request.check_amount));
                    var update_store_amount = {'new_store_amount':new_store_amount,'store_id':request.store_id};
                    storeModel.updateAmount(update_store_amount,function(err,response){
                        if(err){
                            sql.rollback(function(){
                                throw err;
                            })
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
        });
    })
}
Check.setCheckUnPaid = function (request,result){
    
    sql.beginTransaction(function(err){
        sql.query('UPDATE bank_check SET is_paid = 0 WHERE bank_check_id= '+ request.bank_check_id,function(err,res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                if(request.is_for_sup == 'Supplier'){
                    var new_supplier_amount=(parseInt(request.supplier_amount) + parseInt(request.check_amount));
                    var update_supplier_amount = {'new_supplier_amount':new_supplier_amount,'supplier_id':request.supplier_id};
                    supplierModel.updateAmount(update_supplier_amount,function(err,response){
                        if(err){
                            sql.rollback(function() {
                                throw err;
                            });
                        }else{
                            var new_store_amount=(parseInt(request.amount) + parseInt(request.check_amount));
                            var update_store_amount = {'new_store_amount':new_store_amount,'store_id':request.store_id};
                            storeModel.updateAmount(update_store_amount,function(err,response){
                                if(err){
                                    sql.rollback(function(){
                                        throw err;
                                    })
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
                    }) 
                }else{
                    var new_store_amount=(parseInt(request.amount) + parseInt(request.check_amount));
                    var update_store_amount = {'new_store_amount':new_store_amount,'store_id':request.store_id};
                    storeModel.updateAmount(update_store_amount,function(err,response){
                        if(err){
                            sql.rollback(function(){
                                throw err;
                            })
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
        });
    })
}
module.exports = Check;