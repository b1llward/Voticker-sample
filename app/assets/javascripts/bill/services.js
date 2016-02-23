/**
 * User service, exposes user model to the rest of the app.
 */
/*jshint unused: false */
define(['angular', 'common'], function (angular) {
	'use strict';

	var mod = angular.module('bill.services', ['voticker.common']);
	mod.service('billService', ['$http', '$q', 'playRoutes', '$log', 'helper', function ($http, $q, playRoutes, $log, helper) {
		
		/* Promise Function to retrieve a Bill. 
		 * @param primaryKey The Bill ID
		 * @return The document object that was pulled from the service
		 */ 
		function findOne(primaryKey){
			var deferred = $q.defer();	
			var template = null;
			//$log.info('findOne Documents primaryKey=' + primaryKey + " secondary=" + secondaryKey);
			playRoutes.controllers.BillCtrl.findOne(primaryKey).get().success(function(data) {
				if (data) {
					deferred.resolve(data);
				} else {
					deferred.reject('billService.findOne: No document found.  Primary=' + primaryKey );
				}
			}).catch(function(response) {
				$log.error("billService.findOne: Error: " + response.data.message);
				deferred.reject(response.data.message);
			});
			return deferred.promise;
		}

		
		

		/* Function to return a URL for the avatar of a individual 
		 * @param mediaList List of Media that should contain the URL of an avatar
		 * @param size The preferred size of the avatar
		 */ 
		function billLink( leg) {

			var congLink = "";
			var url = "";
			if (leg) {
				if (leg.billType === "hr" ) {
					congLink = "house-bill";
				} else if ( leg.billType === "hres") {
					congLink = "house-resolution";	
				} else if ( leg.billType === "hjres") {
					congLink = "house-joint-resolution";			
				} else if ( leg.billType === "hconres") {
					congLink = "house-concurrent-resolution";			
				} else if (leg.billType === "s"  ) {
					congLink = "senate-bill";
				} else if ( leg.billType === "sres") {
					congLink = "senate-resolution";	
				} else if ( leg.billType === "sjres") {
					congLink = "senate-joint-resolution";			
				} else {  //sconres
					congLink = "senate-concurrent-resolution";							
				}
				//$log.debug("---billLink: billType="+leg.billType+" congLink="+congLink);
				url = "https://www.congress.gov/bill/" + leg.congress +"th-congress/" + congLink + "/" + leg.billNumber +"/text";
			}

			//$log.debug("URL=" + url);
			return url;
		}

		
		function billProgress(bill) {
			// Bill Progress function
				//$log.debug("bill ="+bill);
				var progress = null;
				if (bill) {
					if (bill.history) {
						//$log.debug("-enacted="+bill.history.enacted+" vetoed="+bill.history.vetoed+" house="+bill.history.housePassageResult);
						if (bill.history.enacted) {
							progress = "yes2-small";
						} else if( bill.history.vetoed ) {
							progress = "no2-small";
						} else { 
							var hprog = "";
							var sprog = "";
							if (bill.history.housePassageResult) {		
								if (helper.voteFlag(bill.history.housePassageResult) ) {
									hprog = "hyes";
								} else {
									hprog = "hno";
								}
							}
							if (bill.history.senatePassageResult) {
								if (helper.voteFlag(bill.history.senatePassageResult) ) {
									sprog = "syes";
								} else {
									sprog = "sno";
								}
							}
							progress = sprog + hprog;
							if (progress.length < 1) {
								progress = "pyes";
							}
						}
					} else {
						progress = "pyes";
					}
				} else {
					progress = "unk2-small";			
				}
				var url = "/assets/images/"+progress+".png";
				//$log.debug("bill url="+url);
				return url;			
			
		}
		
		
		/* Function to determine if the refLegislation structure (leg) is a bill 
		 * @param leg refLegislation data structure
		 * @return Boolean flag of true/false if the legislation is a bill
		 */ 
		function isBill(leg) {
			var flag = false;
			if (leg) {
				if (leg.billID ) {
					if ( leg.billType === "s"  || leg.billType === "hr") {
						flag=true;
					}
				}
			}
			return flag;
		}

		/* Function to determine if the refLegislation structure (leg) is a resolution 
		 * @param leg refLegislation data structure
		 * @return Boolean flag of true/false if the legislation is a resolution
		 */ 
		function isResolution(leg) {
			var flag = false;
			if (leg) {
				if (leg.billID ) {
					if ( leg.billType === "hres"  || leg.billType === "hconres"  ||
						leg.billType === "hjres"  || leg.billType === "sres"  ||
						leg.billType === "sconres"  || leg.billType === "sjres") {
						flag=true;
					}
				}
			}
			return flag;
		}
		
		/* Function to return the chamber that a bill in a refLegislation structure (leg) is from
		 * @param leg refLegislation data structure
		 * @return String containing either "House" or "Senate"
		 */ 
		function billType(leg) {
			var str = "House";
			if (leg) {
				if (leg.billID ) {
					if ( leg.billType === "s" ) {
						str = "Senate";
					}
				}
			}
			return str;
		}
		
		// Return the best option for a bill title
		function billTitle(bill) {
			var title="";
			if (bill) { 
				title = bill.officialTitle;
				if (bill.popularTitle) {
					if (bill.popularTitle.length > 0) {
						title = bill.popularTitle;
					}
				} else if (bill.shortTitle) {
					if (bill.shortTitle.length > 0 ) {
						title=bill.shortTitle;
					}
				}
			}
			return title;
		}
		
		// Return the text for the Bill Type
		function billTypeText(billType) {
			var text="";
			if (billType) {
				if (billType === "hr") {
					text = "by the House as a bill";
				} else if ( billType === "hres") {
					text = "by the House as a resolution";
				} else if ( billType === "hconres") {
					text = "by the House as a concurrent resolution";
				} else if ( billType === "hjres") {
					text = "by the House as a joint resolution";
				} else if (billType === "s") {
					text = "by the Senate as a bill";
				} else if ( billType === "sres") {
					text = "by the Senate as a resolution";
				} else if ( billType === "sconres") {
					text = "by the Senate as a concurrent resolution";
				} else if ( billType === "sjres") {
					text = "by the Senate as a joint resolution";
				}
			}
			return text;
		}
		
		// Return a list of billIDs from the related Bills
		function relatedBillList(bill) {
			var list=null;
			if (bill) {
				if (bill.relatedBills) {
					list=[];
					var arrayLength = bill.relatedBills.length;
					for (var i = 0; i < arrayLength; i++) {
						list[i] = bill.relatedBills[i].billID;
					}
				}
			}
			return list;
		}
		
		return {
			findOne: findOne,
			billLink: billLink,
			billProgress: billProgress,
			isBill: isBill,
			isResolution: isResolution,
			billType: billType,
			billTitle: billTitle,
			billTypeText: billTypeText,
			relatedBillList: relatedBillList
		};
		
	}]);
	return mod;
});
