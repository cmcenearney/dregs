package models;

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
}
