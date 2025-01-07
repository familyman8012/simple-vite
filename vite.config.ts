import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv, UserConfig, HmrContext, ViteDevServer, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import visualizer from 'rollup-plugin-visualizer'
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import Pages from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  // 개발/프로덕션 모드에 따른 설정 분기
  const isProduction = mode === 'production'
  
  return {
    // 기본 설정
    base: './',
    
    // 플러그인 설정
    plugins: [
      // React 지원
      react({
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
              sourceMap: !isProduction,
              // 자동 레이블링
              labelFormat: '[local]',
              // CSS prop 지원
              cssPropOptimization: true
            }]
          ]
        }
      }),
      // Pages 플러그인 추가
      Pages({
        dirs: 'src/pages',
        importMode: (path) => {
          if (path.includes('admin')) {
            return 'sync'; // admin 페이지는 동적 로드하지 않고 정적 로드
          }
          return 'async'; // 나머지는 동적 로드
        },
        extensions: ['tsx'],
        routeStyle: 'next',
        // debug: true,
        onRoutesGenerated: (routes) => {
          console.log('Generated Routes:', routes);
        },
      }),
      tsconfigPaths(),
      checker({ typescript: true }),
      
      // Less HMR 플러그인
      {
        name: 'vite-plugin-less-hmr',
        handleHotUpdate(ctx: HmrContext) {
          if (ctx.file.endsWith('.less')) {
            ctx.server.ws.send({
              type: 'custom',
              event: 'style-update',
              data: { file: ctx.file }
            })
          }
        }
      } as Plugin,
      
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
        disable: !isProduction,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),

      // Brotli 압축 추가
      viteCompression({
        verbose: true,
        disable: !isProduction,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br'
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
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24시간
                }
              }
            }
          ]
        }
      }),
      
      // 번들 분석 (production에서만)
      // mode === 'production' && {
      //   ...visualizer({
      //     open: true,
      //     gzipSize: true,
      //     brotliSize: true
      //   }),
      //   apply: 'build'
      // } as unknown as Plugin,
    ],
    
    // 리졸브 설정 - tsconfigPaths 로 대체.
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, './src'),
    //     '@components': path.resolve(__dirname, './src/components'),
    //     '@assets': path.resolve(__dirname, './src/assets')
    //   }
    // },
    
    // 서버 설정
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      cors: true,
      hmr: {
        overlay: true
      }
    },
    
    // 빌드 설정
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      },
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs'],
        strictRequires: true,
        transformMixedEsModules: true
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // React와 관련 라이브러리들
              if (id.includes('react') || 
                  id.includes('react-dom') || 
                  id.includes('scheduler')) {
                return 'react-vendor'
              }
              
              // 자주 변경되지 않는 큰 라이브러리들
              if (id.includes('lodash') || 
                  id.includes('axios') || 
                  id.includes('dayjs') || 
                  id.includes('zustand') || 
                  id.includes('react-query') || 
                  id.includes('react-router-dom')) {
                return 'core-vendor'
              }
          
              // UI 관련 라이브러리들 (emotion 제외)
              if (id.includes('material-ui')) {
                return 'ui-vendor'
              }
          
              // 나머지 작은 라이브러리들
              if (!id.includes('@emotion')) {
                return 'vendor'
              }
            }
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo as { names: string[] }
            if (!info.names || info.names.length === 0) {
              return '[name].[hash][extname]'
            }
            
            const fileName = info.names[0]
            const extType = fileName.split('.').at(-1)
            const dirPath = fileName.includes('/') ? fileName.split('/').slice(0, -1).join('/') + '/' : ''
            
            if (extType && /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `images/${dirPath}[name].[hash][extname]`
            }
            if (extType && /woff|woff2|eot|ttf|otf/i.test(extType)) {
              return `fonts/${dirPath}[name].[hash][extname]`
            }
            return '[name].[hash][extname]'
          }
        }
      }
    },
    
    // 최적화 설정
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@vite/client', '@vite/env']
    },
    
    // 미리보기 설정
    preview: {
      port: 8080,
      strictPort: true,
      host: true,
      cors: true
    },
    
    // 워커 스레드 설정
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js'
        }
      }
    },

    // 환경변수 설정
    envPrefix: 'VITE_',
    
    // 성능 설정
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      legalComments: 'none',
      target: ['es2015']
    }
  }
})
