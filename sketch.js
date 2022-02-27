let geodata;
let roads;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

// let mousepos;
// let center;
// let mousedir;
// let mousehdg;

let sunriseHdg;
let sunriseDir;
let centerCoords;
let counter = 0;
function preload() {
  geodata = loadJSON("lucerne-roads.geojson");
}

let slider;

let startDate = new Date(2022, 0, 1);
console.log('startDate', startDate);
let endDate = new Date(2022, 11, 31);
console.log('endDate', endDate);
let timeScale = d3.scaleLinear().domain([0, 365]).range([startDate, endDate]);

let currentDate = timeScale(0);
console.log('currentDate', currentDate)

function setup() {
  createCanvas(900, 650);
  angleMode(DEGREES);
  centerCoords = createVector(8.309307, 47.050167);
  slider = createSlider(0, 365, 0)
  slider.position(10, 10);
  slider.changed(function () {

    currentDate = timeScale(slider.value());
    console.log('currentDate', currentDate)
    calcSunDir();
    redraw();
  })
  currentDate = timeScale(slider.value());
  calcSunDir();



  roads = geodata.features;
  console.log(roads);

frameRate(3);

//  noLoop();
}

function draw() {
  background(0);

  counter++;
  if(counter>365){
    counter = 0;
  }
  currentDate = timeScale(counter);
  calcSunDir();

  let cx = map(centerCoords.x, bounds.left, bounds.right, 0, width);
  let cy = map(centerCoords.y, bounds.bottom, bounds.top, height, 0);
  let center = createVector(cx, cy);
  fill(255);
  ellipse(cx, cy, 10, 10);
  let p2 = p5.Vector.add(center, sunriseDir);

  ellipse(p2.x, p2.y, 10, 10);
  stroke(255);
  line(cx, cy, p2.x, p2.y);


  noStroke();
  fill(255);
  text(currentDate, 100, 100);



  for (let i = 0; i < roads.length; i++) {
    let coordinates = roads[i].geometry.coordinates;

    stroke(0)
    for (let j = 0; j < coordinates.length - 1; j++) {
      let lon1 = coordinates[j][0];
      let lat1 = coordinates[j][1];
      let lon2 = coordinates[j + 1][0];
      let lat2 = coordinates[j + 1][1];


      let x1 = map(lon1, bounds.left, bounds.right, 0, width);
      let y1 = map(lat1, bounds.bottom, bounds.top, height, 0);
      let x2 = map(lon2, bounds.left, bounds.right, 0, width);
      let y2 = map(lat2, bounds.bottom, bounds.top, height, 0);

      let p1 = createVector(x1, y1);
      let p2 = createVector(x2, y2);
      let dir = p5.Vector.sub(p1, p2);
      let dir2 = p5.Vector.sub(p2, p1);
      //  console.log(dir.heading())

      // let hdg = dir.heading()+90;

      let theta = dir.angleBetween(sunriseDir);
      let theta2 = dir2.angleBetween(sunriseDir);
      let eps = 5;
      //  console.log('theta',theta,theta2)

      if (abs(theta) < eps || abs(theta2) < eps) {
        stroke(255, 255, 0, 100);
        strokeWeight(2);

      }
      else {
        stroke(255, 30);
        strokeWeight(1)
      } line(x1, y1, x2, y2);


      //   if(hdg>-80 && hdg<mousehdg+10){
      //     stroke(255,255,0,100);
      //     strokeWeight(2);
      //   }
      //   else{
      //     stroke(255,30);
      //     strokeWeight(1)
      //   }



    }

  }

  // stroke(255,0,0);
  // line(mousepos.x,mousepos.y,center.x,center.y);
}

function keyTyped() {
  console.log("saving...");
  saveCanvas("meinsdchoenesluzern", "png");
  console.log("done");
}

// function mouseMoved(){
//   mousepos.set(mouseX,mouseY);
//   mousedir = p5.Vector.sub(mousepos,center);
//   mousehdg = mousedir.heading()+90;
//   redraw();
// }


function calcSunDir() {
  var times = SunCalc.getTimes(currentDate, centerCoords.y, centerCoords.x);
  var sunrisePos = SunCalc.getPosition(times.sunrise, centerCoords.y, centerCoords.x);
  console.log('times', times);
  console.log('sunrisePos', sunrisePos);

  var sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;
  sunriseHdg = degrees(sunrisePos.azimuth)
  sunriseDir = createVector(100, 0);
  console.log('initial headinng', sunriseDir.heading())
  sunriseDir.rotate(sunriseHdg - 90);
  console.log('new headinng', sunriseDir.heading())
  // sunriseDir.rotate(-180)

  console.log('sunriseAzimuth', sunriseAzimuth, degrees(sunrisePos.azimuth), sunriseHdg);

}
