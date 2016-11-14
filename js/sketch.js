var scene;
var aspect;
var camera;
var renderer;
var stats;
var uniforms;

var fakeTimeMultiplier = 1.0;
var MAX_FAKE_TIME = 16.0;

var clock = new THREE.Clock();

var sphere;

var CAMERA_PERSPECTIVE = 'CAMERA_PERSPECTIVE';

function setup(params) {
  var options = {
    stats: true,
  };

  if(params instanceof Object) {
    //use params to overwrite defaults:
    for (var prop in params) {
        if (!params.hasOwnProperty(prop)) {
          continue;
        }
        options[prop] = params[prop];
    }
  }

  aspect = window.innerWidth / window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.Camera();
  camera.position.z = 1;

  uniforms = {
    time:       { value: 0.0 },
    fakeTime:   { value: 0.0 },
    resolution: { value: new THREE.Vector2() }
  };

  // renderer = new THREE.WebGLRenderer({antialias: true});
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );

  if(options.stats)   insertStatsGUI();
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);

  uniforms.resolution.value.x = renderer.domElement.width;
  uniforms.resolution.value.y = renderer.domElement.height;
}

function fillScene() {
  var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

  var material = new THREE.ShaderMaterial( {

    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent

  } );

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var deltaSec = clock.getDelta();
  uniforms.time.value += deltaSec;

  uniforms.fakeTime.value += deltaSec*fakeTimeMultiplier;
  if(uniforms.fakeTime.value > MAX_FAKE_TIME) {
    fakeTimeMultiplier = -1.0;
  } else if(uniforms.fakeTime.value < 0.0) {
    fakeTimeMultiplier = 1.0;
  }

  renderer.render(scene, camera);
  if(stats && stats.update)         stats.update();
}

function insertStatsGUI() {
  stats = new Stats();
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.right = '0px'
  stats.domElement.style.left = ''
  stats.domElement.style.top = '';
  document.body.appendChild(stats.dom);
}

setup();
fillScene();
animate();  //which calls render each frame
insertStatsGUI();
