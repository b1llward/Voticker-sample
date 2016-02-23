package com.voticker.bill

import com.github.nscala_time.time.Imports._
import play.api.libs.json.Json
import play.api.libs.functional.syntax.functionalCanBuildApplicative
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import com.voticker.common.models._
import com.voticker.core.models._

/**
 * The bill object.
 *
 * @author Bill Ward
 * 
 * @param vrs Voticker Record Stamp document
 * @param refLegislation Uniquely identifies the bill with a combination of a bill_id, congress, bill type, and bill number.  
 * @param introducedAt Date of when the bill was introduced.  All introduction dates are dates, not specific times
 * @param officialTitle Bills can have "official" descriptive titles (almost always)
 * @param popularTitle "short" catchy titles (sometimes).
 * @param shortTitle "popular" nickname titles (rare)
 * @param subjectsTopTerm A bill is assigned at most one "top term" which is set here.  A bill's subject may change through its life cycle.
 * @param status The current status of the bill.  
 * @param activeAt The date or timestamp when the bill transitioned to that status
 * @param titles An array of titles associated with the bill
 * @param subjects An array of subjects associated with the bill
 * @param summary A document that contains the summary of the bill
 * @param enactedAs A document that defines which congress enacted the bill
 * @param history A document that contains the history of the bill
 * @param sponsor Sponsor of the bill
 * @param
 * @param committees committes that put forth the bill
 */
 
 
case class BillModel(

      override var vrs: Option[VotickerRecordStamp]
    , refLegislation: RefLegislation
    , introducedAt: DateTime
    , officialTitle: Option[String]
    , popularTitle: Option[String]
    , shortTitle: Option[String]
    , subjectsTopTerm: Option[String]
    , status: String
    , statusAt: Option[DateTime]
    , titles: List[Title]
    , subjects: List[String]
    , summary: Option[Summary]
    , enactedAs: Option[EnactedAs]
    , history: Option[BillHistory]
    , sponsor: Option[Sponsor]
    , coSponsors: Option[List[Sponsor]]
    , committees: Option[List[Committee]]
    , relatedBills: Option[List[RefLegislation]]
    , relatedAmendments: Option[List[RefLegislation]]
) extends IdModel[BillModel] {
  
  
  def title : String = {
    shortTitle.getOrElse(popularTitle.getOrElse(officialTitle.getOrElse("")))
  }
  
  def URLTitle( ): String = {
    title.replaceAll("[ ,/:;\\\'\"]", "_")
  }
}



object BillModel {
  /** serialize/Deserialize into/from JSON value */
  implicit val billFormat = Json.format[BillModel] 

}