HTMLWidgets.widget({

  name: 'drawr_widget',

  type: 'output',

  factory: function(el, width, height) {

    // setup holder for the chart here.
    var myDrawr;

    return {

      renderValue: function(x) {
        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);
        var domTarget = '#' + el.id;
        console.log('passed the following config', x);
        console.log('data came in like this', data);

        function finishedDrawing(drawnData) {
          var payload = drawnData.map(function(datum){return datum.y});
          if(HTMLWidgets.shinyMode) {
            console.log("shiny detected, sending to " + el.id + "_drawnData, with payload", payload);
            Shiny.onInputChange(el.id + "_drawnData",payload)
          }
        }

        myDrawr = drawr({
            domTarget: domTarget,
            data: data,
            xKey: x.xKey,
            yKey: x.yKey,
            yMin: x.yMin,
            yMax: x.yMax,
            timeX: x.timeX,
            onDoneDrawing: finishedDrawing,
            revealExtent: x.revealExtent,
            freeDraw: x.freeDraw,
            width: width,
            height: height,
            margin: { left: 50, right: 50, top: 80, bottom: 50 },
            drawLineColor: 'orangered'
        });


      },

      resize: function(width, height) {

        //re-render the widget with a new size
        myDrawr.resize({width:width, height:height});
      }

    };
  }
});
