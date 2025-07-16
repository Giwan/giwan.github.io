import{j as s}from"./jsx-runtime.D_zvdyIk.js";import{B as g}from"./button.C48yv3co.js";import{r as c}from"./index.BVOCwoKb.js";import{c as h}from"./createLucideIcon.tO8mbuOy.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],k=h("monitor",y);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],f=h("moon",p);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],u=h("sun",T),w=()=>{const[t,a]=c.useState("system"),[m,r]=c.useState("light");return c.useEffect(()=>{const e=localStorage.getItem("theme");e&&["light","dark","system"].includes(e)&&a(e)},[]),c.useEffect(()=>{const e=()=>{const o=document.documentElement;let n;t==="system"?n=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":n=t,r(n);const l=()=>{n==="dark"?(o.classList.add("dark"),o.setAttribute("data-theme","dark")):(o.classList.remove("dark"),o.setAttribute("data-theme","light"))};typeof document<"u"&&"startViewTransition"in document?document.startViewTransition(()=>l()):l(),localStorage.setItem("theme",t)};e();const i=window.matchMedia("(prefers-color-scheme: dark)"),d=()=>{t==="system"&&e()};return i.addEventListener("change",d),()=>{i.removeEventListener("change",d)}},[t]),{theme:t,resolvedTheme:m,toggleTheme:()=>{a(e=>{switch(e){case"light":return"dark";case"dark":return"system";case"system":return"light";default:return"light"}})},setTheme:e=>{a(e)}}},E=()=>{const{theme:t,toggleTheme:a}=w(),m=()=>{switch(t){case"light":return s.jsx(u,{className:"h-4 w-4"});case"dark":return s.jsx(f,{className:"h-4 w-4"});case"system":return s.jsx(k,{className:"h-4 w-4"});default:return s.jsx(u,{className:"h-4 w-4"})}},r=()=>{switch(t){case"light":return"Switch to dark mode";case"dark":return"Switch to system theme";case"system":return"Switch to light mode";default:return"Toggle theme"}};return s.jsxs(g,{variant:"ghost",size:"icon",onClick:a,title:r(),className:"h-9 w-9",children:[m(),s.jsx("span",{className:"sr-only",children:r()})]})};export{E as ThemeToggle};
