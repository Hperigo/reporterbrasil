function shortAngleDist(a0,a1) {
    var max = Math.PI*2;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

function angleLerp(a0,a1,t) {
    return a0 + shortAngleDist(a0,a1)*t;
}



function SelectableObject(){
	this.object = null;
	this.domObject = null;
	this.id = null;
	


	// should we update from here? 
	this.update = function(){

	}

	this.setup = function( obj, html_info, id, onclick, sceneRef ){

		// var title = 

		
		var content = "\
		<div class='content-description'> \
		<img class='content-close' width=25 height=25 src='close.svg' type='image/svg+xml'></img> \
		<div style='overflow:hidden;'> \
		<h2>" + html_info.subtitle + " </h2>  \
		<p> " + html_info.description + " \
		<a href='#" + id + "'> leia mais </a> </p>\
		</div>\
		</div>\
		";


		var title_el = $(
		"\
		<div class='object-selector'> \
		 <img class='content-picker' width=70 height=70 src='point.svg' type='image/svg+xml'></img> \
		<h1> <span class=selector-id>#" + id + "</span> " + html_info.name  + "</h1>\
		</div>"
		);
		


		$(title_el).attr('id','selector_' + id);  // set the attribute 
		$('#canvas-container').prepend(title_el); // put it into the DOM    

		var content_el = $( content );

		title_el.append( content_el );

		var passObj = this;

		function onClickCallback(){
			onclick(content_el, passObj, this.threeObj);
		}

		title_el.click( onClickCallback.bind(this) );

		this.isActive = false;
		this.domObject = title_el
		this.object = obj;
		this.threeObj = sceneRef
		this.targetOffset = html_info.offset
		
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
		this.camera.filmOffset = -5
		this.camera.updateProjectionMatrix()
		// this.camera.position.x = -23.523036313168493
		// this.camera.position.y = 13.429693441816438
		// this.camera.position.z = -5.073035185092259

		this.camera.position.set( 10.426024262307237, 3.100505513233176, 6.5711637018614395 )

		this.controls = new THREE.OrbitControls( this.camera, domElement  );
		this.controls.maxPolarAngle = 1.394867138193868;
		this.controls.minPolarAngle = 1.1058406140636055;

		this.controls.minDistance = 6;
		this.controls.maxDistance = 13;

		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 5;

		this.controls.enableRotate = true;
		this.controls.enableKeys = false;
		this.controls.enablePan = false;


		// this.controls.target.x = 3

		var texBig = new THREE.TextureLoader().load( "big.jpg" );
		var texMed = new THREE.TextureLoader().load( "medium.jpg" );
		var texSmall = new THREE.TextureLoader().load( "small.jpg" );
		




		var _scene = this.scene;
		var _selectableObjects = this.selectableObjects;
		var _isInitialized = this.isInitialized;


		var helperAxis = new THREE.Object3D();
		helperAxis.visible = true;
		this.scene.add(helperAxis);

		this.controlOrigin = helperAxis;




		function onObjectLoad( object ){
			
			var html_objects =
			[	
				{
					name : 'Porto de Suape',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset: -1.6595359678142114
				},
				{
					name : 'Termelétricas',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset:-3.099817026147467
				},
				{
					name : 'A Comunidade',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset: 1.4494059994729995
				},
				{
					name : 'Vila Claudete',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset: 0.32726812978316466
				},
				{
					name : 'Complexo <br> <span style="left:10px;"> Industrial </spam>',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset: -0.29655149102431366
				},
				{
					name : 'Quilombo e ameaças',
					subtitle: 'Despejo na ilha de Tatuoca',
					description: 'Lorem ipsum dolor sit amet, consectetuer Lorem ipsum dolor sit amet',
					offset: -0.851654833113707
				}
			]



			// object.children[0].rotateZ(Math.PI);

			// this.controlOrigin 

			
			for( var i in object.children ){
				
				console.log( object.children[i] );

				var mat = new THREE.MeshBasicMaterial();

				if(object.children[i].name == 'big'){
					mat.map = texBig;
				}

				else if(object.children[i].name == 'medium'){
					mat.map = texMed;
				}

				else if(object.children[i].name == 'small'){
					mat.map = texSmall;
				}


				var color = new THREE.Color();
				var r = Math.random();
				color.setHSL(r, 1.0, 0.5 );
				mat.color = color;

				object.children[i].material = mat

				var objectName = object.children[i].name.split('_');
	
				if(  objectName[1] == 'mark' ){ // ignore floor plane


					console.log('markkkk---')

					object.children[i].geometry.computeBoundingSphere()

					var pos = object.children[i].geometry.boundingSphere.center;
					pos.add( new THREE.Vector3(0,0,0)  );


					
					var markObject = new THREE.AxisHelper(.5);
					markObject.position.set( pos.x, pos.y, pos.z ) ;
					markObject.visible = false;

					// var geometry = new THREE.Geometry();
					// geometry.vertices.push(
					// 	new THREE.Vector3( pos.x, 0, pos.z ),
					// 	new THREE.Vector3( pos.x, pos.y, pos.z )
					// );
					
					// var material = new THREE.LineBasicMaterial( {
					// 	color: 0xff0000,
					// 	linewidth: 1
					// } );

					//var line = new THREE.Line( geometry, material );
					// object.add( line );

					object.add(markObject);

					

					object.children[i].visible = false;

					var selectable = new SelectableObject();

					var index =  Number(objectName[2]) - 1;
					console.log( index, html_objects[index] )
					selectable.setup( markObject, html_objects[index], objectName[2], this.setActive, this )

					_selectableObjects.push( selectable );
				}

			}// eofor

			
			console.log( _selectableObjects );

			object.traverse( function( node ) {
				if( node.material ) {
					// node.material = new THREE.MeshLambertMaterial();
					node.material.color = new THREE.Color( 1,1,1,1 );
					node.material.side = THREE.DoubleSide;
				}
			});


			this.controlOrigin.add(object);

			// _scene.add( object );
			this.isInitialized =  true;
		}


		// var url = 'scene.txt'
		// var jsonLoader = new THREE.ObjectLoader();
		// jsonLoader.load('suape_clean1.json', onObjectLoad.bind(this));


		var loader = new THREE.OBJLoader();
		loader.load( 'mapa suape_v9.obj', onObjectLoad.bind(this) )

		var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		this.scene.add( light );


		// var cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ) , new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
		// cube.position.x = 3
		// this.scene.add( cube );




		console.log("initized Three Js Scene-----")
		requestAnimationFrame(this.draw.bind(this))		
		document.getElementById('canvas-container').appendChild( this.renderer.domElement );

		$('.content-description').slideUp();

		$(".content-close").click( function(){

			// $('.content-description').css({'visibility' : 'hidden' } );
			$('.content-description').slideUp();
		} );
		
	}

	this.draw = function (){

		// console.log(this.camera.position);
		// update css boxes
		if(this.isInitialized){

			for (var i in this.selectableObjects) {

				var cameraPos = this.camera.getWorldPosition();
				var objPos	  =  this.selectableObjects[i].object.getWorldPosition();

				var alpha = ((1.0 - objPos.distanceTo(cameraPos) / 15.0) * 6 );

				if( alpha < 0.3 ){
					alpha = 0.3;
				}


				var zIndex = Math.round(100*alpha);

				if( this.selectableObjects[i].isActive  ){
					zIndex += 1000;
				}

				var pos	= this.toScreenPosition(this.selectableObjects[i].object, this.camera);

				this.selectableObjects[i].domObject.css({'top' : (pos.y -70) + 'px', 'left': (pos.x - 20) + 'px', 'opacity' : alpha, 'z-index': zIndex });
				
			}
		}

		// smooth animation
		var objectRotation = this.controlOrigin.rotation.y;
		// this.controlOrigin.rotation.y += (this.targetRotation - objectRotation) * 0.06;


		this.controlOrigin.rotation.y = angleLerp(objectRotation, this.targetRotation , 0.06);


		this.targetRotation  = this.targetRotation %  (Math.PI * 2.0);

		this.controls.update();
		this.renderer.render(this.scene, this.camera)
		
		requestAnimationFrame( this.draw.bind(this) );

	}

	this.setActive = function( id, obj, threeScene ){


		// $('.content-description').css({'visibility' : 'hidden' } );
		// $('.content-description').slideUp();
		
		var idHasClass = $(id).hasClass('active');
		var lastObj = $('.content-description.active')[0];

		// this.mainObject.setRotationFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.controls.getAzimuthalAngle() );
		threeScene.targetRotation =   threeScene.controls.getAzimuthalAngle() - obj.targetOffset; //shortAngleDist(threeScene.controlOrigin.rotation.y, threeScene.controls.getAzimuthalAngle() + obj.targetOffset);

		console.log( "Object: ", obj );
		if( lastObj != undefined ){
			
			$(lastObj).removeClass( "active" );
			$(lastObj).slideUp();
			obj.isActive = false;
		}

		if( idHasClass == false ){
			
			obj.isActive = true;
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