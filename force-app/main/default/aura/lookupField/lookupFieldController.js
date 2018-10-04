({
    initAction : function(cmp, event, helper) {
        console.log('init.lookupField...');
        var theValue = cmp.get("v.value");
        if(!$A.util.isEmpty(theValue)){
            helper.getRecordLabel(cmp,helper);
        }
    },
    handleKeyUp: function(cmp,event,helper){
        var escape = 27;
        var up = 38;
        var down = 40;
        var enter = 13;
        var keyCode = event.which || event.keyCode;
        var searchValue = cmp.find("input-lookup").getElement().value;
        if(!searchValue){
            helper.closeList(cmp);
            return;
        }
        if(escape === keyCode){
            helper.closeList(cmp);
        }else if(up === keyCode){
            helper.focusRecord(cmp,'up');    
        }else if(down == keyCode){
            helper.focusRecord(cmp,'down');
        }else if(enter === keyCode){
            helper.enterRecord(cmp);  
        }
        else{
            helper.getRecords(cmp,event,helper);
        }  
    },
    invokeSelection: function(cmp,event,helper){
        helper.selectRecord(cmp,event,helper);
    },
    handleOnItemRemoveEvt : function(cmp,event,helper){
		cmp.set("v.pillContainer",[]);
        cmp.set("v.isSelected",false);
        helper.closeList(cmp);
    }
})