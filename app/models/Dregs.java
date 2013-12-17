package models;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import play.db.ebean.Model;
import play.libs.Json;

@Entity
public class Dregs extends Model{

    @Id
    public Long id;
    public String str;
    public String regexString;
    public Pattern regex;
    public LinkedList<DregsNode> dregsNodes = new LinkedList<DregsNode>();
    public boolean allowUnescaped = false;

    public Dregs(String str, String regexString){
        this.str = str;
        this.regexString = regexString;
        this.regex = Pattern.compile(regexString);
    }

    public Dregs(String str, Pattern regex){
        this.str = str;
        this.regex = regex;
        this.regexString = regex.pattern();
    }

    public static String escapeBackslashes(String s){
        return StringUtils.replaceEach(s, new String[]{"\\"}, new String[]{"\\\\"}) ;
    }

    public void performRegex(){
        Matcher m = regex.matcher(str);
        int nonMatchCntr = 0;
        int endOfMatchCntr = 0;
        while (m.find()){
            if (m.start() >= nonMatchCntr){
                String nonMatched = str.substring(nonMatchCntr, m.start());
                dregsNodes.add(new DregsNode(nonMatched, false));
                nonMatchCntr = m.end();
            }
            String matched = str.substring(m.start(), m.end());
            dregsNodes.add(new DregsNode(matched,true));
            endOfMatchCntr = m.end();
        }
        if (endOfMatchCntr != str.length() && dregsNodes.size() >= 1){
            String last = str.substring(endOfMatchCntr, str.length());
            dregsNodes.add(new DregsNode(last,false));
        }
    }

    public ArrayNode outputJSON(){
        ArrayNode json = new ArrayNode(JsonNodeFactory.instance);
        for (DregsNode n : dregsNodes) {
            ObjectNode node = Json.newObject();
            node.put("value", n.getValue());
            node.put("isMatch", n.isMatch());
            json.add(node);
        }
        return json;
    }

    public String outputHtml(){
        String html = "";
        for (DregsNode d : dregsNodes){
            String outputReady = StringUtils.replaceEach(d.getValue(), new String[]{"&", "\"", "<", ">", " "}, new String[]{"&amp;", "&quot;", "&lt;", "&gt;", "&nbsp;"}) ;
            if (d.isMatch()){
                html += "<span class=\"match\">" + outputReady + "</span>";
            }
            else {
                html += outputReady;
            }
        }
        return html;
    }

}

