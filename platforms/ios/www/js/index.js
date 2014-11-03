window.onload = function() {
  app.initialize();
};

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();

    // create paper
    var colorHeight = $(window).height() - $('#colors').height() - $('#bottom-bar').height();
    $('#color-buttons').height(colorHeight);
    this.paper = Raphael('color-buttons', $('#color-buttons').width(), colorHeight);

    this.newRound();
  },

  paper: null,
  circles: [],
  currentColor: {
    rgb: {
      r: 0,
      g: 0,
      b: 0
    },
    hex: ''
  },
  numberOfCircles: 4,

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    console.log('Received Event: ' + id);
  },

  newRound: function() {
    var colorsArr = [];

    for (var i = 0; i < this.numberOfCircles; i++) {
      colorsArr.push(this.randomHexColor());
    }

    this.currentColor = {
      rgb: this.hexToRgb(colorsArr[0]),
      hex: colorsArr[0]
    };

    colorsArr = this.shuffleArray(colorsArr);

    this.createCircles(colorsArr);
    this.updateColorHeaders();
  },

  // colorsArr: array of hex color strings (should be 4)
  createCircles: function(colorsArr) {
    this.circles = [];
    var innerBoxRatio = (100 - 40/3) / 100; // 86.666%

    // calculate size of box to draw circles inside
    var smallerSize = (this.paper.width > this.paper.height) ? this.paper.height : this.paper.width;
    var innerBoxSize = smallerSize * innerBoxRatio;
    var xPaddingSize = (this.paper.width - innerBoxSize) / 2;
    var yPaddingSize = (this.paper.height - innerBoxSize) / 2;

    // calculate the radius of the circles, then get the inner size and the border size
    var fullRadius = innerBoxSize * .2;
    var baseRadius = fullRadius * .85;
    var strokeWidth = fullRadius * .15;

    // create 4 circles
    for (var i = 0; i < this.numberOfCircles; i++) {
      var x, y;
      var wider = (this.paper.width > this.paper.height);
      switch(i) {
        case 0: // top
          x = this.paper.width / 2;
          y = yPaddingSize + fullRadius;
          break;
        case 1: // right
          x = this.paper.width - xPaddingSize - fullRadius;
          y = this.paper.height / 2;
          break;
        case 2: // bottom
          x = this.paper.width / 2;
          y = this.paper.height - yPaddingSize - fullRadius;
          break;
        case 3: // left
          x = xPaddingSize + fullRadius;
          y = this.paper.height / 2;
          break;
      }

      var circle = this.paper.circle(x, y, baseRadius);
      circle.attr('fill', colorsArr[i]);
      circle.attr('stroke', this.changeLuminance(colorsArr[i], -0.3));
      circle.attr('stroke-width', strokeWidth);
      var _this = this;
      circle.click(function(evt) {
        console.log(evt);
        var fillHex = evt.target.getAttribute('fill');
        console.log(fillHex);
        if (fillHex === _this.currentColor.hex) {
          navigator.notification ? navigator.notification.alert('Nice work.', function(){}, 'Correct!') : alert('correct');
          _this.newRound();
        } else {
          navigator.notification ? navigator.notification.alert('Try again.', function(){}, 'Incorrect') : alert('incorrect');
        }
      })
      this.circles.push(circle);
    }
  },

  updateColorHeaders: function() {
    $('#colors-red .value').text(this.currentColor.rgb.r);
    $('#colors-green .value').text(this.currentColor.rgb.g);
    $('#colors-blue .value').text(this.currentColor.rgb.b);
  },

  // helper functions
  changeLuminance: function(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = '#', c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ('00'+c).substr(c.length);
    }

    return rgb;
  },

  randomHexColor: function() {
    return '#000000'.replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)});
  },

  rgbToHex: function(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  hexToRgb: function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {};
  },

  shuffleArray: function(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
};