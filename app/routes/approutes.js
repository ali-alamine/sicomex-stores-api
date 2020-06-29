'use strict';

module.exports = function(app){
    var store_controller = require('../controllers/storeController');
    var supplier_controller = require('../controllers/supplierController');
    var invoice_controller = require('../controllers/invoiceController');
    var store_entry_controller = require('../controllers/storeEntryController');
    var check_controller = require('../controllers/checkController');

    app.route('/store')
    .post(store_controller.add_new_store)
    .get(store_controller.get_all_stores)

    app.route('/supplier')
    .post(supplier_controller.add_new_supplier)
    app.route('/supplier')
    .get(supplier_controller.get_suppliers)
    app.route('/pin_supplier')
    .post(supplier_controller.pin_supplier)
    app.route('/un_pin_supplier')
    .post(supplier_controller.un_pin_supplier)
    app.route('/delete_supplier')
    .post(supplier_controller.delete_supplier)
    app.route('/update_supplier')
    .post(supplier_controller.update_supplier)

    app.route('/invoice')
    .post(invoice_controller.add_new_invoice)
    app.route('/invoice')
    .get(invoice_controller.get_invoices)
    app.route('/update_invoice')
    .post(invoice_controller.update_invoice)
    app.route('/delete_invoice')
    .post(invoice_controller.delete_invoice)
    app.route('/pin_invoice')
    .post(invoice_controller.pin_invoice)
    app.route('/un_pin_invoice')
    .post(invoice_controller.un_pin_invoice)
    app.route('/get_invoice_by_number')
    .post(invoice_controller.get_invoice_by_number)
    app.route('/advanced_search_invoice')
    .post(invoice_controller.advanced_search_invoice)

    app.route('/starting_amount')
    .post(store_entry_controller.get_store_starting_amount)
    app.route('/add_new_store_entry')
    .post(store_entry_controller.add_new_store_entry)
    .get(store_controller.get_all_stores)


    app.route('/add_new_check')
    .post(check_controller.add_new_check)
    app.route('/get_checks')
    .get(check_controller.get_checks)
    app.route('/pin_check')
    .post(check_controller.pin_check)
    app.route('/un_pin_check')
    .post(check_controller.un_pin_check)
    app.route('/update_check')
    .post(check_controller.update_check)
    app.route('/set_check_paid')
    .post(check_controller.set_check_paid)
    app.route('/set_check_unPaid')
    .post(check_controller.set_check_unPaid)
    app.route('/advanced_search_bank_check')
    .post(check_controller.advanced_search_bank_check)

}