'use strict';

var sql = require('./db.js');

var Supplier =function(store){
    this.supplier_name=store.supplier_name;
    this.supplier_amount=store.supplier_amount;
}

Supplier.addNewSupplier = function (new_supplier,result){
    sql.query('INSERT INTO supplier SET ?',new_supplier, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    })
}
Supplier.getSuppliers = function (result){
    sql.query('SELECT * FROM supplier ORDER BY sup_order DESC , supplier_id DESC',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.pinSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id
    sql.query('UPDATE supplier SET sup_order = 1 WHERE supplier_id= '+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.unPinSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id
    sql.query('UPDATE supplier SET sup_order = 0 WHERE supplier_id= '+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.deleteSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id;
    sql.query('DELETE FROM supplier WHERE supplier_id= '+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.updateSupplier = function (supplier_data,result){
    var sqlQuery='UPDATE supplier SET supplier_name= ' +"'"+ supplier_data.edit_supplier_name  +"'" + ',supplier_amount= ' + supplier_data.edit_supplier_amount + " WHERE supplier_id = " + supplier_data.supplier_id;
    console.log(sqlQuery)
    sql.query( sqlQuery,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.updateAmount = function (supplier_data,result){
   
    var sqlQuery = "UPDATE supplier SET supplier_amount = "+ supplier_data.new_supplier_amount  +  " WHERE supplier_id = " + supplier_data.supplier_id;
    console.log(' *************************** sqlQuery ***************************')
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
Supplier.searchSupplierByName = function (supplier_name,result){
    var sqlQuery='';
    if(supplier_name == ''){
        sqlQuery = 'SELECT * FROM supplier WHERE supplier_name LIKE  "% %"';
    }else{
        sqlQuery = 'SELECT * FROM supplier WHERE supplier_name LIKE ' + "'%" + supplier_name + "%'" + 'LIMIT 10';
    }
    console.log(' *************************** sqlQuery ***************************')
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
Supplier.advancedSearchSuppliers = function (request,result){
    var sqlQuery='';
    var sql_and='';
    var amount_from=request.amount_from;
    var amount_to=request.amount_to;
    var suppliers_ids=request.supplier_ids;
    sqlQuery= 'SELECT * FROM supplier WHERE 1 ';
    if(amount_from != ''){
        sql_and = sql_and +' AND supplier_amount >= ' + amount_from;
        console.log('HERE WE GO')
    }
    if(amount_to != ''){
        sql_and = sql_and +' AND supplier_amount <= ' + amount_to;
    }
    if(suppliers_ids.length > 0 ){
        sql_and = sql_and + ' AND supplier_id in (' + suppliers_ids + ')';
    }
    sqlQuery= sqlQuery +sql_and + ' ORDER BY sup_order DESC , supplier_id';
    console.log(' ************************* sqlQuery *************************** ');
    console.log(sqlQuery)
    sql.query(sqlQuery,function(err,res){
        if(err){
            sql.rollback(function() {
                throw err;
            });
        }else{
            result(null,res);
        }
    });
}

module.exports = Supplier;