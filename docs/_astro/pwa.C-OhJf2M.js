import{c as s}from"./createLucideIcon.tO8mbuOy.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],i=s("refresh-cw",n);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],p=s("x",h),d=async()=>{try{const e=await caches.keys();for(const a of e)try{const r=await caches.open(a),o=await r.keys();for(let t=0;t<Math.min(o.length,3);t++){const c=await r.match(o[t]);c&&await c.text()}}catch{console.warn(`Cache ${a} appears corrupted, clearing...`),await caches.delete(a)}}catch(e){console.warn("Failed to clear corrupted caches:",e)}},w=e=>{console.error(`PWA Error [${e.type}]:`,e.message,e.originalError);try{const a=JSON.parse(localStorage.getItem("pwa-errors")||"[]");a.push(e),a.length>10&&a.splice(0,a.length-10),localStorage.setItem("pwa-errors",JSON.stringify(a))}catch(a){console.warn("Failed to store PWA error:",a)}window.dispatchEvent(new CustomEvent("pwa-error",{detail:e}))},y=()=>{try{localStorage.removeItem("pwa-errors")}catch(e){console.warn("Failed to clear PWA errors:",e)}};export{i as R,p as X,y as a,d as c,w as h};
