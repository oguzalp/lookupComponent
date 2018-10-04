/**************************************************************************************
Apex Class Name     : LookupFieldController
Description         : Controller class of the lookupField component 
Created By          : Oguz Alp
Created Date        : Oct 01, 2018
-------------------------------------------------------------------------------------------------------------- 
Developer                   Date                   Description
----------------------------------------------------------------------------                 
Oguz Alp                    Oct 01, 2018           Initial version
*************************************************************************************/
public with sharing class lookupFieldController {
    
    
    @AuraEnabled
    public static List<Object> getRecordsBySearchTerm(String params,String searchText){
        List<SObject> searchResult = new List<SObject>();
        List<Object> results = new List<Object>();
        try{
            Map<String,Object> paramKeyValues = (Map<String,Object>)JSON.deserializeUntyped(params);
            System.debug(System.LoggingLevel.DEBUG, paramKeyValues);
            String objectName = (String)paramKeyValues.get('objectName');
            String searchInFieldApi = (String)paramKeyValues.get('searchField');
            String record_limit = (String)paramKeyValues.get('limit');
            String likeTerm = '\'%'+String.escapeSingleQuotes(searchText) +'%\''; 

            List<String> args = new List<String>{
                String.escapeSingleQuotes(objectName),
                String.escapeSingleQuotes(searchInFieldApi),
                likeTerm,
                String.escapeSingleQuotes(record_limit)
            };
            String queryTemp = 'SELECT Id,{1} FROM {0} WHERE {1} LIKE {2} LIMIT {3}';
            String squery = String.format(queryTemp, args);
            System.debug('getRecordsBySearchTerm.Query====>'+squery);
            searchResult = Database.query(squery);
            for(sObject rec: searchResult){
                results.add(new Map<String,Object>{
                    'value' => rec.Id,
                    'recordLabel' => rec.get(searchInFieldApi)
                });
            }
            return results;
        }catch(Exception ex){
            throw new AuraHandledException('Error occured while getting record : ' + ex.getMessage() );
        }
    }

    @AuraEnabled
    public static Object getRecordByValue(String params,String sobjectId){
        try {
            Id recordId = Id.valueOf(sobjectId);
            Map<String,Object> args = (Map<String,Object>) JSON.deserializeUntyped(params);
            List<String> tempParams = new List<String>{
                (String)args.get('objectName'),
                (String)args.get('searchField')
            };
            String tempQuery = 'SELECT Id,{1} FROM {0} WHERE Id =:recordId LIMIT 1';
            String sQuery = String.format(tempQuery, tempParams);
            SObject record = Database.query(sQuery);
            return new Map<String,Object>{
                'value'=> record.Id,
                'recordLabel'=>record.get(tempParams.get(1))
            };
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

}