package models;

import com.avaje.ebean.Ebean;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DregsTest {

    @Test
    public void basicTest(){
        Dregs d = new Dregs("this is real yo","\\w{2}");
        d.performRegex();
        String expected = "<span class=\"highlighted\">th</span><span class=\"highlighted\">is</span> <span class=\"highlighted\">is</span> <span class=\"highlighted\">re</span><span class=\"highlighted\">al</span> <span class=\"highlighted\">yo</span>";
        assertEquals(expected, d.outputHtml());
    }

    @Test
    public void basicCharMatch(){
        Dregs d = new Dregs("abc", "a");
        d.performRegex();
        String expected = "<span class=\"highlighted\">a</span>bc";
        assertEquals(expected, d.outputHtml());
    }

    @Test
    public void basicNoMatch(){
        Dregs d = new Dregs("abc", "d");
        d.performRegex();
        String expected = "";
        assertEquals(expected, d.outputHtml());
    }


    @Test
    public void basicSave(){
        Dregs d = new Dregs("abc", "\\w");
        d.performRegex();
        Ebean.save(d);
    }

}
