function main(){

//------------------------INITIALIZATION-------------------------//
	// looking up the HTML canvas element
	var canvas = document.querySelector("#c");
	canvas.width = 400;
	canvas.height = 300;
	
	// creating a WebGLRenderingContext
	var gl = canvas.getContext("webgl");
	if (!gl){
		console.log("WebGLRenderingContext not created.");
	}
	
	// shader sources, in text form
	var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
	var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
	
	// shaders
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	// linking the two shaders above into a single program
	var program = createProgram(gl, vertexShader, fragmentShader);

	// we've now created a GLSL program on the GPU. 

	// our only input to the GLSL program is a_position (attribute vec4 a_position;)

	// looking up the location of the attribute for the program above
	// this should be done during initialization, not in the render loop.
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// looking up resolution uniform's location
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

	// looking up color uniform's location
	var colorUniformLocation = gl.getUniformLocation(program, "u_color");
	


	// a buffer the position attribute will be getting its data from
	var positionBuffer = gl.createBuffer();

	// binding the position buffer. 
	// binding the resource(positionBuffer) to a bind point(gl.ARRAY_BUFFER, one of WebGL's internal global variables.)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	console.log(positionBuffer);

	// putting data into that buffer by referencing it through the bind point
	var positions = [
		10, 20,
		80, 20,
		10, 30, 
		10, 30,
		80, 20, 
		80, 30
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


	
	/*
	Float32Array -> WeblGL needs strongly typed data.
	gl.bufferData-> copies the data to the positionBuffer on the GPU
	gl.STATIC_DRAW-> telling WebGL this data won't change much.
	*/

//------------------------RENDERING-------------------------//

	// Telling WebGL how to convert clip space values (which gl_Position will be set to) back into pixels (screen space).
	// the code below maps the -1 ~ +1 clip space to x: 0 ~ gl.canvas.width, y: 0 ~ gl.canvas.height

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// clearing the canvas.
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// tell WebGL which shader program to execute.
	gl.useProgram(program);

	// tell WebGL how to take data from the buffer set up during the init stage and supply it to the 
	// attribute in the shader.

	// turning the attribute on
	gl.enableVertexAttribArray(positionAttributeLocation);

	// specifying how to pull the data out

	// bind the position buffer

	// telling the attribute how to get the data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // data type is 32bit floats
	var normalize = false; // do not normalize the data
	var stride = 0; // 0 = move forward (size * sizeof(type)) each iter to get to the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
	);

	// set the resolution (setting the value for uniforms should be done after setting which program to use)
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	// gl.vertexAttribPointer also binds the current ARRAY_BUFFER (positionBuffer) to the attribute
	// we're now free to bind something else to the ARRAY_BUFFER bind point.
	// the attribute will continue to use positionBuffer.

	// telling WebGL to execute the GLSL program

	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 6; // drawing 2 triangles. telling WebGL to call the vertex shader 6 times. 
	gl.drawArrays(primitiveType, offset, count);

	for (let i = 0; i < 50; i++){
		setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

		// set random color
		gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

		// draw the rectangle
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}


	
	
	
}

// function that creates a shader, uploads the GLSL source, and compiles the shader
function createShader(gl, type, source){
	var shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;
	
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

// function that links two shaders into a program
function createProgram(gl, vs, fs){
	var program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if(success) return program;

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

function randomInt(range){
	return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height){
	let x1 = x;
	let x2 = x + height;
	let y1 = y;
	let y2 = y + height;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2
	]), gl.STATIC_DRAW);
}

function setGeometry(gl){
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, -100,
		150, 125,
		-175, 100
	]), gl.STATIC_DRAW);
}

window.onload = main;