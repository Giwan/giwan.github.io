import{j as m}from"./jsx-runtime.D_zvdyIk.js";import{B as f}from"./button.C48yv3co.js";import{r as a}from"./index.BVOCwoKb.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),x=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,s,r)=>r?r.toUpperCase():s.toLowerCase()),p=e=>{const t=x(e);return t.charAt(0).toUpperCase()+t.slice(1)},k=(...e)=>e.filter((t,s,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===s).join(" ").trim(),T=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var v={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=a.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:s=2,absoluteStrokeWidth:r,className:l="",children:n,iconNode:o,...h},d)=>a.createElement("svg",{ref:d,...v,width:t,height:t,stroke:e,strokeWidth:r?Number(s)*24/Number(t):s,className:k("lucide",l),...!n&&!T(h)&&{"aria-hidden":"true"},...h},[...o.map(([c,i])=>a.createElement(c,i)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=(e,t)=>{const s=a.forwardRef(({className:r,...l},n)=>a.createElement(C,{ref:n,iconNode:t,className:k(`lucide-${w(p(e))}`,`lucide-${e}`,r),...l}));return s.displayName=p(e),s};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],E=u("monitor",j);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],N=u("moon",M);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],y=u("sun",A),L=()=>{const[e,t]=a.useState("system"),[s,r]=a.useState("light");return a.useEffect(()=>{const o=localStorage.getItem("theme");o&&["light","dark","system"].includes(o)&&t(o)},[]),a.useEffect(()=>{const o=()=>{const c=document.documentElement;let i;e==="system"?i=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":i=e,r(i);const g=()=>{i==="dark"?(c.classList.add("dark"),c.setAttribute("data-theme","dark")):(c.classList.remove("dark"),c.setAttribute("data-theme","light"))};typeof document<"u"&&"startViewTransition"in document?document.startViewTransition(()=>g()):g(),localStorage.setItem("theme",e)};o();const h=window.matchMedia("(prefers-color-scheme: dark)"),d=()=>{e==="system"&&o()};return h.addEventListener("change",d),()=>{h.removeEventListener("change",d)}},[e]),{theme:e,resolvedTheme:s,toggleTheme:()=>{t(o=>{switch(o){case"light":return"dark";case"dark":return"system";case"system":return"light";default:return"light"}})},setTheme:o=>{t(o)}}},$=()=>{const{theme:e,toggleTheme:t}=L(),s=()=>{switch(e){case"light":return m.jsx(y,{className:"h-4 w-4"});case"dark":return m.jsx(N,{className:"h-4 w-4"});case"system":return m.jsx(E,{className:"h-4 w-4"});default:return m.jsx(y,{className:"h-4 w-4"})}},r=()=>{switch(e){case"light":return"Switch to dark mode";case"dark":return"Switch to system theme";case"system":return"Switch to light mode";default:return"Toggle theme"}};return m.jsxs(f,{variant:"ghost",size:"icon",onClick:t,title:r(),className:"h-9 w-9",children:[s(),m.jsx("span",{className:"sr-only",children:r()})]})};export{$ as ThemeToggle};
