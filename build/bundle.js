var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function r(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function f(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function g(t,e){t.value=null==e?"":e}function m(t,e){for(let n=0;n<t.options.length;n+=1){const o=t.options[n];if(o.__value===e)return void(o.selected=!0)}}let v;function $(t){v=t}function x(){const t=function(){if(!v)throw new Error("Function called outside component initialization");return v}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const s=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);o.slice().forEach(e=>{e.call(t,s)})}}}const y=[],b=[],_=[],w=[],k=Promise.resolve();let j=!1;function q(t){_.push(t)}let T=!1;const C=new Set;function D(){if(!T){T=!0;do{for(let t=0;t<y.length;t+=1){const e=y[t];$(e),E(e.$$)}for(y.length=0;b.length;)b.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];C.has(e)||(C.add(e),e())}_.length=0}while(y.length);for(;w.length;)w.pop()();j=!1,T=!1,C.clear()}}function E(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}const M=new Set;function N(t,e){t&&t.i&&(M.delete(t),t.i(e))}function A(t,e,n,o){if(t&&t.o){if(M.has(t))return;M.add(t),(void 0).c.push(()=>{M.delete(t),o&&(n&&t.d(1),o())}),t.o(e)}}function F(t){t&&t.c()}function H(t,n,i){const{fragment:l,on_mount:r,on_destroy:c,after_update:a}=t.$$;l&&l.m(n,i),q(()=>{const n=r.map(e).filter(s);c?c.push(...n):o(n),t.$$.on_mount=[]}),a.forEach(q)}function L(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function P(t,e){-1===t.$$.dirty[0]&&(y.push(t),j||(j=!0,k.then(D)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function S(e,s,i,l,r,a,u=[-1]){const d=v;$(e);const f=s.props||{},p=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:u};let h=!1;if(p.ctx=i?i(e,f,(t,n,...o)=>{const s=o.length?o[0]:n;return p.ctx&&r(p.ctx[t],p.ctx[t]=s)&&(p.bound[t]&&p.bound[t](s),h&&P(e,t)),n}):[],p.update(),h=!0,o(p.before_update),p.fragment=!!l&&l(p.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);p.fragment&&p.fragment.l(t),t.forEach(c)}else p.fragment&&p.fragment.c();s.intro&&N(e.$$.fragment),H(e,s.target,s.anchor),D()}$(d)}class z{$destroy(){L(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}var O={getDurationFromNow(t){const e=new Date(t),n=new Date,o=Y(e,n),s=B(o);if(s<60)return I(s)+" min";const i=W(s);return I(i)+" hours"},getInitialExpDateWithAdditionalHours(t=0){const e=new Date;if(e.getHours()+t>24){e.getHours()+t>24?e.getHours():e.getHours();return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()+1} ${t}:${e.getMinutes()}`}return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()} ${t}:${e.getMinutes()}`}};const Y=(t,e)=>t-e,B=t=>t/6e4,I=t=>Math.ceil(t),W=t=>t/60;function G(t,e,n){const o=t.slice();return o[6]=e[n],o[7]=e,o[8]=n,o}function J(e){let n;return{c(){n=a("div"),n.textContent="There is nothing todo. Let's add some!",p(n,"class","no-todo svelte-1e6dpjc")},m(t,e){r(t,n,e)},p:t,d(t){t&&c(n)}}}function K(t){let e,n=t[0],o=[];for(let e=0;e<n.length;e+=1)o[e]=Q(G(t,n,e));return{c(){e=a("section");for(let t=0;t<o.length;t+=1)o[t].c();p(e,"class","todos-container svelte-1e6dpjc")},m(t,n){r(t,e,n);for(let t=0;t<o.length;t+=1)o[t].m(e,null)},p(t,s){if(3&s){let i;for(n=t[0],i=0;i<n.length;i+=1){const l=G(t,n,i);o[i]?o[i].p(l,s):(o[i]=Q(l),o[i].c(),o[i].m(e,null))}for(;i<o.length;i+=1)o[i].d(1);o.length=n.length}},d(t){t&&c(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(o,t)}}}function Q(t){let e,n,s,i,g,m,v,$,x,y,b,_,w,k,j,q,T,C,D,E,M,N,A,F,H,L,P,S,z=t[6].priority+"",Y=t[6].title+"",B=O.getDurationFromNow(t[6].expired)+"";function I(){t[4].call(s,t[7],t[8])}function W(...e){return t[5](t[8],...e)}return{c(){e=a("div"),n=a("div"),s=a("input"),g=d(),m=a("label"),$=d(),x=a("p"),y=a("span"),b=u(z),w=d(),k=a("span"),j=u(Y),q=d(),T=a("div"),C=a("div"),D=d(),E=a("div"),M=u("Due in "),N=u(B),A=d(),F=a("div"),H=d(),p(s,"class","checkbox svelte-1e6dpjc"),p(s,"type","checkbox"),p(s,"id",i="todo-"+t[8]),p(m,"for",v="todo-"+t[8]),p(m,"class","svelte-1e6dpjc"),p(n,"class","checkbox-container svelte-1e6dpjc"),p(y,"class",_="priority "+t[6].priority+" svelte-1e6dpjc"),p(k,"class","title svelte-1e6dpjc"),p(x,"class","todos-description svelte-1e6dpjc"),p(C,"class","time svelte-1e6dpjc"),p(E,"class","text-duration"),p(T,"class","duration svelte-1e6dpjc"),p(F,"class","action svelte-1e6dpjc"),p(F,"title","delete todo"),p(e,"class",L="todo-lists "+(t[6].completed?"complete":"")+" svelte-1e6dpjc")},m(o,i){r(o,e,i),l(e,n),l(n,s),s.checked=t[6].completed,l(n,g),l(n,m),l(e,$),l(e,x),l(x,y),l(y,b),l(x,w),l(x,k),l(k,j),l(e,q),l(e,T),l(T,C),l(T,D),l(T,E),l(E,M),l(E,N),l(e,A),l(e,F),l(e,H),P||(S=[f(s,"change",I),f(F,"click",W)],P=!0)},p(n,o){t=n,1&o&&(s.checked=t[6].completed),1&o&&z!==(z=t[6].priority+"")&&h(b,z),1&o&&_!==(_="priority "+t[6].priority+" svelte-1e6dpjc")&&p(y,"class",_),1&o&&Y!==(Y=t[6].title+"")&&h(j,Y),1&o&&B!==(B=O.getDurationFromNow(t[6].expired)+"")&&h(N,B),1&o&&L!==(L="todo-lists "+(t[6].completed?"complete":"")+" svelte-1e6dpjc")&&p(e,"class",L)},d(t){t&&c(e),P=!1,o(S)}}}function R(e){let n;function o(t,e){return t[0].length?K:J}let s=o(e),i=s(e);return{c(){i.c(),n=u("")},m(t,e){i.m(t,e),r(t,n,e)},p(t,[e]){s===(s=o(t))&&i?i.p(t,e):(i.d(1),i=s(t),i&&(i.c(),i.m(n.parentNode,n)))},i:t,o:t,d(t){i.d(t),t&&c(n)}}}function U(t,e,n){let o=[],{totalTasks:s=0}=e;s=o.length;const i=t=>{o.splice(t,1),n(0,o),n(2,s=o.length)};return t.$set=t=>{"totalTasks"in t&&n(2,s=t.totalTasks)},[o,i,s,t=>{o.push(t),o.sort((t,e)=>new Date(t.expired)-new Date(e.expired)),n(0,o),n(2,s=o.length)},function(t,e){t[e].completed=this.checked,n(0,o)},t=>i(t)]}class V extends z{constructor(t){super(),S(this,t,U,R,i,{totalTasks:2,addTodo:3})}get addTodo(){return this.$$.ctx[3]}}function X(e){let n,s,i,u,h,v,$,x,y,b,_,w,k,j,T,C,D,E,M,N,A,F;return{c(){n=a("section"),s=a("div"),i=a("label"),i.textContent="Title",u=d(),h=a("input"),v=d(),$=a("div"),x=a("label"),x.textContent="Deadline",y=d(),b=a("input"),_=d(),w=a("div"),k=a("label"),k.textContent="Priority",j=d(),T=a("select"),C=a("option"),C.textContent="Low",D=a("option"),D.textContent="High",E=d(),M=a("div"),N=a("button"),N.textContent="Add",p(i,"for","title"),p(i,"class","svelte-1nhbtqs"),p(h,"type","text"),p(h,"id","title"),p(h,"class","svelte-1nhbtqs"),p(s,"class","input-group svelte-1nhbtqs"),p(x,"for","deadline"),p(x,"class","svelte-1nhbtqs"),p(b,"type","datetime-local"),p(b,"id","deadline"),p(b,"class","svelte-1nhbtqs"),p($,"class","input-group svelte-1nhbtqs"),p(k,"for","priority"),p(k,"class","svelte-1nhbtqs"),C.__value="low",C.value=C.__value,p(C,"class","svelte-1nhbtqs"),D.__value="high",D.value=D.__value,p(D,"class","svelte-1nhbtqs"),p(T,"name","priority"),p(T,"id","priority"),p(T,"class","svelte-1nhbtqs"),void 0===e[0].priority&&q(()=>e[4].call(T)),p(w,"class","input-group svelte-1nhbtqs"),p(N,"class","add-button svelte-1nhbtqs"),p(M,"class","input-group mt-auto svelte-1nhbtqs"),p(n,"class","new-todo svelte-1nhbtqs")},m(t,o){r(t,n,o),l(n,s),l(s,i),l(s,u),l(s,h),g(h,e[0].title),l(n,v),l(n,$),l($,x),l($,y),l($,b),g(b,e[0].expired),l(n,_),l(n,w),l(w,k),l(w,j),l(w,T),l(T,C),l(T,D),m(T,e[0].priority),l(n,E),l(n,M),l(M,N),A||(F=[f(h,"input",e[2]),f(b,"input",e[3]),f(T,"change",e[4]),f(N,"click",e[1])],A=!0)},p(t,[e]){1&e&&h.value!==t[0].title&&g(h,t[0].title),1&e&&g(b,t[0].expired),1&e&&m(T,t[0].priority)},i:t,o:t,d(t){t&&c(n),A=!1,o(F)}}}function Z(t,e,n){let o={title:"",priority:"low",expired:""};const s=x();return[o,()=>{o.title&&o.expired?(s("addTodo",o),n(0,o={title:"",priority:"low",expired:""})):alert("Please fill all the detail first!")},function(){o.title=this.value,n(0,o)},function(){o.expired=this.value,n(0,o)},function(){o.priority=function(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}(this),n(0,o)}]}class tt extends z{constructor(t){super(),S(this,t,Z,X,i,{})}}function et(t){let e,n,o,s,i,f,g,m,v,$,x,y,_,k,j,q;function T(e){t[4].call(null,e)}y=new tt({}),y.$on("addTodo",t[2]);let C={};return void 0!==t[1]&&(C.totalTasks=t[1]),k=new V({props:C}),t[3](k),b.push(()=>function(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}(k,"totalTasks",T)),{c(){e=a("link"),n=a("style"),n.textContent="* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;  \n  font-family: 'Montserrat', sans-serif;\n}\nbody {\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}",o=d(),s=a("main"),i=a("header"),f=a("p"),f.textContent="Todo Lists!",g=d(),m=a("p"),v=u(t[1]),$=u(" Tasks"),x=d(),F(y.$$.fragment),_=d(),F(k.$$.fragment),p(e,"href","https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap"),p(e,"rel","stylesheet"),p(f,"class","title svelte-jnq19d"),p(m,"class","remaining-task svelte-jnq19d"),p(i,"class","svelte-jnq19d"),p(s,"class","svelte-jnq19d")},m(t,c){l(document.head,e),l(document.head,n),r(t,o,c),r(t,s,c),l(s,i),l(i,f),l(i,g),l(i,m),l(m,v),l(m,$),l(s,x),H(y,s,null),l(s,_),H(k,s,null),q=!0},p(t,[e]){(!q||2&e)&&h(v,t[1]);const n={};var o;!j&&2&e&&(j=!0,n.totalTasks=t[1],o=()=>j=!1,w.push(o)),k.$set(n)},i(t){q||(N(y.$$.fragment,t),N(k.$$.fragment,t),q=!0)},o(t){A(y.$$.fragment,t),A(k.$$.fragment,t),q=!1},d(i){c(e),c(n),i&&c(o),i&&c(s),L(y),t[3](null),L(k)}}}function nt(t,e,n){let o;let s;return n(1,s=void 0),[o,s,({detail:t})=>o.addTodo(t),function(t){b[t?"unshift":"push"](()=>{o=t,n(0,o)})},function(t){s=t,n(1,s),n(5,void 0)}]}return new class extends z{constructor(t){super(),S(this,t,nt,et,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
