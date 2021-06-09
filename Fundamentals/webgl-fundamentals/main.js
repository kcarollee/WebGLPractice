function main(){

//------------------------INITIALIZATION-------------------------//
	// looking up the HTML canvas element
	var canvas = document.querySelector("#c");
	
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
	console.log(positionAttributeLocation); 

	// a buffer the position attribute will be getting its data from
	var positionBuffer = gl.createBuffer();

	// binding the position buffer. 
	// binding the resource(positionBuffer) to a bind point(gl.ARRAY_BUFFER, one of WebGL's internal global variables.)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	console.log(positionBuffer);

	// putting data into that buffer by referencing it through the bind point
	var positions = [
		0, 1,
		1, 0.25,
		0.7, 0,
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

	// gl.vertexAttribPointer also binds the current ARRAY_BUFFER (positionBuffer) to the attribute
	// we're now free to bind something else to the ARRAY_BUFFER bind point.
	// the attribute will continue to use positionBuffer.

	// telling WebGL to execute the GLSL program

	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;
	gl.drawArrays(primitiveType, offset, count);


	
	
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
}

window.onload = main;