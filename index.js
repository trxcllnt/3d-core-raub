'use strict';

const webgl = require('node-webgl-raub');
const doc   = webgl.document();
doc.body    = doc; // web-libs compatibility issues

const canvas = doc.createElement('canvas', 800, 600, false);

const gl = canvas.getContext('webgl');
if ( ! gl ) {
	throw new Error("Could not initialise WebGL, sorry :-(");
}

// Hack for three.js, remove precision from shader
var parentShaderSource = gl.shaderSource;
gl.shaderSource = function( shader, string ) {
	if ( ! /^.*?\#version.*?$/m.test(string) ) {
		string = '#version 100\n' + string;
	}
	return parentShaderSource(shader, string);
};

gl.viewportWidth = canvas.width;
gl.viewportHeight = canvas.height;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

global.document = doc;
global.window   = doc;
global.cwrap    = null;

const three = require('node-threejs-raub');


const renderer = new three.WebGLRenderer({
	
	antialias: true,
	canvas   : canvas,
	alpha    : true,
	
	premultipliedAlpha    : true,
	preserveDrawingBuffer : true,
	logarithmicDepthBuffer: true,
	
});
renderer.setSize(canvas.width, canvas.height, false);

doc.on('resize', () => {
	
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	
	renderer.setSize(canvas.width, canvas.height) ;
	
});

const loadTexture = (url, onLoad, onProgress, onError) => {
	const cb = tex => {
		tex.format = three.RGBAFormat;
		if (onLoad) {
			onLoad(tex);
		}
	};
	return (new three.TextureLoader()).load(url, cb, onProgress, onError);
};

module.exports = {
	webgl,
	doc,
	document: doc,
	canvas,
	gl,
	context: gl,
	three,
	loadTexture,
	renderer,
	frame: doc.requestAnimationFrame,
	requestAnimationFrame: doc.requestAnimationFrame,
};
