import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// An original, procedural character. Geometry is drawn continuously; no pose images.
export function createPortrait(host, onReady = () => {}) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, .1, 30);
  camera.position.set(0, 1.85, 7.8);
  camera.lookAt(0, 1.8, 0);
  scene.add(new THREE.HemisphereLight(0xfff5e8, 0x68716b, 2.0));
  function light(color, intensity, x, y, z, shadow = false) {
    const lamp = new THREE.DirectionalLight(color, intensity);
    lamp.position.set(x, y, z);
    lamp.castShadow = shadow;
    if (shadow) {
      lamp.shadow.mapSize.set(1024, 1024);
      lamp.shadow.camera.left = lamp.shadow.camera.bottom = -3;
      lamp.shadow.camera.right = lamp.shadow.camera.top = 3;
      lamp.shadow.normalBias = .02;
      lamp.shadow.bias = -.0002;
      lamp.shadow.radius = 4;
    }
    scene.add(lamp);
  }
  light(0xffe4c9, 2.2, -3, 5, 5, true);
  light(0xd1e2fc, 1.5, 3, 2, 4);
  light(0xf2ead1, 1.5, 2, 4, -3);

  const character = new THREE.Group();
  scene.add(character);
  const neckPivot = new THREE.Group();
  neckPivot.position.y = 1.42;
  character.add(neckPivot);
  const head = new THREE.Group();
  head.position.y = .8;
  neckPivot.add(head);
  const mat = (color, roughness = .65, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const skin = mat('#bb805b', .7);
  const warmSkin = mat('#a9654b', .74);
  const lips = mat('#955344', .75);
  const hairMat = mat('#14191d', .81);
  const hairAccent = mat('#1e252a', .83);
  const navy = mat('#172e49', .91);
  const collarMat = mat('#223e5a', .86);
  const ink = mat('#232327', .38, { metalness: .24 });
  const eyeWhite = mat('#e3dbcd', .44);
  const irisMat = mat('#503223', .3);
  const pupilMat = mat('#0c1115', .2);
  const white = new THREE.MeshBasicMaterial({ color: '#ffffff' });

  const sphere = new THREE.SphereGeometry(1, 40, 28);
  function ellipsoid(parent, material, position, scale) {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function tube(parent, points, radius, material, segments = 30, radial = 7) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, radial, false), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function patch(parent, points, material) {
    const shape = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 1; i < points.length - 1; i++) vertices.push(...points[0], ...points[i], ...points[i + 1]);
    shape.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    shape.computeVertexNormals();
    const mesh = new THREE.Mesh(shape, material);
    mesh.material.side = THREE.DoubleSide;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Continuous facial surface: chin, cheeks, nose and a softly shaded beard.
  const face = new THREE.SphereGeometry(1, 112, 84);
  const pos = face.attributes.position;
  const colors = [];
  const skinColor = new THREE.Color('#bd815d');
  const beardColor = new THREE.Color('#584139');
  const blush = new THREE.Color('#b57357');
  const gauss = (v, spread) => Math.exp(-v * v / (spread * spread));
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * .73;
    let y = pos.getY(i) * 1.00;
    let z = pos.getZ(i) * .64;
    const front = THREE.MathUtils.smoothstep(z, .1, .46);
    const taper = y < -.2 ? 1 - .045 * Math.min(1, (-y - .2) / .7) : 1;
    x *= taper;
    const nose = .18 * gauss(x, .115) * gauss(y + .075, .23) + .11 * gauss(x, .13) * gauss(y + .2, .09);
    const cheek = .045 * (gauss(x - .39, .2) + gauss(x + .39, .2)) * gauss(y + .15, .23);
    z += front * (nose + cheek + .035 * gauss(x, .25) * gauss(y + .69, .19));
    pos.setXYZ(i, x, y, z);
    const beardLine = -.63 + .57 * Math.pow(Math.abs(x) / .75, 2.5);
    let amount = THREE.MathUtils.smoothstep(beardLine - y, -.08, .11) * .64;
    if (z < -.1) amount *= .25;
    const color = skinColor.clone().lerp(beardColor, amount);
    color.lerp(blush, gauss(Math.abs(x) - .43, .19) * gauss(y + .12, .19) * front * .15);
    colors.push(color.r, color.g, color.b);
  }
  face.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  face.computeVertexNormals();
  const skinFace = mat('#ffffff', .77, { vertexColors: true });
  const faceMesh = new THREE.Mesh(face, skinFace);
  faceMesh.castShadow = faceMesh.receiveShadow = true;
  head.add(faceMesh);
  // Small nostril details sit beneath the integrated nose.
  for (const s of [-1, 1]) {
    ellipsoid(head, warmSkin, [s * .078, -.255, .751], [.031, .014, .02]);
    const ear = ellipsoid(head, skin, [s * .718, -.005, -.013], [.15, .255, .11]);
    ear.rotation.z = s * .11;
    ellipsoid(head, warmSkin, [s * .758, .005, .078], [.073, .16, .027]);
    tube(head, [[s*.78,.12,.104],[s*.805,.015,.12],[s*.766,-.105,.10]], .023, skin);
    ellipsoid(head, skin, [s*.742,-.163,.037],[.08,.086,.08]);
  }

  const eyes = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * .316, .20, .566);
    head.add(eye);
    ellipsoid(eye, eyeWhite, [0, 0, .028], [.199, .119, .096]);
    const gaze = new THREE.Group();
    eye.add(gaze);
    ellipsoid(gaze, irisMat, [0, -.003, .112], [.074, .079, .025]);
    ellipsoid(gaze, pupilMat, [0, -.003, .135], [.046, .052, .012]);
    ellipsoid(gaze, white, [-.025, .028, .146], [.015, .017, .006]).castShadow = false;
    ellipsoid(gaze, white, [.024, -.025, .147], [.006, .007, .004]).castShadow = false;
    tube(eye, [[-.192,0,.05],[-.132,.080,.099],[0,.112,.117],[.132,.080,.099],[.192,0,.05]], .011, warmSkin, 24);
    tube(eye, [[-.192,0,.05],[-.126,-.066,.102],[0,-.084,.113],[.126,-.066,.102],[.192,0,.05]], .008, warmSkin, 24);
    eye.scale.y=.78;
    eyes.push({ eye, gaze });
    // Soft, slightly asymmetric brows.
    tube(head, [[s*.14,.413,.583],[s*.26,.465,.594],[s*.40,.456,.551],[s*.51,.418,.476]], .032, hairMat, 25, 8);
  }

  tube(head, [[-.205,-.463,.564],[-.09,-.485,.609],[0,-.495,.619],[.1,-.482,.607],[.203,-.451,.567]], .011, lips);
  tube(head, [[-.178,-.481,.581],[-.085,-.514,.612],[0,-.52,.62],[.09,-.505,.61],[.18,-.475,.58]], .016, lips);
  for (const s of [-1, 1]) {
    tube(head, [[s*.013,-.399,.63],[s*.086,-.405,.636],[s*.162,-.432,.60],[s*.204,-.447,.564]], .019, hairMat);
  }

  // Lightweight metal glasses, with actual depth and side arms.
  const glasses = new THREE.Group();
  glasses.position.y = .185;
  head.add(glasses);
  for (const s of [-1, 1]) {
    const center = s * .333;
    const rim = [];
    for (let i = 0; i <= 64; i++) {
      const a = i / 64 * Math.PI * 2;
      const x = Math.sign(Math.cos(a)) * Math.pow(Math.abs(Math.cos(a)), .66) * .274;
      const y = Math.sign(Math.sin(a)) * Math.pow(Math.abs(Math.sin(a)), .72) * .206;
      rim.push([center + x, y, .744 - .095 * Math.pow(Math.abs(center + x), 2)]);
    }
    tube(glasses, rim, .009, ink, 80, 7);
    tube(glasses, [[s*.607,.052,.70],[s*.69,.055,.47],[s*.76,.046,.03],[s*.749,-.075,-.08]], .013, ink, 24);
    // Restrained reflection highlight along the upper rim.
    tube(glasses, [[center-.18,.194,.757],[center-.1,.206,.763],[center-.015,.209,.766]], .0035, mat('#879b9e', .24), 12, 5);
  }
  tube(glasses, [[-.062,.045,.758],[-.032,.071,.798],[.032,.071,.798],[.062,.045,.758]], .013, ink);
  glasses.traverse(part=>{if(part.isMesh)part.castShadow=false;});

  // Curly silhouette with individual ringlets, not a spherical helmet.
  const hair = new THREE.Group();
  head.add(hair);
  ellipsoid(hair, hairMat, [0,.62,-.088], [.78,.56,.655]);
  let seed = 83021;
  function random() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
  function ringlet(center, normal, radius, turn, i) {
    const n = new THREE.Vector3(...normal).normalize();
    const u = new THREE.Vector3(0,1,0).cross(n);
    if (u.length() < .1) u.set(1,0,0); else u.normalize();
    const v = new THREE.Vector3().crossVectors(n,u).normalize();
    const base = new THREE.Vector3(...center);
    const points = [];
    const phase = random()*Math.PI*2;
    for (let j = 0; j <= 32; j++) {
      const t=j/32;
      const a=t*Math.PI*2*turn+phase;
      const r=radius*(.38+.65*Math.sin(t*Math.PI));
      const p=base.clone().addScaledVector(u,Math.cos(a)*r).addScaledVector(v,Math.sin(a)*r*.68).addScaledVector(n,.1*Math.sin(t*Math.PI)+t*.055);
      points.push([p.x,p.y,p.z]);
    }
    tube(hair,points,.024+random()*.012,i%4===0?hairAccent:hairMat,36,6);
    ellipsoid(hair,hairMat,center,[radius*.83,radius*.94,radius*.64]);
  }
  const golden = Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<68;i++) {
    const h=.10+.90*(i+.5)/68;
    const a=i*golden;
    const r=Math.sqrt(1-h*h);
    const x=Math.cos(a)*r;
    const z=Math.sin(a)*r;
    const j=(random()-.5)*.06;
    const center=[x*.84,.60+h*.63+j,z*.64-.065];
    ringlet(center,[x+random()*.4-.2,h*.8,z+random()*.4-.2],.115+random()*.035,.82+random()*.35,i);
  }
  // Loose curls around the forehead and temples add the recognizable silhouette.
  for(let i=0;i<8;i++) {
    const x=-.68+i*.192;
    ringlet([x,.67+.08*Math.cos(i*1.9),.49+.07*Math.cos(x*2)],[x*.2,.20,1],.125+random()*.025,1.35,i);
  }
  for(const s of [-1,1]) for(let i=0;i<3;i++) {
    ringlet([s*(.77+.018*i),.26+i*.16,-.005],[s,.15,.45],.104+random()*.02,1.28,i);
  }
  // Bake static curls into two draw calls; their parent still follows the head.
  const hairBatches=new Map();
  for(const child of [...hair.children]) {
    child.updateMatrix();
    const geometry=child.geometry.index?child.geometry.toNonIndexed():child.geometry.clone();
    geometry.applyMatrix4(child.matrix);
    const batch=hairBatches.get(child.material)||{positions:[],normals:[]};
    for(const n of geometry.attributes.position.array)batch.positions.push(n);
    for(const n of geometry.attributes.normal.array)batch.normals.push(n);
    hairBatches.set(child.material,batch);geometry.dispose();hair.remove(child);
  }
  for(const [material,batch] of hairBatches) {
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(batch.positions,3));
    geometry.setAttribute('normal',new THREE.Float32BufferAttribute(batch.normals,3));
    const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;hair.add(mesh);
  }

  const neck = ellipsoid(character,skin,[0,1.155,-.10],[.29,.50,.31]);
  const profileControl = [[-.22,1.21,.49],[.05,1.33,.55],[.40,1.38,.57],[.68,1.34,.51],[.87,1.03,.45],[1.03,.52,.365],[1.09,.35,.31]];
  const profileCurve=new THREE.CatmullRomCurve3(profileControl.map(p=>new THREE.Vector3(...p)));
  const profile=profileCurve.getPoints(45).map(p=>[p.x,p.y,p.z]);
  const shirtVertices=[], shirtIndices=[];
  const sides=80;
  for(let row=0;row<profile.length;row++) {
    const [y,rx,rz]=profile[row];
    for(let j=0;j<=sides;j++) { const a=j/sides*Math.PI*2; shirtVertices.push(rx*Math.cos(a),y,rz*Math.sin(a)-.09); }
    if(row) for(let j=0;j<sides;j++) {
      const b=row*(sides+1)+j, a=b-(sides+1);
      shirtIndices.push(a,b,a+1,b,b+1,a+1);
    }
  }
  const shirtGeometry=new THREE.BufferGeometry();
  shirtGeometry.setAttribute('position',new THREE.Float32BufferAttribute(shirtVertices,3));
  shirtGeometry.setIndex(shirtIndices);shirtGeometry.computeVertexNormals();
  const shirt=new THREE.Mesh(shirtGeometry,navy);shirt.castShadow=shirt.receiveShadow=true;character.add(shirt);
  patch(character,[[-.255,1.09,.26],[0,.724,.438],[.255,1.09,.26]],skin);
  for(const s of [-1,1]) {
    patch(character,[[s*.25,1.13,.27],[s*.1,.77,.46],[s*.415,.74,.457],[s*.56,.984,.335]],collarMat);
    tube(character,[[s*.25,1.131,.274],[s*.415,.744,.464],[s*.555,.985,.342]],.009,mat('#3b536a',.95),22,5);
  }
  tube(character,[[0,.69,.47],[0,.27,.478],[0,-.16,.425]],.011,mat('#243b52',.9));
  for(const y of [.48,.13]) ellipsoid(character,mat('#122031',.58),[0,y,.493],[.031,.031,.014]);

  let paused=false, visible=true, pointerActive=false;
  let targetX=0,targetY=0,x=0,y=0,last=0,raf=0,clock=0,blinkTime=2.6;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let blink=0;
  let disposed=false;
  const clamp = THREE.MathUtils.clamp;
  function resize() {
    const r=host.getBoundingClientRect();
    if(!r.width||!r.height)return;
    renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  function draw(now) {
    raf=0;
    if(disposed||paused||reduced.matches||!visible||document.hidden)return;
    const dt=Math.min(.04,Math.max(0,(now-last)/1000||.016));last=now;clock+=dt;
    let tx=targetX,ty=targetY;
    if(!pointerActive){tx=Math.sin(clock*.34)*.10;ty=Math.sin(clock*.25)*.055;}
    const a=1-Math.exp(-dt*7.5);x+=(tx-x)*a;y+=(ty-y)*a;
    neckPivot.rotation.y=x*.46;
    neckPivot.rotation.x=y*.21;
    neckPivot.rotation.z=-x*.045+Math.sin(clock*.48)*.006;
    character.rotation.y=x*.055;
    character.scale.y=1+Math.sin(clock*1.1)*.002;
    hair.rotation.z=Math.sin(clock*.64)*.003-x*.008;
    blinkTime-=dt;
    if(blinkTime<0) {
      const progress=-blinkTime/.19;
      blink=Math.pow(Math.sin(Math.min(1,progress)*Math.PI),1.1);
      if(progress>=1){blink=0;blinkTime=2.7+random()*3.0;}
    }
    for(const e of eyes) {
      e.eye.scale.y=.78*Math.max(.025,1-blink);
      e.gaze.position.x=x*.044;
      e.gaze.position.y=-y*.033;
    }
    host.dataset.yaw=(x*.46).toFixed(4);
    host.dataset.blink=blink.toFixed(3);
    renderer.render(scene,camera);
    raf=requestAnimationFrame(draw);
  }
  function run(){if(!raf&&!paused&&!reduced.matches&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(draw);}}
  function rest(){cancelAnimationFrame(raf);raf=0;neckPivot.rotation.set(0,0,0);character.rotation.set(0,0,0);character.scale.y=1;hair.rotation.z=0;for(const e of eyes){e.eye.scale.y=.78;e.gaze.position.set(0,0,0);}renderer.render(scene,camera);}
  function aim(nx,ny){targetX=clamp(nx,-1,1);targetY=clamp(ny,-1,1);pointerActive=true;run();}
  function pointer(event){if(event.pointerType==='touch')return;const r=host.getBoundingClientRect();aim((event.clientX-r.left-r.width*.5)/(r.width*.7),(event.clientY-r.top-r.height*.35)/(r.height*.62));}
  function leave(event){if(!event.relatedTarget){pointerActive=false;targetX=targetY=0;}}
  function touch(event){if(event.pointerType!=='touch')return;const r=host.getBoundingClientRect();aim((event.clientX-r.left)/r.width*2-1,(event.clientY-r.top)/r.height*2-1);}
  function preference(){if(reduced.matches)rest();else run();}
  function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else run();}
  document.addEventListener('pointermove',pointer,{passive:true});
  document.addEventListener('pointerout',leave);
  host.addEventListener('pointerdown',touch,{passive:true});
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',preference);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)run();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.05});observer.observe(host);
  host.dataset.ready='true';renderer.render(scene,camera);onReady();run();
  return {
    pause(value){paused=value;host.dataset.paused=String(paused);if(paused)rest();else run();},
    dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();resizeObserver.disconnect();document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerout',leave);host.removeEventListener('pointerdown',touch);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);scene.traverse(o=>{o.geometry?.dispose();if(o.material){const all=Array.isArray(o.material)?o.material:[o.material];all.forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();}
  };
}
