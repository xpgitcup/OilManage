
var proID;
var algID;
var InOrOut;
function showObstacle(proid,algid,Inorout) {
	 proID=proid;
	 algID=algid;
	 InOrOut=Inorout;
	$.ajax({
		type : 'POST',
		url : 'viewObstacle.action',
		data : {
			proID:proid,
			algID:algid,
			InOrOut:Inorout
		},
		success : function(data) {
			drawPoints(data);
			//drawLines(data);
		}

	});

}
function addObstacle(name,list) {

	$.ajax({
		type : 'POST',
		url : 'addObstacle.action',
		data : {
			proID:proID,
			algID:algID,
			InOrOut:InOrOut,
			poly:JSON.stringify(list),
			obsName:name
		},
		success : function(data) {
			//drawPoints(data);
			//drawLines(data);
		}

	});

}
function clearMap(){
	pointMap = {};
	 markers = [];
	map.clearOverlays();
}
var pointMap = {};
var markers = [];
var myjingkou = new BMap.Icon("images/icons/jingkou.png",
		new BMap.Size(30, 30), {
			anchor : new BMap.Size(15, 15)
		});
function drawPoints(data){
	
	var jsonObject = data;
	var pointArray = new Array();
	var pMap = jsonObject['obs'];
	var id=-1;
	for ( var i in pMap) {
		id++;
		ps = pMap[i];
		var tempPoint= new Array();
		for(var k =0;k<ps.length;k++){
			p=ps[k];
			
			var bp=new BMap.Point(p['longitude'], p['latitude']);	
			if(id==0){
				map.centerAndZoom(bp, 15);
			}
			tempPoint.push(bp);
			
		}
		var polygon = new BMap.Polygon(tempPoint, 
				styleOptions	);
	
		map.addOverlay(polygon);
				

		
	}

	}
var map ;
var styleOptions = {
	    strokeColor:"red",    //边线颜色。
	    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
	    strokeWeight: 3,       //边线的宽度，以像素为单位。
	    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
	    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
	    strokeStyle: 'solid' //边线的样式，solid或dashed。
	}
function init(){
	 map = new BMap.Map("allmap", {
		mapType : BMAP_HYBRID_MAP
	}); // 创建Map实例
	var point = new BMap.Point(116.404, 39.915); // 创建点坐标
	map.centerAndZoom(point, 8); // 初始化地图,设置中心点坐标和地图级别。
	map.enableScrollWheelZoom(); //启用滚轮放大缩小

	map.addControl(new BMap.MapTypeControl({
		anchor : BMAP_ANCHOR_TOP_RIGHT
	})); //左上角，默认地图控件
	map.setCurrentCity("北京"); //由于有3D图，需要设置城市哦
	map.addControl(new BMap.NavigationControl({
		anchor : BMAP_ANCHOR_TOP_LEFT
	})); //添加默认缩放平移控件

	map.addControl(new BMap.ScaleControl());
	var marker1 = new BMap.Marker(new BMap.Point(116.384, 39.925)); // 创建标注
	map.addOverlay(marker1);
	var point = new BMap.Point(116.404, 39.915);
var overlays = [];
//回调获得覆盖物信息
var overlaycomplete = function(e){
    overlays.push(e.overlay);
    if (e.drawingMode == BMAP_DRAWING_POLYLINE || e.drawingMode == BMAP_DRAWING_POLYGON || e.drawingMode == BMAP_DRAWING_RECTANGLE) {
        //result += ' 所画的点个数：' + e.overlay.getPath().length;
        var list=e.overlay.getPath();
        //alert(z.length);
        var name=prompt("请输入障碍区名称","");
        addObstacle(name,list);
    }
    
};


//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 35), //偏离值
        drawingModes : [
                        
                        BMAP_DRAWING_POLYGON
                     ],
        scale: 0.8 //工具栏缩放比例
    },

    polygonOptions: styleOptions, //多边形的样式
});


//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);


function $(id){
    return document.getElementById(id);
}

function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}
}		