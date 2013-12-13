package controllers;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.*;

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
            models.Dregs dregs = new models.Dregs(searchStr, regex);
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
        return TODO;
    }
}
