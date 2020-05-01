'use strict';

var sql = require('./db.js');

var Invoice =function(invoice){
    this.store_id=invoice.store_id;
    this.supplier_id=invoice.supplier_id;
    this.check_id=invoice.check_id;
    this.is_paid=invoice.is_paid;
    this.invoice_amount=invoice.invoice_amount;
    this.invoice_date=invoice.invoice_date;
}

Invoice.addNewInvoice = function (invoice_data,result){
    sql.query('INSERT INTO invoice SET ?',invoice_data, function(err,res){
        if(err){
            result(err,null);
        }else{
            result(null,res.inserted);
        }
    });
}

Invoice.getInvoices = function(result){
    sql.query('SELECT inv.*,sup.*,st.* FROM invoice as inv left join supplier as sup on inv.supplier_id = sup.supplier_id left join store as st on inv.store_id = st.store_id  order by inv.invoice_id desc limit 50',function(err,res){
        if(err){
            result(err);
        }else{
            result(res);
        }
    });
}

module.exports = Invoice;   