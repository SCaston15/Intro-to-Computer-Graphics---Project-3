
// PointLightedCube_perFragment.js (c) 2012 matsuda and kanda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' + // Defined constant in main()
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  //'  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n' + // Sphere color
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
     // Calculate the vertex position in the world coordinate
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Color = vec4 (a_Color);\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'uniform vec3 u_emission;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
     // Normalize the normal because it is interpolated and not 1.0 in length any more
  '  vec3 normal = normalize(v_Normal);\n' +
     // Calculate the light direction and make it 1.0 in length
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
     // The dot product of the light direction and the normal
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
     // Calculate the final color from diffuse reflection and ambient reflection
  '  vec3 emission = u_emission;\n' +
  '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
  '  gl_FragColor = vec4(diffuse + ambient + emission, v_Color.a);\n' +
  '}\n';
  
  //Draws the 96 spheres, 6 sides of the cube 
  //Front Face 
  //Z, Y, X
  var translate = [0.0, 0.0, -2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 4.0,
  				  0.0, -2.0, -2.0, 0.0, -2.0, 0.0, 0.0, -2.0, 2.0, 0.0, -2.0, 4.0,
  				  0.0, -4.0, -2.0, 0.0, -4.0, 0.0, 0.0, -4.0, 2.0, 0.0, -4.0, 4.0,
  				  0.0, 2.0, -2.0, 0.0, 2.0, 0.0, 0.0, 2.0, 2.0, 0.0, 2.0, 4.0,
  //Left Face 				  
  				  2.0, 2.0, -3.0, 4.0, 2.0, -3.0, 6.0, 2.0, -3.0, 8.0, 2.0, -3.0,
  				  2.0, 0.0, -3.0, 4.0, 0.0, -3.0, 6.0, 0.0, -3.0, 8.0, 0.0, -3.0,
  				  2.0, -2.0, -3.0, 4.0, -2.0, -3.0, 6.0, -2.0, -3.0, 8.0, -2.0, -3.0,
  				  2.0, -4.0, -3.0, 4.0, -4.0, -3.0, 6.0, -4.0, -3.0, 8.0, -4.0, -3.0,
  //Right Face				  
  				  2.0, 2.0, 5.0, 4.0, 2.0, 5.0, 6.0, 2.0, 5.0, 8.0, 2.0, 5.0,
  				  2.0, 0.0, 5.0, 4.0, 0.0, 5.0, 6.0, 0.0, 5.0, 8.0, 0.0, 5.0,
  				  2.0, -2.0, 5.0, 4.0, -2.0, 5.0, 6.0, -2.0, 5.0, 8.0, -2.0, 5.0,
  				  2.0, -4.0, 5.0, 4.0, -4.0, 5.0, 6.0, -4.0, 5.0, 8.0, -4.0, 5.0,
  //Back Face 			  
  				  10.0, 2.0, -2.0, 10.0, 2.0, 0.0, 10.0, 2.0, 2.0, 10.0, 2.0, 4.0,
				  10.0, 0.0, -2.0, 10.0, 0.0, 0.0, 10.0, 0.0, 2.0, 10.0, 0.0, 4.0,
				  10.0, -2.0, -2.0, 10.0, -2.0, 0.0, 10.0, -2.0, 2.0, 10.0, -2.0, 4.0,
				  10.0, -4.0, -2.0, 10.0, -4.0, 0.0, 10.0, -4.0, 2.0, 10.0, -4.0, 4.0,
  //Top Face			  
				  2.0, 4.0, -2.0, 2.0, 4.0, 0.0, 2.0, 4.0, 2.0, 2.0, 4.0, 4.0,
				  4.0, 4.0, -2.0, 4.0, 4.0, 0.0, 4.0, 4.0, 2.0, 4.0, 4.0, 4.0,
				  6.0, 4.0, -2.0, 6.0, 4.0, 0.0, 6.0, 4.0, 2.0, 6.0, 4.0, 4.0,
				  8.0, 4.0, -2.0, 8.0, 4.0, 0.0, 8.0, 4.0, 2.0, 8.0, 4.0, 4.0,
  //Bottom Face			  
				  2.0, -6.0, -2.0, 2.0, -6.0, 0.0, 2.0, -6.0, 2.0, 2.0, -6.0, 4.0,
				  4.0, -6.0, -2.0, 4.0, -6.0, 0.0, 4.0, -6.0, 2.0, 4.0, -6.0, 4.0, 
				  6.0, -6.0, -2.0, 6.0, -6.0, 0.0, 6.0, -6.0, 2.0, 6.0, -6.0, 4.0, 
				  8.0, -6.0, -2.0, 8.0, -6.0, 0.0, 8.0, -6.0, 2.0, 8.0, -6.0, 4.0];
				
  var counter = 0; 
  var longX = 2.0; 
  var longY = 5.0; 
  var longZ = -7.0;
  var eb = 0.2; 

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
 var u_emission = gl.getUniformLocation(gl.program, 'u_emission');
  // 
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  
     var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color< 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // Get the storage locations of uniform variables
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) { 
    console.log('Failed to get the storage location');
    return;
  }

  // Register the event handler
  var currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
  mouseRotation_initEventHandlers(canvas, currentAngle);
  
  // Set the light color (white)
  gl.uniform3f(u_LightColor, 0.1, 0.8, 0.8);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, 5.0, 8.0, 7.0);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals

  var tick = function() {  

    eb += 0.1;   
     
    // Calculate the model matrix
    modelMatrix.setRotate(90, 0, 1, 0); // Rotate around the y-axis
    // Calculate the view projection matrix
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    mvpMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
    
    mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
    mvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis       
    
    mvpMatrix.multiply(modelMatrix);
    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Pass the transformation matrix for normals to u_NormalMatrix
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    document.onkeydown = function(ev){
    if(ev.keyCode == 74){
    gl.uniform3f(u_LightPosition, longX++, longY, longZ);
    }
    if(ev.keyCode == 76){
    gl.uniform3f(u_LightPosition, longX--, longY, longZ);
    }
    if(ev.keyCode == 73){
    gl.uniform3f(u_LightPosition, longX++, longY++, longZ);
    }
     if(ev.keyCode == 75){
    gl.uniform3f(u_LightPosition, longX++, longY--, longZ);
    }
    }
    
    //Counter resets to 0 
    counter = 0; 
    var colors; 
    
    //Increments counter by 3 
    for(var x = 0; x < translate.length; x+=3){
    var n = initVertexBuffers(gl); 
    if (n < 0){
    console.log('Failed to initialize buffer.');
    } 
	//Front face 
  
	if(counter < 48){
    
	if(counter == 0 || counter == 12 || counter == 24 || counter == 36){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	  gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
    }
	if(counter == 3 || counter == 15 || counter == 27 || counter == 39){
	  gl.uniform3f(u_AmbientLight, 0.33, 0.33, 0.33);
	  gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
    }
	if(counter == 6|| counter == 18 || counter == 30 || counter == 42){
	  gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
    }
	if(counter == 9 || counter == 21 || counter == 33 || counter == 45){
	  gl.uniform3f(u_AmbientLight, 1.0, 1.0, 1.0);
	  gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
	}
	if(counter <= 12){
		    colors = [1.0, 0.6, 0.5, 1.0];
	}
	else if (counter <= 24){
		colors = [0.0, 1.0, 0.6, 1.0];
	}
	else if (counter <= 36){
		colors = [0.2, 1.0, 1.0, 1.0];
	}
	else if (counter <= 48){
		colors = [1.0, 0.0, 0.5, 1.0];
	}
	}
	
	//Left Face Manipulation
    else if (counter >= 48 && counter < 96){
     gl.uniform3f(u_AmbientLight, 1.0, 0.5, 1.0);
	 gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
	 colors = [0.5, 0.0, eb, 1.0];
	 if (eb >= 1.0){
		  eb -= 0.4;
	 }
	else {
    	gl.uniform3f(u_emission, 0.0, 0.0, 0.0);
	}
	}
	//Right Face Manipulation 
     else if (counter < 144){
	if(counter == 96 || counter == 108 || counter == 120 || counter == 132){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	   gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
    } 
	if(counter == 99 || counter == 111 || counter == 123 || counter == 135){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	   gl.uniform3f(u_LightColor, 0.33, 0.33, 0.33);
    }
	if(counter == 102 || counter == 114 || counter == 126 || counter == 138){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	   gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	if(counter == 105 || counter == 117 || counter == 129 || counter == 141){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	   gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    }
	 
	if(counter <= 108){
		    colors = [1.0, 0.5, 0.0, 1.0];
	}
	else if(counter <= 120){
		    colors = [0.0, 0.6, 1.0, 1.0];
	}
	else if(counter <= 132){
		    colors = [1.0, 1.0, 1.0, 1.0];
	}
	else if(counter <= 144){
		    colors = [1.0, 0.6, 1.0, 1.0];
	}
    } 
	//Back Face Manipulation 
	else if (counter < 192){
	if(counter == 144 || counter == 147 || counter == 150 || counter == 153){
	  gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
	  gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
    }
	if(counter == 156 || counter == 159 || counter == 162 || counter == 165){
	  gl.uniform3f(u_AmbientLight, 0.33, 0.33, 0.33);
	  gl.uniform3f(u_LightColor, 0.33, 0.33, 0.33);
    }
	if(counter == 168|| counter == 171 || counter == 174 || counter == 177){
	  gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	if(counter == 180 || counter == 183 || counter == 186 || counter == 189){
	  gl.uniform3f(u_AmbientLight, 1.0, 1.0, 1.0);
	  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    }
	 
	if(counter <= 192){
		    colors = [1.0, 0.0, 1.0, 1.0];
    }
	}
	
	//Top Face Manipulation
	else if (counter < 240){
	colors = [0.0, 1.0, 0.8, 1.0];
    gl.uniform3f(u_AmbientLight, 1.0, 0.5, 0.5);
	 gl.uniform3f(u_LightColor, 0.1, 1.0, 1.0);
	  if(counter == 237|| counter == 234|| counter == 231 || counter == 228){
		  colors = [1.0, 1.0, eb, 1.0];
		  gl.uniform3f(u_emission, 1.0, 0.0, 1.0);
	 if (eb >= 1.0){
		  eb -= 0.2;
	 }
		else {
    	gl.uniform3f(u_emission, 0.0, 0.0, 0.0);
	}
    } 
    }
	//Bottom Face Manipulation
    else if(counter < 288){
    if(counter == 240 || counter == 243 || counter == 246 || counter == 249){
	    gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	if(counter == 252 || counter == 255 || counter == 258 || counter == 261){
	    gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	if(counter == 264 || counter == 267 || counter == 270 || counter == 273){
	  gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	if(counter == 276 || counter == 279 || counter == 282|| counter == 285){
	    gl.uniform3f(u_AmbientLight, 0.66, 0.66, 0.66);
	  gl.uniform3f(u_LightColor, 0.66, 0.66, 0.66);
    }
	 
	if(counter <= 288){
		    colors = [0.0, 1.0, 0.0, 1.0];
    }
	}
	
    
    gl.vertexAttrib4f(a_Color, colors[0], colors[1], colors[2], colors[3]);
    
    // Draw the sphere
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    
    counter += 3; 
    }
    requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
    };
    
  tick();   
}


function initVertexBuffers(gl) { // Create a sphere
  var SPHERE_DIV = 15;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var positions = [];
  var indices = [];

  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push((si * sj + translate[counter])*0.18);  // X
      positions.push((cj + translate[counter + 1]) * 0.18);       // Y
      positions.push((ci * sj + translate[counter + 2 ]) * 0.18);  // Z
    }
    
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
    
  }

  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;
  
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
