package cn.edu.cup.graphi.dao;

import org.hibernate.Session;

import cn.edu.cup.tools.HibernateSessionManager;

public class BasicNodeDao {
	 Session session ;
	 
		
		public void close() {
			// TODO Auto-generated method stub
			HibernateSessionManager.commitThreadLocalTransaction();
			HibernateSessionManager.closeThreadLocalSession();
		}

		public void roll() {
			// TODO Auto-generated method stub
			HibernateSessionManager.rollbackThreadLocalTransaction();
			HibernateSessionManager.closeThreadLocalSession();
		}

	public BasicNodeDao()
	{	
		session = HibernateSessionManager.getThreadLocalSession();
	
	}
}
