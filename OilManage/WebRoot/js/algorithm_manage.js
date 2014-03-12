
$(
	
		
	function() {

	/*
	 * 算法管理列表
	 */
	var datagrid = jQuery("#AlgorithmList")
	.jqGrid(
			{
				url : "listAlgorithmsCycle.action",// 后端的数据交互程序，改为你的
				datatype : "json",// 前后交互的格式是json数据
				mtype : 'POST',// 交互的方式是发送httpget请求						
				colNames : [ '编号', '上传计划', '输入', '输出', '作者','描述','添加时间','最近更新时间','输入参数添加'],// 表格的列名
				colModel : [
						{
							name : 'ID',
							index : 'ID',
							width : 50,
							align : "center",
							sortable:true,
							sorttype:'int'
						},// 每一列的具体信息，index是索引名，当需要排序时，会传这个参数给后端
						{
							name : 'planID',
							index : 'planID',
							width : 100,
							align : "center",
							sortable:true
						},
						{
							name : 'view',
							index : 'view',
							width : 100,
							align : "center",
							formatter : function(value, grid, rows,state) {
								return "<a href=\"javascript:void(0)\" style=\"color:#798991\" onclick=\"viewAlgorithmInput('"
										+ rows.ID + "')\">查看参数</a>"
							}
						},
						{
							name : 'outputID',
							index : 'outputID',
							width : 100,
							align : "center",
							sortable:true
						},
						{
							name:'authorName',
							index:'authorName',
							width:100,
							align:'center',
							sortable:true
						},
						{
							name:'Description',
							index:'Description',
							width:200,
							align:'center',
							sortable:false
						},
						{
							name:'addDate',
							index:'addDate',
							width:100,
							align:'center',
							sortable:true
						},
						{
							name:'lastUpdateDate',
							index:'lastUpdateDate',
							width:100,
							align:'center',
							sortable:true
						},
						{
							name : 'input',
							index : 'input',
							width : 100,
							align : "center",
							formatter : function(value, grid, rows,
									state) {
//								alert(rows.ID);
								return "<a href=\"javascript:void(0)\" style=\"color:#798991\" onclick=\"selectInput('"
										+ rows.ID + "')\">输入参数添加</a>"
							}
						}
	
						],
//				autowidth:true,
				rowNum:10,//每一页的行数
				height: 'auto',
				width:1230,
				rowList:[10,20,30],
				pager: '#AlgorithmPager',
				sortname: 'ID',
				viewrecords: true,
				sortorder: "desc",
				multiselect: true,  //可多选，出现多选框 
			    multiselectWidth: 35, //设置多选列宽度 
				jsonReader: {//读取后端json数据的格式
					root: "dataList",//保存详细记录的名称
					total: "total",//总共有多少页
					page: "page",//当前是哪一页
					records: "records",//总共记录数
					repeatitems: false
				},
				caption: "算法管理"//表格名称
				
			});
//	datagrid.jqGrid('hideCol','ID');
	datagrid.jqGrid('filterToolbar',{searchOperators:true});
	datagrid.jqGrid('navGrid','#AlgorithmPager',{
		edit : false,
		add : false,
		search:false,
		del : false}).jqGrid('navButtonAdd',"#AlgorithmPager",{
				title:'添加',
				caption:"添加",
				id:"add_AlgorithmList",
				onClickButton : function addModal(){
					// 配置对话框

						$('#uploadAlgorithmModal').modal();
				
				},
				position:"first"
			
		
			}).jqGrid('navButtonAdd',"#AlgorithmPager",{
				title:'删除',
				caption:"删除",	
				id:"delete_AlgorithmList",
				onClickButton:deleteAlgorithm,
				position:"first"
			});
	
}//function结束
);//$()结束
function deleteAlgorithm() {
    var sels = $("#AlgorithmList").jqGrid('getGridParam','selarrrow'); 
    if(sels==""){ 
       //$().message("请选择要删除的项！"); 
       alert("请选择要删除的项!");
    }else{ 
    	var selectedIDs={};
    	$.each(sels,function(i,n){ 
          if(sels[i]!=""){ 
        	  var rowData = $("#AlgorithmList").jqGrid("getRowData", sels[i]);
        	  selectedIDs["ids[" + i + "]"]=rowData.ID;
//        	  alert(rowData.ID);
          } 
    	}); 

       if(confirm("您是否确认删除？")){ 
        $.ajax({ 
          type: "POST", 
          url: "delAlgorithmsCycle.action", 
          data: selectedIDs, 
          beforeSend: function() { 
               $().message("正在请求..."); 
          }, 
          error:function(){ 
               $().message("请求失败..."); 
          }, 
          
          success: function(msg){ 
        	alert("删除成功！");
			$("#AlgorithmList").trigger("reloadGrid");
               if(msg!=0){ 
                   var arr = msg.split(','); 
                   $.each(arr,function(i,n){ 
                         if(arr[i]!=""){ 
                             $("#AlgorithmList").jqGrid('delRowData',n);  
                         } 
                   }); 
                   $().message("已成功删除!"); 
               }else{ 
                   $().message("操作失败！"); 
               } 
          } 
        }); 
       } 
    } 
}


function deleteAlgorithmInput(){
	
}

function viewAlgorithmInput(cycleId){
		$("#cloneTr").nextAll().remove();
		$("#cloneTr").show();
		$.ajax({
			type:"post",
			url:"listAlgorithmInputs.action",
			dataType:"json",
			data:{
				CycleID:cycleId,
				sidx:"ID",
				sord:"asc"
			},
			success:function(data){
				var tr=$("#cloneTr");
				$.each(data.dataList,function(index,row){
					var clonedTr=tr.clone();
					var _index=index;
					clonedTr.children("td").each(function(inner_index){
						switch(inner_index){
							case(0):$(this).html(row.ID);break;
							case(1):$(this).html(row.display);break;
							case(2):$(this).html(row.symbol);break;
						
						}//end switch
					});//end children.each
					clonedTr.insertAfter(tr);		
				});//end $each
				$("#cloneTr").hide();
				$("#generatedTable").show();
				$("#listAlgorithmInput_modal").modal();
	
			}//end success
		});//end ajax
	}

function viewInput(cycleId){//没用
	/*
	 * 输入参数管理列表
	 */
	var datagrid = jQuery("#AlgorithmInputList")
	.jqGrid(
			{
				url : "listAlgorithmInputs.action",// 后端的数据交互程序，改为你的
				postData:{CycleID:cycleId},
				datatype : "json",// 前后交互的格式是json数据
				mtype : 'POST',// 交互的方式是发送httpget请求						
				colNames : [ '编号', '参数', '符号'],// 表格的列名
				colModel : [
						{
							name : 'ID',
							index : 'ID',
							width : 50,
							align : "center",
							sortable:true,
							sorttype:'int'
						},// 每一列的具体信息，index是索引名，当需要排序时，会传这个参数给后端
						{
							name : 'display',
							index : 'display',
							width : 100,
							align : "center",
							sortable:true
						},
						{
							name : 'symbol',
							index : 'symbol',
							width : 100,
							align : "center"
						}
	
						],
//				autowidth:true,
				rowNum:10,//每一页的行数
				height: 'auto',
				width:555,
				rowList:[10,20,30],
				pager: '#AlgorithmInputMeasurePager',
				sortname: 'ID',			
				viewrecords: true,
				sortorder: "desc",
				multiselect: true,  //可多选，出现多选框 
			    multiselectWidth: 35, //设置多选列宽度 
				jsonReader: {//读取后端json数据的格式
					root: "dataList",//保存详细记录的名称
					total: "total",//总共有多少页
					page: "page",//当前是哪一页
					records: "records",//总共记录数
					repeatitems: false
				},
				caption: "输入参数管理"//表格名称
				
			});
	datagrid.jqGrid('navGrid','#AlgorithmInputMeasurePager',{
		edit : false,
		add : false,
		search:false,
		del : false}).jqGrid('navButtonAdd',"#AlgorithmInputMeasurePager",{
				title:'删除',
				caption:"删除",	
				id:"delete_AlgorithmInput",
				onClickButton:deleteAlgorithmInput,
				position:"first"
			});
	$("#listAlgorithmInput_modal").modal();
//	alert(cycleId);
//	$('#CycleID').val(cycleId);
	}

function selectInput(cycleId){
	$('#addAlgorithmInput_modal').modal();
	$('#CycleID').val(cycleId);
	loadParameterOptions();
}

function loadParameterOptions(){
	$.ajax({
		url:'listParameter.action',
		type:'post',
		dataType:'json',
		data : {
			sidx: 'id',
			sord: "desc"
		},
		success:function(data){
			var items="";
			$.each(data.dataList,function(i,parameter){
				items+= "<option value=\"" + parameter.ID + "\">" + parameter.display + "</option>"; 
			});
			$("#select1").html(items);
		}
	});
	}


$(document).ready(function() {
	$('#algorithmfile').uploadify({
		'swf' : 'js/upload/uploadify.swf',
		'uploader' : 'uploadAlgorithm.action',
		'queueID' : 'fileQueue',
		'auto' : true,
		'multi' : false,
		'buttonText' : '上传算法文件',
		'fileSizeLimit' : '5MB',
		'fileObjName' : 'algorithmfile',
		'onUploadSuccess' : function(file, data, response) {
	        alert('The file was saved to: ' + data);
	    },
		'method' : 'post'
	});
});