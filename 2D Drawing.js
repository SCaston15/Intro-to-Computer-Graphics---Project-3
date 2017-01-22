/**
 * @author Jialei Li, K.R. Subrmanian, Zachary Wartell
 * 
 * 
 */


/*****
 * 
 * GLOBALS
 * 
 *****/

// 'draw_mode' are names of the different user interaction modes.
// \todo Student Note: others are probably needed...
var draw_mode = {DrawLines: 0, DrawTriangles: 1, DrawQuads: 2, ClearScreen: 3, Delete: 4, None: 5};

// 'curr_draw_mode' tracks the active user interaction mode
var curr_draw_mode = draw_mode.DrawLines;
var curr_Draw_mode = draw_mode.DrawQuads;

// GL array buffers for points, lines, and triangles
// \todo Student Note: need similar buffers for other draw modes...
var vBuffer_Pnt, vBuffer_Line, vBuffer_Triangle, vBuffer_Quad;

// Array's storing 2D vertex coordinates of points, lines, triangles, etc.
// Each array element is an array of size 2 storing the x,y coordinate.
// \todo Student Note: need similar arrays for other draw modes...
var points = [], line_verts = [], tri_verts = [], quad_verts = []; 
var lines = [], triangles = [], quads = [], selected = [];  
var z = 0;  

// count number of points clicked for new line
var num_pts_line = 0;

// \todo need similar counters for other draw modes...
var num_pts_tri = 0;
var num_pts_quad = 0;
var selectedCoords;

//Variables for color shader
var redColor, greenColor, blueColor;
/*****
 * 
 * MAIN
 * 
 *****/
function main() {
    
    math2d_test();
    
    /**
     **      Initialize WebGL Components
     **/
    
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShadersFromID(gl, "vertex-shader", "fragment-shader")) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // create GL buffer objects
    vBuffer_Pnt = gl.createBuffer();
    if (!vBuffer_Pnt) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    vBuffer_Line = gl.createBuffer();
    if (!vBuffer_Line) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    var skeleton=true;
    if(skeleton)
    {
        document.getElementById("App_Title").innerHTML += "-Skeleton";
    }

    // \todo create buffers for triangles and quads...
    
    // Creates a buffer for Triangles
    vBuffer_Triangle = gl.createBuffer();
    if(!vBuffer_Triangle){
        console.log('Failed to create the buffer object');
        return -1;
    }
	
    // Creates a buffer for Quads
    vBuffer_Quad = gl.createBuffer();
    if(!vBuffer_Quad){
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // get GL shader variable locations
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    /**
     **      Set Event Handlers
     **
     **  Student Note: the WebGL book uses an older syntax. The newer syntax, explicitly calling addEventListener, is preferred.
     **  See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     **/
    // set event handlers buttons
    document.getElementById("LineButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawLines;
            });
    
    //Adds Triangle Button
    document.getElementById("TriangleButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawTriangles;
            });
    
    //Adds Quad Button
    document.getElementById("QuadButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.DrawQuads;
            });
    
    document.getElementById("ClearScreenButton").addEventListener(
            "click",
            function () {
                curr_draw_mode = draw_mode.ClearScreen;
                // clear the vertex arrays
                while (points.length > 0)
                    points.pop();
                while (line_verts.length > 0)
                    line_verts.pop();
                while (tri_verts.length > 0)
                    tri_verts.pop();
                while(quad_verts.length > 0)
                quad_verts.pop(); 

                gl.clear(gl.COLOR_BUFFER_BIT);
                
                curr_draw_mode = draw_mode.DrawLines;
            });
               
    document.getElementById("DeleteButton").addEventListener(
            "click",
            function () {
            	while (selected.length > 0) { 
            	//deletes lines if they are selected 
            		for(var r = 0; r < line_verts.length; r+=2){
            			if(line_verts[r] == selected[selected.length - 2] && line_verts[r+1] == selected[selected.length -1]){
            				for(var c = r; c < line_verts.length - 2; c++) { 
            					line_verts[c] = line_verts[c+2]; 
            					line_verts[c+1] = line_verts[c+3]; 
            				}
            					line_verts.pop(); 
            					line_verts.pop(); 
            					selected.pop();
            					selected.pop();
            				}
            			} 
            	    
            	    //deletes triangles if they are selected 
            		for(var r = 0; r < tri_verts.length; r+= 3){
            			if(tri_verts[r] == selected[selected.length - 3] && tri_verts[r+1] == selected[selected.length - 2] && tri_verts[r+2] == selected[selected.length -1]){
            				for(var c = r; c < tri_verts.length - 3; c++) { 
            					tri_verts[c] = tri_verts[c+3]; 
            					tri_verts[c+1] = tri_verts[c+4]; 
            					tri_verts[c+2] = tri_verts[c+5]; 
            				}
            					tri_verts.pop(); 
            					tri_verts.pop(); 
            					tri_verts.pop();
            					selected.pop();
            					selected.pop();
            					selected.pop(); 
            				}
            			} 
            		 //deletes quads if they are selected
            			for(var r = 0; r < quad_verts.length; r+= 4){
            			if(quad_verts[r] == selected[selected.length - 4] && quad_verts[r+1] == selected[selected.length - 3] && quad_verts[r+2] == selected[selected.length - 2] && quad_verts[r+3] == selected[selected.length - 1]){
            				for(var c = r; c < quad_verts.length - 4; c++) { 
            					quad_verts[c] = quad_verts[c+4]; 
            					quad_verts[c+1] = quad_verts[c+5]; 
            					quad_verts[c+2] = quad_verts[c+6];  
            					quad_verts[c+3] = quad_verts[c+7];
            				}
            					quad_verts.pop(); 
            					quad_verts.pop(); 
            					quad_verts.pop();
            					quad_verts.pop();
            					selected.pop();
            					selected.pop();
            					selected.pop(); 
            					selected.pop(); 
            				}
            			} 
    
            		 gl.clear(gl.COLOR_BUFFER_BIT);
            	}
            });
            
    //\todo add event handlers for other buttons as required....            

    // set event handlers for color sliders
    /* \todo right now these just output to the console, code needs to be modified... */
    //Sets up color shaders 
    document.getElementById("RedRange").addEventListener(
            "input",
            function () {
                console.log("RedRange:" + document.getElementById("RedRange").value);
                redColor = document.getElementById("RedRange").value
                 drawObjects(gl,a_Position, u_FragColor);
            });
    document.getElementById("GreenRange").addEventListener(
            "input",
            function () {
                console.log("GreenRange:" + document.getElementById("GreenRange").value);
                greenColor = document.getElementById("GreenRange").value
                 drawObjects(gl,a_Position, u_FragColor);
            });
    document.getElementById("BlueRange").addEventListener(
            "input",
            function () {
                console.log("BlueRange:" + document.getElementById("BlueRange").value);
                blueColor = document.getElementById("BlueRange").value
                 drawObjects(gl,a_Position, u_FragColor);
            });                        
            
    // init sliders 
    // \todo this code needs to be modified ...
    document.getElementById("RedRange").value = 0;
    document.getElementById("GreenRange").value = 1;
    document.getElementById("BlueRange").value = 0;
    
    //sets variables to values 

   redColor = document.getElementById("RedRange").value
    greenColor = document.getElementById("GreenRange").value
    blueColor = document.getElementById("BlueRange").value
             // Register function (event handler) to be called on a mouse press
    canvas.addEventListener(
            "mousedown",
            function (ev) {
            if(ev.button == 0) handleMouseDown(ev, gl, canvas, a_Position, u_FragColor);
            else if (ev.button == 2) handleRightClick(ev, gl, canvas, a_Position, u_FragColor);
            });
                
                
}

/*****
 * 
 * FUNCTIONS
 * 
 *****/

/*
 * Handle mouse button press event.
 * 
 * @param {MouseEvent} ev - event that triggered event handler
 * @param {Object} gl - gl context
 * @param {HTMLCanvasElement} canvas - canvas 
 * @param {Number} a_Position - GLSL (attribute) vertex location
 * @param {Number} u_FragColor - GLSL (uniform) color
 * @returns {undefined}
 */

function handleMouseDown(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    while(selected.length > 0){
    selected.pop(); 
    }
    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
    
    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    
     
    
    if (curr_draw_mode !== draw_mode.None) {
        // add clicked point to 'points'
        points.push([x, y]);
    }

    // perform active drawing operation
    switch (curr_draw_mode) {
        case draw_mode.DrawLines:
            // in line drawing mode, so draw lines
            if (num_pts_line < 1) {			
                // gathering points of new line segment, so collect points
                line_verts.push([x, y]);
                num_pts_line++;
            }
            else {						
                // got final point of new line, so update the primitive arrays
                line_verts.push([x, y]);
                num_pts_line = 0;
                points.length = 0;
            }
            break;
    
        drawObjects(gl, a_Positon, u_FragColor);
        selected = []; 
    }
    
    //performs drawing operation for triangles 
    switch (curr_draw_mode) {
        case draw_mode.DrawTriangles:
            // in line drawing mode, so draw lines
            if (num_pts_tri < 2) {
                // gathering points of new line segment, so collect points
                tri_verts.push([x, y]);
                num_pts_tri++;
            }
            else {
                // got final point of new line, so update the primitive arrays
                tri_verts.push([x, y]);
                num_pts_tri= 0;
                points.length = 0;
            }
            break;
    }
    
    //performs drawing operations for quads 
    switch (curr_draw_mode) {
        case draw_mode.DrawQuads:
            // in line drawing mode, so draw lines
            if (num_pts_quad < 3) {
                // gathering points of new line segment, so collect points
                quad_verts.push([x, y]);
                num_pts_quad++;
            }
            else {
                // got final point of new line, so update the primitive arrays
                quad_verts.push([x, y]);
                num_pts_quad= 0;
                points.length = 0;
            }
            break;
    }
    
    drawObjects(gl,a_Position, u_FragColor);
}


function handleRightClick(ev, gl, canvas, a_Position, u_FragColor) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    
    // Student Note: 'ev' is a MouseEvent (see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
    
    // convert from canvas mouse coordinates to GL normalized device coordinates
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    
    selectedCoords = [x, y];
    
    selectShape();
	
	drawObjects(gl, a_Position, u_FragColor);
}

function selectShape() {
	//Selection for lines
	for(var i = 0; i < line_verts.length; i+=2) {
		console.log(Math.abs(pointLineDist(line_verts[i], line_verts[i+1], selectedCoords)));
		if(Math.abs(pointLineDist(line_verts[i], line_verts[i+1], selectedCoords)) < 0.1) {
			selected.push(line_verts[i], line_verts[i+1]);
		}
	}
	//Selection for triangles
	for(var i = 0; i < tri_verts.length; i+=3) {
		console.log(barycentric(tri_verts[i], tri_verts[i+1], tri_verts[i+2], selectedCoords));
		b = barycentric(tri_verts[i], tri_verts[i+1], tri_verts[i+2], selectedCoords);
		if((b[0] <= 1 && b[0] >= 0) && (b[1] <= 1 && b[1] >= 0) && (b[2] <= 1 && b[2] >= 0)) {
			selected.push(tri_verts[i], tri_verts[i+1], tri_verts[i+2]);
		}
	}
	
    //Selection for quads
    for(var i = 0; i < quad_verts.length; i+=4) {
    	b = barycentric(quad_verts[i], quad_verts[i+1], quad_verts[i+2], selectedCoords);
		b1 = barycentric(quad_verts[i+1], quad_verts[i+2], quad_verts[i+3], selectedCoords);
		if((b[0] <= 1 && b[0] >= -1) && (b[1] <= 1 && b[1] >= -1) && (b[2] <= 1 && b[2] >= -1) || (b1[0] <= 1 && b1[0] >= -1) && (b1[1] <= 1 && b1[1] >= -1) && (b1[2] <= 1 && b1[2] >= -1)) {
			selected.push(quad_verts[i], quad_verts[i+1], quad_verts[i+2], quad_verts[i+3]);
			}
			}        
}

/*
 * Draw all objects
 * @param {Object} gl - WebGL context
 * @param {Number} a_Position - position attribute variable
 * @param {Number} u_FragColor - color uniform variable
 * @returns {undefined}
 */
function drawObjects(gl, a_Position, u_FragColor) {

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw lines
    if (line_verts.length) {	
        // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Line);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(line_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
        
        if (selected.length == 2 && line_verts.length == 2) {
            gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
            } 
        // draw the lines
        gl.drawArrays(gl.LINES, 0, line_verts.length );
    }
    
    //Operation to draw the triangles 
    if (tri_verts.length) {
        // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Triangle);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(tri_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
            gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
       if (selected.length > 0) {
            gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
        };
        // draw the lines
        gl.drawArrays(gl.TRIANGLES, 0, tri_verts.length);
    }
   
    
    //Operation to draw the quads 
    if (quad_verts.length) {
        var temp_quad_verts = []; 
        for(var x = 0; x < quad_verts.length; x++){
        // enable the line vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Quad);
        // set vertex data into buffer (inefficient)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(quad_verts), gl.STATIC_DRAW);
        // share location with shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
        if (selected.length > 0) {
            gl.uniform4f(u_FragColor, redColor, greenColor, blueColor, 1.0);
            }
			
        //draws a quad no matter what the point positions are. 
        for(var y = 0; y < 4; y++){
        if(quad_verts[y+x*4])
        temp_quad_verts.push(quad_verts[y+x*4]); 
        }
        
        if(temp_quad_verts.length % 4 == 0 && temp_quad_verts.length > 0){
        for(i = 0; i<temp_quad_verts.length/4; i++){
            gl.drawArrays(gl.TRIANGLE_STRIP, i*4 , 4);
            gl.drawArrays(gl.TRIANGLE_FAN, i*4, 4);
        }
      }
    }
 }
    
    // draw primitive creation vertices 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Pnt);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, points.length);
    
    //selected[n]
    console.log(selected[z]);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer_Pnt);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(selected), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, selected.length);     
}

/**
 * Converts 1D or 2D array of Number's 'v' into a 1D Float32Array.
 * @param {Number[] | Number[][]} v
 * @returns {Float32Array}
 */
function flatten(v)
{
    var n = v.length;
    var elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array(n);

    if (elemsAreArrays) {
        var idx = 0;
        for (var i = 0; i < v.length; ++i) {
            for (var j = 0; j < v[i].length; ++j) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for (var i = 0; i < v.length; ++i) {
            floats[i] = v[i];
        }
    }

    return floats;
}
