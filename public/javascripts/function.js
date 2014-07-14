var show=true;
$(function() {
    $( ".right-container" ).resizable();
  });
function openClose(){
    if (show){
        $("#proposalLibrary").hide("slide", { direction: "right" }, 1000);
        $("#tabLibrary").animate({"left":"85%"},1000);
    }else{
        $("#proposalLibrary").show("slide", { direction: "right" }, 1000);
        $("#tabLibrary").animate({"left":"0px"},1000);
    }
    show= !show;
};
