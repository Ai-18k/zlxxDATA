const {originObject} = require("../../utility");
const {
    ANGLEInstancedArrays,
    EXTBlendMinMax,
    EXTClipControl,
    EXTColorBufferHalfFloat,
    EXTDepthClamp,
    EXTDisjointTimerQuery,
    EXTFloatBlend,
    EXTFragDepth,
    EXTPolygonOffsetClamp,
    EXTShaderTextureLod,
    EXTTextureCompressionBPTC,
    EXTTextureCompressionRGTC,
    EXTTextureFilterAnisotropic,
    EXTTextureMirrorClampToEdge,
    EXTsRGB,
    KHRParallelShaderCompile,
    OESElementIndexUint,
    OESFboRenderMipmap,
    OESStandardDerivatives,
    OESTextureFloat,
    OESTextureFloatLinear,
    OESTextureHalfFloat,
    OESTextureHalfFloatLinear,
    OESVertexArrayObject,
    WebGLBlendFuncExtended,
    WebGLColorBufferFloat,
    WebGLCompressedTextureS3TC,
    WebGLCompressedTextureS3TCsRGB,
    WebGLDebugRendererInfo,
    WebGLDebugShaders,
    WebGLDepthTexture,
    WebGLDrawBuffers,
    WebGLLoseContext,
    WebGLMultiDraw,
    WebGLPolygonMode,
    EXTColorBufferFloat,
    EXTConservativeDepth,
    EXTDisjointTimerQueryWebgl2,
    EXTRenderSnorm,
    EXTTextureNorm16,
    NVShaderNoperspectiveInterpolation,
    OESDrawBuffersIndexed,
    OESSampleVariables,
    OESShaderMultisampleInterpolation,
    OVRMultiview2,
    WEBGLClipCullDistance,
    WEBGLProvokingVertex,
    WEBGLStencilTexturing
} = require("../extensionApi");
const webglExtension = {
    "ANGLE_instanced_arrays": new ANGLEInstancedArrays(),
    "EXT_blend_minmax": new EXTBlendMinMax(),
    "EXT_clip_control": new EXTClipControl(),
    "EXT_color_buffer_half_float": new EXTColorBufferHalfFloat(),
    "EXT_depth_clamp": new EXTDepthClamp(),
    "EXT_disjoint_timer_query": new EXTDisjointTimerQuery(),
    "EXT_float_blend": new EXTFloatBlend(),
    "EXT_frag_depth": new EXTFragDepth(),
    "EXT_polygon_offset_clamp": new EXTPolygonOffsetClamp(),
    "EXT_shader_texture_lod": new EXTShaderTextureLod(),
    "EXT_texture_compression_bptc": new EXTTextureCompressionBPTC(),
    "EXT_texture_compression_rgtc": new EXTTextureCompressionRGTC(),
    "EXT_texture_filter_anisotropic": new EXTTextureFilterAnisotropic(),
    "EXT_texture_mirror_clamp_to_edge": new EXTTextureMirrorClampToEdge(),
    "EXT_sRGB": new EXTsRGB(),
    "KHR_parallel_shader_compile": new KHRParallelShaderCompile(),
    "OES_element_index_uint": new OESElementIndexUint(),
    "OES_fbo_render_mipmap": new OESFboRenderMipmap(),
    "OES_standard_derivatives": new OESStandardDerivatives(),
    "OES_texture_float": new OESTextureFloat(),
    "OES_texture_float_linear": new OESTextureFloatLinear(),
    "OES_texture_half_float": new OESTextureHalfFloat(),
    "OES_texture_half_float_linear": new OESTextureHalfFloatLinear(),
    "OES_vertex_array_object": new OESVertexArrayObject(),
    "WEBGL_blend_func_extended": new WebGLBlendFuncExtended(),
    "WEBGL_color_buffer_float": new WebGLColorBufferFloat(),
    "WEBGL_compressed_texture_s3tc": new WebGLCompressedTextureS3TC(),
    "WEBGL_compressed_texture_s3tc_srgb": new WebGLCompressedTextureS3TCsRGB(),
    "WEBGL_debug_renderer_info": new WebGLDebugRendererInfo(),
    "WEBGL_debug_shaders": new WebGLDebugShaders(),
    "WEBGL_depth_texture": new WebGLDepthTexture(),
    "WEBGL_draw_buffers": new WebGLDrawBuffers(),
    "WEBGL_lose_context": new WebGLLoseContext(),
    "WEBGL_multi_draw": new WebGLMultiDraw(),
    "WEBGL_polygon_mode": new WebGLPolygonMode()
};

const webgl2Extension = {
    "EXT_clip_control": new EXTClipControl(),
    "EXT_color_buffer_float": new EXTColorBufferFloat(),
    "EXT_color_buffer_half_float": new EXTColorBufferHalfFloat(),
    "EXT_conservative_depth": new EXTConservativeDepth(),
    "EXT_depth_clamp": new EXTDepthClamp(),
    "EXT_disjoint_timer_query_webgl2": new EXTDisjointTimerQueryWebgl2(),
    "EXT_float_blend": new EXTFloatBlend(),
    "EXT_polygon_offset_clamp": new EXTPolygonOffsetClamp(),
    "EXT_render_snorm": new EXTRenderSnorm(),
    "EXT_texture_compression_bptc": new EXTTextureCompressionBPTC(),
    "EXT_texture_compression_rgtc": new EXTTextureCompressionRGTC(),
    "EXT_texture_filter_anisotropic": new EXTTextureFilterAnisotropic(),
    "EXT_texture_mirror_clamp_to_edge": new EXTTextureMirrorClampToEdge(),
    "EXT_texture_norm16": new EXTTextureNorm16(),
    "KHR_parallel_shader_compile": new KHRParallelShaderCompile(),
    "NV_shader_noperspective_interpolation": new NVShaderNoperspectiveInterpolation(),
    "OES_draw_buffers_indexed": new OESDrawBuffersIndexed(),
    "OES_sample_variables": new OESSampleVariables(),
    "OES_shader_multisample_interpolation": new OESShaderMultisampleInterpolation(),
    "OES_texture_float_linear": new OESTextureFloatLinear(),
    "OVR_multiview2": new OVRMultiview2(),
    "WEBGL_blend_func_extended": new WebGLBlendFuncExtended(),
    "WEBGL_clip_cull_distance": new WEBGLClipCullDistance(),
    "WEBGL_compressed_texture_s3tc": new WebGLCompressedTextureS3TC(),
    "WEBGL_compressed_texture_s3tc_srgb": new WebGLCompressedTextureS3TCsRGB(),
    "WEBGL_debug_renderer_info": new WebGLDebugRendererInfo(),
    "WEBGL_debug_shaders": new WebGLDebugShaders(),
    "WEBGL_lose_context": new WebGLLoseContext(),
    "WEBGL_multi_draw": new WebGLMultiDraw(),
    "WEBGL_polygon_mode": new WebGLPolygonMode(),
    "WEBGL_provoking_vertex": new WEBGLProvokingVertex(),
    "WEBGL_stencil_texturing": new WEBGLStencilTexturing()
};

function getExtension(name) {
    if (this instanceof WebGL2RenderingContext){
        return webgl2Extension[name];
    }else if (this instanceof WebGLRenderingContext){
        return webglExtension[name];
    }
}

function getSupportedExtensions() {
    if (this instanceof WebGL2RenderingContext){
        return originObject.keys(webgl2Extension);
    }else if (this instanceof WebGLRenderingContext){
        return originObject.keys(webglExtension);
    }
}

module.exports = {
    getExtension,
    getSupportedExtensions
};