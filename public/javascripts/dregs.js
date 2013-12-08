$("#regex").keyup(function(event) {
  if ( $("#allowUnescaped").is(':checked') ) {
    backslashOk();
    passTheDregs( $("#regex").val() );
  } else {
    if ( $("#regex").val().length == 0 ) {
        backslashOk();
        resultsOk();
        $("#results").html("<br /><br />");
    }
    else if (getEscapedRegex() != "") {
        backslashOk();
        passTheDregs(getEscapedRegex());
    }
    else {
        backslashNoGuut();
    }
  }
});

function backslashOk() {
    $("#regex").css( "background-color", "#ffffff" )
};

function backslashNoGuut() {
    $("#regex").css( "background-color", "#ff9898" )
};

function resultsOk() {
    $("#results").css( "background-color", "#ffffff" )
};

function resultsNoGuut() {
    $("#results").css( "background-color", "#ff9898" )
};

function passTheDregs(regexStr) {
      dregs = new Object();
      dregs.searchString = $("#test").val();
      dregs.regex = regexStr;
      if (dregs.searchString.length==0 || dregs.regex.length==0) {
        return;
      }
      $.ajax({
          url: "/dregs",
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(dregs),
          dataType: 'html',
          success: function( data ) {
            resultsOk();
            $("#results").html(data);
          },
          error: function( jqXHR, textStatus, errorThrown ) {
            resultsNoGuut();
            $("#results").html(jqXHR.responseText);
          }
      });
};

function getEscapedRegex() {
    regexStr =  $("#regex").val();
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
};

function areBackslashesEscaped() {
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
};

/*
onKeyPress:
  if (emulateIDE is enabled) { //this means unescaped "\" not allowed
     parse the regex and if there is an unescaped \ alert
     else if it'sfine
       send to server
  else // unescaped "\" allowed
     send to server

*/