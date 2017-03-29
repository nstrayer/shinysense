class popupCard{
  constructor(id){
    //we have to fudge with the css of the body a little bit to get the divs to overlay the whole screen.
    $("#container").css({"position":"relative"});
    this.page_height = $(window).height();
    this.background_cover = $("#background_cover");
    this.popup = $(".popup");

    //this.popup.height(this.page_height*0.80); //make popup 80% of page height
    this.background_cover.height(this.page_height);

    //make background semi-transparent and obscured
    this.background_cover.css({
     "width": "100%",
     "background-color": "grey",
     "margin": "0 auto",
     "position": "absolute",
     "top": "0px",
     "left": "0",
     "right": "0",
     "opacity" : 0.7,
     "z-index": "900",
     "filter" : "blur(5px)"
    });

    this.popup.css({
     "overflow": "auto",
     "border-width": "2px",
     "background-color": "white",
     "width": "75%",
     "margin": "0 auto",
     "box-shadow": "10px 10px 5px #888888",
     "z-index": "999",
     "position": "absolute",
     "top": this.page_height*0.10, //center horizontally by bringing down 10%
     "left": "0",
     "right": "0",
     "border-radius": "25px",
     "padding":"10px 25px 25px 25px",
    });
    }

    kill(){
      this.popup.remove();
      this.background_cover.remove();
    }
}

$( document ).on('shiny:connected', event => {

  //set up a new card
  var warningPopup = new popupCard("testing");

  //delete the popup when we get the message from the server to do so.
  Shiny.addCustomMessageHandler("killPopup",
    message => { warningPopup.kill(); }
  );
});


