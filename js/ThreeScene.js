

function SelectableObject(){
	this.object = null;
	this.domObject = null;
	this.id = null;
	
	// should we update from here? 
	this.update = function(){

	}

	this.setup = function( obj ){

		var e = $("<div class='object-selector'>bla</div>");
		$('li', e).attr('id','a1234');  // set the attribute 
		$('#canvas-container').prepend(e); // put it into the DOM    

		this.domObject = e
		this.object = obj;
	}
}


function ThreeScene(){

	// app ----
	this.app = null
	this.isInitialized =  false
	
	// three vars ---
	this.renderer  =  null
	this.scene =  null
	this.camera = null
	this.controls = null
	
	this.controlOrigin = null;
	this.selectableObjects = [];

	this.init  = function ( App ){

		app = App

		var domElement = $('#canvas-container')[0]
		// domElement.setAttribute('id', "canvas-threejs")

		window.addEventListener('resize', this.onWindowResize.bind(this), false)

		$('#dummy-selector').click( function(){

		} );

		const width =	domElement.offsetWidth
		const height = domElement.offsetHeight


		console.log( '. starting three js config' )

		this.scene = new THREE.Scene()
		
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true })
		this.renderer.setClearColor('#AAAAAA')
		this.renderer.setSize(width, height)


		// SetupCamera & controls
		this.camera = new THREE.PerspectiveCamera( 40, width / height, 1, 1800 )
		this.camera.filmOffset = -7
		this.camera.updateProjectionMatrix()
		this.camera.position.x = -23.523036313168493
		this.camera.position.y = 13.429693441816438
		this.camera.position.z = -5.073035185092259

		this.controls = new THREE.OrbitControls( this.camera, domElement  );
		this.controls.maxPolarAngle = 1.394867138193868;
		this.controls.minPolarAngle = 1.1058406140636055;

		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 5;

		this.controls.enableRotate = true;
		this.controls.enableKeys = false;
		this.controls.enablePan = false;


		// this.controls.target.x = 3

		var texture = new THREE.TextureLoader().load( "../ao.png" );
		

		var url = '../scene.json'
		var jsonLoader = new THREE.ObjectLoader();
		var _scene = this.scene;
		var _selectableObjects = this.selectableObjects;
		var _isInitialized = this.isInitialized;


		function onObjectLoad( object ){
			object.children[0].rotateZ(Math.PI);

			for( var i in object.children ){
			
				var mat = new THREE.MeshBasicMaterial();
				mat.map = texture;

				var color = new THREE.Color();
				var r = Math.random();
				color.setHSL(r, 1.0, 0.5 );
				mat.color = color;

				object.children[i].material = mat

				if(i != 0 ){ // ignore floor plane


					var selectable = new SelectableObject();

					selectable.setup( object.children[i] )
					
					// selectable.object = 

					_selectableObjects.push( selectable );

					
				}

			}// eofor

			console.log( _selectableObjects );
			_scene.add( object );
			this.isInitialized =  true;
		}

		jsonLoader.load(url, onObjectLoad.bind(this));

		var helperAxis = new THREE.AxisHelper(1);
		this.scene.add(helperAxis);

		// const plane = new THREE.Mesh( new THREE.PlaneGeometry(100, 100, 1,1), new THREE.MeshBasicMaterial( {color:0xBBBBBB } ) );
		// plane.rotateX( - Math.PI / 2 );
		// plane.position.y = -0.5
		// this.scene.add( plane )

		this.controlOrigin = helperAxis;

		// var cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ) , new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
		// cube.position.x = 3
		// this.scene.add( cube );

		this.camera.position.z = 10;



		console.log("initized Three Js Scene-----")
		requestAnimationFrame(this.draw.bind(this))		
		document.getElementById('canvas-container').appendChild( this.renderer.domElement );
		
	}

	this.draw = function (){


		if(this.isInitialized){

			

			console.log( );

			for (var i in this.selectableObjects) {

				var cameraPos = this.camera.getWorldPosition();
				var objPos	  =  this.selectableObjects[i].object.getWorldPosition();

				var alpha = (1.0 - objPos.distanceTo(cameraPos) / 35.0) * 2;

				var pos	= this.toScreenPosition(this.selectableObjects[i].object, this.camera);
				this.selectableObjects[i].domObject.css({'top' : (pos.y - 50) + 'px', 'left': (pos.x) + 'px', 'opacity' : alpha });
				
			}

		}


		this.controls.update();
		this.renderer.render(this.scene, this.camera)
		
		requestAnimationFrame( this.draw.bind(this) );

	}

	this.setActive = function( id ){
		console.log("id: ", id)
	}

	this.onItemClick = function(id){

	}

	this.onWindowResize = function(){

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}


	  // THREE Js functions
	  this.toScreenPosition = function (obj, camera)
	  {
		var vector = new THREE.Vector3();
		
		// TODO: need to update this when resize window
		var widthHalf = 0.5*	this.renderer.context.canvas.width;
		var heightHalf = 0.5*	this.renderer.context.canvas.height;
		
		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(camera);
		
		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;
		
		return { 
			x: vector.x,
			y: vector.y
		}
	  }
};