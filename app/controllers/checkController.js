'use strict';

var Check = require('../models/checkModel.js');

exports.add_new_exp_check=function(req,res){

    var request = req.body;
    console.log('rrrrrrrrrrrrequest')
    console.log(request)
    var check_data={};
    if(!request.is_for_sup){
        check_data={'store_id':request.store_id,'check_number':request.check_number,'check_description':request.check_description,'check_amount':request.check_amount,'check_date':request.check_date,'is_paid':request.is_paid_check,'is_for_sup':request.is_for_sup}
    }else{
        var invoice_ids_arr=[];
        for(var i=0;i<request.invoice_ids.length;i++){
            invoice_ids_arr.push(request.invoice_ids[i].split(' |')[1]);
        }
        var new_arr_val= invoice_ids_arr.join(',');
        check_data={'store_id':request.store_id,'supplier_amount':request.supplier_amount,'supplier_id':request.supplier_id,'check_number':request.check_number,'check_amount':request.check_amount,'check_date':request.check_date,'is_paid':request.is_paid_check,'invoice_ids':new_arr_val,'is_for_sup':request.is_for_sup}
    }
    Check.addNewCheck(check_data,function(err,Check){
        if(err){
            res.send(err)
        }else{
            res.send(Check)
        }
    })
}
exports.get_checks=function(req,res){

    var request = req.body;
    Check.getChecks(check_data,function(err,Check){
        if(err){
            res.send(err)
        }else{
            res.send(Check)
        }
    })
}