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
    sql.query('SELECT * FROM supplier ORDER BY sup_order DESC , supplier_id DESC LIMIT 50',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

Supplier.pinSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id
    sql.query('UPDATE supplier SET sup_order = 1 WHERE supplier_id= +'+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.unPinSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id
    sql.query('UPDATE supplier SET sup_order = 0 WHERE supplier_id= +'+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}
Supplier.deleteSupplier = function (supplier_data,result){
    var supplier_id=supplier_data.supplier_id
    sql.query('DELETE FROM supplier WHERE supplier_id= +'+ supplier_id,function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Supplier;