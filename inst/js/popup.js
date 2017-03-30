class popupCard{
  constructor(id){
    //select the two elements that we add with the module
    this.background_cover = $("#background_cover");
    this.popup = $(".popup");

    //unhide them
    this.background_cover.removeClass("hidden");
    this.popup.removeClass("hidden");

    //grab the apps page height
    this.page_height = $(window).height();
    //and use it to size the divs to the right height.
    this.background_cover.height(this.page_height);
    this.popup.css({ "top": this.page_height*0.10 });
  } //end constructor

    kill(){
      this.popup.remove();
      this.background_cover.remove();
    }
}

$( document ).on('shiny:connected', event => {
  var warningPopup;
  //make sure we can't see the popup initially.
  $("#background_cover").hide();
  $(".popup").hide();

  //watch for message from server saying it's ready.
  Shiny.addCustomMessageHandler("initialize_popup",
      x => {
        console.log("message to initialize received");
        $("#background_cover").show();
        $(".popup").show();
        warningPopup = new popupCard("testing");

        //delete the popup when we get the message from the server to do so.
        Shiny.addCustomMessageHandler("killPopup",
          message => { warningPopup.kill(); }
        );
      }
  );

});


