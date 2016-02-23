package com.voticker.bill

import com.github.nscala_time.time.Imports._
import reactivemongo.bson._
import play.api.libs.json._
import play.api.libs.functional.syntax._

/**
 * The BillHistory object for bills.
 * @author Bill Ward
 * @param active true if the bill has activity beyond the typical introductory activities all bills go through (mostly referrals).
 * @param activeAt The date of the first such activity.
 * @param awaitingSignature true in bills that have been sent to the President for signature but have not yet been enacted or voted
 * @param enacted true if the bill was enacted.
 * @param enactedAt The date of the activity.
 * @param housePassageResult The result of the (first) House vote on passage: pass or fail. (This excludes ping-pong and conference report votes.)
 * @param housePassageResult_at The date of the activity.
 * @param houseOverrideResult Present if a veto override occurs, and is either pass or fail.
 * @param senateClotureResult The result of the most recent Senate cloture vote on passage of the bill.
 * @param senateClotureResult_at The date of the activity.
 * @param senatePassageResult The result of the (first) Senate vote on passage: pass or fail. (This excludes ping-pong and conference report votes.)
 * @param senatePassageResult_at The date of the activity.
 * @param senateOverrideResult Present if a veto override occurs, and is either pass or fail.
 * @param vetoed true if the bill was vetoed.
 */
 case class BillHistory(
        active: Option[Boolean]
	,     activeAt: Option[DateTime]
	,     awaitingSignature: Option[Boolean]
  ,     enacted : Option[Boolean]
  ,     enactedAt : Option[DateTime]
  ,     housePassageResult : Option[String]
  ,     housePassageResultAt : Option[DateTime]
  ,     houseOverrideResult : Option[String]
  ,     houseOverrideResultAt : Option[DateTime]
  ,     senateClotureResult : Option[String]
  ,     senateClotureResultAt : Option[DateTime]
  ,     senatePassageResult : Option[String]
  ,     senatePassageResultAt : Option[DateTime]
  ,     senateOverrideResult : Option[String]
  ,     vetoed: Option[Boolean]
  ,     vetoedAt: Option[DateTime]        

 ) {
  
  /*
   * Cleanse data imported data from staging
   */
  def cleanse( ) {

  }
}


object BillHistory {
  
  /** serialize/Deserialize into/from JSON value */
  implicit val billHistoryFormat = Json.format[BillHistory] 
  
}