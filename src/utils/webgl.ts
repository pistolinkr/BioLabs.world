export const checkWebGLSupport = (): {
  supported: boolean;
  context: WebGLRenderingContext | null;
  error: string | null;
} => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        supported: false,
        context: null,
        error: 'WebGL을 지원하지 않는 브라우저입니다.'
      };
    }

    // WebGL 확장 확인
    const webglContext = gl as WebGLRenderingContext;
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      console.log('WebGL Vendor:', vendor);
      console.log('WebGL Renderer:', renderer);
    }

    return {
      supported: true,
      context: webglContext,
      error: null
    };
  } catch (error) {
    return {
      supported: false,
      context: null,
      error: `WebGL 초기화 오류: ${error}`
    };
  }
};

export const getWebGLInfo = (): {
  version: string;
  shadingLanguageVersion: string;
  vendor: string;
  renderer: string;
} | null => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return null;

    const webglContext = gl as WebGLRenderingContext;
    return {
      version: webglContext.getParameter(webglContext.VERSION),
      shadingLanguageVersion: webglContext.getParameter(webglContext.SHADING_LANGUAGE_VERSION),
      vendor: webglContext.getParameter(webglContext.VENDOR),
      renderer: webglContext.getParameter(webglContext.RENDERER)
    };
  } catch (error) {
    console.error('WebGL 정보 가져오기 실패:', error);
    return null;
  }
};
