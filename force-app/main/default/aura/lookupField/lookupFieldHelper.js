({
    getRecords : function(cmp,event,helper) {
        var searchValue = cmp.find("input-lookup").getElement().value;
        if(!searchValue) return;

        var action = cmp.get("c.getRecordsBySearchTerm");
        action.setParams({ 
            "params" : helper.getArgs(cmp),
            "searchText" : searchValue,
        });
        action.setCallback(this,function(res){
            if(res.getState() === "SUCCESS"){
                var records = res.getReturnValue();
                if($A.util.isEmpty(records)){
                    cmp.set("v.norecords",true);
                }else{
                    cmp.set("v.norecords",false);
                }
                cmp.set("v.records",records);                    
            }else{
                console.error(res.getError()[0]);
            }
        });
        $A.enqueueAction(action);   
    },
    selectRecord:function(cmp,event,helper){
        var el = event.currentTarget;
        //hide dropdown list
        cmp.set("v.records",[]);
        if(el){
            console.log(el.dataset.id);
            console.log(el.dataset.label);
            cmp.set("v.value",el.dataset.id);
            cmp.set("v.recordLabel",el.dataset.label);
            helper.createPillBox(cmp,helper);
        }
    },
    enterRecord: function(cmp){
        var recIndx = cmp.get("v.recordIndex");
        console.log('recorIndx===>',recIndx);
        var recList = cmp.find("record-li");
        if( $A.util.isUndefinedOrNull(recList)) return;
        if( $A.util.isEmpty(recList)) return;
        var el = recList[recIndx];
        if(!$A.util.isUndefinedOrNull(el)){
            //it will execute invokeRecord function
            el.getElement().click();
        } 
    },
    getArgs: function(cmp){
        var args = {
            "objectName" : cmp.get("v.object"),
            "searchField": cmp.get("v.searchField"),
            "limit": cmp.get("v.limit")    
        };
        return JSON.stringify(args);
    },
    createPillBox:function(cmp,helper){
        var attrs = [{
                type: 'icon',
                href: '',
                label: cmp.get("v.recordLabel"),
                iconName: cmp.get("v.iconName"),
                alternativeText: cmp.get("v.object"),
        }];
        $A.createComponent("lightning:pillContainer",{
            "aura:id" : "selected-pill",
            "items" : attrs,
            "singleLine":true,
            "label" : cmp.get("v.recordLabel"),
            "onitemremove" : cmp.getReference("c.handleOnItemRemoveEvt")
        },function(pill,status,err){
             if(status === "SUCCESS") {
                cmp.set("v.pillContainer",[pill]);
                cmp.set("v.isSelected",true);
                var isReadonly = cmp.get("v.readonly");
                if(isReadonly){
                    pill.set("v.onitemremove",function(c){
                       var ts = $A.get("e.force:showToast");
                       ts.setParams({
                            "type" : "info",
                            "title": "Warning!",
                            "message": "You do not have permission to edit this record!"
                        });
                        ts.fire();
                    });
                    window.setTimeout($A.getCallback(function(){
                       $A.util.addClass(pill,'slds-disabled'); 
                    }),300);             
                }
             }else if(status === "ERROR"){
                console.error('error occured while creating pillbox==>',err);
             }
        });
    },
    getRecordLabel:function(cmp,helper){
       var action = cmp.get("c.getRecordByValue");
       var recId = cmp.get("v.value");
       action.setParams({
           "params":helper.getArgs(cmp),
            "sobjectId" : recId
        });
        action.setCallback(this,function(res){
            if(res.getState() === "SUCCESS"){
                var record = res.getReturnValue();
                cmp.set("v.value",record.value);
                cmp.set("v.recordLabel",record.recordLabel);
                helper.createPillBox(cmp);
            }else{
                console.error("Something wrong in getRecordLabel method. Err: " ,res.getError()[0]);
            }
        });
        $A.enqueueAction(action);
    },
    focusRecord:function(cmp,move){
        var recIndex = cmp.get("v.recordIndex");
        var recordList = cmp.find("record-li");
        if($A.util.isEmpty(recordList)) return;
        if(move === 'up'){
            if(recIndex === recordList.length){
                recIndex = 0;   
            }else{
                recIndex--;
            }  
        }else if(move === 'down'){
            if(recIndex === recordList.length){
                recIndex = 0;   
            }else{
                recIndex++;
            }
        }
        cmp.set("v.recordIndex",recIndex);
    },
    closeList: function(cmp){
        cmp.set("v.records",[]);
        cmp.set("v.norecords",false);
        cmp.set("v.recordIndex",0);
        cmp.set("v.value",'');
    },
    showToast: function(type,title,message) {
        var ts = $A.get("e.force:showToast");
        ts.setParams({
            "type" : type,
            "title": title,
            "message": message
        });
        ts.fire();
    }
})