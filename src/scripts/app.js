/**
 * ==========================================================================
 * MAIN PORTFOLIO APPLICATION
 * Three.js 3D track, bike physics, interactive checkpoints, audio, UI
 * ==========================================================================
 */

(function () {
  'use strict';

  // Import data from window.PortfolioData
  const {
    ICON,
    STOPS,
    NAME,
    LINES,
    STUDIES,
    TOOLS,
    CONCEPTS,
    cvBlobs,
    cvSrc,
    ABOUT,
    TIMELINE,
    SKILLS,
    PHOTOS,
    STACK,
    EMAIL,
    QR_CALL,
    SOCIALS
  } = window.PortfolioData;

/* ---------- track path (stadium) ---------- */
const CX=9.2,RAD=8.7,STR=2*CX;const L=2*STR+2*Math.PI*RAD; // ~91.5 m
// s=0: middle of the +z straight, heading -x (counter-clockwise seen from above)
function pathAt(s){s=((s%L)+L)%L;const half=STR/2,arc=Math.PI*RAD;let x,z,hx,hz;
 if(s<half){x=-s;z=RAD;hx=-1;hz=0;}
 else if(s<half+arc){const a=(s-half)/RAD;x=-CX-RAD*Math.sin(a);z=RAD*Math.cos(a);hx=-Math.cos(a);hz=-Math.sin(a);}
 else if(s<half+arc+STR){const u=s-half-arc;x=-CX+u;z=-RAD;hx=1;hz=0;}
 else if(s<half+2*arc+STR){const a=(s-half-arc-STR)/RAD;x=CX+RAD*Math.sin(a);z=-RAD*Math.cos(a);hx=Math.cos(a);hz=Math.sin(a);}
 else{const u=s-half-2*arc-STR;x=CX-u;z=RAD;hx=-1;hz=0;}
 const curv=(s>=half&&s<half+arc)||(s>=half+arc+STR&&s<half+2*arc+STR)?1/RAD:0;return {x,z,hx,hz,curv};}

/* ---------- renderer ---------- */
const canvas=document.getElementById('c');const mobile=matchMedia('(pointer:coarse)').matches;
const R=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xcfe6f3,60,280);
const camera=new THREE.PerspectiveCamera(42,1,.1,1400);
function resize(){R.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

/* ---------- light: warm, low, cosy ---------- */
const SUN_DIR=new THREE.Vector3(-.55,.5,.67).normalize();
const hemi=new THREE.HemisphereLight(0xd6eaff,0x77704f,.62);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2bd,1.95);sun.castShadow=true;sun.shadow.mapSize.set(mobile?2048:4096,mobile?2048:4096);
Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;
sun.position.copy(SUN_DIR).multiplyScalar(50);scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xffd8e4,.3);fill.position.set(30,12,-20);scene.add(fill);

/* ---------- sky ---------- */
const MOON_DIR=new THREE.Vector3(.3,.17,-.94).normalize(); // fixed in the sky, low over the far side of the track
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{uSun:{value:SUN_DIR},uMoon:{value:MOON_DIR},uTime:{value:0},uNight:{value:0}},
 vertexShader:`varying vec3 vDir;void main(){vDir=normalize(position);vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}`,
 fragmentShader:`uniform vec3 uSun;uniform vec3 uMoon;uniform float uTime;uniform float uNight;varying vec3 vDir;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float h3(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
  float stars(vec3 d,float scale,float thr,float rad){vec3 q=d*scale;vec3 id=floor(q);vec3 f=fract(q)-.5;float r=h3(id);if(r<thr)return 0.;vec3 o=vec3(h3(id+1.7),h3(id+3.1),h3(id+5.3))-.5;float dd=length(f-o*.6);float tw=.65+.35*sin(uTime*(1.5+r*3.)+r*60.);return smoothstep(rad,0.,dd)*tw*(.45+.55*h3(id+9.));}
  void main(){vec3 d=normalize(vDir);float y=max(d.y,0.);float N=uNight;float dusk=sin(clamp(N,0.,1.)*3.14159);
   // day
   vec3 zen=vec3(.20,.47,.86),mid=vec3(.45,.70,.93),hor=vec3(.84,.91,.96);
   vec3 c=mix(hor,mid,smoothstep(0.,.22,y));c=mix(c,zen,smoothstep(.22,.85,y));
   float sd=max(dot(d,uSun),0.);
   c=mix(c,vec3(1.,.9,.82),pow(1.-y,5.)*.3*(.3+.7*sd));
   // night palette
   vec3 nz=vec3(.012,.025,.075),nm=vec3(.03,.06,.16),nh=vec3(.10,.13,.27);
   vec3 cn=mix(nh,nm,smoothstep(0.,.25,y));cn=mix(cn,nz,smoothstep(.25,.9,y));
   c=mix(c,cn,smoothstep(.15,.85,N));
   // dusk glow along the horizon, strongest towards the sun
   vec3 duskCol=mix(vec3(1.,.48,.30),vec3(.85,.42,.62),smoothstep(.2,.8,N));
   c=mix(c,duskCol,dusk*pow(1.-y,4.)*(.35+.65*pow(sd,1.5))*.85);
   c+=(vec3(1.,.84,.6)*pow(sd,10.)*.3+vec3(1.,.97,.9)*pow(sd,500.)*4.)*(1.-smoothstep(.2,.6,N));
   c+=vec3(1.,.55,.3)*pow(sd,6.)*.35*dusk;
   // stars + milky way
   float sv=smoothstep(.45,.9,N)*smoothstep(0.,.12,y);
   float band=exp(-pow(dot(d,normalize(vec3(.35,.25,.9))),2.)*14.);
   float mw=band*fbm(d.xz*6.+d.y*3.)*.55;
   c+=vec3(.55,.6,.9)*mw*sv*.35;
   c+=vec3(1.)*(stars(d,120.,.94,.28)*1.3+stars(d,60.,.97,.22)*1.8+stars(d,260.,.9,.38)*.8*(.6+band)+stars(d,500.,.85,.45)*.35)*sv;
   c+=vec3(.78,.84,1.)*stars(d,40.,.985,.13)*1.8*sv;
   // moon
   float md=dot(d,uMoon);float disc=smoothstep(.99958,.99966,md);
   vec2 mp=vec2(dot(d,normalize(cross(uMoon,vec3(0,1,0)))),d.y-uMoon.y)*320.;
   float maria=.55+.5*smoothstep(.35,.7,fbm(mp*.45+3.));
   float mv=smoothstep(.35,.85,N);
   c=mix(c,vec3(.86,.84,.76)*maria,disc*mv);
   c+=vec3(.55,.65,.95)*(pow(max(md,0.),1400.)*.45+pow(max(md,0.),90.)*.12)*mv;
   // clouds
   vec2 uv=d.xz/(y+.12)*.9+vec2(uTime*.01,uTime*.004);
   float cl=fbm(uv*1.3);float body=smoothstep(.5,.8,cl)*smoothstep(.0,.18,y);
   float shade=fbm(uv*1.3+vec2(.05,.05));
   vec3 cc=mix(vec3(.82,.85,.93),vec3(1.),smoothstep(.45,.75,shade))+vec3(1.,.88,.7)*pow(sd,4.)*.4;
   vec3 ccDusk=mix(vec3(.75,.45,.5),vec3(1.,.7,.55),smoothstep(.45,.75,shade));
   vec3 ccNight=mix(vec3(.07,.09,.17),vec3(.22,.26,.40),smoothstep(.45,.75,shade))+vec3(.35,.42,.6)*pow(max(md,0.),8.)*.5;
   cc=mix(cc,ccDusk,dusk*.8);cc=mix(cc,ccNight,smoothstep(.5,.9,N));
   // (no clouds)
   if(d.y<0.){vec3 g=mix(vec3(.74,.84,.9),vec3(.05,.07,.14),smoothstep(.2,.8,N));c=mix(mix(hor,nh,smoothstep(.15,.85,N)),g,smoothstep(0.,-.3,d.y));}
   gl_FragColor=vec4(c,1.);}`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(1100,48,24),skyMat);sky.frustumCulled=false;scene.add(sky);
// Procedural cumulus textures: lumpy silhouette from overlapping puffs, eroded by noise, lit from above (bright crowns, grey-blue undersides).
function makeCloudTex(seed,W,H){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const img=x.createImageData(W,H);const D=img.data;
 let r=seed*9301+49297;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280;};
 const puffs=[];const n=9+Math.floor(rnd()*6);
 for(let i=0;i<n;i++){const t=(i+.5)/n;const cx=W*(.12+.76*t+(rnd()-.5)*.08);const rad=H*(.18+.22*Math.sin(t*Math.PI)*(.7+rnd()*.6));const cy=H*.72-rad*(.55+rnd()*.35);puffs.push([cx,cy,rad]);}
 for(let i=0;i<5;i++){const cx=W*(.25+rnd()*.5),rad=H*(.12+rnd()*.12);puffs.push([cx,H*.72-rad*.3,rad]);}
 const hs=(a,b)=>{const v=Math.sin(a*127.1+b*311.7+seed*17.3)*43758.5453;return v-Math.floor(v);};
 const vn=(px,py)=>{const ix=Math.floor(px),iy=Math.floor(py),fx=px-ix,fy=py-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);const a=hs(ix,iy),b=hs(ix+1,iy),cc=hs(ix,iy+1),d=hs(ix+1,iy+1);return a+(b-a)*u+(cc-a)*v+(a-b-cc+d)*u*v;};
 const fb=(px,py)=>{let v=0,am=.5;for(let o=0;o<5;o++){v+=am*vn(px,py);px*=2.03;py*=2.03;am*=.5;}return v;};
 for(let y=0;y<H;y++)for(let x2=0;x2<W;x2++){let f=0,top=1e9;
  for(const p of puffs){const dx=(x2-p[0])/p[2],dy=(y-p[1])/p[2];const d=dx*dx+dy*dy;if(d<1.6){f=Math.max(f,1-d/1.6);}}
  const base=1-Math.min(1,Math.max(0,(y-H*.7)/(H*.06)));f*=base;
  const nz=fb(x2/W*7,y/H*3.5);const dens=f*1.35+(nz-.5)*.9;let a=Math.min(1,Math.max(0,(dens-.18)/.5));
  if(a<=0){continue;}
  // lighting: brighter towards the top, shadowed at the base and inside folds
  const vert=1-y/H;const fold=fb(x2/W*14+9,y/H*7+3);const light=Math.min(1,.64+vert*.45+(fold-.5)*.28+(f>.6?.06:0));
  const k=(y*W+x2)*4;D[k]=255*Math.min(1,light*1.02);D[k+1]=255*Math.min(1,light*1.0);D[k+2]=255*Math.min(1,light*.96+.06);D[k+3]=255*a*a*(3-2*a);}
 x.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.minFilter=THREE.LinearMipmapLinearFilter;return t;}
const CLOUD_TEX=[]; // clouds removed: clear sky by day, stars by night
const clouds=new THREE.Group();scene.add(clouds);
function addCloud(a,d,y,w){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:CLOUD_TEX[Math.floor(Math.random()*CLOUD_TEX.length)],transparent:true,opacity:.97,depthWrite:false,fog:false,color:0xffffff}));
 s.scale.set(w,w*.5,1);s.position.set(Math.cos(a)*d,y,Math.sin(a)*d);s.userData={a,d,v:.0015+Math.random()*.003};clouds.add(s);return s;}
// a low bank of cumulus all around the horizon

// a few bigger towers higher up


/* ---------- countryside around the stadium (hides the model's edges) ---------- */
function hash(x,z){const v=Math.sin(x*12.9898+z*78.233)*43758.5453;return v-Math.floor(v);}
function vnoise(x,z){const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz;const u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);const a=hash(ix,iz),b=hash(ix+1,iz),c=hash(ix,iz+1),d=hash(ix+1,iz+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
const OUT=10.9;
function stadiumDist(x,z){const qx=Math.max(Math.abs(x)-CX,0);return Math.hypot(qx,z)-OUT;}
function terrainY(x,z){const dd=Math.max(0,stadiumDist(x,z));const s=Math.min(1,Math.max(0,(dd-5)/45));const ss=s*s*(3-2*s);
 return -.06+ss*Math.max(-1,(vnoise(x*.03,z*.03)-.4)*12+(vnoise(x*.1+3,z*.1)-.5)*3)+Math.max(0,dd-110)*.1;}
function upFacing(g){g.computeVertexNormals();const n=g.attributes.normal;let sy=0;for(let i=0;i<n.count;i++)sy+=n.getY(i);if(sy<0){const ix=g.index.array;for(let i=0;i<ix.length;i+=3){const t=ix[i+1];ix[i+1]=ix[i+2];ix[i+2]=t;}g.index.needsUpdate=true;g.computeVertexNormals();}return g;}
let hillsMat=null;const lampMats=[],capMats=[],bannerMats=[];
function buildCountry(grass){
 const rings=[-.25,.3,1,2,3.5,5.5,8,11,15,20,26,33,41,50,61,74,90,110,135,165,200,250,320,420,520];const seg=200,pos=[],col=[],idx=[];
 for(let r=0;r<rings.length;r++){const o=rings[r],Rr=OUT+o;
  for(let i=0;i<=seg;i++){const t=i/seg;// walk the stadium outline
   const per=2*2*CX+2*Math.PI*Rr;let u=t*per,x,z;const q=2*CX;
   if(u<q){x=-CX+u;z=-Rr;}else if(u<q+Math.PI*Rr){const a=(u-q)/Rr;x=CX+Rr*Math.sin(a);z=-Rr*Math.cos(a);}else if(u<2*q+Math.PI*Rr){x=CX-(u-q-Math.PI*Rr);z=Rr;}else{const a=(u-2*q-Math.PI*Rr)/Rr;x=-CX-Rr*Math.sin(a);z=Rr*Math.cos(a);}
   const y=r===0?-.08:terrainY(x,z);pos.push(x,y,z);const k=.88+vnoise(x*.13,z*.13)*.24,w=Math.min(1,o/140);const c=grass.clone().multiplyScalar(k).lerp(new THREE.Color(0x93a65a),w*.35);col.push(c.r,c.g,c.b);}}
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<seg;i++){const a=r*(seg+1)+i,b=a+1,c=a+seg+1,d=c+1;idx.push(a,c,b,b,c,d);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);upFacing(g);
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));m.receiveShadow=true;scene.add(m);
 // a low white fence around the track
 const fence=new THREE.Group();const fm=new THREE.MeshStandardMaterial({color:0xf4f1ea,roughness:.8});const pg=new THREE.BoxGeometry(.08,.7,.08);pg.translate(0,.35,0);
 const N=140;const posts=new THREE.InstancedMesh(pg,fm,N);const dm=new THREE.Object3D();
 for(let i=0;i<N;i++){const p=pathAtR(i/N,OUT+1.3);dm.position.set(p.x,-.05,p.z);dm.rotation.set(0,0,0);dm.updateMatrix();posts.setMatrixAt(i,dm.matrix);}
 posts.castShadow=true;fence.add(posts);
 const railPts=[];for(let i=0;i<=N;i++){const p=pathAtR(i/N,OUT+1.3);railPts.push(new THREE.Vector3(p.x,.6,p.z));}
 const rail=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts,true),280,.035,6,true),fm);rail.castShadow=true;fence.add(rail);scene.add(fence);

}
function pathAtR(t,Rr){const q=2*CX,per=2*q+2*Math.PI*Rr;let u=t*per,x,z;
 if(u<q){x=-CX+u;z=-Rr;}else if(u<q+Math.PI*Rr){const a=(u-q)/Rr;x=CX+Rr*Math.sin(a);z=-Rr*Math.cos(a);}else if(u<2*q+Math.PI*Rr){x=CX-(u-q-Math.PI*Rr);z=Rr;}else{const a=(u-2*q-Math.PI*Rr)/Rr;x=-CX-Rr*Math.sin(a);z=Rr*Math.cos(a);}return {x,z};}

/* ---------- stop gates on the track ---------- */
function labelTex(txt,bg){const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,1024,256);x.fillStyle='rgba(255,255,255,.22)';x.fillRect(0,0,1024,22);x.strokeStyle='#fff';x.lineWidth=14;x.strokeRect(7,7,1010,242);
 x.font='150px "Irish Grover", "Comic Sans MS", cursive';x.textAlign='center';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.28)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#fff';x.fillText(txt,512,142);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function buildGates(){STOPS.forEach(st=>{const p=pathAt(st.f*L);const g=new THREE.Group();g.position.set(p.x,0,p.z);g.rotation.y=Math.atan2(p.hx,p.hz);
 const pm=new THREE.MeshStandardMaterial({color:0xfaf6ef,roughness:.6});const w=3.6;
 [-1,1].forEach(sd=>{const post=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,3.4,10),pm);post.position.set(sd*w/2,1.7,0);post.castShadow=true;g.add(post);
   const capM=new THREE.MeshStandardMaterial({color:st.color,emissive:new THREE.Color(st.color),emissiveIntensity:0});capMats.push(capM);const cap=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),capM);cap.position.set(sd*w/2,3.45,0);g.add(cap);});
 const tex=labelTex(st.name,st.color);const bm1=new THREE.MeshStandardMaterial({map:tex,roughness:.7,emissive:0xffffff,emissiveMap:tex,emissiveIntensity:0}),bm2=bm1.clone();bannerMats.push(bm1,bm2);const ban=new THREE.Mesh(new THREE.BoxGeometry(w-.1,.8,.06),[pm,pm,pm,pm,bm1,bm2]);ban.position.y=2.9;ban.castShadow=true;g.add(ban);
 // finish-line style stripe
 const cv=document.createElement('canvas');cv.width=256;cv.height=32;const x=cv.getContext('2d');for(let i=0;i<16;i++){x.fillStyle=i%2?'#fff':st.color;x.fillRect(i*16,0,16,16);x.fillStyle=i%2?st.color:'#fff';x.fillRect(i*16,16,16,16);}
 const lt=new THREE.CanvasTexture(cv);lt.encoding=THREE.sRGBEncoding;const line=new THREE.Mesh(new THREE.PlaneGeometry(w,.45),new THREE.MeshStandardMaterial({map:lt,roughness:.9,polygonOffset:true,polygonOffsetFactor:-2}));line.rotation.x=-Math.PI/2;line.position.y=.012;line.receiveShadow=true;g.add(line);
 scene.add(g);st.gate=g;});}

/* ---------- night: floodlights, fireflies, transition ---------- */
const glowTex=(function(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,244,220,.55)');g.addColorStop(1,'rgba(255,240,210,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
const flood=[];
function plantTrees(models){const dm=new THREE.Object3D(),M=new THREE.Matrix4();const counts=mobile?[70,60,50,40]:[150,120,100,80];const placed=[];
 models.forEach((g,k)=>{const parts=[];g.scene.updateMatrixWorld(true);g.scene.traverse(o=>{if(o.isMesh)parts.push(o);});
  const box=new THREE.Box3().setFromObject(g.scene);const h0=box.max.y-box.min.y||1;const base=[4.6,6,5.2,3.6][k]/h0;
  const ims=parts.map(o=>{const im=new THREE.InstancedMesh(o.geometry,o.material,counts[k]);im.castShadow=true;im.receiveShadow=true;return {o,im};});
  let n=0;for(let t=0;t<9000&&n<counts[k];t++){const a=Math.random()*Math.PI*2,dist=30+Math.pow(Math.random(),1.1)*170;const x=Math.cos(a)*(OUT+dist+CX*Math.abs(Math.cos(a))),z=Math.sin(a)*(OUT+dist);
   if(stadiumDist(x,z)<30)continue;let ok=true;for(const q of placed){if((q[0]-x)**2+(q[1]-z)**2<6){ok=false;break;}}if(!ok)continue;placed.push([x,z]);
   const sc=base*(.75+Math.random()*.6);dm.position.set(x,terrainY(x,z)-.15,z);dm.rotation.set(0,Math.random()*6.28,0);dm.scale.set(sc,sc*(.9+Math.random()*.25),sc);dm.updateMatrix();
   ims.forEach(({o,im})=>{M.multiplyMatrices(dm.matrix,o.matrixWorld);im.setMatrixAt(n,M);});n++;}
  ims.forEach(({im})=>{im.count=n;scene.add(im);});});}
function buildFloodlights(){
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{
  const n=new THREE.Vector3(-sx*.7,-.17,-sz*.7).normalize();           // panels face the pitch
  const head=new THREE.Vector3(sx*12.62,5.62,sz*10.95).addScaledVector(n,.32); // just in front of the lamp grid
  const tgt=new THREE.Object3D();tgt.position.set(sx*3.5,0,sz*2);scene.add(tgt);
  const sp=new THREE.SpotLight(0xfff0d2,0,62,.62,.55,1.2);sp.position.copy(head);sp.target=tgt;scene.add(sp);
  const coneG=new THREE.ConeGeometry(7.5,16,32,1,true);coneG.translate(0,-8,0);coneG.rotateX(-Math.PI/2);
  const coneM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uI:{value:0}},
   vertexShader:`varying float vT;void main(){vT=clamp(position.z/16.,0.,1.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform float uI;varying float vT;void main(){float a=pow(1.-vT,1.6)*.0825*uI;gl_FragColor=vec4(vec3(1.,.93,.78)*a,a);}`});
  const cone=new THREE.Mesh(coneG,coneM);cone.position.copy(head);cone.lookAt(tgt.position);scene.add(cone);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xfff3dc,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));glow.position.copy(head).addScaledVector(n,.15);glow.scale.set(3.4,3.4,1);scene.add(glow);
  // our own mast (pole + lamp head) so it can fade when the camera passes close
  const mast=new THREE.Group();const mats=[];const M=(o)=>{const m=new THREE.MeshStandardMaterial(Object.assign({transparent:true,opacity:1},o));mats.push(m);return m;};
  const base=new THREE.Vector3(sx*12.95,0,sz*11.3);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.11,.17,5.5,10),M({color:0x7d838a,roughness:.6,metalness:.4}));pole.position.set(base.x,2.75,base.z);pole.castShadow=true;mast.add(pole);
  const headG=new THREE.Group();headG.position.copy(head).addScaledVector(n,-.32);headG.lookAt(head.clone().add(n));
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.75,.22),M({color:0x3e4247,roughness:.7,metalness:.3}));frame.position.z=-.08;frame.castShadow=true;headG.add(frame);
  const lampM=M({color:0x9da3a9,roughness:.4,emissive:0xfff1d0,emissiveMap:lampGrid(),emissiveIntensity:0});lampMats.push(lampM);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(1.36,1.6),lampM);face.position.z=.04;headG.add(face);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.6),mats[0]);arm.position.set(0,-.95,-.25);headG.add(arm);
  mast.add(headG);scene.add(mast);
  flood.push({sp,coneM,glow,head,n,mats,base,fade:1});});}
function lampGrid(){const c=document.createElement('canvas');c.width=128;c.height=150;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,128,150);
 for(let r=0;r<4;r++)for(let q=0;q<4;q++){const g=x.createRadialGradient(18+q*31,20+r*37,2,18+q*31,20+r*37,14);g.addColorStop(0,'#fff');g.addColorStop(.6,'#fff6e2');g.addColorStop(1,'#222');x.fillStyle=g;x.fillRect(5+q*31,6+r*37,26,30);}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
const FF=mobile?50:110;const ffGeo=new THREE.BufferGeometry();const ffp=new Float32Array(FF*3),ffd=[];
for(let i=0;i<FF;i++){const a=Math.random()*Math.PI*2,r=4+Math.random()*16;ffp[i*3]=Math.cos(a)*r*1.4;ffp[i*3+1]=.3+Math.random()*2.4;ffp[i*3+2]=Math.sin(a)*r;ffd.push([Math.random()*6.28,.3+Math.random()*.6]);}
ffGeo.setAttribute('position',new THREE.BufferAttribute(ffp,3));
const fireflies=new THREE.Points(ffGeo,new THREE.PointsMaterial({map:glowTex,color:0xd8ff8c,size:.32,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));scene.add(fireflies);
let night=0,nightTarget=0,nightRate=1/22,dwell=0,autoNight=false;
const C={dayFog:new THREE.Color(0xcfe6f3),nightFog:new THREE.Color(0x141d36),duskFog:new THREE.Color(0xe7b9a8),
 sunDay:new THREE.Color(0xffe2bd),sunDusk:new THREE.Color(0xff9a62),moon:new THREE.Color(0x9fb6ff),
 hemiSkyDay:new THREE.Color(0xd6eaff),hemiSkyNight:new THREE.Color(0x3a4c86),hemiGroundDay:new THREE.Color(0x77704f),hemiGroundNight:new THREE.Color(0x1a1c26),
 cloudDay:new THREE.Color(0xffffff),cloudDusk:new THREE.Color(0xf7b49a),cloudNight:new THREE.Color(0x3a4568),white:new THREE.Color(0xffffff),hillsNight:new THREE.Color(0x232c4a)};
const _v=new THREE.Vector3(),_c=new THREE.Color();
function lerp3(a,b,c,t){return t<.5?_c.copy(a).lerp(b,t*2):_c.copy(b).lerp(c,(t-.5)*2);}
function applyNight(n){const dusk=Math.sin(Math.min(1,n)*Math.PI);
 skyMat.uniforms.uNight.value=n;
 scene.fog.color.copy(lerp3(C.dayFog,C.duskFog,C.nightFog,n));
 hemi.intensity=.62-.47*n;hemi.color.copy(C.hemiSkyDay).lerp(C.hemiSkyNight,n);hemi.groundColor.copy(C.hemiGroundDay).lerp(C.hemiGroundNight,n);

 sun.color.copy(lerp3(C.sunDay,C.sunDusk,C.moon,n));sun.intensity=n<.6?1.95+(.5-1.95)*(n/.6):.5+(.38-.5)*((n-.6)/.4);
 fill.intensity=.3*(1-n);
 R.toneMappingExposure=1+.05*n;
 clouds.children.forEach(c=>{c.material.color.copy(lerp3(C.cloudDay,C.cloudDusk,C.cloudNight,n));c.material.opacity=.97-.25*n;});
 if(hillsMat)hillsMat.color.copy(C.white).lerp(C.hillsNight,n);
 const L=THREE.MathUtils.smoothstep(n,.45,.8);
 lampMats.forEach(m=>m.emissiveIntensity=L*2.25);capMats.forEach(m=>m.emissiveIntensity=L*1.6);bannerMats.forEach(m=>m.emissiveIntensity=L*.55);
 flood.forEach(f=>{f.sp.intensity=L*1.95;f.L=L;});
 fireflies.material.opacity=THREE.MathUtils.smoothstep(n,.7,1);
 petals.material.emissiveIntensity=.3+.5*n;petals.material.color.setScalar(1-.45*n);
 document.body.classList.toggle('night',n>.5);
 BTN_C.copy(BTN_DAY).lerp(BTN_NIGHT,n);document.documentElement.style.setProperty('--btn','#'+BTN_C.getHexString());}
const BTN_DAY=new THREE.Color('#a8cc88'),BTN_NIGHT=new THREE.Color('#2f4d43'),BTN_C=new THREE.Color();
const lightDir=SUN_DIR.clone();
function setNight(on,rate){nightTarget=on?1:0;nightRate=rate;const b=document.getElementById('btnNight');if(b){b.setAttribute('aria-pressed',on?'true':'false');b.innerHTML=on?SVG.sun:SVG.moon;b.setAttribute('aria-label',on?'Day mode':'Night mode');b.title=on?'Back to day':'Night mode';}}
const ICON_MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
const ICON_SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
function nightToast(txt){const t=document.getElementById('toast');t.textContent=txt;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),3600);}

/* ---------- petals flying towards the rider ---------- */
const PET=mobile?70:130;
const petalGeo=(function(){const g=new THREE.PlaneGeometry(.075,.055,2,1);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i);p.setZ(i,Math.abs(x)*.25);p.setY(i,p.getY(i)*(1-Math.abs(x)*2.6));}g.computeVertexNormals();return g;})();
const petals=new THREE.InstancedMesh(petalGeo,new THREE.MeshStandardMaterial({side:THREE.DoubleSide,roughness:.6,emissive:0x3a1020,emissiveIntensity:.3}),PET);petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);petals.frustumCulled=false;scene.add(petals);
const PC=[0xffc2d4,0xffaac3,0xffd9e5,0xf68fb0,0xfff0f5],LC=[0xa8cc72,0xd9b44a,0xc9e08f];const pts=[];const dm=new THREE.Object3D();
for(let i=0;i<PET;i++){petals.setColorAt(i,new THREE.Color(i%6===0?LC[i%3]:PC[i%5]));pts.push({x:0,y:0,z:0,rx:Math.random()*6,ry:Math.random()*6,rz:Math.random()*6,ph:Math.random()*6.28,spin:1+Math.random()*2.5,s:.7+Math.random()*.6,live:false});}

/* ---------- rider ---------- */
const riderRoot=new THREE.Group();scene.add(riderRoot);const lean=new THREE.Group();riderRoot.add(lean);
let mixer=null,ride=null;

/* ---------- loading ---------- */
const loader=new THREE.GLTFLoader();
const lbar=document.getElementById('lbar'),ltxt=document.getElementById('ltxt');const progress={};
function upd(){const v=Object.values(progress);const p=v.reduce((a,b)=>a+b,0)/2;lbar.style.width=Math.round(p*100)+'%';}
// Load models using AssetLoader with fallback to inline buffers if present
function load(id){
  return window.AssetLoader.loadModel(loader, id).then(g => {
    progress[id] = 1;
    upd();
    return g;
  });
}
Promise.all([
 load('m-track').then(g=>{let grass=new THREE.Color(0x4f8a2a);g.scene.traverse(o=>{if(!o.isMesh)return;o.receiveShadow=true;o.castShadow=true;const nm=(o.material.name||'');if(nm==='Grass'&&o.material.color)grass=o.material.color.clone();if(nm==='Lights'||nm==='Metal'){o.visible=false;}});
   if(grass.r+grass.g+grass.b>2.4)grass.setHex(0x5f9a30);scene.add(g.scene);buildCountry(grass);buildFloodlights();return (document.fonts?document.fonts.load('150px "Irish Grover"').catch(()=>{}):Promise.resolve()).then(buildGates);}),
 Promise.all(['m-t1','m-t2','m-t3','m-t4'].map(id=>load(id))).then(plantTrees).catch(()=>{}),
 load('m-rider').then(g=>{const m=g.scene;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;}});m.scale.setScalar(.8);m.position.z=.33*.8;lean.add(m);
   mixer=new THREE.AnimationMixer(m);if(g.animations[0]){ride=mixer.clipAction(g.animations[0]);ride.play();}})
]).then(()=>{ltxt.textContent='Ready';startLines();const ld=document.getElementById('load');ld.style.opacity=0;setTimeout(()=>ld.remove(),800);ready=true;autoSound();showKeyHint();}).catch(err=>{ltxt.innerHTML='The ride did not load ('+(err&&err.message||'network error')+'). <button id="retry" style="margin-left:6px;padding:6px 14px;border-radius:999px;background:#d9587f;color:#fff;font-weight:900">Retry</button>';document.getElementById('retry').onclick=()=>location.reload();});

/* ---------- scroll riding with stops ---------- */
let ready=false,s=0,target=0,vel=0,started=false,nearStop=-1;
const stopS=STOPS.map(st=>st.f*L);
function begin(){if(started)return;started=true;document.getElementById('scrollhint').classList.add('gone');keyHint.classList.add('gone');}
const MAXV=6.75;let rv=0; // top speed = holding Shift, whatever the input
function advance(d){if(!ready||cardFor>=0||TP.t>=0)return;begin();autoTo=null;target=Math.max(s-6,Math.min(s+6,target+d));}
addEventListener('wheel',e=>{if(e.target.closest&&e.target.closest('#card'))return;e.preventDefault();const d=(e.deltaMode===1?e.deltaY*30:e.deltaY);advance(Math.max(-3.75,Math.min(3.75,d*.009)));},{passive:false});
let ty=null;addEventListener('touchstart',e=>{if(e.target.closest('#card,#enter,#lap'))return;ty=e.touches[0].clientY;},{passive:true});
addEventListener('touchmove',e=>{if(ty===null)return;const y=e.touches[0].clientY;advance((ty-y)*.03);ty=y;},{passive:true});addEventListener('touchend',()=>ty=null);
// held keys: W / Up ride forward, S / Down ride back, Shift is faster
const keys={};
addEventListener('keydown',e=>{const inCard=e.target.closest&&e.target.closest('#card .body');const k=e.key;
 if(['ArrowUp','ArrowDown','w','W','s','S','Shift'].includes(k)){if(inCard&&k.startsWith('Arrow'))return;if(cardFor<0&&k.startsWith('Arrow'))e.preventDefault();keys[k.length===1?k.toLowerCase():k]=true;}
 if(k==='Escape'&&cardFor>=0)closeCard();
 if((k==='e'||k==='E')&&!e.repeat&&cardFor<0)bellOn();
 if(k==='Enter'&&nearStop>=0&&cardFor<0){e.preventDefault();openCard(nearStop);}});
addEventListener('keyup',e=>{const k=e.key;keys[k.length===1?k.toLowerCase():k]=false;if(k==='e'||k==='E')bellOff();});
addEventListener('blur',()=>bellOff());
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
function keyDir(){if(cardFor>=0)return 0;let d=0;if(keys.ArrowUp||keys.w)d+=1;if(keys.ArrowDown||keys.s)d-=1;return d;}
function rideOn(){closeCard();}
const enterBtn=document.getElementById('enter');let promptFor=-1;
function showEnter(i){const st=STOPS[i];document.getElementById('eName').textContent='View '+st.name;enterBtn.setAttribute('aria-label','View '+st.name+' (Enter)');}
let pStop=-1,pOn=false,pX=0,pY=0;
enterBtn.onclick=()=>{if(nearStop>=0&&cardFor<0)openCard(nearStop);};
// touch: open on the tap itself (the pill moves with the gate, which can make phones drop the click)
enterBtn.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')return;if(nearStop>=0&&cardFor<0){e.preventDefault();openCard(nearStop);}});
// coming back to this tab (from a case study or another app): clear anything left half-finished
function unstick(){if(TP.t===-99||TP.t>=0){TP.t=-1;TP.opened=false;try{lean.scale.set(1,1,1);lean.position.y=0;tpCv.style.display='none';}catch(_){}}
 if(cardFor>=0&&!card.classList.contains('on'))cardFor=-1;for(const k in keys)keys[k]=false;if(typeof bellOff==='function')bellOff();}
addEventListener('pageshow',unstick);document.addEventListener('visibilitychange',()=>{if(!document.hidden)unstick();});addEventListener('focus',unstick);
let autoTo=null;
function jumpTo(i){if(!ready||TP.t>=0||TP.t===-99)return;begin();autoTo=null;closeCard();let p=Math.floor(s/L)*L+stopS[i];if(p-s>L/2)p-=L;if(s-p>L/2)p+=L;
 target=s;rv=0;enterBtn.hidden=true;TP.t=0;TP.to=p;TP.stop=i;TP.jumped=false;TP.opened=false;TP.col=getComputedStyle(document.documentElement).getPropertyValue('--btn').trim()||'#a8cc88';TP.o=riderScreen();}
/* ---------- teleport: the scene dissolves into a dot pattern, rider reappears at the checkpoint ---------- */
const TP={t:-1,to:0,stop:-1};
const tpCv=document.createElement('canvas');tpCv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9;display:none';document.body.appendChild(tpCv);const tpX=tpCv.getContext('2d');
const _rs=new THREE.Vector3();
function riderScreen(){_rs.set(riderRoot.position.x,1,riderRoot.position.z).project(camera);return{x:(_rs.x*.5+.5)*innerWidth,y:(-_rs.y*.5+.5)*innerHeight};}
const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
function drawDots(k,o,cover){const d=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;if(tpCv.width!==W*d||tpCv.height!==H*d){tpCv.width=W*d;tpCv.height=H*d;}
 tpX.setTransform(d,0,0,d,0,0);tpX.clearRect(0,0,W,H);tpX.fillStyle=TP.col;
 const c=Math.max(26,Math.min(44,W/38)),maxD=Math.hypot(Math.max(o.x,W-o.x),Math.max(o.y,H-o.y)),R=c*.74;
 for(let y=c/2;y<H+c;y+=c){const row=Math.round(y/c)%2?c/2:0;for(let x=c/2-row;x<W+c;x+=c){
  const dn=Math.hypot(x-o.x,y-o.y)/maxD;
  // cover spreads inward toward the rider; reveal opens outward from the rider
  const local=Math.max(0,Math.min(1,cover?(k*1.7-(1-dn)*.7):(k*1.7-dn*.7)));
  const r=(cover?ease(local):1-ease(local))*R;if(r<.4)continue;
  tpX.beginPath();tpX.arc(x,y,r,0,6.2832);tpX.fill();}}}
function tpTick(dt,p){if(TP.t<0)return;if(TP.opened)return;TP.t+=dt;const t=TP.t,IN=.55,HOLD=.12,OUT=.7;tpCv.style.display='block';
 if(t<IN){drawDots(t/IN,TP.o,true);return;}
 if(!TP.jumped){TP.jumped=true;s=target=TP.to;rv=0;vel=0;camInit=false;AU.hornAt=[];}
 if(t<IN+HOLD){drawDots(1,TP.o,true);return;}
 const k=Math.min(1,(t-IN-HOLD)/OUT);if(!TP.d)TP.d=riderScreen();drawDots(k,TP.d,false);
 if(k>=1){tpCv.style.display='none';if(!TP.opened){TP.opened=true;const st=TP.stop;TP.t=-99;setTimeout(()=>{if(TP.t===-99){TP.t=-1;try{openCard(st);}catch(err){console.warn('panel',err);}}},250);}}TP.d=k>=1?null:TP.d;}
function rideTo(i){if(!ready)return;begin();closeCard();let p=Math.floor(target/L)*L+stopS[i];if(p<=target+.05)p+=L;autoTo=p;}

/* ---------- card ---------- */
const card=document.getElementById('card'),cBody=document.getElementById('cBody');let cardFor=-1;
// Concepts lives on its own page: open it in a new tab instead of a panel
const conceptsLink=document.createElement('a');conceptsLink.href='work/concepts.html';conceptsLink.target='_blank';conceptsLink.rel='noopener';conceptsLink.hidden=true;document.body.appendChild(conceptsLink);
function openPage(href){const w=window.open(href,'_blank');if(!w)location.href=href;}
function goConcepts(){openPage('work/concepts.html');}
// case studies open in a tab the site itself opens, so their Back button may close it again (phones included)
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[target="_blank"]');if(!a)return;const href=a.getAttribute('href')||'';
 if(!/^work\/[\w-]+\.html$/.test(href)||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();openPage(href);},true);
function openCard(i){if(typeof closeCtlFan==='function')closeCtlFan();const st=STOPS[i];if(st.id==='concepts'){goConcepts();return;}cardFor=i;card.dataset.id=STOPS[i].id;closeMenu();document.getElementById('cKick').textContent=st.kick;document.getElementById('cName').textContent=st.name;
 document.getElementById('cNext').textContent=i<STOPS.length-1?'Next: '+STOPS[i+1].name:'Next: back to the start';render(st.id);card.classList.add('on');veil.classList.add('on');}
const veil=document.createElement('div');veil.id='cardveil';document.body.appendChild(veil);
function closeCard(){veil.classList.remove('on');if(typeof hidePeek==='function')hidePeek();card.classList.remove('on');cardFor=-1;}
document.getElementById('cX').onclick=closeCard;
addEventListener('pointerdown',e=>{if(cardFor>=0&&!e.target.closest('#card,#enter,#nav,#toast'))closeCard();});document.getElementById('cRide').onclick=()=>{closeCard();target+=4;};
const peek=document.createElement('div');peek.id='peek';peek.innerHTML='<div class="pim"></div><div class="pcap"></div>';document.body.appendChild(peek);
function showPeek(b){const x=STUDIES.concat(TOOLS).find(q=>q.id===b.dataset.s);if(!x)return;const im=peek.querySelector('.pim');
 if(x.thumb){im.style.background=`url(${x.thumb}) center/cover`;im.textContent='';}else{im.style.background=`linear-gradient(150deg,${x.c},#cfe3b8)`;im.textContent=x.n;}
 peek.style.setProperty('--tilt',(x.tilt||-5)+'deg');peek.querySelector('.pcap').innerHTML=`${x.n}<span>${x.co} · ${x.yr}</span>`;
 const r=b.getBoundingClientRect(),cr=card.getBoundingClientRect(),w=peek.offsetWidth||300,ph=peek.offsetHeight||240;
 peek.style.left=(cr.left-w-18)+'px';peek.style.top=Math.max(12,Math.min(innerHeight-ph-12,r.top+r.height/2-ph/2))+'px';peek.classList.add('on');}
function hidePeek(){peek.classList.remove('on');qrPop.classList.remove('on');}
const qrPop=document.createElement('div');qrPop.id='qrpop';qrPop.innerHTML=QR_CALL+'<b>Scan to call</b>';document.body.appendChild(qrPop);
function showQR(row){const r=row.getBoundingClientRect(),cr=card.getBoundingClientRect(),ph=qrPop.offsetHeight||230;qrPop.style.left=(cr.left-(qrPop.offsetWidth||186)-18)+'px';qrPop.style.top=Math.max(12,Math.min(innerHeight-ph-12,r.top+r.height/2-ph/2))+'px';qrPop.classList.add('on');}
// About: a pile of polaroids seen from above; drag or tap the top one to send it to the bottom
function initPile(){const pile=cBody.querySelector('#pile');if(!pile)return;let cards=[...pile.children];
 const rot=[-3,4,-6,2,-2,6,-4],off=[[0,0],[-6,4],[7,2],[-3,-5],[5,6],[-8,-2],[4,-6]];
 const base=c=>{const k=+c.dataset.k;return `translate(${off[k%7][0]}px,${off[k%7][1]}px) rotate(${rot[k%7]}deg)`;};
 function layout(){cards.forEach((c,i)=>{c.style.zIndex=cards.length-i;c.style.transform=base(c);c.classList.toggle('top',i===0);});}
 layout();let sx=0,sy=0,dx=0,dy=0,drag=false,top=null,busy=false,used=false;
 // nudge: the top photo shifts aside and back, hinting that it can be moved
 const nudge=()=>{if(used||busy||!pile.isConnected)return;const t=cards[0],D=2600,moved='translate(30px,-3px) rotate(4deg)';
  t.animate([{transform:base(t)},{transform:base(t),offset:.3},{transform:moved,offset:.56},{transform:base(t),offset:.82},{transform:base(t)}],{duration:D,easing:'ease-in-out'});
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  // a cursor drifts in, presses on the photo, drags it right and back, then lets go
  const c=document.createElement('div');c.className='pcur';c.innerHTML='<i></i><svg viewBox="0 0 24 24"><path d="M5 2.5l13.5 12.3-6.2.4 3.7 7.1-2.9 1.4-3.6-7.2L5 20.8z" fill="#8fbf6a" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';pile.appendChild(c);
  c.animate([{transform:'scale(.6)',opacity:0},{transform:'scale(1)',opacity:1,offset:.14},{transform:'scale(1)',opacity:1,offset:.24},{transform:'scale(.78)',opacity:1,offset:.29},{transform:'scale(1)',opacity:1,offset:.36},{transform:'scale(1)',opacity:1,offset:.8},{transform:'scale(.9)',opacity:0}],{duration:D,easing:'ease-out'}).onfinish=()=>c.remove();
  c.querySelector('i').animate([{transform:'scale(.2)',opacity:0},{transform:'scale(.2)',opacity:0,offset:.27},{transform:'scale(1)',opacity:.8,offset:.32},{transform:'scale(1.8)',opacity:0,offset:.48},{transform:'scale(1.8)',opacity:0}],{duration:D});};
 setTimeout(nudge,900);
 const move=e=>{if(!drag)return;dx=e.clientX-sx;dy=e.clientY-sy;top.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/14}deg)`;};
 pile.addEventListener('pointerdown',e=>{if(busy||drag)return;top=cards[0];if(!top.contains(e.target))return;e.preventDefault();used=true;drag=true;sx=e.clientX;sy=e.clientY;dx=dy=0;top.getAnimations().forEach(a=>a.cancel());top.style.transition='none';
  // follow the pointer on the whole window, and always let go on release
  addEventListener('pointermove',move);addEventListener('pointerup',end);addEventListener('pointercancel',end);addEventListener('blur',end);});
 function end(){if(!drag)return;drag=false;removeEventListener('pointermove',move);removeEventListener('pointerup',end);removeEventListener('pointercancel',end);removeEventListener('blur',end);let d=Math.hypot(dx,dy);
  if(d<6){dx=150;dy=-20;d=150;}
  if(d>50){busy=true;const t=top,w=pile.offsetWidth,k=Math.min(1.25,(w*1.05)/d);
   // 1) slide out beside the pile, 2) tuck under it at the bottom of the stack
   t.style.transition='transform .28s cubic-bezier(.2,.7,.3,1)';t.style.transform=`translate(${dx*k}px,${dy*k}px) rotate(${dx/9}deg)`;
   setTimeout(()=>{cards.push(cards.shift());cards.forEach((c,i)=>c.style.zIndex=cards.length-i);t.style.transition='transform .42s cubic-bezier(.3,.8,.3,1)';t.style.transform=base(t);cards.forEach((c,i)=>c.classList.toggle('top',i===0));setTimeout(()=>{t.style.transition='';busy=false;},430);},290);}
  else{top.style.transition='transform .45s cubic-bezier(.3,1.3,.5,1)';layout();setTimeout(()=>{if(!drag)top.style.transition='';},460);}}}
const studyRow=x=>`<${x.url?`a href="${x.url}" target="_blank" rel="noopener" style="text-decoration:none"`:'button'} class="cardx study" data-s="${x.id}"><span class="th logo" style="background:${x.logo?'#fff':x.c}">${x.logo?`<img src="${x.logo}" alt="${x.co} logo">`:x.co[0]}</span><span class="thm" style="${x.thumb?`background-image:url(${x.thumb})`:`background:linear-gradient(150deg,${x.c},#cfe3b8)`}">${x.thumb?'':x.n}</span><span><b>${x.n}</b><em>${x.co} · ${x.yr}</em><small>${x.s}</small></span></${x.url?'a':'button'}>`;
function render(id,sub){hidePeek();let h='';
 if(id==='work'){if(sub){const x=STUDIES.find(q=>q.id===sub);h=`<button class="back" data-back>← All case studies</button><div><h3 style="font-size:28px;margin:0">${x.n}</h3><p style="color:#6b7861">${x.s}</p></div>${x.meta?`<div class="meta">${x.meta.map(m=>`<div><small>${m[0]}</small>${m[1]}</div>`).join('')}</div>`:''}${x.sec.map(q=>`<h3>${q[0]}</h3><p>${q[1]}</p>${q[2]?'<div class="fig">final screens go here</div>':''}`).join('')}`;}
  else h=`<p>Case studies. Pick one to read; the ride waits for you.</p><div class="cards studies">${STUDIES.map(studyRow).join('')}</div><h3>Tools I built for myself</h3><div class="cards studies">${TOOLS.map(studyRow).join('')}</div>`;}
 if(id==='concepts')h=`<p>Visual explorations and side projects without a full write-up.</p><div class="cstrip">${CONCEPTS.map(c=>`<figure class="cs ${c[2]}"><div class="cst"><video data-cv="${c[0]}" muted loop playsinline autoplay aria-label="${c[1]}"></video></div><figcaption><b>${c[1]}</b>${c[4]?`<a href="${c[4]}" target="_blank" rel="noopener">${c[3]} ↗</a>`:'<span>Video</span>'}</figcaption></figure>`).join('')}</div><a class="dl" href="work/concepts.html" target="_blank" rel="noopener">View all concepts<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg></a>`;
 if(id==='about')h=`<div class="pile" id="pile">${PHOTOS.map((p,k)=>`<figure class="pol" data-k="${k}"><img src="${p[0]}" alt="${p[1]}" draggable="false"><figcaption>${p[1]}</figcaption></figure>`).join('')}</div>${ABOUT.map(t=>`<p>${t}</p>`).join('')}`;
 if(id==='resume')h=`<div class="tl">${TIMELINE.map(t=>`<div><b>${t[0]||'·'}</b><span>${t[1]}</span></div>`).join('')}</div><h3>My daily stack</h3><div class="stack">${STACK.map(t=>`<div class="tool"><span class="tlogo">${t[2]?`<img src="${t[2]}" alt="${t[0]} logo">`:t[0].split(' ').map(w=>w[0]).join('')}</span><span><b>${t[0]}</b><small>${t[1]}</small></span></div>`).join('')}</div><a class="dl" href="${RESUME_URL}" download="IshanBiswasResume.pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M5 20h14"/></svg>Download resume</a>`;
 if(id==='contact')h=`<p>Open to data science roles, collaborations and good conversations.</p><div class="clist">
<div class="crow"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg></span><span><small>Email</small><a href="mailto:${EMAIL}" id="em">${EMAIL}</a></span><button class="gpill" id="cp" data-copy="${EMAIL}">Copy</button></div>
<div class="crow phone"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5z"/></svg></span><span><small>Phone</small><a href="tel:${TEL}">${PHONE}</a></span><button class="gpill desk" data-copy="${PHONE}">Copy</button><a class="gpill touch" href="tel:${TEL}">Call</a></div></div>
<h3>Elsewhere</h3><div class="cards">${SOCIALS.map(x=>`<a class="cardx" href="${x[2]}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><span class="th" style="background:none"><img src="${x[3]}" alt="${x[0]}" style="width:100%;height:100%;border-radius:12px;display:block"></span><span><b>${x[0]}</b><small>${x[1]}</small></span></a>`).join('')}</div>`;
 cBody.innerHTML=h;cBody.scrollTop=0;initPile();
 {const ph=cBody.querySelector('.crow.phone');if(ph){ph.onmouseenter=()=>showQR(ph);ph.onmouseleave=hidePeek;}}
 cBody.querySelectorAll('[data-s]').forEach(b=>{const st=STUDIES.concat(TOOLS).find(q=>q.id===b.dataset.s);b.onclick=()=>{hidePeek();if(st&&(st.url||!st.sec))return;render('work',b.dataset.s);};b.onmouseenter=()=>showPeek(b);b.onmouseleave=hidePeek;});const bk=cBody.querySelector('[data-back]');if(bk)bk.onclick=()=>render('work');
 cBody.querySelectorAll('[data-copy]').forEach(btn=>btn.onclick=()=>{const v=btn.dataset.copy;const ok=()=>{btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy',1500);};const sel=()=>{const r=document.createRange();r.selectNodeContents(btn.previousElementSibling);const g=getSelection();g.removeAllRanges();g.addRange(r);};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(ok).catch(sel);else sel();});}

/* ---------- menu, rotating lines, sound ---------- */
document.getElementById('sh').textContent='Scroll to move';
const SVG={
 soundOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3.5L12 5v14l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
 soundOn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3.5L12 5v14l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.6"/><path d="M12 4.5v1.2M12 18.3v1.2M4.5 12h1.2M18.3 12h1.2M6.7 6.7l.85.85M16.45 16.45l.85.85M6.7 17.3l.85-.85M16.45 7.55l.85-.85"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.7A8 8 0 1 1 11.3 4a6.2 6.2 0 0 0 8.7 8.7z" transform="translate(.35 -.35)"/></svg>',
 menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
const pillsEl=document.getElementById('pills');
const PILL_IC={'work':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/></svg>', 'concepts':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>', 'resume':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>', 'about':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>', 'contact':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>'};
pillsEl.innerHTML=STOPS.map((st,i)=>`<button class="pill" data-i="${i}" aria-label="${st.name}"><span class="ic" aria-hidden="true">${PILL_IC[st.id]||''}</span><span class="lb">${st.name}</span></button>`).join('');
// exact label widths, so the slide-out eases to the real size instead of an oversized guess
function measurePills(){pillsEl.querySelectorAll('.pill .lb').forEach(l=>{l.parentNode.style.setProperty('--lw',Math.ceil(l.scrollWidth)+'px');});}
measurePills();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measurePills);addEventListener('resize',measurePills);
pillsEl.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{closeMenu();if(STOPS[+b.dataset.i].id==='concepts'){goConcepts();return;}jumpTo(+b.dataset.i);});
const navEl=document.getElementById('nav'),menuBtn=document.getElementById('menuBtn');
function closeMenu(){navEl.classList.remove('open');menuBtn.innerHTML=SVG.menu;menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');}
menuBtn.onclick=()=>{const o=!navEl.classList.contains('open');if(o){closeCtlFan();if(cardFor>=0)closeCard();}navEl.classList.toggle('open',o);menuBtn.innerHTML=o?SVG.close:SVG.menu;menuBtn.setAttribute('aria-expanded',o);menuBtn.setAttribute('aria-label',o?'Close menu':'Open menu');};
closeMenu();
setNight(false,1/4);document.getElementById('btnNight').innerHTML=SVG.moon;document.getElementById('btnNight').onclick=()=>{autoNight=true;dwell=0;setNight(nightTarget===0,1/4);};
// rotating line under the name
let lineIdx=0,lineTimer=null;const linesEl=document.getElementById('lines');
function drawLine(i){const ln=linesEl.querySelector('.ln');ln.innerHTML=LINES[i].map(t=>`<p>${t}</p>`).join('');}
drawLine(0);document.querySelector('#hero h1').textContent=NAME;
function startLines(){if(lineTimer)return;lineTimer=setInterval(()=>{const ln=linesEl.querySelector('.ln');ln.classList.add('out');setTimeout(()=>{lineIdx=(lineIdx+1)%LINES.length;drawLine(lineIdx);ln.classList.remove('out');},700);},4800);}
// audio: every layer at 20% (ambient) (starts muted). Hold E = bell easter egg
const AU={ctx:null,on:false,master:null,ready:false,lastLapS:0,hornAt:[],bell:null};
const soundBtn=document.getElementById('btnSound');soundBtn.innerHTML=SVG.soundOff;
const AUD={};
['day','night','birds','wheel','horn'].forEach(id=>{
  window.AssetLoader.getBuffer('a-'+id).then(buf => { AUD[id] = buf; });
});
function loopLayer(buf,vol,trim){const C=AU.ctx,s=C.createBufferSource(),g=C.createGain();s.buffer=buf;s.loop=true;if(trim){s.loopStart=.06;s.loopEnd=buf.duration-.06;}g.gain.value=vol;s.connect(g);g.connect(AU.master);s.start(0,trim?.06:0);return{s,g};}
function initAudio(){const C=new (window.AudioContext||window.webkitAudioContext)();AU.ctx=C;AU.master=C.createGain();AU.master.gain.value=0;AU.master.connect(C.destination);
 const dec=k=>window.AssetLoader.getBuffer('a-'+k).then(buf => new Promise((res,rej)=>C.decodeAudioData(buf.slice(0),res,rej)));
 Promise.all(['day','night','birds','wheel','horn'].map(dec)).then(([day,nt,birds,wheel,horn])=>{
  AU.horn=horn;
  AU.day=loopLayer(day,.2*(1-night));AU.night=loopLayer(nt,.2*night);
  AU.birds=loopLayer(birds,.2*(1-night));AU.wheel=loopLayer(wheel,0,true);
  AU.ready=true;planHorns(s);}).catch(e=>console.warn('audio',e));}
function honk(){if(!AU.ready)return;const C=AU.ctx,src=C.createBufferSource(),g=C.createGain();src.buffer=AU.horn;g.gain.value=.2;src.connect(g);g.connect(AU.master);src.start();}
// 2 or 3 honks at random spots per lap
function planHorns(fromS){const n=2+(Math.random()<.5?1:0);AU.hornAt=[];for(let i=0;i<n;i++)AU.hornAt.push(fromS+L*(i+.15+Math.random()*.7)/n);AU.lastLapS=fromS;}
function bellOn(){if(!AU.ready||!AU.on||AU.bell)return;const C=AU.ctx,src=C.createBufferSource(),g=C.createGain();src.buffer=AU.horn;src.loop=true;src.loopEnd=Math.min(AU.horn.duration,2.3);g.gain.value=.2;src.connect(g);g.connect(AU.master);src.start();AU.bell={src,g};}
function bellOff(){if(!AU.bell)return;const{src,g}=AU.bell,t=AU.ctx.currentTime;g.gain.setTargetAtTime(0,t,.04);src.stop(t+.25);AU.bell=null;}
function soundTick(dt,speed){if(!AU.on||!AU.ready)return;const t=AU.ctx.currentTime,day=1-night;
 AU.day.g.gain.setTargetAtTime(.2*day,t,.3);AU.night.g.gain.setTargetAtTime(.2*night,t,.3); // music crossfades with the skyAU.birds.g.gain.setTargetAtTime(.2*day,t,.5);
 const v=Math.abs(speed),k=Math.min(1,v/6.75);
 AU.wheel.g.gain.setTargetAtTime(v>.15?.2:0,t,.12);
 AU.wheel.s.playbackRate.setTargetAtTime(.7+.6*k,t,.15);
 if(v>.5){for(let i=AU.hornAt.length-1;i>=0;i--){if(Math.abs(s-AU.hornAt[i])<.6||(speed>0&&s>AU.hornAt[i])){if(Math.abs(s-AU.hornAt[i])<3)honk();AU.hornAt.splice(i,1);}}}
 if(Math.abs(s-AU.lastLapS)>=L||!AU.hornAt.length&&Math.abs(s-AU.lastLapS)>=L*.5)planHorns(s);}
function setSound(on,save){if(!AU.ctx)initAudio();AU.on=on;if(on&&AU.ctx.state==='suspended')AU.ctx.resume();if(!on)bellOff();AU.master.gain.setTargetAtTime(on?1:0,AU.ctx.currentTime,.4);soundBtn.innerHTML=on?SVG.soundOn:SVG.soundOff;soundBtn.setAttribute('aria-pressed',on);soundBtn.setAttribute('aria-label',on?'Sound off':'Sound on');if(save){try{localStorage.setItem('tayeMuted',on?'0':'1');}catch(e){}}}
soundBtn.onclick=()=>{userMuted=AU.on;setSound(!AU.on,false);};
let prefMuted=false;try{prefMuted=localStorage.getItem('tayeMuted')==='1';}catch(e){}
// sound is on by default; if the browser blocks autoplay, the first click / tap / key press unlocks it silently
const TOUCH_UI=matchMedia('(hover:none),(pointer:coarse),(max-width:1024px)').matches;
function autoSound(){if(prefMuted||TOUCH_UI)return;setSound(true,false);} // phones and tablets start muted; the prompt or speaker button turns sound on
prefMuted=false; // sound starts on for every visit; the speaker button still mutes for the session
function unlock(){if(!AU.ctx&&ready&&!userMuted&&!TOUCH_UI){setSound(true,false);}if(AU.ctx&&AU.on&&AU.ctx.state!=='running')AU.ctx.resume().catch(()=>{});}
let userMuted=false;
['pointerdown','keydown','touchend'].forEach(ev=>addEventListener(ev,unlock,{capture:true,passive:true}));
const gateAnchor=new THREE.Vector3(),khA=new THREE.Vector3();
let closeCtlFan=()=>{};
const keyHint=document.getElementById('keyhint');
const popVeil=document.createElement('div');popVeil.id='popveil';document.body.appendChild(popVeil);
function syncVeil(){const f=document.getElementById('ctlfan');popVeil.classList.toggle('on',navEl.classList.contains('open')||!!(f&&f.classList.contains('open')));}
setInterval(syncVeil,120);
popVeil.addEventListener('pointerdown',e=>{e.preventDefault();if(navEl.classList.contains('open'))closeMenu();const f=document.getElementById('ctlfan');if(f&&f.classList.contains('open'))document.getElementById('btnCtl').click();});
{const btn=document.getElementById('btnCtl'),fan=document.createElement('div');fan.id='ctlfan';document.body.appendChild(fan);
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const K=k=>k.split(' ').map(x=>`<kbd>${x}</kbd>`).join('');
 const items=fine?[['W ↑','Ride'],['Shift W','Faster'],['S ↓','Back'],['E','Ring bell'],['↵','Open checkpoint'],['Scroll','Ride']]
  :[['↑','Swipe up to ride'],['↓','Swipe down to go back'],['View','Open checkpoint']];
 fan.innerHTML=items.map(([k,l])=>`<div class="it"><span class="k">${K(k)}</span><span>${l}</span></div>`).join('');
 const els=[...fan.children];let open=false,t=null;
 function layout(){const r=btn.getBoundingClientRect(),cx=r.left+r.width/2;fan.classList.remove('left');
  fan.style.left=cx+'px';fan.style.top=(r.top-10)+'px';const M=12;
  els.forEach(el=>{el.style.maxWidth=(innerWidth-2*M)+'px';});
  const maxW=Math.max(...els.map(e=>e.offsetWidth));let L0=cx-22;if(L0+maxW>innerWidth-M)L0=innerWidth-M-maxW;if(L0<M)L0=M; // one shared left edge
  let acc=8;els.forEach((el,i)=>{const y=-acc,bend=0,w=el.offsetWidth;acc+=el.offsetHeight+12;
   // start each pill at the button, then nudge it back inside the screen edges
   let lx=L0;const left=false;
   el.style.setProperty('--ox',(lx-cx)+'px');el.style.setProperty('--to',(cx-lx)+'px');
   el.style.setProperty('--x',(left?-bend:bend)+'px');el.style.setProperty('--y',y+'px');el.style.setProperty('--r','0deg');el.style.setProperty('--d',(i*35)+'ms');});}
 function setOpen(v){if(v===open)return;open=v;if(v){closeMenu();if(cardFor>=0)closeCard();layout();}fan.classList.toggle('open',v);btn.setAttribute('aria-expanded',v);}
 if(fine){const enter=()=>{clearTimeout(t);setOpen(true);},leave=()=>{clearTimeout(t);t=setTimeout(()=>setOpen(false),180);};
  btn.addEventListener('mouseenter',enter);btn.addEventListener('mouseleave',leave);fan.addEventListener('mouseenter',enter);fan.addEventListener('mouseleave',leave);
  btn.addEventListener('focus',enter);btn.addEventListener('blur',leave);}
 btn.addEventListener('click',e=>{e.stopPropagation();setOpen(!open);});
 addEventListener('pointerdown',e=>{if(open&&!btn.contains(e.target)&&!fan.contains(e.target))setOpen(false);});
 addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});addEventListener('resize',()=>{if(open)layout();});closeCtlFan=()=>setOpen(false);}
// prompt to unmute, pointing at the speaker button; hides once sound is playing
const sndTip=document.createElement('div');sndTip.className='sndtip';sndTip.setAttribute('role','button');sndTip.tabIndex=0;
sndTip.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3.5L12 5v14l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>Turn on sound for the full ride';document.body.appendChild(sndTip);
const tipOn=()=>{setSound(true,false);userMuted=false;};sndTip.onclick=tipOn;sndTip.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tipOn();}};
let tipDismissed=false,tipShownAt=0;
function placeTip(){const r=soundBtn.getBoundingClientRect(),w=sndTip.offsetWidth,h=sndTip.offsetHeight;let x=r.left+r.width/2-w/2;x=Math.max(12,Math.min(innerWidth-w-12,x));sndTip.style.left=x+'px';sndTip.style.top=(r.top-h-16)+'px';sndTip.style.setProperty('--ax',(r.left+r.width/2-x)+'px');}
setInterval(()=>{if(!ready)return;const playing=AU.ctx&&AU.on&&AU.ctx.state==='running';const fanOpen=document.getElementById('ctlfan');const show=!playing&&!userMuted&&!tipDismissed&&cardFor<0&&!navEl.classList.contains('open')&&!(fanOpen&&fanOpen.classList.contains('open'));if(show){placeTip();if(!tipShownAt)tipShownAt=performance.now();else if(performance.now()-tipShownAt>5000){tipDismissed=true;sndTip.classList.remove('on');return;}}sndTip.classList.toggle('on',show);},400);
addEventListener('resize',()=>{if(sndTip.classList.contains('on'))placeTip();});
function showKeyHint(){if(!started)keyHint.classList.remove('gone');}

/* ---------- loop ---------- */
const clock=new THREE.Clock();const cam=new THREE.Vector3(),look=new THREE.Vector3(),tmp=new THREE.Vector3();let camInit=false,heading=0,leanA=0;
function loop(){requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta()),t=clock.elapsedTime;
 skyMat.uniforms.uTime.value=t;
 if(ready&&!document.hidden){dwell+=dt;if(dwell>120){dwell=0;const toNight=nightTarget===0;setNight(toNight,1/24);nightToast(toNight?'Night is falling over the track':'Morning is breaking over the track');}}
 if(night!==nightTarget){night+=Math.sign(nightTarget-night)*Math.min(Math.abs(nightTarget-night),dt*nightRate);applyNight(night);}
 {const ffa=ffGeo.attributes.position.array;if(fireflies.material.opacity>0){for(let i=0;i<FF;i++){const q=ffd[i];q[0]+=dt*q[1];ffa[i*3]+=Math.cos(q[0]*1.3)*dt*.25;ffa[i*3+1]+=Math.sin(q[0]*2.1)*dt*.15;ffa[i*3+2]+=Math.sin(q[0])*dt*.25;}ffGeo.attributes.position.needsUpdate=true;fireflies.material.size=.22+.1*Math.sin(t*3);}}clouds.children.forEach(c=>{c.userData.a+=c.userData.v*dt*.1;c.position.x=Math.cos(c.userData.a)*c.userData.d;c.position.z=Math.sin(c.userData.a)*c.userData.d;});
 // auto ride (lap bar)
 if(autoTo!==null){const step=Math.min(autoTo-target,dt*10.5);target+=step;if(autoTo-target<.01){target=autoTo;autoTo=null;}}
 const kd=TP.t>=0?0:keyDir();if(kd){begin();autoTo=null;const ahead=target-s;if(Math.abs(ahead)<3)target+=kd*(keys.Shift?6.75:4.1)*dt;}
 const prev=s;{let want=(target-s)*1.95;want=Math.max(-MAXV,Math.min(MAXV,want));rv+=(want-rv)*Math.min(1,dt*5);s+=rv*dt;if(Math.abs(target-s)<.002&&Math.abs(rv)<.05){s=target;rv=0;}}vel=(s-prev)/Math.max(dt,1e-4);
 // rider
 const p=pathAt(s);const h=Math.atan2(p.hx,p.hz);let dh=h-heading;dh=Math.atan2(Math.sin(dh),Math.cos(dh));heading+=dh;
 riderRoot.position.set(p.x,0,p.z);riderRoot.rotation.y=heading;tpTick(dt,p);
 const targetLean=Math.max(-.26,Math.min(.26,(p.curv*vel*vel)*.05+(p.curv?.05:0)))*Math.sign(vel||1);leanA+=(targetLean-leanA)*Math.min(1,dt*4);lean.rotation.z=leanA;
 if(mixer&&ride){ride.setEffectiveTimeScale(Math.max(-2.5,Math.min(2.5,vel/3.2)));mixer.update(dt);}
 // camera: locked to the rider, behind and to the side, so the stadium turns around him
 const fx=Math.sin(heading),fz=Math.cos(heading),rx=-fz,rz=fx;const side=innerWidth<innerHeight?.6:1;
 const asp=camera.aspect,far=1.67*(asp<1?Math.min(1.7,1/Math.max(asp,.45)*.8+.2):asp<1.3?1.12:1);
 const back=10*far,up=3.3*far*(1-.22*night),lat=-3.4*side*far;
 cam.set(p.x-fx*back+rx*lat,up,p.z-fz*back+rz*lat);
 // keep the rider centred, slightly left of centre on wide screens when the card is open
 const shift=(cardFor>=0&&innerWidth>760)?1.4:0;
 const drop=0;
 tmp.set(p.x+fx*1.2+rx*shift*far,1.05+drop+night*1.4,p.z+fz*1.2+rz*shift*far);
 if(!camInit){camera.position.copy(cam);look.copy(tmp);camInit=true;}
 camera.position.lerp(cam,Math.min(1,dt*6));look.lerp(tmp,Math.min(1,dt*6));camera.lookAt(look);
 flood.forEach(f=>{const dc=Math.hypot(camera.position.x-f.base.x,camera.position.z-f.base.z);let fade=THREE.MathUtils.smoothstep(dc,4.5,10);{const ax=camera.position.x,az=camera.position.z,bx=p.x-ax,bz=p.z-az,L2=bx*bx+bz*bz||1;const t=Math.max(0,Math.min(1,((f.base.x-ax)*bx+(f.base.z-az)*bz)/L2));if(t<.97){const d=Math.hypot(f.base.x-(ax+bx*t),f.base.z-(az+bz*t));fade=Math.min(fade,THREE.MathUtils.smoothstep(d,1.6,4.2));}}if(Math.abs(fade-f.fade)>.01||fade<1){f.fade=fade;f.mats.forEach(m=>{m.opacity=fade;m.depthWrite=fade>.98;m.visible=fade>.02;});}
  _v.copy(camera.position).sub(f.head).normalize();const facing=THREE.MathUtils.smoothstep(_v.dot(f.n),-.05,.45);f.glow.material.opacity=(f.L||0)*.71*facing*fade;f.coneM.uniforms.uI.value=(f.L||0)*(.35+.65*fade);});
 sun.target.position.set(p.x,0,p.z);lightDir.copy(SUN_DIR).lerp(MOON_DIR,THREE.MathUtils.smoothstep(night,.35,.75)).normalize();
 sun.position.copy(lightDir).multiplyScalar(50).add(sun.target.position);
 // lap bar
 const m=((s%L)+L)%L;
 let near=-1;stopS.forEach((x,i)=>{let d=Math.abs(x-m);d=Math.min(d,L-d);if(d<5.5)near=i;});nearStop=near;{const act=near>=0?near:(autoTo!==null?stopS.indexOf(((autoTo%L)+L)%L):-1);pillsEl.querySelectorAll('[data-i]').forEach((b,i)=>b.classList.toggle('on',i===act));}
 if(!started){khA.set(riderRoot.position.x,1.1,riderRoot.position.z).project(camera);const hx=(khA.x*.5+.5)*innerWidth,hy=(-khA.y*.5+.5)*innerHeight;
  keyHint.style.left=(hx+60)+'px';keyHint.style.top=hy+'px';
  const sh=document.getElementById('scrollhint');sh.style.left=Math.min(innerWidth-130,hx+40)+'px';sh.style.top=hy+'px';sh.style.bottom='auto';sh.style.transform='translate(0,-50%)';sh.style.alignItems='flex-start';}
 // View prompt: hysteresis (appear within 5.5 m of a gate, leave past 7 m), fade instead of blinking, eased position
 {let cand=-1;stopS.forEach((x,i)=>{let d=Math.abs(x-m);d=Math.min(d,L-d);if(d<(i===pStop?7:5.5))cand=i;});
  let want=cand>=0&&cardFor<0&&TP.t<0&&TP.t!==-99,ex=pX,ey=pY;
  if(want&&STOPS[cand].gate){const g=STOPS[cand].gate;gateAnchor.set(g.position.x,2.05,g.position.z).project(camera);
   if(gateAnchor.z>1)want=false;else{ex=Math.max(90,Math.min(innerWidth-90,(gateAnchor.x*.5+.5)*innerWidth));ey=Math.max(60,Math.min(innerHeight-120,(-gateAnchor.y*.5+.5)*innerHeight));}}
  if(enterBtn.hidden)enterBtn.hidden=false;
  if(want){if(cand!==pStop||!pOn){showEnter(cand);if(!pOn){pX=ex;pY=ey;}}pStop=cand;const k=Math.min(1,dt*16);pX+=(ex-pX)*k;pY+=(ey-pY)*k;enterBtn.style.transform=`translate(${pX}px,${pY}px) translate(-50%,-50%)`;}
  else pStop=-1;
  if(want!==pOn){pOn=want;enterBtn.classList.toggle('on',want);if(want){enterBtn.classList.remove('pop');void enterBtn.offsetWidth;enterBtn.classList.add('pop');}}
  nearStop=pOn?pStop:-1;}
 soundTick(dt,vel);
 // petals: come from ahead and drift past the rider; faster when riding
 const flow=1.1+Math.max(0,vel)*.9;
 for(let i=0;i<PET;i++){const q=pts[i];
  if(!q.live||((q.x-p.x)*fx+(q.z-p.z)*fz)<-4||q.y<0){const a=6+Math.random()*20,l=(Math.random()-.5)*14;q.x=p.x+fx*a+rx*l;q.z=p.z+fz*a+rz*l;q.y=.4+Math.random()*3.6;q.live=true;}
  q.x+=(-fx*flow+Math.sin(t*1.3+q.ph)*.35+.25)*dt;q.z+=(-fz*flow+Math.cos(t*.9+q.ph)*.35)*dt;q.y+=(-.18+Math.sin(t*2+q.ph)*.25)*dt;
  q.rx+=q.spin*dt;q.rz+=q.spin*.7*dt;dm.position.set(q.x,q.y,q.z);dm.rotation.set(q.rx,q.ry,q.rz);dm.scale.setScalar(q.s);dm.updateMatrix();petals.setMatrixAt(i,dm.matrix);}
 petals.instanceMatrix.needsUpdate=true;
 R.render(scene,camera);}
loop();

})();
