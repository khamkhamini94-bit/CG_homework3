#version 300 es
precision mediump float;

out vec4 FragColor;

uniform float ambientStrength, specularStrength, diffuseStrength,shininess;

in vec3 Normal;//法向量
in vec3 FragPos;//相机观察的片元位置
in vec2 TexCoord;//纹理坐标
in vec4 FragPosLightSpace;//光源观察的片元位置

uniform vec3 viewPos;//相机位置
uniform vec4 u_lightPosition; //光源位置	
uniform vec3 lightColor;//入射光颜色

uniform sampler2D diffuseTexture;
uniform sampler2D depthTexture;
uniform samplerCube cubeSampler;//盒子纹理采样器


// PCF (Percentage-Closer Filtering) 版本的阴影计算
float shadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
{
    // 1. 执行透视除法，将坐标转换为 NDC [-1, 1]
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;

    // 2. 将坐标变换到 [0, 1] 范围，匹配纹理坐标
    projCoords = projCoords * 0.5 + 0.5;

    // 检查是否超出视锥体远平面（超出部分不应有阴影）
    if(projCoords.z > 1.0)
        return 0.0;

    // 3. 计算当前的深度值
    float currentDepth = projCoords.z;

    // 4. 计算 Bias (阴影偏移)，防止阴影失真 (Shadow Acne)
    // 根据表面法线和光线的夹角动态调整，最小 0.0005，最大 0.005
    float bias = max(0.005 * (1.0 - dot(normal, lightDir)), 0.0005);

    // 5. PCF 柔化处理
    float shadow = 0.0;
    
    // textureSize 返回纹理的宽和高，用 1.0 除以它得到单个纹理像素(texel)的大小
    vec2 texelSize = 1.0 / vec2(textureSize(depthTexture, 0));

    // 3x3 采样循环：采样当前像素周围的 9 个像素
    for(int x = -1; x <= 1; ++x)
    {
        for(int y = -1; y <= 1; ++y)
        {
            // 采样深度图
            float pcfDepth = texture(depthTexture, projCoords.xy + vec2(x, y) * texelSize).r; 
            
            // 如果 当前深度 > 采样深度 + bias，说明在阴影中，累加 1.0
            shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;        
        }    
    }
    
    // 取平均值 (9个样本)
    shadow /= 9.0;

    return shadow;
}
void main()
{
    
    //采样纹理颜色
    vec3 TextureColor = texture(diffuseTexture, TexCoord).xyz;

    //计算光照颜色
 	vec3 norm = normalize(Normal);
	vec3 lightDir;
	if(u_lightPosition.w==1.0) 
        lightDir = normalize(u_lightPosition.xyz - FragPos);
	else lightDir = normalize(u_lightPosition.xyz);
	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 halfDir = normalize(viewDir + lightDir);


    /*TODO2:根据phong shading方法计算ambient,diffuse,specular*/
    vec3  ambient,diffuse,specular;
    
    // 1. 环境光 (Ambient)
    // 简单的乘以环境光强度和光照颜色
    ambient = ambientStrength * lightColor;

    // 2. 漫反射 (Diffuse)
    // 计算法线与光线方向的点积，取 max(..., 0.0) 防止背面光照
    float diff = max(dot(norm, lightDir), 0.0);
    diffuse = diff * diffuseStrength * lightColor;

    // 3. 镜面反射 (Specular) - Blinn-Phong
    // 计算法线与半程向量 (halfDir) 的点积，进行 shininess 次幂运算
    float spec = pow(max(dot(norm, halfDir), 0.0), shininess);
    specular = spec * specularStrength * lightColor;
  	vec3 lightReflectColor=(ambient +diffuse + specular);

    //判定是否阴影，并对各种颜色进行混合
    float shadow = shadowCalculation(FragPosLightSpace, norm, lightDir);
	
    //vec3 resultColor =(ambient + (1.0-shadow) * (diffuse + specular))* TextureColor;
    vec3 resultColor=(1.0-shadow/2.0)* lightReflectColor * TextureColor;
    
    FragColor = vec4(resultColor, 1.f);
}


