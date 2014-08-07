package cn.edu.cup.manage.action;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import net.sf.json.JSONObject;
import cn.edu.cup.algjarexcel.ProCalcManage;
import cn.edu.cup.file.ColModel;
import cn.edu.cup.file.FileExcel;
import cn.edu.cup.file.SheetContent;
import cn.edu.cup.manage.business.AlgorithmsCycle;
import cn.edu.cup.manage.dao.AlgorithmProDao;
import cn.edu.cup.manage.dao.AlgorithmsCycleDao;
import cn.edu.cup.tools.Tools;

import com.opensymphony.xwork2.ActionContext;

public class AlgorithmExcelAction {
	public static String ExcelAlgBaseDir="ExcelFrame\\";
	public static String ExcelProBaseDir="ExcelProject\\";
	public static String AlgBaseDir="uploadAlgorithm\\";
	int algID;
	int sheetID;
	int proID;
	private int page;
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	private int records;
	private int rows;
	private int rowNum;
	private int total;
	public void setProID(int proID) {
		this.proID = proID;
	}
	
	private File excelImport;
	private String excelImportFile;
	private String excelImportFileName;
	public void setExcelImport(File excelImport) {
		this.excelImport = excelImport;
	}
	public void setExcelImportFile(String excelImportFile) {
		this.excelImportFile = excelImportFile;
	}
	public void setExcelImportFileName(String excelImportFileName) {
		this.excelImportFileName = excelImportFileName;
	}
	public String uploadExcel(){
		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);//从缓存或者文件里面读取excel内容

		FileExcel importExcle=new FileExcel();		
		int status=importExcle.readExcel(this.proID,this.algID,this.InOrOut,excelImport.getAbsolutePath());
		excel.coverFromImport(importExcle);
		putFileExcel(excel);//excel放到缓存里
		saveExcel();//保存到文件
		return "SUCCESS";
	}
	public FileExcel getFileExcel(int proid,int algid,String InOrOut){
		ActionContext actionContext = ActionContext.getContext();
        Map session = actionContext.getSession();
        Map<String,FileExcel> cacheList=(Map<String,FileExcel>)session.get("ExcelCacheList");
       
        if(cacheList==null){
        	cacheList=new HashMap<String,FileExcel>();
        	//session.put("ExcelCacheList", cacheList);
        	
        }
      String key=Tools.createKeyFromProAndALg(proid,algid,InOrOut);
        FileExcel excel=cacheList.get(key);
        if(excel!=null){//先从缓存读取excel
        		return excel;
        	}
              
			
    		AlgorithmProDao dao=new AlgorithmProDao();
    		
    		String  filepath=dao.getProFile(this.proID,algid,InOrOut);//缓存没有，则从项目路径寻找excel文件
    		dao.close();
    		if (filepath==null ||filepath.equals("")){
    			msg="Excel文件未找到";
    			return null;
    		}
    		excel=new FileExcel();
    		int status=excel.readExcel(this.proID,algid,InOrOut,ExcelProBaseDir+filepath);
    		if(status==-1){
    			msg=excel.getMsg();
    			return null;
    		}
    		cacheList.put(key,excel);
    		session.put("ExcelCacheList",cacheList);
    		return excel;
    		
	}
	public String saveExcel(){
		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);
		int re=excel.saveExcel();
		if(re==-1){
			msg="保存失败，请检查数据结构";
		}
		return "SUCCESS";
	}
	
	public FileExcel putFileExcel(FileExcel e){//将excel内容放入缓存
		ActionContext actionContext = ActionContext.getContext();
        Map session = actionContext.getSession();
        Map<Integer,FileExcel> cacheList=(Map<Integer,FileExcel>)session.get("ExcelCacheList");
        
        String key=Tools.createKeyFromProAndALg(e.getProID(),e.getAlgID(),e.getInOrOut());
        cacheList.put(e.getProID(),e);
        session.put("ExcelCacheList",cacheList);
        return e;
	}
	String msg;
	List<String> sheetTile;
	List<ColModel> colModel;
	List<Map<String,String>> content;
	SheetContent sheetContent;
	private List<Integer> ids;
	public void setIds(List<Integer> ids) {
		this.ids = ids;
	}

	public List<Integer> getIds() {
		return ids;
	}
	String sheetName;
	int 	Index_ID;	
	int col_ID;
	String newValue;
	String status="success";
	String InOrOut="";
	public String getInOrOut() {
		return InOrOut;
	}
	public void setInOrOut(String inOrOut) {
		InOrOut = inOrOut;
	}
	public String getStatus() {
		return status;
	}
	public void setIndex_ID(int index_ID) {
		Index_ID = index_ID;
	}

	public void setCol_ID(int col_ID) {
		this.col_ID = col_ID;
	}
	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}
	public String addSheetContent(){
		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);
		SheetContent sheet=excel.getSheetByID(sheetID);
		sheet.addRow(this.postMap);
		putFileExcel(excel);
		return "SUCCESS";
	}
	public String editSheetContent(){
		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);
		SheetContent sheet=excel.getSheetByID(sheetID);
		sheet.editCell(Index_ID,col_ID,newValue);
		putFileExcel(excel);
		return "SUCCESS";
	}
	Map<String,String> postMap;
	public void setPostMap(String postMap) {
		JSONObject jsonObject2 =JSONObject.fromObject(postMap);
		this.postMap=new HashMap<String, String>();
		for(Iterator<String> iter = jsonObject2.keySet().iterator();iter.hasNext();)
		{ 
			String key=iter.next();
		this.postMap.put(key, jsonObject2.getString(key));
		}
	}
	public String delSheetContent(){
		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);
		if (!ids.isEmpty()) {

			for (int id : ids) {
				
				excel.getSheetByID(sheetID).removeRow(id);
			}
		}
		excel.getSheetByID(sheetID).updateSheet();
		putFileExcel(excel);
		return "SUCCESS";
	}
	public static void main(String args[]){
	//	new AlgorithmExcelAction().saveExcel();
	}
	public String listSheetContent(){

		FileExcel excel=getFileExcel(this.proID,this.algID,this.InOrOut);
		if(excel==null){
			return "SUCCESS";
		}
		if(sheetID>=excel.getSheetNum()){
			msg="请求的参数页面超出范围";
			return "SUCCESS";
		}
		sheetContent=excel.getSheetByID(sheetID);
		records=sheetContent.getSize();
		sheetContent.buildContent(page, rows);
		content=sheetContent.getContent();
		
		total = records / rows;
		if (records % rows != 0) {
			total++;
		}
		putFileExcel(excel);
		return "SUCCESS";
	}

	public int getRecords() {
		return records;
	}
	public void setRecords(int records) {
		this.records = records;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public int getRowNum() {
		return rowNum;
	}
	public void setRowNum(int rowNum) {
		this.rowNum = rowNum;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public List<Map<String, String>> getContent() {
		return content;
	}
	public String listSheetTitle(){		

		AlgorithmsCycleDao dao=new AlgorithmsCycleDao();
		
		AlgorithmsCycle p=dao.getAlgorithmDetail(this.algID);
		FileExcel excel=new FileExcel();
		String path="";
		if(this.InOrOut.equals("In")){
			path=p.getStructFileIn();
		}else{
			path=p.getStructFileOut();
		}
		int status=excel.readExcel(this.proID,this.algID,this.InOrOut,ExcelAlgBaseDir+path);
		if(status==-1){
			msg=excel.getMsg();
			return "SUCCESS";
		}
		sheetTile=excel.getSheetByID(sheetID).getTitle();
		sheetName=excel.getSheetByID(sheetID).getName();
		colModel=excel.getSheetByID(sheetID).getColModel();
		dao.close();
		return "SUCCESS";
	}
	public String getSheetName() {
		return sheetName;
	}
	public List<ColModel> getColModel() {
		return colModel;
	}
	public String getMsg() {
		return msg;
	}
	public List<String> getSheetTile() {
		return sheetTile;
	}
	public void setAlgID(int algID) {
		this.algID = algID;
	}
	public void setSheetID(int sheetID) {
		this.sheetID = sheetID;
	}
	
	
	
	



	








	
	
	
	
	
	
	
	
	
	
}
