/*!
 * 
 *   raytracer-js v0.1.0
 *   https://github.com/hodgef/js-library-boilerplate
 * 
 *   Copyright (c) Juan Pablo Sarmiento (https://github.com/jps327)
 * 
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *   
 */
!function(e,r){"object"===typeof exports&&"object"===typeof module?module.exports=r():"function"===typeof define&&define.amd?define("raytracer-js",[],r):"object"===typeof exports?exports["raytracer-js"]=r():e["raytracer-js"]=r()}(window,(function(){return function(e){var r={};function __webpack_require__(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}return __webpack_require__.m=e,__webpack_require__.c=r,__webpack_require__.d=function(e,r,t){__webpack_require__.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},__webpack_require__.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,r){if(1&r&&(e=__webpack_require__(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(__webpack_require__.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)__webpack_require__.d(t,n,function(r){return e[r]}.bind(null,n));return t},__webpack_require__.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(r,"a",r),r},__webpack_require__.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=1)}([function(e,r,t){"use strict";e.exports=function(e,r,t,n,o,i,a,_){if(!e){var u;if(void 0===r)u=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[t,n,o,i,a,_],f=0;(u=new Error(r.replace(/%s/g,(function(){return c[f++]})))).name="Invariant Violation"}throw u.framesToPop=1,u}}},function(e,r,t){e.exports=t(3)},function(e,r,t){},function(e,r,t){"use strict";t.r(r);var n=t(0),o=t.n(n);t(2);function _defineProperty(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var i=function App(){!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,App),_defineProperty(this,"myVar",!0),_defineProperty(this,"myArrowMethod",(function(){console.log("Arrow method fired")}));var e=this.myArrowMethod,r=this.myVar;console.log("Lib constructor called",r),e()},a=document.getElementById("root");function colorPixel(e,r,t,n,o,i){var a=4*(t*e.width+r);e.data[a]=n,e.data[a+1]=o,e.data[a+2]=i,e.data[a+3]=255}o()(a,"Root element must exist"),a.appendChild(function(e,r){var t=document.createElement("canvas");t.setAttribute("width",String(e)),t.setAttribute("height",String(r));for(var n=t.getContext("2d"),o=n.createImageData(e,r),i=0;i<e;i++)for(var a=0;a<r;a++)colorPixel(o,i,a,100,100,100);return n.putImageData(o,0,0),t}(400,200));r.default=i}])}));
//# sourceMappingURL=index.js.map