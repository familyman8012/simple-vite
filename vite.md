# Vite + React 학습 가이드

## 1. Vite 소개

- Vite란?
- Vite vs 다른 번들러(webpack, parcel 등)
- Vite의 주요 특징과 장점

## 2. 프로젝트 시작하기

### 개발 환경 설정

- Node.js 16.0 이상 설치 필요
- npm 또는 yarn 패키지 매니저 설치
- 코드 에디터 (VS Code 권장)
  - VS Code 추천 확장 프로그램:
    - ESLint
    - Prettier
    - Vite
    - React Developer Tools

### 프로젝트 생성하기

- 개발 환경 설정
- 프로젝트 생성하기
- 프로젝트 구조 이해하기
- 기본 명령어 (dev, build, preview)

## 3. Vite 설정

- vite.config.js 설정 방법
- 환경 변수 설정 (.env)
- 경로 별칭 설정 (aliases)
- 개발 서버 커스터마이징

## 4. React와 함께 사용하기

- React 컴포넌트 작성
- JSX 사용법
- 상태 관리
- 라우팅 설정

## 5. 스타일링

- CSS 모듈 사용
- Sass/Less 설정
- PostCSS 설정
- CSS-in-JS 사용하기

## 6. 최적화

- 코드 분할 (Code Splitting)
- 정적 자산 처리
- 빌드 최적화
- 성능 모니터링

## 7. 배포

- 프로덕션 빌드
- 정적 호스팅 설정
- CI/CD 파이프라인 구성
- 배포 전략

## 8. 개발 도구와 디버깅

- 개발자 도구 활용
- HMR (Hot Module Replacement)
- 디버깅 테크닉
- 에러 처리

## 9. 테스트

- 단위 테스트 설정
- 통합 테스트
- E2E 테스트
- 테스트 자동화

## 10. 고급 주제

- TypeScript 통합
- SSR (Server-Side Rendering)
- PWA 설정
- 마이크로프론트엔드

## 11. 실전 예제

- Todo 앱 만들기
- API 연동하기
- 상태 관리 라이브러리 사용
- 인증 구현

## 12. 문제 해결과 팁

- 일반적인 오류와 해결방법
- 성능 최적화 팁
- 보안 고려사항
- 베스트 프랙티스

## 프로덕션 최적화 가이드

### 1. 필수 최적화 플러그인

프로덕션 환경에서 고려해야 할 주요 최적화 플러그인들:

```bash
# 이미지 최적화
yarn add -D vite-plugin-imagemin

# PWA 지원
yarn add -D vite-plugin-pwa

# 레거시 브라우저 지원 (필요한 경우)
yarn add -D @vitejs/plugin-legacy
```

### 2. 권장 설정 예시

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import imagemin from 'vite-plugin-imagemin';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    // 이미지 최적화 (대용량 이미지가 많은 경우 필수)
    imagemin({
      // JPEG 최적화
      mozjpeg: {
        quality: 75,        // 적절한 품질
        progressive: true   // 프로그레시브 로딩
      },
      // PNG 최적화
      optipng: {
        optimizationLevel: 5
      },
      // SVG 최적화
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false   // viewBox 유지 (반응형)
          }
        ]
      },
      // WebP 생성 (선택사항)
      webp: {
        quality: 75
      }
    }),

    // PWA 지원 (선택사항이나 권장)
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    }),

    // 레거시 브라우저 지원 (필요한 경우만)
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  build: {
    // 청크 크기 경고 임계값 조정
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // 벤더 청크 분리 (효율적인 캐싱)
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('@mui') || id.includes('@emotion')) return 'ui-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
});
```

### 3. 성능 최적화 체크리스트

1. **이미지 최적화**
   - 큰 이미지는 `vite-plugin-imagemin`으로 최적화
   - WebP 포맷 사용 고려
   - 이미지 lazy 로딩 구현

2. **코드 분할**
   - 라우트 기반 코드 분할 구현
   - 큰 컴포넌트/라이브러리 lazy 로딩
   - 적절한 청크 사이즈 유지

3. **캐싱 전략**
   - 정적 자산에 대한 장기 캐싱 설정
   - 벤더 번들 분리로 효율적인 캐싱
   - Service Worker 구현 (PWA)

4. **성능 모니터링**
   - Lighthouse 점수 모니터링
   - Core Web Vitals 추적
   - 번들 크기 분석 (rollup-plugin-visualizer 사용)

### 4. 주의사항

1. **이미지 최적화**
   - 이미지가 많지 않은 프로젝트에서는 `vite-plugin-imagemin` 생략 가능
   - 대신 이미지를 빌드 전에 수동으로 최적화하는 것을 고려

2. **코드 분할**
   - 과도한 코드 분할은 오히려 성능 저하 초래
   - 청크 크기는 보통 100KB~500KB가 적절

3. **플러그인 선택**
   - 필요한 플러그인만 선택적으로 사용
   - 불필요한 플러그인은 빌드 시간 증가의 원인

4. **빌드 성능**
   - 빌드 시간과 결과물 크기 사이의 균형 유지
   - 개발 환경과 프로덕션 환경의 설정 분리 고려

## 1. Vite 소개

### Vite란?

- 프랑스어로 '빠른'이라는 의미를 가진 최신 프론트엔드 빌드 도구
- Vue.js 창시자 Evan You가 개발한 차세대 프론트엔드 도구
- ES modules를 네이티브로 활용하는 개발 서버 제공
- 매우 빠른 Hot Module Replacement (HMR) 지원

### Vite vs 다른 번들러

- Webpack

  - 전통적인 번들링 방식으로 개발 서버 구동이 느림
  - 대규모 프로젝트에서 검증된 안정성
  - 다양한 플러그인 생태계

- Parcel
  - Zero-configuration 번들러
  - 상대적으로 간단한 설정
  - 개발 서버 성능이 Vite보다 느림

### Vite의 주요 특징과 장점

- 빠른 서버 시작

  - 필요한 모듈만 변환하는 주문형 방식
  - Cold-starting 최소화

- 효율적인 HMR

  - 네이티브 ESM을 통한 즉각적인 모듈 교체
  - 변경된 모듈만 정확하게 교체

- 최적화된 빌드

  - Rollup 기반의 프로덕션 빌드
  - 자동 코드 분할
  - CSS 코드 분할

- 풍부한 기능
  - TypeScript, JSX, CSS 등 기본 지원
  - 다양한 프레임워크 템플릿 제공
  - 플러그인 API 지원

## 2. 프로젝트 시작하기

### 개발 환경 설정

#### 필수 요구사항
- Node.js 16.0 이상 설치 필요
- npm 또는 yarn 패키지 매니저 설치
- 코드 에디터 (VS Code 권장)
  - VS Code 추천 확장 프로그램:
    - ESLint: 코드 품질과 스타일 검사
    - Prettier: 코드 포맷팅
    - Vite: Vite 프로젝트 지원
    - React Developer Tools: React 개발 도구

### 프로젝트 생성하기

#### 1. 개발 환경 확인
```bash
# Node.js 버전 확인
node --version  # 16.0 이상인지 확인

# npm 또는 yarn 설치 확인
npm --version  # npm 확인
yarn --version # yarn 확인
```

#### 2. 새 프로젝트 생성
npm 사용 시:
```bash
npm create vite@latest my-project -- --template react
cd my-project
npm install
```

yarn 사용 시:
```bash
yarn create vite my-project --template react
cd my-project
yarn
```

#### 3. 프로젝트 구조
```
my-project/
├── node_modules/     # 프로젝트 의존성 모듈
├── public/          # 정적 파일 디렉토리
├── src/             # 소스 코드
│   ├── assets/     # 이미지, 폰트 등 리소스
│   ├── App.css
│   ├── App.jsx     # 메인 애플리케이션 컴포넌트
│   ├── index.css
│   └── main.jsx    # 애플리케이션 진입점
├── .gitignore      # Git 제외 파일 설정
├── index.html      # HTML 템플릿
├── package.json    # 프로젝트 설정 및 의존성
├── vite.config.js  # Vite 설정 파일
└── README.md       # 프로젝트 문서
```

#### 4. 기본 명령어
- 개발 서버 실행:
  ```bash
  npm run dev    # 또는 yarn dev
  ```
  - 로컬 개발 서버가 http://localhost:5173 에서 실행됨
  - Hot Module Replacement (HMR) 지원으로 실시간 코드 변경 확인 가능

- 프로덕션 빌드:
  ```bash
  npm run build    # 또는 yarn build
  ```
  - 최적화된 프로덕션 빌드를 `dist` 디렉토리에 생성

- 빌드 결과물 미리보기:
  ```bash
  npm run preview    # 또는 yarn preview
  ```
  - 빌드된 프로덕션 버전을 로컬에서 미리보기
  - `build` 명령어 실행 후에만 사용 가능

## 3. Vite 설정

### vite.config.js 설정 방법

vite.config.js는 Vite 프로젝트의 핵심 설정 파일입니다. 주요 설정 옵션들을 살펴보겠습니다:

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  // 개발/프로덕션 모드에 따른 설정 분기
  const isProduction = mode === 'production'
  
  return {
    // 기본 설정
    base: env.VITE_BASE_URL || '/',
    
    // 플러그인 설정
    plugins: [
      // React 지원
      react({
        // 빠른 리프레시 활성화
        fastRefresh: true,
        // babel 설정
        babel: {
          plugins: [
            // React 자동 런타임 지원
            ['@babel/plugin-transform-react-jsx', {
              runtime: 'automatic'
            }],
            // Emotion 지원
            ['@emotion/babel-plugin', {
              // 소스맵 생성 (개발환경에서만)
              sourceMap: process.env.NODE_ENV !== 'production',
              // 자동 레이블링
              labelFormat: '[local]',
              // CSS prop 지원
              cssPropOptimization: true
            }]
          ]
        }
      }),
      
      // SVG를 React 컴포넌트로 변환
      svgr(),
      
      // 레거시 브라우저 지원
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      
      // GZIP 압축
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      
      // PWA 지원
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: '내 Vite 앱',
          short_name: 'Vite 앱',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      
      // 번들 분석 (production에서만)
      mode === 'production' && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    
    // 리졸브 설정
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets')
      }
    },
    
    // 서버 설정
    server: {
      host: true, // 네트워크 접근 허용
      port: 3000,
      strictPort: false,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      cors: true
    },
    
    // 빌드 설정
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // node_modules 내의 패키지들을 자동으로 청크로 분리
            if (id.includes('node_modules')) {
              // react 관련 패키지들을 하나의 청크로
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              // MUI와 emotion 관련 패키지들을 하나의 청크로
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui-vendor';
              }
              // 그 외 node_modules의 패키지들은 vendors 청크로
              return 'vendors';
            }
          },
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // 정적 자산 처리
    publicDir: 'public',    // 정적 파일 디렉토리 설정
    assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.eot'],  // 추가 자산 형식 포함
    
    // CSS 설정
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: mode === 'production'
          ? '[hash:base64:8]'
          : '[local]_[hash:base64:5]'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@styles/variables.scss";`
        }
      }
    },
    
    // 최적화 설정
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@vite/client', '@vite/env'],
      force: isProduction,
      esbuildOptions: {
        target: 'es2020',
        supported: { 
          'top-level-await': true 
        },
        plugins: [
          // 커스텀 ESBuild 플러그인
        ]
      }
    },
    
    // 에러 핸들링
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.less')) {
        server.ws.send({
          type: 'custom',
          event: 'style-update',
          data: { file }
        })
      }
    },
    
    // 성능 모니터링 설정 추가
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs'],
        strictRequires: true,
        transformMixedEsModules: true
      }
    },
    
    // 워커 스레드 설정
    worker: {
      format: 'es',
      plugins: [],
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js'
        }
      }
    },
    
    // 실험적 기능 설정
    experimental: {
      renderBuiltUrl: (filename, { hostType, type, hostId }) => {
        if (type === 'public') {
          return `${env.VITE_CDN_URL}/${filename}`
        }
        return filename
      }
    }
  }
})
```

### 환경 변수 설정 (.env)

Vite는 다양한 환경 변수 파일을 지원합니다:

```plaintext
# .env
VITE_API_URL=https://api.example.com

# .env.development
VITE_DEV_API_KEY=dev_key123

# .env.production
VITE_PROD_API_KEY=prod_key456
```

환경 변수 사용 예시:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

주의사항:
- 환경 변수는 반드시 `VITE_` 접두사로 시작해야 합니다
- `.env.local`은 Git에 커밋되지 않으므로 로컬 개발용으로 적합합니다

### 경로 별칭 설정 (aliases)

프로젝트의 import 경로를 더 깔끔하게 관리할 수 있습니다:

```javascript
// vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
})
```

사용 예시:
```javascript
import Button from '@components/Button'
import logo from '@assets/logo.svg'
```

### 개발 서버 커스터마이징

개발 서버의 다양한 옵션을 설정할 수 있습니다:

```javascript
export default defineConfig({
  server: {
    // 포트 설정
    port: 3000,
    
    // 자동으로 브라우저 열기
    open: true,
    
    // CORS 설정
    cors: true,
    
    // HTTPS 설정
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    },
    
    // 미들웨어 설정
    middleware: [
      // 커스텀 미들웨어 추가
    ]
  }
})
```

주요 기능:
- 프록시 설정으로 API 요청 처리
- HTTPS 개발 환경 구성
- 커스텀 미들웨어 추가
- CORS 정책 설정
- 자동 포트 할당

## 프로덕션 수준의 Vite 설정 예시

아래는 실제 프로덕션 환경에서 사용할 수 있는 포괄적인 `vite.config.js` 설정 예시입니다:

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // 기본 설정
    base: env.VITE_BASE_URL || '/',
    
    // 플러그인 설정
    plugins: [
      // React 지원
      react({
        // 빠른 리프레시 활성화
        fastRefresh: true,
        // babel 설정
        babel: {
          plugins: [
            // React 자동 런타임 지원
            ['@babel/plugin-transform-react-jsx', {
              runtime: 'automatic'
            }],
            // Emotion 지원
            ['@emotion/babel-plugin', {
              // 소스맵 생성 (개발환경에서만)
              sourceMap: process.env.NODE_ENV !== 'production',
              // 자동 레이블링
              labelFormat: '[local]',
              // CSS prop 지원
              cssPropOptimization: true
            }]
          ]
        }
      }),
      
      // SVG를 React 컴포넌트로 변환
      svgr(),
      
      // 레거시 브라우저 지원
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      
      // GZIP 압축
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      
      // PWA 지원
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: '내 Vite 앱',
          short_name: 'Vite 앱',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      
      // 번들 분석 (production에서만)
      mode === 'production' && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    
    // 리졸브 설정
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@services': path.resolve(__dirname, './src/services'),
        '@types': path.resolve(__dirname, './src/types'),
        '@styles': path.resolve(__dirname, './src/styles')
      }
    },
    
    // 서버 설정
    server: {
      host: true, // 네트워크 접근 허용
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      cors: true
    },
    
    // 빌드 설정
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // node_modules 내의 패키지들을 자동으로 청크로 분리
            if (id.includes('node_modules')) {
              // react 관련 패키지들을 하나의 청크로
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              // MUI와 emotion 관련 패키지들을 하나의 청크로
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui-vendor';
              }
              // 그 외 node_modules의 패키지들은 vendors 청크로
              return 'vendors';
            }
          },
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // 정적 자산 처리
    publicDir: 'public',    // 정적 파일 디렉토리 설정
    assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.eot'],  // 추가 자산 형식 포함
    
    // CSS 설정
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: mode === 'production'
          ? '[hash:base64:8]'
          : '[local]_[hash:base64:5]'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@styles/variables.scss";`
        }
      }
    },
    
    // 최적화 설정
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@vite/client', '@vite/env'],
      force: isProduction,
      esbuildOptions: {
        target: 'es2020',
        supported: { 
          'top-level-await': true 
        },
        plugins: [
          // 커스텀 ESBuild 플러그인
        ]
      }
    },
    
    // 에러 핸들링
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.less')) {
        server.ws.send({
          type: 'custom',
          event: 'style-update',
          data: { file }
        })
      }
    },
    
    // 성능 모니터링 설정 추가
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs'],
        strictRequires: true,
        transformMixedEsModules: true
      }
    },
    
    // 워커 스레드 설정
    worker: {
      format: 'es',
      plugins: [],
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js'
        }
      }
    },
    
    // 실험적 기능 설정
    experimental: {
      renderBuiltUrl: (filename, { hostType, type, hostId }) => {
        if (type === 'public') {
          return `${env.VITE_CDN_URL}/${filename}`
        }
        return filename
      }
    }
  }
})
```

이 설정은 다음과 같은 고급 기능들을 포함합니다:

- 🔒 환경 변수 기반 설정
- 🔍 소스맵 생성 (개발 환경에서만)
- 📦 청크 분할 최적화
- 🗜️ GZIP 압축
- 📱 PWA 지원
- 🏷️ TypeScript 지원
- 🎯 레거시 브라우저 지원
- 📊 번들 분석
- 🎨 SCSS 전처리기 설정
- 🔄 프록시 설정
- 🚀 성능 최적화

이 설정을 사용하기 위해서는 다음 의존성들을 설치해야 합니다:

```bash
npm install -D vite-plugin-compression rollup-plugin-visualizer @vitejs/plugin-legacy vite-plugin-svgr vite-plugin-pwa @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
