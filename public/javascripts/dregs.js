
Dregs = {

  //attributes
  
  lastMsgOut: 0,
  inputBgColor: "#ffeedd",
  alertColor: "#ff9898",
  regexInputElement: $("#regex"),
  resultsElement: $("#results"),
  responseBuffer: "",  //use to capture repsonse objects for debugging

  //methods
  
  regexInputAlert: function() {
    this.regexInputElement.css( "background-color", this.alertColor );
  },
  
  regexInputOk: function() {
    this.regexInputElement.css( "background-color", this.inputBgColor );
  },

  resultsAlert: function() {
    this.resultsElement.css( "background-color", this.alertColor );
  },
  
  resultsOk: function() {
    this.resultsElement.css( "background-color", this.inputBgColor );
  },

  getRegexStr: function() {
    regexStr =  $("#regex").val();
    if ( !$("#allowUnescaped").is(':checked') ) {
            var i=0;
            var escapedRegex = "";
            while (i < regexStr.length) {
                var char = regexStr.charAt(i);
                escapedRegex += char;
                if (char == "\\") {
                    if (regexStr.charAt(i+1) == "\\") {
                        i += 2;
                    } else {
                        return "";
                    }
                } else {
                    i ++;
                }
            }
            return escapedRegex;
    } else {
        return regexStr;
    }
  },

  handleSuccessfulResponse: function( data, textStatus, jqXHR ){
    // debugging:
    /*
    console.log("successful request");
    console.log(jqXHR);
    this.responseBuffer = data;
    */
    if (data.msgIndex == this.lastMsgOut){
        responseHtml = data.responseHtml;
        this.resultsOk();
        if (responseHtml == "" || responseHtml == null){
            $("#results").html("<br/>");
        } else {
            $("#results").html(responseHtml);
        }
    } else {
        console.log("too slow: " + data.msgIndex);
    }

  },

  handleErringResponse: function( jqXHR, textStatus, errorThrown ){
    // debugging:
    /*
    console.log("erring request");
    console.log(jqXHR);
    this.responseBuffer = jqXHR;
    */
    this.resultsAlert();
    $("#results").html(jqXHR.responseJSON.responseHtml);
  },

  test: function() {console.log(this.getRegexStr())},

  processInput: function() {
    _Dregs = this;
    msg = new Object();
    msg.searchStr = $("#test").val();
    msg.regexStr = this.getRegexStr();
    msg.msgIndex = ++this.lastMsgOut;
    if (msg.searchStr.length==0 || msg.regexStr.length==0) {
      $("#results").html("<br />");
      return;
    }
    $.ajax({
        url: "/dregs",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(msg),
        dataType: 'json',
        success: function( data, textStatus, jqXHR  ) {
           _Dregs.handleSuccessfulResponse( data, textStatus, jqXHR );
        },
        error: function( jqXHR, textStatus, errorThrown ) {
          _Dregs.handleErringResponse( jqXHR, textStatus, errorThrown );
        }
    });
  }

};


/*
wire up the Dregs object to some dom listeners
*/
$( document ).ready(function() {
  
  $("#regex").keyup(function(event) {
    Dregs.processInput();
  });

  $("#test").keyup(function(event) {
    Dregs.processInput();
  });

  $('input[name=allowUnescaped]').change(function(){
    Dregs.processInput();
  });

});
