package cn.edu.cup.manage.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.edu.cup.file.ColModel;
import cn.edu.cup.file.FileExcle;
import cn.edu.cup.file.SheetContent;
import cn.edu.cup.manage.business.AlgorithmsCycle;
import cn.edu.cup.manage.dao.AlgorithmProDao;
import cn.edu.cup.manage.dao.AlgorithmsCycleDao;

import com.opensymphony.xwork2.ActionContext;

public class AlgorithmExcleAction {
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
	public FileExcle getFileExcle(int proid){
		ActionContext actionContext = ActionContext.getContext();
        Map session = actionContext.getSession();
        Map<Integer,FileExcle> cacheList=(Map<Integer,FileExcle>)session.get("ExcleCacheList");
       
        if(cacheList==null){
        	cacheList=new HashMap<Integer,FileExcle>();
        	//session.put("ExcleCacheList", cacheList);
        	
        }
      
        FileExcle excle=cacheList.get(proid);
        if(excle!=null){
        		return excle;
        	}
              
			
    		AlgorithmProDao dao=new AlgorithmProDao();
    		
    		String  filepath=dao.getProFile(this.proID);
    		dao.close();
    		if (filepath==null ||filepath.equals("")){
    			return null;
    		}
    		excle=new FileExcle();
    		int status=excle.readExcle(this.proID,filepath);
    		if(status==-1){
    			msg=excle.getMsg();
    			return null;
    		}
    		cacheList.put(proid,excle);
    		session.put("ExcleCacheList",cacheList);
    		return excle;
    		
	}
	public FileExcle putFileExcle(FileExcle e){
		ActionContext actionContext = ActionContext.getContext();
        Map session = actionContext.getSession();
        Map<Integer,FileExcle> cacheList=(Map<Integer,FileExcle>)session.get("ExcleCacheList");
        cacheList.put(e.getProID(),e);
        session.put("ExcleCacheList",cacheList);
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
	public String delSheetContent(){
		FileExcle excle=getFileExcle(this.proID);
		if (!ids.isEmpty()) {

			for (int id : ids) {
				
				excle.getSheetByID(sheetID).removeRow(id);
			}
		}
		excle.getSheetByID(sheetID).updateSheet();
		putFileExcle(excle);
		return "SUCCESS";
	}
	public String listSheetContent(){
		FileExcle excle=getFileExcle(this.proID);
		
		sheetContent=excle.getSheetByID(sheetID);
		records=sheetContent.getSize();
		sheetContent.buildContent(page, rows);
		content=sheetContent.getContent();
		
		total = records / rows;
		if (records % rows != 0) {
			total++;
		}
		putFileExcle(excle);
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
		FileExcle excle=new FileExcle();
		int status=excle.readExcle(this.proID,p.getStructFile());
		if(status==-1){
			msg=excle.getMsg();
			return "SUCCESS";
		}
		sheetTile=excle.getSheetByID(sheetID).getTitle();
		sheetName=excle.getSheetByID(sheetID).getName();
		colModel=excle.getSheetByID(sheetID).getColModel();
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
