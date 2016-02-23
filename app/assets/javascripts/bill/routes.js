/**
 * Vote routes.
 */
define(['angular', './controllers', 'common'], function(angular, controllers) {
  'use strict';

  var mod = angular.module('bill.routes', ['voticker.common']);
  mod.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/bill/:billID',  {templateUrl: '/assets/javascripts/bill/bill.html',  controller:controllers.BillCtrl})
      .when('/bill/:billID/:name',  {templateUrl: '/assets/javascripts/bill/bill.html',  controller:controllers.BillCtrl})
      .when('/billindex',  {templateUrl: '/assets/javascripts/bill/billindex.html',  controller:controllers.BillsCtrl})
      .when('/bills',  {templateUrl: '/assets/javascripts/bill/bills.html',  controller:controllers.BillsCtrl})

      ;
  }]);
  return mod;
});
