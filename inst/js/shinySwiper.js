console.log("javascript is loaded");
class swiprCard{
    constructor(id){
        console.log("initializing card with id", id);
        this.id = id;
        this.card = $("#"+id);
        this.count = 0;

        //watch for swipe on the card we are looking at.
        this.card.swipe({
            swipe: this.swiped.bind(this)
        })
    }

    swiped(event, direction, distance, duration, fingerCount, fingerData){
        console.log(direction);
        var send_dest = this.id + "-cardSwiped";
        //send the decision to shiny, include count so repete swipes
        //dont get ignored.
        Shiny.onInputChange(send_dest, this.count + "-" + direction);

        //add css class to card to trigger animation.
        this.card.addClass("swipe-" + direction);

        //increment our count upward. 
        this.count++
        window.setTimeout(() => this.card.removeClass("swipe-" + direction), 2000)
    }
}

$(document).on('shiny:connected', event => {
    console.log("shiny is connected.")

    var cards = []; //an array in case we have more than one card.

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initializeCard",
        cardID => {
            var newCard = new swiprCard(cardID);
            cards.push(newCard); //store new card.
        }
    );


})
// $(function() {
//   // //scroll by using the sides.
//   //  var fixed = document.getElementById('swipeCard');
//   //  fixed.addEventListener('touchmove', function(e) {
//   //          e.preventDefault();
//   //  }, false);
//
//
//
//  //  //Grabs the latest paper from the server and displays it to our card.
//  //  Shiny.addCustomMessageHandler("initializeCard",
//  //   function(message) {
//  //     console.log(message);
//  //   }
//  // );
//  //
//  //  //a function to replace the value of the card
//  //  function set_card(title_text, abstract_text){
//  //      var swipeCard = $("#swipeCard");
//  //      var title = $("#cardTitle");
//  //      var abstract = $("#cardAbstract");
//  //      title.text(title_text);
//  //      abstract.text(abstract_text);
//  //      //bring the card back to the middle.
//  //      swipeCard.removeClass();
//  //  }
//  //
//  //  $("#swipeCard").swipe( {
//  //      //Generic swipe handler for all directions
//  //      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
//  //        console.log("we got a swipe");
//  //        var swipeCard = $("#swipeCard");
//  //        var decision = null;
//  //        switch (direction) {
//  //              case "up":
//  //                decision = "exciting and questionable";
//  //                decision_icon = "<i class = 'fa fa-volume-up fa-5x' aria-hidden='true'></i>";
//  //                swipeCard.addClass("swipe-up");
//  //                break;
//  //              case "down":
//  //                decision = "boring and correct";
//  //                decision_icon = "<i class = 'fa fa-check fa-5x' aria-hidden='true'></i>"
//  //                swipeCard.addClass("swipe-down");
//  //                break;
//  //              case "right":
//  //                decision = "exciting and correct";
//  //                decision_icon = "<i class = 'fa fa-star fa-5x' aria-hidden='true'></i>"
//  //                swipeCard.addClass("swipe-right");
//  //                choice = ""
//  //                break;
//  //              case "left":
//  //                decision = "boring and questionable";
//  //                decision_icon = "<i class = 'fa fa-trash fa-5x' aria-hidden='true'></i>"
//  //                swipeCard.addClass("swipe-left");
//  //                break;
//  //              default:
//  //                decision = "initializing";
//  //                console.log(direction);
//  //                return; //kill the process so we dont go anywhere.
//  //            }
//  //
//  //        //send decision to R.
//  //        Shiny.onInputChange("cardSwiped", decision);
//  //
//  //
//  //        //wait one second and then reset the card position
//  //        window.setTimeout(() => {
//  //
//  //          //reset to deciding so we dont trip up the change detection
//  //          Shiny.onInputChange("cardSwiped", "deciding");
//  //
//  //          //bring the card back to the middle.
//  //          //swipeCard.removeClass();
//  //
//  //        }
//  //          , 1000);
//  //
//  //      } //end of swipe: function(...)
//  //
//  //      });
//  //
//  //
//  //    //wait one second and Kick off stuff by sending an initialized message to R.
//  //    window.setTimeout(() =>  Shiny.onInputChange("cardSwiped", "initializing"), 1000);
//  //
//  //   //On mobile when a user tries to swipe up or down they simply get moved around the page. We change//
//    //make it such that when they scroll over the card we disable page scrolling. They will still be able
//
//
// });
