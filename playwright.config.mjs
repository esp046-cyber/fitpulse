import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'*.spec.mjs',updateSnapshots:'missing',use:{baseURL:'http://localhost:8080',viewport:{width:390,height:844}},
 webServer:{command:'node server/server.js',url:'http://localhost:8080',reuseExistingServer:true}});
