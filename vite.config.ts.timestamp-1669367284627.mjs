// vite.config.ts
import { defineConfig } from "file:///D:/Users/chenjh/WebstormProjects/pathogen-client/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Users/chenjh/WebstormProjects/pathogen-client/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    proxy: {
      "/devServer": {
        target: "http://1486641sd0.iask.in:35485",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devServer/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxjaGVuamhcXFxcV2Vic3Rvcm1Qcm9qZWN0c1xcXFxwYXRob2dlbi1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXGNoZW5qaFxcXFxXZWJzdG9ybVByb2plY3RzXFxcXHBhdGhvZ2VuLWNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvY2hlbmpoL1dlYnN0b3JtUHJvamVjdHMvcGF0aG9nZW4tY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBvcGVuIDogdHJ1ZSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvZGV2U2VydmVyJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNDg2NjQxc2QwLmlhc2suaW46MzU0ODUnLFxyXG4gICAgICAgIC8vdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgICB3czogdHJ1ZSxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9kZXZTZXJ2ZXIvLCAnJylcclxuICAgICAgfSxcclxuICAgIH1cclxuXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRVLFNBQVMsb0JBQW9CO0FBQ3pXLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixRQUFRO0FBQUEsSUFDTixNQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFFUixJQUFJO0FBQUEsUUFDSixjQUFjO0FBQUEsUUFDZCxTQUFTLFVBQVEsS0FBSyxRQUFRLGdCQUFnQixFQUFFO0FBQUEsTUFDbEQ7QUFBQSxJQUNGO0FBQUEsRUFFRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
