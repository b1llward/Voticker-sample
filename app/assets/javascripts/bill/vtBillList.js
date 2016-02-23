/**
 * The vt_Billlist directive
 * This directive will display all of the bills for the specified criteria
 */
/*jshint unused: false */
define(['angular'], function(angular) {
	'use strict';

	var mod = angular.module('bill.vtBillList', []);

	mod.directive('vtBillList', ['playRoutes', '$rootScope','billService', '$log', 'helper', function(playRoutes, $rootScope, billService, $log, helper) {
		return {
			restrict: 'AE',
			templateUrl: '/assets/javascripts/bill/vtBillList.html',
			scope: {billID: '=vtbillid',
				billList: '=vtbillids',
				chamber: '@vtchamber',
				congress: '=vtcongress',
				personID: '=vtpersonid',
				sortOption: '@vtsortoption',
				pageSize: '@vtpagesize',
				search: '@vtsearch',
				title: '@vttitle',
				vtTemplate: '@vttemplate'
			},
			link: function(scope ,element, attrs) {

				
				scope.currentPage = 0;
				scope.maxRangeSize = 100;
				scope.total = 0;
				scope.myState = $rootScope.myState;
				
				scope.itemsPerPage = 6;
				if (scope.pageSize) {
					scope.itemsPerPage = scope.pageSize;
				}

				scope.queryBillNumber = -999;
//				if (scope.search === "true") {
//					scope.queryBillNumber = $rootScope.searchStr;
//				}
				if (scope.vtTemplate) {
					scope.template = scope.vtTemplate;
				} else {
					scope.template = "Summary";
				}
				
				scope.helper = helper;
				scope.billService = billService;
				
				// Next Page function
				scope.nextPage = function() {
					if(scope.currentPage < scope.maxRangeSize) {
						scope.currentPage++;
						scope.updated++;
					}
				};
				
				//$log.info('Here prints the vtBilllist directive');
				// Flag for when data is updated
				scope.updated = 0;
				
				$rootScope.$watch("searchStr",function(newValue, oldValue) {
					scope.queryBillNumber = -999;
					scope.currentPage = 0;
					if (scope.search === "true") {
						//$log.debug("watcher: state="+$rootScope.state+" newValue="+newValue+" oldValue="+oldValue);
						if (helper.isInteger($rootScope.searchStr)) {
							scope.queryBillNumber = parseInt($rootScope.searchStr);
						} else {
							scope.queryBillTitle = $rootScope.searchStr;
						}
					}
					scope.updated++;
				});	
				scope.$watch("billID",function(newValue, oldValue) {
					if (scope.billID) {
						scope.updated++;
					}
				});
				scope.$watch("personID",function(newValue, oldValue) {
					if (scope.personID) {
						scope.updated++;
					}
				});

				scope.$watch("billList",function(newValue, oldValue) {
					if (scope.billList) {
						scope.updated++;
					}
				});				
				// Load Bills
				scope.$watch("updated",function(newValue, oldValue) {
					if (scope.billID || scope.personID || scope.congress || scope.queryBillNumber !== -999 || scope.queryBillTitle || scope.billList ) {
						scope.params = {};
						if (scope.billID) {scope.params.billID = scope.billID;}
						if (scope.personID) {scope.params.personID = scope.personID;}
						if (scope.congress) {scope.params.congress = scope.congress;}
						if (scope.queryBillNumber !== -999) {scope.params.billNumber = scope.queryBillNumber;}
						if (scope.chamber) {scope.params.chamber = scope.chamber;}
						if (scope.billList) {scope.params.billList = scope.billList;}
						if (scope.sortOption) {scope.params.sortOption = scope.sortOption;}
						if (scope.queryBillTitle) { scope.params.billTitle = scope.queryBillTitle;}
						
						//$log.debug("Load Bills: CurrentPage=" + $scope.currentPage);
						playRoutes.controllers.BillCtrl.count().post(scope.params).success(function(data) {
							scope.total = data;
						}).catch(function(response) {
							scope.ok = false;
							scope.message = response.data.message;
							$log.error("Count Error: " + response.data.message);
						});
						
						playRoutes.controllers.BillCtrl.find(scope.currentPage, scope.itemsPerPage).post(scope.params).success(function(data) {
							//$log.debug('Bills Loaded length='+data.length);
							if (scope.currentPage === 0 ) {
								scope.bills = data;
							} else {
								// More elements have been added, append to the list			
								for (var i=0; i<data.length; i++) {
									scope.bills.push(data[i]);
								}
							}
						}).catch(function(response) {
							scope.ok = false;
							scope.message = response.data.message;
							$log.error("Find Error: " + response.data.message);
						});
					}
				});
				
				// Generated Title function
				scope.showTitle = function() {
					if (scope.title && scope.title === "off") {
						return null;
					} else {
						if(scope.congress > 0) {
							// Top level page when a congress is specified
							if (scope.title) {
								return scope.title;
							} else {
								return null;
							}
						} else if (scope.personID ) {
							return "Sponsored Bills";
						} else if (scope.billID) {
							return "Bill " + scope.billID;
						} else {
							return "Bills";
						}
					}
				};
				
				
				
			}
		};
	}]); 


});
