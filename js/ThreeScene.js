function SelectableObject(){
	this.object = null;
	this.domObject = null;
	this.id = null;
	


	// should we update from here? 
	this.update = function(){

	}

	this.setup = function( obj, html_info, id, onclick ){

		// var title = 
		
		var content = "\
		<div class='content-description'> \
		<img class='content-close' width=25 height=25 src='close.svg' type='image/svg+xml'></img> \
		<div style='overflow:hidden;'> \
		<h2>" + html_info.subtitle + " </h2>  \
		<p> " + html_info.description + " \
		<a href='/#" + id + "'> leia mais </a> </p>\
		</div>\
		</div>\
		";


		var title_el = $(
		"\
		<div class='object-selector'> \
		<h1> <span class=selector-id>#" + id + "</span> " + html_info.name  + "</h1>\
		</div>"
		);
			 


		$(title_el).attr('id','selector_' + id);  // set the attribute 
		$('#canvas-container').prepend(title_el); // put it into the DOM    

		var content_el = $( content );

		title_el.append( content_el );


		title_el.click( function(){

			onclick(content_el);
		} )

		this.domObject = title_el
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
	this.targetRotation = 0;
	
	this.selectableObjects = [];

	this.init  = function ( App ){

		app = App

		var domElement = $('#canvas-container')[0]
		// domElement.setAttribute('id', "canvas-threejs")

		window.addEventListener('resize', this.onWindowResize.bind(this), false)



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

		var texture = new THREE.TextureLoader().load( "img1.png" );
		




		var _scene = this.scene;
		var _selectableObjects = this.selectableObjects;
		var _isInitialized = this.isInitialized;


		var helperAxis = new THREE.AxisHelper(1);
		this.scene.add(helperAxis);

		this.controlOrigin = helperAxis;




		function onObjectLoad( object ){
			
			var html_objects =
			[	
				{
					name : 'Porto de Suape',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				},
				{
					name : 'Termelétricas',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				},
				{
					name : 'A Comunidade',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				},
				{
					name : 'Vila Claudete',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				},
				{
					name : 'Complexo <br> <span style="left:10px;"> Industrial </spam>',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				},
				{
					name : 'Quilombo e ameaças',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet'
				}
			]



			object.children[0].rotateZ(Math.PI);

			// this.controlOrigin 

			/*
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

					selectable.setup( object.children[i], html_objects[i], i, this.setActive )
					_selectableObjects.push( selectable );

					
				}

			}// eofor

			*/
			console.log( _selectableObjects );

			this.controlOrigin.add(object);

			// _scene.add( object );
			this.isInitialized =  true;
		}


		// var url = 'scene.txt'
		// var jsonLoader = new THREE.ObjectLoader();
		// jsonLoader.load(url, onObjectLoad.bind(this));


		var loader = new THREE.OBJLoader();
		loader.load( 'suape_clean.obj', onObjectLoad.bind(this) )

		var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		this.scene.add( light );


		// var cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ) , new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
		// cube.position.x = 3
		// this.scene.add( cube );

		this.camera.position.z = 10;



		console.log("initized Three Js Scene-----")
		requestAnimationFrame(this.draw.bind(this))		
		document.getElementById('canvas-container').appendChild( this.renderer.domElement );

		$('.content-description').slideUp();

		$(".content-close").click( function(){

			console.log( "-wewe---" );
			// $('.content-description').css({'visibility' : 'hidden' } );
			$('.content-description').slideUp();
		} );
		
	}

	this.draw = function (){


		// update css boxes
		if(this.isInitialized){

			for (var i in this.selectableObjects) {

				var cameraPos = this.camera.getWorldPosition();
				var objPos	  =  this.selectableObjects[i].object.getWorldPosition();

				var alpha = ((1.0 - objPos.distanceTo(cameraPos) / 29.0) * 6);

				if( alpha < 0.3 ){
					alpha = 0.3;
				}


				var zIndex = Math.round(100*alpha);
				var pos	= this.toScreenPosition(this.selectableObjects[i].object, this.camera);

				this.selectableObjects[i].domObject.css({'top' : (pos.y - 50) + 'px', 'left': (pos.x) + 'px', 'opacity' : alpha, 'z-index': zIndex });
				
			}
		}

		// smooth animation
		var objectRotation = this.controlOrigin.rotation.y;
		this.controlOrigin.rotation.y += (this.targetRotation - objectRotation) * 0.1;


		this.targetRotation  = this.targetRotation %  (Math.PI * 2.0);

		this.controls.update();
		this.renderer.render(this.scene, this.camera)
		
		requestAnimationFrame( this.draw.bind(this) );

	}

	this.setActive = function( id ){


		// $('.content-description').css({'visibility' : 'hidden' } );
		// $('.content-description').slideUp();
		
		var idHasClass = $(id).hasClass('active');
		var lastObj = $('.content-description.active')[0];


		if( lastObj != undefined ){
			
			$(lastObj).removeClass( "active" );
			$(lastObj).slideUp();
		}

		if( idHasClass == false ){
			$(id).slideDown();
			$(id).addClass("active");
		}
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