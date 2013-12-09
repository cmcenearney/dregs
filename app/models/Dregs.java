package models;

import org.apache.commons.lang3.StringUtils;

import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Dregs {

    private String str;
    private String regexString;
    private Pattern regex;
    private LinkedList<DregsNode> output = new LinkedList<DregsNode>();


    public Dregs(String str, String regexString){
        this.str = str;
        this.regexString = regexString;
        this.regex = Pattern.compile(regexString);
    }

    public Dregs(String str, Pattern regex){
        this.str = str;
        this.regex = regex;
    }


    public void performRegex(){
        Matcher m = regex.matcher(str);
        int nonMatchCntr = 0;
        int endOfMatchCntr = 0;
        if (!m.find()){
            return;
        }
        while (m.find()){
            //System.out.println(m.group());
            if (m.start() >= nonMatchCntr){
                String nonMatched = str.substring(nonMatchCntr, m.start());
                output.add(new DregsNode(nonMatched, false));
                //System.out.println("not matched: " + nonMatched);
                nonMatchCntr = m.end();
            }
            //System.out.println("start position: " + m.start());
            //System.out.println("end position: " + ( (Integer) m.end() - 1)  );
            String matched = str.substring(m.start(), m.end());
            //System.out.println("matched: " + matched);
            output.add(new DregsNode(matched,true));
            endOfMatchCntr = m.end();
        }
        if (endOfMatchCntr != str.length()){
            String last = str.substring(endOfMatchCntr, str.length());
            output.add(new DregsNode(last,false));
        }
    }

    public String outputHtml(){
        String html = "";
        for (DregsNode d : output){
            String outputReady = StringUtils.replaceEach(d.getValue(), new String[]{"&", "\"", "<", ">"}, new String[]{"&amp;", "&quot;", "&lt;", "&gt;"}) ;
            if (d.isHighlighted()){
                html += "<span class=\"highlighted\">" + outputReady + "</span>";
            }
            else {
                html += outputReady;
            }
        }
        return html;
    }

}

