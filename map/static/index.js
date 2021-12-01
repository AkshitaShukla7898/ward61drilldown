import { select, geoMercator, geoPath, zoom } from 'd3';
const svg = select('svg');
const transitionDuration = 500;
const width = document.body.clientWidth;
const height = document.body.clientHeight;
console.log(width,height)
let active = d3.select(null);
svg.attr('width', width).attr('height', height)
const g = svg.append('g');
//const mercator = geoMercator().scale(20000).translate([width/2, height/2]).center([73,19.7]);
var mercator = d3 .geoMercator() .scale(1);
const pathGenerator = geoPath().projection(mercator);
//Zoom
  let zzoom = d3.zoom().scaleExtent([1, 2]).on("zoom", zoomed);

  function zoomed() {
  g.style("stroke-width", 1 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform); // updated for d3 v4
}
//makemap
const makemap = (geojson) => {
  	let path = g.selectAll('path').data(geojson)
								.enter().append('path')
  							.attr('d',pathGenerator)
    						.attr('class','boundary')
  //zoomToBoundingBox
  const zoomToBoundingBox = d => {
  let bounds = pathGenerator.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(10, .81/ Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
    svg.transition().duration(transitionDuration).call(
  	zzoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale)
    );

  }
  //clicked
	const clicked = d =>{
d3.json('static/cluster.json').then(projectGeoJSON =>{
var scaleCenter = calculateScaleCenter(projectGeoJSON);
mercator.scale(scaleCenter.scale) .center(scaleCenter.center) .translate([width / 2, height / 2]);
let projectgeojson = projectGeoJSON.features;
  console.log(d);
  zoomToBoundingBox(d);
	let selectedBlock = d.properties.region;
  let selectedjson = selectMap(projectgeojson,selectedBlock);
  g.selectAll("*").remove();
  makemap(selectedjson)
})

	}

  path.on('click',clicked)
}

//selectmap
const selectMap = (geojson,location) => {
  		let selection = [];
  		geojson.forEach( sel =>{
      	if (sel.properties.region == location){
        	selection.push(sel);
        }
      });
  		return selection;
}


d3.json('static/region.json').then(json =>{
  console.log(json)
  var scaleCenter = calculateScaleCenter(json);
  mercator.scale(scaleCenter.scale) .center(scaleCenter.center) .translate([width / 2, height / 2]);
  makemap(json.features)
  d3.select('button').on('click',function(){
  g.selectAll("*").remove();
  svg.transition().duration(transitionDuration).call( zzoom.transform, d3.zoomIdentity );
  makemap(json.features);
})
})

const readGeoJSON = (filename) => {
  let a;
let json = d3.json(`${filename}`).then(json =>{
  a=  json.features;
})
console.log(a);
}

let features = readGeoJSON('static/cluster.json');

function calculateScaleCenter(features) {
 var bbox_path = pathGenerator.bounds(features),
 scale = 0.95 / Math.max( (bbox_path[1][0] - bbox_path[0][0]) / width, (bbox_path[1][1] - bbox_path[0][1]) / height ); var bbox_feature = d3.geoBounds(features), center = [ (bbox_feature[1][0] + bbox_feature[0][0]) / 2, ((bbox_feature[1][1] + bbox_feature[0][1]) / 2)]; return { 'scale': scale, 'center': center }; }


