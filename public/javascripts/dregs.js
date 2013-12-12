
Dregs = {

  //attributes
  
  lastMsgOut: 0,
  inputBgColor: "#ffeedd",
  alertColor: "#ff9898",
  regexInputElement: $("#regex"),
  resultsElement: $("#results"),


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

  backslashesOK: function () {
     if ($("#allowUnescaped").is(':checked')){
        return true;
     }
      regexStr =  $("#regex").val();
      var i=0;
      while (i < regexStr.length) {
          if (regexStr.charAt(i) == "\\") {
              if (regexStr.charAt(i+1) == "\\") {
                   i += 2;
              } else {
                    return false;
              }
          } else {
              i++;
          }
      }
      return true;
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

  processInput: function() {
    if (!this.backslashesOK()) {
        this.regexInputAlert();
        return;
    } else {
        this.regexInputOk();
        if ($("#regex").val().length==0 || $("#test").val().length==0) {
            this.resultsOk();
            $("#results").html("<br /><br />");
            return;
        } else {
            this.sendToServer();
            return;
        }
    }
  },

  sendToServer: function() {
      _Dregs = this;
      msg = new Object();
      msg.searchStr = $("#test").val();
      msg.regexStr = this.getRegexStr();
      msg.msgIndex = ++this.lastMsgOut;
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
  },

    handleSuccessfulResponse: function( data, textStatus, jqXHR ){
      if (data.msgIndex == this.lastMsgOut){
          responseHtml = data.responseHtml;
          this.resultsOk();
          if (responseHtml == "" || responseHtml == null){
              $("#results").html("<br/><br />");
          } else {
              $("#results").html(responseHtml);
          }
      } else {
          console.log("too slow: " + data.msgIndex);
      }

    },

    handleErringResponse: function( jqXHR, textStatus, errorThrown ){
      this.resultsAlert();
      $("#results").html(jqXHR.responseJSON.responseHtml);
    }

};


/*
wire up the Dregs object to some DOM listeners,
enable tooltip(s)
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

  $("#allowUnescapedLabel").tooltip({
    delay: { show: 500, hide: 100 }
  });

});
