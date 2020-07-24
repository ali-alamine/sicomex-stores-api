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
Store.updateAmount = function (store_data,result){
    var sqlQuery = "UPDATE store SET amount = "+ store_data.new_store_amount  +  " WHERE store_id = " + store_data.store_id;
    console.log(sqlQuery)
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
    console.log('FORM THE DYNAMIC METHOD');
    console.log(sqlQuery)
    return sqlQuery;
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
                                var responseData=[check_res,bank_deposit_res];
                                result(null,responseData);
                            }
                        });
                    }
                })
            }
        });
    })
    
}

module.exports = Store;