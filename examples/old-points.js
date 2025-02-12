'use strict';

console.log('https://threejs.org/examples/#webgl_points_random');

const { Screen, init } = require('..');


const { loop, three } = init();


const screen = new Screen();

const F_KEY = 70;

screen.on('keydown', e => {
	
	if (e.keyCode === F_KEY && e.ctrlKey && e.shiftKey) {
		screen.mode = 'windowed';
	} else if (e.keyCode === F_KEY && e.ctrlKey && e.altKey) {
		screen.mode = 'fullscreen';
	} else if (e.keyCode === F_KEY && e.ctrlKey) {
		screen.mode = 'borderless';
	} else {
		return;
	}
	
});


var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = screen.width / 2;
var windowHalfY = screen.height / 2;
start();

function start() {
	
	camera = new three.PerspectiveCamera( 75, screen.width / screen.height, 1, 3000 );
	camera.position.z = 1000;
	scene = new three.Scene();
	scene.fog = new three.FogExp2( 0x000000, 0.0007 );
	geometry = new three.Geometry();
	for ( i = 0; i < 20000; i++ ) {
		var vertex = new three.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;
		geometry.vertices.push( vertex );
	}
	parameters = [
		[ [1, 1, 0.5], 5 ],
		[ [0.95, 1, 0.5], 4 ],
		[ [0.90, 1, 0.5], 3 ],
		[ [0.85, 1, 0.5], 2 ],
		[ [0.80, 1, 0.5], 1 ]
	];
	for ( i = 0; i < parameters.length; i++ ) {
		color = parameters[i][0];
		size = parameters[i][1];
		materials[i] = new three.PointsMaterial( { size: size } );
		particles = new three.Points( geometry, materials[i] );
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add( particles );
	}
	renderer = screen.renderer;
	
	screen.on('mousemove', onDocumentMouseMove);
	//
	screen.on('resize', onWindowResize);
}
function onWindowResize() {
	windowHalfX = screen.width / 2;
	windowHalfY = screen.height / 2;
	camera.aspect = screen.width / screen.height;
	camera.updateProjectionMatrix();
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}


function render() {
	var time = Date.now() * 0.00005;
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );
	for ( i = 0; i < scene.children.length; i++ ) {
		var object = scene.children[ i ];
		if ( object instanceof three.Points ) {
			object.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
		}
	}
	for ( i = 0; i < materials.length; i++ ) {
		color = parameters[i][0];
		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );
	}
	renderer.render( scene, camera );
}

loop(render);
