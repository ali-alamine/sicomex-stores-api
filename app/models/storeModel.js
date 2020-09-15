'use strict';

var sql = require('./db.js');

var Store =function(store){
    this.store_name=store.new_store_name;
    this.amount=store.new_store_init_amount;
}

Store.addNewStore = function (store_details,result){
    console.log(' **** store_details')
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
Store.updateAmount = function (store_data,result){
    var sqlQuery = "UPDATE store SET amount = "+ store_data.new_store_amount  +  " WHERE store_id = " + store_data.store_id;
    
    sql.query( sqlQuery,function(err,res){
        if(err){
            sql.rollback(function() {
                throw err;
            });
        }else{
            result(null,res);
        }
    });
}
Store.searchStoreByName = function (store_name,result){
    var sqlQuery='';
    if(store_name == ''){
        sqlQuery = 'SELECT * FROM store WHERE store_name LIKE  "% %"';
    }else{
        sqlQuery = 'SELECT * FROM store WHERE store_name LIKE ' + "'%" + store_name + "%'" + 'LIMIT 10';
    }
    sql.query( sqlQuery,function(err,res){
        if(err){
            sql.rollback(function() {
                throw err;
            });
        }else{
            result(null,res);
        }
    });
}

function dynamicQueryForStoreBankAcc(data,table_name,date_field_name){
    var sqlCondition='';
    var sqlQuery='SELECT * FROM ' + table_name + ' WHERE store_id= ' + data.store_id;
    if(data.date_from != 'Invalid date'){
        sqlCondition = sqlCondition + ' AND date('+ date_field_name +') >= ' +"'" + data.date_from + "'"+ ' ';
    }
    if(data.date_to != 'Invalid date'){
        sqlCondition = sqlCondition + ' AND date('+ date_field_name +') <= ' +"'" + data.date_to + "'" +' ';
    }
    if(table_name == 'bank_check'){
        sqlCondition = sqlCondition + ' AND is_paid = 1';
    }
    sqlQuery = sqlQuery + sqlCondition + ' ORDER BY ' + date_field_name + ' DESC';
    return sqlQuery;
}
function custom_sort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

Store.getStoreBankAcc = function(data,result){
    sql.beginTransaction(function(err){
        
        sql.query(dynamicQueryForStoreBankAcc(data,'bank_check','check_date'),function(err,check_res){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                sql.query(dynamicQueryForStoreBankAcc(data,'store_entry','entry_report_date'),function(err,bank_deposit_res){
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
                            }else{
                                // var responseData=[check_res,bank_deposit_res];
                                var temp_data=[];
                                var combinedRes=[];

                                check_res.forEach(check => {
                                    temp_data.push(check);
                                    combinedRes.push({'type':'check','check_number':check.check_number,'sign':'-','amount':check.check_amount,'date':check.check_date})
                                });
                                bank_deposit_res.forEach(deposit => {
                                    temp_data.push(deposit)
                                    combinedRes.push({'type':'deposit','sign':'+','amount':deposit.bank_deposit,'date':deposit.entry_report_date})
                                });
                                combinedRes.sort(custom_sort);
                                result(null,combinedRes);
                            }
                        });
                    }
                })
            }
        });
    })
    
}

Store.getStoreExpenses = function(req,result){
    
    sql.beginTransaction(function(err){

        var sqlQuery='SELECT store_entry_id, cash_expense_amount AS total_expense, entry_report_date FROM store_entry WHERE store_id = ' + req.store_id;
        var sqlDate_from=' AND date(entry_report_date) >= ' +"'" + req.date_from + "'";
        var sqlDate_to=' AND date(entry_report_date) <= ' + "'" + req.date_to + "'";
        if(req.date_from != 'Invalid date'){

            sqlQuery=sqlQuery +sqlDate_from; 
        }
        if(req.date_to != 'Invalid date'){

            sqlQuery=sqlQuery +sqlDate_to; 
        }
        sql.query(sqlQuery,function(err,res1){
            if(err){
                sql.rollback(function() {
                    throw err;
                });
            }else{
                var sqlQuery2='SELECT * FROM `cash_detail` WHERE store_id= ' +req.store_id;
                sql.query(sqlQuery2,function(err,res2){
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
                            }else{
                                let combinedRes=[res1,res2];
                                result(null,combinedRes);
                            }
                        });
                    }
                })
            }
        });
    })
}

module.exports = Store;