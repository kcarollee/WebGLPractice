function main(){
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
	
	console.log(program);
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