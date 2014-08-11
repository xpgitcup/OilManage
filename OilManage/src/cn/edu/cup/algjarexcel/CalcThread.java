package cn.edu.cup.algjarexcel;

import cn.edu.cup.manage.action.AlgorithmExcelAction;

public class CalcThread extends Thread {
	ProjectInfo proinfo;
	AlgorithmPlugTools alg;
	public void setProInfo(ProjectInfo proinfo) {
		// TODO Auto-generated method stub
		this.proinfo=proinfo;
		this.alg=this.proinfo.getAlg();
	}
	public void stopByForce(){
		this.proinfo.end(3, "外部强制终止");
		this.destroy();
	}
	public void setAlg(AlgorithmPlugTools alg) {
		// TODO Auto-generated method stub
		this.alg=alg;
	}

	public void run() {
		// TODO Auto-generated method stub
		alg.injectInfo(proinfo.getInfo());
		try{
		alg.startCalc(proinfo.getAlgID());
		
		}catch(Exception e){
			proinfo.getInfo().endsWithError(e.getMessage());
		}
		new AlgorithmExcelAction().reloadFileExcel(proinfo.getProid(), proinfo.getAlgID(), "Out");
	}

}
