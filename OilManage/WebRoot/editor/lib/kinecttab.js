/*function updatePraVal(){
	var gr = jQuery("#PointPraList").jqGrid('getGridParam','selrow');
	if( gr != null ) jQuery("#PointPraList").jqGrid('editGridRow',gr,{height:280,reloadAfterSubmit:false});
	else alert("Please Select Row");
}*/
var TabTools=function (){
	/*
	 * 属性编辑列表
	 */
	jQuery("#PointPraList").jqGrid({
	   	url:'listPointPra.action',
		datatype: "json",
		mtype : 'POST',
	   	colNames:['ID','属性中文名称', '属性英文名称', '属性值','属性ISO值','单位名称','单位符号','操作'],
	   	colModel:[
	   		{name:'ID',index:'ID', width:55,align:"center",hidden:true,editable:true},
	   		{name:'par_display',index:'par_display', width:120, align:"center"},
	   		{name:'par_name',index:'par_name', width:100,align:"center",hidden:true},
	   		{name:'par_value',index:'par_value', width:80, align:"center",editable:true},
	   		{name:'par_ISOValue',index:'par_ISOValue', width:100, align:"center",hidden:true,editable:true},		
	   		{name:'measure_CName',index:'measure_CName', width:80,align:"center"},		
	   		{name:'measure_Symbol',index:'measure_Symbol', width:150, align:"center"},
	   		{name:'act',index:'act', width:75,sortable:false}
	   		
	   	],
	   	width:530,
	   	rowNum:10,
	   	rowList:[10,20,30],
//	   	pager: '#PointPraPager',
	   	sortname: 'id',
	    viewrecords: true,
	    sortorder: "desc",
		gridComplete: function(){
			var ids = jQuery("#PointPraList").jqGrid('getDataIDs');
			for(var i=0;i < ids.length;i++){
				var cl = ids[i];
				be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#PointPraList').editRow('"+cl+"');\"  />"; 
				se = "<input style='height:22px;width:20px;' type='button' value='S' onclick=\"jQuery('#PointPraList').saveRow('"+cl+"');\"  />"; 
				ce = "<input style='height:22px;width:20px;' type='button' value='C' onclick=\"jQuery('#PointPraList').restoreRow('"+cl+"');\" />"; 
				jQuery("#PointPraList").jqGrid('setRowData',ids[i],{act:be+se+ce});
			}	
		},
		editurl: "editPointPra.action",
		caption: "属性列表",
		postData:{
			pointID:1,
			pointPraID:$("#gridTable").jqGrid("getRowData", $("#gridTable").jqGrid("getGridParam", "selrow")).ID
	    },
		jsonReader: {//读取后端json数据的格式
			root: "pointPraList",//保存详细记录的名称
			total: "total",//总共有多少页
			page: "page",//当前是哪一页
			records: "records",//总共记录数
			repeatitems: false
		},
	});
//	jQuery("#PointPraList").jqGrid('navGrid',"#PointPraPager",{edit:true,add:false,del:false});
//	jQuery("#PointPraList").jqGrid('inlineNav',"#PointPraPager");
//	jQuery("#PointPraList").jqGrid('navButtonAdd',"#PointPraPager",{
//		title:'编辑',
//		caption:"编辑",	
//		id:"updatePraVal",
//		onClickButton:updatePraVal,
//		position:"last"
//	});
	
	/*
	 * 图形项目列表
	 */
	this.datagrid = jQuery("#GUIProList")
	.jqGrid(
			{
				url : "listGUIPro.action",// 后端的数据交互程序，改为你的
				datatype : "json",// 前后交互的格式是json数据
				mtype : 'POST',// 交互的方式是发送httpget请求						
				colNames : [ '编号', '项目名称', '作者','描述','添加时间','操作'],// 表格的列名
				colModel : [
						{
							name : 'id',
							index : 'ID',
							width : 50,
							align : "center",
							sortable:true,
							sorttype:'int'
						},// 每一列的具体信息，index是索引名，当需要排序时，会传这个参数给后端
						{
							name : 'proname',
							index : 'proname',
							width : 100,
							align : "center",
							sortable:true
						},
						{
							name:'author',
							index:'author',
							width:100,
							align:'center',
							sortable:true
						},
						{
							name:'description',
							index:'description',
							width:200,
							align:'center',
							sortable:false
						},
						{
							name:'addTime',
							index:'addTime',
							width:100,
							align:'center',
							sortable:true
						},
						{
							name : 'load',
							index : 'load',
							width : 100,
							align : "center",
							formatter : function(value, grid, rows,
									state) {
//								alert(rows.id);
								return "<a href=\"javascript:void(0)\" style=\"color:#798991\" onclick=\"tabtools.load('"
										+ rows.id + "')\">加载</a>"
							}
						}					
	
						],
//				autowidth:true,
				rowNum:10,//每一页的行数
				height: 'auto',
				width:1230,
				rowList:[10,20,30],
				pager: '#GUIProPager',
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
				caption: "模型列表"//表格名称       
				
			});

	this.listGUIProGrid=function(){
//		$("#GUIProList").empty();
		/*
		 * 图形项目列表
		 */
		$('#GUIProList').trigger("reloadGrid");
		
		$('#listGUIPro_modal').modal();
	}

	this.createNewModal=function(){
		newone=new Paintings();
		platform.addPainting(newone.init());
//		paintingArray.add(selectedPainting);
		// 配置对话框
		loadAuthorOptions();//加载作者选项
		$('#add_GUI_modal').modal();
		$("#addGUIForm").validate({
			debug:true,
			onsubmit:true,
			onfocusout: function(element) { $(element).valid(); },
		    onkeyup: function(element) { $(element).valid(); },
			rules:{
				proname:{
					required:true
				},
				authorID:{
					required:true
				},
				type:{
					digits:true                 
				}
			},
			messages:{
				proname:{
					required:"名称不能为空！",
				},							
				authorID:{
					required:"请选择作者！"
				},
				type:{
					digits:"请输入整数", 
				}
			},
			submitHandler:function(){
				createNew();
			}
		});
			
	}
	/*
	 * 添加图形项目
	 */
	var createNew=function() {
//		if($('#selectedID').val()==''){
			jsondata=platform.selectPainting.p.toJSON();
			$.ajax({
				type : 'POST',
				url : 'addGUIPro.action',
				data : {
					description:$("#description").val(),
					name:$('#proname').val(),
					data:jsondata,
					authorID:$("#authorID").val(),
					type:$('#type').val()
				},
				success : function(data) {
					alert('图形化项目新建成功!');
					$('#add_GUI_modal').modal('hide');
					tabtools.load(data.ID);
					//$("#AlgorithmList").trigger("reloadGrid");		
				},
				error:function(msg){
					alert(msg);
					$('#add_GUI_modal').modal('hide');
					//$("#AlgorithmList").trigger("reloadGrid");
					
				}
			});

	}

	this.save=function() {
		//selectPainting=Kinetic.Node.create(jsondata, 'container')
		var selectedID=$('#selectedID').val();
		if(selectedID==''){
			createNewModal();
		}else{
			updateGUI();
		}
		
	}
	function updateGUI(){
		jsondata=platform.selectPainting.p.toJSON();
		console.log(jsondata);
		s=JSON.stringify(platform.selectPainting.connects);
		console.log(s);
		$.ajax({
			type : 'POST',
			url : 'updateGUIPro.action',
			data : {			
				data:jsondata,
				Points:JSON.parse(JSON.stringify(platform.selectPainting.points)),
				Conns: s,
				ID:$('#selectedID').val(),
			},
			success : function(data) {
				alert('图形化保存成功!');
		
				//$('#addAlgorithmInput_modal').modal('hide');
				//$("#AlgorithmInputList").trigger("reloadGrid");			
			},
			error:function(msg){
				alert(msg);
				//$('#addAlgorithmInput_modal').modal('hide');
				//$("#AlgorithmList").trigger("reloadGrid");
			}
		});
	}
	this.switchTab=function(selectedID) {


				
				platform.showPainting(selectedID);
		
	}
	this.load=function(selectedID) {

//		selectedID=1;
		$.ajax({
			type : 'POST',
			url : 'viewGUIPro.action',
			data : {
				
				ID:selectedID
				
			},
			success : function(data) {
				alert('图形化载入成功!');
				$('#selectedID').val(selectedID);
				//data=jQuery.parseJSON(data);
				$('#listGUIPro_modal').modal('hide');
				try{
					saveData=data['dataView']['JSONData'];
				}catch(err){
					alert('该项目模型为空！');
				}
				//alert(saveData);
				//console.log(saveData['JSONData']);
				newone=Kinetic.Node.create(saveData);
				index=platform.addLoadPainting(newone);				
				createTab(data['dataView']['proname'],index);
				//createNewTab(data['dataView']['proname']);
				platform.stage.draw();
						
			},
			error:function(msg){
				alert(msg);
			}
		});
	}
	var tabX=50;
	var tabY=50;
	var position;
	 
	function createTab(proname,paintingIndex){
		$("#paintingTabs").children().removeClass("active");
		var tabItem="<li class=\"tab active\"> <a style='float:left' href=\"javascript:void(0)\" onclick=\"tabtools.showPainting(this,'"+ paintingIndex + "')\">"+proname+"</a><a  onclick=\"tabtools.hidePainting(this,'"+ paintingIndex + "')\" style='float:right;margin-top:-14px;padding-right:2px;'>x</a></li>";
		$("#paintingTabs").append(tabItem);
	}
	this.showPainting=function(obj,paintingIndex){
		$("#paintingTabs").children().removeClass("active");
		$(obj).parent().addClass("active");
		platform.selectPainting.saveScroll();
		platform.showPainting(paintingIndex);
	}
	this.hidePainting=function(obj,paintingIndex){
//		$("#paintingTabs").children().removeClass("active");
//		$(obj).parent().removeClass("active");
		$(obj).parent().remove();
//		platform.selectPainting.saveScroll();
		platform.hidePainting(paintingIndex);
	}

	/*
	 * 加载作者下拉列表
	 */
	function loadAuthorOptions(){
		$.ajax({
			url:'listUser.action',
			type:'post',
			dataType:'json',
			success:function(data){
				var items="";
				$.each(data.dataList,function(i,user){
					items+= "<option value=\"" + user.userid + "\">" + user.username + "</option>"; 
				});
				$("#authorID").html(items);
			}
		});
		}
}
