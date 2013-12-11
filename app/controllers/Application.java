package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render("DREGS! a Java regular expression editor"));
    }

    public static Result test() {
        return ok(test.render());
    }

}
