$().ready(function(){
/*	$('#father_tab').easytabs({
		animate: false
	});	*/
	
	$('#importExcel').uploadify({
		'swf' : 'js/upload/uploadify.swf',				
		'cancelImg'   : 'js/upload/cancel.png',
		'uploader' : 'uploadExcel.action',
		'queueID' : 'fileQueue',
		'auto' : true,
		'multi' : false,
		'buttonText' : '导入Excel',
		'fileSizeLimit' : '5MB',
		'fileObjName' : 'excelImport',
		'onUploadSuccess' : uploadComplete,
		'method' : 'post',
		'fileTypeDesc' : '请选择xls xlsx文件',
	    'fileTypeExts' : '*.xls; *.xlsx;',
	    'onUploadStart': function (file) { 		
	    	//$('#importExcel').message("正在上传"); 
	    	$("#importExcel").uploadify("settings", "formData",
	    			{ 'proID':$("#proID").val(),'algID':$("#curAlgID").val(),'InOrOut':"In" });  
	    }
	
	});
	
	
	}); 
//function openProjectModal(){
//	$('#add_project_modal').modal();
//	$('#list_project_modal').modal('hide');
//	createNewProject();
//}

function listProjectModal(){
	$('#list_project_modal>.modal-dialog').css({
		 'margin-top': function () {
		            return ($(window).height())/2-this.height/2;
		        },
		 'margin-right':function () {
		            return 800;
		            //(($(window).width())/2-this.width/2);
		        }
		});
	$('#list_project_modal').modal();
	$('#load_modal').modal('hide')
}
function uploadComplete(file, data, response) {
	var tempJson = jQuery.parseJSON(data);
	if(tempJson['msg']==null||tempJson['msg']==''){
		alert("上传成功！");
		//openProject($("#proID").val());
		var sheetDiv = "#input-sheet";
		var inputSheetNum=$("#inputSheetNum").val();
		for(var i=0;i<inputSheetNum;i++){//刷新5个表格
	    	$(sheetDiv+i).trigger("reloadGrid");
	    }
	}else{
		alert(tempJson['msg']);
	}
}

function saveExcel(){
	$.ajax({
		type:'post',
		url:'saveExcel.action',
		data:{
			proID:$("#proID").val(),
			algID:$("#curAlgID").val(),
			InOrOut:"In"
		},
		dataType:'json',
		success:function(data){
			alert("保存成功！");
			var sheetGrid=new SheetGrid();
			sheetGrid.reloadGrid();
		},
		error:function(msg){
			alert(msg);
		}
	});
}
function runAlg(way){
	$.ajax({
		type:'post',
		url:'runAlgPro.action',
		data:{
			ID:$("#proID").val()
		},
		dataType:'json',
	    beforeSend:function(XMLHttpRequest){
	    	//location.href=window.location.pathname+"#run_tab";
	    	
	    },
		success:function(data){				
			//$("#isRunning").hide();		
			if(data.msg==null||data.msg==""){
				//alert("运行结束！")
				$("#outputarea").text("");
				var logSize=0;
				showLogInter();
		    	if(way==0){
		    	showTab("run_tab");
		    	}
		    	$("#isRunning").css({display:"block",top:"15%",left:"55%",position:"absolute"});
		    
			}else{
				alert(data.msg);
			}					
		},
		error:function(msg){						
			alert(msg);	
		}
	});
}
var intervalID=null;
var logSize=0;
function showLogInter(){
	if(intervalID==null){
		listLog();
	
	intervalID=setInterval ("listLog()", 5000);//每隔一段时间去请求日志信息
	}
}
function exportInputExcel(){
	$.ajax({
		type:'post',
		url:'exportFile.action',
		data:{
			proID:$("#proID").val(),
			algID:$("#curAlgID").val(),
			InOrOut:"In"
		},
		dataType:'json',
		success:function(data){
			location.href=data.filePath;
		},
		error:function(msg){
			alert(msg);
		}
	});
}

function listLog()
{	
	//$("#outputarea").text("");
	$.ajax({
		type:'post',
		url:'listLog.action',
		data:{
			ID:$("#proID").val(),
			logSize:logSize
		},
		dataType:'json',
		success:function(data){
			logSize=data.logSize;
			if(data.status!=1){//如果算法运行结束，则停止日志刷新程序
				window.clearInterval(intervalID);
				$("#isRunning").hide();	
				intervalID=null;
			}			
			$.each(data.loginfo,function(index,log){
				if(log!=null&&log!=""){
					$("#outputarea").append(log.logTime.replace("T"," ")+" "+log.info+"\n");
					
				}	 	
			});	
			var d = $("#outputarea")[0].scrollHeight;
			$("#outputarea").scrollTop(d);
		},
		error:function(msg){
			$("#outputarea").append("通信失败！\n\r");
			window.clearInterval(intervalID);
			intervalID=null;
		}
	});

}
function loadOutput(way){
	//location.href=window.location.pathname+"#output_tab";
	if(way==0){
		showTab("output_tab");
    }
	
	var proid=$("#proID").val();
	var sid = 1;
	var algid = $("#curAlgID").val();
	var outputSheetNum=$("#outputSheetNum").val();
	var inOrOut="Out";
	var sheetDiv = "#output-sheet";
	var pageDiv = "#output-pager";
	var delID="output-delsheet";
	var gridWidth=1040;
	for(var i=0;i<outputSheetNum;i++){
		var sheetgrid = new SheetGrid();
		sheetgrid.GetDynamicCols(i, algid,inOrOut);
		sheetgrid.creategrid(proid, sheetDiv+i, pageDiv+i,delID+i,gridWidth);		
	}
	var sheetGrid=new SheetGrid();
	sheetGrid.reloadGrid();
}

function exportOutputExcel(){
	$.ajax({
		type:'post',
		url:'exportFile.action',
		data:{
			proID:$("#proID").val(),
			algID:$("#curAlgID").val(),
			InOrOut:"Out"
		},
		dataType:'json',
		success:function(data){
			location.href=data.filePath;
		},
		error:function(msg){
			alert(msg);
		}
	});
}

function showData(type){
	
	if(type=="outputBase"||type=="outputFee"||type=="outputPosition"||type=="outputGisMap"){
		if(type=="outputGisMap"){
			initMapGis("Out");//地图模型的加载
			var proID=$("#proID").val();
			var algID=$("#curAlgID").val();
			showMap(proID,algID,'Out');	
		}
		$(".outputDataDiv").each(function(index,item){//tab切换
			$(item).hide();
		});
		$("#"+type).show();
	}else if(type=="inputBase"||type=="inputFunction"||type=="inputCondition"||type=="inputGisMap"||type=="inputDcMap"){
		if(type=="inputDcMap"){
			if($("#curAlgID").val()==1||$("#curAlgID").val()==2||$("#curAlgID").val()==3||$("#curAlgID").val()==4){//笛卡尔模型的加载
				tabtools.load();
			}else{
				
			}
		}
		if(type=="inputGisMap"){
			initMapGis("In");//地图模型的加载
			var proID=$("#proID").val();
			var algID=$("#curAlgID").val();
			showMap(proID,algID,'In');	  
		}
		$(".inputDataDiv").each(function(index,item){//tab切换
			$(item).hide();
		});
		$("#"+type).show();
	
		
	}
}

function showTab(type){
	$(".father_tab").each(function(index,item){
		$(item).hide();
	});
	$("#father_tab>ul>li").each(function(index,item){
		
		$(item).children("a").removeAttr("style");
		
	});
	$("#"+type).show();
	$("#"+type+"_button").css("background-color",'fff');
	if(type=='run_tab'){
		showLogInter();
		
//		if($("#curAlgID").val()==1||$("#curAlgID").val()==2||$("#curAlgID").val()==3||$("#curAlgID").val()==4){
//			tabtools.load();
//		}else{
//			
//		}请求的参数页面超出范围
//			initMapGis();
//		  var proID=$("#proID").val();
//		  var algID=$("#curAlgID").val();
//		  showMap(proID,algID,'In');
	}
	if(type=='output_tab'){
		//runAlg(1);
		loadOutput(1);
	}
	if(type=='input_tab'){
		var inputSheetNum=$("#inputSheetNum").val();
		var sheetDiv = "#input-sheet";
		for(var i=0;i<inputSheetNum;i++){//刷新5个表格
	    	$(sheetDiv+i).jqGrid("setGridParam", {
				postData : {
					sheetID : i,
					algID : $("#curAlgID").val(),
					InOrOut:"In",
					proID : $("#proID").val()
				}
			}).trigger("reloadGrid");
			//$(sheetDiv+i).loadTableData();
	    }
	}
}

