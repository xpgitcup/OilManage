"use strict";var connector_defaultConnectorTextSize=12;var connector_defaultConnectorTextStr="";var connector_defaultConnectorTextFont="Arial";var connector_defaultConnectorTextStrokeStyle="#000000";var connector_defaultConnectorTextFillStyle="#000000";var connector_defaultConnectorTextBgStyle="#ffffff";function Connector(h,f,e,g){this.id=g;this.turningPoints=[h,f];this.type=e;this.userChanges=[];this.solution="";this.style=new Style();this.style.strokeStyle="#000000";this.style.lineWidth=1.005;this.style.lineStyle=Style.LINE_STYLE_CONTINOUS;this.middleText=new Text(connector_defaultConnectorTextStr,(h.x+f.x)/2+10,(h.y+f.y)/2-13,connector_defaultConnectorTextFont,connector_defaultConnectorTextSize);this.middleText.style.strokeStyle=connector_defaultConnectorTextStrokeStyle;this.middleText.style.fillStyle=connector_defaultConnectorTextFillStyle;this.middleText.bgStyle=connector_defaultConnectorTextBgStyle;this.properties=[];this.properties.push(new BuilderProperty("Start Style","startStyle",BuilderProperty.TYPE_CONNECTOR_END));this.properties.push(new BuilderProperty("End Style","endStyle",BuilderProperty.TYPE_CONNECTOR_END));this.properties.push(new BuilderProperty("Line Width","style.lineWidth",BuilderProperty.TYPE_LINE_WIDTH));this.properties.push(new BuilderProperty("Line Style","style.lineStyle",BuilderProperty.TYPE_LINE_STYLE));this.properties.push(new BuilderProperty("Color","style.strokeStyle",BuilderProperty.TYPE_COLOR));this.properties.push(new BuilderProperty("Text","middleText.str",BuilderProperty.TYPE_TEXT));this.properties.push(new BuilderProperty("Text Size","middleText.size",BuilderProperty.TYPE_TEXT_FONT_SIZE));this.properties.push(new BuilderProperty("Font","middleText.font",BuilderProperty.TYPE_TEXT_FONT_FAMILY));this.properties.push(new BuilderProperty("Alignment","middleText.align",BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));this.properties.push(new BuilderProperty("Text Color","middleText.style.fillStyle",BuilderProperty.TYPE_COLOR));this.startStyle=Connector.STYLE_NORMAL;this.endStyle=Connector.STYLE_ARROW;this.activeConnectionPointId=-1;this.oType="Connector"}Connector.TYPE_STRAIGHT="straight";Connector.TYPE_JAGGED="jagged";Connector.TYPE_ROUND="round";Connector.TYPE_ORGANIC="organic";Connector.STYLE_NORMAL="Normal";Connector.STYLE_ARROW="Arrow";Connector.STYLE_EMPTY_TRIANGLE="Empty";Connector.STYLE_FILLED_TRIANGLE="Filled";Connector.ARROW_SIZE=15;Connector.ARROW_ANGLE=30;Connector.USER_CHANGE_HORIZONTAL_ALIGN="h";Connector.USER_CHANGE_VERTICAL_ALIGN="v";Connector.load=function(c){var d=new Connector(new Point(0,0),new Point(0,0),Connector.TYPE_STRAIGHT,0);d.id=c.id;d.turningPoints=Point.loadArray(c.turningPoints);d.type=c.type;d.userChanges=c.userChanges;d.solution=c.solution;d.style=Style.load(c.style);d.middleText=Text.load(c.middleText);d.properties=BuilderProperty.loadArray(c.properties);d.endStyle=c.endStyle;d.startStyle=c.startStyle;d.activeConnectionPointId=c.activeConnectionPointId;return d};Connector.loadArray=function(e){var f=[];for(var d=0;d<e.length;d++){f.push(Connector.load(e[d]))}return f};Connector.prototype={constructor:Connector,equals:function(c){if(!c instanceof Connector){return false}for(var d=0;d<this.turningPoints.length;d++){if(!this.turningPoints[d].equals(c.turningPoints[d])){return false}}for(var d=0;d<this.properties.length;d++){if(!this.properties[d].equals(c.properties[d])){return false}}for(var d=0;d<this.userChanges.length;d++){if(this.userChanges[d].align!=c.userChanges[d].align||this.userChanges[d].index!=c.userChanges[d].index||this.userChanges[d].delta!=c.userChanges[d].delta){return false}}if(this.id!=c.id||this.type!=c.type||this.solution!=c.solution||!this.middleText.equals(c.middleText)||this.startStyle!=c.startStyle||this.endStyle!=c.endStyle||this.activeConnectionPointId!=c.activeConnectionPointId){return false}return true},getArrow:function(h,i){var k=new Point(h,i);var l=new Line(k.clone(),Util.getEndPoint(k,Connector.ARROW_SIZE,Math.PI/180*Connector.ARROW_ANGLE));var g=new Line(k.clone(),Util.getEndPoint(k,Connector.ARROW_SIZE,Math.PI/180*-Connector.ARROW_ANGLE));var j=new Path();j.style=this.style;l.style=this.style;g.style=this.style;j.addPrimitive(l);j.addPrimitive(g);return j},getTriangle:function(i,j,l){var m=new Point(i,j);var n=Util.getEndPoint(m,Connector.ARROW_SIZE,Math.PI/180*Connector.ARROW_ANGLE);var h=Util.getEndPoint(m,Connector.ARROW_SIZE,-Math.PI/180*Connector.ARROW_ANGLE);var k=new Polygon();k.addPoint(m);k.addPoint(n);k.addPoint(h);k.style=this.style.clone();if(l){k.style.fillStyle=this.style.strokeStyle}else{k.style.fillStyle="#FFFFFF"}return k},paint:function(v){if(this.areStartEndPointsMatch()){return}v.save();this.style.setupContext(v);switch(this.type){case Connector.TYPE_ORGANIC:var i=Util.collinearReduction(this.turningPoints);Log.info("Connector:paint() - Number of reduced points: "+i.length+" "+i);var n=[];var o=i[0];for(var r=0;r<i.length-1;r++){o=i[r];var p=i[r+1];var u=new Point((o.x+p.x)/2,(o.y+p.y)/2);n.push(o.clone());if(r==0||r==i.length-2){continue}n.push(u.clone())}n.push(i[i.length-1]);Log.info("Connector:paint() - New points: "+n);v.save();v.beginPath();v.strokeStyle="#00CC00";v.fillStyle="#FF0000";v.lineWidth="2";for(var w in n){v.fillRect(n[w].x-1,n[w].y-1,3,3)}var t=new NURBS(i);t.style.strokeStyle="rgba(0,100,0,0.5)";t.paint(v);var q=new NURBS(n);q.style.strokeStyle="rgba(0,0,100,0.5)";q.paint(v);n=[];var o=i[0];for(var r=0;r<i.length-1;r++){o=i[r];var p=i[r+1];var u=new Point((o.x+p.x)/2,(o.y+p.y)/2);n.push(o.clone());n.push(u.clone())}n.push(i[i.length-1]);var q=new NURBS(n);q.style.strokeStyle="rgba(100,0,0,0.5)";q.paint(v);break;case Connector.TYPE_STRAIGHT:case Connector.TYPE_JAGGED:v.beginPath();v.moveTo(this.turningPoints[0].x,this.turningPoints[0].y);for(var r=1;r<this.turningPoints.length;r++){if(this.startStyle==Connector.STYLE_EMPTY_TRIANGLE&&r==1){var s=Util.getAngle(this.turningPoints[0],this.turningPoints[1]);var x=Util.getEndPoint(this.turningPoints[0],Connector.ARROW_SIZE*Math.cos(Math.PI/180*Connector.ARROW_ANGLE),s);v.moveTo(x.x,x.y)}if(this.endStyle==Connector.STYLE_EMPTY_TRIANGLE&&r==this.turningPoints.length-1){var s=Util.getAngle(this.turningPoints[r-1],this.turningPoints[r]);var x=Util.getEndPoint(this.turningPoints[r],-Connector.ARROW_SIZE*Math.cos(Math.PI/180*Connector.ARROW_ANGLE),s);v.lineTo(x.x,x.y)}else{v.lineTo(this.turningPoints[r].x,this.turningPoints[r].y)}}v.stroke();break}this.paintVisualDebug(v);this.paintStart(v);this.paintEnd(v);this.paintText(v);v.restore()},paintStart:function(i){var h=null;if(this.startStyle==Connector.STYLE_ARROW){h=this.getArrow(this.turningPoints[0].x,this.turningPoints[0].y)}if(this.startStyle==Connector.STYLE_EMPTY_TRIANGLE){h=this.getTriangle(this.turningPoints[0].x,this.turningPoints[0].y,false)}if(this.startStyle==Connector.STYLE_FILLED_TRIANGLE){h=this.getTriangle(this.turningPoints[0].x,this.turningPoints[0].y,true)}if(h){var f=this.turningPoints[0].x;var g=this.turningPoints[0].y;var j=Util.getAngle(this.turningPoints[0],this.turningPoints[1],0);h.transform(Matrix.translationMatrix(-f,-g));h.transform(Matrix.rotationMatrix(j));h.transform(Matrix.translationMatrix(f,g));i.save();i.lineJoin="round";i.lineCap="round";h.paint(i);i.restore()}},paintEnd:function(i){var h=null;if(this.endStyle==Connector.STYLE_ARROW){h=this.getArrow(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y)}if(this.endStyle==Connector.STYLE_EMPTY_TRIANGLE){h=this.getTriangle(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y,false)}if(this.endStyle==Connector.STYLE_FILLED_TRIANGLE){h=this.getTriangle(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y,true)}if(h){var f=this.turningPoints[this.turningPoints.length-1].x;var g=this.turningPoints[this.turningPoints.length-1].y;var j=Util.getAngle(this.turningPoints[this.turningPoints.length-1],this.turningPoints[this.turningPoints.length-2],0);h.transform(Matrix.translationMatrix(-f,-g));h.transform(Matrix.rotationMatrix(j));h.transform(Matrix.translationMatrix(f,g));i.save();i.lineJoin="round";i.lineCap="round";h.paint(i);i.restore()}},paintVisualDebug:function(c){if(DIAGRAMO.debug){c.beginPath();for(var d=0;d<this.turningPoints.length;d++){c.moveTo(this.turningPoints[d].x,this.turningPoints[d].y);c.arc(this.turningPoints[d].x,this.turningPoints[d].y,3,0,Math.PI*2,false)}c.stroke();c.save();for(var d=0;d<this.turningPoints.length;d++){c.fillText("("+Util.round(this.turningPoints[d].x,3)+", "+Util.round(this.turningPoints[d].y,3)+")",this.turningPoints[d].x+5,this.turningPoints[d].y-5)}c.restore()}},paintText:function(d){if(this.middleText.str!=""){var f=d.fillStyle;d.beginPath();var e=this.middleText.getBounds();d.moveTo(e[0],e[1]);d.lineTo(e[0],e[3]);d.lineTo(e[2],e[3]);d.lineTo(e[2],e[1]);d.fillStyle="white";d.closePath();d.fill();d.fillStyle=f;this.middleText.paint(d)}},transform:function(d){if(this.activeConnectionPointId!=-1){var e=CONNETOR_MANAGER.connectionPointGet(this.activeConnectionPointId);e.transform(d)}else{for(var f=0;f<this.turningPoints.length;f++){this.turningPoints[f].transform(d)}}},jagged:function(){this.jaggedReloaded();return;var N=this.turningPoints.pop();var J=this.turningPoints[0];var G=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0];var C=CONNECTOR_MANAGER.glueGetByConnectionPointId(G.id)[0];var T=CONNECTOR_MANAGER.connectionPointGet(C.id1==G.id?C.id2:C.id1).parentId;var t=STACK.figureGetById(T);var L;if(t){L=t.rotationCoords[0]}else{L=J}var K=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1];C=CONNECTOR_MANAGER.glueGetByConnectionPointId(K.id)[0];var M=CONNECTOR_MANAGER.connectionPointGet(C.id1==K.id?C.id2:C.id1).parentId;M=STACK.figureGetById(M);var A;if(M){A=M.rotationCoords[0]}else{A=N}var i=false;if(A.x<L.x){var O=A;A=L;L=O;O=M;M=t;t=O;O=N;N=J;J=O;i=true}var B=[N];this.turningPoints=[J];var z;var E=Util.getAngle(L,J,Math.PI/2);var H=Util.getAngle(A,N,Math.PI/2);if(H==0){z=new Point(N.x,M.getBounds()[1]-20)}else{if(H==Math.PI/2){z=new Point(M.getBounds()[2]+20,N.y)}else{if(H==Math.PI){z=new Point(N.x,M.getBounds()[3]+20)}else{z=new Point(M.getBounds()[0]-20,N.y)}}}B.push(z);N=z;var I=J;if(E==0){z=new Point(J.x,t.getBounds()[1]-20)}else{if(E==Math.PI/2){z=new Point(t.getBounds()[2]+20,J.y)}else{if(E==Math.PI){z=new Point(J.x,t.getBounds()[3]+20)}else{z=new Point(t.getBounds()[0]-20,J.y)}}}this.turningPoints.push(z);J=z;var Q=J;z=null;var F=[0,Math.PI/2,Math.PI,Math.PI/2*3,Math.PI*2];var R=0;var P=Util.lineIntersectsRectangle(J,N,M.getBounds());var S=Util.lineIntersectsRectangle(J,N,t.getBounds());while(P||S){E=Util.getAngle(J,this.turningPoints[this.turningPoints.length-2],Math.PI/2);H=Util.getAngle(N,B[B.length-2],Math.PI/2);switch(R){case 0:if(E==0||E==Math.PI){if(J.x<N.x){J=new Point(t.getBounds()[2]+20,J.y)}else{J=new Point(t.getBounds()[0]-20,J.y)}}else{if(J.y<N.y||N.y>t.getBounds()[1]){J=new Point(J.x,t.getBounds()[3]+20)}else{J=new Point(J.x,t.getBounds()[1]-20)}}this.turningPoints.push(J);break;case 1:B.push(N);if(H==0||H==Math.PI){if(J.x>N.x){N=new Point(M.getBounds()[2]+20,N.y)}else{N=new Point(M.getBounds()[0]-20,N.y)}}else{if(J.y>N.y){N=new Point(N.x,M.getBounds()[3]+20)}else{N=new Point(N.x,M.getBounds()[1]-20)}}break}R++;P=Util.lineIntersectsRectangle(J,N,M.getBounds());S=Util.lineIntersectsRectangle(J,N,t.getBounds());if(R==3){break}}if(!Util.lineIntersectsRectangle(new Point(J.x,N.y),new Point(N.x,N.y),M.getBounds())&&!Util.lineIntersectsRectangle(new Point(J.x,N.y),new Point(N.x,N.y),t.getBounds())&&!Util.lineIntersectsRectangle(new Point(J.x,J.y),new Point(J.x,N.y),M.getBounds())&&!Util.lineIntersectsRectangle(new Point(J.x,J.y),new Point(J.x,N.y),t.getBounds())){this.turningPoints.push(new Point(J.x,N.y))}else{this.turningPoints.push(new Point(N.x,J.y))}this.turningPoints.push(new Point(N.x,N.y));for(var D=0;D<B.length;D++){this.turningPoints.push(B.pop());D--}if(i){this.turningPoints=this.turningPoints.reverse()}},jaggedReloaded:function(){var z=this.turningPoints[0];var u=null;var w=null;var p=this.turningPoints[this.turningPoints.length-1];var n=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0];var v=CONNECTOR_MANAGER.glueGetByConnectionPointId(n.id)[0];if(v!=null){var t=CONNECTOR_MANAGER.connectionPointGet(v.id1==n.id?v.id2:v.id1);var q=STACK.figureGetById(t.parentId);var r=Util.getAngle(q.rotationCoords[0],z,Math.PI/2);switch(r){case 0:u=new Point(z.x,q.getBounds()[1]-20);break;case Math.PI/2:u=new Point(q.getBounds()[2]+20,z.y);break;case Math.PI:u=new Point(z.x,q.getBounds()[3]+20);break;case 3*Math.PI/2:u=new Point(q.getBounds()[0]-20,z.y);break}}var x=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1];v=CONNECTOR_MANAGER.glueGetByConnectionPointId(x.id)[0];if(v!=null){var s=CONNECTOR_MANAGER.connectionPointGet(v.id1==x.id?v.id2:v.id1);var o=STACK.figureGetById(s.parentId);var y=Util.getAngle(o.rotationCoords[0],p,Math.PI/2);switch(r){case 0:w=new Point(p.x,o.getBounds()[1]-20);break;case Math.PI/2:w=new Point(o.getBounds()[2]+20,p.y);break;case Math.PI:w=new Point(p.x,o.getBounds()[3]+20);break;case 3*Math.PI/2:w=new Point(o.getBounds()[0]-20,p.y);break}}alert("jaggedReloaded:Connector has "+this.turningPoints.length+" points");this.turningPoints.splice(1,0,u,w);alert("jaggedReloaded:Connector has "+this.turningPoints.length+" points")},connect2Points:function(f,d){var e=[];if(f.equals(d)){}return e},redraw:function(){if(this.type=="jagged"){var c=true;while(c==true){c=false;for(var d=1;d<this.turningPoints.length-2;d++){if(this.turningPoints[d].x==this.turningPoints[d-1].x&&this.turningPoints[d-1].x==this.turningPoints[d+1].x){this.turningPoints.splice(d,1);c=true}if(this.turningPoints[d].y==this.turningPoints[d-1].y&&this.turningPoints[d-1].y==this.turningPoints[d+1].y){this.turningPoints.splice(d,1);c=true}}}}},adjust:function(o,n){if(this.type==Connector.TYPE_STRAIGHT){var i=CONNECTOR_MANAGER.connectionPointGetByParentAndCoordinates(this.id,n.x,n.y);var q=-1;if(this.turningPoints[0].equals(n)){q=0}else{if(this.turningPoints[1].equals(n)){q=1}else{Log.error("Connector:adjust() - This should not happend"+this.toString()+" point is "+n)}}i.transform(o);this.turningPoints[q].x=i.point.x;this.turningPoints[q].y=i.point.y}if(this.type==Connector.TYPE_JAGGED){var l=n.x;var m=n.y;var i=CONNECTOR_MANAGER.connectionPointGetByParentAndCoordinates(this.id,n.x,n.y);i.transform(o);var t,s,p;if(n.equals(this.turningPoints[0])){this.turningPoints[0].x=i.point.x;this.turningPoints[0].y=i.point.y;t=1;s=this.turningPoints.length;p=1}else{if(n.equals(this.turningPoints[this.turningPoints.length-1])){this.turningPoints[this.turningPoints.length-1].x=i.point.x;this.turningPoints[this.turningPoints.length-1].y=i.point.y;t=this.turningPoints.length-2;s=-1;p=-1}else{Log.error("Connector:adjust() - this should never happen for point "+n+" and connector "+this.toString())}}for(var r=t;r!=s;r+=p){if(this.turningPoints[r].y!=m&&this.turningPoints[r].x==l&&this.turningPoints[r]!=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0].point&&this.turningPoints[r]!=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1].point){l=this.turningPoints[r].x;m=this.turningPoints[r].y;this.turningPoints[r].x=this.turningPoints[r-p].x}else{if(this.turningPoints[r].x!=l&&this.turningPoints[r].y==m&&this.turningPoints[r]!=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0].point&&this.turningPoints[r]!=CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1].point){l=this.turningPoints[r].x;m=this.turningPoints[r].y;this.turningPoints[r].y=this.turningPoints[r-p].y}}}}},applySolution:function(d){var c=d[0][1];if(!this.solution||this.solution!=c||this.turningPoints.length!=d[0][2].length){this.solution=c;this.clearUserChanges();this.turningPoints=Point.cloneArray(d[0][2])}else{this.turningPoints=d[0][2];this.applyUserChanges();d[0][2]=Point.cloneArray(this.turningPoints)}this.updateMiddleText()},applyUserChanges:function(){var f=this.userChanges.length;var g;var h;for(var e=0;e<f;e++){g=this.userChanges[e];if(g.align==Connector.USER_CHANGE_HORIZONTAL_ALIGN){h=Matrix.translationMatrix(g.delta,0)}else{if(g.align==Connector.USER_CHANGE_VERTICAL_ALIGN){h=Matrix.translationMatrix(0,g.delta)}}this.turningPoints[g.index].transform(h)}},addUserChange:function(e){var f=this.userChanges.length;var g;for(var h=0;h<f;h++){g=this.userChanges[h];if(g.align==e.align&&g.index==e.index){g.delta+=e.delta;return}}this.userChanges.push(e)},clearUserChanges:function(){this.userChanges=[]},cloneUserChanges:function(){var f=[];var e=this.userChanges.length;for(var d=0;d<e;d++){f.push({align:this.userChanges[d].align,index:this.userChanges[d].index,delta:this.userChanges[d].delta})}return f},areStartEndPointsMatch:function(){return this.turningPoints[0].equals(this.turningPoints[this.turningPoints.length-1])},contains:function(h,i){var k=false;switch(this.type){case Connector.TYPE_STRAIGHT:case Connector.TYPE_JAGGED:for(var l=0;l<this.turningPoints.length-1;l++){var g=new Line(this.turningPoints[l],this.turningPoints[l+1]);if(g.contains(h,i)){k=true;break}}break;case Connector.TYPE_ORGANIC:var j=new NURBS(this.turningPoints);k=j.contains(h,i);break}return k},near:function(h,j,i){var l=false;switch(this.type){case Connector.TYPE_STRAIGHT:case Connector.TYPE_JAGGED:for(var m=0;m<this.turningPoints.length-1;m++){var n=new Line(this.turningPoints[m],this.turningPoints[m+1]);if(n.near(h,j,i)){l=true;break}}break;case Connector.TYPE_ORGANIC:var k=new NURBS(this.turningPoints);l=k.near(h,j,i);break}return l},middle:function(){if(this.type==Connector.TYPE_STRAIGHT){var k=(this.turningPoints[0].x+this.turningPoints[1].x)/2;var m=(this.turningPoints[0].y+this.turningPoints[1].y)/2;return[k,m]}else{if(this.type==Connector.TYPE_JAGGED){var l=0;for(var i=0;i<this.turningPoints.length-1;i++){l+=Util.getLength(this.turningPoints[i],this.turningPoints[i+1])}var j=-1;var n=0;for(var i=0;i<this.turningPoints.length-1;i++){j=i;var p=Util.getLength(this.turningPoints[i],this.turningPoints[i+1]);if(n+p<l/2){n+=p}else{break}}if(j!=-1){var o=l/2-n;if(Util.round(this.turningPoints[j].x,3)==Util.round(this.turningPoints[j+1].x,3)){return[this.turningPoints[j].x,Math.min(this.turningPoints[j].y,this.turningPoints[j+1].y)+o]}else{if(Util.round(this.turningPoints[j].y,3)==Util.round(this.turningPoints[j+1].y,3)){return[Math.min(this.turningPoints[j].x,this.turningPoints[j+1].x)+o,this.turningPoints[j].y]}else{Log.error("Connector:middle() - this should never happen "+this.turningPoints[j]+" "+this.turningPoints[j+1]+" nr of points "+this.turningPoints.length)}}}}}return null},updateMiddleText:function(){var b=this.middle();if(b!=null){this.middleText.transform(Matrix.translationMatrix(b[0]-this.middleText.vector[0].x,b[1]-this.middleText.vector[0].y))}},getBounds:function(){var d=minY=maxX=maxY=null;for(var c=0;c<this.turningPoints.length;c++){if(this.turningPoints[c].x<d||d==null){d=this.turningPoints[c].x}if(this.turningPoints[c].x>maxX||maxX==null){maxX=this.turningPoints[c].x}if(this.turningPoints[c].y<minY||minY==null){minY=this.turningPoints[c].y}if(this.turningPoints[c].y>maxY||maxY==null){maxY=this.turningPoints[c].y}}return[d,minY,maxX,maxY]},toString:function(){return"Connector : (id = "+this.id+", type = "+this.type+", turningPoints = ["+this.turningPoints+"], userChanges = ["+this.userChanges+"], solution = "+this.solution+", startStyle = "+this.startStyle+", endStyle = "+this.endStyle+", activeConnectionPointId = "+this.activeConnectionPointId+")"},toSVG:function(){var n='<polyline points="';for(var o=0;o<this.turningPoints.length;o++){n+=this.turningPoints[o].x+","+this.turningPoints[o].y+" "}n+='"';n+=this.style.toSVG();n+="/>";var l=null;if(this.startStyle==Connector.STYLE_ARROW){l=this.getArrow(this.turningPoints[0].x,this.turningPoints[0].y)}if(this.startStyle==Connector.STYLE_EMPTY_TRIANGLE){l=this.getTriangle(this.turningPoints[0].x,this.turningPoints[0].y,false)}if(this.startStyle==Connector.STYLE_FILLED_TRIANGLE){l=this.getTriangle(this.turningPoints[0].x,this.turningPoints[0].y,true)}if(l){var i=this.turningPoints[0].x;var j=this.turningPoints[0].y;var p=Util.getAngle(this.turningPoints[0],this.turningPoints[1],0);l.transform(Matrix.translationMatrix(-i,-j));l.transform(Matrix.rotationMatrix(p));l.transform(Matrix.translationMatrix(i,j));n+=l.toSVG()}if(this.endStyle==Connector.STYLE_ARROW){l=this.getArrow(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y)}if(this.endStyle==Connector.STYLE_EMPTY_TRIANGLE){l=this.getTriangle(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y,false)}if(this.endStyle==Connector.STYLE_FILLED_TRIANGLE){l=this.getTriangle(this.turningPoints[this.turningPoints.length-1].x,this.turningPoints[this.turningPoints.length-1].y,true)}if(l){var i=this.turningPoints[this.turningPoints.length-1].x;var j=this.turningPoints[this.turningPoints.length-1].y;var p=Util.getAngle(this.turningPoints[this.turningPoints.length-1],this.turningPoints[this.turningPoints.length-2],0);l.transform(Matrix.translationMatrix(-i,-j));l.transform(Matrix.rotationMatrix(p));l.transform(Matrix.translationMatrix(i,j));n+=l.toSVG()}if(this.middleText.str.length!=1){var k=this.middleText.getBounds();var m=new Polygon();m.addPoint(new Point(k[0],k[1]));m.addPoint(new Point(k[2],k[1]));m.addPoint(new Point(k[2],k[3]));m.addPoint(new Point(k[0],k[3]));m.style.fillStyle="#FFFFFF";n+=m.toSVG();n+=this.middleText.toSVG()}return n}};function ConnectionPoint(g,f,h,e){this.id=h;this.point=f.clone();this.parentId=g;this.type=e;this.color=ConnectionPoint.NORMAL_COLOR;this.radius=3;this.oType="ConnectionPoint"}ConnectionPoint.NORMAL_COLOR="#FFFF33";ConnectionPoint.OVER_COLOR="#FF9900";ConnectionPoint.CONNECTED_COLOR="#ff0000";ConnectionPoint.RADIUS=4;ConnectionPoint.TYPE_FIGURE="figure";ConnectionPoint.TYPE_CONNECTOR="connector";ConnectionPoint.load=function(c){var d=new ConnectionPoint(0,new Point(0,0),ConnectionPoint.TYPE_FIGURE);d.id=c.id;d.point=Point.load(c.point);d.parentId=c.parentId;d.type=c.type;d.color=c.color;d.radius=c.radius;return d};ConnectionPoint.loadArray=function(d){var e=[];for(var f=0;f<d.length;f++){e.push(ConnectionPoint.load(d[f]))}return e};ConnectionPoint.cloneArray=function(d){var e=[];for(var f=0;f<d.length;f++){e.push(d[f].clone())}return e};ConnectionPoint.prototype={constructor:ConnectionPoint,clone:function(){return new ConnectionPoint(this.parentId,this.point.clone(),this.id,this.type)},equals:function(b){return this.id==b.id&&this.point.equals(b.point)&&this.parentId==b.parentId&&this.type==b.type&&this.color==b.color&&this.radius==b.radius},paint:function(b){b.save();b.fillStyle=this.color;b.strokeStyle="#000000";b.beginPath();b.arc(this.point.x,this.point.y,ConnectionPoint.RADIUS,0,(Math.PI/180)*360,false);b.stroke();b.fill();b.restore()},transform:function(b){this.point.transform(b)},highlight:function(){this.color=ConnectionPoint.OVER_COLOR},unhighlight:function(){this.color=ConnectionPoint.NORMAL_COLOR},contains:function(d,c){return this.near(d,c,ConnectionPoint.RADIUS)},near:function(d,f,e){return new Point(this.point.x,this.point.y).near(d,f,e)},toString:function(){return"ConnectionPoint id = "+this.id+" point = ["+this.point+"] ,type = "+this.type+", parentId = "+this.parentId+")"}};function Glue(f,e,d){this.id1=f;this.id2=e;this.type1="figure";this.type2="connector";this.oType="Glue";this.automatic=d}Glue.load=function(c){var d=new Glue(-1,-1,false);d.id1=c.id1;d.id2=c.id2;d.type1=c.type1;d.type2=c.type2;d.automatic=c.automatic?c.automatic:false;return d};Glue.loadArray=function(d){var e=[];for(var f=0;f<d.length;f++){e.push(Glue.load(d[f]))}return e};Glue.cloneArray=function(d){var e=[];for(var f=0;f<d.length;f++){e.push(d[f].clone())}return e};Glue.prototype={constructor:Glue,clone:function(){return new Glue(this.id1,this.id2,this.automatic)},equals:function(b){if(!b instanceof Glue){return false}return this.id1==b.id1&&this.id2==b.id2&&this.automatic==b.automatic&&this.type1==b.type1&&this.type2==b.type2},toString:function(){return"Glue : (id1 = "+this.id1+", id2 = "+this.id2+", type1 = "+this.type1+", type2 = "+this.type2+", automatic = "+this.automatic+")"}};