let geodata;
let roads;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

let mousepos;
let center;
let mousedir;
let mousehdg;

function preload() {
  geodata = loadJSON("lucerne-roads.geojson");
}

function setup() {
  createCanvas(900, 650);

  
  center = createVector(width/2,height/2);
  mousepos = createVector(mouseX,mouseY);
  roads = geodata.features;
  console.log(roads);

  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(0);

  for(let i=0; i<roads.length; i++){
    let coordinates = roads[i].geometry.coordinates;

    stroke(0)
    for(let j=0; j<coordinates.length-1; j++){
      let lon1 = coordinates[j][0];
      let lat1 = coordinates[j][1];
      let lon2 = coordinates[j+1][0];
      let lat2 = coordinates[j+1][1];


      let x1 = map(lon1,bounds.left,bounds.right,0,width);
      let y1 = map(lat1,bounds.bottom,bounds.top,height,0);
      let x2 = map(lon2,bounds.left,bounds.right,0,width);
      let y2 = map(lat2,bounds.bottom,bounds.top,height,0);

      let p1 = createVector(x1,y1);
      let p2 = createVector(x2,y2);
      let dir = p5.Vector.sub(p1,p2);
    //  console.log(dir.heading())

    let hdg = dir.heading()+90;
    
      if(hdg>mousehdg-10 && hdg<mousehdg+10){
        stroke(255,255,0,100);
        strokeWeight(2);
      }
      else{
        stroke(255,30);
        strokeWeight(1)
      }
      
      line(x1,y1,x2,y2);
    
    }
    
  }

  stroke(255,0,0);
  line(mousepos.x,mousepos.y,center.x,center.y);
}

function keyTyped() {
  console.log("saving...");
  saveCanvas("meinsdchoenesluzern", "png");
  console.log("done");
}

function mouseMoved(){
  mousepos.set(mouseX,mouseY);
  mousedir = p5.Vector.sub(mousepos,center);
  mousehdg = mousedir.heading()+90;
  redraw();
}
