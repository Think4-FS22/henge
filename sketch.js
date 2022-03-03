let geodata;
let roads;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

// let bounds = {
//   left: 7.438,
//   top: 46.9523,
//   right: 7.4613,
//   bottom: 46.9411,
// };

// let center = {
//   lat: 47.050167,
//   lon: 8.309307,
// };

let center = {
  lon: bounds.left + 0.5 * (bounds.right - bounds.left),
  lat: bounds.bottom + 0.5 * (bounds.top - bounds.bottom),
};

// let sunriseHdg;
let sunDir;
// let centerCoords;
let counter = 0;
function preload() {
  geodata = loadJSON("lucerne-roads.geojson");
}

let slider;

let startDate = new Date(2022, 0, 1);
let endDate = new Date(2022, 11, 31);

let timeScale = d3.scaleLinear().domain([0, 365]).range([startDate, endDate]);

function setup() {
  createCanvas(900, 650);
  angleMode(DEGREES);
  //  centerCoords = createVector(8.309307, 47.050167);
  slider = createSlider(0, 365, 0, 1);
  slider.position(10, 10);
  slider.changed(updateDate);
  currentDate = timeScale(slider.value());
  // calcSunDir();

  roads = geodata.features;
  console.log(roads);

  frameRate(3);

  sunDir = calcSunVector(currentDate, center.lon, center.lat);

  noLoop();
}

function draw() {
  background(0);

  let cx = map(center.lon, bounds.left, bounds.right, 0, width);
  let cy = map(center.lat, bounds.bottom, bounds.top, height, 0);
  let centerPoint = createVector(cx, cy);
  fill(255);
  ellipse(cx, cy, 10, 10);
  let sunpos = p5.Vector.add(centerPoint, sunDir);

  fill(255, 255, 0);
  ellipse(sunpos.x, sunpos.y, 10, 10);
  stroke(255);
  line(cx, cy, sunpos.x, sunpos.y);

  noStroke();
  fill(255);
  text(currentDate, 100, 100);

  for (let i = 0; i < roads.length; i++) {
    let coordinates = roads[i].geometry.coordinates;

    stroke(0);
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

      let theta = dir.angleBetween(sunDir);
      let theta2 = dir2.angleBetween(sunDir);
      let eps = 5;
      //  console.log('theta',theta,theta2)

      if (abs(theta) < eps || abs(theta2) < eps) {
        stroke(255, 255, 0, 100);
        strokeWeight(2);
      } else {
        stroke(255, 30);
        strokeWeight(1);
      }
      line(x1, y1, x2, y2);

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
  var sunrisePos = SunCalc.getPosition(
    times.sunrise,
    centerCoords.y,
    centerCoords.x
  );
  console.log("times", times);
  console.log("sunrisePos", sunrisePos);

  var sunriseAzimuth = (sunrisePos.azimuth * 180) / Math.PI;
  sunriseHdg = degrees(sunrisePos.azimuth);
  sunriseDir = createVector(100, 0);
  console.log("initial headinng", sunriseDir.heading());
  sunriseDir.rotate(sunriseHdg - 90);
  console.log("new headinng", sunriseDir.heading());
  // sunriseDir.rotate(-180)

  console.log(
    "sunriseAzimuth",
    sunriseAzimuth,
    degrees(sunrisePos.azimuth),
    sunriseHdg
  );
}

function updateDate() {
  currentDate = timeScale(slider.value());
  console.log("currentDate", currentDate);
  // calcSunDir();
  sunDir = calcSunVector(currentDate, 8.309307, 47.050167);

  redraw();
}

function calcSunVector(date, lon, lat) {
  console.log("calcSunVector");
  var times = SunCalc.getTimes(date, lat, lon);
  var sunPos = SunCalc.getPosition(times.sunrise, lat, lon);
  console.log("times", times);
  console.log("sunPos", sunPos);
  var sunAzimuth = (sunPos.azimuth * 180) / Math.PI;

  // var sunriseAzimuth = (sunrisePos.azimuth * 180) / Math.PI;
  let sunHdg = degrees(sunPos.azimuth);
  let sunDir = createVector(100, 0);
  console.log("initial headinng", sunDir.heading());
  sunDir.rotate(sunHdg - 90);
  console.log("new headinng", sunDir.heading());
  // sunriseDir.rotate(-180)

  console.log("sunriseAzimuth", sunAzimuth, degrees(sunPos.azimuth), sunHdg);
  return sunDir;
}
