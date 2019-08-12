'use strict';

const Cloud = require('./cloud');


class Tris extends Cloud {
	
	
	constructor(opts) {
		
		super(opts);
		
	}
	
	
	buildFrag(opts) {
		return opts.frag || `
			varying vec3  varColor;
			varying vec2  varTcoord;
			varying float varSize;
			
			${opts.inject && opts.inject.frag && opts.inject.frag.vars ? opts.inject.frag.vars : ''}
			
			void main() {
				
				${opts.inject && opts.inject.frag && opts.inject.frag.before ? opts.inject.frag.before : ''}
				
				gl_FragColor = vec4(varColor, 1.0);
				
				${opts.inject && opts.inject.frag && opts.inject.frag.after ? opts.inject.frag.after : ''}
				
			}
		`;
	}
	
	
	_build(opts) {
		const tris = new THREE.Mesh(this._geo(opts), this._mat(opts));
		tris.frustumCulled = false;
		return tris;
	}
	
}


module.exports = Tris;
