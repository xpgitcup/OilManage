package cn.edu.cup.manage.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import cn.edu.cup.manage.business.AlgorithmPro;
import cn.edu.cup.manage.business.Parameters;
import cn.edu.cup.manage.business.ProjectInputs;
import cn.edu.cup.manage.dao.AlgorithmProDao;
import cn.edu.cup.manage.dao.ParameterDao;
import cn.edu.cup.manage.dao.ProjectInputDao;

public class ProjectInputsAction {
	int ID;
	String inputID;
	String planID;
	String outputID;
	String authorID;
	String Description;
	Date addDate;
	Date lastUpdateDate;
	String name;
	Parameters param;
	List<ProjectInputs> dataList;
	ProjectInputs input;
	private int page;
	private int records;
	private int rows;
	private int rowNum;
	private int total;
	private String sidx;
	private String sord;
	private List<Integer> ids;
	
	public void setParam(Parameters param) {
		this.param = param;
	}
	public Parameters getParam() {
		return param;
	}
	public ProjectInputs getInput() {
		return input;
	}
	public void setInput(ProjectInputs input) {
		this.input = input;
	}
	public void setIds(List<Integer> ids) {
		this.ids = ids;
	}
	public List<Integer> getIds() {
		return ids;
	}
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	
	public void setInputID(String inputID) {
		this.inputID = inputID;
	}
	public String getInputID() {
		return inputID;
	}
	
	public void setPlanID(String planID) {
		this.planID = planID;
	}
	public String getPlanID() {
		return planID;
	}
	
	public void setOutputID(String outputID) {
		this.outputID = outputID;
	}
	public String getOutputID() {
		return outputID;
	}
	
	public void setAuthorID(String authorID) {
		this.authorID = authorID;
	}
	public String getAuthorID() {
		return authorID;
	}
	
	public void setDescription(String description) {
		Description = description;
	}
	public String getDescription() {
		return Description;
	}
	
	public void setAddDate(Date addDate) {
		this.addDate = addDate;
	}
	public Date getAddDate() {
		return addDate;
	}
	
	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}
	
	public void setDataList(List<ProjectInputs> dataList) {
		this.dataList = dataList;
	}
	public List<ProjectInputs> getDataList() {
		return dataList;
	}
	
	public void setPage(int page) {
		this.page = page;
	}
	public int getPage() {
		return page;
	}
	
	public void setRecords(int records) {
		this.records = records;
	}
	public int getRecords() {
		return records;
	}
	
	public void setRows(int rows) {
		this.rows = rows;
	}
	public int getRows() {
		return rows;
	}
	
	public void setRowNum(int rowNum) {
		this.rowNum = rowNum;
	}
	public int getRowNum() {
		return rowNum;
	}
	
	public void setTotal(int total) {
		this.total = total;
	}
	public int getTotal() {
		return total;
	}
	
	public void setSidx(String sidx) {
		this.sidx = sidx;
	}
	public String getSidx() {
		return sidx;
	}
	
	public void setSord(String sord) {
		this.sord = sord;
	}
	public String getSord() {
		return sord;
	}
	int pro_id;
	int param_id;
	String value;
	public String list(){		

		ProjectInputDao dao=new ProjectInputDao();
		
		
		
		dataList=dao.getProInputsList(pro_id,page,rows,sidx,sord);
	
		records=dao.getCountProInputs(this.pro_id);

		if(records!=0&&rows!=0){
			total=records/rows;
			if(records%rows!=0){
				total++;
			}
		}dao.close();
		return "SUCCESS";
	}

	public String search(){

		ProjectInputDao dao=new ProjectInputDao();
		input=dao.searchInput(ID);
		dao.close();
		return "SUCCESS";
	}
	
	public String add(){

		ProjectInputDao dao=new ProjectInputDao();
		ParameterDao paraDao=new ParameterDao();
		int type=paraDao.getParType(this.param_id);
		if(type==0){
			double valueD=Double.valueOf(this.value);
			ID=dao.addInput(this.pro_id,this.param_id,valueD);
		
		}
		if(type==1){
			List<Double> valueList=new ArrayList<Double>();
			String[] temp=this.value.split(",");
			for (int i=0;i<temp.length;i++){
				valueList.add(Double.valueOf(temp[i]));
			}
			ID=dao.addInput(this.pro_id,this.param_id,valueList);
		
		}
		param=paraDao.searchParameter(param_id);
		dao.close();
		return "SUCCESS";
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getPro_id() {
		return pro_id;
	}
	public void setPro_id(int pro_id) {
		this.pro_id = pro_id;
	}
	public int getParam_id() {
		return param_id;
	}
	public void setParam_id(int param_id) {
		this.param_id = param_id;
	}

	
	public String delete(){
		ProjectInputDao dao=new ProjectInputDao();
		//AlgorithmInputDao inputDao=new AlgorithmInputDao();
		if(ids!=null&&!ids.isEmpty()){

			for(int id:ids){
				
				dao.deleteInput(id);
			}
		}else if(ID!=0){
			dao.deleteInput(ID);
		}
		//inputDao.close();
		dao.close();
//		dao.deleteAlgorithm(ID);
		return "SUCCESS";
	}
	public String update(){
		ProjectInputDao dao=new ProjectInputDao();
		double valueD=Double.valueOf(this.value);
		int re=dao.updateInput(ID, valueD);
		dao.close();
		return "SUCCESS"; 
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	
}
