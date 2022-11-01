exports.id = "component---src-pages-recipe-js";
exports.ids = ["component---src-pages-recipe-js"];
exports.modules = {

/***/ "./node_modules/@gatsbyjs/reach-router/lib/utils.js":
/*!**********************************************************!*\
  !*** ./node_modules/@gatsbyjs/reach-router/lib/utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.shallowCompare = exports.validateRedirect = exports.insertParams = exports.resolve = exports.match = exports.pick = exports.startsWith = undefined;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/invariant.js");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////////////////////////////////////////////////
// startsWith(string, search) - Check if `string` starts with `search`
var startsWith = function startsWith(string, search) {
  return string.substr(0, search.length) === search;
};

////////////////////////////////////////////////////////////////////////////////
// pick(routes, uri)
//
// Ranks and picks the best route to match. Each segment gets the highest
// amount of points, then the type of segment gets an additional amount of
// points where
//
//     static > dynamic > splat > root
//
// This way we don't have to worry about the order of our routes, let the
// computers do it.
//
// A route looks like this
//
//     { path, default, value }
//
// And a returned match looks like:
//
//     { route, params, uri }
//
// I know, I should use TypeScript not comments for these types.
var pick = function pick(routes, uri) {
  var match = void 0;
  var default_ = void 0;

  var _uri$split = uri.split("?"),
      uriPathname = _uri$split[0];

  var uriSegments = segmentize(uriPathname);
  var isRootUri = uriSegments[0] === "";
  var ranked = rankRoutes(routes);

  for (var i = 0, l = ranked.length; i < l; i++) {
    var missed = false;
    var route = ranked[i].route;

    if (route.default) {
      default_ = {
        route: route,
        params: {},
        uri: uri
      };
      continue;
    }

    var routeSegments = segmentize(route.path);
    var params = {};
    var max = Math.max(uriSegments.length, routeSegments.length);
    var index = 0;

    for (; index < max; index++) {
      var routeSegment = routeSegments[index];
      var uriSegment = uriSegments[index];

      if (isSplat(routeSegment)) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/*
        var param = routeSegment.slice(1) || "*";
        params[param] = uriSegments.slice(index).map(decodeURIComponent).join("/");
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      var dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        var matchIsNotReserved = reservedNames.indexOf(dynamicMatch[1]) === -1;
        !matchIsNotReserved ?  true ? (0, _invariant2.default)(false, "<Router> dynamic segment \"" + dynamicMatch[1] + "\" is a reserved name. Please use a different name in path \"" + route.path + "\".") : 0 : void 0;
        var value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        route: route,
        params: params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }

  return match || default_ || null;
};

////////////////////////////////////////////////////////////////////////////////
// match(path, uri) - Matches just one path to a uri, also lol
var match = function match(path, uri) {
  return pick([{ path: path }], uri);
};

////////////////////////////////////////////////////////////////////////////////
// resolve(to, basepath)
//
// Resolves URIs as though every path is a directory, no files.  Relative URIs
// in the browser can feel awkward because not only can you be "in a directory"
// you can be "at a file", too. For example
//
//     browserSpecResolve('foo', '/bar/') => /bar/foo
//     browserSpecResolve('foo', '/bar') => /foo
//
// But on the command line of a file system, it's not as complicated, you can't
// `cd` from a file, only directories.  This way, links have to know less about
// their current path. To go deeper you can do this:
//
//     <Link to="deeper"/>
//     // instead of
//     <Link to=`{${props.uri}/deeper}`/>
//
// Just like `cd`, if you want to go deeper from the command line, you do this:
//
//     cd deeper
//     # not
//     cd $(pwd)/deeper
//
// By treating every path as a directory, linking to relative paths should
// require less contextual information and (fingers crossed) be more intuitive.
var resolve = function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  var _to$split = to.split("?"),
      toPathname = _to$split[0],
      toQuery = _to$split[1];

  var _base$split = base.split("?"),
      basePathname = _base$split[0];

  var toSegments = segmentize(toPathname);
  var baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    var pathname = baseSegments.concat(toSegments).join("/");
    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./         /users/123  =>  /users/123
  // ../        /users/123  =>  /users
  // ../..      /users/123  =>  /
  // ../../one  /a/b/c/d    =>  /a/b/one
  // .././one   /a/b/c/d    =>  /a/b/c/one
  var allSegments = baseSegments.concat(toSegments);
  var segments = [];
  for (var i = 0, l = allSegments.length; i < l; i++) {
    var segment = allSegments[i];
    if (segment === "..") segments.pop();else if (segment !== ".") segments.push(segment);
  }

  return addQuery("/" + segments.join("/"), toQuery);
};

////////////////////////////////////////////////////////////////////////////////
// insertParams(path, params)

var insertParams = function insertParams(path, params) {
  var _path$split = path.split("?"),
      pathBase = _path$split[0],
      _path$split$ = _path$split[1],
      query = _path$split$ === undefined ? "" : _path$split$;

  var segments = segmentize(pathBase);
  var constructedPath = "/" + segments.map(function (segment) {
    var match = paramRe.exec(segment);
    return match ? params[match[1]] : segment;
  }).join("/");
  var _params$location = params.location;
  _params$location = _params$location === undefined ? {} : _params$location;
  var _params$location$sear = _params$location.search,
      search = _params$location$sear === undefined ? "" : _params$location$sear;

  var searchSplit = search.split("?")[1] || "";
  constructedPath = addQuery(constructedPath, query, searchSplit);
  return constructedPath;
};

var validateRedirect = function validateRedirect(from, to) {
  var filter = function filter(segment) {
    return isDynamic(segment);
  };
  var fromString = segmentize(from).filter(filter).sort().join("/");
  var toString = segmentize(to).filter(filter).sort().join("/");
  return fromString === toString;
};

////////////////////////////////////////////////////////////////////////////////
// Junk
var paramRe = /^:(.+)/;

var SEGMENT_POINTS = 4;
var STATIC_POINTS = 3;
var DYNAMIC_POINTS = 2;
var SPLAT_PENALTY = 1;
var ROOT_POINTS = 1;

var isRootSegment = function isRootSegment(segment) {
  return segment === "";
};
var isDynamic = function isDynamic(segment) {
  return paramRe.test(segment);
};
var isSplat = function isSplat(segment) {
  return segment && segment[0] === "*";
};

var rankRoute = function rankRoute(route, index) {
  var score = route.default ? 0 : segmentize(route.path).reduce(function (score, segment) {
    score += SEGMENT_POINTS;
    if (isRootSegment(segment)) score += ROOT_POINTS;else if (isDynamic(segment)) score += DYNAMIC_POINTS;else if (isSplat(segment)) score -= SEGMENT_POINTS + SPLAT_PENALTY;else score += STATIC_POINTS;
    return score;
  }, 0);
  return { route: route, score: score, index: index };
};

var rankRoutes = function rankRoutes(routes) {
  return routes.map(rankRoute).sort(function (a, b) {
    return a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index;
  });
};

var segmentize = function segmentize(uri) {
  return uri
  // strip starting/ending slashes
  .replace(/(^\/+|\/+$)/g, "").split("/");
};

var addQuery = function addQuery(pathname) {
  for (var _len = arguments.length, query = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    query[_key - 1] = arguments[_key];
  }

  query = query.filter(function (q) {
    return q && q.length > 0;
  });
  return pathname + (query && query.length > 0 ? "?" + query.join("&") : "");
};

var reservedNames = ["uri", "path"];

/**
 * Shallow compares two objects.
 * @param {Object} obj1 The first object to compare.
 * @param {Object} obj2 The second object to compare.
 */
var shallowCompare = function shallowCompare(obj1, obj2) {
  var obj1Keys = Object.keys(obj1);
  return obj1Keys.length === Object.keys(obj2).length && obj1Keys.every(function (key) {
    return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
  });
};

////////////////////////////////////////////////////////////////////////////////
exports.startsWith = startsWith;
exports.pick = pick;
exports.match = match;
exports.resolve = resolve;
exports.insertParams = insertParams;
exports.validateRedirect = validateRedirect;
exports.shallowCompare = shallowCompare;

/***/ }),

/***/ "./node_modules/camelcase/index.js":
/*!*****************************************!*\
  !*** ./node_modules/camelcase/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


const preserveCamelCase = string => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
		}
	}

	return string;
};

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = Object.assign({
		pascalCase: false
	}, options);

	const postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
	}

	const hasUpperCase = input !== input.toLowerCase();

	if (hasUpperCase) {
		input = preserveCamelCase(input);
	}

	input = input
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
		.replace(/\d+(\w|$)/g, m => m.toUpperCase());

	return postProcess(input);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports["default"] = camelCase;


/***/ }),

/***/ "./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js":
/*!****************************************************************************!*\
  !*** ./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.__esModule = true;
exports.applyTrailingSlashOption = void 0;

// TODO(v5): Remove legacy setting and default to "always"
const applyTrailingSlashOption = (input, option = `legacy`) => {
  const hasHtmlSuffix = input.endsWith(`.html`);
  const hasXmlSuffix = input.endsWith(`.xml`);
  const hasPdfSuffix = input.endsWith(`.pdf`);
  if (input === `/`) return input;

  if (hasHtmlSuffix || hasXmlSuffix || hasPdfSuffix) {
    option = `never`;
  }

  if (option === `always`) {
    return input.endsWith(`/`) ? input : `${input}/`;
  }

  if (option === `never`) {
    return input.endsWith(`/`) ? input.slice(0, -1) : input;
  }

  return input;
};

exports.applyTrailingSlashOption = applyTrailingSlashOption;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.useScrollRestoration = exports.ScrollContext = void 0;

var _scrollHandler = __webpack_require__(/*! ./scroll-handler */ "./node_modules/gatsby-react-router-scroll/scroll-handler.js");

exports.ScrollContext = _scrollHandler.ScrollHandler;

var _useScrollRestoration = __webpack_require__(/*! ./use-scroll-restoration */ "./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js");

exports.useScrollRestoration = _useScrollRestoration.useScrollRestoration;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/scroll-handler.js":
/*!*******************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/scroll-handler.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.ScrollHandler = exports.ScrollContext = void 0;

var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));

var _inheritsLoose2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inheritsLoose */ "./node_modules/@babel/runtime/helpers/inheritsLoose.js"));

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _sessionStorage = __webpack_require__(/*! ./session-storage */ "./node_modules/gatsby-react-router-scroll/session-storage.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ScrollContext = /*#__PURE__*/React.createContext(new _sessionStorage.SessionStorage());
exports.ScrollContext = ScrollContext;
ScrollContext.displayName = "GatsbyScrollContext";

var ScrollHandler = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(ScrollHandler, _React$Component);

  function ScrollHandler() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this._stateStorage = new _sessionStorage.SessionStorage();
    _this._isTicking = false;
    _this._latestKnownScrollY = 0;

    _this.scrollListener = function () {
      _this._latestKnownScrollY = window.scrollY;

      if (!_this._isTicking) {
        _this._isTicking = true;
        requestAnimationFrame(_this._saveScroll.bind((0, _assertThisInitialized2.default)(_this)));
      }
    };

    _this.windowScroll = function (position, prevProps) {
      if (_this.shouldUpdateScroll(prevProps, _this.props)) {
        window.scrollTo(0, position);
      }
    };

    _this.scrollToHash = function (hash, prevProps) {
      var node = document.getElementById(hash.substring(1));

      if (node && _this.shouldUpdateScroll(prevProps, _this.props)) {
        node.scrollIntoView();
      }
    };

    _this.shouldUpdateScroll = function (prevRouterProps, routerProps) {
      var shouldUpdateScroll = _this.props.shouldUpdateScroll;

      if (!shouldUpdateScroll) {
        return true;
      } // Hack to allow accessing this._stateStorage.


      return shouldUpdateScroll.call((0, _assertThisInitialized2.default)(_this), prevRouterProps, routerProps);
    };

    return _this;
  }

  var _proto = ScrollHandler.prototype;

  _proto._saveScroll = function _saveScroll() {
    var key = this.props.location.key || null;

    if (key) {
      this._stateStorage.save(this.props.location, key, this._latestKnownScrollY);
    }

    this._isTicking = false;
  };

  _proto.componentDidMount = function componentDidMount() {
    window.addEventListener("scroll", this.scrollListener);
    var scrollPosition;
    var _this$props$location = this.props.location,
        key = _this$props$location.key,
        hash = _this$props$location.hash;

    if (key) {
      scrollPosition = this._stateStorage.read(this.props.location, key);
    }

    if (scrollPosition) {
      this.windowScroll(scrollPosition, undefined);
    } else if (hash) {
      this.scrollToHash(decodeURI(hash), undefined);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props$location2 = this.props.location,
        hash = _this$props$location2.hash,
        key = _this$props$location2.key;
    var scrollPosition;

    if (key) {
      scrollPosition = this._stateStorage.read(this.props.location, key);
    }
    /**  There are two pieces of state: the browser url and
     * history state which keeps track of scroll position
     * Native behaviour prescribes that we ought to restore scroll position
     * when a user navigates back in their browser (this is the `POP` action)
     * Currently, reach router has a bug that prevents this at https://github.com/reach/router/issues/228
     * So we _always_ stick to the url as a source of truth — if the url
     * contains a hash, we scroll to it
     */


    if (hash) {
      this.scrollToHash(decodeURI(hash), prevProps);
    } else {
      this.windowScroll(scrollPosition, prevProps);
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement(ScrollContext.Provider, {
      value: this._stateStorage
    }, this.props.children);
  };

  return ScrollHandler;
}(React.Component);

exports.ScrollHandler = ScrollHandler;
ScrollHandler.propTypes = {
  shouldUpdateScroll: _propTypes.default.func,
  children: _propTypes.default.element.isRequired,
  location: _propTypes.default.object.isRequired
};

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/session-storage.js":
/*!********************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/session-storage.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.__esModule = true;
exports.SessionStorage = void 0;
var STATE_KEY_PREFIX = "@@scroll|";
var GATSBY_ROUTER_SCROLL_STATE = "___GATSBY_REACT_ROUTER_SCROLL";

var SessionStorage = /*#__PURE__*/function () {
  function SessionStorage() {}

  var _proto = SessionStorage.prototype;

  _proto.read = function read(location, key) {
    var stateKey = this.getStateKey(location, key);

    try {
      var value = window.sessionStorage.getItem(stateKey);
      return value ? JSON.parse(value) : 0;
    } catch (e) {
      if (true) {
        console.warn("[gatsby-react-router-scroll] Unable to access sessionStorage; sessionStorage is not available.");
      }

      if (window && window[GATSBY_ROUTER_SCROLL_STATE] && window[GATSBY_ROUTER_SCROLL_STATE][stateKey]) {
        return window[GATSBY_ROUTER_SCROLL_STATE][stateKey];
      }

      return 0;
    }
  };

  _proto.save = function save(location, key, value) {
    var stateKey = this.getStateKey(location, key);
    var storedValue = JSON.stringify(value);

    try {
      window.sessionStorage.setItem(stateKey, storedValue);
    } catch (e) {
      if (window && window[GATSBY_ROUTER_SCROLL_STATE]) {
        window[GATSBY_ROUTER_SCROLL_STATE][stateKey] = JSON.parse(storedValue);
      } else {
        window[GATSBY_ROUTER_SCROLL_STATE] = {};
        window[GATSBY_ROUTER_SCROLL_STATE][stateKey] = JSON.parse(storedValue);
      }

      if (true) {
        console.warn("[gatsby-react-router-scroll] Unable to save state in sessionStorage; sessionStorage is not available.");
      }
    }
  };

  _proto.getStateKey = function getStateKey(location, key) {
    var stateKeyBase = "" + STATE_KEY_PREFIX + location.pathname;
    return key === null || typeof key === "undefined" ? stateKeyBase : stateKeyBase + "|" + key;
  };

  return SessionStorage;
}();

exports.SessionStorage = SessionStorage;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js":
/*!***************************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.useScrollRestoration = useScrollRestoration;

var _scrollHandler = __webpack_require__(/*! ./scroll-handler */ "./node_modules/gatsby-react-router-scroll/scroll-handler.js");

var _react = __webpack_require__(/*! react */ "react");

var _reachRouter = __webpack_require__(/*! @gatsbyjs/reach-router */ "./node_modules/@gatsbyjs/reach-router/es/index.js");

function useScrollRestoration(identifier) {
  var location = (0, _reachRouter.useLocation)();
  var state = (0, _react.useContext)(_scrollHandler.ScrollContext);
  var ref = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(function () {
    if (ref.current) {
      var position = state.read(location, identifier);
      ref.current.scrollTo(0, position || 0);
    }
  }, [location.key]);
  return {
    ref: ref,
    onScroll: function onScroll() {
      if (ref.current) {
        state.save(location, identifier, ref.current.scrollTop);
      }
    }
  };
}

/***/ }),

/***/ "./.cache/emitter.js":
/*!***************************!*\
  !*** ./.cache/emitter.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mitt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mitt */ "./node_modules/mitt/dist/mitt.es.js");

const emitter = (0,mitt__WEBPACK_IMPORTED_MODULE_0__["default"])();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (emitter);

/***/ }),

/***/ "./.cache/find-path.js":
/*!*****************************!*\
  !*** ./.cache/find-path.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cleanPath": () => (/* binding */ cleanPath),
/* harmony export */   "findMatchPath": () => (/* binding */ findMatchPath),
/* harmony export */   "findPath": () => (/* binding */ findPath),
/* harmony export */   "grabMatchParams": () => (/* binding */ grabMatchParams),
/* harmony export */   "setMatchPaths": () => (/* binding */ setMatchPaths)
/* harmony export */ });
/* harmony import */ var _gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @gatsbyjs/reach-router/lib/utils */ "./node_modules/@gatsbyjs/reach-router/lib/utils.js");
/* harmony import */ var _strip_prefix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strip-prefix */ "./.cache/strip-prefix.js");
/* harmony import */ var _normalize_page_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalize-page-path */ "./.cache/normalize-page-path.js");
/* harmony import */ var _redirect_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./redirect-utils.js */ "./.cache/redirect-utils.js");




const pathCache = new Map();
let matchPaths = [];

const trimPathname = rawPathname => {
  let newRawPathname = rawPathname;
  const queryIndex = rawPathname.indexOf(`?`);

  if (queryIndex !== -1) {
    const [path, qs] = rawPathname.split(`?`);
    newRawPathname = `${path}?${encodeURIComponent(qs)}`;
  }

  const pathname = decodeURIComponent(newRawPathname); // Remove the pathPrefix from the pathname.

  const trimmedPathname = (0,_strip_prefix__WEBPACK_IMPORTED_MODULE_1__["default"])(pathname, decodeURIComponent("")) // Remove any hashfragment
  .split(`#`)[0];
  return trimmedPathname;
};

function absolutify(path) {
  // If it's already absolute, return as-is
  if (path.startsWith(`/`) || path.startsWith(`https://`) || path.startsWith(`http://`)) {
    return path;
  } // Calculate path relative to current location, adding a trailing slash to
  // match behavior of @reach/router


  return new URL(path, window.location.href + (window.location.href.endsWith(`/`) ? `` : `/`)).pathname;
}
/**
 * Set list of matchPaths
 *
 * @param {Array<{path: string, matchPath: string}>} value collection of matchPaths
 */


const setMatchPaths = value => {
  matchPaths = value;
};
/**
 * Return a matchpath url
 * if `match-paths.json` contains `{ "/foo*": "/page1", ...}`, then
 * `/foo?bar=far` => `/page1`
 *
 * @param {string} rawPathname A raw pathname
 * @return {string|null}
 */

const findMatchPath = rawPathname => {
  const trimmedPathname = cleanPath(rawPathname);
  const pickPaths = matchPaths.map(({
    path,
    matchPath
  }) => {
    return {
      path: matchPath,
      originalPath: path
    };
  });
  const path = (0,_gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__.pick)(pickPaths, trimmedPathname);

  if (path) {
    return (0,_normalize_page_path__WEBPACK_IMPORTED_MODULE_2__["default"])(path.route.originalPath);
  }

  return null;
};
/**
 * Return a matchpath params from reach/router rules
 * if `match-paths.json` contains `{ ":bar/*foo" }`, and the path is /baz/zaz/zoo
 * then it returns
 *  { bar: baz, foo: zaz/zoo }
 *
 * @param {string} rawPathname A raw pathname
 * @return {object}
 */

const grabMatchParams = rawPathname => {
  const trimmedPathname = cleanPath(rawPathname);
  const pickPaths = matchPaths.map(({
    path,
    matchPath
  }) => {
    return {
      path: matchPath,
      originalPath: path
    };
  });
  const path = (0,_gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__.pick)(pickPaths, trimmedPathname);

  if (path) {
    return path.params;
  }

  return {};
}; // Given a raw URL path, returns the cleaned version of it (trim off
// `#` and query params), or if it matches an entry in
// `match-paths.json`, its matched path is returned
//
// E.g. `/foo?bar=far` => `/foo`
//
// Or if `match-paths.json` contains `{ "/foo*": "/page1", ...}`, then
// `/foo?bar=far` => `/page1`

const findPath = rawPathname => {
  const trimmedPathname = trimPathname(absolutify(rawPathname));

  if (pathCache.has(trimmedPathname)) {
    return pathCache.get(trimmedPathname);
  }

  const redirect = (0,_redirect_utils_js__WEBPACK_IMPORTED_MODULE_3__.maybeGetBrowserRedirect)(rawPathname);

  if (redirect) {
    return findPath(redirect.toPath);
  }

  let foundPath = findMatchPath(trimmedPathname);

  if (!foundPath) {
    foundPath = cleanPath(rawPathname);
  }

  pathCache.set(trimmedPathname, foundPath);
  return foundPath;
};
/**
 * Clean a url and converts /index.html => /
 * E.g. `/foo?bar=far` => `/foo`
 *
 * @param {string} rawPathname A raw pathname
 * @return {string}
 */

const cleanPath = rawPathname => {
  const trimmedPathname = trimPathname(absolutify(rawPathname));
  let foundPath = trimmedPathname;

  if (foundPath === `/index.html`) {
    foundPath = `/`;
  }

  foundPath = (0,_normalize_page_path__WEBPACK_IMPORTED_MODULE_2__["default"])(foundPath);
  return foundPath;
};

/***/ }),

/***/ "./.cache/gatsby-browser-entry.js":
/*!****************************************!*\
  !*** ./.cache/gatsby-browser-entry.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Link": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "PageRenderer": () => (/* reexport default from dynamic */ _public_page_renderer__WEBPACK_IMPORTED_MODULE_3___default.a),
/* harmony export */   "Script": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.Script),
/* harmony export */   "ScriptStrategy": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.ScriptStrategy),
/* harmony export */   "StaticQuery": () => (/* binding */ StaticQuery),
/* harmony export */   "StaticQueryContext": () => (/* binding */ StaticQueryContext),
/* harmony export */   "collectedScriptsByPage": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.collectedScriptsByPage),
/* harmony export */   "graphql": () => (/* binding */ graphql),
/* harmony export */   "navigate": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.navigate),
/* harmony export */   "parsePath": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.parsePath),
/* harmony export */   "prefetchPathname": () => (/* binding */ prefetchPathname),
/* harmony export */   "scriptCache": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.scriptCache),
/* harmony export */   "scriptCallbackCache": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.scriptCallbackCache),
/* harmony export */   "useScrollRestoration": () => (/* reexport safe */ gatsby_react_router_scroll__WEBPACK_IMPORTED_MODULE_4__.useScrollRestoration),
/* harmony export */   "useStaticQuery": () => (/* binding */ useStaticQuery),
/* harmony export */   "withAssetPrefix": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.withAssetPrefix),
/* harmony export */   "withPrefix": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.withPrefix)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./.cache/loader.js");
/* harmony import */ var _public_page_renderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./public-page-renderer */ "./.cache/public-page-renderer.js");
/* harmony import */ var _public_page_renderer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_public_page_renderer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var gatsby_react_router_scroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gatsby-react-router-scroll */ "./node_modules/gatsby-react-router-scroll/index.js");
/* harmony import */ var gatsby_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gatsby-link */ "./node_modules/gatsby-link/dist/index.modern.mjs");
/* harmony import */ var gatsby_script__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! gatsby-script */ "./node_modules/gatsby-script/dist/index.modern.mjs");



const prefetchPathname = _loader__WEBPACK_IMPORTED_MODULE_1__["default"].enqueue;
const StaticQueryContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createContext({});

function StaticQueryDataRenderer({
  staticQueryData,
  data,
  query,
  render
}) {
  const finalData = data ? data.data : staticQueryData[query] && staticQueryData[query].data;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, finalData && render(finalData), !finalData && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Loading (StaticQuery)"));
}

const StaticQuery = props => {
  const {
    data,
    query,
    render,
    children
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StaticQueryContext.Consumer, null, staticQueryData => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StaticQueryDataRenderer, {
    data: data,
    query: query,
    render: render || children,
    staticQueryData: staticQueryData
  }));
};

const useStaticQuery = query => {
  var _context$query;

  if (typeof (react__WEBPACK_IMPORTED_MODULE_0___default().useContext) !== `function` && "development" === `development`) {
    throw new Error(`You're likely using a version of React that doesn't support Hooks\n` + `Please update React and ReactDOM to 16.8.0 or later to use the useStaticQuery hook.`);
  }

  const context = react__WEBPACK_IMPORTED_MODULE_0___default().useContext(StaticQueryContext); // query is a stringified number like `3303882` when wrapped with graphql, If a user forgets
  // to wrap the query in a grqphql, then casting it to a Number results in `NaN` allowing us to
  // catch the misuse of the API and give proper direction

  if (isNaN(Number(query))) {
    throw new Error(`useStaticQuery was called with a string but expects to be called using \`graphql\`. Try this:

import { useStaticQuery, graphql } from 'gatsby';

useStaticQuery(graphql\`${query}\`);
`);
  }

  if ((_context$query = context[query]) !== null && _context$query !== void 0 && _context$query.data) {
    return context[query].data;
  } else {
    throw new Error(`The result of this StaticQuery could not be fetched.\n\n` + `This is likely a bug in Gatsby and if refreshing the page does not fix it, ` + `please open an issue in https://github.com/gatsbyjs/gatsby/issues`);
  }
};

StaticQuery.propTypes = {
  data: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
  query: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.isRequired),
  render: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func)
};

function graphql() {
  throw new Error(`It appears like Gatsby is misconfigured. Gatsby related \`graphql\` calls ` + `are supposed to only be evaluated at compile time, and then compiled away. ` + `Unfortunately, something went wrong and the query was left in the compiled code.\n\n` + `Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.`);
}







/***/ }),

/***/ "./.cache/loader.js":
/*!**************************!*\
  !*** ./.cache/loader.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseLoader": () => (/* binding */ BaseLoader),
/* harmony export */   "PageResourceStatus": () => (/* binding */ PageResourceStatus),
/* harmony export */   "ProdLoader": () => (/* binding */ ProdLoader),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getStaticQueryResults": () => (/* binding */ getStaticQueryResults),
/* harmony export */   "publicLoader": () => (/* binding */ publicLoader),
/* harmony export */   "setLoader": () => (/* binding */ setLoader)
/* harmony export */ });
/* harmony import */ var _prefetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prefetch */ "./.cache/prefetch.js");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emitter */ "./.cache/emitter.js");
/* harmony import */ var _find_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./find-path */ "./.cache/find-path.js");



/**
 * Available resource loading statuses
 */

const PageResourceStatus = {
  /**
   * At least one of critical resources failed to load
   */
  Error: `error`,

  /**
   * Resources loaded successfully
   */
  Success: `success`
};

const stripSurroundingSlashes = s => {
  s = s[0] === `/` ? s.slice(1) : s;
  s = s.endsWith(`/`) ? s.slice(0, -1) : s;
  return s;
};

const createPageDataUrl = rawPath => {
  const [path, maybeSearch] = rawPath.split(`?`);
  const fixedPath = path === `/` ? `index` : stripSurroundingSlashes(path);
  return `${""}/page-data/${fixedPath}/page-data.json${maybeSearch ? `?${maybeSearch}` : ``}`;
};

function doFetch(url, method = `GET`) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open(method, url, true);

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        resolve(req);
      }
    };

    req.send(null);
  });
}

const doesConnectionSupportPrefetch = () => {
  if (`connection` in navigator && typeof navigator.connection !== `undefined`) {
    if ((navigator.connection.effectiveType || ``).includes(`2g`)) {
      return false;
    }

    if (navigator.connection.saveData) {
      return false;
    }
  }

  return true;
}; // Regex that matches common search crawlers


const BOT_REGEX = /bot|crawler|spider|crawling/i;

const toPageResources = (pageData, component = null, head) => {
  const page = {
    componentChunkName: pageData.componentChunkName,
    path: pageData.path,
    webpackCompilationHash: pageData.webpackCompilationHash,
    matchPath: pageData.matchPath,
    staticQueryHashes: pageData.staticQueryHashes,
    getServerDataError: pageData.getServerDataError
  };
  return {
    component,
    head,
    json: pageData.result,
    page
  };
};

class BaseLoader {
  constructor(loadComponent, matchPaths) {
    this.inFlightNetworkRequests = new Map();
    // Map of pagePath -> Page. Where Page is an object with: {
    //   status: PageResourceStatus.Success || PageResourceStatus.Error,
    //   payload: PageResources, // undefined if PageResourceStatus.Error
    // }
    // PageResources is {
    //   component,
    //   json: pageData.result,
    //   page: {
    //     componentChunkName,
    //     path,
    //     webpackCompilationHash,
    //     staticQueryHashes
    //   },
    //   staticQueryResults
    // }
    this.pageDb = new Map();
    this.inFlightDb = new Map();
    this.staticQueryDb = {};
    this.pageDataDb = new Map();
    this.isPrefetchQueueRunning = false;
    this.prefetchQueued = [];
    this.prefetchTriggered = new Set();
    this.prefetchCompleted = new Set();
    this.loadComponent = loadComponent;
    (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.setMatchPaths)(matchPaths);
  }

  memoizedGet(url) {
    let inFlightPromise = this.inFlightNetworkRequests.get(url);

    if (!inFlightPromise) {
      inFlightPromise = doFetch(url, `GET`);
      this.inFlightNetworkRequests.set(url, inFlightPromise);
    } // Prefer duplication with then + catch over .finally to prevent problems in ie11 + firefox


    return inFlightPromise.then(response => {
      this.inFlightNetworkRequests.delete(url);
      return response;
    }).catch(err => {
      this.inFlightNetworkRequests.delete(url);
      throw err;
    });
  }

  setApiRunner(apiRunner) {
    this.apiRunner = apiRunner;
    this.prefetchDisabled = apiRunner(`disableCorePrefetching`).some(a => a);
  }

  fetchPageDataJson(loadObj) {
    const {
      pagePath,
      retries = 0
    } = loadObj;
    const url = createPageDataUrl(pagePath);
    return this.memoizedGet(url).then(req => {
      const {
        status,
        responseText
      } = req; // Handle 200

      if (status === 200) {
        try {
          const jsonPayload = JSON.parse(responseText);

          if (jsonPayload.path === undefined) {
            throw new Error(`not a valid pageData response`);
          }

          const maybeSearch = pagePath.split(`?`)[1];

          if (maybeSearch && !jsonPayload.path.includes(maybeSearch)) {
            jsonPayload.path += `?${maybeSearch}`;
          }

          return Object.assign(loadObj, {
            status: PageResourceStatus.Success,
            payload: jsonPayload
          });
        } catch (err) {// continue regardless of error
        }
      } // Handle 404


      if (status === 404 || status === 200) {
        // If the request was for a 404/500 page and it doesn't exist, we're done
        if (pagePath === `/404.html` || pagePath === `/500.html`) {
          return Object.assign(loadObj, {
            status: PageResourceStatus.Error
          });
        } // Need some code here to cache the 404 request. In case
        // multiple loadPageDataJsons result in 404s


        return this.fetchPageDataJson(Object.assign(loadObj, {
          pagePath: `/404.html`,
          notFound: true
        }));
      } // handle 500 response (Unrecoverable)


      if (status === 500) {
        return this.fetchPageDataJson(Object.assign(loadObj, {
          pagePath: `/500.html`,
          internalServerError: true
        }));
      } // Handle everything else, including status === 0, and 503s. Should retry


      if (retries < 3) {
        return this.fetchPageDataJson(Object.assign(loadObj, {
          retries: retries + 1
        }));
      } // Retried 3 times already, result is an error.


      return Object.assign(loadObj, {
        status: PageResourceStatus.Error
      });
    });
  }

  loadPageDataJson(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDataDb.has(pagePath)) {
      const pageData = this.pageDataDb.get(pagePath);

      if (true) {
        return Promise.resolve(pageData);
      }
    }

    return this.fetchPageDataJson({
      pagePath
    }).then(pageData => {
      this.pageDataDb.set(pagePath, pageData);
      return pageData;
    });
  }

  findMatchPath(rawPath) {
    return (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findMatchPath)(rawPath);
  } // TODO check all uses of this and whether they use undefined for page resources not exist


  loadPage(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDb.has(pagePath)) {
      const page = this.pageDb.get(pagePath);

      if (true) {
        if (page.error) {
          return {
            error: page.error,
            status: page.status
          };
        }

        return Promise.resolve(page.payload);
      }
    }

    if (this.inFlightDb.has(pagePath)) {
      return this.inFlightDb.get(pagePath);
    }

    const inFlightPromise = Promise.all([this.loadAppData(), this.loadPageDataJson(pagePath)]).then(allData => {
      const result = allData[1];

      if (result.status === PageResourceStatus.Error) {
        return {
          status: PageResourceStatus.Error
        };
      }

      let pageData = result.payload;
      const {
        componentChunkName,
        staticQueryHashes = []
      } = pageData;
      const finalResult = {}; // In develop we have separate chunks for template and Head components
      // to enable HMR (fast refresh requires single exports).
      // In production we have shared chunk with both exports. Double loadComponent here
      // will be deduped by webpack runtime resulting in single request and single module
      // being loaded for both `component` and `head`.

      const componentChunkPromise = Promise.all([this.loadComponent(componentChunkName), this.loadComponent(componentChunkName, `head`)]).then(([component, head]) => {
        finalResult.createdAt = new Date();
        let pageResources;

        if (!component || component instanceof Error) {
          finalResult.status = PageResourceStatus.Error;
          finalResult.error = component;
        } else {
          finalResult.status = PageResourceStatus.Success;

          if (result.notFound === true) {
            finalResult.notFound = true;
          }

          pageData = Object.assign(pageData, {
            webpackCompilationHash: allData[0] ? allData[0].webpackCompilationHash : ``
          });
          pageResources = toPageResources(pageData, component, head);
        } // undefined if final result is an error


        return pageResources;
      });
      const staticQueryBatchPromise = Promise.all(staticQueryHashes.map(staticQueryHash => {
        // Check for cache in case this static query result has already been loaded
        if (this.staticQueryDb[staticQueryHash]) {
          const jsonPayload = this.staticQueryDb[staticQueryHash];
          return {
            staticQueryHash,
            jsonPayload
          };
        }

        return this.memoizedGet(`${""}/page-data/sq/d/${staticQueryHash}.json`).then(req => {
          const jsonPayload = JSON.parse(req.responseText);
          return {
            staticQueryHash,
            jsonPayload
          };
        }).catch(() => {
          throw new Error(`We couldn't load "${""}/page-data/sq/d/${staticQueryHash}.json"`);
        });
      })).then(staticQueryResults => {
        const staticQueryResultsMap = {};
        staticQueryResults.forEach(({
          staticQueryHash,
          jsonPayload
        }) => {
          staticQueryResultsMap[staticQueryHash] = jsonPayload;
          this.staticQueryDb[staticQueryHash] = jsonPayload;
        });
        return staticQueryResultsMap;
      });
      return Promise.all([componentChunkPromise, staticQueryBatchPromise]).then(([pageResources, staticQueryResults]) => {
        let payload;

        if (pageResources) {
          payload = { ...pageResources,
            staticQueryResults
          };
          finalResult.payload = payload;
          _emitter__WEBPACK_IMPORTED_MODULE_1__["default"].emit(`onPostLoadPageResources`, {
            page: payload,
            pageResources: payload
          });
        }

        this.pageDb.set(pagePath, finalResult);

        if (finalResult.error) {
          return {
            error: finalResult.error,
            status: finalResult.status
          };
        }

        return payload;
      }) // when static-query fail to load we throw a better error
      .catch(err => {
        return {
          error: err,
          status: PageResourceStatus.Error
        };
      });
    });
    inFlightPromise.then(() => {
      this.inFlightDb.delete(pagePath);
    }).catch(error => {
      this.inFlightDb.delete(pagePath);
      throw error;
    });
    this.inFlightDb.set(pagePath, inFlightPromise);
    return inFlightPromise;
  } // returns undefined if the page does not exists in cache


  loadPageSync(rawPath, options = {}) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDb.has(pagePath)) {
      const pageData = this.pageDb.get(pagePath);

      if (pageData.payload) {
        return pageData.payload;
      }

      if (options !== null && options !== void 0 && options.withErrorDetails) {
        return {
          error: pageData.error,
          status: pageData.status
        };
      }
    }

    return undefined;
  }

  shouldPrefetch(pagePath) {
    // Skip prefetching if we know user is on slow or constrained connection
    if (!doesConnectionSupportPrefetch()) {
      return false;
    } // Don't prefetch if this is a crawler bot


    if (navigator.userAgent && BOT_REGEX.test(navigator.userAgent)) {
      return false;
    } // Check if the page exists.


    if (this.pageDb.has(pagePath)) {
      return false;
    }

    return true;
  }

  prefetch(pagePath) {
    if (!this.shouldPrefetch(pagePath)) {
      return {
        then: resolve => resolve(false),
        abort: () => {}
      };
    }

    if (this.prefetchTriggered.has(pagePath)) {
      return {
        then: resolve => resolve(true),
        abort: () => {}
      };
    }

    const defer = {
      resolve: null,
      reject: null,
      promise: null
    };
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    this.prefetchQueued.push([pagePath, defer]);
    const abortC = new AbortController();
    abortC.signal.addEventListener(`abort`, () => {
      const index = this.prefetchQueued.findIndex(([p]) => p === pagePath); // remove from the queue

      if (index !== -1) {
        this.prefetchQueued.splice(index, 1);
      }
    });

    if (!this.isPrefetchQueueRunning) {
      this.isPrefetchQueueRunning = true;
      setTimeout(() => {
        this._processNextPrefetchBatch();
      }, 3000);
    }

    return {
      then: (resolve, reject) => defer.promise.then(resolve, reject),
      abort: abortC.abort.bind(abortC)
    };
  }

  _processNextPrefetchBatch() {
    const idleCallback = window.requestIdleCallback || (cb => setTimeout(cb, 0));

    idleCallback(() => {
      const toPrefetch = this.prefetchQueued.splice(0, 4);
      const prefetches = Promise.all(toPrefetch.map(([pagePath, dPromise]) => {
        // Tell plugins with custom prefetching logic that they should start
        // prefetching this path.
        if (!this.prefetchTriggered.has(pagePath)) {
          this.apiRunner(`onPrefetchPathname`, {
            pathname: pagePath
          });
          this.prefetchTriggered.add(pagePath);
        } // If a plugin has disabled core prefetching, stop now.


        if (this.prefetchDisabled) {
          return dPromise.resolve(false);
        }

        return this.doPrefetch((0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(pagePath)).then(() => {
          if (!this.prefetchCompleted.has(pagePath)) {
            this.apiRunner(`onPostPrefetchPathname`, {
              pathname: pagePath
            });
            this.prefetchCompleted.add(pagePath);
          }

          dPromise.resolve(true);
        });
      }));

      if (this.prefetchQueued.length) {
        prefetches.then(() => {
          setTimeout(() => {
            this._processNextPrefetchBatch();
          }, 3000);
        });
      } else {
        this.isPrefetchQueueRunning = false;
      }
    });
  }

  doPrefetch(pagePath) {
    const pageDataUrl = createPageDataUrl(pagePath);
    return (0,_prefetch__WEBPACK_IMPORTED_MODULE_0__["default"])(pageDataUrl, {
      crossOrigin: `anonymous`,
      as: `fetch`
    }).then(() => // This was just prefetched, so will return a response from
    // the cache instead of making another request to the server
    this.loadPageDataJson(pagePath));
  }

  hovering(rawPath) {
    this.loadPage(rawPath);
  }

  getResourceURLsForPathname(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);
    const page = this.pageDataDb.get(pagePath);

    if (page) {
      const pageResources = toPageResources(page.payload);
      return [...createComponentUrls(pageResources.page.componentChunkName), createPageDataUrl(pagePath)];
    } else {
      return null;
    }
  }

  isPageNotFound(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);
    const page = this.pageDb.get(pagePath);
    return !page || page.notFound;
  }

  loadAppData(retries = 0) {
    return this.memoizedGet(`${""}/page-data/app-data.json`).then(req => {
      const {
        status,
        responseText
      } = req;
      let appData;

      if (status !== 200 && retries < 3) {
        // Retry 3 times incase of non-200 responses
        return this.loadAppData(retries + 1);
      } // Handle 200


      if (status === 200) {
        try {
          const jsonPayload = JSON.parse(responseText);

          if (jsonPayload.webpackCompilationHash === undefined) {
            throw new Error(`not a valid app-data response`);
          }

          appData = jsonPayload;
        } catch (err) {// continue regardless of error
        }
      }

      return appData;
    });
  }

}

const createComponentUrls = componentChunkName => (window.___chunkMapping[componentChunkName] || []).map(chunk => "" + chunk);

class ProdLoader extends BaseLoader {
  constructor(asyncRequires, matchPaths, pageData) {
    const loadComponent = (chunkName, exportType = `components`) => {
      if (!global.hasPartialHydration) {
        exportType = `components`;
      }

      if (!asyncRequires[exportType][chunkName]) {
        throw new Error(`We couldn't find the correct component chunk with the name "${chunkName}"`);
      }

      return asyncRequires[exportType][chunkName]() // loader will handle the case when component is error
      .catch(err => err);
    };

    super(loadComponent, matchPaths);

    if (pageData) {
      this.pageDataDb.set((0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(pageData.path), {
        pagePath: pageData.path,
        payload: pageData,
        status: `success`
      });
    }
  }

  doPrefetch(pagePath) {
    return super.doPrefetch(pagePath).then(result => {
      if (result.status !== PageResourceStatus.Success) {
        return Promise.resolve();
      }

      const pageData = result.payload;
      const chunkName = pageData.componentChunkName;
      const componentUrls = createComponentUrls(chunkName);
      return Promise.all(componentUrls.map(_prefetch__WEBPACK_IMPORTED_MODULE_0__["default"])).then(() => pageData);
    });
  }

  loadPageDataJson(rawPath) {
    return super.loadPageDataJson(rawPath).then(data => {
      if (data.notFound) {
        // check if html file exist using HEAD request:
        // if it does we should navigate to it instead of showing 404
        return doFetch(rawPath, `HEAD`).then(req => {
          if (req.status === 200) {
            // page (.html file) actually exist (or we asked for 404 )
            // returning page resources status as errored to trigger
            // regular browser navigation to given page
            return {
              status: PageResourceStatus.Error
            };
          } // if HEAD request wasn't 200, return notFound result
          // and show 404 page


          return data;
        });
      }

      return data;
    });
  }

}
let instance;
const setLoader = _loader => {
  instance = _loader;
};
const publicLoader = {
  enqueue: rawPath => instance.prefetch(rawPath),
  // Real methods
  getResourceURLsForPathname: rawPath => instance.getResourceURLsForPathname(rawPath),
  loadPage: rawPath => instance.loadPage(rawPath),
  // TODO add deprecation to v4 so people use withErrorDetails and then we can remove in v5 and change default behaviour
  loadPageSync: (rawPath, options = {}) => instance.loadPageSync(rawPath, options),
  prefetch: rawPath => instance.prefetch(rawPath),
  isPageNotFound: rawPath => instance.isPageNotFound(rawPath),
  hovering: rawPath => instance.hovering(rawPath),
  loadAppData: () => instance.loadAppData()
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (publicLoader);
function getStaticQueryResults() {
  if (instance) {
    return instance.staticQueryDb;
  } else {
    return {};
  }
}

/***/ }),

/***/ "./.cache/normalize-page-path.js":
/*!***************************************!*\
  !*** ./.cache/normalize-page-path.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pathAndSearch => {
  if (pathAndSearch === undefined) {
    return pathAndSearch;
  }

  let [path, search = ``] = pathAndSearch.split(`?`);

  if (search) {
    search = `?` + search;
  }

  if (path === `/`) {
    return `/` + search;
  }

  if (path.charAt(path.length - 1) === `/`) {
    return path.slice(0, -1) + search;
  }

  return path + search;
});

/***/ }),

/***/ "./.cache/prefetch.js":
/*!****************************!*\
  !*** ./.cache/prefetch.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const support = function (feature) {
  if (typeof document === `undefined`) {
    return false;
  }

  const fakeLink = document.createElement(`link`);

  try {
    if (fakeLink.relList && typeof fakeLink.relList.supports === `function`) {
      return fakeLink.relList.supports(feature);
    }
  } catch (err) {
    return false;
  }

  return false;
};

const linkPrefetchStrategy = function (url, options) {
  return new Promise((resolve, reject) => {
    if (typeof document === `undefined`) {
      reject();
      return;
    }

    const link = document.createElement(`link`);
    link.setAttribute(`rel`, `prefetch`);
    link.setAttribute(`href`, url);
    Object.keys(options).forEach(key => {
      link.setAttribute(key, options[key]);
    });
    link.onload = resolve;
    link.onerror = reject;
    const parentElement = document.getElementsByTagName(`head`)[0] || document.getElementsByName(`script`)[0].parentNode;
    parentElement.appendChild(link);
  });
};

const xhrPrefetchStrategy = function (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(`GET`, url, true);

    req.onload = () => {
      if (req.status === 200) {
        resolve();
      } else {
        reject();
      }
    };

    req.send(null);
  });
};

const supportedPrefetchStrategy = support(`prefetch`) ? linkPrefetchStrategy : xhrPrefetchStrategy;
const preFetched = {};

const prefetch = function (url, options) {
  return new Promise(resolve => {
    if (preFetched[url]) {
      resolve();
      return;
    }

    supportedPrefetchStrategy(url, options).then(() => {
      resolve();
      preFetched[url] = true;
    }).catch(() => {}); // 404s are logged to the console anyway
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prefetch);

/***/ }),

/***/ "./.cache/public-page-renderer.js":
/*!****************************************!*\
  !*** ./.cache/public-page-renderer.js ***!
  \****************************************/
/***/ ((module) => {

const preferDefault = m => m && m.default || m;

if (false) {} else if (false) {} else {
  module.exports = () => null;
}

/***/ }),

/***/ "./.cache/redirect-utils.js":
/*!**********************************!*\
  !*** ./.cache/redirect-utils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "maybeGetBrowserRedirect": () => (/* binding */ maybeGetBrowserRedirect)
/* harmony export */ });
/* harmony import */ var _redirects_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redirects.json */ "./.cache/redirects.json");
 // Convert to a map for faster lookup in maybeRedirect()

const redirectMap = new Map();
const redirectIgnoreCaseMap = new Map();
_redirects_json__WEBPACK_IMPORTED_MODULE_0__.forEach(redirect => {
  if (redirect.ignoreCase) {
    redirectIgnoreCaseMap.set(redirect.fromPath, redirect);
  } else {
    redirectMap.set(redirect.fromPath, redirect);
  }
});
function maybeGetBrowserRedirect(pathname) {
  let redirect = redirectMap.get(pathname);

  if (!redirect) {
    redirect = redirectIgnoreCaseMap.get(pathname.toLowerCase());
  }

  return redirect;
}

/***/ }),

/***/ "./.cache/strip-prefix.js":
/*!********************************!*\
  !*** ./.cache/strip-prefix.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ stripPrefix)
/* harmony export */ });
/**
 * Remove a prefix from a string. Return the input string if the given prefix
 * isn't found.
 */
function stripPrefix(str, prefix = ``) {
  if (!prefix) {
    return str;
  }

  if (str === prefix) {
    return `/`;
  }

  if (str.startsWith(`${prefix}/`)) {
    return str.slice(prefix.length);
  }

  return str;
}

/***/ }),

/***/ "./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js":
/*!**********************************************************************!*\
  !*** ./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GatsbyImage": () => (/* binding */ B),
/* harmony export */   "MainImage": () => (/* binding */ z),
/* harmony export */   "Placeholder": () => (/* binding */ T),
/* harmony export */   "StaticImage": () => (/* binding */ V),
/* harmony export */   "generateImageData": () => (/* binding */ f),
/* harmony export */   "getImage": () => (/* binding */ M),
/* harmony export */   "getImageData": () => (/* binding */ x),
/* harmony export */   "getLowResolutionImageURL": () => (/* binding */ m),
/* harmony export */   "getSrc": () => (/* binding */ S),
/* harmony export */   "getSrcSet": () => (/* binding */ N),
/* harmony export */   "withArtDirection": () => (/* binding */ I)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camelcase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camelcase */ "./node_modules/camelcase/index.js");
/* harmony import */ var camelcase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(camelcase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);





function n() {
  return n = Object.assign ? Object.assign.bind() : function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var a = arguments[t];

      for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }

    return e;
  }, n.apply(this, arguments);
}

function o(e, t) {
  if (null == e) return {};
  var a,
      i,
      r = {},
      n = Object.keys(e);

  for (i = 0; i < n.length; i++) t.indexOf(a = n[i]) >= 0 || (r[a] = e[a]);

  return r;
}

var s = [.25, .5, 1, 2],
    l = [750, 1080, 1366, 1920],
    u = [320, 654, 768, 1024, 1366, 1600, 1920, 2048, 2560, 3440, 3840, 4096],
    d = function (e) {
  return console.warn(e);
},
    c = function (e, t) {
  return e - t;
},
    h = function (e) {
  return e.map(function (e) {
    return e.src + " " + e.width + "w";
  }).join(",\n");
};

function g(e) {
  var t = e.lastIndexOf(".");

  if (-1 !== t) {
    var a = e.slice(t + 1);
    if ("jpeg" === a) return "jpg";
    if (3 === a.length || 4 === a.length) return a;
  }
}

function p(e) {
  var t = e.layout,
      i = void 0 === t ? "constrained" : t,
      r = e.width,
      o = e.height,
      s = e.sourceMetadata,
      l = e.breakpoints,
      u = e.aspectRatio,
      d = e.formats,
      c = void 0 === d ? ["auto", "webp"] : d;
  return c = c.map(function (e) {
    return e.toLowerCase();
  }), i = camelcase__WEBPACK_IMPORTED_MODULE_1___default()(i), r && o ? n({}, e, {
    formats: c,
    layout: i,
    aspectRatio: r / o
  }) : (s.width && s.height && !u && (u = s.width / s.height), "fullWidth" === i ? (r = r || s.width || l[l.length - 1], o = o || Math.round(r / (u || 1.3333333333333333))) : (r || (r = o && u ? o * u : s.width ? s.width : o ? Math.round(o / 1.3333333333333333) : 800), u && !o ? o = Math.round(r / u) : u || (u = r / o)), n({}, e, {
    width: r,
    height: o,
    aspectRatio: u,
    layout: i,
    formats: c
  }));
}

function m(e, t) {
  var a;
  return void 0 === t && (t = 20), null == (a = (0, (e = p(e)).generateImageSource)(e.filename, t, Math.round(t / e.aspectRatio), e.sourceMetadata.format || "jpg", e.fit, e.options)) ? void 0 : a.src;
}

function f(e) {
  var t,
      a = (e = p(e)).pluginName,
      i = e.sourceMetadata,
      r = e.generateImageSource,
      o = e.layout,
      u = e.fit,
      c = e.options,
      m = e.width,
      f = e.height,
      b = e.filename,
      k = e.reporter,
      E = void 0 === k ? {
    warn: d
  } : k,
      M = e.backgroundColor,
      S = e.placeholderURL;
  if (a || E.warn('[gatsby-plugin-image] "generateImageData" was not passed a plugin name'), "function" != typeof r) throw new Error("generateImageSource must be a function");
  i && (i.width || i.height) ? i.format || (i.format = g(b)) : i = {
    width: m,
    height: f,
    format: (null == (t = i) ? void 0 : t.format) || g(b) || "auto"
  };
  var N = new Set(e.formats);
  (0 === N.size || N.has("auto") || N.has("")) && (N.delete("auto"), N.delete(""), N.add(i.format)), N.has("jpg") && N.has("png") && (E.warn("[" + a + "] Specifying both 'jpg' and 'png' formats is not supported. Using 'auto' instead"), N.delete("jpg" === i.format ? "png" : "jpg"));

  var x = function (e) {
    var t = e.filename,
        a = e.layout,
        i = void 0 === a ? "constrained" : a,
        r = e.sourceMetadata,
        o = e.reporter,
        u = void 0 === o ? {
      warn: d
    } : o,
        c = e.breakpoints,
        h = void 0 === c ? l : c,
        g = Object.entries({
      width: e.width,
      height: e.height
    }).filter(function (e) {
      var t = e[1];
      return "number" == typeof t && t < 1;
    });
    if (g.length) throw new Error("Specified dimensions for images must be positive numbers (> 0). Problem dimensions you have are " + g.map(function (e) {
      return e.join(": ");
    }).join(", "));
    return "fixed" === i ? function (e) {
      var t = e.filename,
          a = e.sourceMetadata,
          i = e.width,
          r = e.height,
          n = e.fit,
          o = void 0 === n ? "cover" : n,
          l = e.outputPixelDensities,
          u = e.reporter,
          c = void 0 === u ? {
        warn: d
      } : u,
          h = a.width / a.height,
          g = v(void 0 === l ? s : l);

      if (i && r) {
        var p = y(a, {
          width: i,
          height: r,
          fit: o
        });
        i = p.width, r = p.height, h = p.aspectRatio;
      }

      i ? r || (r = Math.round(i / h)) : i = r ? Math.round(r * h) : 800;
      var m = i;

      if (a.width < i || a.height < r) {
        var f = a.width < i ? "width" : "height";
        c.warn("\nThe requested " + f + ' "' + ("width" === f ? i : r) + 'px" for the image ' + t + " was larger than the actual image " + f + " of " + a[f] + "px. If possible, replace the current image with a larger one."), "width" === f ? (i = a.width, r = Math.round(i / h)) : i = (r = a.height) * h;
      }

      return {
        sizes: g.filter(function (e) {
          return e >= 1;
        }).map(function (e) {
          return Math.round(e * i);
        }).filter(function (e) {
          return e <= a.width;
        }),
        aspectRatio: h,
        presentationWidth: m,
        presentationHeight: Math.round(m / h),
        unscaledWidth: i
      };
    }(e) : "constrained" === i ? w(e) : "fullWidth" === i ? w(n({
      breakpoints: h
    }, e)) : (u.warn("No valid layout was provided for the image at " + t + ". Valid image layouts are fixed, fullWidth, and constrained. Found " + i), {
      sizes: [r.width],
      presentationWidth: r.width,
      presentationHeight: r.height,
      aspectRatio: r.width / r.height,
      unscaledWidth: r.width
    });
  }(n({}, e, {
    sourceMetadata: i
  })),
      I = {
    sources: []
  },
      W = e.sizes;

  W || (W = function (e, t) {
    switch (t) {
      case "constrained":
        return "(min-width: " + e + "px) " + e + "px, 100vw";

      case "fixed":
        return e + "px";

      case "fullWidth":
        return "100vw";

      default:
        return;
    }
  }(x.presentationWidth, o)), N.forEach(function (e) {
    var t = x.sizes.map(function (t) {
      var i = r(b, t, Math.round(t / x.aspectRatio), e, u, c);
      if (null != i && i.width && i.height && i.src && i.format) return i;
      E.warn("[" + a + "] The resolver for image " + b + " returned an invalid value.");
    }).filter(Boolean);

    if ("jpg" === e || "png" === e || "auto" === e) {
      var i = t.find(function (e) {
        return e.width === x.unscaledWidth;
      }) || t[0];
      i && (I.fallback = {
        src: i.src,
        srcSet: h(t),
        sizes: W
      });
    } else {
      var n;
      null == (n = I.sources) || n.push({
        srcSet: h(t),
        sizes: W,
        type: "image/" + e
      });
    }
  });
  var j = {
    images: I,
    layout: o,
    backgroundColor: M
  };

  switch (S && (j.placeholder = {
    fallback: S
  }), o) {
    case "fixed":
      j.width = x.presentationWidth, j.height = x.presentationHeight;
      break;

    case "fullWidth":
      j.width = 1, j.height = 1 / x.aspectRatio;
      break;

    case "constrained":
      j.width = e.width || x.presentationWidth || 1, j.height = (j.width || 1) / x.aspectRatio;
  }

  return j;
}

var v = function (e) {
  return Array.from(new Set([1].concat(e))).sort(c);
};

function w(e) {
  var t,
      a = e.sourceMetadata,
      i = e.width,
      r = e.height,
      n = e.fit,
      o = void 0 === n ? "cover" : n,
      l = e.outputPixelDensities,
      u = e.breakpoints,
      d = e.layout,
      h = a.width / a.height,
      g = v(void 0 === l ? s : l);

  if (i && r) {
    var p = y(a, {
      width: i,
      height: r,
      fit: o
    });
    i = p.width, r = p.height, h = p.aspectRatio;
  }

  i = i && Math.min(i, a.width), r = r && Math.min(r, a.height), i || r || (r = (i = Math.min(800, a.width)) / h), i || (i = r * h);
  var m = i;
  return (a.width < i || a.height < r) && (i = a.width, r = a.height), i = Math.round(i), (null == u ? void 0 : u.length) > 0 ? (t = u.filter(function (e) {
    return e <= a.width;
  })).length < u.length && !t.includes(a.width) && t.push(a.width) : t = (t = g.map(function (e) {
    return Math.round(e * i);
  })).filter(function (e) {
    return e <= a.width;
  }), "constrained" !== d || t.includes(i) || t.push(i), {
    sizes: t = t.sort(c),
    aspectRatio: h,
    presentationWidth: m,
    presentationHeight: Math.round(m / h),
    unscaledWidth: i
  };
}

function y(e, t) {
  var a = e.width / e.height,
      i = t.width,
      r = t.height;

  switch (t.fit) {
    case "fill":
      i = t.width ? t.width : e.width, r = t.height ? t.height : e.height;
      break;

    case "inside":
      var n = t.width ? t.width : Number.MAX_SAFE_INTEGER,
          o = t.height ? t.height : Number.MAX_SAFE_INTEGER;
      i = Math.min(n, Math.round(o * a)), r = Math.min(o, Math.round(n / a));
      break;

    case "outside":
      var s = t.width ? t.width : 0,
          l = t.height ? t.height : 0;
      i = Math.max(s, Math.round(l * a)), r = Math.max(l, Math.round(s / a));
      break;

    default:
      t.width && !t.height && (i = t.width, r = Math.round(t.width / a)), t.height && !t.width && (i = Math.round(t.height * a), r = t.height);
  }

  return {
    width: i,
    height: r,
    aspectRatio: i / r
  };
}

var b = ["baseUrl", "urlBuilder", "sourceWidth", "sourceHeight", "pluginName", "formats", "breakpoints", "options"],
    k = ["images", "placeholder"];

function E() {
  return "undefined" != typeof GATSBY___IMAGE && GATSBY___IMAGE;
}

var M = function (e) {
  var t;
  return function (e) {
    var t, a;
    return Boolean(null == e || null == (t = e.images) || null == (a = t.fallback) ? void 0 : a.src);
  }(e) ? e : function (e) {
    return Boolean(null == e ? void 0 : e.gatsbyImageData);
  }(e) ? e.gatsbyImageData : function (e) {
    return Boolean(null == e ? void 0 : e.gatsbyImage);
  }(e) ? e.gatsbyImage : null == e || null == (t = e.childImageSharp) ? void 0 : t.gatsbyImageData;
},
    S = function (e) {
  var t, a, i;
  return null == (t = M(e)) || null == (a = t.images) || null == (i = a.fallback) ? void 0 : i.src;
},
    N = function (e) {
  var t, a, i;
  return null == (t = M(e)) || null == (a = t.images) || null == (i = a.fallback) ? void 0 : i.srcSet;
};

function x(e) {
  var t,
      a = e.baseUrl,
      i = e.urlBuilder,
      r = e.sourceWidth,
      s = e.sourceHeight,
      l = e.pluginName,
      d = void 0 === l ? "getImageData" : l,
      c = e.formats,
      h = void 0 === c ? ["auto"] : c,
      g = e.breakpoints,
      p = e.options,
      m = o(e, b);
  return null != (t = g) && t.length || "fullWidth" !== m.layout && "FULL_WIDTH" !== m.layout || (g = u), f(n({}, m, {
    pluginName: d,
    generateImageSource: function (e, t, a, r) {
      return {
        width: t,
        height: a,
        format: r,
        src: i({
          baseUrl: e,
          width: t,
          height: a,
          options: p,
          format: r
        })
      };
    },
    filename: a,
    formats: h,
    breakpoints: g,
    sourceMetadata: {
      width: r,
      height: s,
      format: "auto"
    }
  }));
}

function I(e, t) {
  var a,
      i,
      r,
      s = e.images,
      l = e.placeholder,
      u = n({}, o(e, k), {
    images: n({}, s, {
      sources: []
    }),
    placeholder: l && n({}, l, {
      sources: []
    })
  });
  return t.forEach(function (t) {
    var a,
        i = t.media,
        r = t.image;
    i ? (r.layout !== e.layout && "development" === "development" && console.warn('[gatsby-plugin-image] Mismatched image layout: expected "' + e.layout + '" but received "' + r.layout + '". All art-directed images use the same layout as the default image'), (a = u.images.sources).push.apply(a, r.images.sources.map(function (e) {
      return n({}, e, {
        media: i
      });
    }).concat([{
      media: i,
      srcSet: r.images.fallback.srcSet
    }])), u.placeholder && u.placeholder.sources.push({
      media: i,
      srcSet: r.placeholder.fallback
    })) :  true && console.warn("[gatsby-plugin-image] All art-directed images passed to must have a value set for `media`. Skipping.");
  }), (a = u.images.sources).push.apply(a, s.sources), null != l && l.sources && (null == (i = u.placeholder) || (r = i.sources).push.apply(r, l.sources)), u;
}

var W,
    j = ["src", "srcSet", "loading", "alt", "shouldLoad"],
    R = ["fallback", "sources", "shouldLoad"],
    _ = function (t) {
  var a = t.src,
      i = t.srcSet,
      r = t.loading,
      s = t.alt,
      l = void 0 === s ? "" : s,
      u = t.shouldLoad,
      d = o(t, j);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", n({}, d, {
    decoding: "async",
    loading: r,
    src: u ? a : void 0,
    "data-src": u ? void 0 : a,
    srcSet: u ? i : void 0,
    "data-srcset": u ? void 0 : i,
    alt: l
  }));
},
    A = function (t) {
  var a = t.fallback,
      i = t.sources,
      r = void 0 === i ? [] : i,
      s = t.shouldLoad,
      l = void 0 === s || s,
      u = o(t, R),
      d = u.sizes || (null == a ? void 0 : a.sizes),
      c = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_, n({}, u, a, {
    sizes: d,
    shouldLoad: l
  }));
  return r.length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("picture", null, r.map(function (t) {
    var a = t.media,
        i = t.srcSet,
        r = t.type;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("source", {
      key: a + "-" + r + "-" + i,
      type: r,
      media: a,
      srcSet: l ? i : void 0,
      "data-srcset": l ? void 0 : i,
      sizes: d
    });
  }), c) : c;
};

_.propTypes = {
  src: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  alt: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  shouldLoad: prop_types__WEBPACK_IMPORTED_MODULE_2__.bool
}, A.displayName = "Picture", A.propTypes = {
  alt: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
  shouldLoad: prop_types__WEBPACK_IMPORTED_MODULE_2__.bool,
  fallback: prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    src: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string
  }),
  sources: prop_types__WEBPACK_IMPORTED_MODULE_2__.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_2__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    media: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    type: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired
  }), prop_types__WEBPACK_IMPORTED_MODULE_2__.exact({
    media: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    type: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired,
    sizes: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
    srcSet: prop_types__WEBPACK_IMPORTED_MODULE_2__.string.isRequired
  })]))
};

var O = ["fallback"],
    T = function (t) {
  var a = t.fallback,
      i = o(t, O);
  return a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(A, n({}, i, {
    fallback: {
      src: a
    },
    "aria-hidden": !0,
    alt: ""
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", n({}, i));
};

T.displayName = "Placeholder", T.propTypes = {
  fallback: prop_types__WEBPACK_IMPORTED_MODULE_2__.string,
  sources: null == (W = A.propTypes) ? void 0 : W.sources,
  alt: function (e, t, a) {
    return e[t] ? new Error("Invalid prop `" + t + "` supplied to `" + a + "`. Validation failed.") : null;
  }
};

var z = function (t) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(A, n({}, t)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("noscript", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(A, n({}, t, {
    shouldLoad: !0
  }))));
};

z.displayName = "MainImage", z.propTypes = A.propTypes;

var L = ["children"],
    q = function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("script", {
    type: "module",
    dangerouslySetInnerHTML: {
      __html: 'const t="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;if(t){const t=document.querySelectorAll("img[data-main-image]");for(let e of t){e.dataset.src&&(e.setAttribute("src",e.dataset.src),e.removeAttribute("data-src")),e.dataset.srcset&&(e.setAttribute("srcset",e.dataset.srcset),e.removeAttribute("data-srcset"));const t=e.parentNode.querySelectorAll("source[data-srcset]");for(let e of t)e.setAttribute("srcset",e.dataset.srcset),e.removeAttribute("data-srcset");e.complete&&(e.style.opacity=1,e.parentNode.parentNode.querySelector("[data-placeholder-image]").style.opacity=0)}}'
    }
  });
},
    C = function (t) {
  var a = t.layout,
      i = t.width,
      r = t.height;
  return "fullWidth" === a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    "aria-hidden": !0,
    style: {
      paddingTop: r / i * 100 + "%"
    }
  }) : "constrained" === a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      maxWidth: i,
      display: "block"
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    alt: "",
    role: "presentation",
    "aria-hidden": "true",
    src: "data:image/svg+xml;charset=utf-8,%3Csvg height='" + r + "' width='" + i + "' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",
    style: {
      maxWidth: "100%",
      display: "block",
      position: "static"
    }
  })) : null;
},
    D = function (a) {
  var i = a.children,
      r = o(a, L);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(C, n({}, r)), i, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(q, null));
},
    P = ["as", "className", "class", "style", "image", "loading", "imgClassName", "imgStyle", "backgroundColor", "objectFit", "objectPosition"],
    H = ["style", "className"],
    F = function (e) {
  return e.replace(/\n/g, "");
},
    B = function (t) {
  var a = t.as,
      i = void 0 === a ? "div" : a,
      r = t.className,
      s = t.class,
      l = t.style,
      u = t.image,
      d = t.loading,
      c = void 0 === d ? "lazy" : d,
      h = t.imgClassName,
      g = t.imgStyle,
      p = t.backgroundColor,
      m = t.objectFit,
      f = t.objectPosition,
      v = o(t, P);
  if (!u) return console.warn("[gatsby-plugin-image] Missing image prop"), null;
  s && (r = s), g = n({
    objectFit: m,
    objectPosition: f,
    backgroundColor: p
  }, g);

  var w = u.width,
      y = u.height,
      b = u.layout,
      k = u.images,
      M = u.placeholder,
      S = u.backgroundColor,
      N = function (e, t, a) {
    var i = {},
        r = "gatsby-image-wrapper";
    return E() || (i.position = "relative", i.overflow = "hidden"), "fixed" === a ? (i.width = e, i.height = t) : "constrained" === a && (E() || (i.display = "inline-block", i.verticalAlign = "top"), r = "gatsby-image-wrapper gatsby-image-wrapper-constrained"), {
      className: r,
      "data-gatsby-image-wrapper": "",
      style: i
    };
  }(w, y, b),
      x = N.style,
      I = N.className,
      W = o(N, H),
      j = {
    fallback: void 0,
    sources: []
  };

  return k.fallback && (j.fallback = n({}, k.fallback, {
    srcSet: k.fallback.srcSet ? F(k.fallback.srcSet) : void 0
  })), k.sources && (j.sources = k.sources.map(function (e) {
    return n({}, e, {
      srcSet: F(e.srcSet)
    });
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(i, n({}, W, {
    style: n({}, x, l, {
      backgroundColor: p
    }),
    className: I + (r ? " " + r : "")
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(D, {
    layout: b,
    width: w,
    height: y
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(T, n({}, function (e, t, a, i, r, o, s, l) {
    var u = {};
    o && (u.backgroundColor = o, "fixed" === a ? (u.width = i, u.height = r, u.backgroundColor = o, u.position = "relative") : ("constrained" === a || "fullWidth" === a) && (u.position = "absolute", u.top = 0, u.left = 0, u.bottom = 0, u.right = 0)), s && (u.objectFit = s), l && (u.objectPosition = l);
    var d = n({}, e, {
      "aria-hidden": !0,
      "data-placeholder-image": "",
      style: n({
        opacity: 1,
        transition: "opacity 500ms linear"
      }, u)
    });
    return E() || (d.style = {
      height: "100%",
      left: 0,
      position: "absolute",
      top: 0,
      width: "100%"
    }), d;
  }(M, 0, b, w, y, S, m, f))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(z, n({
    "data-gatsby-image-ssr": "",
    className: h
  }, v, function (e, t, a, i, r) {
    return void 0 === r && (r = {}), E() || (r = n({
      height: "100%",
      left: 0,
      position: "absolute",
      top: 0,
      transform: "translateZ(0)",
      transition: "opacity 250ms linear",
      width: "100%",
      willChange: "opacity"
    }, r)), n({}, a, {
      loading: i,
      shouldLoad: e,
      "data-main-image": "",
      style: n({}, r, {
        opacity: 0
      })
    });
  }("eager" === c, 0, j, c, g)))));
},
    G = ["src", "__imageData", "__error", "width", "height", "aspectRatio", "tracedSVGOptions", "placeholder", "formats", "quality", "transformOptions", "jpgOptions", "pngOptions", "webpOptions", "avifOptions", "blurredOptions", "breakpoints", "outputPixelDensities"],
    V = function (t) {
  return function (a) {
    var i = a.src,
        r = a.__imageData,
        s = a.__error,
        l = o(a, G);
    return s && console.warn(s), r ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(t, n({
      image: r
    }, l)) : (console.warn("Image not loaded", i), s || "development" !== "development" || console.warn('Please ensure that "gatsby-plugin-image" is included in the plugins array in gatsby-config.js, and that your version of gatsby is at least 2.24.78'), null);
  };
}(B),
    U = function (e, t) {
  return "fullWidth" !== e.layout || "width" !== t && "height" !== t || !e[t] ? prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.apply((prop_types__WEBPACK_IMPORTED_MODULE_2___default()), [e, t].concat([].slice.call(arguments, 2))) : new Error('"' + t + '" ' + e[t] + " may not be passed when layout is fullWidth.");
},
    X = new Set(["fixed", "fullWidth", "constrained"]),
    Y = {
  src: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.isRequired),
  alt: function (e, t, a) {
    return e.alt || "" === e.alt ? prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.apply((prop_types__WEBPACK_IMPORTED_MODULE_2___default()), [e, t, a].concat([].slice.call(arguments, 3))) : new Error('The "alt" prop is required in ' + a + '. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html');
  },
  width: U,
  height: U,
  sizes: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
  layout: function (e) {
    if (void 0 !== e.layout && !X.has(e.layout)) return new Error("Invalid value " + e.layout + '" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".');
  }
};

V.displayName = "StaticImage", V.propTypes = Y;


/***/ }),

/***/ "./src/components/AllRecipe.js":
/*!*************************************!*\
  !*** ./src/components/AllRecipe.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_1058133876_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/1058133876.json */ "./public/page-data/sq/d/1058133876.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Recipelist__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Recipelist */ "./src/components/Recipelist.js");
/* harmony import */ var _TagsList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TagsList */ "./src/components/TagsList.js");




const query = "1058133876";

const AllRecipe = () => {
  const data = _public_page_data_sq_d_1058133876_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const recipes = data.allContentfulRecipe.nodes;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("section", {
    className: "recipes-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_TagsList__WEBPACK_IMPORTED_MODULE_3__["default"], {
    recipes: recipes
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Recipelist__WEBPACK_IMPORTED_MODULE_2__["default"], {
    recipes: recipes
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllRecipe);

/***/ }),

/***/ "./src/components/Footer.js":
/*!**********************************!*\
  !*** ./src/components/Footer.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const Footer = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("footer", {
    className: "page-footer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "\xA9 ", new Date().getFullYear(), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Veggie foodie"), " Built with", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.gatsbyjs.com/"
  }, " Gatsby")));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ }),

/***/ "./src/components/Layout.js":
/*!**********************************!*\
  !*** ./src/components/Layout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Footer */ "./src/components/Footer.js");
/* harmony import */ var _Navbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Navbar */ "./src/components/Navbar.js");
/* harmony import */ var _assest_css_main_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assest/css/main.css */ "./src/assest/css/main.css");
/* harmony import */ var _assest_css_main_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assest_css_main_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! normalize.css */ "./node_modules/normalize.css/normalize.css");
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(normalize_css__WEBPACK_IMPORTED_MODULE_4__);






const Layout = ({
  children
}) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Navbar__WEBPACK_IMPORTED_MODULE_2__["default"], null), children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Footer__WEBPACK_IMPORTED_MODULE_1__["default"], null));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ }),

/***/ "./src/components/Navbar.js":
/*!**********************************!*\
  !*** ./src/components/Navbar.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_icons_fi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-icons/fi */ "./node_modules/react-icons/fi/index.esm.js");
/* harmony import */ var _assest_images_logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assest/images/logo.png */ "./src/assest/images/logo.png");





const Navbar = () => {
  const {
    0: show,
    1: setShow
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("nav", {
    className: "navbar"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "nav-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "nav-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("img", {
    src: _assest_images_logo_png__WEBPACK_IMPORTED_MODULE_2__["default"],
    alt: "..."
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", {
    className: "nav-btn",
    onClick: () => setShow(!show)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_icons_fi__WEBPACK_IMPORTED_MODULE_3__.FiAlignJustify, null))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: show ? "nav-links show-links" : "nav-links"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/",
    className: "nav-link",
    activeClassName: "active-link",
    onClick: () => setShow(false)
  }, "home"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/Recipe",
    className: "nav-link",
    activeClassName: "active-link",
    onClick: () => setShow(false)
  }, "Recipe"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/Tags",
    className: "nav-link",
    activeClassName: "active-link",
    onClick: () => setShow(false)
  }, "tags"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/about",
    className: "nav-link",
    activeClassName: "active-link",
    onClick: () => setShow(false)
  }, "about"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "nav-link contact-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
    to: "/contact",
    className: "btn",
    onClick: () => setShow(false)
  }, "contact")))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Navbar);

/***/ }),

/***/ "./src/components/Recipelist.js":
/*!**************************************!*\
  !*** ./src/components/Recipelist.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gatsby-plugin-image */ "./node_modules/gatsby-plugin-image/dist/gatsby-image.module.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! slugify */ "./node_modules/slugify/slugify.js");
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_2__);





const Recipelist = ({
  recipes = []
}) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "recipes-list"
  }, recipes.map(recipe => {
    const {
      id,
      title,
      image,
      prepTime,
      cookTime
    } = recipe;
    const pathToImage = (0,gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__.getImage)(image);
    const slug = slugify__WEBPACK_IMPORTED_MODULE_2___default()(title, {
      lower: true
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_0__.Link, {
      key: id,
      to: `/${slug}`,
      className: "recipe"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby_plugin_image__WEBPACK_IMPORTED_MODULE_3__.GatsbyImage, {
      image: pathToImage,
      className: "recipe-img",
      alt: title
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h5", null, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("p", null, "Prep : ", prepTime, "min | Cook : ", cookTime, "min"));
  }));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recipelist);

/***/ }),

/***/ "./src/components/SEO.js":
/*!*******************************!*\
  !*** ./src/components/SEO.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_2468095761_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/2468095761.json */ "./public/page-data/sq/d/2468095761.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-helmet */ "./node_modules/react-helmet/es/Helmet.js");



const query = "2468095761";

const SEO = ({
  title,
  description
}) => {
  const {
    site
  } = _public_page_data_sq_d_2468095761_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const metaDescription = description || site.siteMetadata.description;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_2__.Helmet, {
    htmlAttributes: {
      lang: "en"
    },
    title: `${title} | ${site.siteMetadata.title}`,
    meta: [{
      name: `description`,
      content: metaDescription
    }]
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SEO);

/***/ }),

/***/ "./src/components/TagsList.js":
/*!************************************!*\
  !*** ./src/components/TagsList.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_setupTags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/setupTags */ "./src/utils/setupTags.js");
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! slugify */ "./node_modules/slugify/slugify.js");
/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_3__);





const TagsList = ({
  recipes
}) => {
  const newTags = (0,_utils_setupTags__WEBPACK_IMPORTED_MODULE_1__["default"])(recipes);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "tag-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "categories"
  }, "categories"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "tags-list"
  }, newTags.map((tag, index) => {
    const [text, value] = tag;
    const slug = slugify__WEBPACK_IMPORTED_MODULE_3___default()(text, {
      lower: true
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_2__.Link, {
      to: `/tags/${slug}`,
      key: index,
      className: "list"
    }, text, " (", value, ")"));
  })));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TagsList);

/***/ }),

/***/ "./src/pages/Recipe.js?export=default":
/*!********************************************!*\
  !*** ./src/pages/Recipe.js?export=default ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_AllRecipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/AllRecipe */ "./src/components/AllRecipe.js");
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Layout */ "./src/components/Layout.js");
/* harmony import */ var _components_SEO__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/SEO */ "./src/components/SEO.js");





const Recipe = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_2__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_SEO__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: "Recipes"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
    className: "page"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_AllRecipe__WEBPACK_IMPORTED_MODULE_1__["default"], null)));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Recipe);

/***/ }),

/***/ "./src/utils/setupTags.js":
/*!********************************!*\
  !*** ./src/utils/setupTags.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const setupTags = recipes => {
  const allTags = {};
  recipes.forEach(recipe => {
    recipe.content.tags.forEach(tag => {
      if (allTags[tag]) {
        allTags[tag] = allTags[tag] + 1;
      } else {
        allTags[tag] = 1;
      }
    });
  });
  const newTags = Object.entries(allTags).sort((a, b) => {
    const [firstTag] = a;
    const [secondTag] = b;
    return firstTag.localeCompare(secondTag);
  });
  return newTags;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setupTags);

/***/ }),

/***/ "./node_modules/mitt/dist/mitt.es.js":
/*!*******************************************!*\
  !*** ./node_modules/mitt/dist/mitt.es.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//      
// An event handler can take an optional event argument
// and should not return a value
                                          
                                                               

// An array of all currently registered event handlers for a type
                                            
                                                            
// A map of event types and their corresponding event handlers.
                        
                                 
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).slice().map(function (handler) { handler(evt); });
			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
		}
	};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mitt);
//# sourceMappingURL=mitt.es.js.map


/***/ }),

/***/ "./node_modules/normalize.css/normalize.css":
/*!**************************************************!*\
  !*** ./node_modules/normalize.css/normalize.css ***!
  \**************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/assest/css/main.css":
/*!*********************************!*\
  !*** ./src/assest/css/main.css ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "./node_modules/react-icons/fi/index.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/react-icons/fi/index.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FiActivity": () => (/* binding */ FiActivity),
/* harmony export */   "FiAirplay": () => (/* binding */ FiAirplay),
/* harmony export */   "FiAlertCircle": () => (/* binding */ FiAlertCircle),
/* harmony export */   "FiAlertOctagon": () => (/* binding */ FiAlertOctagon),
/* harmony export */   "FiAlertTriangle": () => (/* binding */ FiAlertTriangle),
/* harmony export */   "FiAlignCenter": () => (/* binding */ FiAlignCenter),
/* harmony export */   "FiAlignJustify": () => (/* binding */ FiAlignJustify),
/* harmony export */   "FiAlignLeft": () => (/* binding */ FiAlignLeft),
/* harmony export */   "FiAlignRight": () => (/* binding */ FiAlignRight),
/* harmony export */   "FiAnchor": () => (/* binding */ FiAnchor),
/* harmony export */   "FiAperture": () => (/* binding */ FiAperture),
/* harmony export */   "FiArchive": () => (/* binding */ FiArchive),
/* harmony export */   "FiArrowDown": () => (/* binding */ FiArrowDown),
/* harmony export */   "FiArrowDownCircle": () => (/* binding */ FiArrowDownCircle),
/* harmony export */   "FiArrowDownLeft": () => (/* binding */ FiArrowDownLeft),
/* harmony export */   "FiArrowDownRight": () => (/* binding */ FiArrowDownRight),
/* harmony export */   "FiArrowLeft": () => (/* binding */ FiArrowLeft),
/* harmony export */   "FiArrowLeftCircle": () => (/* binding */ FiArrowLeftCircle),
/* harmony export */   "FiArrowRight": () => (/* binding */ FiArrowRight),
/* harmony export */   "FiArrowRightCircle": () => (/* binding */ FiArrowRightCircle),
/* harmony export */   "FiArrowUp": () => (/* binding */ FiArrowUp),
/* harmony export */   "FiArrowUpCircle": () => (/* binding */ FiArrowUpCircle),
/* harmony export */   "FiArrowUpLeft": () => (/* binding */ FiArrowUpLeft),
/* harmony export */   "FiArrowUpRight": () => (/* binding */ FiArrowUpRight),
/* harmony export */   "FiAtSign": () => (/* binding */ FiAtSign),
/* harmony export */   "FiAward": () => (/* binding */ FiAward),
/* harmony export */   "FiBarChart": () => (/* binding */ FiBarChart),
/* harmony export */   "FiBarChart2": () => (/* binding */ FiBarChart2),
/* harmony export */   "FiBattery": () => (/* binding */ FiBattery),
/* harmony export */   "FiBatteryCharging": () => (/* binding */ FiBatteryCharging),
/* harmony export */   "FiBell": () => (/* binding */ FiBell),
/* harmony export */   "FiBellOff": () => (/* binding */ FiBellOff),
/* harmony export */   "FiBluetooth": () => (/* binding */ FiBluetooth),
/* harmony export */   "FiBold": () => (/* binding */ FiBold),
/* harmony export */   "FiBook": () => (/* binding */ FiBook),
/* harmony export */   "FiBookOpen": () => (/* binding */ FiBookOpen),
/* harmony export */   "FiBookmark": () => (/* binding */ FiBookmark),
/* harmony export */   "FiBox": () => (/* binding */ FiBox),
/* harmony export */   "FiBriefcase": () => (/* binding */ FiBriefcase),
/* harmony export */   "FiCalendar": () => (/* binding */ FiCalendar),
/* harmony export */   "FiCamera": () => (/* binding */ FiCamera),
/* harmony export */   "FiCameraOff": () => (/* binding */ FiCameraOff),
/* harmony export */   "FiCast": () => (/* binding */ FiCast),
/* harmony export */   "FiCheck": () => (/* binding */ FiCheck),
/* harmony export */   "FiCheckCircle": () => (/* binding */ FiCheckCircle),
/* harmony export */   "FiCheckSquare": () => (/* binding */ FiCheckSquare),
/* harmony export */   "FiChevronDown": () => (/* binding */ FiChevronDown),
/* harmony export */   "FiChevronLeft": () => (/* binding */ FiChevronLeft),
/* harmony export */   "FiChevronRight": () => (/* binding */ FiChevronRight),
/* harmony export */   "FiChevronUp": () => (/* binding */ FiChevronUp),
/* harmony export */   "FiChevronsDown": () => (/* binding */ FiChevronsDown),
/* harmony export */   "FiChevronsLeft": () => (/* binding */ FiChevronsLeft),
/* harmony export */   "FiChevronsRight": () => (/* binding */ FiChevronsRight),
/* harmony export */   "FiChevronsUp": () => (/* binding */ FiChevronsUp),
/* harmony export */   "FiChrome": () => (/* binding */ FiChrome),
/* harmony export */   "FiCircle": () => (/* binding */ FiCircle),
/* harmony export */   "FiClipboard": () => (/* binding */ FiClipboard),
/* harmony export */   "FiClock": () => (/* binding */ FiClock),
/* harmony export */   "FiCloud": () => (/* binding */ FiCloud),
/* harmony export */   "FiCloudDrizzle": () => (/* binding */ FiCloudDrizzle),
/* harmony export */   "FiCloudLightning": () => (/* binding */ FiCloudLightning),
/* harmony export */   "FiCloudOff": () => (/* binding */ FiCloudOff),
/* harmony export */   "FiCloudRain": () => (/* binding */ FiCloudRain),
/* harmony export */   "FiCloudSnow": () => (/* binding */ FiCloudSnow),
/* harmony export */   "FiCode": () => (/* binding */ FiCode),
/* harmony export */   "FiCodepen": () => (/* binding */ FiCodepen),
/* harmony export */   "FiCodesandbox": () => (/* binding */ FiCodesandbox),
/* harmony export */   "FiCoffee": () => (/* binding */ FiCoffee),
/* harmony export */   "FiColumns": () => (/* binding */ FiColumns),
/* harmony export */   "FiCommand": () => (/* binding */ FiCommand),
/* harmony export */   "FiCompass": () => (/* binding */ FiCompass),
/* harmony export */   "FiCopy": () => (/* binding */ FiCopy),
/* harmony export */   "FiCornerDownLeft": () => (/* binding */ FiCornerDownLeft),
/* harmony export */   "FiCornerDownRight": () => (/* binding */ FiCornerDownRight),
/* harmony export */   "FiCornerLeftDown": () => (/* binding */ FiCornerLeftDown),
/* harmony export */   "FiCornerLeftUp": () => (/* binding */ FiCornerLeftUp),
/* harmony export */   "FiCornerRightDown": () => (/* binding */ FiCornerRightDown),
/* harmony export */   "FiCornerRightUp": () => (/* binding */ FiCornerRightUp),
/* harmony export */   "FiCornerUpLeft": () => (/* binding */ FiCornerUpLeft),
/* harmony export */   "FiCornerUpRight": () => (/* binding */ FiCornerUpRight),
/* harmony export */   "FiCpu": () => (/* binding */ FiCpu),
/* harmony export */   "FiCreditCard": () => (/* binding */ FiCreditCard),
/* harmony export */   "FiCrop": () => (/* binding */ FiCrop),
/* harmony export */   "FiCrosshair": () => (/* binding */ FiCrosshair),
/* harmony export */   "FiDatabase": () => (/* binding */ FiDatabase),
/* harmony export */   "FiDelete": () => (/* binding */ FiDelete),
/* harmony export */   "FiDisc": () => (/* binding */ FiDisc),
/* harmony export */   "FiDivide": () => (/* binding */ FiDivide),
/* harmony export */   "FiDivideCircle": () => (/* binding */ FiDivideCircle),
/* harmony export */   "FiDivideSquare": () => (/* binding */ FiDivideSquare),
/* harmony export */   "FiDollarSign": () => (/* binding */ FiDollarSign),
/* harmony export */   "FiDownload": () => (/* binding */ FiDownload),
/* harmony export */   "FiDownloadCloud": () => (/* binding */ FiDownloadCloud),
/* harmony export */   "FiDribbble": () => (/* binding */ FiDribbble),
/* harmony export */   "FiDroplet": () => (/* binding */ FiDroplet),
/* harmony export */   "FiEdit": () => (/* binding */ FiEdit),
/* harmony export */   "FiEdit2": () => (/* binding */ FiEdit2),
/* harmony export */   "FiEdit3": () => (/* binding */ FiEdit3),
/* harmony export */   "FiExternalLink": () => (/* binding */ FiExternalLink),
/* harmony export */   "FiEye": () => (/* binding */ FiEye),
/* harmony export */   "FiEyeOff": () => (/* binding */ FiEyeOff),
/* harmony export */   "FiFacebook": () => (/* binding */ FiFacebook),
/* harmony export */   "FiFastForward": () => (/* binding */ FiFastForward),
/* harmony export */   "FiFeather": () => (/* binding */ FiFeather),
/* harmony export */   "FiFigma": () => (/* binding */ FiFigma),
/* harmony export */   "FiFile": () => (/* binding */ FiFile),
/* harmony export */   "FiFileMinus": () => (/* binding */ FiFileMinus),
/* harmony export */   "FiFilePlus": () => (/* binding */ FiFilePlus),
/* harmony export */   "FiFileText": () => (/* binding */ FiFileText),
/* harmony export */   "FiFilm": () => (/* binding */ FiFilm),
/* harmony export */   "FiFilter": () => (/* binding */ FiFilter),
/* harmony export */   "FiFlag": () => (/* binding */ FiFlag),
/* harmony export */   "FiFolder": () => (/* binding */ FiFolder),
/* harmony export */   "FiFolderMinus": () => (/* binding */ FiFolderMinus),
/* harmony export */   "FiFolderPlus": () => (/* binding */ FiFolderPlus),
/* harmony export */   "FiFramer": () => (/* binding */ FiFramer),
/* harmony export */   "FiFrown": () => (/* binding */ FiFrown),
/* harmony export */   "FiGift": () => (/* binding */ FiGift),
/* harmony export */   "FiGitBranch": () => (/* binding */ FiGitBranch),
/* harmony export */   "FiGitCommit": () => (/* binding */ FiGitCommit),
/* harmony export */   "FiGitMerge": () => (/* binding */ FiGitMerge),
/* harmony export */   "FiGitPullRequest": () => (/* binding */ FiGitPullRequest),
/* harmony export */   "FiGithub": () => (/* binding */ FiGithub),
/* harmony export */   "FiGitlab": () => (/* binding */ FiGitlab),
/* harmony export */   "FiGlobe": () => (/* binding */ FiGlobe),
/* harmony export */   "FiGrid": () => (/* binding */ FiGrid),
/* harmony export */   "FiHardDrive": () => (/* binding */ FiHardDrive),
/* harmony export */   "FiHash": () => (/* binding */ FiHash),
/* harmony export */   "FiHeadphones": () => (/* binding */ FiHeadphones),
/* harmony export */   "FiHeart": () => (/* binding */ FiHeart),
/* harmony export */   "FiHelpCircle": () => (/* binding */ FiHelpCircle),
/* harmony export */   "FiHexagon": () => (/* binding */ FiHexagon),
/* harmony export */   "FiHome": () => (/* binding */ FiHome),
/* harmony export */   "FiImage": () => (/* binding */ FiImage),
/* harmony export */   "FiInbox": () => (/* binding */ FiInbox),
/* harmony export */   "FiInfo": () => (/* binding */ FiInfo),
/* harmony export */   "FiInstagram": () => (/* binding */ FiInstagram),
/* harmony export */   "FiItalic": () => (/* binding */ FiItalic),
/* harmony export */   "FiKey": () => (/* binding */ FiKey),
/* harmony export */   "FiLayers": () => (/* binding */ FiLayers),
/* harmony export */   "FiLayout": () => (/* binding */ FiLayout),
/* harmony export */   "FiLifeBuoy": () => (/* binding */ FiLifeBuoy),
/* harmony export */   "FiLink": () => (/* binding */ FiLink),
/* harmony export */   "FiLink2": () => (/* binding */ FiLink2),
/* harmony export */   "FiLinkedin": () => (/* binding */ FiLinkedin),
/* harmony export */   "FiList": () => (/* binding */ FiList),
/* harmony export */   "FiLoader": () => (/* binding */ FiLoader),
/* harmony export */   "FiLock": () => (/* binding */ FiLock),
/* harmony export */   "FiLogIn": () => (/* binding */ FiLogIn),
/* harmony export */   "FiLogOut": () => (/* binding */ FiLogOut),
/* harmony export */   "FiMail": () => (/* binding */ FiMail),
/* harmony export */   "FiMap": () => (/* binding */ FiMap),
/* harmony export */   "FiMapPin": () => (/* binding */ FiMapPin),
/* harmony export */   "FiMaximize": () => (/* binding */ FiMaximize),
/* harmony export */   "FiMaximize2": () => (/* binding */ FiMaximize2),
/* harmony export */   "FiMeh": () => (/* binding */ FiMeh),
/* harmony export */   "FiMenu": () => (/* binding */ FiMenu),
/* harmony export */   "FiMessageCircle": () => (/* binding */ FiMessageCircle),
/* harmony export */   "FiMessageSquare": () => (/* binding */ FiMessageSquare),
/* harmony export */   "FiMic": () => (/* binding */ FiMic),
/* harmony export */   "FiMicOff": () => (/* binding */ FiMicOff),
/* harmony export */   "FiMinimize": () => (/* binding */ FiMinimize),
/* harmony export */   "FiMinimize2": () => (/* binding */ FiMinimize2),
/* harmony export */   "FiMinus": () => (/* binding */ FiMinus),
/* harmony export */   "FiMinusCircle": () => (/* binding */ FiMinusCircle),
/* harmony export */   "FiMinusSquare": () => (/* binding */ FiMinusSquare),
/* harmony export */   "FiMonitor": () => (/* binding */ FiMonitor),
/* harmony export */   "FiMoon": () => (/* binding */ FiMoon),
/* harmony export */   "FiMoreHorizontal": () => (/* binding */ FiMoreHorizontal),
/* harmony export */   "FiMoreVertical": () => (/* binding */ FiMoreVertical),
/* harmony export */   "FiMousePointer": () => (/* binding */ FiMousePointer),
/* harmony export */   "FiMove": () => (/* binding */ FiMove),
/* harmony export */   "FiMusic": () => (/* binding */ FiMusic),
/* harmony export */   "FiNavigation": () => (/* binding */ FiNavigation),
/* harmony export */   "FiNavigation2": () => (/* binding */ FiNavigation2),
/* harmony export */   "FiOctagon": () => (/* binding */ FiOctagon),
/* harmony export */   "FiPackage": () => (/* binding */ FiPackage),
/* harmony export */   "FiPaperclip": () => (/* binding */ FiPaperclip),
/* harmony export */   "FiPause": () => (/* binding */ FiPause),
/* harmony export */   "FiPauseCircle": () => (/* binding */ FiPauseCircle),
/* harmony export */   "FiPenTool": () => (/* binding */ FiPenTool),
/* harmony export */   "FiPercent": () => (/* binding */ FiPercent),
/* harmony export */   "FiPhone": () => (/* binding */ FiPhone),
/* harmony export */   "FiPhoneCall": () => (/* binding */ FiPhoneCall),
/* harmony export */   "FiPhoneForwarded": () => (/* binding */ FiPhoneForwarded),
/* harmony export */   "FiPhoneIncoming": () => (/* binding */ FiPhoneIncoming),
/* harmony export */   "FiPhoneMissed": () => (/* binding */ FiPhoneMissed),
/* harmony export */   "FiPhoneOff": () => (/* binding */ FiPhoneOff),
/* harmony export */   "FiPhoneOutgoing": () => (/* binding */ FiPhoneOutgoing),
/* harmony export */   "FiPieChart": () => (/* binding */ FiPieChart),
/* harmony export */   "FiPlay": () => (/* binding */ FiPlay),
/* harmony export */   "FiPlayCircle": () => (/* binding */ FiPlayCircle),
/* harmony export */   "FiPlus": () => (/* binding */ FiPlus),
/* harmony export */   "FiPlusCircle": () => (/* binding */ FiPlusCircle),
/* harmony export */   "FiPlusSquare": () => (/* binding */ FiPlusSquare),
/* harmony export */   "FiPocket": () => (/* binding */ FiPocket),
/* harmony export */   "FiPower": () => (/* binding */ FiPower),
/* harmony export */   "FiPrinter": () => (/* binding */ FiPrinter),
/* harmony export */   "FiRadio": () => (/* binding */ FiRadio),
/* harmony export */   "FiRefreshCcw": () => (/* binding */ FiRefreshCcw),
/* harmony export */   "FiRefreshCw": () => (/* binding */ FiRefreshCw),
/* harmony export */   "FiRepeat": () => (/* binding */ FiRepeat),
/* harmony export */   "FiRewind": () => (/* binding */ FiRewind),
/* harmony export */   "FiRotateCcw": () => (/* binding */ FiRotateCcw),
/* harmony export */   "FiRotateCw": () => (/* binding */ FiRotateCw),
/* harmony export */   "FiRss": () => (/* binding */ FiRss),
/* harmony export */   "FiSave": () => (/* binding */ FiSave),
/* harmony export */   "FiScissors": () => (/* binding */ FiScissors),
/* harmony export */   "FiSearch": () => (/* binding */ FiSearch),
/* harmony export */   "FiSend": () => (/* binding */ FiSend),
/* harmony export */   "FiServer": () => (/* binding */ FiServer),
/* harmony export */   "FiSettings": () => (/* binding */ FiSettings),
/* harmony export */   "FiShare": () => (/* binding */ FiShare),
/* harmony export */   "FiShare2": () => (/* binding */ FiShare2),
/* harmony export */   "FiShield": () => (/* binding */ FiShield),
/* harmony export */   "FiShieldOff": () => (/* binding */ FiShieldOff),
/* harmony export */   "FiShoppingBag": () => (/* binding */ FiShoppingBag),
/* harmony export */   "FiShoppingCart": () => (/* binding */ FiShoppingCart),
/* harmony export */   "FiShuffle": () => (/* binding */ FiShuffle),
/* harmony export */   "FiSidebar": () => (/* binding */ FiSidebar),
/* harmony export */   "FiSkipBack": () => (/* binding */ FiSkipBack),
/* harmony export */   "FiSkipForward": () => (/* binding */ FiSkipForward),
/* harmony export */   "FiSlack": () => (/* binding */ FiSlack),
/* harmony export */   "FiSlash": () => (/* binding */ FiSlash),
/* harmony export */   "FiSliders": () => (/* binding */ FiSliders),
/* harmony export */   "FiSmartphone": () => (/* binding */ FiSmartphone),
/* harmony export */   "FiSmile": () => (/* binding */ FiSmile),
/* harmony export */   "FiSpeaker": () => (/* binding */ FiSpeaker),
/* harmony export */   "FiSquare": () => (/* binding */ FiSquare),
/* harmony export */   "FiStar": () => (/* binding */ FiStar),
/* harmony export */   "FiStopCircle": () => (/* binding */ FiStopCircle),
/* harmony export */   "FiSun": () => (/* binding */ FiSun),
/* harmony export */   "FiSunrise": () => (/* binding */ FiSunrise),
/* harmony export */   "FiSunset": () => (/* binding */ FiSunset),
/* harmony export */   "FiTablet": () => (/* binding */ FiTablet),
/* harmony export */   "FiTag": () => (/* binding */ FiTag),
/* harmony export */   "FiTarget": () => (/* binding */ FiTarget),
/* harmony export */   "FiTerminal": () => (/* binding */ FiTerminal),
/* harmony export */   "FiThermometer": () => (/* binding */ FiThermometer),
/* harmony export */   "FiThumbsDown": () => (/* binding */ FiThumbsDown),
/* harmony export */   "FiThumbsUp": () => (/* binding */ FiThumbsUp),
/* harmony export */   "FiToggleLeft": () => (/* binding */ FiToggleLeft),
/* harmony export */   "FiToggleRight": () => (/* binding */ FiToggleRight),
/* harmony export */   "FiTool": () => (/* binding */ FiTool),
/* harmony export */   "FiTrash": () => (/* binding */ FiTrash),
/* harmony export */   "FiTrash2": () => (/* binding */ FiTrash2),
/* harmony export */   "FiTrello": () => (/* binding */ FiTrello),
/* harmony export */   "FiTrendingDown": () => (/* binding */ FiTrendingDown),
/* harmony export */   "FiTrendingUp": () => (/* binding */ FiTrendingUp),
/* harmony export */   "FiTriangle": () => (/* binding */ FiTriangle),
/* harmony export */   "FiTruck": () => (/* binding */ FiTruck),
/* harmony export */   "FiTv": () => (/* binding */ FiTv),
/* harmony export */   "FiTwitch": () => (/* binding */ FiTwitch),
/* harmony export */   "FiTwitter": () => (/* binding */ FiTwitter),
/* harmony export */   "FiType": () => (/* binding */ FiType),
/* harmony export */   "FiUmbrella": () => (/* binding */ FiUmbrella),
/* harmony export */   "FiUnderline": () => (/* binding */ FiUnderline),
/* harmony export */   "FiUnlock": () => (/* binding */ FiUnlock),
/* harmony export */   "FiUpload": () => (/* binding */ FiUpload),
/* harmony export */   "FiUploadCloud": () => (/* binding */ FiUploadCloud),
/* harmony export */   "FiUser": () => (/* binding */ FiUser),
/* harmony export */   "FiUserCheck": () => (/* binding */ FiUserCheck),
/* harmony export */   "FiUserMinus": () => (/* binding */ FiUserMinus),
/* harmony export */   "FiUserPlus": () => (/* binding */ FiUserPlus),
/* harmony export */   "FiUserX": () => (/* binding */ FiUserX),
/* harmony export */   "FiUsers": () => (/* binding */ FiUsers),
/* harmony export */   "FiVideo": () => (/* binding */ FiVideo),
/* harmony export */   "FiVideoOff": () => (/* binding */ FiVideoOff),
/* harmony export */   "FiVoicemail": () => (/* binding */ FiVoicemail),
/* harmony export */   "FiVolume": () => (/* binding */ FiVolume),
/* harmony export */   "FiVolume1": () => (/* binding */ FiVolume1),
/* harmony export */   "FiVolume2": () => (/* binding */ FiVolume2),
/* harmony export */   "FiVolumeX": () => (/* binding */ FiVolumeX),
/* harmony export */   "FiWatch": () => (/* binding */ FiWatch),
/* harmony export */   "FiWifi": () => (/* binding */ FiWifi),
/* harmony export */   "FiWifiOff": () => (/* binding */ FiWifiOff),
/* harmony export */   "FiWind": () => (/* binding */ FiWind),
/* harmony export */   "FiX": () => (/* binding */ FiX),
/* harmony export */   "FiXCircle": () => (/* binding */ FiXCircle),
/* harmony export */   "FiXOctagon": () => (/* binding */ FiXOctagon),
/* harmony export */   "FiXSquare": () => (/* binding */ FiXSquare),
/* harmony export */   "FiYoutube": () => (/* binding */ FiYoutube),
/* harmony export */   "FiZap": () => (/* binding */ FiZap),
/* harmony export */   "FiZapOff": () => (/* binding */ FiZapOff),
/* harmony export */   "FiZoomIn": () => (/* binding */ FiZoomIn),
/* harmony export */   "FiZoomOut": () => (/* binding */ FiZoomOut)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib */ "./node_modules/react-icons/lib/esm/index.js");
// THIS FILE IS AUTO GENERATED

function FiActivity (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"22 12 18 12 15 21 9 3 6 12 2 12"}}]})(props);
};
function FiAirplay (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"}},{"tag":"polygon","attr":{"points":"12 15 17 21 7 21 12 15"}}]})(props);
};
function FiAlertCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12.01","y2":"16"}}]})(props);
};
function FiAlertOctagon (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12.01","y2":"16"}}]})(props);
};
function FiAlertTriangle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}},{"tag":"line","attr":{"x1":"12","y1":"9","x2":"12","y2":"13"}},{"tag":"line","attr":{"x1":"12","y1":"17","x2":"12.01","y2":"17"}}]})(props);
};
function FiAlignCenter (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"18","y1":"10","x2":"6","y2":"10"}},{"tag":"line","attr":{"x1":"21","y1":"6","x2":"3","y2":"6"}},{"tag":"line","attr":{"x1":"21","y1":"14","x2":"3","y2":"14"}},{"tag":"line","attr":{"x1":"18","y1":"18","x2":"6","y2":"18"}}]})(props);
};
function FiAlignJustify (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"21","y1":"10","x2":"3","y2":"10"}},{"tag":"line","attr":{"x1":"21","y1":"6","x2":"3","y2":"6"}},{"tag":"line","attr":{"x1":"21","y1":"14","x2":"3","y2":"14"}},{"tag":"line","attr":{"x1":"21","y1":"18","x2":"3","y2":"18"}}]})(props);
};
function FiAlignLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"17","y1":"10","x2":"3","y2":"10"}},{"tag":"line","attr":{"x1":"21","y1":"6","x2":"3","y2":"6"}},{"tag":"line","attr":{"x1":"21","y1":"14","x2":"3","y2":"14"}},{"tag":"line","attr":{"x1":"17","y1":"18","x2":"3","y2":"18"}}]})(props);
};
function FiAlignRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"21","y1":"10","x2":"7","y2":"10"}},{"tag":"line","attr":{"x1":"21","y1":"6","x2":"3","y2":"6"}},{"tag":"line","attr":{"x1":"21","y1":"14","x2":"3","y2":"14"}},{"tag":"line","attr":{"x1":"21","y1":"18","x2":"7","y2":"18"}}]})(props);
};
function FiAnchor (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"5","r":"3"}},{"tag":"line","attr":{"x1":"12","y1":"22","x2":"12","y2":"8"}},{"tag":"path","attr":{"d":"M5 12H2a10 10 0 0 0 20 0h-3"}}]})(props);
};
function FiAperture (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"14.31","y1":"8","x2":"20.05","y2":"17.94"}},{"tag":"line","attr":{"x1":"9.69","y1":"8","x2":"21.17","y2":"8"}},{"tag":"line","attr":{"x1":"7.38","y1":"12","x2":"13.12","y2":"2.06"}},{"tag":"line","attr":{"x1":"9.69","y1":"16","x2":"3.95","y2":"6.06"}},{"tag":"line","attr":{"x1":"14.31","y1":"16","x2":"2.83","y2":"16"}},{"tag":"line","attr":{"x1":"16.62","y1":"12","x2":"10.88","y2":"21.94"}}]})(props);
};
function FiArchive (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"21 8 21 21 3 21 3 8"}},{"tag":"rect","attr":{"x":"1","y":"3","width":"22","height":"5"}},{"tag":"line","attr":{"x1":"10","y1":"12","x2":"14","y2":"12"}}]})(props);
};
function FiArrowDownCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polyline","attr":{"points":"8 12 12 16 16 12"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"16"}}]})(props);
};
function FiArrowDownLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"17","y1":"7","x2":"7","y2":"17"}},{"tag":"polyline","attr":{"points":"17 17 7 17 7 7"}}]})(props);
};
function FiArrowDownRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"7","y1":"7","x2":"17","y2":"17"}},{"tag":"polyline","attr":{"points":"17 7 17 17 7 17"}}]})(props);
};
function FiArrowDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"5","x2":"12","y2":"19"}},{"tag":"polyline","attr":{"points":"19 12 12 19 5 12"}}]})(props);
};
function FiArrowLeftCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polyline","attr":{"points":"12 8 8 12 12 16"}},{"tag":"line","attr":{"x1":"16","y1":"12","x2":"8","y2":"12"}}]})(props);
};
function FiArrowLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"19","y1":"12","x2":"5","y2":"12"}},{"tag":"polyline","attr":{"points":"12 19 5 12 12 5"}}]})(props);
};
function FiArrowRightCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polyline","attr":{"points":"12 16 16 12 12 8"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiArrowRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"5","y1":"12","x2":"19","y2":"12"}},{"tag":"polyline","attr":{"points":"12 5 19 12 12 19"}}]})(props);
};
function FiArrowUpCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polyline","attr":{"points":"16 12 12 8 8 12"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12","y2":"8"}}]})(props);
};
function FiArrowUpLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"17","y1":"17","x2":"7","y2":"7"}},{"tag":"polyline","attr":{"points":"7 17 7 7 17 7"}}]})(props);
};
function FiArrowUpRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"7","y1":"17","x2":"17","y2":"7"}},{"tag":"polyline","attr":{"points":"7 7 17 7 17 17"}}]})(props);
};
function FiArrowUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"19","x2":"12","y2":"5"}},{"tag":"polyline","attr":{"points":"5 12 12 5 19 12"}}]})(props);
};
function FiAtSign (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"4"}},{"tag":"path","attr":{"d":"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"}}]})(props);
};
function FiAward (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"8","r":"7"}},{"tag":"polyline","attr":{"points":"8.21 13.89 7 23 12 20 17 23 15.79 13.88"}}]})(props);
};
function FiBarChart2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"18","y1":"20","x2":"18","y2":"10"}},{"tag":"line","attr":{"x1":"12","y1":"20","x2":"12","y2":"4"}},{"tag":"line","attr":{"x1":"6","y1":"20","x2":"6","y2":"14"}}]})(props);
};
function FiBarChart (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"20","x2":"12","y2":"10"}},{"tag":"line","attr":{"x1":"18","y1":"20","x2":"18","y2":"4"}},{"tag":"line","attr":{"x1":"6","y1":"20","x2":"6","y2":"16"}}]})(props);
};
function FiBatteryCharging (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"}},{"tag":"line","attr":{"x1":"23","y1":"13","x2":"23","y2":"11"}},{"tag":"polyline","attr":{"points":"11 6 7 12 13 12 9 18"}}]})(props);
};
function FiBattery (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"1","y":"6","width":"18","height":"12","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"23","y1":"13","x2":"23","y2":"11"}}]})(props);
};
function FiBellOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M13.73 21a2 2 0 0 1-3.46 0"}},{"tag":"path","attr":{"d":"M18.63 13A17.89 17.89 0 0 1 18 8"}},{"tag":"path","attr":{"d":"M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"}},{"tag":"path","attr":{"d":"M18 8a6 6 0 0 0-9.33-5"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiBell (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}},{"tag":"path","attr":{"d":"M13.73 21a2 2 0 0 1-3.46 0"}}]})(props);
};
function FiBluetooth (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"}}]})(props);
};
function FiBold (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"}},{"tag":"path","attr":{"d":"M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"}}]})(props);
};
function FiBookOpen (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"}},{"tag":"path","attr":{"d":"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"}}]})(props);
};
function FiBook (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}},{"tag":"path","attr":{"d":"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"}}]})(props);
};
function FiBookmark (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"}}]})(props);
};
function FiBox (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}},{"tag":"polyline","attr":{"points":"3.27 6.96 12 12.01 20.73 6.96"}},{"tag":"line","attr":{"x1":"12","y1":"22.08","x2":"12","y2":"12"}}]})(props);
};
function FiBriefcase (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"7","width":"20","height":"14","rx":"2","ry":"2"}},{"tag":"path","attr":{"d":"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"}}]})(props);
};
function FiCalendar (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"4","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"16","y1":"2","x2":"16","y2":"6"}},{"tag":"line","attr":{"x1":"8","y1":"2","x2":"8","y2":"6"}},{"tag":"line","attr":{"x1":"3","y1":"10","x2":"21","y2":"10"}}]})(props);
};
function FiCameraOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}},{"tag":"path","attr":{"d":"M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"}}]})(props);
};
function FiCamera (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}},{"tag":"circle","attr":{"cx":"12","cy":"13","r":"4"}}]})(props);
};
function FiCast (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"}},{"tag":"line","attr":{"x1":"2","y1":"20","x2":"2.01","y2":"20"}}]})(props);
};
function FiCheckCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22 11.08V12a10 10 0 1 1-5.93-9.14"}},{"tag":"polyline","attr":{"points":"22 4 12 14.01 9 11.01"}}]})(props);
};
function FiCheckSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"9 11 12 14 22 4"}},{"tag":"path","attr":{"d":"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"}}]})(props);
};
function FiCheck (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"20 6 9 17 4 12"}}]})(props);
};
function FiChevronDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"6 9 12 15 18 9"}}]})(props);
};
function FiChevronLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"15 18 9 12 15 6"}}]})(props);
};
function FiChevronRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"9 18 15 12 9 6"}}]})(props);
};
function FiChevronUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"18 15 12 9 6 15"}}]})(props);
};
function FiChevronsDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"7 13 12 18 17 13"}},{"tag":"polyline","attr":{"points":"7 6 12 11 17 6"}}]})(props);
};
function FiChevronsLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"11 17 6 12 11 7"}},{"tag":"polyline","attr":{"points":"18 17 13 12 18 7"}}]})(props);
};
function FiChevronsRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"13 17 18 12 13 7"}},{"tag":"polyline","attr":{"points":"6 17 11 12 6 7"}}]})(props);
};
function FiChevronsUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"17 11 12 6 7 11"}},{"tag":"polyline","attr":{"points":"17 18 12 13 7 18"}}]})(props);
};
function FiChrome (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"4"}},{"tag":"line","attr":{"x1":"21.17","y1":"8","x2":"12","y2":"8"}},{"tag":"line","attr":{"x1":"3.95","y1":"6.06","x2":"8.54","y2":"14"}},{"tag":"line","attr":{"x1":"10.88","y1":"21.94","x2":"15.46","y2":"14"}}]})(props);
};
function FiCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}}]})(props);
};
function FiClipboard (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}},{"tag":"rect","attr":{"x":"8","y":"2","width":"8","height":"4","rx":"1","ry":"1"}}]})(props);
};
function FiClock (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polyline","attr":{"points":"12 6 12 12 16 14"}}]})(props);
};
function FiCloudDrizzle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"8","y1":"19","x2":"8","y2":"21"}},{"tag":"line","attr":{"x1":"8","y1":"13","x2":"8","y2":"15"}},{"tag":"line","attr":{"x1":"16","y1":"19","x2":"16","y2":"21"}},{"tag":"line","attr":{"x1":"16","y1":"13","x2":"16","y2":"15"}},{"tag":"line","attr":{"x1":"12","y1":"21","x2":"12","y2":"23"}},{"tag":"line","attr":{"x1":"12","y1":"15","x2":"12","y2":"17"}},{"tag":"path","attr":{"d":"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"}}]})(props);
};
function FiCloudLightning (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"}},{"tag":"polyline","attr":{"points":"13 11 9 17 15 17 11 23"}}]})(props);
};
function FiCloudOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiCloudRain (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"16","y1":"13","x2":"16","y2":"21"}},{"tag":"line","attr":{"x1":"8","y1":"13","x2":"8","y2":"21"}},{"tag":"line","attr":{"x1":"12","y1":"15","x2":"12","y2":"23"}},{"tag":"path","attr":{"d":"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"}}]})(props);
};
function FiCloudSnow (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"}},{"tag":"line","attr":{"x1":"8","y1":"16","x2":"8.01","y2":"16"}},{"tag":"line","attr":{"x1":"8","y1":"20","x2":"8.01","y2":"20"}},{"tag":"line","attr":{"x1":"12","y1":"18","x2":"12.01","y2":"18"}},{"tag":"line","attr":{"x1":"12","y1":"22","x2":"12.01","y2":"22"}},{"tag":"line","attr":{"x1":"16","y1":"16","x2":"16.01","y2":"16"}},{"tag":"line","attr":{"x1":"16","y1":"20","x2":"16.01","y2":"20"}}]})(props);
};
function FiCloud (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"}}]})(props);
};
function FiCode (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"16 18 22 12 16 6"}},{"tag":"polyline","attr":{"points":"8 6 2 12 8 18"}}]})(props);
};
function FiCodepen (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"}},{"tag":"line","attr":{"x1":"12","y1":"22","x2":"12","y2":"15.5"}},{"tag":"polyline","attr":{"points":"22 8.5 12 15.5 2 8.5"}},{"tag":"polyline","attr":{"points":"2 15.5 12 8.5 22 15.5"}},{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"8.5"}}]})(props);
};
function FiCodesandbox (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}},{"tag":"polyline","attr":{"points":"7.5 4.21 12 6.81 16.5 4.21"}},{"tag":"polyline","attr":{"points":"7.5 19.79 7.5 14.6 3 12"}},{"tag":"polyline","attr":{"points":"21 12 16.5 14.6 16.5 19.79"}},{"tag":"polyline","attr":{"points":"3.27 6.96 12 12.01 20.73 6.96"}},{"tag":"line","attr":{"x1":"12","y1":"22.08","x2":"12","y2":"12"}}]})(props);
};
function FiCoffee (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 8h1a4 4 0 0 1 0 8h-1"}},{"tag":"path","attr":{"d":"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"}},{"tag":"line","attr":{"x1":"6","y1":"1","x2":"6","y2":"4"}},{"tag":"line","attr":{"x1":"10","y1":"1","x2":"10","y2":"4"}},{"tag":"line","attr":{"x1":"14","y1":"1","x2":"14","y2":"4"}}]})(props);
};
function FiColumns (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"}}]})(props);
};
function FiCommand (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"}}]})(props);
};
function FiCompass (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polygon","attr":{"points":"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"}}]})(props);
};
function FiCopy (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"9","y":"9","width":"13","height":"13","rx":"2","ry":"2"}},{"tag":"path","attr":{"d":"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}}]})(props);
};
function FiCornerDownLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"9 10 4 15 9 20"}},{"tag":"path","attr":{"d":"M20 4v7a4 4 0 0 1-4 4H4"}}]})(props);
};
function FiCornerDownRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"15 10 20 15 15 20"}},{"tag":"path","attr":{"d":"M4 4v7a4 4 0 0 0 4 4h12"}}]})(props);
};
function FiCornerLeftDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"14 15 9 20 4 15"}},{"tag":"path","attr":{"d":"M20 4h-7a4 4 0 0 0-4 4v12"}}]})(props);
};
function FiCornerLeftUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"14 9 9 4 4 9"}},{"tag":"path","attr":{"d":"M20 20h-7a4 4 0 0 1-4-4V4"}}]})(props);
};
function FiCornerRightDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"10 15 15 20 20 15"}},{"tag":"path","attr":{"d":"M4 4h7a4 4 0 0 1 4 4v12"}}]})(props);
};
function FiCornerRightUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"10 9 15 4 20 9"}},{"tag":"path","attr":{"d":"M4 20h7a4 4 0 0 0 4-4V4"}}]})(props);
};
function FiCornerUpLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"9 14 4 9 9 4"}},{"tag":"path","attr":{"d":"M20 20v-7a4 4 0 0 0-4-4H4"}}]})(props);
};
function FiCornerUpRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"15 14 20 9 15 4"}},{"tag":"path","attr":{"d":"M4 20v-7a4 4 0 0 1 4-4h12"}}]})(props);
};
function FiCpu (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"4","y":"4","width":"16","height":"16","rx":"2","ry":"2"}},{"tag":"rect","attr":{"x":"9","y":"9","width":"6","height":"6"}},{"tag":"line","attr":{"x1":"9","y1":"1","x2":"9","y2":"4"}},{"tag":"line","attr":{"x1":"15","y1":"1","x2":"15","y2":"4"}},{"tag":"line","attr":{"x1":"9","y1":"20","x2":"9","y2":"23"}},{"tag":"line","attr":{"x1":"15","y1":"20","x2":"15","y2":"23"}},{"tag":"line","attr":{"x1":"20","y1":"9","x2":"23","y2":"9"}},{"tag":"line","attr":{"x1":"20","y1":"14","x2":"23","y2":"14"}},{"tag":"line","attr":{"x1":"1","y1":"9","x2":"4","y2":"9"}},{"tag":"line","attr":{"x1":"1","y1":"14","x2":"4","y2":"14"}}]})(props);
};
function FiCreditCard (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"1","y":"4","width":"22","height":"16","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"1","y1":"10","x2":"23","y2":"10"}}]})(props);
};
function FiCrop (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M6.13 1L6 16a2 2 0 0 0 2 2h15"}},{"tag":"path","attr":{"d":"M1 6.13L16 6a2 2 0 0 1 2 2v15"}}]})(props);
};
function FiCrosshair (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"22","y1":"12","x2":"18","y2":"12"}},{"tag":"line","attr":{"x1":"6","y1":"12","x2":"2","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"6","x2":"12","y2":"2"}},{"tag":"line","attr":{"x1":"12","y1":"22","x2":"12","y2":"18"}}]})(props);
};
function FiDatabase (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"ellipse","attr":{"cx":"12","cy":"5","rx":"9","ry":"3"}},{"tag":"path","attr":{"d":"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"}},{"tag":"path","attr":{"d":"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"}}]})(props);
};
function FiDelete (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"}},{"tag":"line","attr":{"x1":"18","y1":"9","x2":"12","y2":"15"}},{"tag":"line","attr":{"x1":"12","y1":"9","x2":"18","y2":"15"}}]})(props);
};
function FiDisc (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"3"}}]})(props);
};
function FiDivideCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12","y2":"16"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"8"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}}]})(props);
};
function FiDivideSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12","y2":"16"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"8"}}]})(props);
};
function FiDivide (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"6","r":"2"}},{"tag":"line","attr":{"x1":"5","y1":"12","x2":"19","y2":"12"}},{"tag":"circle","attr":{"cx":"12","cy":"18","r":"2"}}]})(props);
};
function FiDollarSign (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"1","x2":"12","y2":"23"}},{"tag":"path","attr":{"d":"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"}}]})(props);
};
function FiDownloadCloud (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"8 17 12 21 16 17"}},{"tag":"line","attr":{"x1":"12","y1":"12","x2":"12","y2":"21"}},{"tag":"path","attr":{"d":"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"}}]})(props);
};
function FiDownload (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}},{"tag":"polyline","attr":{"points":"7 10 12 15 17 10"}},{"tag":"line","attr":{"x1":"12","y1":"15","x2":"12","y2":"3"}}]})(props);
};
function FiDribbble (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attr":{"d":"M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"}}]})(props);
};
function FiDroplet (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"}}]})(props);
};
function FiEdit2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"}}]})(props);
};
function FiEdit3 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 20h9"}},{"tag":"path","attr":{"d":"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"}}]})(props);
};
function FiEdit (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}},{"tag":"path","attr":{"d":"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"}}]})(props);
};
function FiExternalLink (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}},{"tag":"polyline","attr":{"points":"15 3 21 3 21 9"}},{"tag":"line","attr":{"x1":"10","y1":"14","x2":"21","y2":"3"}}]})(props);
};
function FiEyeOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiEye (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"3"}}]})(props);
};
function FiFacebook (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"}}]})(props);
};
function FiFastForward (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"13 19 22 12 13 5 13 19"}},{"tag":"polygon","attr":{"points":"2 19 11 12 2 5 2 19"}}]})(props);
};
function FiFeather (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"}},{"tag":"line","attr":{"x1":"16","y1":"8","x2":"2","y2":"22"}},{"tag":"line","attr":{"x1":"17.5","y1":"15","x2":"9","y2":"15"}}]})(props);
};
function FiFigma (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"}},{"tag":"path","attr":{"d":"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"}},{"tag":"path","attr":{"d":"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"}},{"tag":"path","attr":{"d":"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"}},{"tag":"path","attr":{"d":"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"}}]})(props);
};
function FiFileMinus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}},{"tag":"polyline","attr":{"points":"14 2 14 8 20 8"}},{"tag":"line","attr":{"x1":"9","y1":"15","x2":"15","y2":"15"}}]})(props);
};
function FiFilePlus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}},{"tag":"polyline","attr":{"points":"14 2 14 8 20 8"}},{"tag":"line","attr":{"x1":"12","y1":"18","x2":"12","y2":"12"}},{"tag":"line","attr":{"x1":"9","y1":"15","x2":"15","y2":"15"}}]})(props);
};
function FiFileText (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}},{"tag":"polyline","attr":{"points":"14 2 14 8 20 8"}},{"tag":"line","attr":{"x1":"16","y1":"13","x2":"8","y2":"13"}},{"tag":"line","attr":{"x1":"16","y1":"17","x2":"8","y2":"17"}},{"tag":"polyline","attr":{"points":"10 9 9 9 8 9"}}]})(props);
};
function FiFile (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"}},{"tag":"polyline","attr":{"points":"13 2 13 9 20 9"}}]})(props);
};
function FiFilm (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"2","width":"20","height":"20","rx":"2.18","ry":"2.18"}},{"tag":"line","attr":{"x1":"7","y1":"2","x2":"7","y2":"22"}},{"tag":"line","attr":{"x1":"17","y1":"2","x2":"17","y2":"22"}},{"tag":"line","attr":{"x1":"2","y1":"12","x2":"22","y2":"12"}},{"tag":"line","attr":{"x1":"2","y1":"7","x2":"7","y2":"7"}},{"tag":"line","attr":{"x1":"2","y1":"17","x2":"7","y2":"17"}},{"tag":"line","attr":{"x1":"17","y1":"17","x2":"22","y2":"17"}},{"tag":"line","attr":{"x1":"17","y1":"7","x2":"22","y2":"7"}}]})(props);
};
function FiFilter (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"}}]})(props);
};
function FiFlag (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"}},{"tag":"line","attr":{"x1":"4","y1":"22","x2":"4","y2":"15"}}]})(props);
};
function FiFolderMinus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}},{"tag":"line","attr":{"x1":"9","y1":"14","x2":"15","y2":"14"}}]})(props);
};
function FiFolderPlus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}},{"tag":"line","attr":{"x1":"12","y1":"11","x2":"12","y2":"17"}},{"tag":"line","attr":{"x1":"9","y1":"14","x2":"15","y2":"14"}}]})(props);
};
function FiFolder (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}}]})(props);
};
function FiFramer (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"}}]})(props);
};
function FiFrown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attr":{"d":"M16 16s-1.5-2-4-2-4 2-4 2"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"9.01","y2":"9"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"15.01","y2":"9"}}]})(props);
};
function FiGift (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"20 12 20 22 4 22 4 12"}},{"tag":"rect","attr":{"x":"2","y":"7","width":"20","height":"5"}},{"tag":"line","attr":{"x1":"12","y1":"22","x2":"12","y2":"7"}},{"tag":"path","attr":{"d":"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"}},{"tag":"path","attr":{"d":"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"}}]})(props);
};
function FiGitBranch (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"6","y1":"3","x2":"6","y2":"15"}},{"tag":"circle","attr":{"cx":"18","cy":"6","r":"3"}},{"tag":"circle","attr":{"cx":"6","cy":"18","r":"3"}},{"tag":"path","attr":{"d":"M18 9a9 9 0 0 1-9 9"}}]})(props);
};
function FiGitCommit (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"4"}},{"tag":"line","attr":{"x1":"1.05","y1":"12","x2":"7","y2":"12"}},{"tag":"line","attr":{"x1":"17.01","y1":"12","x2":"22.96","y2":"12"}}]})(props);
};
function FiGitMerge (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"18","cy":"18","r":"3"}},{"tag":"circle","attr":{"cx":"6","cy":"6","r":"3"}},{"tag":"path","attr":{"d":"M6 21V9a9 9 0 0 0 9 9"}}]})(props);
};
function FiGitPullRequest (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"18","cy":"18","r":"3"}},{"tag":"circle","attr":{"cx":"6","cy":"6","r":"3"}},{"tag":"path","attr":{"d":"M13 6h3a2 2 0 0 1 2 2v7"}},{"tag":"line","attr":{"x1":"6","y1":"9","x2":"6","y2":"21"}}]})(props);
};
function FiGithub (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"}}]})(props);
};
function FiGitlab (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"}}]})(props);
};
function FiGlobe (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"2","y1":"12","x2":"22","y2":"12"}},{"tag":"path","attr":{"d":"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"}}]})(props);
};
function FiGrid (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"7","height":"7"}},{"tag":"rect","attr":{"x":"14","y":"3","width":"7","height":"7"}},{"tag":"rect","attr":{"x":"14","y":"14","width":"7","height":"7"}},{"tag":"rect","attr":{"x":"3","y":"14","width":"7","height":"7"}}]})(props);
};
function FiHardDrive (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"22","y1":"12","x2":"2","y2":"12"}},{"tag":"path","attr":{"d":"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}},{"tag":"line","attr":{"x1":"6","y1":"16","x2":"6.01","y2":"16"}},{"tag":"line","attr":{"x1":"10","y1":"16","x2":"10.01","y2":"16"}}]})(props);
};
function FiHash (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"4","y1":"9","x2":"20","y2":"9"}},{"tag":"line","attr":{"x1":"4","y1":"15","x2":"20","y2":"15"}},{"tag":"line","attr":{"x1":"10","y1":"3","x2":"8","y2":"21"}},{"tag":"line","attr":{"x1":"16","y1":"3","x2":"14","y2":"21"}}]})(props);
};
function FiHeadphones (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M3 18v-6a9 9 0 0 1 18 0v6"}},{"tag":"path","attr":{"d":"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"}}]})(props);
};
function FiHeart (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"}}]})(props);
};
function FiHelpCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attr":{"d":"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}},{"tag":"line","attr":{"x1":"12","y1":"17","x2":"12.01","y2":"17"}}]})(props);
};
function FiHexagon (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}}]})(props);
};
function FiHome (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}},{"tag":"polyline","attr":{"points":"9 22 9 12 15 12 15 22"}}]})(props);
};
function FiImage (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"circle","attr":{"cx":"8.5","cy":"8.5","r":"1.5"}},{"tag":"polyline","attr":{"points":"21 15 16 10 5 21"}}]})(props);
};
function FiInbox (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"22 12 16 12 14 15 10 15 8 12 2 12"}},{"tag":"path","attr":{"d":"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}}]})(props);
};
function FiInfo (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"12","y1":"16","x2":"12","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12.01","y2":"8"}}]})(props);
};
function FiInstagram (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"2","width":"20","height":"20","rx":"5","ry":"5"}},{"tag":"path","attr":{"d":"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}},{"tag":"line","attr":{"x1":"17.5","y1":"6.5","x2":"17.51","y2":"6.5"}}]})(props);
};
function FiItalic (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"19","y1":"4","x2":"10","y2":"4"}},{"tag":"line","attr":{"x1":"14","y1":"20","x2":"5","y2":"20"}},{"tag":"line","attr":{"x1":"15","y1":"4","x2":"9","y2":"20"}}]})(props);
};
function FiKey (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"}}]})(props);
};
function FiLayers (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"12 2 2 7 12 12 22 7 12 2"}},{"tag":"polyline","attr":{"points":"2 17 12 22 22 17"}},{"tag":"polyline","attr":{"points":"2 12 12 17 22 12"}}]})(props);
};
function FiLayout (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"3","y1":"9","x2":"21","y2":"9"}},{"tag":"line","attr":{"x1":"9","y1":"21","x2":"9","y2":"9"}}]})(props);
};
function FiLifeBuoy (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"4"}},{"tag":"line","attr":{"x1":"4.93","y1":"4.93","x2":"9.17","y2":"9.17"}},{"tag":"line","attr":{"x1":"14.83","y1":"14.83","x2":"19.07","y2":"19.07"}},{"tag":"line","attr":{"x1":"14.83","y1":"9.17","x2":"19.07","y2":"4.93"}},{"tag":"line","attr":{"x1":"14.83","y1":"9.17","x2":"18.36","y2":"5.64"}},{"tag":"line","attr":{"x1":"4.93","y1":"19.07","x2":"9.17","y2":"14.83"}}]})(props);
};
function FiLink2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiLink (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}},{"tag":"path","attr":{"d":"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}}]})(props);
};
function FiLinkedin (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}},{"tag":"rect","attr":{"x":"2","y":"9","width":"4","height":"12"}},{"tag":"circle","attr":{"cx":"4","cy":"4","r":"2"}}]})(props);
};
function FiList (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"8","y1":"6","x2":"21","y2":"6"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"21","y2":"12"}},{"tag":"line","attr":{"x1":"8","y1":"18","x2":"21","y2":"18"}},{"tag":"line","attr":{"x1":"3","y1":"6","x2":"3.01","y2":"6"}},{"tag":"line","attr":{"x1":"3","y1":"12","x2":"3.01","y2":"12"}},{"tag":"line","attr":{"x1":"3","y1":"18","x2":"3.01","y2":"18"}}]})(props);
};
function FiLoader (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"6"}},{"tag":"line","attr":{"x1":"12","y1":"18","x2":"12","y2":"22"}},{"tag":"line","attr":{"x1":"4.93","y1":"4.93","x2":"7.76","y2":"7.76"}},{"tag":"line","attr":{"x1":"16.24","y1":"16.24","x2":"19.07","y2":"19.07"}},{"tag":"line","attr":{"x1":"2","y1":"12","x2":"6","y2":"12"}},{"tag":"line","attr":{"x1":"18","y1":"12","x2":"22","y2":"12"}},{"tag":"line","attr":{"x1":"4.93","y1":"19.07","x2":"7.76","y2":"16.24"}},{"tag":"line","attr":{"x1":"16.24","y1":"7.76","x2":"19.07","y2":"4.93"}}]})(props);
};
function FiLock (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"11","width":"18","height":"11","rx":"2","ry":"2"}},{"tag":"path","attr":{"d":"M7 11V7a5 5 0 0 1 10 0v4"}}]})(props);
};
function FiLogIn (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"}},{"tag":"polyline","attr":{"points":"10 17 15 12 10 7"}},{"tag":"line","attr":{"x1":"15","y1":"12","x2":"3","y2":"12"}}]})(props);
};
function FiLogOut (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}},{"tag":"polyline","attr":{"points":"16 17 21 12 16 7"}},{"tag":"line","attr":{"x1":"21","y1":"12","x2":"9","y2":"12"}}]})(props);
};
function FiMail (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}},{"tag":"polyline","attr":{"points":"22,6 12,13 2,6"}}]})(props);
};
function FiMapPin (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}},{"tag":"circle","attr":{"cx":"12","cy":"10","r":"3"}}]})(props);
};
function FiMap (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"}},{"tag":"line","attr":{"x1":"8","y1":"2","x2":"8","y2":"18"}},{"tag":"line","attr":{"x1":"16","y1":"6","x2":"16","y2":"22"}}]})(props);
};
function FiMaximize2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"15 3 21 3 21 9"}},{"tag":"polyline","attr":{"points":"9 21 3 21 3 15"}},{"tag":"line","attr":{"x1":"21","y1":"3","x2":"14","y2":"10"}},{"tag":"line","attr":{"x1":"3","y1":"21","x2":"10","y2":"14"}}]})(props);
};
function FiMaximize (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"}}]})(props);
};
function FiMeh (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"8","y1":"15","x2":"16","y2":"15"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"9.01","y2":"9"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"15.01","y2":"9"}}]})(props);
};
function FiMenu (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"3","y1":"12","x2":"21","y2":"12"}},{"tag":"line","attr":{"x1":"3","y1":"6","x2":"21","y2":"6"}},{"tag":"line","attr":{"x1":"3","y1":"18","x2":"21","y2":"18"}}]})(props);
};
function FiMessageCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"}}]})(props);
};
function FiMessageSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"}}]})(props);
};
function FiMicOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}},{"tag":"path","attr":{"d":"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"}},{"tag":"path","attr":{"d":"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"}},{"tag":"line","attr":{"x1":"12","y1":"19","x2":"12","y2":"23"}},{"tag":"line","attr":{"x1":"8","y1":"23","x2":"16","y2":"23"}}]})(props);
};
function FiMic (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"}},{"tag":"path","attr":{"d":"M19 10v2a7 7 0 0 1-14 0v-2"}},{"tag":"line","attr":{"x1":"12","y1":"19","x2":"12","y2":"23"}},{"tag":"line","attr":{"x1":"8","y1":"23","x2":"16","y2":"23"}}]})(props);
};
function FiMinimize2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"4 14 10 14 10 20"}},{"tag":"polyline","attr":{"points":"20 10 14 10 14 4"}},{"tag":"line","attr":{"x1":"14","y1":"10","x2":"21","y2":"3"}},{"tag":"line","attr":{"x1":"3","y1":"21","x2":"10","y2":"14"}}]})(props);
};
function FiMinimize (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"}}]})(props);
};
function FiMinusCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiMinusSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiMinus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"5","y1":"12","x2":"19","y2":"12"}}]})(props);
};
function FiMonitor (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"3","width":"20","height":"14","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"8","y1":"21","x2":"16","y2":"21"}},{"tag":"line","attr":{"x1":"12","y1":"17","x2":"12","y2":"21"}}]})(props);
};
function FiMoon (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"}}]})(props);
};
function FiMoreHorizontal (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"1"}},{"tag":"circle","attr":{"cx":"19","cy":"12","r":"1"}},{"tag":"circle","attr":{"cx":"5","cy":"12","r":"1"}}]})(props);
};
function FiMoreVertical (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"1"}},{"tag":"circle","attr":{"cx":"12","cy":"5","r":"1"}},{"tag":"circle","attr":{"cx":"12","cy":"19","r":"1"}}]})(props);
};
function FiMousePointer (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"}},{"tag":"path","attr":{"d":"M13 13l6 6"}}]})(props);
};
function FiMove (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"5 9 2 12 5 15"}},{"tag":"polyline","attr":{"points":"9 5 12 2 15 5"}},{"tag":"polyline","attr":{"points":"15 19 12 22 9 19"}},{"tag":"polyline","attr":{"points":"19 9 22 12 19 15"}},{"tag":"line","attr":{"x1":"2","y1":"12","x2":"22","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"22"}}]})(props);
};
function FiMusic (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M9 18V5l12-2v13"}},{"tag":"circle","attr":{"cx":"6","cy":"18","r":"3"}},{"tag":"circle","attr":{"cx":"18","cy":"16","r":"3"}}]})(props);
};
function FiNavigation2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"12 2 19 21 12 17 5 21 12 2"}}]})(props);
};
function FiNavigation (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"3 11 22 2 13 21 11 13 3 11"}}]})(props);
};
function FiOctagon (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"}}]})(props);
};
function FiPackage (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"16.5","y1":"9.4","x2":"7.5","y2":"4.21"}},{"tag":"path","attr":{"d":"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}},{"tag":"polyline","attr":{"points":"3.27 6.96 12 12.01 20.73 6.96"}},{"tag":"line","attr":{"x1":"12","y1":"22.08","x2":"12","y2":"12"}}]})(props);
};
function FiPaperclip (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"}}]})(props);
};
function FiPauseCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"10","y1":"15","x2":"10","y2":"9"}},{"tag":"line","attr":{"x1":"14","y1":"15","x2":"14","y2":"9"}}]})(props);
};
function FiPause (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"6","y":"4","width":"4","height":"16"}},{"tag":"rect","attr":{"x":"14","y":"4","width":"4","height":"16"}}]})(props);
};
function FiPenTool (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 19l7-7 3 3-7 7-3-3z"}},{"tag":"path","attr":{"d":"M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"}},{"tag":"path","attr":{"d":"M2 2l7.586 7.586"}},{"tag":"circle","attr":{"cx":"11","cy":"11","r":"2"}}]})(props);
};
function FiPercent (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"19","y1":"5","x2":"5","y2":"19"}},{"tag":"circle","attr":{"cx":"6.5","cy":"6.5","r":"2.5"}},{"tag":"circle","attr":{"cx":"17.5","cy":"17.5","r":"2.5"}}]})(props);
};
function FiPhoneCall (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPhoneForwarded (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"19 1 23 5 19 9"}},{"tag":"line","attr":{"x1":"15","y1":"5","x2":"23","y2":"5"}},{"tag":"path","attr":{"d":"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPhoneIncoming (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"16 2 16 8 22 8"}},{"tag":"line","attr":{"x1":"23","y1":"1","x2":"16","y2":"8"}},{"tag":"path","attr":{"d":"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPhoneMissed (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"23","y1":"1","x2":"17","y2":"7"}},{"tag":"line","attr":{"x1":"17","y1":"1","x2":"23","y2":"7"}},{"tag":"path","attr":{"d":"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPhoneOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"}},{"tag":"line","attr":{"x1":"23","y1":"1","x2":"1","y2":"23"}}]})(props);
};
function FiPhoneOutgoing (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 7 23 1 17 1"}},{"tag":"line","attr":{"x1":"16","y1":"8","x2":"23","y2":"1"}},{"tag":"path","attr":{"d":"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPhone (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"}}]})(props);
};
function FiPieChart (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21.21 15.89A10 10 0 1 1 8 2.83"}},{"tag":"path","attr":{"d":"M22 12A10 10 0 0 0 12 2v10z"}}]})(props);
};
function FiPlayCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"polygon","attr":{"points":"10 8 16 12 10 16 10 8"}}]})(props);
};
function FiPlay (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"5 3 19 12 5 21 5 3"}}]})(props);
};
function FiPlusCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"16"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiPlusSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"16"}},{"tag":"line","attr":{"x1":"8","y1":"12","x2":"16","y2":"12"}}]})(props);
};
function FiPlus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"12","y1":"5","x2":"12","y2":"19"}},{"tag":"line","attr":{"x1":"5","y1":"12","x2":"19","y2":"12"}}]})(props);
};
function FiPocket (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"}},{"tag":"polyline","attr":{"points":"8 10 12 14 16 10"}}]})(props);
};
function FiPower (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M18.36 6.64a9 9 0 1 1-12.73 0"}},{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"12"}}]})(props);
};
function FiPrinter (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"6 9 6 2 18 2 18 9"}},{"tag":"path","attr":{"d":"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}},{"tag":"rect","attr":{"x":"6","y":"14","width":"12","height":"8"}}]})(props);
};
function FiRadio (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"2"}},{"tag":"path","attr":{"d":"M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"}}]})(props);
};
function FiRefreshCcw (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"1 4 1 10 7 10"}},{"tag":"polyline","attr":{"points":"23 20 23 14 17 14"}},{"tag":"path","attr":{"d":"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"}}]})(props);
};
function FiRefreshCw (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 4 23 10 17 10"}},{"tag":"polyline","attr":{"points":"1 20 1 14 7 14"}},{"tag":"path","attr":{"d":"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"}}]})(props);
};
function FiRepeat (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"17 1 21 5 17 9"}},{"tag":"path","attr":{"d":"M3 11V9a4 4 0 0 1 4-4h14"}},{"tag":"polyline","attr":{"points":"7 23 3 19 7 15"}},{"tag":"path","attr":{"d":"M21 13v2a4 4 0 0 1-4 4H3"}}]})(props);
};
function FiRewind (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"11 19 2 12 11 5 11 19"}},{"tag":"polygon","attr":{"points":"22 19 13 12 22 5 22 19"}}]})(props);
};
function FiRotateCcw (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"1 4 1 10 7 10"}},{"tag":"path","attr":{"d":"M3.51 15a9 9 0 1 0 2.13-9.36L1 10"}}]})(props);
};
function FiRotateCw (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 4 23 10 17 10"}},{"tag":"path","attr":{"d":"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"}}]})(props);
};
function FiRss (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 11a9 9 0 0 1 9 9"}},{"tag":"path","attr":{"d":"M4 4a16 16 0 0 1 16 16"}},{"tag":"circle","attr":{"cx":"5","cy":"19","r":"1"}}]})(props);
};
function FiSave (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"}},{"tag":"polyline","attr":{"points":"17 21 17 13 7 13 7 21"}},{"tag":"polyline","attr":{"points":"7 3 7 8 15 8"}}]})(props);
};
function FiScissors (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"6","cy":"6","r":"3"}},{"tag":"circle","attr":{"cx":"6","cy":"18","r":"3"}},{"tag":"line","attr":{"x1":"20","y1":"4","x2":"8.12","y2":"15.88"}},{"tag":"line","attr":{"x1":"14.47","y1":"14.48","x2":"20","y2":"20"}},{"tag":"line","attr":{"x1":"8.12","y1":"8.12","x2":"12","y2":"12"}}]})(props);
};
function FiSearch (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"11","cy":"11","r":"8"}},{"tag":"line","attr":{"x1":"21","y1":"21","x2":"16.65","y2":"16.65"}}]})(props);
};
function FiSend (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"22","y1":"2","x2":"11","y2":"13"}},{"tag":"polygon","attr":{"points":"22 2 15 22 11 13 2 9 22 2"}}]})(props);
};
function FiServer (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"2","width":"20","height":"8","rx":"2","ry":"2"}},{"tag":"rect","attr":{"x":"2","y":"14","width":"20","height":"8","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"6","y1":"6","x2":"6.01","y2":"6"}},{"tag":"line","attr":{"x1":"6","y1":"18","x2":"6.01","y2":"18"}}]})(props);
};
function FiSettings (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"3"}},{"tag":"path","attr":{"d":"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"}}]})(props);
};
function FiShare2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"18","cy":"5","r":"3"}},{"tag":"circle","attr":{"cx":"6","cy":"12","r":"3"}},{"tag":"circle","attr":{"cx":"18","cy":"19","r":"3"}},{"tag":"line","attr":{"x1":"8.59","y1":"13.51","x2":"15.42","y2":"17.49"}},{"tag":"line","attr":{"x1":"15.41","y1":"6.51","x2":"8.59","y2":"10.49"}}]})(props);
};
function FiShare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"}},{"tag":"polyline","attr":{"points":"16 6 12 2 8 6"}},{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"15"}}]})(props);
};
function FiShieldOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"}},{"tag":"path","attr":{"d":"M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiShield (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}}]})(props);
};
function FiShoppingBag (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"}},{"tag":"line","attr":{"x1":"3","y1":"6","x2":"21","y2":"6"}},{"tag":"path","attr":{"d":"M16 10a4 4 0 0 1-8 0"}}]})(props);
};
function FiShoppingCart (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"9","cy":"21","r":"1"}},{"tag":"circle","attr":{"cx":"20","cy":"21","r":"1"}},{"tag":"path","attr":{"d":"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"}}]})(props);
};
function FiShuffle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"16 3 21 3 21 8"}},{"tag":"line","attr":{"x1":"4","y1":"20","x2":"21","y2":"3"}},{"tag":"polyline","attr":{"points":"21 16 21 21 16 21"}},{"tag":"line","attr":{"x1":"15","y1":"15","x2":"21","y2":"21"}},{"tag":"line","attr":{"x1":"4","y1":"4","x2":"9","y2":"9"}}]})(props);
};
function FiSidebar (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"9","y1":"3","x2":"9","y2":"21"}}]})(props);
};
function FiSkipBack (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"19 20 9 12 19 4 19 20"}},{"tag":"line","attr":{"x1":"5","y1":"19","x2":"5","y2":"5"}}]})(props);
};
function FiSkipForward (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"5 4 15 12 5 20 5 4"}},{"tag":"line","attr":{"x1":"19","y1":"5","x2":"19","y2":"19"}}]})(props);
};
function FiSlack (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"}},{"tag":"path","attr":{"d":"M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"}},{"tag":"path","attr":{"d":"M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"}},{"tag":"path","attr":{"d":"M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"}},{"tag":"path","attr":{"d":"M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"}},{"tag":"path","attr":{"d":"M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"}},{"tag":"path","attr":{"d":"M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"}},{"tag":"path","attr":{"d":"M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"}}]})(props);
};
function FiSlash (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"4.93","y1":"4.93","x2":"19.07","y2":"19.07"}}]})(props);
};
function FiSliders (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"4","y1":"21","x2":"4","y2":"14"}},{"tag":"line","attr":{"x1":"4","y1":"10","x2":"4","y2":"3"}},{"tag":"line","attr":{"x1":"12","y1":"21","x2":"12","y2":"12"}},{"tag":"line","attr":{"x1":"12","y1":"8","x2":"12","y2":"3"}},{"tag":"line","attr":{"x1":"20","y1":"21","x2":"20","y2":"16"}},{"tag":"line","attr":{"x1":"20","y1":"12","x2":"20","y2":"3"}},{"tag":"line","attr":{"x1":"1","y1":"14","x2":"7","y2":"14"}},{"tag":"line","attr":{"x1":"9","y1":"8","x2":"15","y2":"8"}},{"tag":"line","attr":{"x1":"17","y1":"16","x2":"23","y2":"16"}}]})(props);
};
function FiSmartphone (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"5","y":"2","width":"14","height":"20","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"12","y1":"18","x2":"12.01","y2":"18"}}]})(props);
};
function FiSmile (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"path","attr":{"d":"M8 14s1.5 2 4 2 4-2 4-2"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"9.01","y2":"9"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"15.01","y2":"9"}}]})(props);
};
function FiSpeaker (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"4","y":"2","width":"16","height":"20","rx":"2","ry":"2"}},{"tag":"circle","attr":{"cx":"12","cy":"14","r":"4"}},{"tag":"line","attr":{"x1":"12","y1":"6","x2":"12.01","y2":"6"}}]})(props);
};
function FiSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}}]})(props);
};
function FiStar (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"}}]})(props);
};
function FiStopCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"rect","attr":{"x":"9","y":"9","width":"6","height":"6"}}]})(props);
};
function FiSun (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"5"}},{"tag":"line","attr":{"x1":"12","y1":"1","x2":"12","y2":"3"}},{"tag":"line","attr":{"x1":"12","y1":"21","x2":"12","y2":"23"}},{"tag":"line","attr":{"x1":"4.22","y1":"4.22","x2":"5.64","y2":"5.64"}},{"tag":"line","attr":{"x1":"18.36","y1":"18.36","x2":"19.78","y2":"19.78"}},{"tag":"line","attr":{"x1":"1","y1":"12","x2":"3","y2":"12"}},{"tag":"line","attr":{"x1":"21","y1":"12","x2":"23","y2":"12"}},{"tag":"line","attr":{"x1":"4.22","y1":"19.78","x2":"5.64","y2":"18.36"}},{"tag":"line","attr":{"x1":"18.36","y1":"5.64","x2":"19.78","y2":"4.22"}}]})(props);
};
function FiSunrise (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M17 18a5 5 0 0 0-10 0"}},{"tag":"line","attr":{"x1":"12","y1":"2","x2":"12","y2":"9"}},{"tag":"line","attr":{"x1":"4.22","y1":"10.22","x2":"5.64","y2":"11.64"}},{"tag":"line","attr":{"x1":"1","y1":"18","x2":"3","y2":"18"}},{"tag":"line","attr":{"x1":"21","y1":"18","x2":"23","y2":"18"}},{"tag":"line","attr":{"x1":"18.36","y1":"11.64","x2":"19.78","y2":"10.22"}},{"tag":"line","attr":{"x1":"23","y1":"22","x2":"1","y2":"22"}},{"tag":"polyline","attr":{"points":"8 6 12 2 16 6"}}]})(props);
};
function FiSunset (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M17 18a5 5 0 0 0-10 0"}},{"tag":"line","attr":{"x1":"12","y1":"9","x2":"12","y2":"2"}},{"tag":"line","attr":{"x1":"4.22","y1":"10.22","x2":"5.64","y2":"11.64"}},{"tag":"line","attr":{"x1":"1","y1":"18","x2":"3","y2":"18"}},{"tag":"line","attr":{"x1":"21","y1":"18","x2":"23","y2":"18"}},{"tag":"line","attr":{"x1":"18.36","y1":"11.64","x2":"19.78","y2":"10.22"}},{"tag":"line","attr":{"x1":"23","y1":"22","x2":"1","y2":"22"}},{"tag":"polyline","attr":{"points":"16 5 12 9 8 5"}}]})(props);
};
function FiTablet (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"4","y":"2","width":"16","height":"20","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"12","y1":"18","x2":"12.01","y2":"18"}}]})(props);
};
function FiTag (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"}},{"tag":"line","attr":{"x1":"7","y1":"7","x2":"7.01","y2":"7"}}]})(props);
};
function FiTarget (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"6"}},{"tag":"circle","attr":{"cx":"12","cy":"12","r":"2"}}]})(props);
};
function FiTerminal (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"4 17 10 11 4 5"}},{"tag":"line","attr":{"x1":"12","y1":"19","x2":"20","y2":"19"}}]})(props);
};
function FiThermometer (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"}}]})(props);
};
function FiThumbsDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"}}]})(props);
};
function FiThumbsUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"}}]})(props);
};
function FiToggleLeft (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"1","y":"5","width":"22","height":"14","rx":"7","ry":"7"}},{"tag":"circle","attr":{"cx":"8","cy":"12","r":"3"}}]})(props);
};
function FiToggleRight (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"1","y":"5","width":"22","height":"14","rx":"7","ry":"7"}},{"tag":"circle","attr":{"cx":"16","cy":"12","r":"3"}}]})(props);
};
function FiTool (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"}}]})(props);
};
function FiTrash2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"3 6 5 6 21 6"}},{"tag":"path","attr":{"d":"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}},{"tag":"line","attr":{"x1":"10","y1":"11","x2":"10","y2":"17"}},{"tag":"line","attr":{"x1":"14","y1":"11","x2":"14","y2":"17"}}]})(props);
};
function FiTrash (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"3 6 5 6 21 6"}},{"tag":"path","attr":{"d":"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}}]})(props);
};
function FiTrello (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"rect","attr":{"x":"7","y":"7","width":"3","height":"9"}},{"tag":"rect","attr":{"x":"14","y":"7","width":"3","height":"5"}}]})(props);
};
function FiTrendingDown (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 18 13.5 8.5 8.5 13.5 1 6"}},{"tag":"polyline","attr":{"points":"17 18 23 18 23 12"}}]})(props);
};
function FiTrendingUp (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"23 6 13.5 15.5 8.5 10.5 1 18"}},{"tag":"polyline","attr":{"points":"17 6 23 6 23 12"}}]})(props);
};
function FiTriangle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}}]})(props);
};
function FiTruck (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"1","y":"3","width":"15","height":"13"}},{"tag":"polygon","attr":{"points":"16 8 20 8 23 11 23 16 16 16 16 8"}},{"tag":"circle","attr":{"cx":"5.5","cy":"18.5","r":"2.5"}},{"tag":"circle","attr":{"cx":"18.5","cy":"18.5","r":"2.5"}}]})(props);
};
function FiTv (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"2","y":"7","width":"20","height":"15","rx":"2","ry":"2"}},{"tag":"polyline","attr":{"points":"17 2 12 7 7 2"}}]})(props);
};
function FiTwitch (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"}}]})(props);
};
function FiTwitter (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"}}]})(props);
};
function FiType (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"4 7 4 4 20 4 20 7"}},{"tag":"line","attr":{"x1":"9","y1":"20","x2":"15","y2":"20"}},{"tag":"line","attr":{"x1":"12","y1":"4","x2":"12","y2":"20"}}]})(props);
};
function FiUmbrella (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"}}]})(props);
};
function FiUnderline (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"}},{"tag":"line","attr":{"x1":"4","y1":"21","x2":"20","y2":"21"}}]})(props);
};
function FiUnlock (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"11","width":"18","height":"11","rx":"2","ry":"2"}},{"tag":"path","attr":{"d":"M7 11V7a5 5 0 0 1 9.9-1"}}]})(props);
};
function FiUploadCloud (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"16 16 12 12 8 16"}},{"tag":"line","attr":{"x1":"12","y1":"12","x2":"12","y2":"21"}},{"tag":"path","attr":{"d":"M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"}},{"tag":"polyline","attr":{"points":"16 16 12 12 8 16"}}]})(props);
};
function FiUpload (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}},{"tag":"polyline","attr":{"points":"17 8 12 3 7 8"}},{"tag":"line","attr":{"x1":"12","y1":"3","x2":"12","y2":"15"}}]})(props);
};
function FiUserCheck (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"8.5","cy":"7","r":"4"}},{"tag":"polyline","attr":{"points":"17 11 19 13 23 9"}}]})(props);
};
function FiUserMinus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"8.5","cy":"7","r":"4"}},{"tag":"line","attr":{"x1":"23","y1":"11","x2":"17","y2":"11"}}]})(props);
};
function FiUserPlus (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"8.5","cy":"7","r":"4"}},{"tag":"line","attr":{"x1":"20","y1":"8","x2":"20","y2":"14"}},{"tag":"line","attr":{"x1":"23","y1":"11","x2":"17","y2":"11"}}]})(props);
};
function FiUserX (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"8.5","cy":"7","r":"4"}},{"tag":"line","attr":{"x1":"18","y1":"8","x2":"23","y2":"13"}},{"tag":"line","attr":{"x1":"23","y1":"8","x2":"18","y2":"13"}}]})(props);
};
function FiUser (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"12","cy":"7","r":"4"}}]})(props);
};
function FiUsers (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}},{"tag":"circle","attr":{"cx":"9","cy":"7","r":"4"}},{"tag":"path","attr":{"d":"M23 21v-2a4 4 0 0 0-3-3.87"}},{"tag":"path","attr":{"d":"M16 3.13a4 4 0 0 1 0 7.75"}}]})(props);
};
function FiVideoOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiVideo (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"23 7 16 12 23 17 23 7"}},{"tag":"rect","attr":{"x":"1","y":"5","width":"15","height":"14","rx":"2","ry":"2"}}]})(props);
};
function FiVoicemail (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"5.5","cy":"11.5","r":"4.5"}},{"tag":"circle","attr":{"cx":"18.5","cy":"11.5","r":"4.5"}},{"tag":"line","attr":{"x1":"5.5","y1":"16","x2":"18.5","y2":"16"}}]})(props);
};
function FiVolume1 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}},{"tag":"path","attr":{"d":"M15.54 8.46a5 5 0 0 1 0 7.07"}}]})(props);
};
function FiVolume2 (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}},{"tag":"path","attr":{"d":"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"}}]})(props);
};
function FiVolumeX (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}},{"tag":"line","attr":{"x1":"23","y1":"9","x2":"17","y2":"15"}},{"tag":"line","attr":{"x1":"17","y1":"9","x2":"23","y2":"15"}}]})(props);
};
function FiVolume (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}}]})(props);
};
function FiWatch (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"7"}},{"tag":"polyline","attr":{"points":"12 9 12 12 13.5 13.5"}},{"tag":"path","attr":{"d":"M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"}}]})(props);
};
function FiWifiOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}},{"tag":"path","attr":{"d":"M16.72 11.06A10.94 10.94 0 0 1 19 12.55"}},{"tag":"path","attr":{"d":"M5 12.55a10.94 10.94 0 0 1 5.17-2.39"}},{"tag":"path","attr":{"d":"M10.71 5.05A16 16 0 0 1 22.58 9"}},{"tag":"path","attr":{"d":"M1.42 9a15.91 15.91 0 0 1 4.7-2.88"}},{"tag":"path","attr":{"d":"M8.53 16.11a6 6 0 0 1 6.95 0"}},{"tag":"line","attr":{"x1":"12","y1":"20","x2":"12.01","y2":"20"}}]})(props);
};
function FiWifi (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M5 12.55a11 11 0 0 1 14.08 0"}},{"tag":"path","attr":{"d":"M1.42 9a16 16 0 0 1 21.16 0"}},{"tag":"path","attr":{"d":"M8.53 16.11a6 6 0 0 1 6.95 0"}},{"tag":"line","attr":{"x1":"12","y1":"20","x2":"12.01","y2":"20"}}]})(props);
};
function FiWind (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"}}]})(props);
};
function FiXCircle (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"9","y2":"15"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"15","y2":"15"}}]})(props);
};
function FiXOctagon (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"9","y2":"15"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"15","y2":"15"}}]})(props);
};
function FiXSquare (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"rect","attr":{"x":"3","y":"3","width":"18","height":"18","rx":"2","ry":"2"}},{"tag":"line","attr":{"x1":"9","y1":"9","x2":"15","y2":"15"}},{"tag":"line","attr":{"x1":"15","y1":"9","x2":"9","y2":"15"}}]})(props);
};
function FiX (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"line","attr":{"x1":"18","y1":"6","x2":"6","y2":"18"}},{"tag":"line","attr":{"x1":"6","y1":"6","x2":"18","y2":"18"}}]})(props);
};
function FiYoutube (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"path","attr":{"d":"M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"}},{"tag":"polygon","attr":{"points":"9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"}}]})(props);
};
function FiZapOff (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polyline","attr":{"points":"12.41 6.75 13 2 10.57 4.92"}},{"tag":"polyline","attr":{"points":"18.57 12.91 21 10 15.66 10"}},{"tag":"polyline","attr":{"points":"8 8 3 14 12 14 11 22 16 16"}},{"tag":"line","attr":{"x1":"1","y1":"1","x2":"23","y2":"23"}}]})(props);
};
function FiZap (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"polygon","attr":{"points":"13 2 3 14 12 14 11 22 21 10 12 10 13 2"}}]})(props);
};
function FiZoomIn (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"11","cy":"11","r":"8"}},{"tag":"line","attr":{"x1":"21","y1":"21","x2":"16.65","y2":"16.65"}},{"tag":"line","attr":{"x1":"11","y1":"8","x2":"11","y2":"14"}},{"tag":"line","attr":{"x1":"8","y1":"11","x2":"14","y2":"11"}}]})(props);
};
function FiZoomOut (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"},"child":[{"tag":"circle","attr":{"cx":"11","cy":"11","r":"8"}},{"tag":"line","attr":{"x1":"21","y1":"21","x2":"16.65","y2":"16.65"}},{"tag":"line","attr":{"x1":"8","y1":"11","x2":"14","y2":"11"}}]})(props);
};


/***/ }),

/***/ "./node_modules/react-icons/lib/esm/iconBase.js":
/*!******************************************************!*\
  !*** ./node_modules/react-icons/lib/esm/iconBase.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GenIcon": () => (/* binding */ GenIcon),
/* harmony export */   "IconBase": () => (/* binding */ IconBase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _iconContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iconContext */ "./node_modules/react-icons/lib/esm/iconContext.js");
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};




function Tree2Element(tree) {
  return tree && tree.map(function (node, i) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(node.tag, __assign({
      key: i
    }, node.attr), Tree2Element(node.child));
  });
}

function GenIcon(data) {
  return function (props) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IconBase, __assign({
      attr: __assign({}, data.attr)
    }, props), Tree2Element(data.child));
  };
}
function IconBase(props) {
  var elem = function (conf) {
    var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);

    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + ' ' : '') + props.className;
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __assign({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: __assign(__assign({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title", null, title), props.children);
  };

  return _iconContext__WEBPACK_IMPORTED_MODULE_1__.IconContext !== undefined ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_iconContext__WEBPACK_IMPORTED_MODULE_1__.IconContext.Consumer, null, function (conf) {
    return elem(conf);
  }) : elem(_iconContext__WEBPACK_IMPORTED_MODULE_1__.DefaultContext);
}

/***/ }),

/***/ "./node_modules/react-icons/lib/esm/iconContext.js":
/*!*********************************************************!*\
  !*** ./node_modules/react-icons/lib/esm/iconContext.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultContext": () => (/* binding */ DefaultContext),
/* harmony export */   "IconContext": () => (/* binding */ IconContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = (react__WEBPACK_IMPORTED_MODULE_0___default().createContext) && react__WEBPACK_IMPORTED_MODULE_0___default().createContext(DefaultContext);

/***/ }),

/***/ "./node_modules/react-icons/lib/esm/iconsManifest.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-icons/lib/esm/iconsManifest.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IconsManifest": () => (/* binding */ IconsManifest)
/* harmony export */ });
var IconsManifest = [
  {
    "id": "fa",
    "name": "Font Awesome",
    "projectUrl": "https://fontawesome.com/",
    "license": "CC BY 4.0 License",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "id": "io",
    "name": "Ionicons 4",
    "projectUrl": "https://ionicons.com/",
    "license": "MIT",
    "licenseUrl": "https://github.com/ionic-team/ionicons/blob/master/LICENSE"
  },
  {
    "id": "io5",
    "name": "Ionicons 5",
    "projectUrl": "https://ionicons.com/",
    "license": "MIT",
    "licenseUrl": "https://github.com/ionic-team/ionicons/blob/master/LICENSE"
  },
  {
    "id": "md",
    "name": "Material Design icons",
    "projectUrl": "http://google.github.io/material-design-icons/",
    "license": "Apache License Version 2.0",
    "licenseUrl": "https://github.com/google/material-design-icons/blob/master/LICENSE"
  },
  {
    "id": "ti",
    "name": "Typicons",
    "projectUrl": "http://s-ings.com/typicons/",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "id": "go",
    "name": "Github Octicons icons",
    "projectUrl": "https://octicons.github.com/",
    "license": "MIT",
    "licenseUrl": "https://github.com/primer/octicons/blob/master/LICENSE"
  },
  {
    "id": "fi",
    "name": "Feather",
    "projectUrl": "https://feathericons.com/",
    "license": "MIT",
    "licenseUrl": "https://github.com/feathericons/feather/blob/master/LICENSE"
  },
  {
    "id": "gi",
    "name": "Game Icons",
    "projectUrl": "https://game-icons.net/",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    "id": "wi",
    "name": "Weather Icons",
    "projectUrl": "https://erikflowers.github.io/weather-icons/",
    "license": "SIL OFL 1.1",
    "licenseUrl": "http://scripts.sil.org/OFL"
  },
  {
    "id": "di",
    "name": "Devicons",
    "projectUrl": "https://vorillaz.github.io/devicons/",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "ai",
    "name": "Ant Design Icons",
    "projectUrl": "https://github.com/ant-design/ant-design-icons",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "bs",
    "name": "Bootstrap Icons",
    "projectUrl": "https://github.com/twbs/icons",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "ri",
    "name": "Remix Icon",
    "projectUrl": "https://github.com/Remix-Design/RemixIcon",
    "license": "Apache License Version 2.0",
    "licenseUrl": "http://www.apache.org/licenses/"
  },
  {
    "id": "fc",
    "name": "Flat Color Icons",
    "projectUrl": "https://github.com/icons8/flat-color-icons",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "gr",
    "name": "Grommet-Icons",
    "projectUrl": "https://github.com/grommet/grommet-icons",
    "license": "Apache License Version 2.0",
    "licenseUrl": "http://www.apache.org/licenses/"
  },
  {
    "id": "hi",
    "name": "Heroicons",
    "projectUrl": "https://github.com/tailwindlabs/heroicons",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "si",
    "name": "Simple Icons",
    "projectUrl": "https://simpleicons.org/",
    "license": "CC0 1.0 Universal",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "id": "im",
    "name": "IcoMoon Free",
    "projectUrl": "https://github.com/Keyamoon/IcoMoon-Free",
    "license": "CC BY 4.0 License"
  },
  {
    "id": "bi",
    "name": "BoxIcons",
    "projectUrl": "https://github.com/atisawd/boxicons",
    "license": "CC BY 4.0 License"
  },
  {
    "id": "cg",
    "name": "css.gg",
    "projectUrl": "https://github.com/astrit/css.gg",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  },
  {
    "id": "vsc",
    "name": "VS Code Icons",
    "projectUrl": "https://github.com/microsoft/vscode-codicons",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "id": "tb",
    "name": "Tabler Icons",
    "projectUrl": "https://github.com/tabler/tabler-icons",
    "license": "MIT",
    "licenseUrl": "https://opensource.org/licenses/MIT"
  }
]

/***/ }),

/***/ "./node_modules/react-icons/lib/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/react-icons/lib/esm/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultContext": () => (/* reexport safe */ _iconContext__WEBPACK_IMPORTED_MODULE_2__.DefaultContext),
/* harmony export */   "GenIcon": () => (/* reexport safe */ _iconBase__WEBPACK_IMPORTED_MODULE_1__.GenIcon),
/* harmony export */   "IconBase": () => (/* reexport safe */ _iconBase__WEBPACK_IMPORTED_MODULE_1__.IconBase),
/* harmony export */   "IconContext": () => (/* reexport safe */ _iconContext__WEBPACK_IMPORTED_MODULE_2__.IconContext),
/* harmony export */   "IconsManifest": () => (/* reexport safe */ _iconsManifest__WEBPACK_IMPORTED_MODULE_0__.IconsManifest)
/* harmony export */ });
/* harmony import */ var _iconsManifest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./iconsManifest */ "./node_modules/react-icons/lib/esm/iconsManifest.js");
/* harmony import */ var _iconBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iconBase */ "./node_modules/react-icons/lib/esm/iconBase.js");
/* harmony import */ var _iconContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iconContext */ "./node_modules/react-icons/lib/esm/iconContext.js");




/***/ }),

/***/ "./node_modules/slugify/slugify.js":
/*!*****************************************!*\
  !*** ./node_modules/slugify/slugify.js ***!
  \*****************************************/
/***/ (function(module) {


;(function (name, root, factory) {
  if (true) {
    module.exports = factory()
    module.exports["default"] = factory()
  }
  /* istanbul ignore next */
  else {}
}('slugify', this, function () {
  var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"}')
  var locales = JSON.parse('{"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}}')

  function replace (string, options) {
    if (typeof string !== 'string') {
      throw new Error('slugify: string argument expected')
    }

    options = (typeof options === 'string')
      ? {replacement: options}
      : options || {}

    var locale = locales[options.locale] || {}

    var replacement = options.replacement === undefined ? '-' : options.replacement

    var trim = options.trim === undefined ? true : options.trim

    var slug = string.normalize().split('')
      // replace characters based on charMap
      .reduce(function (result, ch) {
        var appendChar = locale[ch] || charMap[ch] || ch;
        if (appendChar === replacement) {
          appendChar = ' ';
        }
        return result + appendChar
          // remove not allowed characters
          .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
      }, '');

    if (options.strict) {
      slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
    }

    if (trim) {
      slug = slug.trim()
    }

    // Replace spaces with replacement character, treating multiple consecutive
    // spaces as a single space.
    slug = slug.replace(/\s+/g, replacement);

    if (options.lower) {
      slug = slug.toLowerCase()
    }

    return slug
  }

  replace.extend = function (customMap) {
    Object.assign(charMap, customMap)
  }

  return replace
}))


/***/ }),

/***/ "./src/assest/images/logo.png":
/*!************************************!*\
  !*** ./src/assest/images/logo.png ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "static/logo-5ebcdb42edc2d69aba3c31a8fe0cddd1.png");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inheritsLoose.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inheritsLoose.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  setPrototypeOf(subClass, superClass);
}

module.exports = _inheritsLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/gatsby-link/dist/index.modern.mjs":
/*!********************************************************!*\
  !*** ./node_modules/gatsby-link/dist/index.modern.mjs ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ w),
/* harmony export */   "navigate": () => (/* binding */ P),
/* harmony export */   "parsePath": () => (/* binding */ a),
/* harmony export */   "withAssetPrefix": () => (/* binding */ m),
/* harmony export */   "withPrefix": () => (/* binding */ h)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @gatsbyjs/reach-router */ "./node_modules/@gatsbyjs/reach-router/es/index.js");
/* harmony import */ var gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gatsby-page-utils/apply-trailing-slash-option */ "./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js");
"client export"
;function i(){return i=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},i.apply(this,arguments)}function a(t){let e=t||"/",n="",r="";const o=e.indexOf("#");-1!==o&&(r=e.slice(o),e=e.slice(0,o));const s=e.indexOf("?");return-1!==s&&(n=e.slice(s),e=e.slice(0,s)),{pathname:e,search:"?"===n?"":n,hash:"#"===r?"":r}}const c=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=t=>{if("string"==typeof t)return!(t=>c.test(t))(t)},p=()=> true? true?"":0:0;function h(t,e=(()=> true? true?"":0:0)()){var n;if(!l(t))return t;if(t.startsWith("./")||t.startsWith("../"))return t;const r=null!=(n=null!=e?e:p())?n:"/";return`${null!=r&&r.endsWith("/")?r.slice(0,-1):r}${t.startsWith("/")?t:`/${t}`}`}const f=t=>null==t?void 0:t.startsWith("/"),u=()=> true?"legacy":0,_=(t,e)=>{if("number"==typeof t)return t;if(!l(t))return t;const{pathname:r,search:o,hash:i}=a(t),c=u();let p=t;return"always"!==c&&"never"!==c||(p=`${(0,gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__.applyTrailingSlashOption)(r,c)}${o}${i}`),f(p)?h(p):function(t,e){if(f(t))return t;const r=u(),o=(0,_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.resolve)(t,e);return"always"===r||"never"===r?(0,gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__.applyTrailingSlashOption)(o,r):o}(p,e)},d=["to","getProps","onClick","onMouseEnter","activeClassName","activeStyle","innerRef","partiallyActive","state","replace","_location"];function m(t){return h(t,p())}const y={activeClassName:prop_types__WEBPACK_IMPORTED_MODULE_3__.string,activeStyle:prop_types__WEBPACK_IMPORTED_MODULE_3__.object,partiallyActive:prop_types__WEBPACK_IMPORTED_MODULE_3__.bool};function v(t){/*#__PURE__*/return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.Location,null,({location:n})=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(b,i({},t,{_location:n})))}class b extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(t){super(t),this.defaultGetProps=({isPartiallyCurrent:t,isCurrent:e})=>(this.props.partiallyActive?t:e)?{className:[this.props.className,this.props.activeClassName].filter(Boolean).join(" "),style:i({},this.props.style,this.props.activeStyle)}:null;let e=!1;"undefined"!=typeof window&&window.IntersectionObserver&&(e=!0),this.state={IOSupported:e},this.abortPrefetch=null,this.handleRef=this.handleRef.bind(this)}_prefetch(){let t=window.location.pathname+window.location.search;this.props._location&&this.props._location.pathname&&(t=this.props._location.pathname+this.props._location.search);const e=a(_(this.props.to,t)),n=e.pathname+e.search;if(t!==n)return ___loader.enqueue(n)}componentWillUnmount(){if(!this.io)return;const{instance:t,el:e}=this.io;this.abortPrefetch&&this.abortPrefetch.abort(),t.unobserve(e),t.disconnect()}handleRef(t){this.props.innerRef&&Object.prototype.hasOwnProperty.call(this.props.innerRef,"current")?this.props.innerRef.current=t:this.props.innerRef&&this.props.innerRef(t),this.state.IOSupported&&t&&(this.io=((t,e)=>{const n=new window.IntersectionObserver(n=>{n.forEach(n=>{t===n.target&&e(n.isIntersecting||n.intersectionRatio>0)})});return n.observe(t),{instance:n,el:t}})(t,t=>{t?this.abortPrefetch=this._prefetch():this.abortPrefetch&&this.abortPrefetch.abort()}))}render(){const t=this.props,{to:n,getProps:r=this.defaultGetProps,onClick:s,onMouseEnter:c,state:p,replace:h,_location:f}=t,u=function(t,e){if(null==t)return{};var n,r,o={},s=Object.keys(t);for(r=0;r<s.length;r++)e.indexOf(n=s[r])>=0||(o[n]=t[n]);return o}(t,d); false||l(n)||console.warn(`External link ${n} was detected in a Link component. Use the Link component only for internal links. See: https://gatsby.dev/internal-links`);const m=_(n,f.pathname);return l(m)?/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.Link,i({to:m,state:p,getProps:r,innerRef:this.handleRef,onMouseEnter:t=>{c&&c(t);const e=a(m);___loader.hovering(e.pathname+e.search)},onClick:t=>{if(s&&s(t),!(0!==t.button||this.props.target||t.defaultPrevented||t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)){t.preventDefault();let e=h;const n=encodeURI(m)===f.pathname;"boolean"!=typeof h&&n&&(e=!0),window.___navigate(m,{state:p,replace:e})}return!0}},u)):/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a",i({href:m},u))}}b.propTypes=i({},y,{onClick:prop_types__WEBPACK_IMPORTED_MODULE_3__.func,to:prop_types__WEBPACK_IMPORTED_MODULE_3__.string.isRequired,replace:prop_types__WEBPACK_IMPORTED_MODULE_3__.bool,state:prop_types__WEBPACK_IMPORTED_MODULE_3__.object});var w=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((t,n)=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(v,i({innerRef:n},t)));const P=(t,e)=>{window.___navigate(_(t,window.location.pathname),e)};
//# sourceMappingURL=index.modern.mjs.map


/***/ }),

/***/ "./.cache/redirects.json":
/*!*******************************!*\
  !*** ./.cache/redirects.json ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = [];

/***/ }),

/***/ "./public/page-data/sq/d/1058133876.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/1058133876.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"allContentfulRecipe":{"nodes":[{"id":"6b67236e-3b0d-557e-b30d-b94e07b67507","title":"bisibele bath","cookTime":2,"prepTime":2,"content":{"tags":["lunch","breakfast","dinner","rice","curry","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=181&h=121&q=50&fm=webp 181w,\\nhttps://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=362&h=241&q=50&fm=webp 362w,\\nhttps://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=724&h=483&q=50&fm=webp 724w","sizes":"(min-width: 724px) 724px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=724&h=483&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=181&h=121&fl=progressive&q=50&fm=jpg 181w,\\nhttps://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=362&h=241&fl=progressive&q=50&fm=jpg 362w,\\nhttps://images.ctfassets.net/qucxnkqed615/60nBpmCMMAqs679WQI94dI/c3e4f0bb0d62051928de6df8e20b6bf0/Bisi-Bele-bath.jpg?w=724&h=483&fl=progressive&q=50&fm=jpg 724w","sizes":"(min-width: 724px) 724px, 100vw"}},"layout":"constrained","width":724,"height":482.99999999999994,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'267\'%20viewBox=\'0%200%20400%20267\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M20%202c-3%201-4%203-4%205%200%203%201%202%207%200%203-2%205-2%208-2%205%201%207%200%207-3%200-2-1-2-8-2L20%202m211%2048-2%205-2%204c-4%203-4%203%201%203%202-1%204-1%205%201%202%201%202%201%206-1l4-1%204%201h3l-1-6c0-8%200-8-9-8-7%200-8%200-9%202M8%2063l-3%205c-1%203-1%203%202%206%204%204%204%204%203%209l-1%205c-2%201-1%202%202%202%206%200%209%202%208%204s0%205%204%205c3%201%209%207%209%209l4%204%204%203%201%201c1%200%204%202%206%205l8%206%203%202c0%202%207%206%209%206l1%201c0%203%2014%209%2019%209l12-1%208-1v-4c-1-2-1-3%202-5%206-3%206-7%200-10-7-3-10-3-10%202-1%204-2%204-8%201l-5-2-2-2c0-2-1-3-2-3l-3-1c-1-2-6-4-8-2l-2%202c0%202%203%201%203%200l1-1v3c-1%202-2%203-4%202l-4-1c-3%200-9-5-9-7l-2-2c-2%200-3-2-3-2%200-3%202-2%204%200l5%201%204%201h2l1-2-4-2a1701%201701%200%200%201-12-7l-5-3-5-2-4-3c-2-1-4-5-2-6%201-1%208%201%2016%205l6%202c5%201%205%202%206%205%202%205%205%207%2013%208l10%202c3%202%203%202%207%201s21%200%2023%202l4-4c0-2%206-10%209-12%203-3%203-4-1-4l-11-2-12-4-6-1%2018%201c5%201%2011-1%2011-3l1-1%2013-9%202-6v-4h-4l-7%202c-10%204-41%208-48%206l-23-2a119%20119%200%200%201-44-7H8m263%201-1%202-1%202c-1%200-2%201-2%203%200%203%200%203-3%201-2-1-2-1-3%202-1%201%200%202%203%203%204%201%204%201%204%204-1%202-1%202%201%202s3%201%203%202l3%201%202%201c0%202%202%203%203%202%203-3%207-1%2011%204l4%205c-1%201%203%203%205%203s3-2%203-4l-4%201c-3%200-3%200-2-2l2-2c1-1%201-5-1-6l-2-3-1-1c-3%200-3-2-2-4%202-2%205-3%207-1%200%201%203-2%203-4h-1c-2%202-3%201-6-5-2-3-2-4-3-3-2%201-3%201-6-2-4-3-4-3-5-2l-2%203-1%201-1-1-2-2-3-2-2%202m-82%208c-6%200-3%204%203%203l4%201%205%202c4%202%205%202%205%205%200%206%205%209%208%205%201-2%202-2%205-1%202%200%203%201%203%202h6c7%200%207%200%209%203%203%203%203%203%205%202%201-1%201-1%201%201l-3%203v3l-1%201c-1%200-2%200-1%201l-1%203c-2%202%202%201%205-1%202-3%208-3%2011%200s4%207%202%208v-1l-1-1c-1%201-3%200-4-1h-16c-3-3-3-6%200-7%202-1%202-1%201-3l1-3c1-1%200-2-1-4h-3c-2%203-19%205-24%202h-3c-2-2-3-7-2-7l1-1c0-1-5-2-6%200h-3l-2%201c1%201%200%202-1%203l-3%201c-1%202-6-1-6-3s-11-4-12-1v4c1%200%202%201%202%203%200%203-1%204-6%206l-7%202c-2%200%200%202%203%202%204%201%208%206%206%208l-1-1h-5l2%201c2%200%202%200%203%202%200%203%201%204%204%203%202%200%202%200%202%203s2%206%205%205l5%201c3%202%204%202%206%200%203-1%204-3%201-3-3%201-3%200%200-3l3-2%203-1%203-1h3c1-1%202-2%201-3l-1-2v-1c-1%200-1-1%201-3s3-3%203%200h5l4%201c0%201-2%202-6%202-2%200-3%201-3%202%200%203%202%205%204%205l3%202c0%202%201%202%202%201%203-1%207-1%208%201%200%202-5%204-6%203s-2%200-4%202-2%203-1%203l3%202c0%202%201%203%203%203l3%202c0%204-7%207-9%204h-9l-1-2c2-2%201-4%200-4-1%201-2%200-3-1l-3-1h-4c-2-2-4-2-2%200%201%201%201%201-2%201s-3%200-2%201l1%203c0%201-8%202-10%201h-3c-1%201-2%200-3-1l-2-2-3%203c-2%203-2%203-4%201l-2-3h-2l-2-1-3-1c-2%200-3-1-1-2v-6c-2-1-4%200-4%201l-2%202-3%203-1%201h-1l2%201v1l3%201c4-1%204%201%200%204-1%201-2%202-1%203%202%202%204%201%205-1l1-2%203-2h3c5%202%202%209-4%209-3%200-3%202%201%205l7%206c3%203%204%204%206%204v-2c-2-2-1-3%201-2l2%203c-1%202%202%205%206%205l2%202%203%201%2017%206%205%202%202%202%203%201%208%203c6%202%207%202%2014%202h16l10%201%203%201a310%20310%200%200%200%2092-8c3%200%208-4%207-5%200-1%201-2%203-2l3-2%209-5%208-6%203-2%205-3c3-4%203-4%202-7l-4-3c-1%200-2-3%200-4l3%201%201%201%201%202c-2%205%203%203%206-3%201-4-1-9-5-11-2-1-2-1-2%202v2c-1-1-10-3-11-2l-5-1%202-2%201-2-2-1h-6l-4-2-5-3c0%201-8%200-9-2h-2c-1%200-3-4-2-5l2%201c2%204%206%204%207%200v-9l4%204%205%203%204%201c5%203%209%200%207-5%200-1-1-2-4-1l-4-1c0-2-1-2-3-2l-5-1-2-1c-2%200-2-3%200-3l2-2h-5c-1%201-9%200-11-1-3-2-27-3-27-1l-3-1c-3-3-4-2-2%202l2%204h-8l-3%201-2%201h-4c0-1-1-2-3-1-2%200-2%200-1-1h-5c-2%201-2%201%200%201s4%202%203%204l-5%201c-4%200-7-3-3-6%201-1%200-2-2-1-2%200-2%200-2-2h-2c-1-3-7-3-10%200l-4%203c-1%200-1-1%201-3%203-3%203-5%200-5h-4l-5-2c-3-2-4-2-6-1-4%202-5%201-5-1s1-3%204-3c2%200%203-1%203-2%200-2%202-2%204%200%209%207%209%207%2011%205%203-2%204-4%202-4l-2%201h-1v-1l-1-1-1-2c0-2%200-2-3-1-4%201-6%200-4-2s0-2-3-1-4%202-3%203h-5c-3%202-11-1-11-4%200-2%200-2-2-2-1%201-2%200-2-1l-1-1v1c0%202-2%204-3%202-2-2-7-3-11-2-5%202-9%201-8-1%200-2%200-2-3-2h-17m171%2010c-1%202%2011%206%2016%207%2010%200%2014-2%209-5-3-1-24-3-25-2M79%2094v3l-1%203c-3%203-2%205%205%205%209%201%209-1%204-8-3-3-6-4-8-3m66%2013c-3%204-5%207-5%2011-1%204-1%205%203%203l-1-1c-1-1-1-1%203-3%204-1%205-3%203-3v-4c1-2%203%200%202%202%200%201%200%202%202%203v1c-2%201%200%203%203%204l2%201c-1%201%201%204%204%204%201%200%202-1%202-4%201-5%200-6-1-4l-2%201c-2%200-2%200-2-2%201-10%201-11-1-10-6%202-7%202-8%201-2-2-2-2-4%200m-71%2017c-3%202%202%209%2010%2013s20%204%2012%200l-4-4-4-2-2-1-3-2c-2%200-3-1-3-2l-3-2h-3m207%202-2%202h-5c-5%200-6%200-8%202-1%202-2%202-2%201l-4-1h-2l-2-1c-5-1-8%200-10%202s-3%205%200%204c5-3%207-3%209-2v2c-3%203-2%204%202%203%203%200%203%200%202%202l-2%203-1%203-1%202-2%201v3l6-6c0-4%209-5%2010-1%201%201-2%202-4%200-1-1-4%201-4%204l4%201%201-1%202-1%201%201c-1%201%200%201%201%201%202%200%201%201-2%201-4%201-5%202-2%204%203%200%206-1%208-4%203-3%206-5%207-3l4%202%202%201c-1%201-1%201%204%202l4%201c0%201%206%200%207-2l1-2%201%201h2c2-2%201-3-1-3h-3l-2-2-2-2c0-2%200-3-2-3-2-1-3%200-2%201l-1%203h-2c-1-2-2-2-3-1-2%201-2%201-4-1l-5-2-4-1h-4l-1-2v-2l-1-1c0-4%209-5%2019-3%205%202%205%202%205%200s-3-4-6-4l-2-1%202-1%204-1h2c3%202%206%202%206%201%200-4-14-4-18%200m41-2c-1%201-1%202%201%203%201%201%201%201-1%201s-3%201-3%202l-3%203-2%201c0%203%206%204%206%201%200-1%200-2%201-1l1%202c-1%201%200%201%201%201l2%201-3%201-5%202c-5%202-6%202-6%201l2-1%201-1c0-4-10-6-12-2l-1%202a154%20154%200%200%201%204%201l1%202%201%201%201-2c-1-2%201-3%202%200l-1%202c-1%201-1%201%201%202%201%200%202%201%201%203%200%203%202%204%207%204%203-1%203-1%202%201%200%202%200%203%203%203%203%201%204%202%205%204%201%204%207%204%207-1h-1l-4-2-3-1-1-1%202-3c0-2-3-4-5-2-2%201-4-2-2-6l1%201%201%203%201-3%201-2%201%202c0%202%203%203%203%201a21%2021%200%200%201%201-4l1%201%204%202c2%200%202%200%200%201v5l3%204c1%200%202-7%201-10v-2l1%201%202%201h1c0-2-4-5-5-5l-2-1-3-1c-3%201-5-1-4-3%200-2%202-3%202-1h2c1-1%202-2%201-3l1-1c4%201%204%200%202-2l-6-2c-4%200-4%200-3-2%200-2-4-3-6-1m35%202c-4%200-5%201-3%202v1h-2l2%201c1%201%201%201-2%202l-8%202c-2%202-4%202-7%201-3%200-3%200-1%202l11%205h3l-3%201h1l3%201%202%201c2-1%202%200%202%201l1%201%201%202-2%201-3%202c-2%201-1%204%203%204v3l2%202%202%204%202%202v-7c-1-5%200-8%201-5%201%201%206%200%206-2l-3-1c-2%201-6-1-6-2h6l6-1c-1-1%206-3%208-2l1-2-1-1c-2%200-4-3-4-4h3c4%200%205-1%202-3s-13-4-16-3h-2l-2%201c-2%201-2%201-1-2%201-2%202-2%204-2h3c1-3-5-6-9-5m-235%2019%202%204c3%203%204%206%202%208l-1%205v6l1-4%202-2%201-1c-1-1%200-2%202-2%204%201%2014%208%2015%2011l3%202c4%200%205%203%202%203-2%200-2%200-1%201v5c1%201%202%203%201%204h1c1-1%201-1%201%201%200%203%200%203-3%203-2%200-2%200-2-3v-1c-1%202-2%202-3%201l1-2v-1l-4-3c-2-4-3-5-3-2l-1%202c-3-1-2%202%200%204l4%205%203%204c1%201%202%202%201%203%200%202-2%203-2%201s-7-10-9-10c-1%200-1%201%201%203l1%202c-1%201-10-2-11-4s-4-1-4%202c0%201%200%202%202%202%203%200%204%201%203%204l1%203c1-1%203%201%203%205s-2%206-6%206c-3%200-3%203%200%203%203%201%202%203-2%204-1%200-3%200-3%202-2%203-1%204%202%203%201-1%202-1%202%201l-3%201c-2%200-6%204-4%205%201%201%204%200%204-2l2-2c0%201-2%209-4%2010l-3-1h-2c-2%202-1%203%203%203l3%201c0%201-5%203-6%202-1-2-2-1-4%203l-3%204h-4c-1%200-2%202-2%205l-2%204-1%204c0%203%202%204%203%201a133%20133%200%200%201%205-12c1%201%200%2010-1%2012v2c2%201%205-1%205-4l3-3c2%200%201%204-1%205s-1%203%202%203c2%200%203-3%205-12l1-6%202-3%202-2v5l-1%203-1%204-2%204c-1%203-1%208%201%207%202%200%206-13%205-14l2-6c2-4%202-5-3-5-3%200-3%200-1-3v-4l1-2%202-2%202-2v6c-3%205-2%206%201%206%202%200%202%200%202%203l-2%208-2%206-1%202v8h4c2%202%204%201%204-3%200-3%201-4%202-2v2l-1%203c1%202%202%202%20128%202a1312%201312%200%200%200%20117-3c-1%202-4-2-4-5v-2l-1-2-1-4c1-1%201-1%203%201h3c2-2%200-6-3-6-4%201-5-1-4-4%200-4%202-5%202-1%200%202%200%203%202%203l1-2v-2l2%202c0%202%202%203%203%202%200-1%201-2%203-1s2%203-1%203c-2%200-3%202-3%205%201%202%202%202%203%202h3c2%202%204%201%204-1l2-2%201%202v2h3c1-3%200-5-3-5-2%200-3-1-3-3l1-2%201%201%201%201%201-1%202-2c2-1%202-20-1-20l-2-2-2-1-2-1%204-7%202%202%202%202v-5c0-5-3-8-10-10s-10-1-14%206c-7%2010-12%2010-24-2-5-5-6-6-6-9-1-5-2-6-8-3l-5%201h-1a310%20310%200%200%201-145-12c-1%201-3%200-5-1l-4-1a141%20141%200%200%201-46-26c-9-10-10-11-10-9m90%206c-4%202-4%204-1%205l5%204%203%203%201%203c1%203%203%204%204%201l1-3v-3l-1-2-2-6c-2-5-4-5-10-2m84%2055-4%202c-5%200-8%202-7%202l13%201c0-2%202-1%203%202l1%202c2%200-1%203-4%203-2%201-2%201-1%202%203%202%201%204-3%204-3%200-4%201-5%202-1%202%200%203%205%202l2%201-4%201c-4%200-3%200%202%201l8%201c1%201-6%205-9%205-4%200-5%201-2%203%204%201%2013%202%2015%201l11-3%205-1%206-2%2010-5-1-2c-2-2-8-3-9-1-1%203-8%204-13%203l-10-1c-5%200-6%200-4-1l3-1%206-1%2013-3c7-1%2012-3%2012-5s-2-1-5%201l-8%202c-5%201-5%201-8-9-1-6-1-6-12-6h-6M64%20248l-1%203-1%204-1%202c-1%200-2%201-1%202l-1%201h-2l2%201a408%20408%200%200%200%208%201c1%201%203-1%206-8%202-6%201-7-5-8-5%200-5%200-4%202m315%208c0%203%201%206%203%206l1-3%201-2%201%202c1%204%203%204%204%201%201-2%201-2%202%201v4c0%202%201%202%204%202l5-1-1-1h-3c-2-1-3-2-2-3%201-2%201-2%203%200%201%202%202%202%202%201h1l1-1-1-4c0-1-1-2-6-1l-5-1-2-1h-5c-2-1-2-1-3%201\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"6a3c9c37-b75e-54e4-bf5b-b1912848bc61","title":"chakli","cookTime":4,"prepTime":4,"content":{"tags":["snacks","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=46&h=69&q=50&fm=webp 46w,\\nhttps://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=92&h=138&q=50&fm=webp 92w,\\nhttps://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=183&h=275&q=50&fm=webp 183w","sizes":"(min-width: 183px) 183px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=183&h=275&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=46&h=69&fl=progressive&q=50&fm=jpg 46w,\\nhttps://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=92&h=138&fl=progressive&q=50&fm=jpg 92w,\\nhttps://images.ctfassets.net/qucxnkqed615/1nT8f5cJoVXyjEGte5liEH/1b0fd32e79ec12602498e39e19d8a992/images__1_.jfif?w=183&h=275&fl=progressive&q=50&fm=jpg 183w","sizes":"(min-width: 183px) 183px, 100vw"}},"layout":"constrained","width":183,"height":275,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'601\'%20viewBox=\'0%200%20400%20601\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'m157%20163-7%202a122%20122%200%200%200-42%208%2091%2091%200%200%200-26%2013l-6%204-4%203-3%203a96%2096%200%200%200-23%2034l-3%2010v17l1%2028%202%2021c2%206-1%209-3%203-1-3-1-3-2-2v13l1%207c2%2011%202%2013%204%2017l2%206%202%202c2%200%203%201%204%204s1%204%202%203h1l2%201%202%202%2013%2014c1%200%206%205%206%207l10%209c1%200%204%202%206%205l7%204%203%202c1%202%201%202%202%201%202-1%202-1%203%203l3%205c2%202%203%209%204%2019%200%2022%203%2037%207%2037l2%202c1%203%208%2011%2011%2011l2%202%203%201%205%201c3%203%209%204%2011%203h1c0%203%2021%205%2031%203l17-5%202-1c2%200%208%206%207%207l2%202c2%200%205%206%205%2011l5%2014%204%203c2%202%203%204%200%205v1l4%202%204%202%202%202%201%202%201%201c0%202%207%206%208%204l2-1v4l1%201c0%202%203%203%207%203l3%202c1%202%201%202%203%201%201-1%202-1%204%201%203%202%207%203%207%201%200-1%207-1%209%201l4-1%207-2%2011-1%209-2%205-2%209-3%205-2%202-1c2%200%203-1%203-4s1-4%203-1h3l2-2c2%200%208-7%207-8-2%200-1-2%201-2l2-1-2-3c-2-1-3-5-1-5l3%202%203%201c2%200%201-3-1-5l-2-3c0-1%202-2%203-1l2%201v-12l-1-2h2c1%201%201%200%201-3l-1-7-2-2c-2%200-4-2-2-4h3c1-1%200-5-1-5l-1%201v1l-1-1c0-2-1-2-2-2-2%200-3-2-1-2l1-4%202-3%201-2c0-2-3-4-4-4-2%201-3%200-4-3%200-2-5-9-7-9-1-1-2-2-2-6%200-8-1-18-3-20h-1l-1%203c-2%201-3-1-2-3v-6l-1-3-3-4-2-2c-3%200-3-2-2-3s1-1-2-1c-2%200-3%200-2%201%200%202%200%202-3%201l-2-2c2-2%201-4-5-6l-6-4c0-2-1-2-3-2h-3l-4-1c-4%201-6-1-2-3v-1l-3%201c-1%201-2%201-3-1-1-1-2-2-3-1h-4c-2%200-3%201-3%202-1%202-2%202-9%202-6%200-8-1-8-2l-2-1c-2%200-2%200-2-2s0-2%202-2c3%200%203%200%202-2s-3-2-5-2c-4%200-7-2-7-4%201-2%200-4-3-3h-5c1-3%200-4-4-3-3%200-3%201-2%202%200%202%200%202-2%201l-5-3c-3-1-3-3-1-6s3-5%201-7c-1-1-2-2-1-3%201-3%200-7-3-8l-3-2%201-2%201-1c0%201%206%204%208%203%202%200%203-4%202-6l2-1c2%201%202%200%202-1l1-2c1%201%202%200%202-1l2-3%202-4%204-5c1-2%201-2-1-3-2-2-2-2%200-3l2-1%201-2v-2c2%200%204-4%204-6-2-2-4-1-5%202%200%202-1%203-2%202-2%200-4%202-4%205l-2%202-3%203-4%205-3%202-5%201h-3v5l-1%207-1-3c0-9-1-12-2-7-1%202-1%202-2%201-3-2-2-5%200-5l1-2c0-6-1-8-3-8l-1-1c0-3-9-12-11-12l-4-4-4-5c-2%200-3-2-3-3l-1-2-1%203c1%203%200%204-3%202h-8c-2%200-2%200%200-2l4-1%202-2-2-1c-3%201-8-1-8-2l5-2%202-1c1-2%204-1%204%201-1%201%200%202%201%202%201%201%201%200%201-4s-1-5-2-3c-1%201-1%201-1-1l2-2c3-1%204%200%205%206l2%205%204%203%204%204%206%206c5%205%208%207%2011%205h1l2%201c3%200%203%200%202%202-1%204%202%206%203%202v-4c-2-1-1-2%204-3%204-1%205-6%201-6v-1c0-2%203-2%204%200s5-5%204-8c0-2%200-2%203-2l4-1-2-1c-3%201-3-3%201-4%203-1%205-6%205-10%200-2%200-3%202-3s3-5%203-20c0-19-4-29-20-46-8-9-10-9-9-2l2%208c2%205%203%2018%201%2018l-3-3-2-4-2-4c0-3%200-3-2-3-1%201-3%200-4-1l-4-2-1-2v-3l-5-5c0-1-7-6-9-6l-2-2-5-2-3-1-3-1-3-2c-2-2-2-2%200-2l4-1%203-2c3%200%204-1%203-3-3-3-13%201-13%205%200%201-5%202-5%200l-2-1v2c1%201%201%201-2%202l-4%202c-2%201-3%201-4-2l-2-2c-1%200-2%203-1%204%202%202%201%205-1%206l-3%203-2%202c-2%200-2%200-1%201s1%201-1%203c-2%201-2%202-1%204l1%205v6c-2%202-3%201-3-3-1-7-3-10-5-10-1%200-2%200-1-1l2-2%201-2%201-3v2c0%202%200%202%203%202h2l-2-2c-2-2-2-2%200-5l1-2%202%202%201%203v-3l1-2v-1l-3-2s3-6%205-7c1-2%201-2-1-2-2%201-3%200-3-1%200-2-3-3-4-2l-1-1%203-1c3%200%203%200%203-2%200-3-1-4-3-2m11%2030c-5%206-7%2013-4%2021l-1%202c-2%200-2%201%200%205%202%203%203%205%200%207-1%201-2%202-1%203%202%202%201%206-1%205l-2%202h1c1%200%208%206%207%208l1%201%208%208%202%201%201%203%202%206%201-5c0-5%200-6-2-7-5-3-8-7-7-9l-1-2c-2%200-6-7-6-9l2-4c2-2%205-1%205%201-1%202%202%2010%207%2016l2%204%202%201%203%203c0%203%202%203%202%200l-2-3-2-2-2-4-3-4-2-6-3-6c0-3-2-7-2-4h-1l-1-1-1-2-2-5-1-6c-2-3-2-6%201-11l2-5%202-2%201-2c0-3-1-2-5%202m18%2022v4c2%201%202%204%200%204l-2-3c-2-4-3-1-2%204%202%204%202%204%202%202%201-2%201-2%201%201l1%203%201-1c0-2%202-1%204%202%202%202%202%203%202%206-1%204-1%204%201%204s2-7%200-12c-4-6-4-7-4-10%200-7-3-10-4-4m31%2018-1%202c3%201%202%206%200%206h-4c-2%204-2%206-1%206l-1%201h-2c0-1-1-2-3-2-3-1-4-1-2%201v5l3%202c2%202%206%203%208%201l3-2c2%200%202-2%200-4-2-1-2-2-1-2h2c2%200%202-1%201-3l1-3c2-2%202-2%200-5-1-3-2-4-3-3m13%209v3c0%202-1%205-3%205l-1%202c0%202-1%204-3%205s-3%203-2%204c0%202%200%202-4%202-4-1-5%200-3%203h4c2-2%202-2%204%200%202%203%204%203%204-1l2-3c1-1%202-2%201-3l1-3c2%200%202-1%202-4l1-4v-5c1-2%200-3-1-3l-2%202m9%2017%201%201c2%200%201%202-1%205-2%201-3%202-5%201-2%200-2%200-2%203s0%204-2%204-4%203-3%205c1%201%206-1%2010-4%203-3%207-9%205-9l2-3c3-3%203-3-2-4l-3%201m3%20140v1l-2%205-3%205-2%203-1%205-3%206c-2%202-3%203-2%205v3c-1%202%202%207%204%207v-10l1-3%201-4%201-6a3187%203187%200%200%200%208-18l-2%201m17%200v3l-2%204-1-3c1-2%200-3-1-3l-1%205c0%204-1%204-3%204s-3%201-3%205l1%204h2l-2%202c-2%200-2%201-1%205%202%204%203%204%203-1l1-4c2-1%202-2%201-3-2-3-1-5%202-5l3-2c0-2%201-2%202-1l2-1%203-2c6-3%207-6%202-7h-8m31%205c-2%202%200%203%205%203l8%202%204%202c4%200%208%206%206%208-1%201%200%202%201%204%203%205%203%206%200%206s-4%201-4%202c-1%201%200%202%201%202l8%204%202%201c3%200%202-2-1-4-4-2-4-6%200-5l3-1c0-2-4-10-6-11-1%200-2-1-2-3%200-3-1-3-3-4l-5-2c-2-3-11-5-11-3h-2c-1-2-2-2-4-1m27%202%208%209c2%201%203%202%202%204%200%203%201%204%205%205%202%201%202%200%202-2s0-2-2%200c-1%201-1%201-1-2%201-4-1-10-3-10l-4-2c-2-2-7-4-7-2m-45%20103%202%204%201%202c0%202%202%203%203%201%200-2%202-1%202%201l1%201c1%200%202%201%202%203l3%202c3%200%203-7%200-8-2%200-4-1-5-3l-6-4-3-2v3\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"855ab6fa-acb7-5824-a90d-9fe758dfb3fa","title":"idly","cookTime":3,"prepTime":6,"content":{"tags":["idly","wada","sambar","breakfast"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=65&h=49&q=50&fm=webp 65w,\\nhttps://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=130&h=97&q=50&fm=webp 130w,\\nhttps://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=259&h=194&q=50&fm=webp 259w","sizes":"(min-width: 259px) 259px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=259&h=194&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=65&h=49&fl=progressive&q=50&fm=jpg 65w,\\nhttps://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=130&h=97&fl=progressive&q=50&fm=jpg 130w,\\nhttps://images.ctfassets.net/qucxnkqed615/gxvfDNcrwLJLHnOrD6rYZ/7730e7026b449d3219caa7294231301d/download.jfif?w=259&h=194&fl=progressive&q=50&fm=jpg 259w","sizes":"(min-width: 259px) 259px, 100vw"}},"layout":"constrained","width":259,"height":194,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'300\'%20viewBox=\'0%200%20400%20300\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'m0%2029%201%2029%207-6%204-5%204-5%201-2%201-3c1-5%204-7%207-6l10-3c9-5%2016-5%2040-1a459%20459%200%200%200%2055%207l19%203%2018%203c10%201%2023%205%2029%207l25%209c9%203%2011%204%2015%208%202%203%202%204-2%204l-4%202-4%202c-1%200-2%200-1%201%202%200%200%202-2%202s-2%200-1%202c2%202%203%201%207-2%206-6%2010-5%2012%204%201%203%201%203-2%203s-3%200-2%202l4%201%202%201c0%202%206%207%208%207l3%202c1%202%204%203%204%202l-5-15-2%201-4%201c-1-1-1-2%202-3%204-2%204-2%204-8%200-8%201-10%2011-15%2011-6%2022-7%2048-7%2041%200%2074%2010%2078%2023a78%2078%200%200%201-10%2029l-4%205-4%204-1-2c0-3-3-5-3-3h-1l-2-2-3-1-3-2c0-1-2-2-6-2-7-2-8-3-3-4%202-1%202-1-2-1-6%200-13%201-12%202%200%201-8%202-12%201l-2%202c-1%202-6%203-10%203l-2%202c-2%202-3%202-14%202l-12-1%206%204%2011%209c6%205%206%206%205%209-3%206-17%208-30%203-2-1-2-1-2%205%201%208%202%2010%208%2011%204%200%204%200%208-5l4-5%2012-1c13%200%2016%201%2018%208%201%205%200%208-6%2011a734%20734%200%200%200-20%209%20396%20396%200%200%201-42%2013h-2l-2%203-2%201-12%2013c-3%203-9%204-9%202l-3-1c-7%201-11%200-12-2%200-2-1-2-10%201l-8%202h-3l2-2%2011-4c10-4%2012-8%205-11v-2c2-1-3-3-5-1l-36-1c-8%200-10-2-10-6s-2-2-4%205c-2%208-7%2018-9%2020s-5%202-9%201l-3-1-2-1h-3c0%201-1%201-2-1l-4-1h-2l-6-2-6-3-3-2c-2%200-5-3-5-5l-3-1-3-1c0-3%200-4-3-4l-2-2-1-2c-2-1-5-17-4-19l2-7a962%20962%200%200%201%200-7l-5%2014-2%207c-2%208-3%2010-9%2015l-9%209-4%205-4%203-5%202c-2%200-2%200%200%202%204%204%204%204%200%203l-4%201%206%201%2010%201%2020%201%2014%201h2a581%20581%200%200%201%2063%200c-6%200-11%200-15%202-5%202-6%202-5%200l-3-1-7%201-7%202c-2%201-4%201-8-1-7-1-8-1-10%201s-3%202-5%202l-8-1c-4%200-5%200-6-2%200-3-6-3-6%200h-6c-1%201-12%203-13%202l1-1c3-1%201-2-2-1-5%201-10%200-11-1H37c-4%201-7%202-8%201l-3-1c-4%200-6%200-8-4s-2-4-9-4l-7-1c-2-1-2%202-2%2052v54h401V0H0v29m296%2036-6%201-12%201c-4%202-6%202-6%201-2-3-11%204-10%208%201%202%2016%208%2022%208l3%201c1%202%2029%206%2046%206h9l-7-1c-6%200-7-1-3-1h11c11%201%2031-3%2035-7%201-1-1-3-3-3l-2-1c0-1-1-2-2-1l-6-2-6-2-5-1c-2-2-9-3-18-4l-10-3h-30m36%206-4%201-1%201-2%201c0%202%206%201%207%200l2-2c2%200%203%201%200%202-2%202-1%205%202%204%202%200%202%200%201%201l-5%201h-4l-4%201c-4%200-4%200-3-1%202-3-1-3-5-1l-4%202c0%203%2025%204%2032%202%204-2%204-2%203-5s-3-4-3-2l-2%201v-1c1-1%201-2-1-4l-3-2-6%201M18%20126c-11%202-12%202-12%205%200%202%201%202%204%204%209%203%208%204%2014-4l5-7-11%202M1%20147l1%2015c1%200%204-9%203-10l2-1%202-1-1-2-3-2c-1-2%200-3%203%200%202%201%205%201%205-1l-6-7-6-6v15m325%2037-11%202c-29%207-37%2025-20%2044l5%206h2l1%201%202%202c2%200%202%200%200%201l-1%201h3l2-1v3c-1%200%200%202%202%203%204%202%204%202%205%201%201-2%202-2%206%200l2%201-2%201c0%201%205%202%206%201l6%202%207%202%206%201h2l6-1%204-1h4l6-1%206-2%205-1a4154%204154%200%200%201%2019-7l1%2028a1336%201336%200%200%200%200-73v5l-3-2c-8-5-20-11-28-12-14-4-32-5-43-4m5%209-5%203c0%202-2%203-3%203v1l2%201c-1%202%201%204%203%203%202%200%202-1%201-2%200-2%200-2%203%201l5%204c2%203%205%202%206%200%201-5%203-4%2012%200%209%205%2010%205%209%202-1-6-7-12-10-10-3%201-3%201-3-2%200-2%200-3-4-3-11-2-13-2-16-1m6%2024-2%202c-2%201-2%201%200%202%202%200%203%201%203%202l2%201c3%200%203%202%202%204-2%202%203%205%207%204l4-1c3-1%204-5%202-8-2-2-3-2-4%201h-3l-4-1c-2-1-2-1-1-3%202-3-4-6-6-3\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"3e88a906-a225-5947-8063-dca64c8bad45","title":"jilebi","cookTime":3,"prepTime":5,"content":{"tags":["lunch","dinner","dessert","sweet","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=143&h=213&q=50&fm=webp 143w,\\nhttps://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=286&h=426&q=50&fm=webp 286w,\\nhttps://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=571&h=850&q=50&fm=webp 571w","sizes":"(min-width: 571px) 571px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=571&h=850&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=143&h=213&fl=progressive&q=50&fm=jpg 143w,\\nhttps://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=286&h=426&fl=progressive&q=50&fm=jpg 286w,\\nhttps://images.ctfassets.net/qucxnkqed615/66KUq1eey5vuixKKyQoAWg/35b29cda97b7d3ef7531553458b7d833/c38d84fc0466bfb5e861e3afbc0f5a99.jpg?w=571&h=850&fl=progressive&q=50&fm=jpg 571w","sizes":"(min-width: 571px) 571px, 100vw"}},"layout":"constrained","width":571,"height":850,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'595\'%20viewBox=\'0%200%20400%20595\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M0%2047a266%20266%200%200%200%201%2051v16l24%203a121%20121%200%200%201%2055%2011h3l3%202%207%202c2%202%205%202%207%202h4c0%202%202%203%205%203l3%202c0%201%202%203%204%203l6%204%209%202c5%200%206%200%208-3l3-5-14-1c-12-1-16-1-15-3l-1-2c-2-1-3-6-2-6%202%200%202-2%202-9-1-9%200-11%204-15%203-3%208-4%2010-2%201%202%205%203%209%202l10%201c6%202%205%201%205%205s2%209%204%209v2h2l2-3c1-2%204%201%204%204%200%204%202%205%206%205h13l8-2%2014-2c13-3%2029-2%2033%202l9%203%208%204%202%201c2%200%208%204%2015%209%205%204%207%204%2018%202%2019-5%2033-11%2048-20%2012-7%2023%201%2025%2022%202%2014%205%2029%208%2034%202%205%204%206%204%201l2-3%201-2c0-4%207-4%208-1l2%204%202%203c0%202%200%202%202%201l6-1h4v-19l-6-4c-5-2-7-4-7-5%200-2%200-2%203-1l6%201%204%201v-28l1-78V0h-16v12c0%2011%200%2012-2%2013-3%202-13%202-101%202a7171%207171%200%200%200-128%203c-5-1-10%200-10%201l-6%201c-5%200-5%200-3-2s2-2-3-2l-59-1c-45%200-53%200-55-2-2-1-2-2-2-13V0H0v47M18%202c0%201%201%202%203%202%201%201%201%201-1%201s-2%200-2%208%203%2014%205%2011h20l3-1h-3c-5%200-1-6%204-6%206%200%209%201%209%204v3h12l20%201h8v-5c0-4%200-4-2-2-1%203-3%203-3%200l2-2c2%200%201-2-2-3-4-1-4-5-1-6%202%200%202%200%200-1l-6-1c-4%200-4%200%202-1%205-1%205-1%201-1-8%200-8-1%201-2L57%200C21%200%2018%200%2018%202m332-1h31l-1%207c0%209-1%2010-1%203l-1-5c-2%200-2%201-2%205v5h-7l-9%201c-1-1-5%200-5%201l2%202c6%201%201%202-10%202l-11%201%2034%202c13%200%2013%200%2013-14V0h-63l30%201m-38%2012-8%201-9%201v1l1%202-1%201-2-1c0-2-2-2-9-2s-9%200-9%202l-2%201-1-1c0-2-1-2-4-2-6%200-5%203%202%203%202%200%202%200-1%201h-9l-4-1h-2l-1%202-3%202c-2%202-2%202%2018%202l36-1h16v-4c0-4%200-4-3-4l-4-2-1-1m54%2032-7%204c-4%201-6%204-6%209%201%203%205%2010%207%2010l6%204c6%204%209%205%2013%202l1-2%204-5c4-3%205-5%205-8%200-5-3-11-9-14-6-4-9-4-14%200m18%20143-2%201c-2-1-4%201-4%204l-1%204v6c2%205%202%206%200%206v11l8%2028a421%20421%200%200%201%2015%2046v-99l-2%201c-5%201-8-1-10-5-1-4-4-5-4-3m-154%2013-3%202-3%201-1%201-3%202c-2%201-2%202%200%204s2%202%2015%202l13-1v-4l-3-2c-4-4-15-8-15-5m100%20158-2%201-3%2010c0%204%202%208%207%2014l4%205%202-3c3-3%207-12%208-17%200-4-6-12-8-10l-2-1c0-2-4-1-6%201m-89%2050c2%206%203%2011%202%2017%200%205-3%2012-4%2012l-4%204-6%203-1%201c0%202-1%201-6-8l-5-7%202%207%203%2010-1%203-1-3c-1-2-1-1-1%202l-1%202-1-1-1-1-8-2-11-2c-3%200-5-2-6-4-3-3-3-3-4%201s0%205%209%206l8%203%204%203c2%201%203%202%204%205l3%206c1%202%201%204-1%203l-2-3-1-2-1-1-1-3-1%202c1%202%200%203-1%203l-2%202v2l-3%202-8%203c-5%203-5%203-4%205%202%202%2011%201%2013-2l4-1%203-1%203-1%204-3c1-2%202-3%204-3%203%200%209-3%2011-5%201-2%208-7%2011-8l3-3c0-2%204-4%206-3h2l-1-1c-3%200-3-4-1-11%202-8%200-18-5-23l-2-3c-1-3-6-5-4-2m47%208a286%20286%200%200%201-4%2042c2%205%201%206-1%209-2%202-3%204-3%208%200%203%200%204-2%204l-2%202-3%204-2%202-2-3-4-3-2-2a144%20144%200%200%200%200-10c-2%208-3%2010-5%2012-3%201-4%204-4%206%201%202%201%203-2%203l-2-2c0-5-8-16-11-15-1%201-1%204%201%204l2%201%203%204v8c-1%200-5-4-5-6-1-1-1-1-1%201l2%204a1095%201095%200%200%201%205%209l1%204%201%2011c-2-3-8-1-8%202%200%202%202%203%202%201l5-1c5%201%205%202%208%206%204%207%205%205%202-3-2-4%200-6%204-7l3-1%201-1c6%200%2024-13%2024-18l4-3c4-3%206-8%204-11l-1-3v-3l1-4v-2c-1-1-1-2%201-3l1-5c-1-5%200-16%202-16%201%200%201-4-2-9l-2-6c-1-3-1-3-2-2s-1%201-2-1c-1-5-2-8-4-9-1-2-1-2-1%202m61%2040c-2%201-3%204-2%207%203%206-5%2023-14%2033l-2%205c-1%203-2%205-6%207a119%20119%200%200%200-11%2010c-10%207-20%2018-19%2018h2l4-1%202-1c-1-1%200-2%202-2l5-4%204-2%205-4%207-6%208-6%205-4%2011-11%202-3v-3l1-3c1-3%202-13%200-17v-3c3-1%201-4-3-3-1%200-1-1%201-3%202-4%201-6-2-4m-91%2032-3%203c-2%202-3%205%200%204h1l4%201%204%201h4c2-1%202-1%200-2-2%200-2-1-2-5v-4h-4c-3%200-4%200-4%202m-130%2012c1%203%207%207%2012%208%204%200%205%201%203%202-1%201%200%201%202%201l6%201h3l-7-5-4-3-4-1-3-1-8-4v2m61%2016-3%202c0%202%2017%205%2024%204%205-1%205-3%201-3l-3-1c0-1-7-3-12-3-2-1-5%200-7%201m208%2065-25%206-27%204-17%203h72v-6c0-6-1-9-3-7m-340%207v4l-1%202h15c22%200%2018-3-10-7l-4%201\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"2b1a2114-3a47-5b30-9725-3f1d8365ba2a","title":"kesari bath","cookTime":2,"prepTime":1,"content":{"tags":["lunch","breakfast","dinner","dessert","sweet","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=167&h=171&q=50&fm=webp 167w,\\nhttps://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=335&h=343&q=50&fm=webp 335w,\\nhttps://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=669&h=684&q=50&fm=webp 669w","sizes":"(min-width: 669px) 669px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=669&h=684&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=167&h=171&fl=progressive&q=50&fm=jpg 167w,\\nhttps://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=335&h=343&fl=progressive&q=50&fm=jpg 335w,\\nhttps://images.ctfassets.net/qucxnkqed615/ApNGmSlWcdKQ5HEI2pNUC/1aa5095eff0e0197303255dd3b939577/Pineapple_Kesari_Bhath.jpg?w=669&h=684&fl=progressive&q=50&fm=jpg 669w","sizes":"(min-width: 669px) 669px, 100vw"}},"layout":"constrained","width":669,"height":684,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'409\'%20viewBox=\'0%200%20400%20409\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M11%207a209%20209%200%200%201-3%2024%20280%20280%200%200%201-3%2022L3%2076c-3%2015-3%2019-3%2067a294%20294%200%200%200%201%2053l-1%2026v26l3%201h3v-1l-1-2v-2l1%201%202%201%202%201-1%201-1%202%202%202%202%201c0%201-3%202-4%201H6c0%203%201%206%202%204%200-1%201-1%203%201h-1c-2%200-2%200-1%202l-1%201-2%201c-2%202-2%202%200%202h3l-2%201-2%201-2%203v1l2%202%202%201v2l-3%201-2%202-2%204c0%202%200%202%201%201l2%201-1%202c-1-1-2%201-1%203%202%204%204%202%203-3%200-3%200-4%201-3l1%205%201%203h1l1-1v-3l-2-6c-1-5-1-5%201-5s3%200%203-2l1-2c2%200%202%202%200%205-2%204%200%207%203%204%200-2%201-2%201-1l2%201%201%201-2%201v1h3c2%200%202%200%201%201l-4%202h-4l-2%202h1c2%200%202%200%201%202v6c-3%200-2%202%201%203%203%200%202%202-1%202l-4-2H8l-1%201H5c-1%202%201%205%203%204%201-1%202%200%202%202l4%204%203%205%201%201c1-1-2-7-4-9l-2-3%202%201%203%202c2%200%203-3%201-4-1-2-2-3%200-2l1-2%201%201c1%205%203%205%203%200v-5c0-2%200-3%203-3%203-1%204-1%201%201-1%202-1%202%204%202%202%200%203%201%203%203l1%202%201-3c-1-3%200-4%202-1%202%201%202%201%200%203v3c1%202%200%209-1%2010-2%201-2%201-1%203%202%201-1%204-3%203l-1-5%201-2c0-2-4%201-5%204s3%208%204%206l4%201c3%203%206%204%206%202l-2-2c-3-1-4-3-2-3l3-2c1-2%202-3%203-2%201%200%203-3%201-4-1-2%200-8%201-9l1%202v2l1-1%202%201c3%202%203%202%205%200l4-1c3%200%204-1%202-2-1-1%200-1%201-1l2%201%202%201c2%200%203%200%204%203l1%204v-6l1%203%201%201c0-2%200-2%203%200%201%202%202%203%201%204l3%201h2l1%203v1c-4-2-8-2-9%201v6l2%203c1%202%203%202%203-1l5-1%201-1-1-1-1-1-2-3c-1-1-1-1%201-1l4%204%203%203-1-2c-1-2-1-4%201-4l1%202h1l3-1c2%200%202%200-2-4l-8-7-3-4-2%202-2%201%202-3c1-1%201-1-1-1h-2l-2%201%201-3c1-2%200-3-1-3l-1%201-1%203-1-2v-1h-1l2-2%201-1-1-1-1-1-3-4-3-4-4-7c-22-34-28-83-14-125l4-13-1-1%201-1%204-3%203-7v-3l-1-1-2-2c-3-1-3-1-5%201h-1c0-2-5-3-7-1v1c2-1%202%200%202%201%200%202%200%202-2%202-2-1-2%202-1%205v1l-1-1c0-3-3%204-3%208l-2%205-2%205c0%202%200%202%201%201h2l-2%202c-3%201-5%207-3%208%201%201%201%201-1%201l-2%202-1%203-1%203c1%201%200%203-1%205l-1%204-1%203-2%206-2%205-3%208-3%204-3%201c-1%202%202%209%204%209v1l-2%201c-1%202-4-4-3-6l-1-1c-1%201-1%200-1-2v-2c-1%201-1%201-1-1v-2l-1-1h3c1%200%202-2%202-6l1-5%202-5c1-4%201-5%202-3h2c0-1%201-2%202-1%202%200%202%200%201-1l1-5%202-6c1-5-1-3-3%202-1%204-2%205-3%205s-2-1-1-2v-3l2-2%201-1c-1-1%200-2%201-2l1-1-1-1c-1%200-2-1-1-2%200-3%200-3%202-1%201%201%201%201%201-1l1-2v-7l1-2c1-2%201-2%201%201%200%202%200%202%201%201l1-4v-5h2l1%202v-2l-1-5-1-4-2%202c-2%202-2%203-2%206%201%202%201%203-1%204l-2%202-2%206-2%203-2-2c0-2-2-3-3-3l-1-1v-3c2%200%202%200%202-2v-2l1-7%202-6c2-1%202-2%201-3-2-3-1-5%201-3%202%203%203%202%203-1s-1-4-2-3v-3l1-2-2%201c-3%203-5%201-3-4l1-4%204%203%204%204c2%200%202-2%201-4l-2-2-1-2h-3c-2%200-2-3%200-8%201-3%200-4-2-3v2l-1%202-1%203-3%208c-3%208-5%2011-5%207%200-2%200-2%201-1s1%201%201-1v-2l-1-1h1l1-2c-1-1%200-2%201-2l1-3%201-3%201-2c0-1%200-2-1-1l-1-1%201-1v-2c-1-1-1-1%201-1s3%200%203-5l2-7v-5l4%201v2c0%202%200%202%202%202h4l-1-1v-6c0-4%200-4-1-3-1%202-3%202-7%202s-5%200-4%202l-1%202c-2%200-2%202%200%204v3l-1%203c1%202-1%203-3%203-1%200-1-14%201-14v-4c-1-4%200-8%201-9v2l1%206c1%201%201%201%201-1%200-3%202-3%205-1%203%203%203%202%201-2-2-3-2-4-1-5h1l3%205h1l1%203%201-3c0-2%200-3-2-3v-2l-1-3c-2%200-2-1-1-1%201-2%200-3-2-3l-1%202-2%201c-2%200-2%200-1%201v1c-1%201-3%200-3-2l1-1c1%201%203-4%203-5l-2-1-2-2c-1-3%200-3%201-2l5-2v-4c-2-1-2-1%200-1l-1-2-3-2c0-1%204%200%206%202l3%202-2%204c-3%203-2%206%201%202%202-1%202-1%205%201%204%203%205%203%202-1-3-3-1-3%203%201l3%202c1-1-1-5-3-5l-1-2c1-1-3-1-4%201a403%20403%200%200%200%201-17c-1%205-3%207-4%207-2%200-1-2%201-3%201-1%201-1-1-3l-3-4h-3c-2%201-3-1-1-3v-1c-3-2%202-7%205-6l2-1-1-1c-3%200-6-13-2-14l1-2c0-2-1-2-6-2h-7v7m125-3a407%20407%200%200%200%2070%2028c2%202%209%204%2020%208%209%203%2013%204%2012%205l-7-2c-9-3-21-4-36-4-12%200-12%200-27%205l-34%2014c-5%202-17%2012-24%2018l-6%207v-9l-1-5c0-4%202-4%202%201%200%202%200%202%202-1%202-4%202-5%201-5l-2-1-3-1c-2-1-2-1-1%203l-1%205-1%206c-1%203-1%203%201%203%202-1%202%200%201%204l-3%203c-2%200-2%200-1%201s1%201-1%202l-2%202c1%201%205-1%205-2l2-1%202%201-7%205c-1%200-2%201-1%202h-1l-2%201c0%202-2%204-4%204l-3%204-2%202v-2c3-4%202-5-1-1l-4%205c0%204-5%2015-9%2023-21%2034-26%2075-15%20116%206%2020%206%2022%207%2019l1-3v2l2%203c2%200%205-4%205-5-1-1%201-2%205-2l4-1c1-2%206%200%208%202h1l1%201%202%202%205%203%204%202c2%200%206%203%206%205%200%201%201%202%204%201l4%201c0%201-3%202-5%201-3-1-1%203%202%204l3%203%202%203-6%202-9%203-4%202-3%201h1l1%202v2l5%201c6%202%2020%201%2025-1l6-3%207-2c2-1%202-1%208%202%205%203%2014%204%2014%202h2l1-1h2l1%203%201%201c2%200%204%203%204%205v5l-4%203-4%202%203%201%207%204-15%202c-6%200-11%201-11%202%200%202-3%204-5%203v-1c1-1%200-1-1-2l-7-4c-5-3-7-4-7-2%200%201-1%202-2%201l-1%201c1%201%200%201-2%201-9%200%202%206%2020%2012l7%202h2l8-2%209-1%204-1c3%201%205%201%206-1%204-2%2010%200%2012%203l4%203c1%200%2010%208%209%209%200%202%203%203%204%202l1%201v1c0-1%202%200%203%202%203%203%203%204%201%204-2%201-16-1-30-4l-18-4c-10%200-35-8-48-16l-9-4c-2%201-5%2012-5%2013v1l-2%206a104%20104%200%200%201-2%208h-2a454%20454%200%200%201-63-25L1%20320l-1%2045v44h42l2-3%205-8%206-7%206-4%207-2h17l7%201v2c-3-1-3%202%200%203l2%202-2%201-5%202c-2%200-2%200-1%201%202%202%202%202%200%203v1c1%200%201%201-2%204-3%204-2%206%202%202%202-2%202-2%203-1%202%203%203%202%202-1%200-3%202-6%207-6%203-1%203-1%203%202%200%204-1%206-2%205l-4%201c-1%202%2016%202%20152%202h154l-1-74a65150%2065150%200%200%201%200-310V0H128l8%204M90%2035c-4%209-8%2023-8%2028%200%203%200%204%201%203%200-4%201-4%205-3%203%202%205%202%204%200l1-2v-3h-3l-2-1c-3%200-2-4%201-14%202-6%202-12%201-8M69%2048c-3%209-4%2013-3%2016v2c-1%200-4%206-3%207v2l-1-2c-1-1-1%200-1%202%200%203%200%205-2%206l-1%202c2%201%201%206%200%205-1%200-2-1-1-2h-1l-1%206c0%204-1%206-2%206v5l-1-1c-1-2-1-1-1%202%201%205%202%208%202%204l2-2v2c-1%201%200%203%202%203v-3c2%200%202-8%200-8v-2l1-3c1-4%203-6%205-4%203%202%204%201%202-2l-2-6c1-4%203-8%203-5%200%201%201%202%202%201%201%200%202-1%201-2l1-2c2-2%201-3-1-3-1%200-2-1-1-2l1-2%201-2c-1-5%200-7%202-7l2-2h3c2%202%203%200%201-2l-2-3-1-2v-3c-1-1-2%200-2%201-2%202-3%201-2-3%202-8%200-5-2%203m156%206a1862%201862%200%200%200-12%203%20232%20232%200%200%201%2067%201l2%201a662%20662%200%200%200-71%200l-3%201h3c2%200%203%200%202%201l2%201c1-1%202%200%203%201s0%202-5%202h5a548%20548%200%200%201%2075-1l-8-5c-6-5-6-5-20-6s-17-1-40%201m26%2014-3%201-2%201-2%201h2l2%202c0%202-4%204-6%204l-10%201a504%20504%200%200%201-22%205c13-2%20101-2%20103%200%202%200%203%202%204%203l2%204%201%202-2%201-1%201-1-1c0-2-2-3-3-1h-1c-3-1-31-1-35%201l-5%202%205%201c46%201%2049%202%2049%203l-2%201-2%201-10%201c-11%200-16%201-15%202l-1%201c-1-1-2%201-3%204%200%202%201%203%202%203%202%200%201%202-1%203l-3%202-9%203-2%201c0%201-7%203-9%202l-1%201%204%201c5%200%2010%201%209%202l-3%201-5%201-2%201-2%201-3%201c-2%200-2%200-2%202v2l-1-1c0-2-8-1-10%201l-1%206c0%203-1%204-2%203l-2-2-1-1-7-5c-5-3-6-5-5-6l-1-2v-4c-1-3-1-3%201-3l1-1-1-1c-2%200-1-5%202-8%202-3%202-3%202-1h1c1-2-1-6-2-5l-1-1c2-2-4-1-7%201-2%203-3%206%200%209l1-1%201%206v8h-3l-9-2-7-2-2-1c1-2-7-3-8-2h-12c-16%200-30%204-44%2015l-10%2010-1%202c-1%201-5%207-4%208l-1%205a226%20226%200%200%200-8%2013c0-2-2-3-2-1l-1%201-1-1c0-2-9-3-15-1a87%2087%200%200%200-20%208l-2%202-2%202c-2%201-2%201%201%201%202%200%203%200%202%201l8%201%2023-5c8-2%208-2%208%2012%201%2012%203%2023%206%2028l2%206c0%203%200%203-1%202l-6-1c-3-1-6-2-3-2%202%200%200-1-2-2l-1%203c1%202%201%202-5-2-3-2-3-2-4%200-1%204-13%204-14%200v-2c3%200%203-3%201-5l-7-6-6-6-2-1c-1%200-2%200-1-2%200-2%200-2-1-1l-4%203c-2%200-2%201-1%203v5l2%203%202%203%202%204c2%202%202%202%201%204l-1%203c1%200%207%205%206%206l1%201%202%204v4l-2-1c-11-6-21-35-17-45%203-6%205-8%2012-7%207%200%2020%204%2026%208%206%203%208%203%203%200-13-9-33-13-39-8-10%208-2%2038%2014%2055%2010%2010%2019%2013%2032%2010%207-1%207-1%2017%208l8%206%201%201%208%2010%2023%2023%201-1v-1h1c2%201%203%204%201%203h-1l1%202%201-1h2a102%20102%200%200%201%2015%2019l2%204%204%203c5%203%209%207%207%207l-2-1-2-2c-1%202-6-2-11-10l-3-3c-1%202%207%2012%2011%2014l2%202%201%202%201-1v-1l1%203%202%202%202%202%201%201v1l1%201h1v1l2%204c3%209%208%2012%2019%2011%205%200%206-1%208-2%202-3%201-5-1-5l-2-1h2c2%200%203-2%202-6l1-1%201%203c0%202%201%202%203%202%203%200%2012-4%2019-7a13896%2013896%200%200%201%2035-20c0-1-1-2-2-1v-1l2-2%203-1v2c-3%202-1%203%202%200l5-4%2016-15a422%20422%200%200%200%2031-52l5-14%201-26c0-23-1-28-3-24-1%202-2%202-14%203-8%200-8%200-5-2l4-1%204-2h-9l-12%201h-1c-1-2-3-1-3%201l-1%201v1c1%201%201%201-1%201l-3%201-5%201c-6%200-17%203-14%203%202%201%202%201-1%201s-8%202-7%203h4l17-3%203-1%204-1h4l-3%202-8%202c-2%200-3%200-2%201l-3%201-7%203h-1l-7%205-8%206c-5%202-2%203%203%201l5-2a421%20421%200%200%200%2031-6c1%201-11%206-13%206-4%200-10%202-10%204l-1%201-4%203-5%202-4%202-4%202c-6%202%209%200%2017-3l13-2c3%200%203%200-1%201l-4%202-6%203c-4%201-7%203-7%204%200%200-1%202-3%202l-3%203-6%204c-10%204-4%204%2019-2%2036-8%2054-12%2054-10l-5%201-9%204-1%201-7%201-9%201-10%203-12%203c-7%202-11%204-11%205l-3%201-3%201-6%202c-3%200-4%201-4%202%201%201-6%205-9%205v1h4l3-1c1%201-3%208-5%209v2h-1l-3-1-3%201-5%203c-7%203-7%205%200%203l7-1v1l-2%202-1%201-5%201-5%202-3%202c-1%202-3%203-5%203l-4%202-3%202-2%201-6%201c-5%201-9%203-10%205l-5%201-6%201c-3%201-3%201%201%202l4%201-6%201-5%202c1%202-5%202-8%200-8-6-12-9-11-10l1-1%203-2%205-3c0-2-2-1-8%202-5%202-7%203-5%201v-1c-1%201-2%200-2-1%201-1%201-1%200%200l-4-2-41-40-4-5%202-6%201-8v-3l2%203c2%204%2012%2013%2015%2013l5%202%204%203%205%202%2013%201c7%200%2011%201%2013%202h14l9-2%2011-2%206-2%201-1%202-1c4%200%2010-2%2010-4l4-3%203-4%201-1%202-2%203-3%201-3%202-4%201-2%202-3%204-9c3-6%203-7%203-18%200-16-2-23-11-39-1-3%200-4%201-2l3%202%201%202%202%201%202%201c0%202%204%201%207-1%202-1%202-2%202-5v-3l1%202c1%205%2043%204%2047-1l3-2c2%201%202%200%202-5l3-16%203-10-2-6-4-8c-1-1-1-4%202-10%204-11%205-10-14-17l-18-8c-4-3-5-2-2%201%203%202%201%203-4%201l-17-2-5-1h-21m-41%2038-3%201c-3-1-10%202-11%204s0%202%202%203l5%202h12c9%201%2012%200%2011-4v-1l1-1-1-1-5-1c-4-3-10-3-11-2M82%20126c-2%201-3%202-4%201h-1v3c-2%202%200%2014%203%2019v3l-1%201h3l2-2%203-1%202-1c-1-1%206-4%209-4l2-1c0-1%201-2%203-2l4-2%202-1%206-2c3-2%204-3%203-5l1-3%201-1h-16l-15%202c-5%201-9%201-5-1%202%200%204-2%204-3h-6m-11%209c-18%2030-24%2065-17%2098%203%2011%204%2013%204%204%200-3%200-5-1-4l-1-1-1-3%202%201%203%204c0%203%202%202%202%200s0-2%201-1c0%202%208%205%209%203%200-1%201-1%202%201%204%203%202-1-2-5l-5-5c0-3-4-4-6-3h-5l-3-10c0-7%200-7%201-6l6%202c4%200%206-2%206-7l2-6v-5c3%200%203-2%200-2-3-1-9%200-8%201l-2%201c-2%200-3-5-1-6l1-3%201-5%205-12a180%20180%200%200%201%208-22v-1l2-11-3%203m215%2024c2%201%202%201-1%201-2%200-3%200-3%202l-1%204c-1%203%2014%203%2018%200%202-2%202-2%201-4l-4-2v-1l-6-1c-5%200-6%200-4%201M8%20164l-1%203c-2%203-2%203%200%204%201%201%201%201-1%201l-3-1H2l2%202v2l1%202v3l-2-2c-1-2-1-2-1%201l1%203c2%200%202%208%201%2011v1c1%201%202%200%202-2l2-4v-2c-2%200-2-1-1-4h1l2%201-1-2c-1-1-1-1%201-1v-1l-2-2%202-1%201-2%201-3c3-2%202-3%200-3h-1v-1c-2%201-2%201-1-2l-1-2-1%201m177%2012v1h-1l-1%201c1%201%200%204-2%204-1-1-1-1%200%200l1%202h-4v1c3%200%202%203%200%203h-6c-5-1-5-1-2%202%202%202%203%202%207%202%205%200%206%200%205%202%200%202%201%203%203%201l3-1c3%201%204%200%207-5%205-8%206-9%203-7-2%202-3%201-4-2l-3-2%201-1h-1c-3%200-3%200-2-1s1-1-1-1l-3%201m173%2040a201%20201%200%200%200-18%205l-6%202h7l7-1h8c3%200%203%200%202%201s-1%201%201%201c5%201%206%200%206-1v-9l-7%202M85%20298l13%2012c1-1%201-2-1-3-1-2-1-2%201-2l2%202%202%201%201-1h14c0-1-4-2-13-2l-8-1-1-2-2-3c0-1-4-3-5-2l-1-1v-1l-4-3-7-6c-3%200-2%202%209%2012m-23%2010-3%201c-2%200-2%200-1%202%200%202%200%202-2%202-4-1-6%200-6%202h4l3%201%201%203c3%200%201%202-1%202-3-1-3%200%200%202%202%203%204%202%204%200l1-3c1-1%201-1-1-2v-2l1-2c-1-2-1-2%202-2l4-1c0-2-5-5-6-3m34%2016-3%201c-3%200-4%2013-1%2015%202%202%204%202%204%200l-1-1-3-2h2c2%200%203-2%200-3l-1-2%202%201h4c2-2%201-6-1-7l-1-1v-2l-1%201m22%2031c0%202%200%202-2%200-1-1-1-1-1%202%201%205%200%205-3%201-2-2-2-2-4%200l-4%202a874%20874%200%200%200%2058%2025l38%2017c8%204%208%204%2012-5%202-6%203-8%201-8l-1-2h-1c-2%201-2%201-2-1%200-1%200-2-1-1l-5%201-11-1c0-2-1-2-7-2l-3-1h-3l-2-1-1-1-3-2-5-2-8-2c-3-2-6-3-9-2l-4-2-3-2-4-2c-2-1-3-2-7-2-5%200-5%200-5-2l-1-2-2-2c-1-2-1-2-3-2h-2l-1-2c-1-1-1%200-1%201\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"de1389d1-3334-5dac-94c3-1c5bf9536c8d","title":"kheer","cookTime":1,"prepTime":2,"content":{"tags":["lunch","dinner","dessert","sweet ","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=175&h=99&q=50&fm=webp 175w,\\nhttps://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=350&h=197&q=50&fm=webp 350w,\\nhttps://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=700&h=394&q=50&fm=webp 700w","sizes":"(min-width: 700px) 700px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=700&h=394&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=175&h=99&fl=progressive&q=50&fm=jpg 175w,\\nhttps://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=350&h=197&fl=progressive&q=50&fm=jpg 350w,\\nhttps://images.ctfassets.net/qucxnkqed615/6zU8sWa2wru68uUkN5pZ3Q/138580be11eeb66d542be6208d31f498/istock-1169496252-1-1018382-1628615981-1109254-1652555785.jpg?w=700&h=394&fl=progressive&q=50&fm=jpg 700w","sizes":"(min-width: 700px) 700px, 100vw"}},"layout":"constrained","width":700,"height":394,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'225\'%20viewBox=\'0%200%20400%20225\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M39%203c-6%204-14%2013-16%2019l-4%205-1%205v4l-1%203-1%202-3%203h4c3%201%202%202%208-3%202-3%205-5%206-5%202%200%202%202%201%204-4%204%204%206%2012%202%205-3%2010-3%2010%200%200%206%2010%204%2011-1%201-4%200-5-4-4-3%202-8%203-8%201l3-3c3-2%203-3%203-5-1-4-4-4-4%200%201%202%200%203-1%201l-2-2-1%202c1%201%200%201-1%201l-2-1c1-4%200-5-4-5l-4%201h-8l-5%201-4%201-3%201h-1c0-2%2018-10%2019-8%201%201%2016%202%2019%201a375%20375%200%200%201%2037-7c-2%200-3%202%200%202%202%201%206-1%206-3v-1l11-13-34-1H43l-4%203m77%200c-6%206-9%2013-7%2015l5-2%204-2v3c1%206%203%206%2012%203h11l9-1c3-2%206-1%207%202s1%203%201%201l3-5c2-2%207-15%207-16l-25-1h-25l-2%203m61-1a424%20424%200%200%200-14%2028h2c1%201%202%202%204%201l2%201%205%202%203%202c0%201%200%202-2%201l-5%202-7%203-3%202h4c2-2%205%200%207%204%203%204%207%203%206-2-1-2%200-3%202-5l2-3c0-2%203-2%206-1%203%202%204%200%202-2l-3-5-4-6-2-4-1-3v-1l-1-1c-1-1-2-9-1-12%201-4%200-4-2-1m59%200%203%201h1l3%203c2%200%204%202%204%203l2%202%201%203c0%205%202%209%208%2013l6%204%203%203%205%201%205%203%202%201%201%201%205%201%2027%207-13-2a163%20163%200%200%200-131%2023l2-3c3-1%203-2%202-3v-3c1%200%201-1-1-1v-4c4-6%200-7-5-3l-3%204-3-2c-3-2-4-2-5%200-2%202-12%205-17%205l-5-2c-2-2-2-2-2%200l-2%201h-2c0%201-1%202-3%202-4%201-4%203-1%206%203%204%207%204%204%201l-1-3c1-1%204%201%204%202v1l4-4c0-4%209-1%2011%203%202%207-4%2011-12%208-3-1-4%201-5%206%200%205%207%207%2012%203%204-3%205-3%207-1s5%201%206-2c0-3%204-6%205-4%200%202%202%201%202-1l1-1%201-1%203-2c5-3%204-1-3%206-5%204-6%205-6%203l1-2-2%202c-2%203-3%205%200%203%202-2%201%200-2%206l-5%2013c-1%207-1%209%201%2018l1%204%201-8c1-8%203-12%205-12%203%200%203-2%201-4v-2l2-4c1-3%203-4%206-4%204-1%205-2%203-4-1-2%202-5%205-3l2-1h1l5-4c2-3%204-4%206-4l4-2%206-3c5%200%2016-4%2017-5l5-1%206-2%204-3%201-1%207%201c1%201%207%200%2011-2%203-1%2010-1%2018%201l15%201c8%201%2012%201%2020%204l11%202%201%201c0%202%209%201%2010%200%202-3%203-2%203%201s0%204%202%204l2%201c-1%201%201%203%204%204l6%201c0-2%203%200%206%205%202%204%205%206%205%204l2%201c5%206%208%2010%2010%2017l4%207v3l1%203%201%202v2c3%202%203-13%200-22-3-10-6-16-13-23l-6-7-2-1-2-1c-1-2-15-10-23-13l-10-5%209%202c7%203%2010%203%209%200%200-1%200-2%202-2v-9c0-4-1-5-3-5-3%200-3%200%202-7s9-17%2011-23V0h-54c-49%200-54%200-53%202M101%2028l-10%204c-5%200-9%202-9%204l-3%203c-6%202-8%2011-3%2011l5%205%203%202%204%204c1%202%203%204%205%204l5%204c2%203%208%206%208%203l-1-1c-3%200%200-8%203-8%202%200%208-8%206-8v-3l7-1c6%201%206%201%206-2-1-5-10-9-10-4%200%204-2%204-6%200-5-3-10-4-9-1v2c-2%202-1%203%202%203%204%200%206%201%207%205%200%202%200%203-2%203l-5%201c-5%200-7-1-7-4%201-1%201-1-1-1h-8l-1-3c0-2%204-6%206-6%201%201%202%200%204-1%203-4%206-5%2013-4h7l-1-4c0-3-1-4-3-4l-2-1-2-1-2-2c0-2%200-2-6%201M24%2055c-2%200-3%201-3%203s-1%202-3%202h-5c-4-1-4%2011%200%2014%202%202%202%202%202%200l2-5%202-4-1-1c1-1%2014%200%2017%202l6%203%205%202c1%201%203%202%207%201%205%200%206%201%207%202%202%202%202%202%204%201%202-3%203-6%202-7h-2c0-2%200-2-1-1h-9c-1-2%201-5%202-4l4-2c2-2%202-2%200-4l-3-1-1-1c0-3-5-1-6%202l-2%203v1c2%202%201%203-3%203l-4-2-2-2-5-2-4-2-3-1h-3m0%2014-5%204-3%203c-2%202-1%204%202%207%204%204%2012%204%2016%201%202-3%204-11%203-13-1-4-7-5-13-2m85%201c-1%201-2%203-1%206%200%204%202%206%204%204%201-1%201-1%2010%201%203%200%203%200%203-3s-1-3-3-3l-3-4c-1-3-2-3-5-3l-5%202m-41%209c-1%203-6%205-11%203-4-1-5%200-4%202l-1%202c-1%200-2%200-1-1%201-2-5-1-8%202-3%202-3%203-2%205%202%203%2015%205%2017%203l5-1c5%200%2010-1%2011-3h1l2%201%203%201c1%203%207%201%206-2l1-4%202-5c0-3%200-3-3-3-2%201-5%200-6-1-3-1-3-1-3%201s1%202%203%202c3%200%204%202%201%203l-2%201h-1c0-2-1-2-2-2-2%201-2%201-1-2%200-2-2-5-5-5l-2%203m256%203-2%202%202%203c4%203%2011%202%2014-1%205-5-9-9-14-4M92%2084v3c2%201%202%201%200%204-1%203%200%206%203%206l1%201c0%203%206%205%2010%204%205-2%206-3%206-5s1-2%206-2c10%201%2010%200%2010-4%200-7-5-9-13-7l-11%202c-7%200-7%200-8-2%200-2-4-3-4%200m161%204c-4%201-4%202-2%205%201%203%205%204%206%202l4-1c3%200%209-4%209-6s-12-2-17%200m119%205c4%2014%203%2027%200%2030l-1%202c1%203-19%2027-22%2027l-5%203c-29%2023-101%2031-141%2016l-22-10c-6-2-15-9-16-11l-2-1-2-2-4-4-3-4-2-3-2-3h-1c-2%203-6-9-7-17%200-6-1-7-2-7l-2-1-2-1%201%202v1h-9c-2%202-3%202-6%201h-3c-1%202-5%203-5%201l-13%201h-2c-1-1-8%200-8%201l-28-2-2-1h2v-1h-4c-1%202-4%202-3-1l-1-1-2%201c-1%201-9%200-14-3l-9-2-6-3-2-1-4-2c-3-2-7-1-5%202l1%203c-1%201%200%204%201%206%201%203%202%203%202%201l1%202c0%205%203%2011%204%2011h2l2%202%202%202c-1%201%200%201%201%201%202%200%203%200%203%202l1%202%204%203%205%202%204%201%201%201c1-1%203%202%202%203l1%201h6c2%201%203%201%202%202-3%200-2%202%200%201l2-1%201-1%202%201c-1%202%201%204%203%203h6c0%201%200%202%201%201l2%201%206%202%206%201a205%20205%200%200%200%2060-4c2-1%203%200%2011%2012l14%2017c8%207%209%209%207%2010l-1%202%202-1%202-2c2%200%201%203%200%204l-2%203c0%202%200%202%201%200s1-2%202%200l2%202v1l-2%201-1%202-2%202-1%202%201%201%201%202-1%201-1-1-1-1h-3v2l-1%201h2c2%200%202%200%201%202l-2%202-1%202%201%201h1l-6%203%201-2c2-2%203-4%201-4l-1%202c0%201-1%201-2-1l-1-3v6c0%202%200%202-2%202l-4%201-1-1c1-3%200-2-3%201-2%202-4%203-4%201l2-1c2%200%201-2-1-2v-4l-2%201-2%201-2%201c0%202-2%202-2%201l-1-2-2%202-1%201h-2v1c1%201%200%204-1%204l-1-2c1-1%200-2-1-2s-2%200-1%202l-5%201c-4%200-4%200-2%201l136%201h134v-4c0-4%200-5-2-5l-2-1-5-1-4-1-1-1-1%202c1%202-1%201-2-1l-4-2-3-2h12l4-1h-8c1-1%200-2-1-2h-10l4-1%204-1h-7l3-1c2%200%202-1-4-1-5-1-6-1-5-2l1-3h-1l-2%201v-2c2-1%201-2-2-2v3c-3%200-2-3%201-5h3l3%201h4l-3-1c-3%200-3-1-3-2%200-2-1-2-2-2-1%201-2%200-2-1l-3-1h-2l-2-1-1-1-1-4v-4l-2-1c-3%201-3-1%201-5l14-23%207-19c3-10%202-27-2-34-2-3-2-3-2-1m-185%204c-4%202-5%206-1%206l4%202h3l3%201v-1l1-3%203-2-2-2c-2-2-8-2-11-1m134%2010c-3%200-5%201-5%202-2%201%200%204%202%203l1%201h2l9-1c0%202%203-2%203-3%200-4-6-5-12-2m-41%203-4%202c-5%202-5%203-1%207s11%204%2011-1l1-3c1-1-3-6-5-6l-2%201m-113%2012c1%204%203%206%207%208%204%201%209%201%2011-1s1-6-2-6l-5-2c-4-1-4-1-6%201l-2%201-2-2c-1-2-1-2-1%201m151%2011-1%201-2%203c-1%204-5%208-7%208l3%205c1%201%208%201%2012-1l7-2c2%200%204%200%203-1l-3-2-4-2-2-1-2-6c-2-4-4-5-4-2m-294%201v3l-1-1-4%202c-4%202-9%203-15%203l-4-1v41l3%201%203%203h14c2%200%203-1%202-2l7-6c12-7%2014-13%207-21-3-5-3-5-4-3s-1%202-1-5c-1-5-5-16-7-16v2m184%2018-2%201h-10c-2%201%204%208%206%208l3%201c2%202%2012%204%2012%202-1-1%200-1%201-2l2%201c1%202%204%202%2013%202l4%202c1%201%205%202%206%201%201-3%200-5-1-4s-2%200-5-2c-2-1-3-2-4-1l-7%201c-5%200-5%200-6-3l-1-3c2-4-6-6-11-4m68%208c-2%202-13%205-18%205-7%200-5%203%203%209l3%202c2%203%2013-1%2016-7%202-3%201-8-1-8l-1-1h-2\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"7d3250da-568f-5ebc-9930-a2253f1ad004","title":"lemon rice","cookTime":1,"prepTime":1,"content":{"tags":["lunch","breakfast","dinner","rice","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=73&h=44&q=50&fm=webp 73w,\\nhttps://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=145&h=87&q=50&fm=webp 145w,\\nhttps://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=290&h=174&q=50&fm=webp 290w","sizes":"(min-width: 290px) 290px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=290&h=174&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=73&h=44&fl=progressive&q=50&fm=jpg 73w,\\nhttps://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=145&h=87&fl=progressive&q=50&fm=jpg 145w,\\nhttps://images.ctfassets.net/qucxnkqed615/4HATaDNMY2oLN2eJM1LI8d/0d966ebaab01137ae0a8c2836acee64c/images.jfif?w=290&h=174&fl=progressive&q=50&fm=jpg 290w","sizes":"(min-width: 290px) 290px, 100vw"}},"layout":"constrained","width":290,"height":174,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'240\'%20viewBox=\'0%200%20400%20240\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'m0%2014%201%2014v20L0%2068l1%2019%204-3%209-6%206-3c5-2%2015-1%2022%202l6%205c1%202%203%201%205-3l17-17c16-14%2066-38%2079-38%203%200%204-3%205-7v-4l7%201v2c-1%202-1%202-3%201s-2-1-2%202c-1%202%200%203%201%203l3-1%202-1c-1-2%203-4%206-2%204%202%204%202%2016%200l15-1%206-1h5l12%202c28%202%2061%2012%2078%2024%202%202%202%202%200%202-4-1-4%200%200%202l3%201c-1-3%201-2%206%202%2015%2011%2022%2021%2028%2034%2011%2026%203%2057-20%2080-7%206-8%208-6%208l2%201%205%203c5%202%206%204%208%209l-1%204c-2%200-5-4-4-5l1-4-1%201c-1%201-4%200-8-5l-5-4-8%206-9%208-20%2010-21%208a224%20224%200%200%201-109%2013l5-1h-6c-5%200-7%200-6-1s1-1-2-1h-4l3%202c2%201%202%201%200%200l-11-2c-10-1-13-2-12-3l9%202c9%201%2012%201%204-1-17-4-46-17-48-20h-2c0%202%2021%2013%2032%2017%203%201%205%202%203%202l-11-3c-8-4-10-4-8-2%202%201%2021%209%2025%209l10%202a246%20246%200%200%200%2083%202c-4%203-9%2015-9%2020v2h48l3-5%205-8c2-3%204-5%208-7%204-1%205-1%201%202-4%204-11%2011-13%2015l-2%203h73l73-1%204-3%204-2v-18c0-17%200-17-3-19l-1-3%201-6c0-9%200-11%202-12v-2l-1-2c1-1-5-8-6-7-2%200-1-3%200-3%202-1%200-3-3-3s-3%200-3-3%200-3%204-2l5%202%203%201c2%200%202-1%202-8%200-10%200-10-7-10-3%200-3%200-2-1%202-2%201-3-1-2l-6-2c-4-3-14-4-14-1h-1l-2%203-1%202v-9c-2-1-2-2-2-5v-4l-1%202-2%201c-1-1-2%200-2%201%201%202-6%207-7%205l-2-3-1-3c0-2%202-1%202%201%201%201%201%200%201-2l-1-5v-2c0-1%201-1%201%201h1l2-2%201-4v-5l2-7c1-6%203-10%208-15l1-3%202-2%202-3%2010-1a40%2040%200%200%200%2019-3l-1%209c0%206%200%208%201%207l1-29c0-32%200-30-9-31-4-1-6-2-6-4l2-1v-1l-1-4-1-4c-2-2-2-2-1-3l2-1c0-2-3-1-5%201h-3l2-3c5-2%202-8-3-6h-4a1991%201991%200%200%200-164%201c0-2-14-3-16-1h-34L80%200H0v14m199%206%2013%202a178%20178%200%200%201%2060%2011l9%203c5%201%203%200-4-3-15-7-27-10-53-12-16-2-19-2-25-1m-83%2018a220%20220%200%200%200-28%2014c-9%205-26%2020-33%2029-5%207-3%207%203%200%2015-17%2027-26%2053-39l8-5-3%201m162%203%205%203%2027%2019c7%206%2010%209%2010%207s-3-7-7-11c-8-7-11-9-19-13a24844%2024844%200%200%200-16-5m-28%203-10%202-32%207-16%205-14%203c-5%201-11%203-16%206-4%201-4%202-3%206l-1%205c-4%205-4%205-1%208%202%204%204%205%205%203l-1-2c-2-2-1-4%202-4s3%200%201-2c-2-3%200-4%204-3l7%201c3-1%204-1%206%201%204%204%2012%203%2018-2l5-2h2l4-1%205-2%207-4a99%2099%200%200%200%2012-5l8-4%2015-7c8-2%2014-5%2013-6-4-3-6-3-11-4l-9%201M147%2073l-3%204c0%201-3%203-6%203-2%200-6%204-6%206s5%201%207-1c1-2%2010-8%2011-8l3%201c2%203%203-1%201-5-1-3-3-3-7%200m80%205%201%202c2%201%200%204-2%204-1-1-2%200-2%201-1%201-2%202-6%202l-6%201c-2%202-2%201%200-3%201-2%201-2-2-2-2%200-3%200-3%202l-1%201-2%202c0%203-2%204-15%204a1975%201975%200%200%200-20%200c-4%200%201%205%205%205l5%201c1%201%202%200%203-1%203-2%206-3%2016-1%206%200%209%202%206%203v1c1%202%202%201%203-2%201-2%202-3%205-4l7-2%204-1%205-2%204-3c2-1%203-4%201-4l-2-2c0-2-4-4-4-2M78%2081c-9%209-18%2021-21%2030-2%206-3%2010%200%209%202%200%201%201-1%204-4%203-4%2014-1%2017l2%203c0%206%204%2013%2011%2020%204%205%208%207%206%204v-3l-2-3-2-2%202-1c2%200%203-1%203-2l3-1%202-1-1-1-1-4c0-5-3-9-4-4-2%203-4-1-4-7-1-6-1-9%202-9%202%200%204-3%204-4l-3-1-1-1v-4l-1-2-1%202-3%204c-2%200-3%202-2%202%201%202-1%205-4%205l-3-1%201-1%201-2c-1-1%200-2%201-3%202-2%202-5-1-5l-1-2%206-1c7%201%206%202%206-10%200-7%201-8%203-8s6-4%206-6l1-2v-4c0-5-1-6-3-5M39%2097l-1%205-2%203v-4c0-4-2-3-2%201%200%202%200%202-1%200-1-4-3-5-4-3-1%201%200%202%201%203l2%201-2%202-2%203c0%203-3%200-3-3s0-3-2-1c-1%203-1%2010%201%2011l5%204c5%205%205%205%207-3l3-13c1-6%202-7%200-7v1m5%203c-10%2019-8%2049%203%2066%204%207%2014%2018%2015%2018l-5-8a66%2066%200%200%201-17-47c0-11%200-13%203-21%203-9%203-13%201-8m94%202c-3%201-4%203-1%205l1%203%201%201%203%202c2%202%202%202%203%200%201-3%204-4%204-1s4%203%206%200%203-7%202-9-3-1-3%201l-1%201-1-1c0-2-3-3-9-3l-5%201m172%2021-1%205-2%206c0%203%201%204%203%202l2-2c3%200%206-7%205-9%200-3-1-3-4-3l-3%201m-178%208-1%202-1%202-1%203c0%202%200%202-2%201l-3%201%201%202%201%202%203%202c2%200%202%200%202%204%200%203-1%203-2%203-3%200-7%204-5%204l2%201%201%201c1%203%205%203%205-1%200-2%200-3%202-3l3-2h3l3-2c1-2%201-2-2-2-3-1-4-3-1-3l2-1-1-1-3-2h-2c-2%201-5%201-5-1l2-2c2%200%203-2%201-3v-3c0-2-1-3-2-2m41%2018c-2%202-3%202-4%200h-5c-2-1-2-1-4%201l-3%202v3c2%202%201%204-3%204s-5%203-2%205c2%202%202%202%201%205-2%204-2%205%201%205%202%200%204-3%202-4v-3l1%202%201%201%201-1c-1-2%201-3%203-2%201%201%207-1%208-3v-9l-3-1c-1-2%206-2%2010%200%202%201%203%200%201-2-2-1-3-4-1-4l1-1c0-2-3-1-5%202m-57%202-1%202c0%202%200%202-1%201-3-3-7-2-11%202-4%205-5%207-2%207%204%200%205%201%207%203l2%203%201-3%202-2c4-1%208-5%207-6l4-5c2-1%202-1%200-1-2%201-4%200-6-1h-2m86%203-5%204-4%202c-3%200-5%202-4%206l-1%203-2%201-2-1-4-5-1%202-1%205-1-3c0-3-2-5-4-3s-1%207%202%208c4%201%207%204%208%2010l1%204%203-6c5-8%207-7%204%202%200%201%200%202%202%202%202%201%202%202%202%204l-2%207v4h6a84%2084%200%200%200%2033-10l-2-1c-3%200-6-2-6-5%200-2-1-2-2-2-3%200-3-4-1-6l2-2-3-3-6-5c-3-1-3-1-2-3%204-3%202-9-2-8l-2-1h-6m41%203h-5c-3%200-4%200-4%202v5l4%202c3%202%203%202%204%200l4-1c2%201%203%201%202-1l1-2c2-1%200-4-3-4l-1-1h-2m-203%208%201%203v10l2%209c2%203-5%209-11%209l-6%201c-1%202-12-1-12-4h-2c-3%201-2%204%200%203l3%201%204%202%203%203c2%203%204%205%208%204%202-1%203%200%206%201%204%203%2013%206%2014%204h6c0-2%202-3%207-3l4-1-1-2c-2%200-1-2%201-3l1-1c-2%200-2%200-1-1v-2c-2-1-1-4%201-4l2-1-2-1h-2c-2%200-2%200-1-1l-1-2-4-3-3-2-5-6-5-5-4-7c0-2-2-2-3-1m89%2016-3%204-1%201c0-2-1-2-4-2s-3%201-3%204l-1%204c-3%202%204%205%2019%207l11%201c2%200%202%200%201-1-2-1-2-1-1-2%203-1%200-2-4-2h-2c0-2-5-1-6%200l-2%201c-2%200-3-4-1-6l1-1%201-4%202-4h-7m59%208c-4%206-9%208-8%202%201-3-1-2-3%202l-3%204c-3%202-2%202%203%203h3l4-1%204-1%201-6c1-6%201-7-1-3\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"dd103528-c51b-56a9-b2de-2947288519fa","title":"masala dosa","cookTime":4,"prepTime":3,"content":{"tags":["dosa","potato","food","breakfast"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=157&h=86&q=50&fm=webp 157w,\\nhttps://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=313&h=171&q=50&fm=webp 313w,\\nhttps://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=626&h=341&q=50&fm=webp 626w","sizes":"(min-width: 626px) 626px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=626&h=341&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=157&h=86&fl=progressive&q=50&fm=jpg 157w,\\nhttps://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=313&h=171&fl=progressive&q=50&fm=jpg 313w,\\nhttps://images.ctfassets.net/qucxnkqed615/6ojKe7U8GfaXxpIjv1Jm5X/c99d2f1a5a7e35a28eaf0034704fc56f/masala-dosa-new-625_626x341_51455083494.jpg?w=626&h=341&fl=progressive&q=50&fm=jpg 626w","sizes":"(min-width: 626px) 626px, 100vw"}},"layout":"constrained","width":626,"height":341,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'218\'%20viewBox=\'0%200%20400%20218\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M189%2038c-14%203-13%209%202%2011s32-5%2023-9c-3-2-20-3-25-2m82%2014c-24%203-32%209-18%2014%2018%207%2049%207%2066%200%208-3%209-5%207-8-7-7-33-10-55-6m-34%2024c0%201-4%203-7%202h-1c1%201%200%202-1%204-2%202-3%205-1%205l1%201-1%201h-2c-1%205-6%2011-10%2014l-6%207c-1%202-2%203-3%202-2%200-2%200-2%202l-2%203-2%203-1%201-1%201-2%203-3%204-4%205-4%206-3%204-1%202c1%202%200%203-1%204v3c1%204-4%209-8%207l-1-1c2%200%203-2%201-4v-2l1-2c-1-1%202-9%204-9v-4c2-2%202-5%200-7-1-1-1-1%201-2v-2c-3%200-2-2%200-2s2%200%201-3v-4l1-4v-2l1-3%202-3%201-6c0-6%200-6-3-5l-2%201-3%201a184%20184%200%200%201-23%203%20107%20107%200%200%201-44-1c-4%200-4-2-1-3l3-1h38c1-1%2010-3%2016-3%202%200%203-1%203-2h2c1%202%204%202%209%203%207%200%2010-1%207-3-3%200-2-2%200-2l2-1%202-1%202-1-9-3c-2%200-2-1-2-5%200-1-1-1-3%201h-5c-4-1-8%200-13%202h-6c-2%200-4%200-7%202l-12%202-9%202-8%201-6%201-6%202-4%201%202%201H91a774%20774%200%200%201-55%2011c-28%205-29%206-27%2010%201%203%206%206%2016%208l23%208-4%201-4%201c-2%201-2%207%200%208l1-1c0-3%203-4%204-3h5v6c-2%202%203%208%206%207h1c-1%201%2015%207%2040%2014l12%205a225%20225%200%200%200%2055%2011h12l3-4c9-10%2016-17%2019-17l2-1%202%203c4%208%205%209%209%209%203%200%204-1%205-4l3-4c1%201%201%200%201-1l3-6c5-8%204-10-3-10-4%200-10-2-11-5-2-3-2-6%200-6l2-2%202-2c3%200%206-3%204-4-1-1%201-7%203-7l1-2c0-2%201-1%208%206%2012%2015%2014%2018%2012%2025-2%206-3%207-7%207-3%200-5%200-6%202l-3%202c-3%201-4%2019-1%2019%201%200%202%205%201%207-2%202%201%205%207%206%208%202%2049%202%2066-1%2014-2%2016-2%2018-5%202-2%203-5%201-3-5%203-12%200-13-5l-1-3-1-2-1-1c-1%200-2%201-2%203l1%202%201%201-2%201-2%201h-2c-2-1-2-1%200-2%202-3%201-5-2-5l-2-1%204-1c3%200%203%200%202-1v-4c0-2%200-2-2-1h-3c-1-1%200-1%203-2l4-1c0-2%202-1%202%201%201%202%203%203%203%201h7c1%201%201%201-2%201-5%200-6%200-3%202l1%202%202%202c2%200%203%201%203%202%200%202%206%203%208%202%202-2%201-3-1-2-2%200-3%200-3-2l-3-4v-2l3%203c2%203%203%204%203%201l-6-6-1-5-1-7c-1-2%200-3%207-6%207-2%2010-5%2010-8l-1-3-2%203-1%201v1l-2%201-5%202c-2%202-2%202-4%200-1-1-8-2-8%200l-3%201-2%201-2%201-3%202-4%201c-1-1-2%200-3%201l-3%202-5%201c-2%202-10%202-12%200v-3c2%200%203-3%202-4l-1-5h-1l-2%201c-2%200-2%201-2%203l-1%2013c-1%201-5-1-5-3%201-1%200-3-2-9-1-3-1-6%201-6l2-1c0-1%202-3%205-4%204-3%205-4%204-5%200-2%202-3%204-1h8c2-1%204-2%205-1h2l2%201h4c2-1%206%200%207%202l2%201%203%203%204%202-1-2c-3-4-3-4%202-4%203%201%203%201%202-2v-3l2%202%202%202%201-2v-3c-1-1-21%200-24%201s-9%200-8-1l6-1h6l-7-1h-8c-3%202-7%202-8%200h-2c-1%201-1%201-1-1-1-1-1-1-3%201h-2l-3-1-2-1%202-1v-3l-4-1h-3l1-2v-1h-2c-3%201-8%201-9-1l-3-1c-3%200-4-2-1-2v-1c-1%200-2-1-2-4l-1-4v-3c2-4%201-9%200-9-1%201-2%200-2-1l2-1c2%200%203-5%201-7-2-1-3-1-3%201m107%205%202%202c3%200%201%202-2%202-2%200-2%201-2%203%200%203%202%206%204%206l1%201%206%203c6%202%2011%202%2017%200l4-2h-4c-3%200-4%200-3-1l2-1%203%201%205%201%201%201h2c2-3%202-4-1-6l-2-1%202-1%205-1%202-1-1-1c-3%200-2-2%200-3%203%200%202-2-2-2-2%200-3%201-3%202%200%202-1%203-3%203s-3-1-3-3-1-2-4-1h-6l-5-2-7-1c-7-2-8-1-8%202m-66%2085-3%201h-5c-2-1-2-1-2%202%201%202%200%203-1%203l-1%202-1%203c0%202%203%203%204%202%204-3%2012-2%2013%202%201%202%202%202%204%202h3l3%201c4%200%204-2%201-5-3-2-6-8-5-8v-2h-3c-2%200-3%200-4-2l-3-1\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"a5e36e7b-49de-539f-957f-30a1bb63e5ab","title":"obbattu","cookTime":4,"prepTime":3,"content":{"tags":["lunch","dinner","dessert","sweet","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=56&h=56&q=50&fm=webp 56w,\\nhttps://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=112&h=112&q=50&fm=webp 112w,\\nhttps://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=224&h=224&q=50&fm=webp 224w","sizes":"(min-width: 224px) 224px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=224&h=224&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=56&h=56&fl=progressive&q=50&fm=jpg 56w,\\nhttps://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=112&h=112&fl=progressive&q=50&fm=jpg 112w,\\nhttps://images.ctfassets.net/qucxnkqed615/2P6xyAt0J10j7wGpyd7N5Q/c6db05df1dbc39c6092f696364a258d4/images__2_.jfif?w=224&h=224&fl=progressive&q=50&fm=jpg 224w","sizes":"(min-width: 224px) 224px, 100vw"}},"layout":"constrained","width":224,"height":224,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'400\'%20viewBox=\'0%200%20400%20400\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M75%2011c1%205-8%208-14%204-2-1-2-1-3%201l-1%202c-1-1-4%200-7%201-6%202-8%202-6-1%203-3%202-4-1-3-6%201-15%2010-15%2015%200%202%202%203%203%201%202-3%2013-6%2018-6l6-2h8c2-2%209-3%209-1l-2%203c-3%201-2%204%203%205h27c2%202%203%201%202-2-1-7-8-13-19-16-6-2-9-2-8-1m221%202%201%202c1%201%201%201-1%202-3%202-2%202%204%204h16c9-2%208-3-3-3-7%200-11-2-10-4%200-2%200-2-3-2l-4%201M88%2057c-5%203-17%204-29%204-12-1-13-1-13%201l-1%203v1l-1%202-1%202c1%202-2%201-7-1-4-2-4-2-5%200l-2%203-1%203-3%204-6%207-2%205%2011%208%2015%207c2%200%205%203%204%206l1%202c3%200%203-2%202-4-1-1-1-1%201-1s3%201%203%202l-1%201v1c2%201%202%202%201%206-2%204-2%206-1%206l1-1%203-5%202-6%202-3%201-3%203-8%202-5h8l9%202%202-1-2-2-2-1%202-1%202-1-1-2-1-4v-6c-1-3-1-3%202-4l5-2%204-1c3-1%203-4%200-5h-3v-8c3-1-1-3-4-1m272%2012c-5%205-18%2012-28%2015-22%206-46%205-65-4-6-3-9-3-6%200l2%203c0%202%204%207%2010%2012%205%205%206%208%203%2013-1%201%200%203%201%205%203%205%202%206-2%203l-3-2c0%203%209%2013%2013%2015%202%201%203%202%202%203v1c1%201%200%202-1%203-2%203-2%203-1%204v7l-6-5%202-1c1%200%202-2%200-2l-2%201c-2%202-2%202-5%200-3-1-3-2-4%208l-2%209c-2%201-1%202%201%202l7%201c18%204%2028%205%2028%203l-2-3c-2-1-3-3-1-3l4%203c2%202%203%203%204%202%202-2%203-1%203%201%200%201%200%202%205%202l7%202%207%201c7%200%208%201%207%206s1%205%2017%205c20-1%2029-2%2027-4l2-1a535%20535%200%200%200%207%201c0-1%201-2%203-2h3v11c0%206%201%2011%202%2011l1-25-1-25-2-2-3-3-2-1-1-2%202-1c5-1%206-2%202-4-5-2-6-2-5%200l-3%205c-3%202-4%203-3%205%200%202-2%203-5%200-2-1-5-1-5%202l-2%202v-3c2-3%201-4-4-5-5-2-6-5-1-7s5-3%202-6h-3c0%202-4%201-4%200%200-2-1-2-4-2l-6-1-4-2%201-7c0-6-1-8-4-5v-3l-1-7c-1-3-1-4%202-7%204-5%205-5%205-1l1%202%203%202h2v-2l-2-2-1-2c-2%200-2-4%200-7l1-3%202-3%201-2%203-2c2%200%203-2%203-2%200-2-2-2-4%200M119%2086c-1%202-4%204-7%205l-6%204c-1%202-2%202-4%201h-3l2%202c4%201%200%203-5%203s-6%203-1%204c4%200%206-1%2012-4l6-4%204-4%203-2%204-7c0-2-3-1-5%202m264%2010c-1%201-1%201%201%201%202%201%203%203%201%203l-1%202v2c-2%200%200%205%202%206%202%200%202%201%202%202h7l2%201v3c2%203%203%200%203-8l-1-10-3-2c-2-2-11-2-13%200m-205%204c-7%201-30%2011-33%2014-1%202%200%202%2025%205l13%202h58c1%200-1-2-11-7l-12-8-8-4c-1%201-5%200-8-1-9-3-16-3-24-1m160%2014c-2%202-8%202-9%200h-4l-5%202c-1-1-3%201-5%205-1%201%200%202%202%204l2%203%205-2%207-3c2%200%2011-9%2011-10%200-2-3-1-4%201m39%202%201%202c1%201-1%204-4%205s-1%203%202%203l6%203%204%203c2-1%201-7%200-8l-2-2-1-2-2-2c-1-3-3-4-4-2m-161%2015c2%202%203%204%201%204-1%200-5%207-5%2011%200%202%200%203%202%203h3l4%201c2%201%203%201%202%203l1%201c2%200%203-2%202-2-2-1%201-3%204-2l2-1-2-1c-3-1-4-3-1-3s6-2%206-4-2-3-3%200l-2%201-1%201-1%201c-2%200-4-7-4-11%201-3%200-4-2-1h-2l-4-2v1m-28%204-2%206-1%203c-1%201%202%206%204%206l5-4%205-4%201-2-2-2-2-2c-1-3-4-5-5-5l-3%204m87%2039c-3%205-7%207-10%205-1-1-3%200-3%202l-2%202-4%202-4%201-3%202-1%201-3%201c-2%202-3%200-4-5%200-4-1-4-3-4-4%200-6%201-5%203l-1%202c-2%200-2-1-2-2l-1-2-3-1h-4l-5%202c-3-1-4%203-1%203h5c2%200%203%200%202%201l2%202c3%201%203%203%200%204l-3%203-8%201c-8%201-9%201-7%204%201%201%201%202-2%205s-3%203-2%204l5%203c2%202%204%202%209-2%203-4%207-6%209-6%202%201%205%207%204%2010l3%203c3%202%207%205%207%207%200%201%203%206%205%207s2%201%200%202l-5%201c-2%200-2%201-2%203%200%204%202%205%208%205%206%201%208%201%208%203l-5%201c-4%200-4%200-4%202s0%202-2%201l-3-2h-4v2c2%203%200%205-2%203-1-2-2-2-3-1-3%202-2%204%201%204%202%200%203%201%204%203s5%203%206%201l2-3%202-2%203-2%202-2%203-1c2%200%202%200%200%201v4c2%201%203%202%204%201%201%200%202%200%201%202%200%201%200%202%202%202%202%201%202%201%201%203-2%202-2%202-1%204l2%207c0%203%200%205%202%206s3%204%201%206v2c1%202%205%201%208-2l7-5%204-1h4c1%203-1%205-3%204-3%200-5%203-2%206v4c0%203%201%204%206%205h5c1%201-3%209-5%2011l-3%202-4-4c-4-4-4-5-3-6%202-3-1-6-7-8-7-2-9-1-9%201s3%204%204%203%206%201%206%203c1%202-2%208-6%209-4%202-5%204-3%205s2%201%200%204c-2%206-5%207-9%204l-6-2-6-3%202-1%202-1-1-2v-1l2-1%202-1h3c2%202%203%202%205%201%203-2%204-4%200-5-4-2-4-6-1-10l3-3-3-2-2-3-1-1-1-1v-5c0-3-1-3-3-3h-3c-1-1-5%200-8%202-4%205-8%207-9%207-2%200-7%205-7%206%200%202-4%206-6%206l-4%201h-2c-1-1-6-1-6%201l1%202h1c3%200%208%206%208%2010s-2%207-4%206l-2%201c-2%202-9%203-15%201h-5c-1%202-1%202-2%200-1-3-4-4-4-1l-1%203c-1%201%201%205%202%205l1%201c0%202%208%207%2010%207%208-1%2013%202%209%205v1l3%202h4c4-2%2011-2%208%200-2%201-1%203%202%203l6%202%205%203%203-3c4-3%206-4%206-2l2%201c0-1%200-2-2-3l-1-2-7-6-3%201h-4c-4%200-6-3-4-5%204-2%209-1%2013%202%203%202%204%202%207%201h18l-2-3-2-4c0-2%202-2%204%200h1l2-2c2%200%202%200%201-1-1-2%200-3%203-3%202%200%204%202%202%203-1%202-1%203%201%203l1%202-1%201c-3%200%202%206%206%207l4%201h10l3-1c-1-3%207-4%2014-1h4l4-4c4-2%202-4-2-3h-3l2-3c2-4%205-7%207-7%201%200%207-9%207-11v-3c2%200%201-5%200-6-2-1-2-1-4%202-2%202-3%202-4%201l-1-2v-10l-1-4c0-3%200-3-2-3l-3-1-2-3-2-2h2c5%200%205%200%201-2-3-2-5-2-8-2h-5c0-3-2-2-3%200-2%203-6%203-7-1l-1-3c-1%200-5%202-6%204h-3l-2-2c-2%200-3-3-2-5v-1l-2-2-1-3c-2-3%200-4%206-4%205%201%207%203%205%205l-2%201%205%203-1-8c-1-2%201-4%206-4l5-1%203-1h4c2-1%202-1%203%201%201%203%202%204%204%202%201-2%203-1%203%201%201%204%204%202%204-1s0-4%202-4l2-1%203-2c5-1%206-4%205-9%200-4%200-4%202-4l4-2h4l6-6c0-3-2-3-4-1-1%201-1%201-3-1-1-2%200-3%201-4l1-2h2c2%202%203%201%203-1-1-1%200-3%201-4v-5c-2-1-2-1-2%201%200%203-2%206-4%206l-1-2-2-2c-1%200-1-1%201-3%204-5%204-5%201-5l-3%203-2%202c-2%200-2-3-1-5%202-2%201-3-2-3-2%201-4-1-3-5%200-3%200-3-3-3-1%201-3%200-4-1l-4-2-4-2-3-2-1-2c0-1-4-5-6-5l-2-2c-1-2-3-2-6-2l-5-1-2-1h-5l-3%201v-1c2-2%201-3-1-3l-3%202M27%20190%207%20205l-7%206v13c0%2013%200%2013%202%2013%203%200%205%203%205%209l5%2010%201%202h1c1-2%202-2%203%201l1%204%201-4c0-4%201-4%204-5%204-2%207-6%2010-16l3-7%201-1-2-1c-3%200-5-7-3-11l4-14%201-5%202-18-12%209m371%2010-1%204-1%204-1%209-2%209-1%203-1%205-1%2015c-1%2011-1%2013-5%2014l-1%205-2%205-1%203-2%205-8%2015-5%207-3%205-3%204-7%209c-7%209-13%2015-23%2019l-9%206-2%201-5%202-7%205c-6%202-9%205-8%205l1%202h-5c-1-2-11-3-14-2a156%20156%200%200%201-36%2013c-15%202-15%203-2%204%2030%203%2061%203%2067-1%204-2%204-3%201-3-2%200-2%200-2-2%201-2%200-3-1-4v-6c0-1%203-4%205-4l2%202%202%203%201%205c0%202%200%203%202%203v-1l3-1%208%202h4l-3-2c-2-2-2-2-1-3%202%200%202-2-1-2-2%200-2%200-1-2%200-2%200-2-2-3-2%200-2-1-1-2h3c1%202%202%200%201-4-1-3%200-5%202-5s5%204%205%205%201%202%202%201l3%201c2%202%201-1-1-3l-3-3%203-1h2c0-2%203-3%204-1l6%201h7l1%202c-1%202%203%205%207%206l5%201h1l4-1%204-1%203-1c3%200%204-2%201-3-2%200-3-2-1-2l1-1%201-2%201%202%202%201%201-1%201-2c0-1-1-2-3-2-4-1-4-3%200-3%202%200%203%200%203-2%200-1%200-2%202-1l1-5c-1-5-5-11-7-11s-2%200-1-3c1-1%201-2-1-2-2-1-2-1-1-2%204-1%207%201%209%205l2%204v-26l-1-17c3%206%203%2017%204%2053l1%203a508%20508%200%200%200-4-78c-1%200-2-4-1-7%200-3%200-3%202-1h2v-3c1-2%200-3-1-3-2%200-2-1-2-3l-1-5v-1c1-1%204%204%203%206l1%201c1%201%201-6%201-21l-1-23-1%203m-222%2014c-2%202-2%202%201%202%204%200%207%201%206%203-1%201%200%201%201%201%204%200%201%201-2%201-4%201-5%203-2%203%201%201%201%201-1%201-6%200-7%204-2%206l3%201-3%203-3%204%202%201%204%201c2%200%203%205%202%206-2%203-1%204%203%204%202%200%203%200%203%202-1%201%203%203%204%202l1%201%204%201c2%200%203%200%203%202l3%201c3-1%204-3%202-7-2-3-2-3%200-4%202-2%202-4-1-4l-4-1c-4-1-6%200-5%202%200%202-3%203-5%201v-3c2%200%203-2%203-4h-2l-3-1-2-1c-1%201-2%200-2-1%200-2%200-2%206-1h6v-3l-4-6-3-5-2-2v-2c2-2%201-4-2-4h-9m-5%2038%201%202%201%201-1%201h-1l2%202%201%201c-1%204%205%2010%209%2010%204%201%203-2-1-3-3-1-3-2-2-3s2-2%201-3v-2c1-2%200-6-2-6h-8m-85%2010c-3%203-3%203-19%203l-20-2c-4-2-11%201-11%204l1%202%201%202c1%201%201%202%202%201l2%201c0%203-2%203-5%201s-4-1-1%202l4%206c0%203%200%203-11-4l-10-6-2-2h-2v2l-1%202c-3%200-7%204-7%206%200%201%203%201%205-1%203-2%203-1%204%209l1%2011%203%2011%201%209-2%202c-3%203-4%205-2%207%202%201%203%2020%201%2022l1%206c3%209%203%2019%202%2020v16l1%208h12l14-1h2c0%202%203%201%203-1l2-3c2%200%204%203%204%204h9l166%201h166v-31l-1-27c-1%206-9%2016-11%2014l-6%201c-5%203-5%203-8%201-2-1-2-1-3%201l-3%203-2%201%204%201%203%201c0%203%203%203%207%201l4-3c2%200-2%204-5%205l-5%202c-9%203-31%207-33%205-3-3-17%200-26%204-3%202-6%202-22%203-18%200-23%200-58-4-13-1-20-4-17-5%203-3-2-4-8-2-2%200-2%200%200%201%203%202-3%201-9-1l-13-2c-10-1-23-6-27-10-3-3-9-12-9-15l-3-1c-4%200-5-2-5-8l1-6c3-2%202-4-1-6h-10l-15%201c-8%200-10%200-10%202l7%203-10%202c-9%200-12-1-18-5-2-2-3-10-1-10%201%200%204-10%204-17v-6l-2-2-3-5c-3-2-3-4%200-4%202%200%202-1%202-3l1-4v-14l-3%201m119%202c1%202%200%202-3%203l-4%201%204%202%205%202%201%201%204%209%201%202c0%204%206%205%209%202%202-2%202-4%200-4l-5-3-4-3%202-2%202-2-1-2c0-4-3-8-7-8-3%200-4%201-4%202m-64%202c0%204-3%207-4%205h-1l-3%201c-2%200-4%202-2%204v3l-1%203-1%201-1%203c0%202%201%202%208%202h8v-4c0-3%201-4%202-4%203%200%204-2%204-7s-1-6-3-3-4%201-4-3l-2-4v3m-91%204-1%202-1%203c0%202%201%203%203%203h6l4%201c3%202%2016%205%2017%204s0-3-3-3l-5-2-2-2h2c4%200%205%200%203-1l-4-1-2-1-1-1-2-1h-4l-2-1c-1%201-3%200-4-1-2-1-3-1-4%201m138%203%201%201c2%200%202%204-1%2011-1%202%201%206%203%205l2%201c1%201%203%202%207%202%205%200%206%200%206-2%200-3-6-6-7-4h-3c-2-1-4-9-2-10%202-2-1-6-4-6l-2%202m-51%2019c-2%201-3%201-2%202%202%201%202%206%200%207-1%201%200%205%202%205v4l-3%202h-3l-6-2c-4%200-5%200-7-5-2-4-5-5-3-2%200%202%200%202-2%202-5-2-9-2-9-1l2%201c2%200%203%200%203%202%202%202%204%204%207%203l6%202c6%203%209%203%2012%202s3-1%203%201c-1%202%200%204%203%204%202%201%202%201%202-2v-2c4%200%206-16%203-22-2-3-3-4-8-1M24%20328c-2%202-2%203-1%205v10l1%209-1%201h2l1%201-1%201c-2%200-1%202%201%202%201%201%202%201%201%203%200%202%201%203%203%202%203-1%203-3%200-4-2-2-2-2-1-3l3%201%202%201c1%200%201-1-1-3-3-4-2-6%202-6l4-2%202-4c2-3-1-7-6-7l-3-1h-3c-4%200-4-2%200-4l2-3c0-2-5-1-7%201m18%2031h-2c0-2-4%201-6%204l-5%202c-1-1-2%200-3%201l-1%203v2c2%201%202%202%202%203v2l2%204c1%204%203%206%203%203l2-1%204-2%204-2c1%200%205-7%204-9l-3-1c-4%201-4%200%200-4%202-3%204-7%202-7l-3%202m19%2014-3%203c-1%200-2%201-2%208-1%208%200%2012%201%206l3-3c1%200%202%200%202-5l1-6%202-1%201%201c1%200%201-1-1-4l-2-2-2%203\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"a44d5ac6-13d1-593e-adc8-b0d2a6337daf","title":"patrode","cookTime":4,"prepTime":3,"content":{"tags":["lunch","breakfast","dinner","snacks","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=300&h=169&q=50&fm=webp 300w,\\nhttps://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=600&h=338&q=50&fm=webp 600w,\\nhttps://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=1200&h=675&q=50&fm=webp 1200w","sizes":"(min-width: 1200px) 1200px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=1200&h=675&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=300&h=169&fl=progressive&q=50&fm=jpg 300w,\\nhttps://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=600&h=338&fl=progressive&q=50&fm=jpg 600w,\\nhttps://images.ctfassets.net/qucxnkqed615/6IyKtdVaSBy9spe4j5YFKn/757f58c1931b074bbe15a01c501b2577/c63nc4o5e8m.jfif?w=1200&h=675&fl=progressive&q=50&fm=jpg 1200w","sizes":"(min-width: 1200px) 1200px, 100vw"}},"layout":"constrained","width":1200,"height":675,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'225\'%20viewBox=\'0%200%20400%20225\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M24%202c0%201-1%202-4%202l-6%203-4%201c-2%200-2%201-2%203s0%203-2%203c-6%200-6-3-6%2064%200%2060%201%2060%202%2055a111%20111%200%200%201%2047-56c2%200%204-4%206-11%206-16%2015-30%2025-39%206-6%206-4%200%202a82%2082%200%200%200-25%2062c0%2020%203%2033%2013%2049%204%206%204%206%206%204v-3c0-1%206-7%208-7l1-2c0-3%203-6%208-9l8-2h4v-2c-2%200%200-2%204-4%207-3%2013-3%2018-2l7%202%203%203%201%202v1c-1-1-2%201-3%203-1%203-1%206%201%206s0%206-3%209l-2%202%203-1c2%200%202%200-2%204-5%205-6%206-3%209%201%202%200%203-2%201-1-1-2%200-4%201s-2%202-1%203c2%201%202%201%200%203l-2%202-3%202-3%201%205-10c2-2%200-3-3%200l-3%201c1-1%200-2-1-2l-1-3c0-2%200-2-2%200l-4%203c-2%202-3%203%200%203%201-1%202%200%203%201%202%202%202%202-1%205-3%202-3%202-3%200s0-2-2-1l-2-1%202-1v-1l-1-2-2%201-3%203v-2c-1-4-1-8%201-10s1-3-3-1c-5%202-8%209-3%207l2%201-1%203h-2c-2%200-2%200%200%202%201%201%202%202%203%201l2%201c-1%203%200%202%202%200s2-2%201%201c0%203%203%208%2010%2012l10%206%207%203%201%201%205%203-1-2-1-8%201-9c1-4%204-9%207-9l6-1c6-1%2014%205%208%206-2%201-3%200-4-1-2-3-10-2-10%202l2%201c1-1%202-1%201%201l-2%203-2%201%201%201c1-1%203%200%203%201l2%203%201-3c0-1%202-3%205-4%205-3%205-3%205%201v9l-2%202-1-2h-1l-1%204c0%203-2%204-5%202-1-2-1-2%201-5l2-2c-1-2-6%205-7%209-1%203-1%203%202%204l4%201%203-1h5l3%201c-2%201-2%204%200%204%202%201%202%201%201-1%200-2%200-3%202-2l3-1%202-1%201-1c0-3%203-4%204-2l-1%203c-2%201-2%203%200%207l2%203%204-2%204-4c-2-5-2-14-1-16s1%200%201%206c0%203%203%202%203%200l1-2%201%202%202%201v-3c-1%200-2-1-1-2l1-1%202-3%201-4v-2h-1l-1-4v-5c-2%200%203-7%205-9l3-2%204-4v3c-2%201-6%208-6%2010l-1%202-3%207%205-4c1-2%201-2%200%200v3l2-2c2-2%203-2%203-1%201%202%202%202%204%201h6l5-2h3c1%201%202%202%203%201%201%200%201%201-1%205%200%202%200%202%202%203h2l-2%203c-2%203-3%205-1%205s0%2010-2%2012c-2%201-2%202-1%205l1%204%204-3c4-3%208-2%209%202l1%203c1%201-1%201-12%203-6%200-9%203-8%205l2-1c0-2%202-2%206%200%204%201%204%203%201%205s-10%202-10%200l-3-1h-2l2-1%203-2-8%202c-1%202-23%202-24%200l-3-1c-1-1%201-1%205-1%207%201%208%200%207-1h-4c-2%200-3-1%200-2%202-2%201-5-2-4-2%200-6%204-6%205l-4%202c-3%200-3%200-1%201l3%201-3%201-3%201h2c3%201%203%202%202%204v2h22c42-1%2081-9%2095-20a63%2063%200%200%201%2014-8c6-4%209-6%2017-14%207-7%207-8%201-3l-5%203-7%206-5%201v1c1%201%201%201-1%201l-11%203c-10%203-12%203-8%200l6-3%207-4-1-1c-2%200-4-5-3-7%201-1%202-1%207%201l7%203%205-4c3-2%206-4%205-5l2-1c5%200%2028-22%2028-27%200-2-2-1-9%207a217%20217%200%200%201-11%2013l-1%201c-2-2-1-2%207-12%2012-14%2021-27%2020-28l1-3%201-3-2%201h-7c-1-2%201-16%202-19%204-11%200-22-13-41a103%20103%200%200%200-29-28c-2-3-5-5-6-5l-1-1-5-3-7-4-14-7c-18-8-18-9-1-3a251%20251%200%200%201%2046%2025c5%204%2023%2025%2026%2031a77%2077%200%200%201%2010%2028l1%205v2c-3-3-3-2-3%202v4l-2%206c-1%204-1%205%201%205%203%200%204-2%204-5l1-3v-2a449%20449%200%200%201%201-3c3%203%203%203%203%200l2-2v1c0%203%201%202%2011-1%208-2%2011-4%209-8l-4-9c-1-4-5-12-9-17-7-11-8-14-2-7%208%2010%2017%2029%2017%2036%200%205-5%2014-8%2016s-4%203-1%205c4%202-2%209-13%2014-4%203-5%203-7%2011l-3%209%2020-14c8-6%2017-11%2020-11%202%200%208%203%209%205l2%201c1%201%201-8%201-60l-1-52c0%2011-1%2014-5%2014l-1%201-2%201-5%203c-8%204-21%206-25%204-3-2-2-6%201-8l8-5%206-4v-6l-1-3-1-3c-2-6-5-6-6%200-1%205-6%206-9%201-2-3-7-4-8-2h-1c0-2-2-1-2%201l-1%203-2%203c0%203-5%206-7%205l-2-3-2-1c-1%200-2%201-1%205%200%209%202%2010%2015%2010h6l-2%203c-3%203-3%204%203%2010l4%206-3-2c-10-12-14-15-14-10%200%202-1%201-6-6l-13-13-7-7%202-2c2-2%202-5%200-5-1%200-4%202-4%204l-6-3c-4-4-5-4-4-6%202-1%204-1%204%201h3l-1%201v1h3c4-1%204-8%201-9l-3-2c0-2-20-1-21%201a1170%201170%200%200%200-134-1h-18c0-2-19-1-21%200l-4%202-2%201%202-2%203-2H70C25%200%2024%200%2024%202m113%207a504%20504%200%200%200-37%2017c-7%204-11%208-21%2020-9%2010-9%2011-4%208l3-3%204-4%207-5a301%20301%200%200%201%2048-30c9-3%208-6%200-3m91%208c-1%203-4%205-4%203l-1-1-1%201-2%204-2%204-1%202c-2%200-5%207-4%208v3l-2%203c0%202%202%202%203%201s1%200%201%202c-1%202%200%205%201%208l1%205%202%201%203%202%207%202c4%200%205%200%204-1-2-1-2-1-1-2l3%201c0%202%204%201%204%200l1-3-5-1-8%201c-1%201-3%200-5-3-1-2-1-2%201-4%203-2%203-4%201-6-2-1-2-2-1-2l1-2c0-3%202-2%203%202%200%203%202%204%202%201l2-3c2-2%203-5%201-3l1-7c1-1%201-1%202%201s1%202%201%200l-1-2-1-2c0-4-1-4-4-2l-1%206c0%203%200%204-1%203l-2-5-1-5c-1-1-1-1%201-1%202%201%203%200%204-2l6-2%204-1-1-1c-2%200-2-2-1-2%201-1%200-1-3-1l-4-1c0-2-2-1-3%201m-91%209-1%202-2%204-2%202-2%201%203%201c3%200%203%200%201%201-2%203-1%203%203%201l2-2c-1-1-1-3%201-5%201-4%202-4%204-1%201%201%202%202%203%201l4%202h1c0-1-2-4-4-4l-3-2h2c3%202%205%201%202-1l-5-1h-5c-1-2-3-1-2%201m116%200v10c0%207%200%207-3%2010s-4%204-3%206c0%203%201%203%207-4l4-2%201-2%201-3%201-2-3%202-3%202%201-3c0-4%203-6%205-5%201%201%201%201%201-2-1-3-4-6-5-5l-1-2-2-2-1%202m-14%202-1%202-2%201%203%201v6c0%204-1%206-3%208s-2%202-1%203%201%201%203-1%202-2%202%200l-1%202-1%202%201%201%201-1%201-1c2%200%205-3%205-5l-2-2c-2%200-4-3-3-4h2c1%201%202%201%203-1l3-1c1%200%202%200%202-2l-2-1c-1%201-2%200-2-1%200-2-2-5-4-5l-3-2c-1-1-1-1-1%201m-55%200c-1%203-1%203%202%203%204%201%205%205%202%209-1%202-2%203-1%204l-1%203c-1%201-1%201-1-1%200-3%200-3-1-2l-2%203-2%201c-1%200%200-2%202-3l2-6c-1-1%200-2%201-3l-1-2h-4c-1-2-2%200-1%202l-1%202-1-5h-1c-2%200-2%200-2-2s0-2-2-1l-6%2013c0%202-2%202-2%201l-2-2v6c2%202%204%206%204%209l3%202%202%203h-2c-2-2-3-1-2%201l2%202%203%202c1%202%202%202%205%201h4l1-1-2-1-3-1-1-1-2-1%206%201%205%201c3%200%204%200%203%201-1%202%208%201%2010-1l2-1%208-10v-4c-1-1-1-1-1%201l-5%206%203-8%201-4%201-3-1-10c-1-2-2-1-1%201l-1%203v2c3%202%200%204-3%203-3%200-3-3%200-6l2-2-3-1c-4-2-5-2-4%202l-1%202-2-5-2-3v2c1%202-4%201-5-1l-2-1m-58%2010c-2%202-4%2018-3%2022l3%205%202%203c0%202%205%208%207%208%201%200%203%201%203%203%203%205%205%205%2010%201l4-3%201-1%202-6c5-11%207-18%204-14-2%204-5%200-4-6l1-5c-2-1-3%201-4%206-1%206-2%206-1-1l-1-5-1%203c0%203-2%204-2%202l-1-4c0-5%203-7%206-4h1c0-7-10-5-10%202%200%202%200%202-2-2h-3l-1%203-4%205-2%203v-7l-2-5c-1-5-2-5-3-3m43%2041c-12%202-10%201-20%2012-4%204-5%207-6%2010l1%203%204%202c2%202%204%204%206%204l2%202%209%201%209-1c0-1-3-3-5-2l-3-1%204-2c7-2%207-2-2-1-8%200-13-1-16-4-2-3%200-2%206%200%205%202%207%202%2010%201l14-1a58%2058%200%200%200%2023-4c3-2%203-2%203%200l1%203c2%201-4%206-6%205l-2%201c0%201-2%202-5%202l-6%201c-1%202-1%202%204%202l5-1%205-2%204-2%202-1%201-2%201-2c5%200%206-15%201-16l-2-3c0-3-6-6-9-4l-8%201%201-1v-1h-6c-2-1-14-1-20%201M43%2097c-7%208-17%2021-15%2022l18-4%204-1v-12l1-11-8%206m5%2019-13%204c-15%203-17%204-17%208%200%2010%205%2031%209%2038l3%204v-6c-1-8%201-19%205-27l3-8%207-1c8-1%207-1%206-7-1-5-2-6-3-5m7%204%202%208%202%207%201%203c1-1%201%200%201%201l1%203c1%201%202%203%201%204l1%201%202%201-1%201c-2-2-1%201%205%209%204%205%206%207%208%207v3l5%205a139%20139%200%200%200%2027%2022l4%201c4%202%205%201%202-2l-7-9c-2-4-5-7-6-7-2-1-3%201-1%202s4%205%203%205c-1%201-5-3-5-4l-4-5c-3-3-3-3-4-2s-2%202-3%201c-4%200-5-2-3-3%203-4%202-6-4-12a71%2071%200%200%201-15-19c-4-4-8-14-10-20-2-5-3-5-2-1m246%200-10%202-12%203c-2%202-3%204%200%204l1-1c0-2%204-3%206-2s2%201-1%202l-4%203-1%202c-1-2-4-2-6-1l7%2010%201%202c0%201%201%201%203-1v-2l2-2c3-1%204-4%201-4l-2-2%201-2%201-1c-1-1%200-2%201-2%202-1%208%200%207%201%200%202%2011%202%2013%200%201-1%201-1-1-1-4%200-3-1%201-1%204-1%206-3%203-4-1-1-2%200-3%201s-5%202-4%200h-1l-1-2c1-3-1-4-2-2m-192%2012-2%201-1%202-4%206c0%202-1%203-2%203l-2%202c-1%202%200%202%204%201%201-1%204-2%204-4l3-2c3%200%2011-9%2011-10-1-1-8-1-11%201m194%201c-2%201-1%202%201%201l3%201v1l-2%202c-1%203-5%205-7%205l-1-2c0-2%200-2-2-1-2%202-1%204%203%204s5%202%201%203l-2%201c1%202%207%200%209-3l4-2c2%200%206-3%206-6%201-3%200-4-2-3h-3l-8-1m-249%205c-2%203-3%2019-3%2030%201%2011%201%2012-1%2015-2%204-3%207-1%207a328%20328%200%200%201%2020-7l-2-6c-2-4-3-6-2-9l-1-9-2-5v4c0%205-2%202-2-4l-6-17v1m233%207v3l-1%203v2l2%201h1c2-2%203-1%201%201-2%203%200%204%205%202l6-3%209-3c0-2-2-3-3-2l-9%203h-7c-1-1-2-1-1-2v-4c-1-1-2-2-3-1m-34%205-4%202-4%201-2%201c-3%200-5%204-4%206s1%202%204%200c7-7%2018-8%2028-5h2c0-1-7-4-8-3-1%200-4-1-4-3l-2-1c-1%200-2%200-2%202%200%201%200%202-1%201l-1-2v-1l-2%202m-235%209c1%2014%209%2032%2018%2042l21%2023%206%201h5l-3-4c-6-6-8-11-7-13%201-4-3-8-6-7-2%200-2%200-1-1s1-1-1-3c-3-3-3-3-3%201v3l-2-2c0-5-1-7-2-8-3-1-14-15-14-17l-2-2c-3-2-5-7-6-12-2-9-3-9-3-1m325%209-2%202-1%201-3%206-4%206-6%2011c-3%203-8%2013-6%2013l1%206c-1%2010%200%2010%205%202%204-8%206-13%206-18%200-3%201-3%203-3%205%202%208-4%208-18%200-10%200-12-1-8m-272%200%202%206%201%207c-1%201%200%201%202%201%205%200%2018%2010%2016%2012l-7-5c-5-6-7-6-10-4l-7%202-4%202-2%201h-2l-1%201c0%202%200%202%203%202l3-1%203-1%204-1%203-1c2%201%203%203%200%203l2%202c6%205%2011%2012%209%2013l-4%203c-2%202-2%202-3%200-3-3-6-9-5-12v-2H64l-2%202-3%202c0%203%2014%2025%2016%2025l1-1v-1l1%201h9c3%202%2074%201%2072%200-2-2-1-3%202-3h4l-4-1-3-3%203%201c3%200%203%200%202-1-2-1-2-2-1-2a2204%202204%200%200%201-35-15c-5-2-6-2-4%200l2%203c-1%201%201%202%205%204%2013%206%2015%206%2014%207l-4-1c-3-1-7-2-17-2l-4-2c0-2-7-8-8-8l-4-3c-4-4-14-11-12-8l-1%201-1-2-6-6-11-11-4-4m172%204v3c0%201-4%204-6%204v-1l-1-2-1%202c0%201-3%202-3%200v-3c0-2%200-2-2%200s-2%202-4%201c-3-1-3%200%200%204%202%202%202%203%201%203-2%201%201%204%206%205%204%201%206%201%2011-3%203-3%204-2%204%201%200%202%201%203%204%203s4%200%204-3l3-5v-3h-1c-2%204-2%204-2%202s-4-4-7-2c-3%201-3%200-4-3%200-5-1-6-2-3M0%20202v23h28l-2-2-4-5c-8-9-15-20-20-32l-2-6v22m296%205-16%207a650%20650%200%200%200-38%209l-11%202h30l31-1-1-1c-3%200-1-4%205-11%208-8%208-9%200-5\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"d2c56320-aad9-5ec8-9204-23434676fe03","title":"rotti","cookTime":2,"prepTime":4,"content":{"tags":["lunch","breakfast","dinner","rotti","brinjal ","curry","food"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=151&h=101&q=50&fm=webp 151w,\\nhttps://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=301&h=201&q=50&fm=webp 301w,\\nhttps://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=602&h=402&q=50&fm=webp 602w","sizes":"(min-width: 602px) 602px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=602&h=402&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=151&h=101&fl=progressive&q=50&fm=jpg 151w,\\nhttps://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=301&h=201&fl=progressive&q=50&fm=jpg 301w,\\nhttps://images.ctfassets.net/qucxnkqed615/4q1iAzopNxTMgtUaulYy3s/a45cf72cb1024c4ff0f7f4b5a34a0217/main-qimg-5b4ce3e956be1de14240612e0067c11b-lq.jfif?w=602&h=402&fl=progressive&q=50&fm=jpg 602w","sizes":"(min-width: 602px) 602px, 100vw"}},"layout":"constrained","width":602,"height":402,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'267\'%20viewBox=\'0%200%20400%20267\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'M0%2016c0%2014%200%2016%202%2016v1l-2%201h4c4%200%204%200%203%201l-5%203c-2%200-2%201-2%2015v15h3c8%200%209%200%207%201s-2%201%200%201c2%201%202%201%201%202-2%201-8%200-10-1-1-1-1%2010-1%2054%200%2049%200%2055%202%2054l1-1-2%203-1%2044v42h401V0h-24c-25%200-25%200-26%202l-2%203-1-3c-1-4-3-2-3%202%200%203%200%204-1%203V3c0-3%200-3-3-3h-4v14c-1%203-1%203-1-2%201-6-1-12-2-12-2%200-2%201-1%205%201%209-7%2016-15%2015-5-1-10-5-12-8%200-3-2-4-3-4l-6-5-2-3h-9l-8%201h-1l-29-1h-28v7l-1-3c-1-4-2-5-3-3h-1c0-2-9-1-10%201%200%202-3%204-3%202l2-3c1-1-16-1-101-1H0v16M262%206l-2%203c-1%201-2%203-2%208v5c0-1%201-1%202%201v2l-2%201c0%201%201%202%203%202l2-2h2v6c-1%204%200%205%201%205l1-2%202-2%201-2v-4c2-1%203-4%201-5h-2c-1%201-1%201-1-1v-2c-2%201-3%200-1-1%201-2%201-4-1-4l-2-1c0-1%203-2%204-1%203%202%203%200%200-3-2-2-3-3-3%200v1l-1-3c1-2%201-3-1-3l-1%202m-89%200v1l-1%203h-1c0-4%200-4-5-3l-9%203c-7%201-11%203-11%205l-2%204c-1%201-2%201-1%206l2%206%201%201-1%201c-3-1-5%2011-3%2014l6-6c2-5%209-10%2011-8l1%206v2c1%201%204-2%204-4s-5-6-9-9l-3-2c0-2%205-1%208%200%202%202%207%203%207%202%202-2%203-1%204%202l1%202%201%203%202%205c3%203%203%204%200%204-4%201-5%201-4-1l-2-3c-2-2-2-2-3%200v3l-2%203c-4%201-4%201-4-2l-3-3c-2%200-1%204%201%205s1%202-4%204c-11%203-20%209-24%2015l-4%207c-2%206-6%2010-5%205v-3l-1%202-1%202c-3%200-15%2016-14%2018%201%201-2%2021-3%2022h-1l-2-4c-2-1-4-5-5-7l-4-8c-2-3-2-4-1-4s2-2%202-7c0-2%201-2%203-1%201%201%201%201%201-1l3-5c4-4%204-7%200-8l-2-4-1-4-1-1%203-3c1-2%201-2%202-1%200%202%202%201%202-1l1-2c1-1%201%200%201%201%200%202%200%202%202%202l2-1c3%200%204-4%203-9v-5l3-6c3-5%203-5%2015-5h5l-1-4-1-5v-9l1%201h6l2-2c2-1%202-1%200-1-4-2-6-3-5-5l-1-1c-1%200-2%200-1-1h-9l2%202c2%201%202%202%201%202l-3-1c-1-1-6%200-6%201l2%202v2c-1%201-2%201-2-1-1-3-3-2-3%202l-1%202-1%201c0%202-4%206-10%2010-5%204-5%204-16%204-10%201-11%201-19%205-11%206-15%2010-15%2013l-2%204c-2%200-2%200-1%202h2c2-1%205%204%204%207%200%202%200%202%201%201%200-1%202%201%204%207%206%2011%206%2011%202%2022l-3%206-5%2017c0%205%200%209-2%2013%200%203%200%204%203%206l4%202%202%201%207%202%206%201c1%201%204%200%204-1l2-2%201-3c-1-1-5%201-6%203%200%202%200%202-1%201%200-2-1-2-3-2-2%201-3-1-1-5h2l1%202-1-5c-1-1-2%200-2%201s-2%202-2%200l2-2%201-3c-1-1-5%203-5%205s-2%201-2-1c-1-3%201-6%204-6l3-3c0-2%200-2%202-1v4c-2%201%200%205%201%205l3-2c1-2%202-2%202-1-1%201%200%203%202%204%201%202%202%203%201%204v1h1l2%203%204%204%201%203c0%202%203%204%204%204h7l-1-1v-4l4%203%204%203c2-1%203%200%208%206a96%2096%200%200%200%2029%2026l5%202%205%201c1-1%208%202%208%203h-5l2%202%201%201-4%201c-2%201-2%202%201%205l1%203%204%203c4%202%2013%2012%2012%2013l4%202c4%203%208%206%206%206v1l2%201c3%200%206%205%205%207l-1-1c0-1-1-1-2%201-2%203-3%207-1%207l1-3c0-1%200-2%201-1l1%202h2l1-3%201-2v2h3l5-1c6%200%2014-3%2016-5l3-2c2%200%202-1%202-2v-2c1%200%202%201%202%203%200%203%201%203%204-1l4-3%202-1h-4l-3-1c0-1%205-2%208%200h9l-1-5v-4c0-1-6%200-8%202l-5%201-3%202-2%202-5%203c-2%203-3%203-4%202l-1-2c-5%200-4-11%201-15%202%200%204-2%205-4l3-2c3%200%2014-8%2016-11l4-4%205-4%208-6c8-5%2010-7%206-7l2-1c9-3%2015-14%2011-17-2-2-2-2%201-5l5-7%202-4c1-1%201-1-2-5-3-2-4-4-3-5l-1-4v-2l4%201%202%202%201%202c1%200%202%201%202%203%201%205%203%204%203%200s-3-10-9-19l-2-3%202-1c2-1%204-1%207%201%206%203%207%204%207%201l4-8c5-11%208-27%205-28-2-2-7%201-9%205-2%205-13%2016-16%2017-4%201-7-2-5-6v-4l-1-4c0-7-2-9-9-11l-10-5c-4-2-4-2-5-1s-1%201-3-1l-3-2v-1l-1-1-4%201-1%203v1l-2-2c1-2-1-4-3-4l-1-1-5-5-6-4-10-7-4-4c-2-4-4-5-4-2%200%205-2%204-5-1a71%2071%200%200%200-6-8c-1-4-3-4-2%200v3l-1-3c-2-4-3-4-5%200l-3%202-1-3c-1-3-1-3-4-3h-4c-2-1-1-4%202-3l1-2v-2c1%200%202-1%202-3%200-3-2-4-6-2M29%2023l1%201%201%201c-1%200%205%207%207%207%201%201%201%201-1%201l-3%203-3%202-3%201%204%201h2v1c2%201%201%205-1%206-1%201-1%201%201%201%204%200%208-1%208-3h-1l-1-1%201-1c2%200%200-10-1-11v-1c2%200%201-5-1-6v-2l1-1-5-1c-5%200-6%201-6%202m220%2057c5%2014%206%2024%205%2039%200%209-3%2021-3%2016l-3%2012%203-3c3-4%204-5%203-8%200-3%200-4%202-6l3-3c0-2%206-7%208-7l1-1c0-2%2010-4%2011-2h1c0-2%201-2%204-2l1-1-3-1-1-2c0-3-2-8-4-8v1c0%201-3%204-4%203l-1%201c1%203-1%207-3%206l-2%201-2%201%201-2%201-3%201-2%204-3-4-2-4-4-2-3-1-3-1-1-1-2c0-2-3-6-7-10-3-3-3-3-3-1m52%2024c-2%202-2%2017%200%2017l3%202%202%201c1%200%202-17%200-20%200-2-3-2-5%200m-77%207%202%202c4%200%202%202-2%202-5%201-5%201-5%205l3%202c1-1%201%200%202%202s2%203%204%200l2-1c0%201%200%202-2%203v2l1%202%201%202c1%200%202-1%201-2%200-2%202-3%208-2%203%200%205-5%203-6v-2c2%200%201-3-1-3-1-1-2%200-3%201-1%202-1%202-2%201v-2c2-2%201-3-3-3l-4-2-1-1-2-1-1-1-1%202m-34%202%201%201v9l-2%204-1%204c0%203%200%203-2%203-3-1-4%204-1%205%202%201%206-2%204-3v-1l4-2c2-3%209-4%2011-2%200%201-3%202-5%201l-1%201c1%202%204%202%205%201s3-2%204-1l-2-3c-3-2-3-2-2-5%201-2%201-2-1-4l-2-2-1-2-3-2-2-1c-1-2-4-3-4-1m55%2037a61%2061%200%200%201-12%2018l-2%202-5%203-3%202-4%202-5%201-4%201h7l-3%202-2%203%202-1%202-1%202-1%201-2%205-2%204-1%203-1%204-3%205-3%204-3%202-2c2-2%203-3%202-6l-1-7c1-4-1-4-2-1m54%206-2%203-2%201-1%203-1%201-3%204-2%203-3%203c-1%203-2%204-4%205l-4%202-6%205c-7%204-19%2017-18%2018%202%201%201%202-1%201-2%200-2%200-2%202%201%202%200%202-1%202-1-1-1%200-1%202s0%203%201%202c0-2%202-1%202%201h1c1-2%205-5%2013-8l12-7%2017-3c3%200%203-1%205-4l3-6c2-1%202-2%201-2v-2c2-2%203-10%202-12l-1%201-1%201-2-2-2-3c-1-2-1-7%202-10v-3l-2%202m-260%207c-2%200-2%201-1%203v1l-2%202c0%202-4%203-4%202-1-1-1%200-1%201l1%203%201%201h-2c-2%200-2%200-1%201l-1%201-2%201v8h-2c0-3-2%200-3%204%200%205%200%207%203%206v-1l1-3%202-4c1-2%201-3%202-2s4%201%204-1-2-3-2-1h-1c1-4%203-3%205%200%202%204%203%204%203%202v-3l-2-3h1l3%201c2%200%205%204%205%206s0%202-1%201c0-2-1-2-1-1-1%201-2%201-2-1-1-1-1-1-1%201s3%204%205%203l2-2h1l2-1h2c1%201%202%202%203%201%202%200%202%200%201%202v2l1%202-1%201c-1-1-1%200-1%201%200%204%201%204%203%200l2-2v2c-1%202%201%205%203%205l1-2-1-2c1-2%203-1%203%200v3l1-1%202-2%202-1%201-2c1%200%205-6%204-7%200-2-3%201-3%203l-1%202c-1-1-2%200-2%201l-2%202c-2%200-3-2-1-4%201-1%202-7%201-8v-1l-1-1-2-1-1-1-1%203c0%202-1%203-3%200l-4-2c-3%200-3-1-3-4l1-13c1-2%201-2-3-2-3%200-3%201-3%202%201%202-2%207-3%207l-1-2-2-2c-2%200-2%200-2-2v-3l-2%201m54%209%201%202c2%200%201%203-1%205l-2%201-1-2-1-1-1-1c-1%200-2%201-2%203s0%202%201%201c1-2%201-2%201%200l2%202c1%200%202%204%200%204l-1%202%203-2c3-3%205-3%203%200-2%204-2%204%201%204%202%200%203-1%203-2%200-4-2-9-2-7s0%202-1%201v-2l1-2v-2l1%202c1%202%205%204%206%203s-1-3-3-3l-3-4c-1-3-1-3-2-1-1%201-1%201-1-1%201-1%200-2-1-2l-1%202m52%2029v8l-1%204c-1-1-1%201-1%206%201%207%201%208%204%2011%202%202%204%202%202%200l-1-3%202%201c2%203%202%203%201%204-2%201-1%202%202%203l3-1c0-2%204%200%206%203%203%203%203%203%203-2%200-4%200-4%201-2l2%205c2%203%201%205-1%205-2%201-3%200-1-2%201-1%201-1-2-1h-2l-2-3h-5l1%201c3%200%204%203%202%205-2%203-2%206%201%2010l2%201%201-2v4c0%203%201%204%204%202%201-1%201-1-1-4-2-5-3-7-1-5h2c1-1%201%200%202%203l1%204%202-2%202-4%201-3c2-2%204-9%203-12l-1-4c0-2%200-2%201%200h2l2%201h2l1%202%201%203%202-2v-5c-1%200-2-1-2-3-1-2-1-2-2-1h-1l-1-1-5-3c-4-4-5-5-5-2h-1l-1-2c-2%200-2%200-1-1v-2c-3-2-4-2-8%200l-2%201v-3c1-2%201-3-5-8-6-6-8-7-8-4M37%20211l-1%202-1-1h-3l-1%201c2%200%202%201%202%202-1%203%201%205%204%203h1l2%201c1-1%202%201%200%202-2%200-12-2-11-3l-1-1-2%201-1%205-2%205-1%202v-2l-1-2c-2%200-2%205%200%209l3%202v1c0%202%200%202%201%201l1%201v1l2%203%203%202%201%201v1l2%201%203%202%207%204c4%203%205%203%205-2l-1-3-1-1c-1-1-1%200-1%201l-1%203-1-3v-2l-1%202-1%201c0-2-1-2-2-2-1%201-1%201-1-1%201-2-2-4-4-2-1%202-2%200-1-3%202-2%201-4-1-2-2%201-2%201-2-1l1-2%203-3c1-2%202-3%203-2v3c-2%203%200%207%204%207%201-1%202%200%203%201h1l3-1%202-1%201-1c2%200%201%204%200%205-2%202-2%203%200%205%202%201%202%201%202-2s0-3%201-2%202%200%203-1v-5c1-2%200-6-1-6l-1-1%202-1%202%202%201%202%201-2v-3l1%201c0%202%203%201%204-1%202-2%202-2-1-4h-3l-5%203c-2%200-1-5%200-5v-2l-1-3c1-2%203-3%203%200h2v-3l2-3%202-2v3c-1%204-1%204%203%200l2-3c-1-2-6-2-8%200l-3%201h-2c-1%202-9%202-10%201h-3c-4%202-6%201-6-3%201-2%200-3-1-3-2%200-2%200-1%202\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}},{"id":"32b0a6e0-73d8-526e-a79b-a8c1c6c3635f","title":"vegitable soup","cookTime":4,"prepTime":4,"content":{"tags":["lunch","dinner"]},"image":{"gatsbyImageData":{"images":{"sources":[{"srcSet":"https://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=250&h=167&q=50&fm=webp 250w,\\nhttps://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=500&h=334&q=50&fm=webp 500w,\\nhttps://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=1000&h=667&q=50&fm=webp 1000w","sizes":"(min-width: 1000px) 1000px, 100vw","type":"image/webp"}],"fallback":{"src":"https://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=1000&h=667&fl=progressive&q=50&fm=jpg","srcSet":"https://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=250&h=167&fl=progressive&q=50&fm=jpg 250w,\\nhttps://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=500&h=334&fl=progressive&q=50&fm=jpg 500w,\\nhttps://images.ctfassets.net/qucxnkqed615/6wGyc1rSasHSUbdzVRn8CB/0fee37dd6c6712fc646b1b3960c0ac86/recipe-3.jpeg?w=1000&h=667&fl=progressive&q=50&fm=jpg 1000w","sizes":"(min-width: 1000px) 1000px, 100vw"}},"layout":"constrained","width":1000,"height":667,"placeholder":{"fallback":"data:image/svg+xml,%3csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'400\'%20height=\'267\'%20viewBox=\'0%200%20400%20267\'%20preserveAspectRatio=\'none\'%3e%3cpath%20d=\'m80%202-1%201-1%201%204%201%206%201c1%202%201%202%202%201%202-1%206%201%206%203h1c2-1%204%202%203%205l2%201h3c1%201%206-1%208-3l3-2c1%200%201%201-1%202l5-1a117%20117%200%200%201%20143%20113c2%2050-22%2091-65%20113-44%2023-99%2014-134-22-1-1-2-2-3-1l-3-1h-2l-6-1-9-1-6%201c-1%201-1%201%201%201s3%201%203%202l9%201%208%201H8c-8%200-7-2%200-2l5-1h3l8%201h9l-6-1-4-1-18-2H0v55h314v-4l2-6%201-3c0-5%201-6%205-5l5-1h2c0%203%204%203%206%201s3-2%205-1a69%2069%200%200%200%205%201c2%201%206%201%207-1h3l2-1c0-2%202-1%203%202%201%204%201%204%203%201l2-2v2l-2%206v8c-2%202-1%203%204%203%203%200%205-1%205-2%200-3%206-2%206%201l1-1%202-6%201-3-1-2c0-1%201-1%202%201%203%203%204%205%201%207-2%204-1%205%205%205%205%200%206%200%206-2h1c0%202%201%202%202%202h3v-66l-3%201-4-1c-1-1-2-2-3-1l-7-3%202-2%203-1h-3c-3%200-3-2%200-4%203-1%203-3%200-3-2%200-4%202-5%204-2%203-5%204-4%202%201-1%200-3-1-4-2-2-2-2-1-6l1-6%202-1c2%200%203-1%203-4%201-4%201-4%2014-10l5-2v-46h-4c-3%200-4%200-4%202h-1l-7-1-5-1%202-1c2%200%202%200%201-2h-3l-5%201c-3%200-3%200-2%202h-1c-1%200-2-1-1-2l-1-1-1-1%206-1c7-1%208-3%202-3l-4-1c-1-2-5-3-5-2l2%201%202%202c0%202-3%202-4%201h-3l-3%202-4-1-1-1c1-2%200-3-3-3h-3l2-2c2-2%202-2%200-2h-2l-1%203v-1c0-2-2-4-5-3l-5-2c-1-1-1-1%202-1h4v-1l-1-2h-5c-5%200-5%200-4-2%203-3%201-4-4-4h-4l1-1%201-1c1-2%201-2-1-2-2%201-2%200-1-1%200-2-1-3-3-1h-1v-1l-2-1v-1c1-2%200-3-3-3l-2-1c0-2%200-2%202-1l1-1v-3h-4l-3%201-2-1c-2%200-3-1-3-3l-2-3%201-1c2-1%201-1-4-1l-6-2-1-3-2-2h-2c-1%202-2%200-2-4%200-2%200-3-1-2%200%201-6-9-6-12l-3-13-3-18V0h-98C92%200%2080%200%2080%202m225-1%202%202-2%204-1%201-1%202a34231%2034231%200%200%200%202%206c-1-1-5%202-4%203%203%202%2020-11%2021-17%201-2%201-2-9-2l-8%201m68%2019-1%205-1-2c-1-3-3-4-3-1l1%201c1%200%200%203-2%205l-1%203c1%201%200%202-1%202-2%201-2%202-1%205%200%204%200%204-2%205l-2%201c0%202%203%201%204-1l4-1c1%201%202%200%203-3%202-3%205-5%208-3l2-1%201-2%201%202-1%201-1%201h7l1-3v-2l1-1-2-1c-2%201-2%201-1-2%200-2%200-3-3-6l-3-3-1%204-4%205c-1%201-1%201-1-1v-5c0-1%201-2%202-1l1-1-2-1c-2-1-2-1-3%201M133%2038l-4%201c-4%200-16%206-25%2012a96%2096%200%200%200-16%20143c15%2015%2039%2027%2041%2020%201-2%201-3-2-4l-3-2c1-1-1-4-3-4l-1-1-2-3-2-2-1-2c-3-1-6-8-8-14l-3-4-2-2-1-7-2-11-1-6v-8l-1-8-1%202h-1v-3c1-3%201-4-1-4-3%200-4-3-3-11v-10c-1-2-1-3%201-3l2-1c0-1%200-3%202-5l4-12%204-5c3-3%203-3%201-4-1-2-1-2%202-6l8-7%202-2%201-2%205-3%204-4%205-4%205-5%203-2%201-3c2-3-3-6-8-4m265%201-1%204-1%202-2-1-2-2v1c0%202%200%202-2%202l-2%202c-1%202-3%201-3-1s-1-3-4%200h-3l-1%201c1%201%200%203-1%203-2%201-2%202-2%203h-2l-1%201-2%201-2%202c-1%202-2%202-5%202-2-1-3%200-3%201l-1%202-1%201c0%201-1%203-3%203l-1%202c1%201%205-1%208-4l4-3%202-1h1l4-1%203-1%203-1v-1c1%200%202%201%201%202l-2%202c-3%200-2%202%202%202%201%201%201%201-1%201-3%200-2%203%202%205%203%202%205%202%205%200h-1c-1%201-1%201-1-2l1-5%201-1%202-1v-2h-3c0-1%202-2%205-2l6-2c1-2%204-3%204-1l-1%201v2l1%203-2-1c0-2-3-1-3%201l1%201%201%201h-1l-2%201c-1%201%200%201%202%201%203%200%204%200%204-2l1-23-2%202m-30%2040-1%204-3%203c-3%202-4%205-1%205l4%201c2%202%203%202%203%201v-1l3%201%202%201v-1c-1-2%200-2%203-3l7-3-6%201h-2l-2%201-3%201-4%201c-1%201-1%200-1-1%200-2%201-3%202-2l2-1-1-2%201-6v-2l-3%202M86%2082l-1%203-2%204c-2%202-5%2015-5%2019l-1%206c-4%207-4%2025-1%2025l3%203c2%204%203%204%202-2%200-5%201-7%205-5l3%202-3-8c-2-4-3-12-2-14%201-3%201-3-1-3v-8c-1-6%200-10%203-16%202-5%203-8%200-6m63%2024a37%2037%200%200%201-1%207c0%201-1%201-3-1-2-3-2-3-3-2v3c1-1%202%200%203%202v2l1%202c2%203%204%201%204-4v-3l1%203%203%204-1%202-4%203-2%202h-6v2l-2-2c0-4%200-5-1-2-2%204%201%209%204%206%201-2%203-1%203%202%202%207%202%208%201%208l-1%203-3%203c-3%201-6%204-5%205l5-3c7-5%207-6%206-6v-2l1-2v-2c2%200%202-3%200-6v-1l4%201h2c3-2%204%200%202%202s-3%204-1%203l1%202%201%204c1%201%201%201%201-1-1-2-1-2%205-2h4c-2-2-1-4%203-8%203-3%204-5%202-5l-1-2h2l1%201%201%201v-11c0-2-2-3-4-1-7%205-12%207-12%204l-1-1c-1%201-4-2-4-4l2-2%201-1c0-3-6-3-6%200v-2l-1-4c-1%200-2%201-2%203m148%2073-2%203h2v2l2%203%202%202h-3c-4-1-4-1-5%203-3%205%201%2018%205%2022l2%205c0%205-2%206-3%203l-1-3-1-2c2-6-4-6-8%200-3%205-2%2014%201%2014l1%201-1%201h-1c0%202-8%203-16%203-2%200-3%200-3%202v1c-2%200-3%203-2%206h1l1%201%201%201c1-1%203%201%206%202%205%204%2010%204%2017-1l6-3%202-2h1l2%201%202%201%202%201c2%200%203-1%202-2s-1-1%201-1l2%202%204%201c2%200%202%200%201-1l-1-2%202%201c1%201%203%202%207%202%206%200%208-2%207-8%200-4%202-7%206-5%203%201%205-1%203-3v-1l3%202c1%202%204-4%204-7s0-3-2-2c-2%200-2%200%200-4v-8l-1-3c0-3-3-8-4-7v6l1%205c2%203%202%204%201%204l-1%203c0%202-1%202-3-1l-2-4-3-5c-3-2-5-5-4-6l-2-1v-1c2-2%202-2-4-3l-3-2-2-3-1-3c1-2-1-4-3-4l-3-1%202-1c5%201%206%200%204-2-5-3-19-5-21-2M0%20191v7h34v1h15c1%200%200-3-2-5s-14-3-28-3c-8%200-11-1-6-2l4-1h-5c-5%200-5-2%201-2%203%200%203%200-2-2-11-2-11-2-11%207m378%2032c0%201%206%207%2011%2010%205%202%205%204%200%202-5-1-5-1-4%202s6%208%2012%2011l3%201v-7c0-7-1-9-7-9l-1-1-6-4-5-5h-3\'%20fill=\'%23d3d3d3\'%20fill-rule=\'evenodd\'/%3e%3c/svg%3e"}}}}]}}}');

/***/ }),

/***/ "./public/page-data/sq/d/2468095761.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/2468095761.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"site":{"siteMetadata":{"title":"veggie foodie","description":"Nice and clean recipes site"}}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-recipe-js.js.map