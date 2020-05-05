'use strict'

var Supplier = require('../models/supplierModel.js');

exports.add_new_supplier = function(req,res){

    var new_supplier = new Supplier(req.body);
    Supplier.addNewSupplier(new_supplier,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.get_suppliers = function(req,res){

    Supplier.getSuppliers(function(err,supplierObj){
        if(err){
            res.send(err);
        }else{
            res.send(supplierObj)
        }
    });
}
exports.delete_supplier = function(req,res){
    Supplier.deleteSupplier(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.pin_supplier = function(req,res){
    Supplier.pinSupplier(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.un_pin_supplier = function(req,res){
    Supplier.unPinSupplier(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}
exports.update_supplier = function(req,res){
    Supplier.updateSupplier(req.body,function(err,store){
        if(err){
            res.send(err);
        }else{
            res.send(store)
        }
    });
}