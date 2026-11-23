import{t as e}from"./Detail-C-edZcPs.js";import{E as t,I as n,J as r,P as i,R as a,S as o,Z as s,_ as c,_t as l,b as u,ct as d,g as f,gt as p,vt as ee,w as m,x as h,y as te}from"./modules/shiki-2Iz3kJcI.js";import{et as g,gt as _,tt as ne}from"./index-BpDDfEys.js";import{A as re,C as ie,D as v,E as ae,M as y,N as b,O as x,S,T as C,_ as w,a as T,b as oe,c as E,d as se,f as ce,g as D,h as O,i as le,j as k,k as A,l as ue,m as j,n as M,p as N,r as P,s as F,t as de,u as I,v as fe,w as pe,x as me,y as he}from"./OrbitControls-CrJy_n9s.js";import{t as L}from"./slidev/default-BMwKOLiZ.js";var R=new T,z=new k,ge=class extends N{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new I([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new I([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new j(t,6,1);return this.setAttribute(`instanceStart`,new O(n,3,0)),this.setAttribute(`instanceEnd`,new O(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new j(t,6,1);return this.setAttribute(`instanceColorStart`,new O(n,3,0)),this.setAttribute(`instanceColorEnd`,new O(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new b(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new T);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),R.setFromBufferAttribute(t),this.boundingBox.union(R))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new C),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)z.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(z)),z.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(z));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}};P.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new re},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},M.line={uniforms:A.merge([P.common,P.fog,P.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = perspective ? normalize( mix( start.xyz, end.xyz, 0.5 ) ) : vec3( 0.0, 0.0, - 1.0 );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;

				// only shift the depth of vertices in front of the camera (#35137)
				if ( clip.w > 0.0 ) clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				float len;

				if ( isOrthographic ) {

					// View rays are parallel to the z axis so the distance reduces to camera-space XY
					vec2 lineDir = worldEnd.xy - worldStart.xy;
					float t = clamp( dot( worldPos.xy - worldStart.xy, lineDir ) / dot( lineDir, lineDir ), 0.0, 1.0 );
					len = length( worldStart.xy + lineDir * t - worldPos.xy );

				} else {

					// Find the closest points on the view ray and the line segment
					vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
					vec3 lineDir = worldEnd - worldStart;
					vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

					vec3 p1 = worldStart + lineDir * params.x;
					vec3 p2 = rayEnd * params.y;
					vec3 delta = p1 - p2;
					len = length( delta );

				}

				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var _e=class extends pe{constructor(e){super({type:`LineMaterial`,uniforms:A.clone(M.line.uniforms),vertexShader:M.line.vertexShader,fragmentShader:M.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return`WORLD_UNITS`in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return`USE_DASH`in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return`USE_ALPHA_TO_COVERAGE`in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE=``:delete this.defines.USE_ALPHA_TO_COVERAGE)}},B=new y,ve=new k,ye=new k,V=new y,H=new y,U=new y,W=new k,G=new fe,K=new D,be=new k,q=new T,J=new C,Y=new y,X,Z;function xe(e,t,n){return Y.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),Y.multiplyScalar(1/Y.w),Y.x=Z/n.width,Y.y=Z/n.height,Y.applyMatrix4(e.projectionMatrixInverse),Y.multiplyScalar(1/Y.w),Math.abs(Math.max(Y.x,Y.y))}function Se(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){K.start.fromBufferAttribute(i,r),K.end.fromBufferAttribute(a,r),K.applyMatrix4(n);let o=new k,s=new k;X.distanceSqToSegment(K.start,K.end,s,o),s.distanceTo(o)<Z*.5&&t.push({point:s,pointOnLine:o,distance:X.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}function Ce(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;X.at(1,U),U.w=1,U.applyMatrix4(t.matrixWorldInverse),U.applyMatrix4(r),U.multiplyScalar(1/U.w),U.x*=i.x/2,U.y*=i.y/2,U.z=0,W.copy(U),G.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(V.fromBufferAttribute(s,t),H.fromBufferAttribute(c,t),V.w=1,H.w=1,V.applyMatrix4(G),H.applyMatrix4(G),V.z>u&&H.z>u)continue;if(V.z>u){let e=V.z-H.z,t=(V.z-u)/e;V.lerp(H,t)}else if(H.z>u){let e=H.z-V.z,t=(H.z-u)/e;H.lerp(V,t)}V.applyMatrix4(r),H.applyMatrix4(r),V.multiplyScalar(1/V.w),H.multiplyScalar(1/H.w),V.x*=i.x/2,V.y*=i.y/2,H.x*=i.x/2,H.y*=i.y/2,K.start.copy(V),K.start.z=0,K.end.copy(H),K.end.z=0;let o=K.closestPointToPointParameter(W,!0);K.at(o,be);let l=w.lerp(V.z,H.z,o),d=l>=-1&&l<=1,f=W.distanceTo(be)<Z*.5;if(d&&f){K.start.fromBufferAttribute(s,t),K.end.fromBufferAttribute(c,t),K.start.applyMatrix4(a),K.end.applyMatrix4(a);let r=new k,i=new k;X.distanceSqToSegment(K.start,K.end,i,r),n.push({point:i,pointOnLine:r,distance:X.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}var we=class extends he{constructor(e=new ge,t=new _e({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)ve.fromBufferAttribute(t,e),ye.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+ve.distanceTo(ye);let i=new j(r,2,1);return e.setAttribute(`instanceDistanceStart`,new O(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new O(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;X=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;Z=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),J.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?Z*.5:xe(r,Math.max(r.near,J.distanceToPoint(X.origin)),s.resolution),J.radius+=c,X.intersectsSphere(J)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),q.copy(o.boundingBox).applyMatrix4(a);let l;l=n?Z*.5:xe(r,Math.max(r.near,q.distanceToPoint(X.origin)),s.resolution),q.expandByScalar(l),X.intersectsBox(q)!==!1&&(n?Se(this,t):Ce(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(B),this.material.uniforms.resolution.value.set(B.z,B.w))}},Q={size:[960,550],layers:[3,4,5,6],wires:[[3,0,30,44,78,44],[3,0,78,44,126,44],[3,0,126,44,174,44],[3,0,174,44,222,44],[3,0,222,44,270,44],[3,0,270,44,318,44],[3,0,318,44,366,44],[3,0,366,44,414,44],[3,0,414,44,462,44],[3,0,462,44,510,44],[3,0,510,44,558,44],[3,0,558,44,606,44],[3,0,606,44,654,44],[3,0,654,44,702,44],[3,0,702,44,750,44],[3,0,750,44,798,44],[3,0,798,44,846,44],[3,0,846,44,894,44],[3,0,894,44,942,44],[3,0,30,116,78,116],[3,0,78,116,126,116],[3,0,126,116,174,116],[3,0,174,116,222,116],[3,0,222,116,270,116],[3,0,270,116,318,116],[3,0,318,116,366,116],[3,0,366,116,414,116],[3,0,414,116,462,116],[3,0,462,116,510,116],[3,0,510,116,558,116],[3,0,558,116,606,116],[3,0,606,116,654,116],[3,0,654,116,702,116],[3,0,702,116,750,116],[3,0,750,116,798,116],[3,0,798,116,846,116],[3,0,846,116,894,116],[3,0,894,116,942,116],[3,0,30,188,78,188],[3,0,78,188,126,188],[3,0,126,188,174,188],[3,0,174,188,222,188],[3,0,222,188,270,188],[3,0,270,188,318,188],[3,0,318,188,366,188],[3,0,366,188,414,188],[3,0,414,188,462,188],[3,0,462,188,510,188],[3,0,510,188,558,188],[3,0,558,188,606,188],[3,0,606,188,654,188],[3,0,654,188,702,188],[3,0,702,188,750,188],[3,0,750,188,798,188],[3,0,798,188,846,188],[3,0,846,188,894,188],[3,0,894,188,942,188],[3,0,30,260,78,260],[3,0,78,260,126,260],[3,0,126,260,174,260],[3,0,174,260,222,260],[3,0,222,260,270,260],[3,0,270,260,318,260],[3,0,318,260,366,260],[3,0,366,260,414,260],[3,0,414,260,462,260],[3,0,462,260,510,260],[3,0,510,260,558,260],[3,0,558,260,606,260],[3,0,606,260,654,260],[3,0,654,260,702,260],[3,0,702,260,750,260],[3,0,750,260,798,260],[3,0,798,260,846,260],[3,0,846,260,894,260],[3,0,894,260,942,260],[3,0,30,332,78,332],[3,0,78,332,126,332],[3,0,126,332,174,332],[3,0,174,332,222,332],[3,0,222,332,270,332],[3,0,270,332,318,332],[3,0,318,332,366,332],[3,0,366,332,414,332],[3,0,414,332,462,332],[3,0,462,332,510,332],[3,0,510,332,558,332],[3,0,558,332,606,332],[3,0,606,332,654,332],[3,0,654,332,702,332],[3,0,702,332,750,332],[3,0,750,332,798,332],[3,0,798,332,846,332],[3,0,846,332,894,332],[3,0,894,332,942,332],[3,0,30,404,78,404],[3,0,78,404,126,404],[3,0,126,404,174,404],[3,0,174,404,222,404],[3,0,222,404,270,404],[3,0,270,404,318,404],[3,0,318,404,366,404],[3,0,366,404,414,404],[3,0,414,404,462,404],[3,0,462,404,510,404],[3,0,510,404,558,404],[3,0,558,404,606,404],[3,0,606,404,654,404],[3,0,654,404,702,404],[3,0,702,404,750,404],[3,0,750,404,798,404],[3,0,798,404,846,404],[3,0,846,404,894,404],[3,0,894,404,942,404],[3,0,30,476,78,476],[3,0,78,476,126,476],[3,0,126,476,174,476],[3,0,174,476,222,476],[3,0,222,476,270,476],[3,0,270,476,318,476],[3,0,318,476,366,476],[3,0,366,476,414,476],[3,0,414,476,462,476],[3,0,462,476,510,476],[3,0,510,476,558,476],[3,0,558,476,606,476],[3,0,606,476,654,476],[3,0,654,476,702,476],[3,0,702,476,750,476],[3,0,750,476,798,476],[3,0,798,476,846,476],[3,0,846,476,894,476],[3,0,894,476,942,476],[3,0,30,548,78,548],[3,0,78,548,126,548],[3,0,126,548,174,548],[3,0,174,548,222,548],[3,0,222,548,270,548],[3,0,270,548,318,548],[3,0,318,548,366,548],[3,0,366,548,414,548],[3,0,414,548,462,548],[3,0,462,548,510,548],[3,0,510,548,558,548],[3,0,558,548,606,548],[3,0,606,548,654,548],[3,0,654,548,702,548],[3,0,702,548,750,548],[3,0,750,548,798,548],[3,0,798,548,846,548],[3,0,846,548,894,548],[3,0,894,548,942,548],[4,1,6,8,6,80],[4,1,6,80,6,152],[4,1,6,152,6,224],[4,1,6,224,6,296],[4,1,6,296,6,368],[4,1,6,368,6,440],[4,1,6,440,6,512],[4,1,102,8,102,80],[4,1,102,80,102,152],[4,1,102,152,102,224],[4,1,102,224,102,296],[4,1,102,296,102,368],[4,1,102,368,102,440],[4,1,102,440,102,512],[4,1,54,8,54,80],[4,1,54,80,54,152],[4,1,54,152,54,224],[4,1,54,224,54,296],[4,1,54,296,54,368],[4,1,54,368,54,440],[4,1,54,440,54,512],[4,1,198,8,198,80],[4,1,198,80,198,152],[4,1,198,152,198,224],[4,1,198,224,198,296],[4,1,198,296,198,368],[4,1,198,368,198,440],[4,1,198,440,198,512],[4,1,150,8,150,80],[4,1,150,80,150,152],[4,1,150,152,150,224],[4,1,150,224,150,296],[4,1,150,296,150,368],[4,1,150,368,150,440],[4,1,150,440,150,512],[4,1,294,8,294,80],[4,1,294,80,294,152],[4,1,294,152,294,224],[4,1,294,224,294,296],[4,1,294,296,294,368],[4,1,294,368,294,440],[4,1,294,440,294,512],[4,1,246,8,246,80],[4,1,246,80,246,152],[4,1,246,152,246,224],[4,1,246,224,246,296],[4,1,246,296,246,368],[4,1,246,368,246,440],[4,1,246,440,246,512],[4,1,390,8,390,80],[4,1,390,80,390,152],[4,1,390,152,390,224],[4,1,390,224,390,296],[4,1,390,296,390,368],[4,1,390,368,390,440],[4,1,390,440,390,512],[4,1,342,8,342,80],[4,1,342,80,342,152],[4,1,342,152,342,224],[4,1,342,224,342,296],[4,1,342,296,342,368],[4,1,342,368,342,440],[4,1,342,440,342,512],[4,1,486,8,486,80],[4,1,486,80,486,152],[4,1,486,152,486,224],[4,1,486,224,486,296],[4,1,486,296,486,368],[4,1,486,368,486,440],[4,1,486,440,486,512],[4,1,438,8,438,80],[4,1,438,80,438,152],[4,1,438,152,438,224],[4,1,438,224,438,296],[4,1,438,296,438,368],[4,1,438,368,438,440],[4,1,438,440,438,512],[4,1,582,8,582,80],[4,1,582,80,582,152],[4,1,582,152,582,224],[4,1,582,224,582,296],[4,1,582,296,582,368],[4,1,582,368,582,440],[4,1,582,440,582,512],[4,1,534,8,534,80],[4,1,534,80,534,152],[4,1,534,152,534,224],[4,1,534,224,534,296],[4,1,534,296,534,368],[4,1,534,368,534,440],[4,1,534,440,534,512],[4,1,678,8,678,80],[4,1,678,80,678,152],[4,1,678,152,678,224],[4,1,678,224,678,296],[4,1,678,296,678,368],[4,1,678,368,678,440],[4,1,678,440,678,512],[4,1,630,8,630,80],[4,1,630,80,630,152],[4,1,630,152,630,224],[4,1,630,224,630,296],[4,1,630,296,630,368],[4,1,630,368,630,440],[4,1,630,440,630,512],[4,1,774,8,774,80],[4,1,774,80,774,152],[4,1,774,152,774,224],[4,1,774,224,774,296],[4,1,774,296,774,368],[4,1,774,368,774,440],[4,1,774,440,774,512],[4,1,726,8,726,80],[4,1,726,80,726,152],[4,1,726,152,726,224],[4,1,726,224,726,296],[4,1,726,296,726,368],[4,1,726,368,726,440],[4,1,726,440,726,512],[4,1,870,8,870,80],[4,1,870,80,870,152],[4,1,870,152,870,224],[4,1,870,224,870,296],[4,1,870,296,870,368],[4,1,870,368,870,440],[4,1,870,440,870,512],[4,1,822,8,822,80],[4,1,822,80,822,152],[4,1,822,152,822,224],[4,1,822,224,822,296],[4,1,822,296,822,368],[4,1,822,368,822,440],[4,1,822,440,822,512],[4,1,918,8,918,80],[4,1,918,80,918,152],[4,1,918,152,918,224],[4,1,918,224,918,296],[4,1,918,296,918,368],[4,1,918,368,918,440],[4,1,918,440,918,512],[5,0,30,44,78,44],[5,0,78,44,126,44],[5,0,126,44,174,44],[5,0,174,44,222,44],[5,0,222,44,270,44],[5,0,270,44,312,44],[5,0,312,44,318,44],[5,0,318,44,366,44],[5,0,366,44,414,44],[5,0,414,44,462,44],[5,0,462,44,510,44],[5,0,510,44,558,44],[5,0,558,44,606,44],[5,0,606,44,654,44],[5,0,654,44,702,44],[5,0,702,44,750,44],[5,0,750,44,798,44],[5,0,798,44,846,44],[5,0,846,44,894,44],[5,0,894,44,942,44],[5,0,30,116,78,116],[5,0,78,116,126,116],[5,0,126,116,174,116],[5,0,174,116,222,116],[5,0,222,116,270,116],[5,0,270,116,312,116],[5,0,312,116,318,116],[5,0,318,116,366,116],[5,0,366,116,414,116],[5,0,414,116,462,116],[5,0,462,116,510,116],[5,0,510,116,558,116],[5,0,558,116,606,116],[5,0,606,116,654,116],[5,0,654,116,702,116],[5,0,702,116,750,116],[5,0,750,116,798,116],[5,0,798,116,846,116],[5,0,846,116,894,116],[5,0,894,116,942,116],[5,0,30,188,78,188],[5,0,78,188,126,188],[5,0,126,188,174,188],[5,0,174,188,222,188],[5,0,222,188,270,188],[5,0,270,188,312,188],[5,0,312,188,318,188],[5,0,318,188,366,188],[5,0,366,188,414,188],[5,0,414,188,462,188],[5,0,462,188,510,188],[5,0,510,188,558,188],[5,0,558,188,606,188],[5,0,606,188,654,188],[5,0,654,188,702,188],[5,0,702,188,750,188],[5,0,750,188,798,188],[5,0,798,188,846,188],[5,0,846,188,894,188],[5,0,894,188,942,188],[5,0,30,260,78,260],[5,0,78,260,126,260],[5,0,126,260,174,260],[5,0,174,260,222,260],[5,0,222,260,270,260],[5,0,270,260,312,260],[5,0,312,260,318,260],[5,0,318,260,366,260],[5,0,366,260,414,260],[5,0,414,260,462,260],[5,0,462,260,510,260],[5,0,510,260,558,260],[5,0,558,260,606,260],[5,0,606,260,654,260],[5,0,654,260,702,260],[5,0,702,260,750,260],[5,0,750,260,798,260],[5,0,798,260,846,260],[5,0,846,260,894,260],[5,0,894,260,942,260],[5,0,30,332,78,332],[5,0,78,332,126,332],[5,0,126,332,174,332],[5,0,174,332,222,332],[5,0,222,332,270,332],[5,0,270,332,312,332],[5,0,312,332,318,332],[5,0,318,332,366,332],[5,0,366,332,414,332],[5,0,414,332,462,332],[5,0,462,332,510,332],[5,0,510,332,558,332],[5,0,558,332,606,332],[5,0,606,332,654,332],[5,0,654,332,702,332],[5,0,702,332,750,332],[5,0,750,332,798,332],[5,0,798,332,846,332],[5,0,846,332,894,332],[5,0,894,332,942,332],[5,0,30,404,78,404],[5,0,78,404,126,404],[5,0,126,404,174,404],[5,0,174,404,222,404],[5,0,222,404,270,404],[5,0,270,404,312,404],[5,0,312,404,318,404],[5,0,318,404,366,404],[5,0,366,404,414,404],[5,0,414,404,462,404],[5,0,462,404,510,404],[5,0,510,404,558,404],[5,0,558,404,606,404],[5,0,606,404,654,404],[5,0,654,404,702,404],[5,0,702,404,750,404],[5,0,750,404,798,404],[5,0,798,404,846,404],[5,0,846,404,894,404],[5,0,894,404,942,404],[5,0,30,476,78,476],[5,0,78,476,126,476],[5,0,126,476,174,476],[5,0,174,476,222,476],[5,0,222,476,270,476],[5,0,270,476,312,476],[5,0,312,476,318,476],[5,0,318,476,366,476],[5,0,366,476,414,476],[5,0,414,476,462,476],[5,0,462,476,510,476],[5,0,510,476,558,476],[5,0,558,476,606,476],[5,0,606,476,654,476],[5,0,654,476,702,476],[5,0,702,476,750,476],[5,0,750,476,798,476],[5,0,798,476,846,476],[5,0,846,476,894,476],[5,0,894,476,942,476],[5,0,30,548,78,548],[5,0,78,548,126,548],[5,0,126,548,174,548],[5,0,174,548,222,548],[5,0,222,548,270,548],[5,0,270,548,276,548],[5,0,276,548,312,548],[5,0,312,548,318,548],[5,0,318,548,366,548],[5,0,366,548,414,548],[5,0,414,548,462,548],[5,0,462,548,510,548],[5,0,510,548,558,548],[5,0,558,548,606,548],[5,0,606,548,654,548],[5,0,654,548,702,548],[5,0,702,548,750,548],[5,0,750,548,798,548],[5,0,798,548,846,548],[5,0,846,548,894,548],[5,0,894,548,942,548],[6,1,682,8,682,80],[6,1,682,80,682,152],[6,1,682,152,682,224],[6,1,682,224,682,296],[6,1,682,296,682,368],[6,1,682,368,682,440],[6,1,682,440,682,512],[6,1,682,512,682,546],[6,1,868,8,868,80],[6,1,868,80,868,152],[6,1,868,152,868,224],[6,1,868,224,868,296],[6,1,868,296,868,368],[6,1,868,368,868,440],[6,1,868,440,868,512],[6,1,868,512,868,546],[3,1,6,8,54,8],[3,1,54,8,102,8],[3,1,102,8,150,8],[3,1,150,8,198,8],[3,1,198,8,246,8],[3,1,246,8,294,8],[3,1,294,8,342,8],[3,1,342,8,390,8],[3,1,390,8,438,8],[3,1,438,8,486,8],[3,1,486,8,534,8],[3,1,534,8,582,8],[3,1,582,8,630,8],[3,1,630,8,678,8],[3,1,678,8,726,8],[3,1,726,8,774,8],[3,1,774,8,822,8],[3,1,822,8,870,8],[3,1,870,8,918,8],[3,1,6,80,54,80],[3,1,54,80,102,80],[3,1,102,80,150,80],[3,1,150,80,198,80],[3,1,198,80,246,80],[3,1,246,80,294,80],[3,1,294,80,342,80],[3,1,342,80,390,80],[3,1,390,80,438,80],[3,1,438,80,486,80],[3,1,486,80,534,80],[3,1,534,80,582,80],[3,1,582,80,630,80],[3,1,630,80,678,80],[3,1,678,80,726,80],[3,1,726,80,774,80],[3,1,774,80,822,80],[3,1,822,80,870,80],[3,1,870,80,918,80],[3,1,6,152,54,152],[3,1,54,152,102,152],[3,1,102,152,150,152],[3,1,150,152,198,152],[3,1,198,152,246,152],[3,1,246,152,294,152],[3,1,294,152,342,152],[3,1,342,152,390,152],[3,1,390,152,438,152],[3,1,438,152,486,152],[3,1,486,152,534,152],[3,1,534,152,582,152],[3,1,582,152,630,152],[3,1,630,152,678,152],[3,1,678,152,726,152],[3,1,726,152,774,152],[3,1,774,152,822,152],[3,1,822,152,870,152],[3,1,870,152,918,152],[3,1,6,224,54,224],[3,1,54,224,102,224],[3,1,102,224,150,224],[3,1,150,224,198,224],[3,1,198,224,246,224],[3,1,246,224,294,224],[3,1,294,224,342,224],[3,1,342,224,390,224],[3,1,390,224,438,224],[3,1,438,224,486,224],[3,1,486,224,534,224],[3,1,534,224,582,224],[3,1,582,224,630,224],[3,1,630,224,678,224],[3,1,678,224,726,224],[3,1,726,224,774,224],[3,1,774,224,822,224],[3,1,822,224,870,224],[3,1,870,224,918,224],[3,1,6,296,54,296],[3,1,54,296,102,296],[3,1,102,296,150,296],[3,1,150,296,198,296],[3,1,198,296,246,296],[3,1,246,296,294,296],[3,1,294,296,342,296],[3,1,342,296,390,296],[3,1,390,296,438,296],[3,1,438,296,486,296],[3,1,486,296,534,296],[3,1,534,296,582,296],[3,1,582,296,630,296],[3,1,630,296,678,296],[3,1,678,296,726,296],[3,1,726,296,774,296],[3,1,774,296,822,296],[3,1,822,296,870,296],[3,1,870,296,918,296],[3,1,6,368,54,368],[3,1,54,368,102,368],[3,1,102,368,150,368],[3,1,150,368,198,368],[3,1,198,368,246,368],[3,1,246,368,294,368],[3,1,294,368,342,368],[3,1,342,368,390,368],[3,1,390,368,438,368],[3,1,438,368,486,368],[3,1,486,368,534,368],[3,1,534,368,582,368],[3,1,582,368,630,368],[3,1,630,368,678,368],[3,1,678,368,726,368],[3,1,726,368,774,368],[3,1,774,368,822,368],[3,1,822,368,870,368],[3,1,870,368,918,368],[3,1,6,440,54,440],[3,1,54,440,102,440],[3,1,102,440,150,440],[3,1,150,440,198,440],[3,1,198,440,246,440],[3,1,246,440,294,440],[3,1,294,440,342,440],[3,1,342,440,390,440],[3,1,390,440,438,440],[3,1,438,440,486,440],[3,1,486,440,534,440],[3,1,534,440,582,440],[3,1,582,440,630,440],[3,1,630,440,678,440],[3,1,678,440,726,440],[3,1,726,440,774,440],[3,1,774,440,822,440],[3,1,822,440,870,440],[3,1,870,440,918,440],[3,1,6,512,54,512],[3,1,54,512,102,512],[3,1,102,512,150,512],[3,1,150,512,198,512],[3,1,198,512,246,512],[3,1,246,512,294,512],[3,1,294,512,342,512],[3,1,342,512,390,512],[3,1,390,512,438,512],[3,1,438,512,486,512],[3,1,486,512,534,512],[3,1,534,512,582,512],[3,1,582,512,630,512],[3,1,630,512,678,512],[3,1,678,512,726,512],[3,1,726,512,774,512],[3,1,774,512,822,512],[3,1,822,512,870,512],[3,1,870,512,918,512],[4,0,78,44,78,116],[4,0,78,116,78,188],[4,0,78,188,78,260],[4,0,78,260,78,332],[4,0,78,332,78,404],[4,0,78,404,78,476],[4,0,78,476,78,548],[4,0,30,44,30,116],[4,0,30,116,30,188],[4,0,30,188,30,260],[4,0,30,260,30,332],[4,0,30,332,30,404],[4,0,30,404,30,476],[4,0,30,476,30,548],[4,0,174,44,174,116],[4,0,174,116,174,188],[4,0,174,188,174,260],[4,0,174,260,174,332],[4,0,174,332,174,404],[4,0,174,404,174,476],[4,0,174,476,174,548],[4,0,126,44,126,116],[4,0,126,116,126,188],[4,0,126,188,126,260],[4,0,126,260,126,332],[4,0,126,332,126,404],[4,0,126,404,126,476],[4,0,126,476,126,548],[4,0,270,44,270,116],[4,0,270,116,270,188],[4,0,270,188,270,260],[4,0,270,260,270,332],[4,0,270,332,270,404],[4,0,270,404,270,476],[4,0,270,476,270,548],[4,0,222,44,222,116],[4,0,222,116,222,188],[4,0,222,188,222,260],[4,0,222,260,222,332],[4,0,222,332,222,404],[4,0,222,404,222,476],[4,0,222,476,222,548],[4,0,366,44,366,116],[4,0,366,116,366,188],[4,0,366,188,366,260],[4,0,366,260,366,332],[4,0,366,332,366,404],[4,0,366,404,366,476],[4,0,366,476,366,548],[4,0,318,44,318,116],[4,0,318,116,318,188],[4,0,318,188,318,260],[4,0,318,260,318,332],[4,0,318,332,318,404],[4,0,318,404,318,476],[4,0,318,476,318,548],[4,0,510,44,510,116],[4,0,510,116,510,188],[4,0,510,188,510,260],[4,0,510,260,510,332],[4,0,510,332,510,404],[4,0,510,404,510,476],[4,0,510,476,510,548],[4,0,462,44,462,116],[4,0,462,116,462,188],[4,0,462,188,462,260],[4,0,462,260,462,332],[4,0,462,332,462,404],[4,0,462,404,462,476],[4,0,462,476,462,548],[4,0,414,44,414,116],[4,0,414,116,414,188],[4,0,414,188,414,260],[4,0,414,260,414,332],[4,0,414,332,414,404],[4,0,414,404,414,476],[4,0,414,476,414,548],[4,0,606,44,606,116],[4,0,606,116,606,188],[4,0,606,188,606,260],[4,0,606,260,606,332],[4,0,606,332,606,404],[4,0,606,404,606,476],[4,0,606,476,606,548],[4,0,558,44,558,116],[4,0,558,116,558,188],[4,0,558,188,558,260],[4,0,558,260,558,332],[4,0,558,332,558,404],[4,0,558,404,558,476],[4,0,558,476,558,548],[4,0,702,44,702,116],[4,0,702,116,702,188],[4,0,702,188,702,260],[4,0,702,260,702,332],[4,0,702,332,702,404],[4,0,702,404,702,476],[4,0,702,476,702,548],[4,0,654,44,654,116],[4,0,654,116,654,188],[4,0,654,188,654,260],[4,0,654,260,654,332],[4,0,654,332,654,404],[4,0,654,404,654,476],[4,0,654,476,654,548],[4,0,798,44,798,116],[4,0,798,116,798,188],[4,0,798,188,798,260],[4,0,798,260,798,332],[4,0,798,332,798,404],[4,0,798,404,798,476],[4,0,798,476,798,548],[4,0,750,44,750,116],[4,0,750,116,750,188],[4,0,750,188,750,260],[4,0,750,260,750,332],[4,0,750,332,750,404],[4,0,750,404,750,476],[4,0,750,476,750,548],[4,0,894,44,894,116],[4,0,894,116,894,188],[4,0,894,188,894,260],[4,0,894,260,894,332],[4,0,894,332,894,404],[4,0,894,404,894,476],[4,0,894,476,894,548],[4,0,846,44,846,116],[4,0,846,116,846,188],[4,0,846,188,846,260],[4,0,846,260,846,332],[4,0,846,332,846,404],[4,0,846,404,846,476],[4,0,846,476,846,548],[4,0,942,44,942,116],[4,0,942,116,942,188],[4,0,942,188,942,260],[4,0,942,260,942,332],[4,0,942,332,942,404],[4,0,942,404,942,476],[4,0,942,476,942,548],[5,1,6,8,54,8],[5,1,54,8,102,8],[5,1,102,8,150,8],[5,1,150,8,198,8],[5,1,198,8,246,8],[5,1,246,8,294,8],[5,1,294,8,342,8],[5,1,342,8,390,8],[5,1,390,8,438,8],[5,1,438,8,486,8],[5,1,486,8,534,8],[5,1,534,8,582,8],[5,1,582,8,630,8],[5,1,630,8,678,8],[5,1,678,8,682,8],[5,1,682,8,719,8],[5,1,719,8,726,8],[5,1,726,8,774,8],[5,1,774,8,822,8],[5,1,822,8,832,8],[5,1,832,8,868,8],[5,1,868,8,870,8],[5,1,870,8,918,8],[5,1,6,80,54,80],[5,1,54,80,102,80],[5,1,102,80,150,80],[5,1,150,80,198,80],[5,1,198,80,246,80],[5,1,246,80,294,80],[5,1,294,80,342,80],[5,1,342,80,390,80],[5,1,390,80,438,80],[5,1,438,80,486,80],[5,1,486,80,534,80],[5,1,534,80,582,80],[5,1,582,80,630,80],[5,1,630,80,678,80],[5,1,678,80,682,80],[5,1,682,80,726,80],[5,1,726,80,774,80],[5,1,774,80,822,80],[5,1,822,80,868,80],[5,1,868,80,870,80],[5,1,870,80,918,80],[5,1,6,152,54,152],[5,1,54,152,102,152],[5,1,102,152,150,152],[5,1,150,152,198,152],[5,1,198,152,246,152],[5,1,246,152,294,152],[5,1,294,152,342,152],[5,1,342,152,390,152],[5,1,390,152,438,152],[5,1,438,152,486,152],[5,1,486,152,534,152],[5,1,534,152,582,152],[5,1,582,152,630,152],[5,1,630,152,678,152],[5,1,678,152,682,152],[5,1,682,152,726,152],[5,1,726,152,774,152],[5,1,774,152,822,152],[5,1,822,152,868,152],[5,1,868,152,870,152],[5,1,870,152,918,152],[5,1,6,224,54,224],[5,1,54,224,102,224],[5,1,102,224,150,224],[5,1,150,224,198,224],[5,1,198,224,246,224],[5,1,246,224,294,224],[5,1,294,224,342,224],[5,1,342,224,390,224],[5,1,390,224,438,224],[5,1,438,224,486,224],[5,1,486,224,534,224],[5,1,534,224,582,224],[5,1,582,224,630,224],[5,1,630,224,678,224],[5,1,678,224,682,224],[5,1,682,224,726,224],[5,1,726,224,774,224],[5,1,774,224,822,224],[5,1,822,224,868,224],[5,1,868,224,870,224],[5,1,870,224,918,224],[5,1,6,296,54,296],[5,1,54,296,102,296],[5,1,102,296,150,296],[5,1,150,296,198,296],[5,1,198,296,246,296],[5,1,246,296,294,296],[5,1,294,296,342,296],[5,1,342,296,390,296],[5,1,390,296,438,296],[5,1,438,296,486,296],[5,1,486,296,534,296],[5,1,534,296,582,296],[5,1,582,296,630,296],[5,1,630,296,678,296],[5,1,678,296,682,296],[5,1,682,296,726,296],[5,1,726,296,774,296],[5,1,774,296,822,296],[5,1,822,296,868,296],[5,1,868,296,870,296],[5,1,870,296,918,296],[5,1,6,368,54,368],[5,1,54,368,102,368],[5,1,102,368,150,368],[5,1,150,368,198,368],[5,1,198,368,246,368],[5,1,246,368,294,368],[5,1,294,368,342,368],[5,1,342,368,390,368],[5,1,390,368,438,368],[5,1,438,368,486,368],[5,1,486,368,534,368],[5,1,534,368,582,368],[5,1,582,368,630,368],[5,1,630,368,678,368],[5,1,678,368,682,368],[5,1,682,368,726,368],[5,1,726,368,774,368],[5,1,774,368,822,368],[5,1,822,368,868,368],[5,1,868,368,870,368],[5,1,870,368,918,368],[5,1,6,440,54,440],[5,1,54,440,102,440],[5,1,102,440,150,440],[5,1,150,440,198,440],[5,1,198,440,246,440],[5,1,246,440,294,440],[5,1,294,440,342,440],[5,1,342,440,390,440],[5,1,390,440,438,440],[5,1,438,440,486,440],[5,1,486,440,534,440],[5,1,534,440,582,440],[5,1,582,440,630,440],[5,1,630,440,678,440],[5,1,678,440,682,440],[5,1,682,440,726,440],[5,1,726,440,774,440],[5,1,774,440,822,440],[5,1,822,440,868,440],[5,1,868,440,870,440],[5,1,870,440,918,440],[5,1,6,512,54,512],[5,1,54,512,102,512],[5,1,102,512,150,512],[5,1,150,512,198,512],[5,1,198,512,246,512],[5,1,246,512,294,512],[5,1,294,512,342,512],[5,1,342,512,390,512],[5,1,390,512,438,512],[5,1,438,512,486,512],[5,1,486,512,534,512],[5,1,534,512,582,512],[5,1,582,512,630,512],[5,1,630,512,678,512],[5,1,678,512,682,512],[5,1,682,512,719,512],[5,1,719,512,726,512],[5,1,726,512,774,512],[5,1,774,512,822,512],[5,1,822,512,832,512],[5,1,832,512,868,512],[5,1,868,512,870,512],[5,1,870,512,918,512],[6,0,126,44,126,116],[6,0,126,116,126,188],[6,0,126,188,126,260],[6,0,126,260,126,332],[6,0,126,332,126,404],[6,0,126,404,126,476],[6,0,126,476,126,548],[6,0,312,44,312,116],[6,0,312,116,312,188],[6,0,312,188,312,260],[6,0,312,260,312,332],[6,0,312,332,312,404],[6,0,312,404,312,476],[6,0,312,476,312,546],[6,0,312,546,312,548]],vias:[[4,5,1,6,8],[4,5,1,6,80],[4,5,1,6,152],[4,5,1,6,224],[4,5,1,6,296],[4,5,1,6,368],[4,5,1,6,440],[4,5,1,6,512],[4,5,1,54,8],[4,5,1,54,80],[4,5,1,54,152],[4,5,1,54,224],[4,5,1,54,296],[4,5,1,54,368],[4,5,1,54,440],[4,5,1,54,512],[4,5,1,102,8],[4,5,1,102,80],[4,5,1,102,152],[4,5,1,102,224],[4,5,1,102,296],[4,5,1,102,368],[4,5,1,102,440],[4,5,1,102,512],[4,5,1,150,8],[4,5,1,150,80],[4,5,1,150,152],[4,5,1,150,224],[4,5,1,150,296],[4,5,1,150,368],[4,5,1,150,440],[4,5,1,150,512],[4,5,1,198,8],[4,5,1,198,80],[4,5,1,198,152],[4,5,1,198,224],[4,5,1,198,296],[4,5,1,198,368],[4,5,1,198,440],[4,5,1,198,512],[4,5,1,246,8],[4,5,1,246,80],[4,5,1,246,152],[4,5,1,246,224],[4,5,1,246,296],[4,5,1,246,368],[4,5,1,246,440],[4,5,1,246,512],[4,5,1,294,8],[4,5,1,294,80],[4,5,1,294,152],[4,5,1,294,224],[4,5,1,294,296],[4,5,1,294,368],[4,5,1,294,440],[4,5,1,294,512],[4,5,1,342,8],[4,5,1,342,80],[4,5,1,342,152],[4,5,1,342,224],[4,5,1,342,296],[4,5,1,342,368],[4,5,1,342,440],[4,5,1,342,512],[4,5,1,390,8],[4,5,1,390,80],[4,5,1,390,152],[4,5,1,390,224],[4,5,1,390,296],[4,5,1,390,368],[4,5,1,390,440],[4,5,1,390,512],[4,5,1,438,8],[4,5,1,438,80],[4,5,1,438,152],[4,5,1,438,224],[4,5,1,438,296],[4,5,1,438,368],[4,5,1,438,440],[4,5,1,438,512],[4,5,1,486,8],[4,5,1,486,80],[4,5,1,486,152],[4,5,1,486,224],[4,5,1,486,296],[4,5,1,486,368],[4,5,1,486,440],[4,5,1,486,512],[4,5,1,534,8],[4,5,1,534,80],[4,5,1,534,152],[4,5,1,534,224],[4,5,1,534,296],[4,5,1,534,368],[4,5,1,534,440],[4,5,1,534,512],[4,5,1,582,8],[4,5,1,582,80],[4,5,1,582,152],[4,5,1,582,224],[4,5,1,582,296],[4,5,1,582,368],[4,5,1,582,440],[4,5,1,582,512],[4,5,1,630,8],[4,5,1,630,80],[4,5,1,630,152],[4,5,1,630,224],[4,5,1,630,296],[4,5,1,630,368],[4,5,1,630,440],[4,5,1,630,512],[4,5,1,678,8],[4,5,1,678,80],[4,5,1,678,152],[4,5,1,678,224],[4,5,1,678,296],[4,5,1,678,368],[4,5,1,678,440],[4,5,1,678,512],[4,5,1,726,8],[4,5,1,726,80],[4,5,1,726,152],[4,5,1,726,224],[4,5,1,726,296],[4,5,1,726,368],[4,5,1,726,440],[4,5,1,726,512],[4,5,1,774,8],[4,5,1,774,80],[4,5,1,774,152],[4,5,1,774,224],[4,5,1,774,296],[4,5,1,774,368],[4,5,1,774,440],[4,5,1,774,512],[4,5,1,822,8],[4,5,1,822,80],[4,5,1,822,152],[4,5,1,822,224],[4,5,1,822,296],[4,5,1,822,368],[4,5,1,822,440],[4,5,1,822,512],[4,5,1,870,8],[4,5,1,870,80],[4,5,1,870,152],[4,5,1,870,224],[4,5,1,870,296],[4,5,1,870,368],[4,5,1,870,440],[4,5,1,870,512],[4,5,1,918,8],[4,5,1,918,80],[4,5,1,918,152],[4,5,1,918,224],[4,5,1,918,296],[4,5,1,918,368],[4,5,1,918,440],[4,5,1,918,512],[4,5,0,30,44],[4,5,0,30,116],[4,5,0,30,188],[4,5,0,30,260],[4,5,0,30,332],[4,5,0,30,404],[4,5,0,30,476],[4,5,0,30,548],[4,5,0,78,44],[4,5,0,78,116],[4,5,0,78,188],[4,5,0,78,260],[4,5,0,78,332],[4,5,0,78,404],[4,5,0,78,476],[4,5,0,78,548],[4,5,0,126,44],[4,5,0,126,116],[4,5,0,126,188],[4,5,0,126,260],[4,5,0,126,332],[4,5,0,126,404],[4,5,0,126,476],[4,5,0,126,548],[4,5,0,174,44],[4,5,0,174,116],[4,5,0,174,188],[4,5,0,174,260],[4,5,0,174,332],[4,5,0,174,404],[4,5,0,174,476],[4,5,0,174,548],[4,5,0,222,44],[4,5,0,222,116],[4,5,0,222,188],[4,5,0,222,260],[4,5,0,222,332],[4,5,0,222,404],[4,5,0,222,476],[4,5,0,222,548],[4,5,0,270,44],[4,5,0,270,116],[4,5,0,270,188],[4,5,0,270,260],[4,5,0,270,332],[4,5,0,270,404],[4,5,0,270,476],[4,5,0,270,548],[4,5,0,318,44],[4,5,0,318,116],[4,5,0,318,188],[4,5,0,318,260],[4,5,0,318,332],[4,5,0,318,404],[4,5,0,318,476],[4,5,0,318,548],[4,5,0,366,44],[4,5,0,366,116],[4,5,0,366,188],[4,5,0,366,260],[4,5,0,366,332],[4,5,0,366,404],[4,5,0,366,476],[4,5,0,366,548],[4,5,0,414,44],[4,5,0,414,116],[4,5,0,414,188],[4,5,0,414,260],[4,5,0,414,332],[4,5,0,414,404],[4,5,0,414,476],[4,5,0,414,548],[4,5,0,462,44],[4,5,0,462,116],[4,5,0,462,188],[4,5,0,462,260],[4,5,0,462,332],[4,5,0,462,404],[4,5,0,462,476],[4,5,0,462,548],[4,5,0,510,44],[4,5,0,510,116],[4,5,0,510,188],[4,5,0,510,260],[4,5,0,510,332],[4,5,0,510,404],[4,5,0,510,476],[4,5,0,510,548],[4,5,0,558,44],[4,5,0,558,116],[4,5,0,558,188],[4,5,0,558,260],[4,5,0,558,332],[4,5,0,558,404],[4,5,0,558,476],[4,5,0,558,548],[4,5,0,606,44],[4,5,0,606,116],[4,5,0,606,188],[4,5,0,606,260],[4,5,0,606,332],[4,5,0,606,404],[4,5,0,606,476],[4,5,0,606,548],[4,5,0,654,44],[4,5,0,654,116],[4,5,0,654,188],[4,5,0,654,260],[4,5,0,654,332],[4,5,0,654,404],[4,5,0,654,476],[4,5,0,654,548],[4,5,0,702,44],[4,5,0,702,116],[4,5,0,702,188],[4,5,0,702,260],[4,5,0,702,332],[4,5,0,702,404],[4,5,0,702,476],[4,5,0,702,548],[4,5,0,750,44],[4,5,0,750,116],[4,5,0,750,188],[4,5,0,750,260],[4,5,0,750,332],[4,5,0,750,404],[4,5,0,750,476],[4,5,0,750,548],[4,5,0,798,44],[4,5,0,798,116],[4,5,0,798,188],[4,5,0,798,260],[4,5,0,798,332],[4,5,0,798,404],[4,5,0,798,476],[4,5,0,798,548],[4,5,0,846,44],[4,5,0,846,116],[4,5,0,846,188],[4,5,0,846,260],[4,5,0,846,332],[4,5,0,846,404],[4,5,0,846,476],[4,5,0,846,548],[4,5,0,894,44],[4,5,0,894,116],[4,5,0,894,188],[4,5,0,894,260],[4,5,0,894,332],[4,5,0,894,404],[4,5,0,894,476],[4,5,0,894,548],[4,5,0,942,44],[4,5,0,942,116],[4,5,0,942,188],[4,5,0,942,260],[4,5,0,942,332],[4,5,0,942,404],[4,5,0,942,476],[4,5,0,942,548],[3,4,1,6,8],[3,4,1,6,80],[3,4,1,6,152],[3,4,1,6,224],[3,4,1,6,296],[3,4,1,6,368],[3,4,1,6,440],[3,4,1,6,512],[3,4,1,54,8],[3,4,1,54,80],[3,4,1,54,152],[3,4,1,54,224],[3,4,1,54,296],[3,4,1,54,368],[3,4,1,54,440],[3,4,1,54,512],[3,4,1,102,8],[3,4,1,102,80],[3,4,1,102,152],[3,4,1,102,224],[3,4,1,102,296],[3,4,1,102,368],[3,4,1,102,440],[3,4,1,102,512],[3,4,1,150,8],[3,4,1,150,80],[3,4,1,150,152],[3,4,1,150,224],[3,4,1,150,296],[3,4,1,150,368],[3,4,1,150,440],[3,4,1,150,512],[3,4,1,198,8],[3,4,1,198,80],[3,4,1,198,152],[3,4,1,198,224],[3,4,1,198,296],[3,4,1,198,368],[3,4,1,198,440],[3,4,1,198,512],[3,4,1,246,8],[3,4,1,246,80],[3,4,1,246,152],[3,4,1,246,224],[3,4,1,246,296],[3,4,1,246,368],[3,4,1,246,440],[3,4,1,246,512],[3,4,1,294,8],[3,4,1,294,80],[3,4,1,294,152],[3,4,1,294,224],[3,4,1,294,296],[3,4,1,294,368],[3,4,1,294,440],[3,4,1,294,512],[3,4,1,342,8],[3,4,1,342,80],[3,4,1,342,152],[3,4,1,342,224],[3,4,1,342,296],[3,4,1,342,368],[3,4,1,342,440],[3,4,1,342,512],[3,4,1,390,8],[3,4,1,390,80],[3,4,1,390,152],[3,4,1,390,224],[3,4,1,390,296],[3,4,1,390,368],[3,4,1,390,440],[3,4,1,390,512],[3,4,1,438,8],[3,4,1,438,80],[3,4,1,438,152],[3,4,1,438,224],[3,4,1,438,296],[3,4,1,438,368],[3,4,1,438,440],[3,4,1,438,512],[3,4,1,486,8],[3,4,1,486,80],[3,4,1,486,152],[3,4,1,486,224],[3,4,1,486,296],[3,4,1,486,368],[3,4,1,486,440],[3,4,1,486,512],[3,4,1,534,8],[3,4,1,534,80],[3,4,1,534,152],[3,4,1,534,224],[3,4,1,534,296],[3,4,1,534,368],[3,4,1,534,440],[3,4,1,534,512],[3,4,1,582,8],[3,4,1,582,80],[3,4,1,582,152],[3,4,1,582,224],[3,4,1,582,296],[3,4,1,582,368],[3,4,1,582,440],[3,4,1,582,512],[3,4,1,630,8],[3,4,1,630,80],[3,4,1,630,152],[3,4,1,630,224],[3,4,1,630,296],[3,4,1,630,368],[3,4,1,630,440],[3,4,1,630,512],[3,4,1,678,8],[3,4,1,678,80],[3,4,1,678,152],[3,4,1,678,224],[3,4,1,678,296],[3,4,1,678,368],[3,4,1,678,440],[3,4,1,678,512],[3,4,1,726,8],[3,4,1,726,80],[3,4,1,726,152],[3,4,1,726,224],[3,4,1,726,296],[3,4,1,726,368],[3,4,1,726,440],[3,4,1,726,512],[3,4,1,774,8],[3,4,1,774,80],[3,4,1,774,152],[3,4,1,774,224],[3,4,1,774,296],[3,4,1,774,368],[3,4,1,774,440],[3,4,1,774,512],[3,4,1,822,8],[3,4,1,822,80],[3,4,1,822,152],[3,4,1,822,224],[3,4,1,822,296],[3,4,1,822,368],[3,4,1,822,440],[3,4,1,822,512],[3,4,1,870,8],[3,4,1,870,80],[3,4,1,870,152],[3,4,1,870,224],[3,4,1,870,296],[3,4,1,870,368],[3,4,1,870,440],[3,4,1,870,512],[3,4,1,918,8],[3,4,1,918,80],[3,4,1,918,152],[3,4,1,918,224],[3,4,1,918,296],[3,4,1,918,368],[3,4,1,918,440],[3,4,1,918,512],[5,6,1,682,8],[5,6,1,682,80],[5,6,1,682,152],[5,6,1,682,224],[5,6,1,682,296],[5,6,1,682,368],[5,6,1,682,440],[5,6,1,682,512],[5,6,1,719,8],[5,6,1,719,512],[5,6,1,832,8],[5,6,1,832,512],[5,6,1,868,8],[5,6,1,868,80],[5,6,1,868,152],[5,6,1,868,224],[5,6,1,868,296],[5,6,1,868,368],[5,6,1,868,440],[5,6,1,868,512],[3,4,0,30,44],[3,4,0,30,116],[3,4,0,30,188],[3,4,0,30,260],[3,4,0,30,332],[3,4,0,30,404],[3,4,0,30,476],[3,4,0,30,548],[3,4,0,78,44],[3,4,0,78,116],[3,4,0,78,188],[3,4,0,78,260],[3,4,0,78,332],[3,4,0,78,404],[3,4,0,78,476],[3,4,0,78,548],[3,4,0,126,44],[3,4,0,126,116],[3,4,0,126,188],[3,4,0,126,260],[3,4,0,126,332],[3,4,0,126,404],[3,4,0,126,476],[3,4,0,126,548],[3,4,0,174,44],[3,4,0,174,116],[3,4,0,174,188],[3,4,0,174,260],[3,4,0,174,332],[3,4,0,174,404],[3,4,0,174,476],[3,4,0,174,548],[3,4,0,222,44],[3,4,0,222,116],[3,4,0,222,188],[3,4,0,222,260],[3,4,0,222,332],[3,4,0,222,404],[3,4,0,222,476],[3,4,0,222,548],[3,4,0,270,44],[3,4,0,270,116],[3,4,0,270,188],[3,4,0,270,260],[3,4,0,270,332],[3,4,0,270,404],[3,4,0,270,476],[3,4,0,270,548],[3,4,0,318,44],[3,4,0,318,116],[3,4,0,318,188],[3,4,0,318,260],[3,4,0,318,332],[3,4,0,318,404],[3,4,0,318,476],[3,4,0,318,548],[3,4,0,366,44],[3,4,0,366,116],[3,4,0,366,188],[3,4,0,366,260],[3,4,0,366,332],[3,4,0,366,404],[3,4,0,366,476],[3,4,0,366,548],[3,4,0,414,44],[3,4,0,414,116],[3,4,0,414,188],[3,4,0,414,260],[3,4,0,414,332],[3,4,0,414,404],[3,4,0,414,476],[3,4,0,414,548],[3,4,0,462,44],[3,4,0,462,116],[3,4,0,462,188],[3,4,0,462,260],[3,4,0,462,332],[3,4,0,462,404],[3,4,0,462,476],[3,4,0,462,548],[3,4,0,510,44],[3,4,0,510,116],[3,4,0,510,188],[3,4,0,510,260],[3,4,0,510,332],[3,4,0,510,404],[3,4,0,510,476],[3,4,0,510,548],[3,4,0,558,44],[3,4,0,558,116],[3,4,0,558,188],[3,4,0,558,260],[3,4,0,558,332],[3,4,0,558,404],[3,4,0,558,476],[3,4,0,558,548],[3,4,0,606,44],[3,4,0,606,116],[3,4,0,606,188],[3,4,0,606,260],[3,4,0,606,332],[3,4,0,606,404],[3,4,0,606,476],[3,4,0,606,548],[3,4,0,654,44],[3,4,0,654,116],[3,4,0,654,188],[3,4,0,654,260],[3,4,0,654,332],[3,4,0,654,404],[3,4,0,654,476],[3,4,0,654,548],[3,4,0,702,44],[3,4,0,702,116],[3,4,0,702,188],[3,4,0,702,260],[3,4,0,702,332],[3,4,0,702,404],[3,4,0,702,476],[3,4,0,702,548],[3,4,0,750,44],[3,4,0,750,116],[3,4,0,750,188],[3,4,0,750,260],[3,4,0,750,332],[3,4,0,750,404],[3,4,0,750,476],[3,4,0,750,548],[3,4,0,798,44],[3,4,0,798,116],[3,4,0,798,188],[3,4,0,798,260],[3,4,0,798,332],[3,4,0,798,404],[3,4,0,798,476],[3,4,0,798,548],[3,4,0,846,44],[3,4,0,846,116],[3,4,0,846,188],[3,4,0,846,260],[3,4,0,846,332],[3,4,0,846,404],[3,4,0,846,476],[3,4,0,846,548],[3,4,0,894,44],[3,4,0,894,116],[3,4,0,894,188],[3,4,0,894,260],[3,4,0,894,332],[3,4,0,894,404],[3,4,0,894,476],[3,4,0,894,548],[3,4,0,942,44],[3,4,0,942,116],[3,4,0,942,188],[3,4,0,942,260],[3,4,0,942,332],[3,4,0,942,404],[3,4,0,942,476],[3,4,0,942,548],[5,6,0,126,44],[5,6,0,126,116],[5,6,0,126,188],[5,6,0,126,260],[5,6,0,126,332],[5,6,0,126,404],[5,6,0,126,476],[5,6,0,126,548],[5,6,0,276,548],[5,6,0,312,44],[5,6,0,312,116],[5,6,0,312,188],[5,6,0,312,260],[5,6,0,312,332],[5,6,0,312,404],[5,6,0,312,476],[5,6,0,312,548]],c4:[[1,868,546],[0,312,546],[1,682,546]],loads:[[750,44],[750,116],[750,188],[750,260],[750,332],[750,404],[750,476],[750,548],[798,44],[846,44],[798,116],[846,116],[798,188],[846,188],[798,260],[798,332],[846,260],[846,332],[798,404],[846,404],[798,476],[846,476],[798,548],[846,548],[894,44],[894,116],[894,188],[894,260],[894,332],[894,404],[894,476],[894,548],[942,44],[942,116],[942,188],[942,260],[942,332],[942,404],[942,476],[942,548],[30,44],[78,44],[30,116],[78,116],[30,188],[78,188],[30,260],[30,332],[78,260],[78,332],[30,404],[78,404],[30,476],[78,476],[30,548],[78,548],[126,44],[174,44],[126,116],[174,116],[126,188],[174,188],[126,260],[126,332],[174,260],[174,332],[126,404],[174,404],[126,476],[174,476],[126,548],[174,548],[222,44],[270,44],[222,116],[270,116],[222,188],[270,188],[222,260],[222,332],[270,260],[270,332],[222,404],[270,404],[222,476],[270,476],[222,548],[270,548],[318,44],[318,116],[318,188],[318,260],[318,332],[318,404],[318,476],[318,548],[366,44],[414,44],[366,116],[414,116],[366,188],[414,188],[366,260],[366,332],[414,260],[414,332],[366,404],[414,404],[366,476],[414,476],[366,548],[414,548],[462,44],[510,44],[462,116],[510,116],[462,188],[510,188],[462,260],[462,332],[510,260],[510,332],[462,404],[510,404],[462,476],[510,476],[462,548],[510,548],[558,44],[606,44],[558,116],[606,116],[558,188],[606,188],[558,260],[558,332],[606,260],[606,332],[558,404],[606,404],[558,476],[606,476],[558,548],[606,548],[654,44],[654,116],[654,188],[654,260],[654,332],[654,404],[654,476],[654,548],[702,44],[702,116],[702,188],[702,260],[702,332],[702,404],[702,476],[702,548]]},Te={class:`c3d`},$=.01,Ee=_(m({__name:`Circuit3D`,props:{step:{}},setup(e){let{$slidev:t,$nav:o,$clicksContext:s,$clicks:c,$page:l,$renderContext:p,$frontmatter:ee}=ne(),m=e,h=d(),g={3:0,4:.6,5:1.2,6:1.8},_=[`#c2413b`,`#2f6fb3`],re=[[0,126,332],[0,312,116],[1,682,440],[1,868,224]],y=(e,t)=>new E(e).lerp(new E(`#ffffff`),[.5,.4,.25,0][t-3]),b,C,w,T,D=0,O,A={low:[],mid:[],top:[],src:[],bump:[]},j={low:1,mid:1,top:1,src:1,bump:1},M=[];function N(e,t,n,r){let i=t.clone().sub(e),a=new k(-i.z,0,i.x).normalize().multiplyScalar(n),o=[e.clone(),e.clone().lerp(t,.25)];for(let n=1;n<=6;n++)o.push(e.clone().lerp(t,.25+.5*(n-.5)/6).add(a.clone().multiplyScalar(n%2?1:-1)));o.push(e.clone().lerp(t,.75),t.clone());for(let e=0;e<o.length-1;e++)r.push(o[e].x,o[e].y,o[e].z,o[e+1].x,o[e+1].y,o[e+1].z)}function P(e,t,n,r,i){let a=new ge;a.setPositions(e);let o=new _e({color:t.getHex(),linewidth:n,transparent:!0,worldUnits:!1});M.push(o);let s=new we(a,o);i.add(s),A[r].push({obj:s,mat:o})}function I(){let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`);t.strokeStyle=`#d98a1c`,t.lineWidth=9,t.beginPath(),t.arc(64,64,50,0,Math.PI*2),t.stroke(),t.fillStyle=`#d98a1c`,t.fillRect(58,28,12,52),t.beginPath(),t.moveTo(40,74),t.lineTo(88,74),t.lineTo(64,104),t.closePath(),t.fill();let n=new F(e);return n.colorSpace=S,n}function fe(e){let t=document.createElement(`canvas`);t.width=t.height=128;let n=t.getContext(`2d`);n.fillStyle=`#ffffff`,n.beginPath(),n.arc(64,64,52,0,Math.PI*2),n.fill(),n.strokeStyle=e,n.lineWidth=9,n.beginPath(),n.arc(64,64,52,0,Math.PI*2),n.stroke(),n.fillStyle=e,n.fillRect(48,37,32,10),n.fillRect(59,26,10,32),n.fillRect(48,82,32,10);let r=new F(t);return r.colorSpace=S,r}function pe(){C=new ie,C.background=new E(`#ffffff`);let[e,t]=Q.size,n=new se;n.position.set(-e*$/2,-.7,t*$/2),C.add(n);for(let e of[3,4,5,6])for(let t of[0,1]){let r=[];for(let n of Q.wires)n[0]===e&&n[1]===t&&N(new k(n[2]*$,g[e],-n[3]*$),new k(n[4]*$,g[e],-n[5]*$),e===6?.06:.045,r);r.length&&P(r,y(_[t],e),e===6?3.2:1.6,e===6?`top`:e===5?`mid`:`low`,n)}for(let e of[0,1]){let t=[];for(let n of Q.vias)n[2]===e&&t.push(n[3]*$,g[n[0]],-n[4]*$,n[3]*$,g[n[1]],-n[4]*$);P(t,new E(_[e]).lerp(new E(`#9aa3ad`),.5),1.2,`mid`,n)}let r=I(),i=[];for(let[e,t]of Q.loads){let a=new x({map:r,transparent:!0}),o=new v(a);o.scale.set(.2,.2,1),o.position.set(e*$,-.32,-t*$),n.add(o),A.src.push({obj:o,mat:a}),i.push(e*$,0,-t*$,e*$,-.2,-t*$)}P(i,new E(`#d98a1c`),1.2,`src`,n);for(let e of[0,1]){let t=fe(_[e]),r=[];for(let[i,a,o]of re){if(i!==e)continue;let s=new x({map:t,transparent:!0}),c=new v(s);c.scale.set(.62,.62,1),c.position.set(a*$,g[6]+.78,-o*$),n.add(c),A.bump.push({obj:c,mat:s});let l=new oe({color:_[e],transparent:!0}),u=new he(new ae(.08,16,8),l);u.position.set(a*$,g[6],-o*$),n.add(u),A.bump.push({obj:u,mat:l}),r.push(a*$,g[6],-o*$,a*$,g[6]+.48,-o*$)}P(r,new E(_[e]),3,`bump`,n)}for(let e of[3,4,5,6]){let t=document.createElement(`canvas`);t.width=256,t.height=128;let r=t.getContext(`2d`);r.font=`700 84px "Noto Sans TC", sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.fillStyle=`#17406d`,r.fillText(`M${e}`,128,64);let i=new F(t);i.colorSpace=S;let a=new x({map:i,transparent:!0,depthTest:!1}),o=new v(a);o.scale.set(.9,.45,1),o.position.set(-.5,g[e],.3),o.renderOrder=10,n.add(o),A[e===6?`top`:e===5?`mid`:`low`].push({obj:o,mat:a})}C.add(new ce(`#ffffff`,`#c8d3e0`,1.6));let a=new ue(`#ffffff`,1.2);a.position.set(4,8,5),C.add(a)}function L(e){let t=Math.min(Math.max(e??0,0),2);Object.assign(j,t===0?{low:1,mid:1,top:1,src:1,bump:1}:t===1?{low:1,mid:.1,top:.08,src:1,bump:.08}:{low:.1,mid:.15,top:1,src:.12,bump:1})}function R(){D=requestAnimationFrame(R);for(let[e,t]of Object.entries(A))for(let n of t)n.mat.opacity+=(j[e]-n.mat.opacity)*.12,n.obj.visible=n.mat.opacity>.01;T.update(),b.render(C,w)}return n(()=>{let e=h.value;b=new le({antialias:!0,preserveDrawingBuffer:!0}),b.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.appendChild(b.domElement),w=new me(34,1,.1,100),w.position.set(7.34,8.19,12.14),pe(),T=new de(w,b.domElement),T.target.set(-.72,-.1,.27),T.enableDamping=!0,T.autoRotate=!0,T.autoRotateSpeed=.5,T.addEventListener(`start`,()=>{T.autoRotate=!1});let t=()=>{let t=e.clientWidth,n=e.clientHeight;b.setSize(t,n),w.aspect=t/n,w.updateProjectionMatrix();for(let e of M)e.resolution.set(t,n)};O=new ResizeObserver(t),O.observe(e),t(),L(m.step??0),R()}),r(()=>m.step,e=>L(e??0)),i(()=>{cancelAnimationFrame(D),O?.disconnect(),T?.dispose(),b?.dispose()}),(e,t)=>(a(),te(`div`,Te,[f(`div`,{ref_key:`host`,ref:h,class:`canvas`},null,512),t[0]||=u(`<div class="legend" data-v-82359871><span data-v-82359871><i class="sw" style="background:#c2413b;" data-v-82359871></i>VDD</span><span data-v-82359871><i class="sw" style="background:#2f6fb3;" data-v-82359871></i>GND</span><span data-v-82359871><i class="src" data-v-82359871></i>負載（電流源）</span><span data-v-82359871><i class="vs" data-v-82359871></i>bump（電壓源）</span><span class="hint" data-v-82359871>拖曳旋轉・滾輪縮放</span></div>`,1)]))}}),[[`__scopeId`,`data-v-82359871`]]),De={class:`cols`,style:{"grid-template-columns":`1.55fr 1fr`,gap:`1.4rem`}},Oe={style:{height:`566px`}},ke={class:`s3`},Ae={class:`stack`},je=_({__name:`slides.md__slidev_4`,setup(n){let{$slidev:r,$nav:i,$clicksContext:u,$clicks:d,$page:m,$renderContext:te,$frontmatter:_}=ne();return u.setup(),(n,r)=>{let i=Ee,u=e;return a(),c(L,ee(t(p(g)(p(_),3))),{default:s(()=>[r[9]||=f(`h1`,null,`IBM power grid benchmark`,-1),f(`div`,De,[f(`div`,Oe,[o(i,{step:p(d)},null,8,[`step`])]),f(`div`,ke,[r[7]||=f(`div`,{class:`chips`},[f(`span`,{class:`chip`},`真實處理器`),f(`span`,{class:`chip`},`8 個`),f(`span`,{class:`chip`},`最多 167 萬節點`)],-1),r[8]||=f(`div`,{class:`pgname`},`pg2 中央一小塊`,-1),f(`div`,Ae,[f(`div`,{class:l([`ly`,{on:p(d)!==1}])},[r[0]||=f(`b`,null,`M6`,-1),f(`span`,{class:l([{show:p(d)===2},`warn`])},`線少、成對`,2)],2),f(`div`,{class:l([`ly`,{on:p(d)===0}])},[...r[1]||=[f(`b`,null,`M5`,-1)]],2),f(`div`,{class:l([`ly`,{on:p(d)!==2}])},[...r[2]||=[f(`b`,null,`M4`,-1)]],2),f(`div`,{class:l([`ly`,{on:p(d)!==2}])},[...r[3]||=[f(`b`,null,`M3`,-1)]],2)]),f(`div`,{class:l([`row`,{on:p(d)>=1}])},[...r[4]||=[f(`span`,{class:`k`},`負載`,-1),f(`span`,{class:`arr`},`→`,-1),f(`span`,{class:`v src`},`電流源`,-1),f(`span`,{class:`at`},`M3、M4 交點`,-1)]],2),f(`div`,{class:l([`row`,{on:p(d)>=2}])},[...r[5]||=[f(`span`,{class:`k`},`bump`,-1),f(`span`,{class:`arr`},`→`,-1),f(`span`,{class:`v`},`電壓源`,-1),f(`span`,{class:`at`},`接在 M6`,-1)]],2),f(`div`,{class:l([`sub`,{on:p(d)>=2}])},`2D IC 的 C4 ＝ 我們的 micro bump`,2),o(u,{style:{"margin-top":`auto`}},{default:s(()=>[...r[6]||=[f(`p`,null,[h(`Nassif, "Power Grid Analysis Benchmarks," ASP-DAC 2008。benchmark 是 SPICE netlist：每段 via 到 via 的導線一個電阻，via 為電阻或短路，C4 經 `),f(`span`,{class:`katex`},[f(`span`,{class:`katex-mathml`},[f(`math`,{xmlns:`http://www.w3.org/1998/Math/MathML`},[f(`semantics`,null,[f(`mrow`,null,[f(`mn`,null,`0.25`),f(`mtext`,null,`\xA0`),f(`mi`,{mathvariant:`normal`},`Ω`)]),f(`annotation`,{encoding:`application/x-tex`},`0.25\\ \\Omega`)])])]),f(`span`,{class:`katex-html`,"aria-hidden":`true`},[f(`span`,{class:`katex-base`},[f(`span`,{class:`katex-strut`,style:{height:`0.6833em`}}),f(`span`,{class:`mord`},`0.25`),f(`span`,{class:`mspace`},`\xA0`),f(`span`,{class:`mord`},`Ω`)])])]),h(` 接到理想電壓源（VDD 1.8 V）；負載是人造的 block 電流，不是實際功耗。圖為 ibmpg2 晶片中央 960 × 550（檔案座標單位）；圖中 4 個 bump 是挑選的 M6 節點，只為示意。`)],-1)]]),_:1})])])]),_:1},16)}}},[[`__scopeId`,`data-v-81ffa335`]]);export{je as default};