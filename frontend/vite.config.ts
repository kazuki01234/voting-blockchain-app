import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { ConfigEnv, UserConfig } from 'vite'

export default ({ mode }: ConfigEnv): UserConfig => {
  // 'VITE_' プレフィックスの環境変数だけロード
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [react()],
    define: {
      // React で process.env.VITE_BACKEND_URL を使えるように
      'process.env': env,
    },
  })
}
