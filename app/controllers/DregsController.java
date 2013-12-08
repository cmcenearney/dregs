package controllers;

import org.codehaus.jackson.JsonNode;
import play.*;
import play.api.templates.Html;
import play.mvc.*;

import views.html.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class DregsController extends Controller {

    @BodyParser.Of(BodyParser.Json.class)
    public static Result processDregs(){
        JsonNode json = request().body().asJson();
        String str = json.findPath("searchString").getTextValue();
        String regexStr = json.findPath("regex").getTextValue();
        try {
            Pattern regex = Pattern.compile(regexStr);
            models.Dregs dregs = new models.Dregs(str, regex);
            dregs.performRegex();
            return ok(String.format(dregs.outputHtml()));
        } catch (PatternSyntaxException e) {
            return badRequest(e.getMessage());
        }
        /*
        System.out.println(regexStr);
        System.out.println(regex.toString());
        models.Dregs dregs = new models.Dregs(str, regex);
        dregs.performRegex();
        String s = dregs.outputHtml();
        System.out.println(dregs.outputHtml());
        return ok(String.format(dregs.outputHtml()));
        return ok(String.format("Got it!"));
        */
    }
}
