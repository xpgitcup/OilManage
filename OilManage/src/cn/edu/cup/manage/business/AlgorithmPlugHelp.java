package cn.edu.cup.manage.business;

import java.util.Date;
import java.util.Iterator;

import cn.edu.cup.algjar.CalcInfo;
import cn.edu.cup.manage.dao.AlgorithmProDao;
import cn.edu.cup.manage.dao.ProjectCalcHisDao;
import cn.edu.cup.manage.dao.ProjectOutputDao;

public class AlgorithmPlugHelp{
	public CalcInfo info;
	public int pro_id;
	public AlgorithmPlugHelp(int pro_id2){
		AlgorithmProDao dao=new AlgorithmProDao();
		info=dao.getProInfo(pro_id2);
		this.pro_id=pro_id2;
	}
	public CalcInfo getInfo() {
		return info;
	}
	public void setInfo(CalcInfo info) {
		this.info = info;
	}
	public String startCalc() {
		
		return null;
	}
	public void saveHis(Date start){
		ProjectCalcHisDao dao=new ProjectCalcHisDao();
		dao.addCalcHis(pro_id,start);
		//int result=dao.addAlgorithmPro(this.Description,this.authorID,this.name);
		
	}
	public void save(){
		ProjectOutputDao dao=new ProjectOutputDao();
		dao.cleanLastResult(this.pro_id);
		Iterator<String> iter=info.paramOutputs.keySet().iterator();
		for (;iter.hasNext();){
			String name=iter.next();
			dao.save(pro_id,name,info.getParamOutput(name));
		}
		
		iter=info.listOutputs.keySet().iterator();
		for (;iter.hasNext();){
			String name=iter.next();
			dao.save(pro_id,name,info.getListOutput(name));
		}
		
	}

}
