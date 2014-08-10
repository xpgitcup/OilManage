<%@ page language="java" import="java.util.*,cn.edu.cup.manage.business.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
 <%
//User userlogin=(User)(session.getAttribute("user"));
%> 
    <base href="<%=basePath%>">
    
    <title>系统模拟</title>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=9" />
	
	<script type="text/javascript" src="editor/lib/kinetic-v5.1.0.min.js"></script>
	<link rel="stylesheet" type="text/css" media="screen" href="js/jqGrid/css/ui.jqgrid.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="js/jqueryUI/themes/redmond/jquery.ui.theme.css" />  
	<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="bootstrap/css/carousel.css">
	<link rel="stylesheet" href="js/upload/uploadify.css">
	<link rel="stylesheet" media="screen" type="text/css"
		href="editor/assets/css/style.css" />
	<link rel="stylesheet" media="screen" type="text/css"
		href="editor/assets/css/minimap.css" />

	<script type="text/javascript" src="editor/assets/javascript/json2.js"></script>
	<script type="text/javascript" src="editor/assets/javascript/jquery-1.11.0.min.js"></script>
	<script src="js/jquery/jquery-migrate-1.2.1.js"></script>
	<script type="text/javascript" src="editor/assets/javascript/ajaxfileupload.js"></script>
	<script src="js/jqGrid/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
	<script src="js/jqGrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>
	<script src="bootstrap/js/bootstrap.min.js"></script>
	<script src="bootstrap/js/holder.min.js"></script>
	
	<script type="text/javascript" src="js/upload/jquery.uploadify.min.js"></script>
	
	<script type="text/javascript" src="js/jquery-validation-1.11.1/dist/jquery.validate.js"></script>
	<script src="js/easytabs/jquery.hashchange.min.js" type="text/javascript"></script>
	<script src="js/easytabs/jquery.easytabs.js" type="text/javascript"></script>
	<script src="js/jqueryPlug/jquery.mousewheel.min.js" type="text/javascript"></script>
	
	<script defer="defer" type="text/javascript" src="editor/lib/init2.js"></script>
	<script defer="defer" type="text/javascript" src="editor/lib/platform.js"></script>
	<script defer="defer" type="text/javascript" src="editor/lib/leftpoly.js"></script>
	<script defer="defer" type="text/javascript" src="editor/lib/Paintings.js"></script>
	<script defer="defer" type="text/javascript" src="editor/lib/tools.js"></script>
	<script defer="defer" type="text/javascript" src="editor/lib/kinecttab.js"></script>
	
	<script defer="defer" type="text/javascript" src="js/global.js"></script>
	<script defer="defer" type="text/javascript" src="js/diagram.js"></script>
	
	<script defer="defer" type="text/javascript" src="js/simulate_hydraulic.js"></script>
	<script defer="defer" type="text/javascript" src="js/dynamicSheet.js"></script>
	<script defer="defer" type="text/javascript" src="js/project.js"></script>	
	
	<link type='text/css' href='editor/assets/simplemodal/css/diagramo.css' rel='stylesheet' media='screen' />
	<link rel="stylesheet" media="screen" type="text/css" href="editor/assets/css/colorPicker_new.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="css/tabs.css" />
	<!-- <link rel="stylesheet" media="screen" type="text/css" href="editor/assets/css/processui.css" />  -->
	<!-- 自定义 -->
	<link rel="stylesheet" type="text/css" href="css/styles.css"/>	
	<link rel="stylesheet" type="text/css" href="css/diagram.css"/>		
	<link rel="stylesheet" type="text/css" href="css/simulate_hydraulic.css"/>
	<link rel="stylesheet" type="text/css" href="css/dynamicSheet.css" />
	

  </head>
    
  
  <body  id="body"  onload="initLight();">

	<div id="head">
		    <%@ include file="commons/header.jsp" %>
	</div>  
		<div class="container marketing condiv" style="width:1200px;margin-top:5px;">
	    	
	    	<div class="container-fluid">
				<div class="row-fluid">
					<div class="span12">
					<div class="page-header">
						<h2>单相管网水力计算&nbsp;<small>管网模拟</small></h2>
						<input id="curAlgID" style="display:none" value="1"/>
						<input id="proID" style="display:none" value=""/>
						<!-- 
						if (id = 0)，井底流压计算；if (id = 1)，单气相管网水力计算；if (id = 2)，单气相管网热力计算；if (id = 3)，气固两相管网水力计算；if (id = 4)，气液两相管网水力计算
						 -->
					</div>
					
					
					<div id="hydraulic_tab" class="tab-container">
						<ul class='etabs'>
						    <li class='tab'><a href="#input_tab">输入</a></li>
						    <li class='tab'><a href="#run_tab">运行</a></li>
						    <li class='tab'><a href="#output_tab">输出</a></li>					    
					    </ul>  
						<div id="input_tab"><!-- 节点数据 -->					
							<%@ include file="simulate_hydraulic/input_tab.jsp" %>
			    		</div>
			    		<div id="run_tab"><!-- 节点数据 -->
							<%@ include file="simulate_hydraulic/run_tab.jsp" %>
			    		</div>
			    		<div id="output_tab"><!-- 节点数据 -->	
							<%@ include file="simulate_hydraulic/output_tab.jsp" %>
			    		</div>
					</div>	            			
										
					</div>
				</div>
			</div> 
	    </div><!-- /.container -->		
	    </div>
  
	<hr> 
    <div id="footer">
        <%@ include file="commons/footer.jsp" %>
    </div>
	 
	 
	 
		
		
		
		
		
		<!-- 输入流体参数弹出框 -->
		<div id="popdiv_liquidpra" class="popdiv" style="display:none;padding:10px 20px 20px;">
			<a id="close_liquidpra" class="close">x</a>
		
			
			<div class="row-fluid">
				<div class="span12">
					<form id="form1" runat="server">
					<div class="row-fluid">
						<div class="span6" style="float:left">
							 <div id="left">
						        <select multiple="multiple" id="select1" style="width:100px;height:160px">
							        <option>CH4</option>
							        <option>C2H6</option>
							        <option>C3H8</option>
							        <option>i-C4H10</option>
							        <option>n-C4H10</option>
							        <option>i-C5H12</option>
							        <option>n-C5H12</option>
							        <option>n-C6H14</option>
							        <option>n-C7H16</option>
							        <option>n-C8H18</option>
							        <option>n-C9H20</option>
							        <option>n-C10H22</option>
							        <option>C11</option>
							        <option>C12</option>
							        <option>C13</option>
							        <option>C14</option>
							        <option>C15</option>
							        <option>C2H4</option>
							        <option>C3H6</option>
							        <option>H2S</option>
							        <option>SO2</option>
							        <option>N2</option>
							        <option>CO2</option>
							        <option>Kr</option>
							        <option>Xe</option>
						        </select>
						    </div>
						</div>
						<div  style="float:left;margin-top:40px;padding-left:5px;padding-right:5px;">
					   		<button id="add" type="button" class="btn btn-small">添加</button><br />
					   		<button style="margin-top:5px;" id="remove" type="button" class="btn btn-small">删除</button>
					   	</div>
						<div class="span6" style="float:left">
							 <div id="right">
						        <select multiple="multiple" id="select2" style="width:100px;height:160px"></select>
						    </div>
						</div>
						<div style="float:left;margin-top:100px;padding-left:5px;">	
							<span>Total:</span><span>1</span>							
							<button type="button" type="button" class="btn btn-small">保存</button>
						</div>
					</div>		
				</form>
					
					
				<div class="row-fluid">
					<div class="span8" style="float:left;margin-top:20px;">
						<table>
							<tr><td>气体动力粘度</td><td><input/></td><td>Pa.s</td></tr>
							<tr><td>环境温度</td><td><input/></td><td>k</td></tr>
						</table>
					</div>
					<div class="span4" style="float:left;margin-top:30px;padding-left:5px;">
						<button  type="button" type="button" class="btn btn-small">保存</button>
					</div>
				</div> 
					
				</div>
			</div>
			
			
		</div>
		
		
			    
		
		
	
		<%@ include file="simulate_hydraulic/modal.jsp" %>
	<div id="isRunning" style="display:none;padding:90px 120px;width:400px;height:100px;border:10px solid;border-radius:10px;background-color:white;">
		<span>正在计算......</span>
	</div> 
		
		<script type="text/javascript">

		</script>
		   
  </body>
  
</html>

	
