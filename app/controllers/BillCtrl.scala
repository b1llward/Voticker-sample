package controllers

import javax.inject.{Inject,Singleton}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Future,Await}
import scala.concurrent.duration.Duration
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.mvc.{Action, Controller}
import play.api.i18n.{Messages, MessagesApi, I18nSupport}
import play.api.libs.concurrent.Execution.Implicits._
import com.voticker.core.utils.VotickerUtils._
import com.voticker.core.utils.Logging
import com.voticker.core.models.BaseParameter
import com.voticker.bill._
import play.api.cache.Cached

/*
 * @author: Bill Ward
 */

@Singleton
class BillCtrl @Inject() 
  (val serv: BillService,   
   override val messagesApi: MessagesApi, cached: Cached) extends BaseCtrl[BillModel](messagesApi,cached) {


  /**
   * Converts the find/count input parameters from JSON into a  object.
   *
   * @param chamber The name of the chamber to display, "all", "s", "r", "e"
   * @param congress The congress number to pull data from
   * @param personID The ID of the person's bill to display, "all", "03134", etc
   * @param billID The Bill ID of the bill
   * @param billNumber The Bill number of the bill
   * @param sortOption Sort Options
   * 
   */
  case class Parameters(
        chamber: Option[String]
  ,     congress : Option[Int]
	,     personID: Option[String]
  ,     billID : Option[String]
  ,     billNumber : Option[Int]
  ,     sortOption: Option[String]
  ,     billList: Option[List[String]]
  ,     billTitle: Option[String]
 ) extends BaseParameter[Parameters] {
    override def queryBuilder = {
      val exclude = sortOption match {
        case Some(sort) => if ( sort == "statusAt") {
          // Don't show introduced bills, just ones that have changed
          serv.notEqual("status","REFERRED")
        } else {
          None
        }
        case _ => None
      }
      log.debug(s"sortOption=$sortOption")
      serv.queryBuilder("active"
                            ,serv.keyValue("refLegislation.chamber",chamber)
                            ,serv.keyValue("sponsor.id.bioguide",personID)
                            ,serv.keyValue("refLegislation.billID",billID)
                            ,serv.keyValue("refLegislation.congress",congress)
                            ,serv.keyValue("refLegislation.billNumber",billNumber)
                            ,serv.in("refLegislation.billID",billList)
                            ,serv.textSearch("shortTitle",billTitle)
                            ,exclude)
     }    
   override def sortBuilder =  sortOption match {
        case Some(sort) => if ( sort == "statusAt")  
            serv.queryBuilder(1,serv.keyValue("statusAt",-1))
          else
            serv.queryBuilder(1,serv.keyValue("introducedAt",-1))
        case _ => serv.queryBuilder(1,serv.keyValue("introducedAt",-1))
      }
      
  }
  implicit val parametersFormat = Json.format[Parameters] 

  def find(page: Int, perPage: Int) = findBase[Parameters](page, perPage, serv )
  def count() = countBase[Parameters](serv )
  def findOne(primaryKey: String) = findOneBase("/api/bill/findOne", primaryKey, None, serv )

  /** Serves the site map for Bills (hr, hres, hjres, hconres, s, sres, sjres, sconres) */
  def sSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","s"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def hrSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","hr"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 500),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def hresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","hres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def hjresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","hjres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def hconresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","hconres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def sresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","sres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def sjresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","sjres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
  def sconresSitemap() = Action {
    log.debug("In SiteMap!")
    val query = serv.queryBuilder("active"
                                  ,serv.keyValue("refLegislation.billType","sconres"))  
    val sort = serv.queryBuilder(1,serv.keyValue("statusAt",-1))
    val docList = Await.result(serv.find(query, sort, 0, 1000),Duration.Inf)
    Ok(views.xml.billSitemap(docList))
  }
}
