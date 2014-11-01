package cn.edu.cup.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.OfficeXmlFileException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import cn.edu.cup.manage.business.DeviceKV;
import cn.edu.cup.manage.dao.AlgorithmsCycleDao;
import cn.edu.cup.map.business.Graphi;
import cn.edu.cup.map.business.Line;
import cn.edu.cup.map.business.Point;
import cn.edu.cup.tools.Tools;

public class FileExcel {
	private static String ExcelAlgBaseDir="ExcelFrame";
	private static String ExcelProBaseDir="ExcelProject";
	
	public String getMsg() {
		return msg;
	}
	public int getSheetNum() {
		return sheetNum;
	}
	public List<SheetContent> getExcelContent() {
		return excleContent;
	}

	String msg = "";
	int sheetNum = 0;
	List<SheetContent> excleContent;


/*	private void saveInSession(){
		  ActionContext actionContext = ActionContext.getContext();   
		  
	       Map session = actionContext.getSession();   
	  
	       session.put("operatingExcel", excleContent);   
	  
	}
	private void getInSession(){
		  ActionContext actionContext = ActionContext.getContext();   
		  
	       Map session = actionContext.getSession();   
	  
	       excleContent=(List<SheetContent>)session.get("operatingExcel");   
	  
	}*/
	public static void main(String args[]) {
		//new FileExcel().readExcel(1,"E:\\profit\\oil项目\\Input-General.xls");
	}
	public int getProID() {
		return proID;
	}
	public SheetContent getSheetByID(int id){
		return excleContent.get(id);
	}
	int proID;
	int algID;
	String InOrOut;
	public String getInOrOut() {
		return InOrOut;
	}

	String fileName;
	public String getFileName() {
		return fileName;
	}
	public  int  readExcel(int proID,int algid,String InOrOut,String fileName) throws IOException {
		this.proID=proID;
		this.algID=algid;
		this.fileName=fileName;
		this.InOrOut=InOrOut;
		InputStream inputStream;
		try {
			String path=Tools.getWebRoot()+fileName;
			inputStream = new FileInputStream(new File(path));
			//System.out.println(123);
			Workbook wb = null;
			// 解析xls格式
			if (fileName.endsWith("xls")) {

					//System.out.println("read excel"+fileName);
					wb = new HSSFWorkbook(inputStream);
				
			
				// 解析xlsx格式
			} else if (fileName.endsWith("xlsx")) {
				wb = new XSSFWorkbook(inputStream);// 解析xlsx格式
			}
			sheetNum = wb.getNumberOfSheets();
			excleContent=new ArrayList<SheetContent>();
			for (int i = 0; i < sheetNum; i++) {
				Sheet sheet = wb.getSheetAt(i);// 第i个工作表
				SheetContent temp=new SheetContent(sheet,i); 
				excleContent.add(temp);
				//System.out.println(sheet.getSheetName());
				
				}
			
			msg="excle解析成功";
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
			msg = "Excel文件未找到";
			return -1;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			msg = "Excel文件格式不正确";
			//inputStream.close();
			return -1;
		}
		inputStream.close();
		return 1;
	}
	public int getAlgID() {
		return algID;
	}
	Cell cell1_1;
	public int insertCell(Row row1,int i,int j,String value){
		if(j==0){
			return 1;
		}
		cell1_1 = row1.createCell(j-1);  
		cell1_1.setCellValue(value);
		return 1;
	}
	Row row;
	public int insertRow(Sheet sheet,int i,List<String> values){
		row = sheet.createRow(i);  
		for(int j=0;j<values.size();j++){
			insertCell(row,i,j,values.get(j));
		}

		return 1;
	}
	public int saveExcel(){//保存到文件
		//生成Workbook
		//Workbook  wb = new SXSSFWorkbook(1000);
		Workbook  wb = new HSSFWorkbook();
		//添加Worksheet（不添加sheet时生成的xls文件打开时会报错）
		//@SuppressWarnings("unused")
		List<Sheet> sheets=new ArrayList<Sheet>();
		for(int i=0;i<this.excleContent.size();i++){
			sheets.add(wb.createSheet(excleContent.get(i).getName()));
			SheetContent temp=excleContent.get(i);
			for(int k=0;k<temp.sheetContent.size();k++){
				insertRow(sheets.get(i),k,temp.sheetContent.get(k));
			}
		}

		
		//保存为Excel文件
		FileOutputStream out = null;

		try {
		    out = new FileOutputStream(Tools.getWebRoot()+this.fileName);
		    System.out.println("save "+this.fileName);
		    wb.write(out);		
		} catch (IOException e) {
		
		    //System.out.println(e.toString());
			return -1;
		} finally {
		    try {
		        out.close();
		    } catch (IOException e) {
		        //System.out.println(e.toString());
		    }
		}	
 
		return 1;
	}
	public String writeExcel(String fileName) {
		
		return "Success";

	}

	// 读取表头
	public String getTitle() {
		return "";
	}
	public void coverFromImport(FileExcel importExcle) {
		List<SheetContent> list=importExcle.getExcelContent();
		for(int i=0;i<list.size();i++){
			SheetContent temp=this.excleContent.get(i);
			if(temp.getName().equals(list.get(i).getName())){
				this.excleContent.get(i).coveredByImport(list.get(i));
			}
			}
		
	}
	public Graphi getGraphi() {
		Graphi a=new Graphi();
		a.setPoints(getPoints());
		a.setLines(getLines());
		
		return a;
	}
	public int getType(int algid){
		AlgorithmsCycleDao dao=new AlgorithmsCycleDao();
		return dao.getAlgType(algid);
		
	}
	private Map<String, Point> getPoints() {
		
		int type=getType(algID);
		Map<String,Point> Points=new HashMap<String,Point>();
		if(type==1){
			for(int i=0;i<this.excleContent.size();i++){
				
				SheetContent temp=this.excleContent.get(i);
				
				Points.putAll(temp.getSimulationPoints(this));
				
			}
		}
		if(type==2){		
		for(int i=0;i<this.excleContent.size();i++){
			
			SheetContent temp=this.excleContent.get(i);
			
			Points.putAll(temp.getPoints());
			
		}	
		}
		return Points;
	}
	private List<Line> getLines() {
		
		
		int type=getType(algID);
		List<Line> lines=new ArrayList<Line>();
		if(type==1){
			for(int i=0;i<this.excleContent.size();i++){
				
				SheetContent temp=this.excleContent.get(i);
				
				lines.addAll(temp.getSimulationLines());
				
			}
		}
		if(type==2){		
			
			for(int i=0;i<this.excleContent.size();i++){
				
				SheetContent temp=this.excleContent.get(i);
				
				lines.addAll(temp.getLines());
				
			}	
		}
		
		
		
		return lines;
	}
	public Graphi getObstacleGraphi() {
		Graphi a=null;
		for(int i=0;i<this.excleContent.size();i++){
			
			SheetContent temp=this.excleContent.get(i);
			
			if(temp.getName().equals("障碍区")){
				a=temp.getObstacle();
			}
			
		}
		
		return a;
	}
	public Map<String, List<Point>> getObstacleMap() {
		 Map<String, List<Point>> a=new HashMap<String, List<Point>>();
		for(int i=0;i<this.excleContent.size();i++){
			
			SheetContent temp=this.excleContent.get(i);
			
			if(temp.getName().equals("障碍区")){
				a=temp.getObstacleMap();
			}
			
		}
		 return a;
	}
	public SheetContent getObstacleSheet() {
		for(int i=0;i<this.excleContent.size();i++){
			
			SheetContent temp=this.excleContent.get(i);
			
			if(temp.getName().equals("障碍区")){
				return temp;
			}
			
		}
		return null;
	}


	public SheetContent getSheetByName(FileExcel excel,String name){
		for(int i=0;i<excel.excleContent.size();i++){
			
			SheetContent temp=this.excleContent.get(i);
			
			if(temp.getName().equals(name)){
				return temp;
			}
			
		}
		return null;
	}
	public int getTypeCodeByName(String Name){
		if(Name.equalsIgnoreCase("离心压缩机数据")||Name.equalsIgnoreCase("往复式压缩机数据"))
			return 1;
		if(Name.equalsIgnoreCase("气井数据")||Name.equalsIgnoreCase("气源数据")||Name.equalsIgnoreCase("分输点数据")||Name.equalsIgnoreCase("其他数据"))
			return 0;
		if(Name.equalsIgnoreCase("管道数据"))
			return 2;
		if(Name.equalsIgnoreCase("其他"))
			return 4;
		return 3;
	}
	public String getTypeByYSJLS(String Name){
		if(Name.equalsIgnoreCase("集气增压站"))
			return "JQZYZ01";
		if(Name.equalsIgnoreCase("主动增压点"))
			return "ZDZYD01";
		if(Name.equalsIgnoreCase("中央处理厂"))
			return "ZYCLC01";
		return "";
	}
	public int addPoint(String type, String name,String YSJLS) {
		SheetContent a=getSheetByName(this,type);
		//int row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		
		int row;
/*		if(row==-1){
			Map<String,String> p=new HashMap<String,String>();
			
			p.put("名称", name);
			
			row=a.addRow(p);
			
		}else{
			return row;
		}
		*/
	   if(getTypeCodeByName(type)==1){
		   a=getSheetByName(this,type);
		   SheetContent b=getSheetByName(this,"管段连接");
		   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		   int row2=b.getExcelDataIndex(b, b.getTitleByName("设备名称"),name );
		   
		   if(row==-1&&row2==-1){
			Map<String,String> p=new HashMap<String,String>();			
			YSJLS=getTypeByYSJLS(YSJLS);
			p.put("名称", name);
			p.put("设备位置", YSJLS);
			row=a.addRow(p);
			
			Map<String,String> p1=new HashMap<String,String>();			
			p1.put("设备名称", name);
			p1.put("名称", name);
			
			if(type.equals("离心压缩机数据")){
				p1.put("管段类型", "CentCompressor");
				p1.put("设备位置", YSJLS);}
			if(type.equals("往复式压缩机数据")){
				p1.put("管段类型", "ReciCompressor");
				p1.put("设备位置", YSJLS);}
			if(type.equals("阀数据")){
				p1.put("管段类型", "Valve");}
			if(type.equals("过滤器数据")){
				p1.put("管段类型", "Filter");}
			row2=b.addRow(p1);
			return -1;
		}else{
			return row;
		}
	   }
	   if(getTypeCodeByName(type)==0){
		   a=getSheetByName(this,"节点数据");
		   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		   if(row==-1){
			Map<String,String> p=new HashMap<String,String>();			
			p.put("名称", name);
			p.put("气井、气源或分输点名称", name);
			p.put("隶属关系",type.replace("数据", ""));
			row=a.addRow(p);
			return -1;
		}else{
			return row;
		}
	   }
	   if(getTypeCodeByName(type)==2){
		   a=getSheetByName(this,"管段连接");
		   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		   if(row==-1){
			Map<String,String> p=new HashMap<String,String>();			
			p.put("名称", name);
			p.put("管段类型", "Pipe");
			row=a.addRow(p);
			return -1;
		}else{
			return row;
		}
	   }
	   if(getTypeCodeByName(type)==3){
		   a=getSheetByName(this,type);
		   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		   if(row==-1){
			Map<String,String> p=new HashMap<String,String>();			
			p.put("名称", name);
			row=a.addRow(p);
			return -1;
		}else{
			return row;
		}
	   }
	   return 0;
	}
	public int delPoint(String type, String name) {
		SheetContent a=getSheetByName(this,type);
		int row;
		if(a!=null){
		row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
		
		
		if(row!=-1){
			a.removeRow(row);
			a.updateSheet();
		}
		}
		
	   a=getSheetByName(this,"节点数据");
	   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
	
	
	   if(row!=-1){		
			a.removeRow(row);			
		
	   }
	   a.updateSheet();
	   a=getSheetByName(this,"管段连接");
	   row=a.getExcelDataIndex(a, a.getTitleByName("上游节点"),name );
	   if(row!=-1){		
			a.removeRow(row);		
	   }
	   row=a.getExcelDataIndex(a, a.getTitleByName("下游节点"),name );
	   if(row!=-1){		
			a.removeRow(row);		
	   }
	   row=a.getExcelDataIndex(a, a.getTitleByName("名称"),name );
	   if(row!=-1){		
			a.removeRow(row);		
	   }
	   a.updateSheet();
	return 0;
	}
	public void updateConn(Line line) {
		 SheetContent a=getSheetByName(this,"管段连接");
	
		  
			  
			  
		 int row=a.getExcelDataIndex(a, a.getTitleByName("名称"),line.getName());
			   
			   
		 if(row!=-1){
			 a.editCell(row,a.getTitleByName("上游节点"),line.getStart());
			 a.editCell(row,a.getTitleByName("下游节点"),line.getEnd());
				
			}else{
				
			}
		   
		
	}
	public List<DeviceKV> getDevice(String type, String name) {
		Point e=new Point();
		List<DeviceKV> a=new ArrayList<>();
		
		if(type.equals("分输点数据")||type.equals("气井数据")||type.equals("气源数据")||type.equals("其他数据")){
			SheetContent sheet=getSheetByName(this,"节点数据");
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			List<String> line=sheet.sheetContent.get(row);
			Map<String,String> map=sheet.getAttribute(line);
			List<String> list=sheet.sheetContent.get(0);
			list=list.subList(1, list.size());
			for (Iterator<String> iter=list.iterator();iter.hasNext();) {
				String key=iter.next();
				String value=map.get(key);
				DeviceKV KV=new DeviceKV();
				KV.setName(key);
				KV.setValue(value);
				a.add(KV);
			}
		}
		if(type.equals("管道数据")){
			SheetContent sheet=getSheetByName(this,"管段连接");
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			List<String> line=sheet.sheetContent.get(row);
			Map<String,String> map=sheet.getAttribute(line);
			List<String> list=sheet.sheetContent.get(0);
			list=list.subList(1, list.size());
			for (Iterator<String> iter=list.iterator();iter.hasNext();) {
				String key=iter.next();
				String value=map.get(key);
				DeviceKV KV=new DeviceKV();
				KV.setName(key);
				KV.setValue(value);
				a.add(KV);
			}
		}
		if(type.equals("离心压缩机数据")||type.equals("往复式压缩机数据")){
			SheetContent sheet=getSheetByName(this,type);
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			List<String> line=sheet.sheetContent.get(row);
			Map<String,String> map=sheet.getAttribute(line);
			List<String> list=sheet.sheetContent.get(0);
			list=list.subList(1, list.size());
			for (Iterator<String> iter=list.iterator();iter.hasNext();) {
				String key=iter.next();
				String value=map.get(key);
				DeviceKV KV=new DeviceKV();
				KV.setName(key);
				KV.setValue(value);
				a.add(KV);
			}
		}
		if(type.equals("阀数据")||type.equals("过滤器数据")){
			SheetContent sheet=getSheetByName(this,type);
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			List<String> line=sheet.sheetContent.get(row);
			Map<String,String> map=sheet.getAttribute(line);
			List<String> list=sheet.sheetContent.get(0);
			list=list.subList(1, list.size());
			for (Iterator<String> iter=list.iterator();iter.hasNext();) {
				String key=iter.next();
				String value=map.get(key);
				DeviceKV KV=new DeviceKV();
				KV.setName(key);
				KV.setValue(value);
				a.add(KV);
			}
		}
		return a;
		
	}
	public void updateDevice(String type, String name, String proper,
			String newValue) {
		if(type.equals("分输点数据")||type.equals("气井数据")||type.equals("气源数据")){
			SheetContent sheet=getSheetByName(this,"节点数据");
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			sheet.editCell(row, sheet.getTitleByName(proper), newValue);
	
		}
		if(type.equals("管道数据")){
			SheetContent sheet=getSheetByName(this,"管段连接");
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			sheet.editCell(row, sheet.getTitleByName(proper), newValue);
		}
		if(type.equals("离心压缩机数据")||type.equals("往复式压缩机数据")){
			SheetContent sheet=getSheetByName(this,type);
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			sheet.editCell(row, sheet.getTitleByName(proper), newValue);
		}
		if(type.equals("阀数据")||type.equals("过滤器数据")){
			SheetContent sheet=getSheetByName(this,type);
			int row=sheet.getExcelDataIndex(sheet, sheet.getTitleByName("名称"), name);
			sheet.editCell(row, sheet.getTitleByName(proper), newValue);
		}
		
	}

}
