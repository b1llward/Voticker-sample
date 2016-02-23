/**
 * bill/main.js is the entry module which serves as an entry point so other modules only have
 * to include a single module.
 */
define(['angular', './routes', './services', './vtBillList', './vtBill'], function(angular) {
  'use strict';

  return angular.module('voticker.bill', ['ngRoute', 'bill.routes', 'bill.services', 'bill.vtBillList', 'bill.vtBill']);
});
