package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render("DREGS!"));
    }

    public static Result test() {
        return ok(test.render());
    }

}
