'use strict';

var Check = require('../models/checkModel.js');

exports.add_new_exp_check=function(req,res){

    var request = req.body;
    console.log(request)
    if(!request.is_for_sup){
        var check_data={'store_id':request.store_id,'check_description':request.check_description,'check_amount':request.check_amount,'check_date':request.check_date,'is_paid':request.is_paid_exp_check,'is_for_sup':request.is_for_sup}
    }else{
        console.log('exp check')
    }
    Check.addNewCheck(check_data,function(err,Check){
        if(err){
            res.send(err)
        }else{
            res.send(Check)
        }
    })
}