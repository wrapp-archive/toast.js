(function(){var g,i,d,h;i=function(b){var a;if(null==b)return!0;for(a in b)return!1;return!0};d=function(b){var a,e,c;e={};for(a in b)c=b[a],e[a]=c;return e};window.TransitionCallbacks=function(){function b(a){null==a&&(a={});null!=a.timeout&&(this.timeout=a.timeout);null!=a.clearAll&&(this.clearAll=a.clearAll);this._transitionCallbacks={}}b.name="TransitionCallbacks";b.VERSION="1.0.1";b.timeout=3E3;b.clearAll=!1;b.transition=function(){var a,b,c,f;c=(document.body||document.documentElement).style;
b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MsTransition:"MSTransitionEnd",OTransition:"oTransitionEnd",transition:"TransitionEnd"};for(a in b)if(f=b[a],a in c)return{end:f};return!1}();b._transitionCallbacks={};b.addCallback=function(a,e,c){var f,d,g,h=this;"function"===typeof e?(c=e,e={}):e||(e={});if("function"===typeof(null!=a?a.get:void 0))a=a.get(0);if(!a)throw new b.NoElementGiven;if(!c)throw new b.NoCallbackGiven;d=this._getTimeout(e);this._clearOldCallbacks(a,
c,e);(g=this._transitionCallbacks)[a]||(g[a]={});f=this._transitionCallbacks[a][c]={};f.callback=function(){if(!(h._transitionCallbacks[a][c]==null||f.cancelled)){f.cancel();return c.call(a)}};f.cancel=function(){f.cancelled=true;delete h._transitionCallbacks[a][c];h.transition&&typeof a.removeEventListener==="function"&&a.removeEventListener(h.transition.end,f,false);return clearTimeout(f.timeout)};this.transition&&"function"===typeof a.addEventListener?(a.addEventListener(this.transition.end,f.callback,
!1),!1!==d&&(f.timeout=setTimeout(f.callback,d))):f.callback()};b._getTimeout=function(a){return null!=a.timeout?a.timeout:null!=this.timeout?this.timeout:b.timeout};b._clearOldCallbacks=function(a,e,c){return(null!=c.clearAll?c.clearAll:null!=this.clearAll?this.clearAll:b.clearAll)?this.cancelCallback(a):this.cancelCallback(a,e)};b.cancelCallback=function(a,b){var c,f,g;if("function"===typeof(null!=a?a.get:void 0))a=a.get(0);if(!this._transitionCallbacks[a])return!1;if(null!=b)if(this._transitionCallbacks[a][b])this._transitionCallbacks[a][b].cancel();
else return!1;else for(f in c=d(this._transitionCallbacks[a]),c)g=c[f],g.cancel();return!0};b.cancelAllCallbacks=function(){var a,b;b=[];for(a in this._transitionCallbacks)b.push(this.cancelCallback(a));return b};b.isCallbackPending=function(a,b){var c;return!(c=this._transitionCallbacks[a])?!1:null!=b?b in c:!i(c)};b.prototype.transition=b.transition;b.prototype.addCallback=b.addCallback;b.prototype._getTimeout=b._getTimeout;b.prototype._clearOldCallbacks=b._clearOldCallbacks;b.prototype.cancelCallback=
b.cancelCallback;b.prototype.cancelAllCallbacks=b.cancelAllCallbacks;b.prototype.hasCallbackPending=b.hasCallbackPending;return b}.call(this);TransitionCallbacks.NoCallbackGiven=function(){function b(){this.name="NoCallbackGiven"}b.name="NoCallbackGiven";b.prototype=Error.prototype;return b}();TransitionCallbacks.NoElementGiven=function(){function b(){this.name="NoElementGiven"}b.name="NoElementGiven";b.prototype=Error.prototype;return b}();if(g=window.jQuery)g.support.transition=TransitionCallbacks.transition,
h=new TransitionCallbacks,g.fn.addTransitionCallback=function(b,a){0<this.length&&h.addCallback(this.get(0),b,a);return this},g.fn.cancelTransitionCallback=function(b){var a,e,c;e=0;for(c=this.length;e<c;e++)a=this[e],h.cancelCallback(a,b);return this},g.fn.hasTransitionCallbackPending=function(b){var a;a=!1;this.each(function(){a&&(a=h.hasCallbackPending(b));return!a});return a},g.cancelAllTransitionCallbacks=function(){return h.cancelAllCallbacks()}}).call(this);
(function(){var g,i,d=function(b,a){return function(){return b.apply(a,arguments)}},h=[].slice;g={"short":2E3,medium:4E3,"long":6E3};i="duration,content,id,className,animate,allowHTML".split(",");window.Toast=function(){function b(a){null==a&&(a={});this._remove=d(this._remove,this);this.hide=d(this.hide,this);this._setupHideTimer=d(this._setupHideTimer,this);this._addClass=d(this._addClass,this);this._showElement=d(this._showElement,this);this.isShowing=d(this.isShowing,this);this._addElementClasses=
d(this._addElementClasses,this);this._shouldAnimate=d(this._shouldAnimate,this);this._option=d(this._option,this);this._addContent=d(this._addContent,this);this._clearTimeout=d(this._clearTimeout,this);this._removeClass=d(this._removeClass,this);this._hasClass=d(this._hasClass,this);this.show=d(this.show,this);this._addElementId=d(this._addElementId,this);this._createElement=d(this._createElement,this);this._setupDefaultOptions=d(this._setupDefaultOptions,this);this.tc=new TransitionCallbacks({clearAll:!0,
timeout:500});this._setupDefaultOptions(a)._createElement()._addElementId()}b.name="Toast";b.VERSION="1.0.1";b.prototype._setupDefaultOptions=function(a){for(var b in i)this[b]=a[b];this.duration=a.duration||"medium";this.animate=!1!==this.animate;return this};b.prototype._createElement=function(){this.element=document.createElement("div");return this};b.prototype._addElementId=function(){this.id&&(this.element.id=this.id);return this};b.prototype.show=function(a){null==a&&(a={});if(!this._hasClass("bounce"))return this._temporaryOptions=
a,this._removeClass("hide")._clearTimeout()._addContent()._addElementClasses()._showElement()._setupHideTimer(),this};b.prototype._hasClass=function(a){return b._classRegexp(a).test(this.element.className)};b._classRegexp=function(a){var e;b._classRegexpLookup||(b._classRegexpLookup={});return(e=b._classRegexpLookup)[a]||(e[a]=RegExp("(^| )"+a+"($| )"))};b.prototype._removeClass=function(){var a,e,c,d;e=1<=arguments.length?h.call(arguments,0):[];c=0;for(d=e.length;c<d;c++)a=e[c],a=b._classRegexp(a),
this.element.className=this.element.className.replace(a,"");return this};b.prototype._clearTimeout=function(){clearTimeout(this.hideTimeout);this.hideTimeout=void 0;return this};b.prototype._addContent=function(a){null==a&&(a=this._option("content"));if("function"===typeof a)return this._addContent(a);this.element[!0===this._option("allowHTML")?"innerHTML":null!=this.element.innerText?"innerText":"textContent"]=a;return this};b.prototype._option=function(a){return a in this._temporaryOptions?this._temporaryOptions[a]:
this[a]};b.prototype._shouldAnimate=function(){return!1!==this._option("animate")};b.prototype._addElementClasses=function(){this.isShowing()||(this.element.className="toast",this._shouldAnimate()&&this._addClass("animate"),this._option("className")&&this._addClass(this.className));return this};b.prototype.isShowing=function(){return(this._hasClass("shown")||this._hasClass("show"))&&!this._hasClass("hide")};b.prototype._showElement=function(){var a,b;document.body.appendChild(this.element);b=this.element.offsetWidth;
a=this.element.offsetHeight;this.element.style.marginLeft=parseInt(-b/2,10)+"px";this.element.style.marginTop=parseInt(-a/2,10)+"px";this.element.style.left="50%";this.element.style.top="50%";this._addClass("bounce");this.isShowing()||this._addClass("show");return this};b.prototype._addClass=function(){var a,b,c,d;b=1<=arguments.length?h.call(arguments,0):[];c=0;for(d=b.length;c<d;c++)a=b[c],this._hasClass(a)||(this.element.className&&(this.element.className+=" "),this.element.className+=a);return this};
b.prototype._setupHideTimer=function(){var a,b=this;a=this._option("duration");a in g&&(a=g[a]);this.tc.addCallback(this.element,function(){"infinite"!==a&&(b.hideTimeout=setTimeout(function(){return b.hide()},a));return b._removeClass("show","bounce")._addClass("shown")});return this};b.prototype.hide=function(a){null==a&&(a={});this._temporaryOptions=a;this._clearTimeout();this._shouldAnimate()?(this._addClass("hide"),this.tc.addCallback(this.element,this._remove)):this._remove();return this};b.prototype._remove=
function(){var a;null!=(a=this.element.parentNode)&&a.removeChild(this.element);this._removeClass("hide","shown");return this};return b}.call(this)}).call(this);