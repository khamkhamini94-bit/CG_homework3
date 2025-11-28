/*******************生成立方体纹理对象*******************************/
function configureCubeMap(program) {
	gl.activeTexture(gl.TEXTURE0);

    cubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.uniform1i(gl.getUniformLocation(program, "cubeSampler"), 0);

	var faces = [
	    ["./skybox/right.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
        ["./skybox/left.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
        ["./skybox/top.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
        ["./skybox/bottom.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
        ["./skybox/front.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
        ["./skybox/back.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
		];
    
    for (var i = 0; i < 6; i++) {
        var face = faces[i][1];
        var image = new Image();
        image.src = faces[i][0];
        image.onload = function (cubeMap, face, image) {
            return function () {
		        gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
        }(cubeMap, face, image);
    }
}

/*TODO1:创建一般2D颜色纹理对象并加载图片*/
/*TODO1: 创建一般2D颜色纹理对象并加载图片*/
function configureTexture(image) {
    var texture = gl.createTexture();
    
    // 绑定纹理对象到 TEXTURE_2D 目标
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 将图片数据上传到 GPU
    // image 可能是 HTMLImageElement，格式通常为 RGB 或 RGBA
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 生成多级渐远纹理 (Mipmap)，用于不同距离下的采样优化
    gl.generateMipmap(gl.TEXTURE_2D);

    // 设置纹理过滤参数 (Minify 和 Magnify)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}