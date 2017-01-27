var p5 = require('p5');

var sketch = function (p) {

  function getConstants() {
    return {
      SEED: Math.random(),
      POINT_LIST: setLinePoints(9),
      THETA: 12 * Math.PI * 2
    };
  }

  p.setup = function() {
    var canvas = p.createCanvas(p.displayWidth, p.displayHeight);
    p.angleMode(p.DEGREES);
    p.smooth();
  }

  p.draw = function() {
    p.background(86,66,13);
    var c = getConstants();
    p.randomSeed(123);
    var width = p.random(100, 200);
    for (var i = 0; i <= 4; ++i) {
      var center = {
              x: (300*i),
              y: width *2
            };
      width = p.random(100, 200);
      klimtCircles(center, 5, width);
    }

  }

  function setLinePoints(iterations) {
    var pointList = {};
    pointList.first = {x:0, y:1};
    var lastPoint = {x:1, y:1}
    var minY = 1;
    var maxY = 1;
    var point;
    var nextPoint;
    var dx, newX, newY;

    pointList.first.next = lastPoint;
    for (var i = 0; i < iterations; i++) {
      point = pointList.first;
      while (point.next != null) {
        nextPoint = point.next;

        dx = nextPoint.x - point.x;
        newX = 0.5*(point.x + nextPoint.x);
        newY = 0.5*(point.y + nextPoint.y);
        newY += dx*(p.random()*2 - 1);

        var newPoint = {x:newX, y:newY};

        //min, max
        if (newY < minY) {
          minY = newY;
        }
        else if (newY > maxY) {
          maxY = newY;
        }

        //put between points
        newPoint.next = nextPoint;
        point.next = newPoint;

        point = nextPoint;
      }
    }

    //normalize to values between 0 and 1
    if (maxY != minY) {
      var normalizeRate = 1/(maxY - minY);
      point = pointList.first;
      while (point != null) {
        point.y = normalizeRate*(point.y - minY);
        point = point.next;
      }
    }
    //unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
    else {
      point = pointList.first;
      while (point != null) {
        point.y = 1;
        point = point.next;
      }
    }

    return pointList;
  }

  function klimtCircles(center, n, width){
    var lg_rad = (width/2);               // large radius
    var lg_circ = 2 * Math.PI * lg_rad;             // large circumference
    var rad = (lg_circ / n)/2;
    p.noStroke();

    var color = p.color(132,107,43);  // Define color 'c'
    p.fill(color);  // Use color variable 'c' as fill color

    drawCircle(center.x, center.y, lg_rad * 2, lg_rad * 2 - 10);

    var colors = [
    p.color(36,83,67),
    p.color(146,236,209),
    p.color(14,36,50)];

    for (var i = 1; i <= n; ++i) {
      p.fill(colors[i%3]);  // Use color variable 'c' as fill color
      var angle = i * 2 * Math.PI/n;
      var x = center.x + Math.cos(angle) * (lg_rad) + p.random(0,8);
      var y = center.y + Math.sin(angle) * (lg_rad) + p.random(0,8);
      drawCircle(x, y, rad, rad-10);
    }
  }


  function drawCircle(centerX, centerY, minRad, maxRad) {
    var point;
    var rad;
    var twoPi = 2*Math.PI;
    var x0,y0;
    var c = getConstants();
    var theta = c.THETA;

    point = c.POINT_LIST.first;
    rad = minRad + point.y*(maxRad - minRad);
    x0 = centerX + rad*Math.cos(theta);
    y0 = centerY + rad*Math.sin(theta);
    p.beginShape();
    while (point.next != null) {
      point = point.next;
      theta = twoPi*point.x + c.THETA;
      rad = minRad + point.y*(maxRad - minRad);
      x0 = centerX + rad*Math.cos(theta);
      y0 = centerY + rad*Math.sin(theta);
      p.vertex(x0, y0);
    }
    p.endShape(p.CLOSE);
  }

  p.mousePressed = function () {
      var fs = p.fullscreen();
      p.fullscreen(!fs);
  };
}
new p5(sketch);
