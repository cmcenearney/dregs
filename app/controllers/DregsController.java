package controllers;

import com.avaje.ebean.Ebean;
import models.Dregs;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.*;
import views.html.index;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class DregsController extends Controller {

    @BodyParser.Of(BodyParser.Json.class)
    public static Result processDregs(){
        JsonNode json = request().body().asJson();
        String searchStr = json.findPath("searchStr").getTextValue();
        String regexStr = json.findPath("regexStr").getTextValue();
        Integer msgIndex;
        try {
            msgIndex = json.findPath("msgIndex").asInt();
        } catch (Exception e) {
            msgIndex = -1;
            e.printStackTrace();
        }

        ObjectNode result = Json.newObject();
        result.put("msgIndex", msgIndex);

        try {
            Pattern regex = Pattern.compile(regexStr);
            Dregs dregs = new models.Dregs(searchStr, regex);
            dregs.performRegex();
            result.put("responseHtml", dregs.outputHtml());
            result.put("dregsNodes", dregs.outputJSON());
            return ok(result);
        } catch (PatternSyntaxException e) {
            result.put("errorMessage", e.getMessage());
            return badRequest(result);
        }

    }

    public static Result retrieve(Long id){
        Dregs fetched = Ebean.find(Dregs.class, id);
        Dregs dregs = new Dregs(fetched.str, fetched.regexString);
        dregs.performRegex();
        return ok(index.render("We've been keeping your Dregs lukewarm for you!", Dregs.escapeBackslashes(dregs.regexString), Dregs.escapeBackslashes(dregs.str), dregs.outputHtml()));
    }

    public static Result saveDregs(){
        JsonNode json = request().body().asJson();
        String searchStr = json.findPath("searchStr").getTextValue();
        String regexStr = json.findPath("regexStr").getTextValue();
        Integer msgIndex = json.findPath("msgIndex").asInt();
        Dregs dregs = new Dregs(searchStr, regexStr);
        dregs.save();
        String savedURI =  "/dregs/" + dregs.id;
        ObjectNode result = Json.newObject();
        result.put("msgIndex", msgIndex);
        result.put("savedURI",savedURI);
        return ok(result);
    }
}
