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

        function finishedDrawing(d) {
          console.log('done drawing', d)
        }

        // TODO: code to render the widget, e.g.
        el.innerText = 'hiya';

        myDrawr = drawr({
            domTarget: domTarget,
            data: data,
            xKey: x.xKey,
            yKey: x.yKey,
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
