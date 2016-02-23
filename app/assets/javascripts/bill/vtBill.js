/**
 * The bill directive.
 */
/*jshint unused: false */
define(['angular'], function(angular) {
	'use strict';

	var mod = angular.module('bill.vtBill', []);

	mod.directive('vtBill', ['billService', 'docService', '$rootScope', '$compile','$http', '$log', 'helper', function(billService, docService, $rootScope, $compile,$http, $log, helper) {

		return {
			restrict: 'AE',
			scope: {
				primaryKey: "=vtprimarykey",
				secondaryKey: "@vtsecondarykey",
				bill: "=vtbill",
				vtTemplate: '@vttemplate',
				vtSetPageTitle: '@vtsetpagetitle'

			},
			link: function(scope ,element, attrs) {
				
				scope.billService = billService;
				scope.helper = helper;

				scope.vtOption = null;
				scope.reloadPage = 0;

				// Flag for when the Bill needs to be reloaded
				scope.$watch("primaryKey",function(newValue, oldValue) {
					if (scope.primaryKey) {
						scope.reload = 0;						
					}
				});
				scope.$watch("reload",function(newValue, oldValue) {
					$log.debug("primaryKey=" + scope.primaryKey);
					billService.findOne(scope.primaryKey).then(function(data) {
						if (data ) {
							scope.bill = data;
							if (scope.vtSetPageTitle) {
								$rootScope.pageTitle = 'Voticker: '+ billService.billTitle(scope.bill);
							}
						}
					}, function(reason) {
						$log.error('vtBill Failed: ' + reason);
						if ( scope.reload <= 3) {
							scope.reload++;
						}
					});
				});
				
				// Flag for when the template needs to be reloaded
				scope.$watch("vtTemplate",function(newValue, oldValue) {
					if (scope.vtTemplate) {
						$log.debug("docID=" + scope.vtTemplate);
						scope.templateDocType = "directive";
						scope.template = "vtBill-" + scope.vtTemplate;
						scope.reloadPage++;
					}
				});
				
				// Load Template
				scope.$watch("reloadPage",function(newValue, oldValue) {
					if (scope.template && scope.reloadPage > 0) {
						docService.findTemplate(scope.template, scope.templateDocType, null).then(function(data) {
							if (data ) {
								element.html(data).show();
								$compile(element.contents())(scope);
							}
						}, function(reason) {
							$log.error('vtSubscription Failed: ' + reason);
							if ( scope.reloadPage <= 3) {
								scope.reloadPage++;
							}
						});
					}
				});
				
				scope.expandSummary = function() {
					$log.debug("Expand Hit");
					scope.vtOption = "Detail";
				};
				scope.collapseDetail = function() {
					$log.debug("Collapse Hit");
					scope.vtOption = "Summary";
				};
				
			}

		};
	}]);  


});
