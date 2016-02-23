/**
 * Bill controllers.
 */
/*jshint unused: false */
define([], function() {
	'use strict';

	/* Display the details of a Bill */
	var BillsCtrl = function($rootScope, $scope, playRoutes, helper, $routeParams,  $log  ) {
		
		$rootScope.pageTitle = 'Voticker - Bills';

	};
	BillsCtrl.$inject = ['$rootScope', '$scope', 'playRoutes', 'helper', '$routeParams', '$log'  ];

	/* Display the details of a Bill */
	var BillCtrl = function($rootScope, $scope, playRoutes, helper, $routeParams, $timeout, $log, $window, $location ) {

		$scope.billID = $routeParams.billID;
		$rootScope.pageTitle = 'Voticker - Bill: '+ $scope.billID;


	};
	BillCtrl.$inject = ['$rootScope', '$scope', 'playRoutes', 'helper', '$routeParams', '$timeout', '$log', '$window', '$location' ];


	return {
		BillCtrl: BillCtrl,
		BillsCtrl: BillsCtrl,
	};



});
