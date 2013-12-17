Dregs = {

  //attributes

  lastMsgOut: 0,
  inputBgColor: "#ffeedd",
  alertColor: "#ff9898",
  regexInputElement: $("#regex"),
  resultsElement: $("#results"),
  allowUnescaped: false,

  //methods

  setRegexInputAlert: function() {
    this.regexInputElement.css("background-color", this.alertColor);
  },

  setRegexInputOk: function() {
    this.regexInputElement.css("background-color", this.inputBgColor);
  },

  setResultsAlert: function() {
    this.resultsElement.css("background-color", this.alertColor);
  },

  setResultsOk: function() {
    this.resultsElement.css("background-color", this.inputBgColor);
  },

  backslashesOK: function() {
    if ( this.allowUnescaped ) {
      return true;
    }
    regexStr = $("#regex").val();
    var i = 0;
    while (i < regexStr.length) {
      if (regexStr.charAt(i) == "\\") {
        if (regexStr.charAt(i + 1) == "\\") {
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
    regexStr = $("#regex").val();
    if (!$("#allowUnescaped").is(':checked')) {
      var i = 0;
      var escapedRegex = "";
      while (i < regexStr.length) {
        var char = regexStr.charAt(i);
        escapedRegex += char;
        if (char == "\\") {
          if (regexStr.charAt(i + 1) == "\\") {
            i += 2;
          } else {
            return "";
          }
        } else {
          i++;
        }
      }
      return escapedRegex;
    } else {
      return regexStr;
    }
  },

  processInput: function() {
    this.allowUnescaped = $("#allowUnescaped").is(':checked');
    if (!this.backslashesOK()) {
      this.setRegexInputAlert();
      return;
    } else {
      this.setRegexInputOk();
      if ($("#regex").val().length == 0 || $("#test").val().length == 0) {
        this.setResultsOk();
        $("#results").html("<br /><br />");
        return;
      } else {
        this.sendToServer();
        return;
      }
    }
  },

  sendToServer: function(url) {
    if (url == null ) {
        url = "/dregs";
    }
    _Dregs = this;
    msg = new Object();
    msg.searchStr = $("#test").val();
    msg.regexStr = this.getRegexStr();
    msg.msgIndex = ++this.lastMsgOut;
    msg.allowUnescaped =  this.allowUnescaped;
    $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(msg),
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        _Dregs.handleSuccessfulResponse(data, textStatus, jqXHR);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        _Dregs.handleErringResponse(jqXHR, textStatus, errorThrown);
      }
    });
  },

  handleSuccessfulResponse: function(data, textStatus, jqXHR) {
    if (data.msgIndex == this.lastMsgOut) {
      if (data.savedURI != null) {
        uri = location.origin + data.savedURI;
        $("#saved").html("These Dregs have been saved and can be viewed at: <a href='" + uri + "'>" + uri + "</a>");
        $("#saveButton").blur();
      } else {
        responseHtml = data.responseHtml;
        this.setResultsOk();
        if (responseHtml == "" || responseHtml == null) {
          $("#results").html("<br/><br />");
        } else {
          $("#results").html(responseHtml);
        }
      }
    } else {
      console.log("too slow: " + data.msgIndex);
    }

  },

  handleErringResponse: function(jqXHR, textStatus, errorThrown) {
    this.setResultsAlert();
    $("#results").html(jqXHR.responseJSON.errorMessage);
  },

  save: function() {
      this.sendToServer("/dregs/save");
  }


};


/*
wire up the Dregs object to some DOM listeners,
enable tooltip(s)
*/
$(document).ready(function() {

  $("#regex").keyup(function(event) {
    Dregs.processInput();
  });

  $("#test").keyup(function(event) {
    Dregs.processInput();
  });

  $('input[name=allowUnescaped]').change(function() {
    Dregs.processInput();
  });

  $("#saveButton").click(function(event) {
    Dregs.save();
  });

  $("#allowUnescapedLabel").tooltip({
    delay: {
      show: 500,
      hide: 100
    }
  });

});