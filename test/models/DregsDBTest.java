package models;


import com.avaje.ebean.Ebean;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import play.db.DB;
import play.test.FakeApplication;
import play.test.Helpers;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;


public class DregsDBTest {
    private FakeApplication application;

    @Before
    public void startApp() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e){
            e.printStackTrace();
        }
        application = Helpers.fakeApplication();
        Helpers.start(application);
    }

    @After
    public void stopApp() {
        Helpers.stop(application);
    }

    @Test
    public void basicSave(){
        Dregs d = new Dregs("abc", "\\w");
        d.performRegex();
        d.save();
    }

    @Test
    public void dataSource(){
        DataSource ds = DB.getDataSource();
        Connection conn;
        try {
            conn = ds.getConnection();
            assertFalse(conn.isClosed());
            conn.close();
            assertTrue(conn.isClosed());
        }
        catch (SQLException e){
            e.printStackTrace();
        }
    }

}

