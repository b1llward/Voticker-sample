package com.voticker.bill

import javax.inject.{Inject,Singleton}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import play.api.libs.json.Json
import com.voticker.core.dao._
import com.voticker.bill.BillDAO._

@Singleton
class BillDAO 
   extends MongoCrudDAO[BillModel] with BillService {

    val collectionName = "bill"
        
    override def ensureIndexes = {
        Future.sequence(
            List(ensureIndex(List( "vrs.primaryKey" -> ascending
                                  ,"vrs.docStatus" -> ascending), unique = false)
                ,ensureIndex(List( "refLegislation.billID" -> ascending
                                  ,"vrs.docStatus" -> ascending), unique = false)
                ,ensureIndex(List( "refLegislation.congress" -> ascending
                                  ,"introducedAt" -> descending
                                  ,"vrs.docStatus" -> ascending), unique = false)
                ,ensureIndex(List( "vrs.docStatus" -> ascending
                                  ,"introducedAt" -> descending), unique = false)
                ,ensureIndex(List( "shortTitle" -> textSearch  // Make full name a text search
                                  ,"vrs.docStatus" -> ascending), unique = false)

            )
        )
    }
}
    
object BillDAO {

  
}
  
