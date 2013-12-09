$("#regex").keyup(function(event) {
  leapIntoAction();
});

$("#test").keyup(function(event) {
  leapIntoAction();
});

$('input[name=allowUnescaped]').change(function(){
  leapIntoAction();
});

function leapIntoAction(){
  if ( $("#allowUnescaped").is(':checked') ) {
    backslashOk();
    passTheDregs( $("#regex").val() );
  } else {
    if ( $("#regex").val().length == 0 ) {
        backslashOk();
        resultsOk();
        $("#results").html("<br />");
    }
    else if (getEscapedRegex() != "") {
        backslashOk();
        passTheDregs(getEscapedRegex());
    }
    else {
        backslashNoGuut();
    }
  }
};

function backslashOk() {
    $("#regex").css( "background-color", "#ffeedd" )
};

function backslashNoGuut() {
    $("#regex").css( "background-color", "#ff9898" )
};

function resultsOk() {
    $("#results").css( "background-color", "#ffeedd" )
};

function resultsNoGuut() {
    $("#results").css( "background-color", "#ff9898" )
};

function passTheDregs(regexStr) {
      dregs = new Object();
      dregs.searchString = $("#test").val();
      dregs.regex = regexStr;
      if (dregs.searchString.length==0 || dregs.regex.length==0) {
      $("#results").html("<br />");
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
