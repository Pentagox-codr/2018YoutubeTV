window.labels = { default: "86e4ce33" };
(function () {
  var f;
  function aa(a) {
    var b = 0;
    return function () {
      return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
    };
  }
  var ba =
      "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, b, c) {
            a != Array.prototype && a != Object.prototype && (a[b] = c.value);
          },
    l =
      "undefined" != typeof window && window === this
        ? this
        : "undefined" != typeof global && null != global
          ? global
          : this;
  function ca() {
    ca = function () {};
    l.Symbol || (l.Symbol = da);
  }
  function ea(a, b) {
    this.$jscomp$symbol$id_ = a;
    ba(this, "description", { configurable: !0, writable: !0, value: b });
  }
  ea.prototype.toString = function () {
    return this.$jscomp$symbol$id_;
  };
  var da = (function () {
    function a(c) {
      if (this instanceof a) throw new TypeError("Symbol is not a constructor");
      return new ea("jscomp_symbol_" + (c || "") + "_" + b++, c);
    }
    var b = 0;
    return a;
  })();
  function fa() {
    ca();
    var a = l.Symbol.iterator;
    a || (a = l.Symbol.iterator = l.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[a] &&
      ba(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
          return ha(aa(this));
        },
      });
    fa = function () {};
  }
  function ha(a) {
    fa();
    a = { next: a };
    a[l.Symbol.iterator] = function () {
      return this;
    };
    return a;
  }
  function r(a) {
    var b =
      "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : { next: aa(a) };
  }
  var ia =
      "function" == typeof Object.create
        ? Object.create
        : function (a) {
            function b() {}
            b.prototype = a;
            return new b();
          },
    ja;
  if ("function" == typeof Object.setPrototypeOf) ja = Object.setPrototypeOf;
  else {
    var ka;
    a: {
      var la = { a: !0 },
        ma = {};
      try {
        ma.__proto__ = la;
        ka = ma.a;
        break a;
      } catch (a) {}
      ka = !1;
    }
    ja = ka
      ? function (a, b) {
          a.__proto__ = b;
          if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
          return a;
        }
      : null;
  }
  var na = ja;
  function oa(a, b) {
    a.prototype = ia(b.prototype);
    a.prototype.constructor = a;
    if (na) na(a, b);
    else
      for (var c in b)
        if ("prototype" != c)
          if (Object.defineProperties) {
            var d = Object.getOwnPropertyDescriptor(b, c);
            d && Object.defineProperty(a, c, d);
          } else a[c] = b[c];
    a.superClass_ = b.prototype;
  }
  function t(a, b) {
    if (b) {
      var c = l;
      a = a.split(".");
      for (var d = 0; d < a.length - 1; d++) {
        var e = a[d];
        e in c || (c[e] = {});
        c = c[e];
      }
      a = a[a.length - 1];
      d = c[a];
      b = b(d);
      b != d &&
        null != b &&
        ba(c, a, { configurable: !0, writable: !0, value: b });
    }
  }
  function pa(a, b) {
    fa();
    a instanceof String && (a += "");
    var c = 0,
      d = {
        next: function () {
          if (c < a.length) {
            var e = c++;
            return { value: b(e, a[e]), done: !1 };
          }
          d.next = function () {
            return { done: !0, value: void 0 };
          };
          return d.next();
        },
      };
    d[Symbol.iterator] = function () {
      return d;
    };
    return d;
  }
  t(
    "Array.prototype.keys",
    function (a) {
      return a
        ? a
        : function () {
            return pa(this, function (b) {
              return b;
            });
          };
    },
    "es6",
    "es3",
  );
  t(
    "Array.prototype.values",
    function (a) {
      return a
        ? a
        : function () {
            return pa(this, function (b, c) {
              return c;
            });
          };
    },
    "es8",
    "es3",
  );
  function u(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }
  var qa =
    "function" == typeof Object.assign
      ? Object.assign
      : function (a, b) {
          for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (d) for (var e in d) u(d, e) && (a[e] = d[e]);
          }
          return a;
        };
  t(
    "Object.assign",
    function (a) {
      return a || qa;
    },
    "es6",
    "es3",
  );
  t(
    "Promise",
    function (a) {
      function b(h) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var k = this.createResolveAndReject_();
        try {
          h(k.resolve, k.reject);
        } catch (m) {
          k.reject(m);
        }
      }
      function c() {
        this.batch_ = null;
      }
      function d(h) {
        return h instanceof b
          ? h
          : new b(function (k) {
              k(h);
            });
      }
      if (a) return a;
      c.prototype.asyncExecute = function (h) {
        if (null == this.batch_) {
          this.batch_ = [];
          var k = this;
          this.asyncExecuteFunction(function () {
            k.executeBatch_();
          });
        }
        this.batch_.push(h);
      };
      var e = l.setTimeout;
      c.prototype.asyncExecuteFunction = function (h) {
        e(h, 0);
      };
      c.prototype.executeBatch_ = function () {
        for (; this.batch_ && this.batch_.length; ) {
          var h = this.batch_;
          this.batch_ = [];
          for (var k = 0; k < h.length; ++k) {
            var m = h[k];
            h[k] = null;
            try {
              m();
            } catch (n) {
              this.asyncThrow_(n);
            }
          }
        }
        this.batch_ = null;
      };
      c.prototype.asyncThrow_ = function (h) {
        this.asyncExecuteFunction(function () {
          throw h;
        });
      };
      b.prototype.createResolveAndReject_ = function () {
        function h(n) {
          return function (p) {
            m || ((m = !0), n.call(k, p));
          };
        }
        var k = this,
          m = !1;
        return { resolve: h(this.resolveTo_), reject: h(this.reject_) };
      };
      b.prototype.resolveTo_ = function (h) {
        if (h === this)
          this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (h instanceof b) this.settleSameAsPromise_(h);
        else {
          a: switch (typeof h) {
            case "object":
              var k = null != h;
              break a;
            case "function":
              k = !0;
              break a;
            default:
              k = !1;
          }
          k ? this.resolveToNonPromiseObj_(h) : this.fulfill_(h);
        }
      };
      b.prototype.resolveToNonPromiseObj_ = function (h) {
        var k = void 0;
        try {
          k = h.then;
        } catch (m) {
          this.reject_(m);
          return;
        }
        "function" == typeof k
          ? this.settleSameAsThenable_(k, h)
          : this.fulfill_(h);
      };
      b.prototype.reject_ = function (h) {
        this.settle_(2, h);
      };
      b.prototype.fulfill_ = function (h) {
        this.settle_(1, h);
      };
      b.prototype.settle_ = function (h, k) {
        if (0 != this.state_)
          throw Error(
            "Cannot settle(" +
              h +
              ", " +
              k +
              "): Promise already settled in state" +
              this.state_,
          );
        this.state_ = h;
        this.result_ = k;
        this.executeOnSettledCallbacks_();
      };
      b.prototype.executeOnSettledCallbacks_ = function () {
        if (null != this.onSettledCallbacks_) {
          for (var h = 0; h < this.onSettledCallbacks_.length; ++h)
            g.asyncExecute(this.onSettledCallbacks_[h]);
          this.onSettledCallbacks_ = null;
        }
      };
      var g = new c();
      b.prototype.settleSameAsPromise_ = function (h) {
        var k = this.createResolveAndReject_();
        h.callWhenSettled_(k.resolve, k.reject);
      };
      b.prototype.settleSameAsThenable_ = function (h, k) {
        var m = this.createResolveAndReject_();
        try {
          h.call(k, m.resolve, m.reject);
        } catch (n) {
          m.reject(n);
        }
      };
      b.prototype.then = function (h, k) {
        function m(x, y) {
          return "function" == typeof x
            ? function (M) {
                try {
                  n(x(M));
                } catch (R) {
                  p(R);
                }
              }
            : y;
        }
        var n,
          p,
          q = new b(function (x, y) {
            n = x;
            p = y;
          });
        this.callWhenSettled_(m(h, n), m(k, p));
        return q;
      };
      b.prototype["catch"] = function (h) {
        return this.then(void 0, h);
      };
      b.prototype.callWhenSettled_ = function (h, k) {
        function m() {
          switch (n.state_) {
            case 1:
              h(n.result_);
              break;
            case 2:
              k(n.result_);
              break;
            default:
              throw Error("Unexpected state: " + n.state_);
          }
        }
        var n = this;
        null == this.onSettledCallbacks_
          ? g.asyncExecute(m)
          : this.onSettledCallbacks_.push(m);
      };
      b.resolve = d;
      b.reject = function (h) {
        return new b(function (k, m) {
          m(h);
        });
      };
      b.race = function (h) {
        return new b(function (k, m) {
          for (var n = r(h), p = n.next(); !p.done; p = n.next())
            d(p.value).callWhenSettled_(k, m);
        });
      };
      b.all = function (h) {
        var k = r(h),
          m = k.next();
        return m.done
          ? d([])
          : new b(function (n, p) {
              function q(M) {
                return function (R) {
                  x[M] = R;
                  y--;
                  0 == y && n(x);
                };
              }
              var x = [],
                y = 0;
              do
                (x.push(void 0),
                  y++,
                  d(m.value).callWhenSettled_(q(x.length - 1), p),
                  (m = k.next()));
              while (!m.done);
            });
      };
      return b;
    },
    "es6",
    "es3",
  );
  t(
    "WeakMap",
    function (a) {
      function b(m) {
        this.id_ = (k += Math.random() + 1).toString();
        if (m) {
          m = r(m);
          for (var n; !(n = m.next()).done; )
            ((n = n.value), this.set(n[0], n[1]));
        }
      }
      function c() {}
      function d(m) {
        var n = typeof m;
        return ("object" === n && null !== m) || "function" === n;
      }
      function e(m) {
        if (!u(m, h)) {
          var n = new c();
          ba(m, h, { value: n });
        }
      }
      function g(m) {
        var n = Object[m];
        n &&
          (Object[m] = function (p) {
            if (p instanceof c) return p;
            e(p);
            return n(p);
          });
      }
      if (
        (function () {
          if (!a || !Object.seal) return !1;
          try {
            var m = Object.seal({}),
              n = Object.seal({}),
              p = new a([
                [m, 2],
                [n, 3],
              ]);
            if (2 != p.get(m) || 3 != p.get(n)) return !1;
            p["delete"](m);
            p.set(n, 4);
            return !p.has(m) && 4 == p.get(n);
          } catch (q) {
            return !1;
          }
        })()
      )
        return a;
      var h = "$jscomp_hidden_" + Math.random();
      g("freeze");
      g("preventExtensions");
      g("seal");
      var k = 0;
      b.prototype.set = function (m, n) {
        if (!d(m)) throw Error("Invalid WeakMap key");
        e(m);
        if (!u(m, h)) throw Error("WeakMap key fail: " + m);
        m[h][this.id_] = n;
        return this;
      };
      b.prototype.get = function (m) {
        return d(m) && u(m, h) ? m[h][this.id_] : void 0;
      };
      b.prototype.has = function (m) {
        return d(m) && u(m, h) && u(m[h], this.id_);
      };
      b.prototype["delete"] = function (m) {
        return d(m) && u(m, h) && u(m[h], this.id_)
          ? delete m[h][this.id_]
          : !1;
      };
      return b;
    },
    "es6",
    "es3",
  );
  t(
    "Map",
    function (a) {
      function b() {
        var k = {};
        return (k.previous = k.next = k.head = k);
      }
      function c(k, m) {
        var n = k.head_;
        return ha(function () {
          if (n) {
            for (; n.head != k.head_; ) n = n.previous;
            for (; n.next != n.head; )
              return ((n = n.next), { done: !1, value: m(n) });
            n = null;
          }
          return { done: !0, value: void 0 };
        });
      }
      function d(k, m) {
        var n = m && typeof m;
        "object" == n || "function" == n
          ? g.has(m)
            ? (n = g.get(m))
            : ((n = "" + ++h), g.set(m, n))
          : (n = "p_" + m);
        var p = k.data_[n];
        if (p && u(k.data_, n))
          for (k = 0; k < p.length; k++) {
            var q = p[k];
            if ((m !== m && q.key !== q.key) || m === q.key)
              return { id: n, list: p, index: k, entry: q };
          }
        return { id: n, list: p, index: -1, entry: void 0 };
      }
      function e(k) {
        this.data_ = {};
        this.head_ = b();
        this.size = 0;
        if (k) {
          k = r(k);
          for (var m; !(m = k.next()).done; )
            ((m = m.value), this.set(m[0], m[1]));
        }
      }
      if (
        (function () {
          if (
            !a ||
            "function" != typeof a ||
            !a.prototype.entries ||
            "function" != typeof Object.seal
          )
            return !1;
          try {
            var k = Object.seal({ x: 4 }),
              m = new a(r([[k, "s"]]));
            if (
              "s" != m.get(k) ||
              1 != m.size ||
              m.get({ x: 4 }) ||
              m.set({ x: 4 }, "t") != m ||
              2 != m.size
            )
              return !1;
            var n = m.entries(),
              p = n.next();
            if (p.done || p.value[0] != k || "s" != p.value[1]) return !1;
            p = n.next();
            return p.done ||
              4 != p.value[0].x ||
              "t" != p.value[1] ||
              !n.next().done
              ? !1
              : !0;
          } catch (q) {
            return !1;
          }
        })()
      )
        return a;
      fa();
      var g = new WeakMap();
      e.prototype.set = function (k, m) {
        k = 0 === k ? 0 : k;
        var n = d(this, k);
        n.list || (n.list = this.data_[n.id] = []);
        n.entry
          ? (n.entry.value = m)
          : ((n.entry = {
              next: this.head_,
              previous: this.head_.previous,
              head: this.head_,
              key: k,
              value: m,
            }),
            n.list.push(n.entry),
            (this.head_.previous.next = n.entry),
            (this.head_.previous = n.entry),
            this.size++);
        return this;
      };
      e.prototype["delete"] = function (k) {
        k = d(this, k);
        return k.entry && k.list
          ? (k.list.splice(k.index, 1),
            k.list.length || delete this.data_[k.id],
            (k.entry.previous.next = k.entry.next),
            (k.entry.next.previous = k.entry.previous),
            (k.entry.head = null),
            this.size--,
            !0)
          : !1;
      };
      e.prototype.clear = function () {
        this.data_ = {};
        this.head_ = this.head_.previous = b();
        this.size = 0;
      };
      e.prototype.has = function (k) {
        return !!d(this, k).entry;
      };
      e.prototype.get = function (k) {
        return (k = d(this, k).entry) && k.value;
      };
      e.prototype.entries = function () {
        return c(this, function (k) {
          return [k.key, k.value];
        });
      };
      e.prototype.keys = function () {
        return c(this, function (k) {
          return k.key;
        });
      };
      e.prototype.values = function () {
        return c(this, function (k) {
          return k.value;
        });
      };
      e.prototype.forEach = function (k, m) {
        for (var n = this.entries(), p; !(p = n.next()).done; )
          ((p = p.value), k.call(m, p[1], p[0], this));
      };
      e.prototype[Symbol.iterator] = e.prototype.entries;
      var h = 0;
      return e;
    },
    "es6",
    "es3",
  );
  t(
    "Set",
    function (a) {
      function b(c) {
        this.map_ = new Map();
        if (c) {
          c = r(c);
          for (var d; !(d = c.next()).done; ) this.add(d.value);
        }
        this.size = this.map_.size;
      }
      if (
        (function () {
          if (
            !a ||
            "function" != typeof a ||
            !a.prototype.entries ||
            "function" != typeof Object.seal
          )
            return !1;
          try {
            var c = Object.seal({ x: 4 }),
              d = new a(r([c]));
            if (
              !d.has(c) ||
              1 != d.size ||
              d.add(c) != d ||
              1 != d.size ||
              d.add({ x: 4 }) != d ||
              2 != d.size
            )
              return !1;
            var e = d.entries(),
              g = e.next();
            if (g.done || g.value[0] != c || g.value[1] != c) return !1;
            g = e.next();
            return g.done ||
              g.value[0] == c ||
              4 != g.value[0].x ||
              g.value[1] != g.value[0]
              ? !1
              : e.next().done;
          } catch (h) {
            return !1;
          }
        })()
      )
        return a;
      fa();
      b.prototype.add = function (c) {
        c = 0 === c ? 0 : c;
        this.map_.set(c, c);
        this.size = this.map_.size;
        return this;
      };
      b.prototype["delete"] = function (c) {
        c = this.map_["delete"](c);
        this.size = this.map_.size;
        return c;
      };
      b.prototype.clear = function () {
        this.map_.clear();
        this.size = 0;
      };
      b.prototype.has = function (c) {
        return this.map_.has(c);
      };
      b.prototype.entries = function () {
        return this.map_.entries();
      };
      b.prototype.values = function () {
        return this.map_.values();
      };
      b.prototype.keys = b.prototype.values;
      b.prototype[Symbol.iterator] = b.prototype.values;
      b.prototype.forEach = function (c, d) {
        var e = this;
        this.map_.forEach(function (g) {
          return c.call(d, g, g, e);
        });
      };
      return b;
    },
    "es6",
    "es3",
  );
  t(
    "Object.is",
    function (a) {
      return a
        ? a
        : function (b, c) {
            return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
          };
    },
    "es6",
    "es3",
  );
  t(
    "Array.prototype.includes",
    function (a) {
      return a
        ? a
        : function (b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
              var g = d[c];
              if (g === b || Object.is(g, b)) return !0;
            }
            return !1;
          };
    },
    "es7",
    "es3",
  );
  t(
    "String.prototype.includes",
    function (a) {
      return a
        ? a
        : function (b, c) {
            if (null == this)
              throw new TypeError(
                "The 'this' value for String.prototype.includes must not be null or undefined",
              );
            if (b instanceof RegExp)
              throw new TypeError(
                "First argument to String.prototype.includes must not be a regular expression",
              );
            return -1 !== (this + "").indexOf(b, c || 0);
          };
    },
    "es6",
    "es3",
  );
  var ra = ra || {},
    v = this || self;
  function w(a) {
    return void 0 !== a;
  }
  function z(a) {
    return "string" == typeof a;
  }
  function sa(a) {
    return "number" == typeof a;
  }
  function ta(a, b) {
    a = a.split(".");
    b = b || v;
    for (var c = 0; c < a.length; c++)
      if (((b = b[a[c]]), null == b)) return null;
    return b;
  }
  function ua() {}
  function A(a) {
    var b = typeof a;
    if ("object" == b)
      if (a) {
        if (a instanceof Array) return "array";
        if (a instanceof Object) return b;
        var c = Object.prototype.toString.call(a);
        if ("[object Window]" == c) return "object";
        if (
          "[object Array]" == c ||
          ("number" == typeof a.length &&
            "undefined" != typeof a.splice &&
            "undefined" != typeof a.propertyIsEnumerable &&
            !a.propertyIsEnumerable("splice"))
        )
          return "array";
        if (
          "[object Function]" == c ||
          ("undefined" != typeof a.call &&
            "undefined" != typeof a.propertyIsEnumerable &&
            !a.propertyIsEnumerable("call"))
        )
          return "function";
      } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b;
  }
  function va(a) {
    return "array" == A(a);
  }
  function wa(a) {
    var b = A(a);
    return "array" == b || ("object" == b && "number" == typeof a.length);
  }
  function xa(a) {
    var b = typeof a;
    return ("object" == b && null != a) || "function" == b;
  }
  function ya(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function za(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);
      return function () {
        var e = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(e, d);
        return a.apply(b, e);
      };
    }
    return function () {
      return a.apply(b, arguments);
    };
  }
  function B(a, b, c) {
    B =
      Function.prototype.bind &&
      -1 != Function.prototype.bind.toString().indexOf("native code")
        ? ya
        : za;
    return B.apply(null, arguments);
  }
  function Aa(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function () {
      var d = c.slice();
      d.push.apply(d, arguments);
      return a.apply(this, d);
    };
  }
  var C =
    Date.now ||
    function () {
      return +new Date();
    };
  function D(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.base = function (d, e, g) {
      for (
        var h = Array(arguments.length - 2), k = 2;
        k < arguments.length;
        k++
      )
        h[k - 2] = arguments[k];
      return b.prototype[e].apply(d, h);
    };
  }
  function Ba(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, Ba);
    else {
      var b = Error().stack;
      b && (this.stack = b);
    }
    a && (this.message = String(a));
    this.reportErrorToServer = !0;
  }
  D(Ba, Error);
  Ba.prototype.name = "CustomError";
  function Ca(a, b) {
    Ba.call(this, Da(a, b));
    this.messagePattern = a;
  }
  D(Ca, Ba);
  Ca.prototype.name = "AssertionError";
  function Da(a, b) {
    a = a.split("%s");
    for (var c = "", d = a.length - 1, e = 0; e < d; e++)
      c += a[e] + (e < b.length ? b[e] : "%s");
    return c + a[d];
  }
  function Ea(a, b, c, d) {
    var e = "Assertion failed";
    if (c) {
      e += ": " + c;
      var g = d;
    } else a && ((e += ": " + a), (g = b));
    throw new Ca("" + e, g || []);
  }
  function E(a, b, c) {
    a || Ea("", null, b, Array.prototype.slice.call(arguments, 2));
    return a;
  }
  function Fa(a, b) {
    throw new Ca(
      "Failure" + (a ? ": " + a : ""),
      Array.prototype.slice.call(arguments, 1),
    );
  }
  function Ga(a, b, c) {
    sa(a) ||
      Ea(
        "Expected number but got %s: %s.",
        [A(a), a],
        b,
        Array.prototype.slice.call(arguments, 2),
      );
    return a;
  }
  function Ha(a, b, c) {
    z(a) ||
      Ea(
        "Expected string but got %s: %s.",
        [A(a), a],
        b,
        Array.prototype.slice.call(arguments, 2),
      );
    return a;
  }
  var Ia = Array.prototype.indexOf
      ? function (a, b, c) {
          E(null != a.length);
          return Array.prototype.indexOf.call(a, b, c);
        }
      : function (a, b, c) {
          c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
          if (z(a)) return z(b) && 1 == b.length ? a.indexOf(b, c) : -1;
          for (; c < a.length; c++) if (c in a && a[c] === b) return c;
          return -1;
        },
    Ja = Array.prototype.forEach
      ? function (a, b, c) {
          E(null != a.length);
          Array.prototype.forEach.call(a, b, c);
        }
      : function (a, b, c) {
          for (var d = a.length, e = z(a) ? a.split("") : a, g = 0; g < d; g++)
            g in e && b.call(c, e[g], g, a);
        };
  function Ka(a, b, c) {
    a: {
      for (var d = a.length, e = z(a) ? a.split("") : a, g = 0; g < d; g++)
        if (g in e && b.call(c, e[g], g, a)) {
          b = g;
          break a;
        }
      b = -1;
    }
    return 0 > b ? null : z(a) ? a.charAt(b) : a[b];
  }
  function La(a, b) {
    b = Ia(a, b);
    var c;
    (c = 0 <= b) && Ma(a, b);
    return c;
  }
  function Ma(a, b) {
    E(null != a.length);
    return 1 == Array.prototype.splice.call(a, b, 1).length;
  }
  function Na(a) {
    return Array.prototype.concat.apply([], arguments);
  }
  function Oa(a) {
    var b = a.length;
    if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
      return c;
    }
    return [];
  }
  function Pa(a, b, c) {
    this.limit_ = c;
    this.create_ = a;
    this.reset_ = b;
    this.occupants_ = 0;
    this.head_ = null;
  }
  Pa.prototype.get = function () {
    if (0 < this.occupants_) {
      this.occupants_--;
      var a = this.head_;
      this.head_ = a.next;
      a.next = null;
    } else a = this.create_();
    return a;
  };
  Pa.prototype.put = function (a) {
    this.reset_(a);
    this.occupants_ < this.limit_ &&
      (this.occupants_++, (a.next = this.head_), (this.head_ = a));
  };
  Pa.prototype.occupants = function () {
    return this.occupants_;
  };
  function F(a) {
    this.tagName_ = a;
  }
  F.prototype.toString = function () {
    return this.tagName_;
  };
  new F("A");
  new F("ABBR");
  new F("ACRONYM");
  new F("ADDRESS");
  new F("APPLET");
  new F("AREA");
  new F("ARTICLE");
  new F("ASIDE");
  new F("AUDIO");
  new F("B");
  new F("BASE");
  new F("BASEFONT");
  new F("BDI");
  new F("BDO");
  new F("BIG");
  new F("BLOCKQUOTE");
  new F("BODY");
  new F("BR");
  new F("BUTTON");
  new F("CANVAS");
  new F("CAPTION");
  new F("CENTER");
  new F("CITE");
  new F("CODE");
  new F("COL");
  new F("COLGROUP");
  new F("COMMAND");
  new F("DATA");
  new F("DATALIST");
  new F("DD");
  new F("DEL");
  new F("DETAILS");
  new F("DFN");
  new F("DIALOG");
  new F("DIR");
  new F("DIV");
  new F("DL");
  new F("DT");
  new F("EM");
  new F("EMBED");
  new F("FIELDSET");
  new F("FIGCAPTION");
  new F("FIGURE");
  new F("FONT");
  new F("FOOTER");
  new F("FORM");
  new F("FRAME");
  new F("FRAMESET");
  new F("H1");
  new F("H2");
  new F("H3");
  new F("H4");
  new F("H5");
  new F("H6");
  new F("HEAD");
  new F("HEADER");
  new F("HGROUP");
  new F("HR");
  new F("HTML");
  new F("I");
  new F("IFRAME");
  new F("IMG");
  new F("INPUT");
  new F("INS");
  new F("ISINDEX");
  new F("KBD");
  new F("KEYGEN");
  new F("LABEL");
  new F("LEGEND");
  new F("LI");
  new F("LINK");
  new F("MAIN");
  new F("MAP");
  new F("MARK");
  new F("MATH");
  new F("MENU");
  new F("MENUITEM");
  new F("META");
  new F("METER");
  new F("NAV");
  new F("NOFRAMES");
  new F("NOSCRIPT");
  new F("OBJECT");
  new F("OL");
  new F("OPTGROUP");
  new F("OPTION");
  new F("OUTPUT");
  new F("P");
  new F("PARAM");
  new F("PICTURE");
  new F("PRE");
  new F("PROGRESS");
  new F("Q");
  new F("RP");
  new F("RT");
  new F("RTC");
  new F("RUBY");
  new F("S");
  new F("SAMP");
  new F("SCRIPT");
  new F("SECTION");
  new F("SELECT");
  new F("SMALL");
  new F("SOURCE");
  new F("SPAN");
  new F("STRIKE");
  new F("STRONG");
  new F("STYLE");
  new F("SUB");
  new F("SUMMARY");
  new F("SUP");
  new F("SVG");
  new F("TABLE");
  new F("TBODY");
  new F("TD");
  new F("TEMPLATE");
  new F("TEXTAREA");
  new F("TFOOT");
  new F("TH");
  new F("THEAD");
  new F("TIME");
  new F("TITLE");
  new F("TR");
  new F("TRACK");
  new F("TT");
  new F("U");
  new F("UL");
  new F("VAR");
  new F("VIDEO");
  new F("WBR");
  function Qa(a, b, c) {
    var d = {},
      e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d;
  }
  function Ra(a, b, c) {
    for (var d in a) if (b.call(c, a[d], d, a)) return !0;
    return !1;
  }
  function Sa(a) {
    var b = {},
      c;
    for (c in a) b[a[c]] = c;
    return b;
  }
  var Ta =
    "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
      " ",
    );
  function Ua(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d) a[c] = d[c];
      for (var g = 0; g < Ta.length; g++)
        ((c = Ta[g]),
          Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]));
    }
  }
  function Va(a, b) {
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ =
      (a === Wa && b) || "";
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = Xa;
  }
  Va.prototype.implementsGoogStringTypedString = !0;
  Va.prototype.getTypedStringValue = function () {
    return this
      .stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  };
  Va.prototype.toString = function () {
    return (
      "Const{" +
      this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ +
      "}"
    );
  };
  var Xa = {},
    Wa = {};
  new Va(Wa, "");
  function Ya() {
    this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
    this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = Za;
  }
  Ya.prototype.implementsGoogStringTypedString = !0;
  var Za = {};
  Ya.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString();
  };
  Ya.prototype.toString = function () {
    return (
      "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}"
    );
  };
  Ya.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
    this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = a;
    return this;
  };
  new Ya().initSecurityPrivateDoNotAccessOrElse_("");
  var $a = String.prototype.trim
    ? function (a) {
        return a.trim();
      }
    : function (a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
      };
  function ab(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function bb() {
    this.privateDoNotAccessOrElseSafeUrlWrappedValue_ = "";
    this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = cb;
  }
  f = bb.prototype;
  f.implementsGoogStringTypedString = !0;
  f.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString();
  };
  f.implementsGoogI18nBidiDirectionalString = !0;
  f.getDirection = function () {
    return 1;
  };
  f.toString = function () {
    return "SafeUrl{" + this.privateDoNotAccessOrElseSafeUrlWrappedValue_ + "}";
  };
  var db = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,
    cb = {};
  function eb(a) {
    var b = new bb();
    b.privateDoNotAccessOrElseSafeUrlWrappedValue_ = a;
    return b;
  }
  eb("about:blank");
  function fb() {
    this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
    this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = gb;
  }
  fb.prototype.implementsGoogStringTypedString = !0;
  var gb = {};
  fb.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  };
  fb.prototype.toString = function () {
    return (
      "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
    );
  };
  fb.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
    this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
    return this;
  };
  new fb().initSecurityPrivateDoNotAccessOrElse_("");
  function hb() {
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
    this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = ib;
  }
  hb.prototype.implementsGoogStringTypedString = !0;
  var ib = {};
  hb.prototype.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  };
  hb.prototype.toString = function () {
    return (
      "SafeStyleSheet{" +
      this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ +
      "}"
    );
  };
  hb.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = a;
    return this;
  };
  new hb().initSecurityPrivateDoNotAccessOrElse_("");
  var jb;
  a: {
    var kb = v.navigator;
    if (kb) {
      var lb = kb.userAgent;
      if (lb) {
        jb = lb;
        break a;
      }
    }
    jb = "";
  }
  function G(a) {
    return -1 != jb.indexOf(a);
  }
  function mb(a) {
    var b = jb.toLowerCase();
    a = a.toLowerCase();
    return -1 != b.indexOf(a);
  }
  function H() {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
    this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = nb;
    this.dir_ = null;
  }
  f = H.prototype;
  f.implementsGoogI18nBidiDirectionalString = !0;
  f.getDirection = function () {
    return this.dir_;
  };
  f.implementsGoogStringTypedString = !0;
  f.getTypedStringValue = function () {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString();
  };
  f.toString = function () {
    return (
      "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
    );
  };
  var nb = {};
  H.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a, b) {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
    this.dir_ = b;
    return this;
  };
  new H().initSecurityPrivateDoNotAccessOrElse_("<!DOCTYPE html>", 0);
  var ob = new H().initSecurityPrivateDoNotAccessOrElse_("", 0);
  new H().initSecurityPrivateDoNotAccessOrElse_("<br>", 0);
  (function (a) {
    var b = !1,
      c;
    return function () {
      b || ((c = a()), (b = !0));
      return c;
    };
  })(function () {
    if ("undefined" === typeof document) return !1;
    var a = document.createElement("div"),
      b = document.createElement("div");
    b.appendChild(document.createElement("div"));
    a.appendChild(b);
    if (!a.firstChild) return !1;
    b = a.firstChild.firstChild;
    if (
      ob instanceof H &&
      ob.constructor === H &&
      ob.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === nb
    )
      var c = ob.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    else
      (Fa(
        "expected object of type SafeHtml, got '" + ob + "' of type " + A(ob),
      ),
        (c = "type_error:SafeHtml"));
    a.innerHTML = c;
    return !b.parentElement;
  });
  function pb(a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length; ) (d.push(a.shift()), c--);
    a.length && d.push(a.join(b));
    return d;
  }
  function qb() {
    this.workTail_ = this.workHead_ = null;
  }
  var sb = new Pa(
    function () {
      return new rb();
    },
    function (a) {
      a.reset();
    },
    100,
  );
  qb.prototype.add = function (a, b) {
    var c = this.getUnusedItem_();
    c.set(a, b);
    this.workTail_
      ? (this.workTail_.next = c)
      : (E(!this.workHead_), (this.workHead_ = c));
    this.workTail_ = c;
  };
  qb.prototype.remove = function () {
    var a = null;
    this.workHead_ &&
      ((a = this.workHead_),
      (this.workHead_ = this.workHead_.next),
      this.workHead_ || (this.workTail_ = null),
      (a.next = null));
    return a;
  };
  qb.prototype.returnUnused = function (a) {
    sb.put(a);
  };
  qb.prototype.getUnusedItem_ = function () {
    return sb.get();
  };
  function rb() {
    this.next = this.scope = this.fn = null;
  }
  rb.prototype.set = function (a, b) {
    this.fn = a;
    this.scope = b;
    this.next = null;
  };
  rb.prototype.reset = function () {
    this.next = this.scope = this.fn = null;
  };
  new qb();
  function tb() {
    return G("iPhone") && !G("iPod") && !G("iPad");
  }
  function ub(a) {
    ub[" "](a);
    return a;
  }
  ub[" "] = ua;
  function vb(a, b, c, d) {
    d = d ? d(b) : b;
    return Object.prototype.hasOwnProperty.call(a, d) ? a[d] : (a[d] = c(b));
  }
  var wb = G("Opera"),
    I = G("Trident") || G("MSIE"),
    xb = G("Edge"),
    yb =
      G("Gecko") &&
      !(mb("WebKit") && !G("Edge")) &&
      !(G("Trident") || G("MSIE")) &&
      !G("Edge"),
    J = mb("WebKit") && !G("Edge");
  J && G("Mobile");
  var zb = G("Macintosh");
  G("Windows");
  G("Linux") || G("CrOS");
  var Ab = v.navigator || null;
  Ab && (Ab.appVersion || "").indexOf("X11");
  G("Android");
  tb();
  G("iPad");
  G("iPod");
  tb() || G("iPad") || G("iPod");
  mb("KaiOS");
  mb("GAFP");
  function Bb() {
    var a = v.document;
    return a ? a.documentMode : void 0;
  }
  var Cb;
  a: {
    var Db = "",
      Eb = (function () {
        var a = jb;
        if (yb) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (xb) return /Edge\/([\d\.]+)/.exec(a);
        if (I) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (J) return /WebKit\/(\S+)/.exec(a);
        if (wb) return /(?:Version)[ \/]?(\S+)/.exec(a);
      })();
    Eb && (Db = Eb ? Eb[1] : "");
    if (I) {
      var Fb = Bb();
      if (null != Fb && Fb > parseFloat(Db)) {
        Cb = String(Fb);
        break a;
      }
    }
    Cb = Db;
  }
  var Gb = Cb,
    Hb = {};
  function K(a) {
    return vb(Hb, a, function () {
      for (
        var b = 0,
          c = $a(String(Gb)).split("."),
          d = $a(String(a)).split("."),
          e = Math.max(c.length, d.length),
          g = 0;
        0 == b && g < e;
        g++
      ) {
        var h = c[g] || "",
          k = d[g] || "";
        do {
          h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
          k = /(\d*)(\D*)(.*)/.exec(k) || ["", "", "", ""];
          if (0 == h[0].length && 0 == k[0].length) break;
          b = 0 == h[1].length ? 0 : parseInt(h[1], 10);
          var m = 0 == k[1].length ? 0 : parseInt(k[1], 10);
          b =
            ab(b, m) ||
            ab(0 == h[2].length, 0 == k[2].length) ||
            ab(h[2], k[2]);
          h = h[3];
          k = k[3];
        } while (0 == b);
      }
      return 0 <= b;
    });
  }
  var Ib;
  Ib = v.document && I ? Bb() : void 0;
  var Jb =
    Object.freeze ||
    function (a) {
      return a;
    };
  function Kb(a, b, c, d, e) {
    this.reset(a, b, c, d, e);
  }
  Kb.prototype.sequenceNumber_ = 0;
  Kb.prototype.exception_ = null;
  var Lb = 0;
  f = Kb.prototype;
  f.reset = function (a, b, c, d, e) {
    this.sequenceNumber_ = "number" == typeof e ? e : Lb++;
    this.time_ = d || C();
    this.level_ = a;
    this.msg_ = b;
    this.loggerName_ = c;
    delete this.exception_;
  };
  f.getLoggerName = function () {
    return this.loggerName_;
  };
  f.getException = function () {
    return this.exception_;
  };
  f.setException = function (a) {
    this.exception_ = a;
  };
  f.setLoggerName = function (a) {
    this.loggerName_ = a;
  };
  f.getLevel = function () {
    return this.level_;
  };
  f.setLevel = function (a) {
    this.level_ = a;
  };
  f.getMessage = function () {
    return this.msg_;
  };
  f.setMessage = function (a) {
    this.msg_ = a;
  };
  f.getMillis = function () {
    return this.time_;
  };
  f.setMillis = function (a) {
    this.time_ = a;
  };
  f.getSequenceNumber = function () {
    return this.sequenceNumber_;
  };
  function Mb(a) {
    this.name_ = a;
    this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
  }
  function L(a, b) {
    this.name = a;
    this.value = b;
  }
  L.prototype.toString = function () {
    return this.name;
  };
  new L("OFF", Infinity);
  var Nb = new L("SHOUT", 1200),
    Ob = new L("SEVERE", 1e3),
    Pb = new L("WARNING", 900),
    Qb = new L("INFO", 800),
    Rb = new L("CONFIG", 700),
    Sb = new L("FINE", 500),
    Tb = new L("FINER", 400),
    Ub = new L("FINEST", 300);
  new L("ALL", 0);
  f = Mb.prototype;
  f.getName = function () {
    return this.name_;
  };
  f.addHandler = function (a) {
    this.handlers_ || (this.handlers_ = []);
    this.handlers_.push(a);
  };
  f.removeHandler = function (a) {
    var b = this.handlers_;
    return !!b && La(b, a);
  };
  f.getParent = function () {
    return this.parent_;
  };
  f.getChildren = function () {
    this.children_ || (this.children_ = {});
    return this.children_;
  };
  f.setLevel = function (a) {
    this.level_ = a;
  };
  f.getLevel = function () {
    return this.level_;
  };
  f.getEffectiveLevel = function () {
    if (this.level_) return this.level_;
    if (this.parent_) return this.parent_.getEffectiveLevel();
    Fa("Root logger has no level set.");
    return null;
  };
  f.isLoggable = function (a) {
    return a.value >= this.getEffectiveLevel().value;
  };
  f.log = function (a, b, c) {
    this.isLoggable(a) &&
      ("function" == A(b) && (b = b()),
      this.doLogRecord_(this.getLogRecord(a, b, c)));
  };
  f.getLogRecord = function (a, b, c) {
    a = new Kb(a, String(b), this.name_);
    c && a.setException(c);
    return a;
  };
  f.shout = function (a, b) {
    this.log(Nb, a, b);
  };
  f.severe = function (a, b) {
    this.log(Ob, a, b);
  };
  f.warning = function (a, b) {
    this.log(Pb, a, b);
  };
  f.info = function (a, b) {
    this.log(Qb, a, b);
  };
  f.config = function (a, b) {
    this.log(Rb, a, b);
  };
  f.fine = function (a, b) {
    this.log(Sb, a, b);
  };
  f.finer = function (a, b) {
    this.log(Tb, a, b);
  };
  f.finest = function (a, b) {
    this.log(Ub, a, b);
  };
  f.logRecord = function (a) {
    this.isLoggable(a.getLevel()) && this.doLogRecord_(a);
  };
  f.doLogRecord_ = function (a) {
    for (var b = this; b; ) (b.callPublish_(a), (b = b.getParent()));
  };
  f.callPublish_ = function (a) {
    if (this.handlers_) for (var b = 0, c; (c = this.handlers_[b]); b++) c(a);
  };
  f.setParent_ = function (a) {
    this.parent_ = a;
  };
  f.addChild_ = function (a, b) {
    this.getChildren()[a] = b;
  };
  var Vb = {},
    Wb = null;
  function Xb(a) {
    Wb || ((Wb = new Mb("")), (Vb[""] = Wb), Wb.setLevel(Rb));
    var b;
    if (!(b = Vb[a])) {
      b = new Mb(a);
      var c = a.lastIndexOf("."),
        d = a.substr(0, c);
      c = a.substr(c + 1);
      d = Xb(d);
      d.addChild_(c, b);
      b.setParent_(d);
      Vb[a] = b;
    }
    return b;
  }
  function N() {
    this.disposed_ = this.disposed_;
    this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
  }
  f = N.prototype;
  f.disposed_ = !1;
  f.isDisposed = function () {
    return this.disposed_;
  };
  f.getDisposed = N.prototype.isDisposed;
  f.dispose = function () {
    this.disposed_ || ((this.disposed_ = !0), this.disposeInternal());
  };
  f.registerDisposable = function (a) {
    this.addOnDisposeCallback(Aa(Yb, a));
  };
  f.addOnDisposeCallback = function (a, b) {
    this.disposed_
      ? w(b)
        ? a.call(b)
        : a()
      : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []),
        this.onDisposeCallbacks_.push(w(b) ? B(a, b) : a));
  };
  f.disposeInternal = function () {
    if (this.onDisposeCallbacks_)
      for (; this.onDisposeCallbacks_.length; )
        this.onDisposeCallbacks_.shift()();
  };
  function Yb(a) {
    a && "function" == typeof a.dispose && a.dispose();
  }
  var Zb = !I || 9 <= Number(Ib),
    $b = !I || 9 <= Number(Ib),
    ac = I && !K("9");
  !J || K("528");
  (yb && K("1.9b")) || (I && K("8")) || (wb && K("9.5")) || (J && K("528"));
  (yb && !K("8")) || (I && K("9"));
  var bc = (function () {
    if (!v.addEventListener || !Object.defineProperty) return !1;
    var a = !1,
      b = Object.defineProperty({}, "passive", {
        get: function () {
          a = !0;
        },
      });
    try {
      (v.addEventListener("test", ua, b), v.removeEventListener("test", ua, b));
    } catch (c) {}
    return a;
  })();
  function O(a, b) {
    this.type = a;
    this.currentTarget = this.target = b;
    this.defaultPrevented = this.propagationStopped_ = !1;
    this.returnValue_ = !0;
  }
  O.prototype.stopPropagation = function () {
    this.propagationStopped_ = !0;
  };
  O.prototype.preventDefault = function () {
    this.defaultPrevented = !0;
    this.returnValue_ = !1;
  };
  function cc(a) {
    return J ? "webkit" + a : wb ? "o" + a.toLowerCase() : a.toLowerCase();
  }
  cc("AnimationStart");
  cc("AnimationEnd");
  cc("AnimationIteration");
  cc("TransitionEnd");
  function dc(a, b) {
    O.call(this, a ? a.type : "");
    this.relatedTarget = this.currentTarget = this.target = null;
    this.button =
      this.screenY =
      this.screenX =
      this.clientY =
      this.clientX =
      this.offsetY =
      this.offsetX =
        0;
    this.key = "";
    this.charCode = this.keyCode = 0;
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
    this.state = null;
    this.platformModifierKey = !1;
    this.pointerId = 0;
    this.pointerType = "";
    this.event_ = null;
    a && this.init(a, b);
  }
  D(dc, O);
  var ec = Jb([1, 4, 2]),
    fc = Jb({ 2: "touch", 3: "pen", 4: "mouse" });
  f = dc.prototype;
  f.init = function (a, b) {
    var c = (this.type = a.type),
      d =
        a.changedTouches && a.changedTouches.length
          ? a.changedTouches[0]
          : null;
    this.target = a.target || a.srcElement;
    this.currentTarget = b;
    if ((b = a.relatedTarget)) {
      if (yb) {
        a: {
          try {
            ub(b.nodeName);
            var e = !0;
            break a;
          } catch (g) {}
          e = !1;
        }
        e || (b = null);
      }
    } else
      "mouseover" == c
        ? (b = a.fromElement)
        : "mouseout" == c && (b = a.toElement);
    this.relatedTarget = b;
    d
      ? ((this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX),
        (this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY),
        (this.screenX = d.screenX || 0),
        (this.screenY = d.screenY || 0))
      : ((this.offsetX = J || void 0 !== a.offsetX ? a.offsetX : a.layerX),
        (this.offsetY = J || void 0 !== a.offsetY ? a.offsetY : a.layerY),
        (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX),
        (this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY),
        (this.screenX = a.screenX || 0),
        (this.screenY = a.screenY || 0));
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.key = a.key || "";
    this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.platformModifierKey = zb ? a.metaKey : a.ctrlKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = z(a.pointerType)
      ? a.pointerType
      : fc[a.pointerType] || "";
    this.state = a.state;
    this.event_ = a;
    a.defaultPrevented && this.preventDefault();
  };
  f.isButton = function (a) {
    return Zb
      ? this.event_.button == a
      : "click" == this.type
        ? 0 == a
        : !!(this.event_.button & ec[a]);
  };
  f.isMouseActionButton = function () {
    return this.isButton(0) && !(J && zb && this.ctrlKey);
  };
  f.stopPropagation = function () {
    dc.superClass_.stopPropagation.call(this);
    this.event_.stopPropagation
      ? this.event_.stopPropagation()
      : (this.event_.cancelBubble = !0);
  };
  f.preventDefault = function () {
    dc.superClass_.preventDefault.call(this);
    var a = this.event_;
    if (a.preventDefault) a.preventDefault();
    else if (((a.returnValue = !1), ac))
      try {
        if (a.ctrlKey || (112 <= a.keyCode && 123 >= a.keyCode)) a.keyCode = -1;
      } catch (b) {}
  };
  f.getBrowserEvent = function () {
    return this.event_;
  };
  var gc = "closure_listenable_" + ((1e6 * Math.random()) | 0),
    hc = 0;
  function ic(a, b, c, d, e, g) {
    this.listener = a;
    this.proxy = b;
    this.src = c;
    this.type = d;
    this.capture = !!e;
    this.handler = g;
    this.key = ++hc;
    this.removed = this.callOnce = !1;
  }
  ic.prototype.markAsRemoved = function () {
    this.removed = !0;
    this.handler = this.src = this.proxy = this.listener = null;
  };
  function jc(a) {
    this.src = a;
    this.listeners = {};
    this.typeCount_ = 0;
  }
  f = jc.prototype;
  f.getTypeCount = function () {
    return this.typeCount_;
  };
  f.getListenerCount = function () {
    var a = 0,
      b;
    for (b in this.listeners) a += this.listeners[b].length;
    return a;
  };
  f.add = function (a, b, c, d, e) {
    var g = a.toString();
    a = this.listeners[g];
    a || ((a = this.listeners[g] = []), this.typeCount_++);
    var h = kc(a, b, d, e);
    -1 < h
      ? ((b = a[h]), c || (b.callOnce = !1))
      : ((b = new ic(b, null, this.src, g, !!d, e)),
        (b.callOnce = c),
        a.push(b));
    return b;
  };
  f.remove = function (a, b, c, d) {
    a = a.toString();
    if (!(a in this.listeners)) return !1;
    var e = this.listeners[a];
    b = kc(e, b, c, d);
    return -1 < b
      ? (e[b].markAsRemoved(),
        Ma(e, b),
        0 == e.length && (delete this.listeners[a], this.typeCount_--),
        !0)
      : !1;
  };
  f.removeByKey = function (a) {
    var b = a.type;
    if (!(b in this.listeners)) return !1;
    var c = La(this.listeners[b], a);
    c &&
      (a.markAsRemoved(),
      0 == this.listeners[b].length &&
        (delete this.listeners[b], this.typeCount_--));
    return c;
  };
  f.removeAll = function (a) {
    a = a && a.toString();
    var b = 0,
      c;
    for (c in this.listeners)
      if (!a || c == a) {
        for (var d = this.listeners[c], e = 0; e < d.length; e++)
          (++b, d[e].markAsRemoved());
        delete this.listeners[c];
        this.typeCount_--;
      }
    return b;
  };
  f.getListeners = function (a, b) {
    a = this.listeners[a.toString()];
    var c = [];
    if (a)
      for (var d = 0; d < a.length; ++d) {
        var e = a[d];
        e.capture == b && c.push(e);
      }
    return c;
  };
  f.getListener = function (a, b, c, d) {
    a = this.listeners[a.toString()];
    var e = -1;
    a && (e = kc(a, b, c, d));
    return -1 < e ? a[e] : null;
  };
  f.hasListener = function (a, b) {
    var c = w(a),
      d = c ? a.toString() : "",
      e = w(b);
    return Ra(this.listeners, function (g) {
      for (var h = 0; h < g.length; ++h)
        if (!((c && g[h].type != d) || (e && g[h].capture != b))) return !0;
      return !1;
    });
  };
  function kc(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var g = a[e];
      if (!g.removed && g.listener == b && g.capture == !!c && g.handler == d)
        return e;
    }
    return -1;
  }
  var lc = "closure_lm_" + ((1e6 * Math.random()) | 0),
    mc = {},
    nc = 0;
  function oc(a, b, c, d, e) {
    if (d && d.once) return pc(a, b, c, d, e);
    if (va(b)) {
      for (var g = 0; g < b.length; g++) oc(a, b[g], c, d, e);
      return null;
    }
    c = qc(c);
    return a && a[gc]
      ? ((d = xa(d) ? !!d.capture : !!d), a.listen(b, c, d, e))
      : rc(a, b, c, !1, d, e);
  }
  function rc(a, b, c, d, e, g) {
    if (!b) throw Error("Invalid event type");
    var h = xa(e) ? !!e.capture : !!e,
      k = sc(a);
    k || (a[lc] = k = new jc(a));
    c = k.add(b, c, d, h, g);
    if (c.proxy) return c;
    d = tc();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener)
      (bc || (e = h),
        void 0 === e && (e = !1),
        a.addEventListener(b.toString(), d, e));
    else if (a.attachEvent) a.attachEvent(uc(b.toString()), d);
    else if (a.addListener && a.removeListener)
      (E("change" === b, "MediaQueryList only has a change event"),
        a.addListener(d));
    else throw Error("addEventListener and attachEvent are unavailable.");
    nc++;
    return c;
  }
  function tc() {
    var a = vc,
      b = $b
        ? function (c) {
            return a.call(b.src, b.listener, c);
          }
        : function (c) {
            c = a.call(b.src, b.listener, c);
            if (!c) return c;
          };
    return b;
  }
  function pc(a, b, c, d, e) {
    if (va(b)) {
      for (var g = 0; g < b.length; g++) pc(a, b[g], c, d, e);
      return null;
    }
    c = qc(c);
    return a && a[gc]
      ? ((d = xa(d) ? !!d.capture : !!d), a.listenOnce(b, c, d, e))
      : rc(a, b, c, !0, d, e);
  }
  function wc(a, b, c, d, e) {
    if (va(b)) {
      for (var g = 0; g < b.length; g++) wc(a, b[g], c, d, e);
      return null;
    }
    d = xa(d) ? !!d.capture : !!d;
    c = qc(c);
    if (a && a[gc]) return a.unlisten(b, c, d, e);
    if (!a) return !1;
    if ((a = sc(a))) if ((b = a.getListener(b, c, d, e))) return xc(b);
    return !1;
  }
  function xc(a) {
    if (sa(a) || !a || a.removed) return !1;
    var b = a.src;
    if (b && b[gc]) return b.unlistenByKey(a);
    var c = a.type,
      d = a.proxy;
    b.removeEventListener
      ? b.removeEventListener(c, d, a.capture)
      : b.detachEvent
        ? b.detachEvent(uc(c), d)
        : b.addListener && b.removeListener && b.removeListener(d);
    nc--;
    (c = sc(b))
      ? (c.removeByKey(a),
        0 == c.getTypeCount() && ((c.src = null), (b[lc] = null)))
      : a.markAsRemoved();
    return !0;
  }
  function uc(a) {
    return a in mc ? mc[a] : (mc[a] = "on" + a);
  }
  function yc(a, b, c, d) {
    var e = !0;
    if ((a = sc(a)))
      if ((b = a.listeners[b.toString()]))
        for (b = b.concat(), a = 0; a < b.length; a++) {
          var g = b[a];
          g &&
            g.capture == c &&
            !g.removed &&
            ((g = zc(g, d)), (e = e && !1 !== g));
        }
    return e;
  }
  function zc(a, b) {
    var c = a.listener,
      d = a.handler || a.src;
    a.callOnce && xc(a);
    return c.call(d, b);
  }
  function vc(a, b) {
    if (a.removed) return !0;
    if (!$b) {
      var c = b || ta("window.event");
      b = new dc(c, this);
      var d = !0;
      if (!(0 > c.keyCode || void 0 != c.returnValue)) {
        a: {
          var e = !1;
          if (0 == c.keyCode)
            try {
              c.keyCode = -1;
              break a;
            } catch (h) {
              e = !0;
            }
          if (e || void 0 == c.returnValue) c.returnValue = !0;
        }
        c = [];
        for (e = b.currentTarget; e; e = e.parentNode) c.push(e);
        a = a.type;
        for (e = c.length - 1; !b.propagationStopped_ && 0 <= e; e--) {
          b.currentTarget = c[e];
          var g = yc(c[e], a, !0, b);
          d = d && g;
        }
        for (e = 0; !b.propagationStopped_ && e < c.length; e++)
          ((b.currentTarget = c[e]), (g = yc(c[e], a, !1, b)), (d = d && g));
      }
      return d;
    }
    return zc(a, new dc(b, this));
  }
  function sc(a) {
    a = a[lc];
    return a instanceof jc ? a : null;
  }
  var Ac = "__closure_events_fn_" + ((1e9 * Math.random()) >>> 0);
  function qc(a) {
    E(a, "Listener can not be null.");
    if ("function" == A(a)) return a;
    E(a.handleEvent, "An object listener must have handleEvent method.");
    a[Ac] ||
      (a[Ac] = function (b) {
        return a.handleEvent(b);
      });
    return a[Ac];
  }
  function Bc() {
    N.call(this);
    this.eventTargetListeners_ = new jc(this);
    this.actualEventTarget_ = this;
    this.parentEventTarget_ = null;
  }
  D(Bc, N);
  Bc.prototype[gc] = !0;
  f = Bc.prototype;
  f.getParentEventTarget = function () {
    return this.parentEventTarget_;
  };
  f.setParentEventTarget = function (a) {
    this.parentEventTarget_ = a;
  };
  f.addEventListener = function (a, b, c, d) {
    oc(this, a, b, c, d);
  };
  f.removeEventListener = function (a, b, c, d) {
    wc(this, a, b, c, d);
  };
  f.dispatchEvent = function (a) {
    this.assertInitialized_();
    var b = this.getParentEventTarget();
    if (b) {
      var c = [];
      for (var d = 1; b; b = b.getParentEventTarget())
        (c.push(b), E(1e3 > ++d, "infinite loop"));
    }
    b = this.actualEventTarget_;
    d = a.type || a;
    if (z(a)) a = new O(a, b);
    else if (a instanceof O) a.target = a.target || b;
    else {
      var e = a;
      a = new O(d, b);
      Ua(a, e);
    }
    e = !0;
    if (c)
      for (var g = c.length - 1; !a.propagationStopped_ && 0 <= g; g--) {
        var h = (a.currentTarget = c[g]);
        e = h.fireListeners(d, !0, a) && e;
      }
    a.propagationStopped_ ||
      ((h = a.currentTarget = b),
      (e = h.fireListeners(d, !0, a) && e),
      a.propagationStopped_ || (e = h.fireListeners(d, !1, a) && e));
    if (c)
      for (g = 0; !a.propagationStopped_ && g < c.length; g++)
        ((h = a.currentTarget = c[g]), (e = h.fireListeners(d, !1, a) && e));
    return e;
  };
  f.disposeInternal = function () {
    Bc.superClass_.disposeInternal.call(this);
    this.removeAllListeners();
    this.parentEventTarget_ = null;
  };
  f.listen = function (a, b, c, d) {
    this.assertInitialized_();
    return this.eventTargetListeners_.add(String(a), b, !1, c, d);
  };
  f.listenOnce = function (a, b, c, d) {
    return this.eventTargetListeners_.add(String(a), b, !0, c, d);
  };
  f.unlisten = function (a, b, c, d) {
    return this.eventTargetListeners_.remove(String(a), b, c, d);
  };
  f.unlistenByKey = function (a) {
    return this.eventTargetListeners_.removeByKey(a);
  };
  f.removeAllListeners = function (a) {
    return this.eventTargetListeners_
      ? this.eventTargetListeners_.removeAll(a)
      : 0;
  };
  f.fireListeners = function (a, b, c) {
    a = this.eventTargetListeners_.listeners[String(a)];
    if (!a) return !0;
    a = a.concat();
    for (var d = !0, e = 0; e < a.length; ++e) {
      var g = a[e];
      if (g && !g.removed && g.capture == b) {
        var h = g.listener,
          k = g.handler || g.src;
        g.callOnce && this.unlistenByKey(g);
        d = !1 !== h.call(k, c) && d;
      }
    }
    return d && 0 != c.returnValue_;
  };
  f.getListeners = function (a, b) {
    return this.eventTargetListeners_.getListeners(String(a), b);
  };
  f.getListener = function (a, b, c, d) {
    return this.eventTargetListeners_.getListener(String(a), b, c, d);
  };
  f.hasListener = function (a, b) {
    a = w(a) ? String(a) : void 0;
    return this.eventTargetListeners_.hasListener(a, b);
  };
  f.setTargetForTesting = function (a) {
    this.actualEventTarget_ = a;
  };
  f.assertInitialized_ = function () {
    E(
      this.eventTargetListeners_,
      "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?",
    );
  };
  var P =
    "StopIteration" in v
      ? v.StopIteration
      : { message: "StopIteration", stack: "" };
  function Q() {}
  Q.prototype.next = function () {
    throw P;
  };
  Q.prototype.__iterator__ = function () {
    return this;
  };
  function Cc(a) {
    if (a instanceof Q) return a;
    if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
    if (wa(a)) {
      var b = 0,
        c = new Q();
      c.next = function () {
        for (;;) {
          if (b >= a.length) throw P;
          if (b in a) return a[b++];
          b++;
        }
      };
      return c;
    }
    throw Error("Not implemented");
  }
  function Dc(a, b, c) {
    if (wa(a))
      try {
        Ja(a, b, c);
      } catch (d) {
        if (d !== P) throw d;
      }
    else {
      a = Cc(a);
      try {
        for (;;) b.call(c, a.next(), void 0, a);
      } catch (d) {
        if (d !== P) throw d;
      }
    }
  }
  function Ec(a) {
    if (wa(a)) return Oa(a);
    a = Cc(a);
    var b = [];
    Dc(a, function (c) {
      b.push(c);
    });
    return b;
  }
  function Fc(a) {
    return /^\s*$/.test(a)
      ? !1
      : /^[\],:{}\s\u2028\u2029]*$/.test(
          a
            .replace(/\\["\\\/bfnrtu]/g, "@")
            .replace(
              /(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,
              "]",
            )
            .replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""),
        );
  }
  function Gc(a) {
    a = String(a);
    if (Fc(a))
      try {
        return eval("(" + a + ")");
      } catch (b) {}
    throw Error("Invalid JSON string: " + a);
  }
  function Hc(a, b) {
    return new S(b).serialize(a);
  }
  function S(a) {
    this.replacer_ = a;
  }
  S.prototype.serialize = function (a) {
    var b = [];
    this.serializeInternal(a, b);
    return b.join("");
  };
  S.prototype.serializeInternal = function (a, b) {
    if (null == a) b.push("null");
    else {
      if ("object" == typeof a) {
        if (va(a)) {
          this.serializeArray(a, b);
          return;
        }
        if (a instanceof String || a instanceof Number || a instanceof Boolean)
          a = a.valueOf();
        else {
          this.serializeObject_(a, b);
          return;
        }
      }
      switch (typeof a) {
        case "string":
          this.serializeString_(a, b);
          break;
        case "number":
          this.serializeNumber_(a, b);
          break;
        case "boolean":
          b.push(String(a));
          break;
        case "function":
          b.push("null");
          break;
        default:
          throw Error("Unknown type: " + typeof a);
      }
    }
  };
  var Ic = {
      '"': '\\"',
      "\\": "\\\\",
      "/": "\\/",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\x0B": "\\u000b",
    },
    Jc = /\uffff/.test("\uffff")
      ? /[\\"\x00-\x1f\x7f-\uffff]/g
      : /[\\"\x00-\x1f\x7f-\xff]/g;
  S.prototype.serializeString_ = function (a, b) {
    b.push(
      '"',
      a.replace(Jc, function (c) {
        var d = Ic[c];
        d ||
          ((d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).substr(1)),
          (Ic[c] = d));
        return d;
      }),
      '"',
    );
  };
  S.prototype.serializeNumber_ = function (a, b) {
    b.push(isFinite(a) && !isNaN(a) ? String(a) : "null");
  };
  S.prototype.serializeArray = function (a, b) {
    var c = a.length;
    b.push("[");
    for (var d = "", e = 0; e < c; e++)
      (b.push(d),
        (d = a[e]),
        this.serializeInternal(
          this.replacer_ ? this.replacer_.call(a, String(e), d) : d,
          b,
        ),
        (d = ","));
    b.push("]");
  };
  S.prototype.serializeObject_ = function (a, b) {
    b.push("{");
    var c = "",
      d;
    for (d in a)
      if (Object.prototype.hasOwnProperty.call(a, d)) {
        var e = a[d];
        "function" != typeof e &&
          (b.push(c),
          this.serializeString_(d, b),
          b.push(":"),
          this.serializeInternal(
            this.replacer_ ? this.replacer_.call(a, d, e) : e,
            b,
          ),
          (c = ","));
      }
    b.push("}");
  };
  function T(a, b, c) {
    a && a.fine(b, c);
  }
  function Kc(a) {
    this.document_ = a || { cookie: "" };
  }
  f = Kc.prototype;
  f.isEnabled = function () {
    return navigator.cookieEnabled;
  };
  f.isValidName = function (a) {
    return !/[;=\s]/.test(a);
  };
  f.isValidValue = function (a) {
    return !/[;\r\n]/.test(a);
  };
  f.set = function (a, b, c, d, e, g) {
    if (!this.isValidName(a)) throw Error('Invalid cookie name "' + a + '"');
    if (!this.isValidValue(b)) throw Error('Invalid cookie value "' + b + '"');
    w(c) || (c = -1);
    e = e ? ";domain=" + e : "";
    d = d ? ";path=" + d : "";
    g = g ? ";secure" : "";
    c =
      0 > c
        ? ""
        : 0 == c
          ? ";expires=" + new Date(1970, 1, 1).toUTCString()
          : ";expires=" + new Date(C() + 1e3 * c).toUTCString();
    this.setCookie_(a + "=" + b + e + d + c + g);
  };
  f.get = function (a, b) {
    for (var c = a + "=", d = this.getParts_(), e = 0, g; e < d.length; e++) {
      g = $a(d[e]);
      if (0 == g.lastIndexOf(c, 0)) return g.substr(c.length);
      if (g == a) return "";
    }
    return b;
  };
  f.remove = function (a, b, c) {
    var d = this.containsKey(a);
    this.set(a, "", 0, b, c);
    return d;
  };
  f.getKeys = function () {
    return this.getKeyValues_().keys;
  };
  f.getValues = function () {
    return this.getKeyValues_().values;
  };
  f.isEmpty = function () {
    return !this.getCookie_();
  };
  f.getCount = function () {
    return this.getCookie_() ? this.getParts_().length : 0;
  };
  f.containsKey = function (a) {
    return w(this.get(a));
  };
  f.containsValue = function (a) {
    for (var b = this.getKeyValues_().values, c = 0; c < b.length; c++)
      if (b[c] == a) return !0;
    return !1;
  };
  f.clear = function () {
    for (var a = this.getKeyValues_().keys, b = a.length - 1; 0 <= b; b--)
      this.remove(a[b]);
  };
  f.setCookie_ = function (a) {
    this.document_.cookie = a;
  };
  f.getCookie_ = function () {
    return this.document_.cookie;
  };
  f.getParts_ = function () {
    return (this.getCookie_() || "").split(";");
  };
  f.getKeyValues_ = function () {
    for (
      var a = this.getParts_(), b = [], c = [], d, e, g = 0;
      g < a.length;
      g++
    )
      ((e = $a(a[g])),
        (d = e.indexOf("=")),
        -1 == d
          ? (b.push(""), c.push(e))
          : (b.push(e.substring(0, d)), c.push(e.substring(d + 1))));
    return { keys: b, values: c };
  };
  var Lc = new Kc("undefined" == typeof document ? null : document);
  function Mc() {}
  Mc.prototype.cachedOptions_ = null;
  Mc.prototype.getOptions = function () {
    return (
      this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
    );
  };
  var Nc;
  function Oc() {}
  D(Oc, Mc);
  Oc.prototype.createInstance = function () {
    var a = this.getProgId_();
    return a ? new ActiveXObject(a) : new XMLHttpRequest();
  };
  Oc.prototype.internalGetOptions = function () {
    var a = {};
    this.getProgId_() && ((a[0] = !0), (a[1] = !0));
    return a;
  };
  Oc.prototype.getProgId_ = function () {
    if (
      !this.ieProgId_ &&
      "undefined" == typeof XMLHttpRequest &&
      "undefined" != typeof ActiveXObject
    ) {
      for (
        var a = [
            "MSXML2.XMLHTTP.6.0",
            "MSXML2.XMLHTTP.3.0",
            "MSXML2.XMLHTTP",
            "Microsoft.XMLHTTP",
          ],
          b = 0;
        b < a.length;
        b++
      ) {
        var c = a[b];
        try {
          return (new ActiveXObject(c), (this.ieProgId_ = c));
        } catch (d) {}
      }
      throw Error(
        "Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed",
      );
    }
    return this.ieProgId_;
  };
  Nc = new Oc();
  function U(a, b) {
    this.map_ = {};
    this.keys_ = [];
    this.version_ = this.count_ = 0;
    var c = arguments.length;
    if (1 < c) {
      if (c % 2) throw Error("Uneven number of arguments");
      for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1]);
    } else a && this.addAll(a);
  }
  f = U.prototype;
  f.getCount = function () {
    return this.count_;
  };
  f.getValues = function () {
    this.cleanupKeysArray_();
    for (var a = [], b = 0; b < this.keys_.length; b++)
      a.push(this.map_[this.keys_[b]]);
    return a;
  };
  f.getKeys = function () {
    this.cleanupKeysArray_();
    return this.keys_.concat();
  };
  f.containsKey = function (a) {
    return V(this.map_, a);
  };
  f.containsValue = function (a) {
    for (var b = 0; b < this.keys_.length; b++) {
      var c = this.keys_[b];
      if (V(this.map_, c) && this.map_[c] == a) return !0;
    }
    return !1;
  };
  f.equals = function (a, b) {
    if (this === a) return !0;
    if (this.count_ != a.getCount()) return !1;
    b = b || Pc;
    this.cleanupKeysArray_();
    for (var c, d = 0; (c = this.keys_[d]); d++)
      if (!b(this.get(c), a.get(c))) return !1;
    return !0;
  };
  function Pc(a, b) {
    return a === b;
  }
  f.isEmpty = function () {
    return 0 == this.count_;
  };
  f.clear = function () {
    this.map_ = {};
    this.version_ = this.count_ = this.keys_.length = 0;
  };
  f.remove = function (a) {
    return V(this.map_, a)
      ? (delete this.map_[a],
        this.count_--,
        this.version_++,
        this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(),
        !0)
      : !1;
  };
  f.cleanupKeysArray_ = function () {
    if (this.count_ != this.keys_.length) {
      for (var a = 0, b = 0; a < this.keys_.length; ) {
        var c = this.keys_[a];
        V(this.map_, c) && (this.keys_[b++] = c);
        a++;
      }
      this.keys_.length = b;
    }
    if (this.count_ != this.keys_.length) {
      var d = {};
      for (b = a = 0; a < this.keys_.length; )
        ((c = this.keys_[a]),
          V(d, c) || ((this.keys_[b++] = c), (d[c] = 1)),
          a++);
      this.keys_.length = b;
    }
  };
  f.get = function (a, b) {
    return V(this.map_, a) ? this.map_[a] : b;
  };
  f.set = function (a, b) {
    V(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
    this.map_[a] = b;
  };
  f.addAll = function (a) {
    if (a instanceof U)
      for (var b = a.getKeys(), c = 0; c < b.length; c++)
        this.set(b[c], a.get(b[c]));
    else for (b in a) this.set(b, a[b]);
  };
  f.forEach = function (a, b) {
    for (var c = this.getKeys(), d = 0; d < c.length; d++) {
      var e = c[d],
        g = this.get(e);
      a.call(b, g, e, this);
    }
  };
  f.clone = function () {
    return new U(this);
  };
  f.transpose = function () {
    for (var a = new U(), b = 0; b < this.keys_.length; b++) {
      var c = this.keys_[b];
      a.set(this.map_[c], c);
    }
    return a;
  };
  f.toObject = function () {
    this.cleanupKeysArray_();
    for (var a = {}, b = 0; b < this.keys_.length; b++) {
      var c = this.keys_[b];
      a[c] = this.map_[c];
    }
    return a;
  };
  f.getKeyIterator = function () {
    return this.__iterator__(!0);
  };
  f.getValueIterator = function () {
    return this.__iterator__(!1);
  };
  f.__iterator__ = function (a) {
    this.cleanupKeysArray_();
    var b = 0,
      c = this.version_,
      d = this,
      e = new Q();
    e.next = function () {
      if (c != d.version_)
        throw Error("The map has changed since the iterator was created");
      if (b >= d.keys_.length) throw P;
      var g = d.keys_[b++];
      return a ? g : d.map_[g];
    };
    return e;
  };
  function V(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }
  function Qc(a) {
    if (a.getValues && "function" == typeof a.getValues) return a.getValues();
    if (z(a)) return a.split("");
    if (wa(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++) b.push(a[d]);
      return b;
    }
    b = [];
    c = 0;
    for (d in a) b[c++] = a[d];
    return b;
  }
  function Rc(a, b, c) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, c);
    else if (wa(a) || z(a)) Ja(a, b, c);
    else {
      if (a.getKeys && "function" == typeof a.getKeys) var d = a.getKeys();
      else if (a.getValues && "function" == typeof a.getValues) d = void 0;
      else if (wa(a) || z(a)) {
        d = [];
        for (var e = a.length, g = 0; g < e; g++) d.push(g);
      } else for (g in ((d = []), (e = 0), a)) d[e++] = g;
      e = Qc(a);
      g = e.length;
      for (var h = 0; h < g; h++) b.call(c, e[h], d && d[h], a);
    }
  }
  function Sc() {
    this.next =
      this.context =
      this.onRejected =
      this.onFulfilled =
      this.child =
        null;
    this.always = !1;
  }
  Sc.prototype.reset = function () {
    this.context = this.onRejected = this.onFulfilled = this.child = null;
    this.always = !1;
  };
  new Pa(
    function () {
      return new Sc();
    },
    function (a) {
      a.reset();
    },
    100,
  );
  function Tc(a, b, c) {
    if ("function" == A(a)) c && (a = B(a, c));
    else if (a && "function" == typeof a.handleEvent) a = B(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : v.setTimeout(a, b || 0);
  }
  var Uc =
    /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
  function Vc(a, b) {
    if (a) {
      a = a.split("&");
      for (var c = 0; c < a.length; c++) {
        var d = a[c].indexOf("="),
          e = null;
        if (0 <= d) {
          var g = a[c].substring(0, d);
          e = a[c].substring(d + 1);
        } else g = a[c];
        b(g, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
      }
    }
  }
  function W(a) {
    Bc.call(this);
    this.headers = new U();
    this.xmlHttpFactory_ = a || null;
    this.active_ = !1;
    this.xhrOptions_ = this.xhr_ = null;
    this.lastMethod_ = this.lastUri_ = "";
    this.lastErrorCode_ = 0;
    this.lastError_ = "";
    this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
    this.timeoutInterval_ = 0;
    this.timeoutId_ = null;
    this.responseType_ = "";
    this.useXhr2Timeout_ =
      this.progressEventsEnabled_ =
      this.withCredentials_ =
        !1;
  }
  D(W, Bc);
  var Wc = W.prototype,
    Xc = Xb("goog.net.XhrIo");
  Wc.logger_ = Xc;
  var Yc = /^https?$/i,
    Zc = ["POST", "PUT"],
    $c = [];
  f = W.prototype;
  f.cleanupSend_ = function () {
    this.dispose();
    La($c, this);
  };
  f.getTimeoutInterval = function () {
    return this.timeoutInterval_;
  };
  f.setTimeoutInterval = function (a) {
    this.timeoutInterval_ = Math.max(0, a);
  };
  f.setResponseType = function (a) {
    this.responseType_ = a;
  };
  f.getResponseType = function () {
    return this.responseType_;
  };
  f.setWithCredentials = function (a) {
    this.withCredentials_ = a;
  };
  f.getWithCredentials = function () {
    return this.withCredentials_;
  };
  f.setProgressEventsEnabled = function (a) {
    this.progressEventsEnabled_ = a;
  };
  f.getProgressEventsEnabled = function () {
    return this.progressEventsEnabled_;
  };
  f.send = function (a, b, c, d) {
    if (this.xhr_)
      throw Error(
        "[goog.net.XhrIo] Object is active with another request=" +
          this.lastUri_ +
          "; newUri=" +
          a,
      );
    b = b ? b.toUpperCase() : "GET";
    this.lastUri_ = a;
    this.lastError_ = "";
    this.lastErrorCode_ = 0;
    this.lastMethod_ = b;
    this.errorDispatched_ = !1;
    this.active_ = !0;
    this.xhr_ = this.createXhr();
    this.xhrOptions_ = this.xmlHttpFactory_
      ? this.xmlHttpFactory_.getOptions()
      : Nc.getOptions();
    this.xhr_.onreadystatechange = B(this.onReadyStateChange_, this);
    this.getProgressEventsEnabled() &&
      "onprogress" in this.xhr_ &&
      ((this.xhr_.onprogress = B(function (g) {
        this.onProgressHandler_(g, !0);
      }, this)),
      this.xhr_.upload &&
        (this.xhr_.upload.onprogress = B(this.onProgressHandler_, this)));
    try {
      (T(this.logger_, this.formatMsg_("Opening Xhr")),
        (this.inOpen_ = !0),
        this.xhr_.open(b, String(a), !0),
        (this.inOpen_ = !1));
    } catch (g) {
      T(this.logger_, this.formatMsg_("Error opening Xhr: " + g.message));
      this.error_(5, g);
      return;
    }
    a = c || "";
    var e = this.headers.clone();
    d &&
      Rc(d, function (g, h) {
        e.set(h, g);
      });
    d = Ka(e.getKeys(), ad);
    c = v.FormData && a instanceof v.FormData;
    !(0 <= Ia(Zc, b)) ||
      d ||
      c ||
      e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    e.forEach(function (g, h) {
      this.xhr_.setRequestHeader(h, g);
    }, this);
    this.responseType_ && (this.xhr_.responseType = this.responseType_);
    "withCredentials" in this.xhr_ &&
      this.xhr_.withCredentials !== this.withCredentials_ &&
      (this.xhr_.withCredentials = this.withCredentials_);
    try {
      (this.cleanUpTimeoutTimer_(),
        0 < this.timeoutInterval_ &&
          ((this.useXhr2Timeout_ = bd(this.xhr_)),
          T(
            this.logger_,
            this.formatMsg_(
              "Will abort after " +
                this.timeoutInterval_ +
                "ms if incomplete, xhr2 " +
                this.useXhr2Timeout_,
            ),
          ),
          this.useXhr2Timeout_
            ? ((this.xhr_.timeout = this.timeoutInterval_),
              (this.xhr_.ontimeout = B(this.timeout_, this)))
            : (this.timeoutId_ = Tc(
                this.timeout_,
                this.timeoutInterval_,
                this,
              ))),
        T(this.logger_, this.formatMsg_("Sending request")),
        (this.inSend_ = !0),
        this.xhr_.send(a),
        (this.inSend_ = !1));
    } catch (g) {
      (T(this.logger_, this.formatMsg_("Send error: " + g.message)),
        this.error_(5, g));
    }
  };
  function bd(a) {
    return I && K(9) && sa(a.timeout) && w(a.ontimeout);
  }
  function ad(a) {
    return "content-type" == a.toLowerCase();
  }
  f.createXhr = function () {
    return this.xmlHttpFactory_
      ? this.xmlHttpFactory_.createInstance()
      : Nc.createInstance();
  };
  f.timeout_ = function () {
    "undefined" != typeof ra &&
      this.xhr_ &&
      ((this.lastError_ =
        "Timed out after " + this.timeoutInterval_ + "ms, aborting"),
      (this.lastErrorCode_ = 8),
      T(this.logger_, this.formatMsg_(this.lastError_)),
      this.dispatchEvent("timeout"),
      this.abort(8));
  };
  f.error_ = function (a, b) {
    this.active_ = !1;
    this.xhr_ &&
      ((this.inAbort_ = !0), this.xhr_.abort(), (this.inAbort_ = !1));
    this.lastError_ = b;
    this.lastErrorCode_ = a;
    this.dispatchErrors_();
    this.cleanUpXhr_();
  };
  f.dispatchErrors_ = function () {
    this.errorDispatched_ ||
      ((this.errorDispatched_ = !0),
      this.dispatchEvent("complete"),
      this.dispatchEvent("error"));
  };
  f.abort = function (a) {
    this.xhr_ &&
      this.active_ &&
      (T(this.logger_, this.formatMsg_("Aborting")),
      (this.active_ = !1),
      (this.inAbort_ = !0),
      this.xhr_.abort(),
      (this.inAbort_ = !1),
      (this.lastErrorCode_ = a || 7),
      this.dispatchEvent("complete"),
      this.dispatchEvent("abort"),
      this.cleanUpXhr_());
  };
  f.disposeInternal = function () {
    this.xhr_ &&
      (this.active_ &&
        ((this.active_ = !1),
        (this.inAbort_ = !0),
        this.xhr_.abort(),
        (this.inAbort_ = !1)),
      this.cleanUpXhr_(!0));
    W.superClass_.disposeInternal.call(this);
  };
  f.onReadyStateChange_ = function () {
    if (!this.isDisposed())
      if (this.inOpen_ || this.inSend_ || this.inAbort_)
        this.onReadyStateChangeHelper_();
      else this.onReadyStateChangeEntryPoint_();
  };
  f.onReadyStateChangeEntryPoint_ = function () {
    this.onReadyStateChangeHelper_();
  };
  f.onReadyStateChangeHelper_ = function () {
    if (this.active_ && "undefined" != typeof ra)
      if (
        this.xhrOptions_[1] &&
        4 == this.getReadyState() &&
        2 == this.getStatus()
      )
        T(
          this.logger_,
          this.formatMsg_("Local request error detected and ignored"),
        );
      else if (this.inSend_ && 4 == this.getReadyState())
        Tc(this.onReadyStateChange_, 0, this);
      else if ((this.dispatchEvent("readystatechange"), this.isComplete())) {
        T(this.logger_, this.formatMsg_("Request complete"));
        this.active_ = !1;
        try {
          this.isSuccess()
            ? (this.dispatchEvent("complete"), this.dispatchEvent("success"))
            : ((this.lastErrorCode_ = 6),
              (this.lastError_ =
                this.getStatusText() + " [" + this.getStatus() + "]"),
              this.dispatchErrors_());
        } finally {
          this.cleanUpXhr_();
        }
      }
  };
  f.onProgressHandler_ = function (a, b) {
    E(
      "progress" === a.type,
      "goog.net.EventType.PROGRESS is of the same type as raw XHR progress.",
    );
    this.dispatchEvent(cd(a, "progress"));
    this.dispatchEvent(cd(a, b ? "downloadprogress" : "uploadprogress"));
  };
  function cd(a, b) {
    return {
      type: b,
      lengthComputable: a.lengthComputable,
      loaded: a.loaded,
      total: a.total,
    };
  }
  f.cleanUpXhr_ = function (a) {
    if (this.xhr_) {
      this.cleanUpTimeoutTimer_();
      var b = this.xhr_,
        c = this.xhrOptions_[0] ? ua : null;
      this.xhrOptions_ = this.xhr_ = null;
      a || this.dispatchEvent("ready");
      try {
        b.onreadystatechange = c;
      } catch (d) {
        (a = this.logger_) &&
          a.severe(
            "Problem encountered resetting onreadystatechange: " + d.message,
            void 0,
          );
      }
    }
  };
  f.cleanUpTimeoutTimer_ = function () {
    this.xhr_ && this.useXhr2Timeout_ && (this.xhr_.ontimeout = null);
    this.timeoutId_ &&
      (v.clearTimeout(this.timeoutId_), (this.timeoutId_ = null));
  };
  f.isActive = function () {
    return !!this.xhr_;
  };
  f.isComplete = function () {
    return 4 == this.getReadyState();
  };
  f.isSuccess = function () {
    var a = this.getStatus();
    a: switch (a) {
      case 200:
      case 201:
      case 202:
      case 204:
      case 206:
      case 304:
      case 1223:
        var b = !0;
        break a;
      default:
        b = !1;
    }
    return b || (0 === a && !this.isLastUriEffectiveSchemeHttp_());
  };
  f.isLastUriEffectiveSchemeHttp_ = function () {
    var a = String(this.lastUri_).match(Uc)[1] || null;
    !a &&
      v.self &&
      v.self.location &&
      ((a = v.self.location.protocol), (a = a.substr(0, a.length - 1)));
    a = a ? a.toLowerCase() : "";
    return Yc.test(a);
  };
  f.getReadyState = function () {
    return this.xhr_ ? this.xhr_.readyState : 0;
  };
  f.getStatus = function () {
    try {
      return 2 < this.getReadyState() ? this.xhr_.status : -1;
    } catch (a) {
      return -1;
    }
  };
  f.getStatusText = function () {
    try {
      return 2 < this.getReadyState() ? this.xhr_.statusText : "";
    } catch (a) {
      return (T(this.logger_, "Can not get status: " + a.message), "");
    }
  };
  f.getLastUri = function () {
    return String(this.lastUri_);
  };
  f.getResponseText = function () {
    try {
      return this.xhr_ ? this.xhr_.responseText : "";
    } catch (a) {
      return (T(this.logger_, "Can not get responseText: " + a.message), "");
    }
  };
  f.getResponseBody = function () {
    try {
      if (this.xhr_ && "responseBody" in this.xhr_)
        return this.xhr_.responseBody;
    } catch (a) {
      T(this.logger_, "Can not get responseBody: " + a.message);
    }
    return null;
  };
  f.getResponseXml = function () {
    try {
      return this.xhr_ ? this.xhr_.responseXML : null;
    } catch (a) {
      return (T(this.logger_, "Can not get responseXML: " + a.message), null);
    }
  };
  f.getResponseJson = function (a) {
    if (this.xhr_) {
      var b = this.xhr_.responseText;
      a && 0 == b.indexOf(a) && (b = b.substring(a.length));
      a: {
        a = b;
        if (v.JSON)
          try {
            var c = v.JSON.parse(a);
            E("object" == typeof c);
            var d = c;
            break a;
          } catch (e) {}
        d = Gc(a);
      }
      return d;
    }
  };
  f.getResponse = function () {
    try {
      if (!this.xhr_) return null;
      if ("response" in this.xhr_) return this.xhr_.response;
      switch (this.responseType_) {
        case "":
        case "text":
          return this.xhr_.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in this.xhr_)
            return this.xhr_.mozResponseArrayBuffer;
      }
      var a = this.logger_;
      a &&
        a.severe(
          "Response type " +
            this.responseType_ +
            " is not supported on this browser",
          void 0,
        );
      return null;
    } catch (b) {
      return (T(this.logger_, "Can not get response: " + b.message), null);
    }
  };
  f.getResponseHeader = function (a) {
    if (this.xhr_ && this.isComplete())
      return ((a = this.xhr_.getResponseHeader(a)), null === a ? void 0 : a);
  };
  f.getAllResponseHeaders = function () {
    return this.xhr_ && this.isComplete()
      ? this.xhr_.getAllResponseHeaders() || ""
      : "";
  };
  f.getResponseHeaders = function () {
    for (
      var a = {}, b = this.getAllResponseHeaders().split("\r\n"), c = 0;
      c < b.length;
      c++
    )
      if (!/^[\s\xa0]*$/.test(b[c])) {
        var d = pb(b[c], ":", 1),
          e = d[0];
        d = d[1];
        if (z(d)) {
          d = d.trim();
          var g = a[e] || [];
          a[e] = g;
          g.push(d);
        }
      }
    return Qa(a, function (h) {
      return h.join(", ");
    });
  };
  f.getStreamingResponseHeader = function (a) {
    return this.xhr_ ? this.xhr_.getResponseHeader(a) : null;
  };
  f.getAllStreamingResponseHeaders = function () {
    return this.xhr_ ? this.xhr_.getAllResponseHeaders() : "";
  };
  f.getLastErrorCode = function () {
    return this.lastErrorCode_;
  };
  f.getLastError = function () {
    return z(this.lastError_) ? this.lastError_ : String(this.lastError_);
  };
  f.formatMsg_ = function (a) {
    return (
      a +
      " [" +
      this.lastMethod_ +
      " " +
      this.lastUri_ +
      " " +
      this.getStatus() +
      "]"
    );
  };
  function dd(a) {
    this.mechanism = a;
  }
  dd.prototype.set = function (a, b) {
    w(b) ? this.mechanism.set(a, Hc(b)) : this.mechanism.remove(a);
  };
  dd.prototype.get = function (a) {
    try {
      var b = this.mechanism.get(a);
    } catch (c) {
      return;
    }
    if (null !== b)
      try {
        return JSON.parse(b);
      } catch (c) {
        throw "Storage: Invalid value was encountered";
      }
  };
  dd.prototype.remove = function (a) {
    this.mechanism.remove(a);
  };
  function ed(a) {
    this.mechanism = a;
  }
  D(ed, dd);
  function fd(a) {
    this.data = a;
  }
  function gd(a) {
    return !w(a) || a instanceof fd ? a : new fd(a);
  }
  ed.prototype.set = function (a, b) {
    ed.superClass_.set.call(this, a, gd(b));
  };
  ed.prototype.getWrapper = function (a) {
    a = ed.superClass_.get.call(this, a);
    if (!w(a) || a instanceof Object) return a;
    throw "Storage: Invalid value was encountered";
  };
  ed.prototype.get = function (a) {
    if ((a = this.getWrapper(a))) {
      if (((a = a.data), !w(a))) throw "Storage: Invalid value was encountered";
    } else a = void 0;
    return a;
  };
  function X(a) {
    this.mechanism = a;
  }
  D(X, ed);
  X.prototype.set = function (a, b, c) {
    if ((b = gd(b))) {
      if (c) {
        if (c < C()) {
          X.prototype.remove.call(this, a);
          return;
        }
        b.expiration = c;
      }
      b.creation = C();
    }
    X.superClass_.set.call(this, a, b);
  };
  X.prototype.getWrapper = function (a, b) {
    var c = X.superClass_.getWrapper.call(this, a);
    if (c) {
      if ((b = !b)) {
        b = c.creation;
        var d = c.expiration;
        b = (!!d && d < C()) || (!!b && b > C());
      }
      if (b) X.prototype.remove.call(this, a);
      else return c;
    }
  };
  function hd() {}
  function id() {}
  D(id, hd);
  id.prototype.getCount = function () {
    var a = 0;
    Dc(this.__iterator__(!0), function (b) {
      Ha(b);
      a++;
    });
    return a;
  };
  id.prototype.clear = function () {
    var a = Ec(this.__iterator__(!0)),
      b = this;
    Ja(a, function (c) {
      b.remove(c);
    });
  };
  function jd(a) {
    this.storage_ = a;
  }
  D(jd, id);
  f = jd.prototype;
  f.isAvailable = function () {
    if (!this.storage_) return !1;
    try {
      return (
        this.storage_.setItem("__sak", "1"),
        this.storage_.removeItem("__sak"),
        !0
      );
    } catch (a) {
      return !1;
    }
  };
  f.set = function (a, b) {
    try {
      this.storage_.setItem(a, b);
    } catch (c) {
      if (0 == this.storage_.length)
        throw "Storage mechanism: Storage disabled";
      throw "Storage mechanism: Quota exceeded";
    }
  };
  f.get = function (a) {
    a = this.storage_.getItem(a);
    if (!z(a) && null !== a)
      throw "Storage mechanism: Invalid value was encountered";
    return a;
  };
  f.remove = function (a) {
    this.storage_.removeItem(a);
  };
  f.getCount = function () {
    return this.storage_.length;
  };
  f.__iterator__ = function (a) {
    var b = 0,
      c = this.storage_,
      d = new Q();
    d.next = function () {
      if (b >= c.length) throw P;
      var e = Ha(c.key(b++));
      if (a) return e;
      e = c.getItem(e);
      if (!z(e)) throw "Storage mechanism: Invalid value was encountered";
      return e;
    };
    return d;
  };
  f.clear = function () {
    this.storage_.clear();
  };
  f.key = function (a) {
    return this.storage_.key(a);
  };
  function kd() {
    var a = null;
    try {
      a = window.localStorage || null;
    } catch (b) {}
    this.storage_ = a;
  }
  D(kd, jd);
  function ld(a, b) {
    this.storageKey_ = a;
    this.storageNode_ = null;
    if (I && !(9 <= Number(Ib))) {
      md || (md = new U());
      this.storageNode_ = md.get(a);
      this.storageNode_ ||
        (b
          ? (this.storageNode_ = document.getElementById(b))
          : ((this.storageNode_ = document.createElement("userdata")),
            this.storageNode_.addBehavior("#default#userData"),
            document.body.appendChild(this.storageNode_)),
        md.set(a, this.storageNode_));
      try {
        this.loadNode_();
      } catch (c) {
        this.storageNode_ = null;
      }
    }
  }
  D(ld, id);
  var nd = {
      ".": ".2E",
      "!": ".21",
      "~": ".7E",
      "*": ".2A",
      "'": ".27",
      "(": ".28",
      ")": ".29",
      "%": ".",
    },
    md = null;
  function od(a) {
    return (
      "_" +
      encodeURIComponent(a).replace(/[.!~*'()%]/g, function (b) {
        return nd[b];
      })
    );
  }
  f = ld.prototype;
  f.isAvailable = function () {
    return !!this.storageNode_;
  };
  f.set = function (a, b) {
    this.storageNode_.setAttribute(od(a), b);
    this.saveNode_();
  };
  f.get = function (a) {
    a = this.storageNode_.getAttribute(od(a));
    if (!z(a) && null !== a)
      throw "Storage mechanism: Invalid value was encountered";
    return a;
  };
  f.remove = function (a) {
    this.storageNode_.removeAttribute(od(a));
    this.saveNode_();
  };
  f.getCount = function () {
    return this.getNode_().attributes.length;
  };
  f.__iterator__ = function (a) {
    var b = 0,
      c = this.getNode_().attributes,
      d = new Q();
    d.next = function () {
      if (b >= c.length) throw P;
      var e = E(c[b++]);
      if (a)
        return decodeURIComponent(e.nodeName.replace(/\./g, "%")).substr(1);
      e = e.nodeValue;
      if (!z(e)) throw "Storage mechanism: Invalid value was encountered";
      return e;
    };
    return d;
  };
  f.clear = function () {
    for (var a = this.getNode_(), b = a.attributes.length; 0 < b; b--)
      a.removeAttribute(a.attributes[b - 1].nodeName);
    this.saveNode_();
  };
  f.loadNode_ = function () {
    this.storageNode_.load(this.storageKey_);
  };
  f.saveNode_ = function () {
    try {
      this.storageNode_.save(this.storageKey_);
    } catch (a) {
      throw "Storage mechanism: Quota exceeded";
    }
  };
  f.getNode_ = function () {
    return this.storageNode_.XMLDocument.documentElement;
  };
  function pd(a, b) {
    this.mechanism_ = a;
    this.prefix_ = b + "::";
  }
  D(pd, id);
  pd.prototype.set = function (a, b) {
    this.mechanism_.set(this.prefix_ + a, b);
  };
  pd.prototype.get = function (a) {
    return this.mechanism_.get(this.prefix_ + a);
  };
  pd.prototype.remove = function (a) {
    this.mechanism_.remove(this.prefix_ + a);
  };
  pd.prototype.__iterator__ = function (a) {
    var b = this.mechanism_.__iterator__(!0),
      c = this,
      d = new Q();
    d.next = function () {
      for (var e = b.next(); e.substr(0, c.prefix_.length) != c.prefix_; )
        e = b.next();
      return a ? e.substr(c.prefix_.length) : c.mechanism_.get(e);
    };
    return d;
  };
  function qd(a, b) {
    this.domain_ = this.userInfo_ = this.scheme_ = "";
    this.port_ = null;
    this.fragment_ = this.path_ = "";
    this.ignoreCase_ = this.isReadOnly_ = !1;
    var c;
    a instanceof qd
      ? ((this.ignoreCase_ = w(b) ? b : a.getIgnoreCase()),
        this.setScheme(a.getScheme()),
        this.setUserInfo(a.getUserInfo()),
        this.setDomain(a.getDomain()),
        this.setPort(a.getPort()),
        this.setPath(a.getPath()),
        this.setQueryData(a.getQueryData().clone()),
        this.setFragment(a.getFragment()))
      : a && (c = String(a).match(Uc))
        ? ((this.ignoreCase_ = !!b),
          this.setScheme(c[1] || "", !0),
          this.setUserInfo(c[2] || "", !0),
          this.setDomain(c[3] || "", !0),
          this.setPort(c[4]),
          this.setPath(c[5] || "", !0),
          this.setQueryData(c[6] || "", !0),
          this.setFragment(c[7] || "", !0))
        : ((this.ignoreCase_ = !!b),
          (this.queryData_ = new rd(null, null, this.ignoreCase_)));
  }
  f = qd.prototype;
  f.toString = function () {
    var a = [],
      b = this.getScheme();
    b && a.push(sd(b, td, !0), ":");
    var c = this.getDomain();
    if (c || "file" == b)
      (a.push("//"),
        (b = this.getUserInfo()) && a.push(sd(b, td, !0), "@"),
        a.push(
          encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1"),
        ),
        (c = this.getPort()),
        null != c && a.push(":", String(c)));
    if ((c = this.getPath()))
      (this.hasDomain() && "/" != c.charAt(0) && a.push("/"),
        a.push(sd(c, "/" == c.charAt(0) ? ud : vd, !0)));
    (c = this.getEncodedQuery()) && a.push("?", c);
    (c = this.getFragment()) && a.push("#", sd(c, wd));
    return a.join("");
  };
  f.resolve = function (a) {
    var b = this.clone(),
      c = a.hasScheme();
    c ? b.setScheme(a.getScheme()) : (c = a.hasUserInfo());
    c ? b.setUserInfo(a.getUserInfo()) : (c = a.hasDomain());
    c ? b.setDomain(a.getDomain()) : (c = a.hasPort());
    var d = a.getPath();
    if (c) b.setPort(a.getPort());
    else if ((c = a.hasPath())) {
      if ("/" != d.charAt(0))
        if (this.hasDomain() && !this.hasPath()) d = "/" + d;
        else {
          var e = b.getPath().lastIndexOf("/");
          -1 != e && (d = b.getPath().substr(0, e + 1) + d);
        }
      e = d;
      if (".." == e || "." == e) d = "";
      else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
        d = 0 == e.lastIndexOf("/", 0);
        e = e.split("/");
        for (var g = [], h = 0; h < e.length; ) {
          var k = e[h++];
          "." == k
            ? d && h == e.length && g.push("")
            : ".." == k
              ? ((1 < g.length || (1 == g.length && "" != g[0])) && g.pop(),
                d && h == e.length && g.push(""))
              : (g.push(k), (d = !0));
        }
        d = g.join("/");
      } else d = e;
    }
    c ? b.setPath(d) : (c = a.hasQuery());
    c ? b.setQueryData(a.getQueryData().clone()) : (c = a.hasFragment());
    c && b.setFragment(a.getFragment());
    return b;
  };
  f.clone = function () {
    return new qd(this);
  };
  f.getScheme = function () {
    return this.scheme_;
  };
  f.setScheme = function (a, b) {
    this.enforceReadOnly();
    if ((this.scheme_ = b ? xd(a, !0) : a))
      this.scheme_ = this.scheme_.replace(/:$/, "");
    return this;
  };
  f.hasScheme = function () {
    return !!this.scheme_;
  };
  f.getUserInfo = function () {
    return this.userInfo_;
  };
  f.setUserInfo = function (a, b) {
    this.enforceReadOnly();
    this.userInfo_ = b ? xd(a) : a;
    return this;
  };
  f.hasUserInfo = function () {
    return !!this.userInfo_;
  };
  f.getDomain = function () {
    return this.domain_;
  };
  f.setDomain = function (a, b) {
    this.enforceReadOnly();
    this.domain_ = b ? xd(a, !0) : a;
    return this;
  };
  f.hasDomain = function () {
    return !!this.domain_;
  };
  f.getPort = function () {
    return this.port_;
  };
  f.setPort = function (a) {
    this.enforceReadOnly();
    if (a) {
      a = Number(a);
      if (isNaN(a) || 0 > a) throw Error("Bad port number " + a);
      this.port_ = a;
    } else this.port_ = null;
    return this;
  };
  f.hasPort = function () {
    return null != this.port_;
  };
  f.getPath = function () {
    return this.path_;
  };
  f.setPath = function (a, b) {
    this.enforceReadOnly();
    this.path_ = b ? xd(a, !0) : a;
    return this;
  };
  f.hasPath = function () {
    return !!this.path_;
  };
  f.hasQuery = function () {
    return "" !== this.queryData_.toString();
  };
  f.setQueryData = function (a, b) {
    this.enforceReadOnly();
    a instanceof rd
      ? ((this.queryData_ = a), this.queryData_.setIgnoreCase(this.ignoreCase_))
      : (b || (a = sd(a, yd)),
        (this.queryData_ = new rd(a, null, this.ignoreCase_)));
    return this;
  };
  f.setQuery = function (a, b) {
    return this.setQueryData(a, b);
  };
  f.getEncodedQuery = function () {
    return this.queryData_.toString();
  };
  f.getDecodedQuery = function () {
    return this.queryData_.toDecodedString();
  };
  f.getQueryData = function () {
    return this.queryData_;
  };
  f.getQuery = function () {
    return this.getEncodedQuery();
  };
  f.setParameterValue = function (a, b) {
    this.enforceReadOnly();
    this.queryData_.set(a, b);
    return this;
  };
  f.setParameterValues = function (a, b) {
    this.enforceReadOnly();
    va(b) || (b = [String(b)]);
    this.queryData_.setValues(a, b);
    return this;
  };
  f.getParameterValues = function (a) {
    return this.queryData_.getValues(a);
  };
  f.getParameterValue = function (a) {
    return this.queryData_.get(a);
  };
  f.getFragment = function () {
    return this.fragment_;
  };
  f.setFragment = function (a, b) {
    this.enforceReadOnly();
    this.fragment_ = b ? xd(a) : a;
    return this;
  };
  f.hasFragment = function () {
    return !!this.fragment_;
  };
  f.hasSameDomainAs = function (a) {
    return (
      ((!this.hasDomain() && !a.hasDomain()) ||
        this.getDomain() == a.getDomain()) &&
      ((!this.hasPort() && !a.hasPort()) || this.getPort() == a.getPort())
    );
  };
  f.makeUnique = function () {
    this.enforceReadOnly();
    this.setParameterValue(
      "zx",
      Math.floor(2147483648 * Math.random()).toString(36) +
        Math.abs(Math.floor(2147483648 * Math.random()) ^ C()).toString(36),
    );
    return this;
  };
  f.removeParameter = function (a) {
    this.enforceReadOnly();
    this.queryData_.remove(a);
    return this;
  };
  f.setReadOnly = function (a) {
    this.isReadOnly_ = a;
    return this;
  };
  f.isReadOnly = function () {
    return this.isReadOnly_;
  };
  f.enforceReadOnly = function () {
    if (this.isReadOnly_) throw Error("Tried to modify a read-only Uri");
  };
  f.setIgnoreCase = function (a) {
    this.ignoreCase_ = a;
    this.queryData_ && this.queryData_.setIgnoreCase(a);
    return this;
  };
  f.getIgnoreCase = function () {
    return this.ignoreCase_;
  };
  function xd(a, b) {
    return a
      ? b
        ? decodeURI(a.replace(/%25/g, "%2525"))
        : decodeURIComponent(a)
      : "";
  }
  function sd(a, b, c) {
    return z(a)
      ? ((a = encodeURI(a).replace(b, zd)),
        c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
        a)
      : null;
  }
  function zd(a) {
    a = a.charCodeAt(0);
    return "%" + ((a >> 4) & 15).toString(16) + (a & 15).toString(16);
  }
  var td = /[#\/\?@]/g,
    vd = /[#\?:]/g,
    ud = /[#\?]/g,
    yd = /[#\?@]/g,
    wd = /#/g;
  function rd(a, b, c) {
    this.count_ = this.keyMap_ = null;
    this.encodedQuery_ = a || null;
    this.ignoreCase_ = !!c;
  }
  f = rd.prototype;
  f.ensureKeyMapInitialized_ = function () {
    if (
      !this.keyMap_ &&
      ((this.keyMap_ = new U()), (this.count_ = 0), this.encodedQuery_)
    ) {
      var a = this;
      Vc(this.encodedQuery_, function (b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
      });
    }
  };
  f.getCount = function () {
    this.ensureKeyMapInitialized_();
    return this.count_;
  };
  f.add = function (a, b) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    a = this.getKeyName_(a);
    var c = this.keyMap_.get(a);
    c || this.keyMap_.set(a, (c = []));
    c.push(b);
    this.count_ = Ga(this.count_) + 1;
    return this;
  };
  f.remove = function (a) {
    this.ensureKeyMapInitialized_();
    a = this.getKeyName_(a);
    return this.keyMap_.containsKey(a)
      ? (this.invalidateCache_(),
        (this.count_ = Ga(this.count_) - this.keyMap_.get(a).length),
        this.keyMap_.remove(a))
      : !1;
  };
  f.clear = function () {
    this.invalidateCache_();
    this.keyMap_ = null;
    this.count_ = 0;
  };
  f.isEmpty = function () {
    this.ensureKeyMapInitialized_();
    return 0 == this.count_;
  };
  f.containsKey = function (a) {
    this.ensureKeyMapInitialized_();
    a = this.getKeyName_(a);
    return this.keyMap_.containsKey(a);
  };
  f.containsValue = function (a) {
    var b = this.getValues();
    return 0 <= Ia(b, a);
  };
  f.forEach = function (a, b) {
    this.ensureKeyMapInitialized_();
    this.keyMap_.forEach(function (c, d) {
      Ja(
        c,
        function (e) {
          a.call(b, e, d, this);
        },
        this,
      );
    }, this);
  };
  f.getKeys = function () {
    this.ensureKeyMapInitialized_();
    for (
      var a = this.keyMap_.getValues(),
        b = this.keyMap_.getKeys(),
        c = [],
        d = 0;
      d < b.length;
      d++
    )
      for (var e = a[d], g = 0; g < e.length; g++) c.push(b[d]);
    return c;
  };
  f.getValues = function (a) {
    this.ensureKeyMapInitialized_();
    var b = [];
    if (z(a))
      this.containsKey(a) && (b = Na(b, this.keyMap_.get(this.getKeyName_(a))));
    else {
      a = this.keyMap_.getValues();
      for (var c = 0; c < a.length; c++) b = Na(b, a[c]);
    }
    return b;
  };
  f.set = function (a, b) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    a = this.getKeyName_(a);
    this.containsKey(a) &&
      (this.count_ = Ga(this.count_) - this.keyMap_.get(a).length);
    this.keyMap_.set(a, [b]);
    this.count_ = Ga(this.count_) + 1;
    return this;
  };
  f.get = function (a, b) {
    if (!a) return b;
    a = this.getValues(a);
    return 0 < a.length ? String(a[0]) : b;
  };
  f.setValues = function (a, b) {
    this.remove(a);
    0 < b.length &&
      (this.invalidateCache_(),
      this.keyMap_.set(this.getKeyName_(a), Oa(b)),
      (this.count_ = Ga(this.count_) + b.length));
  };
  f.toString = function () {
    if (this.encodedQuery_) return this.encodedQuery_;
    if (!this.keyMap_) return "";
    for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++) {
      var d = b[c],
        e = encodeURIComponent(String(d));
      d = this.getValues(d);
      for (var g = 0; g < d.length; g++) {
        var h = e;
        "" !== d[g] && (h += "=" + encodeURIComponent(String(d[g])));
        a.push(h);
      }
    }
    return (this.encodedQuery_ = a.join("&"));
  };
  f.toDecodedString = function () {
    return xd(this.toString());
  };
  f.invalidateCache_ = function () {
    this.encodedQuery_ = null;
  };
  f.filterKeys = function (a) {
    this.ensureKeyMapInitialized_();
    this.keyMap_.forEach(function (b, c) {
      0 <= Ia(a, c) || this.remove(c);
    }, this);
    return this;
  };
  f.clone = function () {
    var a = new rd();
    a.encodedQuery_ = this.encodedQuery_;
    this.keyMap_ &&
      ((a.keyMap_ = this.keyMap_.clone()), (a.count_ = this.count_));
    return a;
  };
  f.getKeyName_ = function (a) {
    a = String(a);
    this.ignoreCase_ && (a = a.toLowerCase());
    return a;
  };
  f.setIgnoreCase = function (a) {
    a &&
      !this.ignoreCase_ &&
      (this.ensureKeyMapInitialized_(),
      this.invalidateCache_(),
      this.keyMap_.forEach(function (b, c) {
        var d = c.toLowerCase();
        c != d && (this.remove(c), this.setValues(d, b));
      }, this));
    this.ignoreCase_ = a;
  };
  f.extend = function (a) {
    for (var b = 0; b < arguments.length; b++)
      Rc(
        arguments[b],
        function (c, d) {
          this.add(d, c);
        },
        this,
      );
  }; /*
 Copyright (c) Microsoft Corporation. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.
*/
  var Ad =
      (window.yt && window.yt.config_) ||
      (window.ytcfg && window.ytcfg.data_) ||
      {},
    Bd = ["yt", "config_"],
    Y = v;
  Bd[0] in Y ||
    "undefined" == typeof Y.execScript ||
    Y.execScript("var " + Bd[0]);
  for (var Cd; Bd.length && (Cd = Bd.shift()); )
    !Bd.length && w(Ad)
      ? (Y[Cd] = Ad)
      : (Y = Y[Cd] && Y[Cd] !== Object.prototype[Cd] ? Y[Cd] : (Y[Cd] = {}));
  function Dd(a) {
    var b = arguments;
    if (1 < b.length) {
      var c = typeof b[0];
      if ("string" !== c)
        throw Error(
          "Error in argument 'pairs' of setKeyValuePairs. Expected pairs[0] to be of type 'string' but found '" +
            (c + "' instead"),
        );
      Ad[b[0]] = b[1];
    } else if (1 === b.length) {
      c = typeof b[0];
      if ("object" !== c)
        throw Error(
          "Error in argument 'pairs' of setKeyValuePairs. Expected pairs[0] to be of type 'object' but found '" +
            (c + "' instead"),
        );
      Object.assign(Ad, b[0]);
    }
  }
  function Ed(a, b) {
    b
      ? (a = null)
      : ((b = new kd()),
        (b = b.isAvailable() ? (a ? new pd(b, a) : b) : null) ||
          ((a = new ld(a || "UserDataSharedStore")),
          (b = a.isAvailable() ? a : null)),
        (a = b));
    this.expiringStorage_ = a ? new X(a) : null;
    this.domain_ = document.domain || window.location.hostname;
  }
  f = Ed.prototype;
  f.hasLocalStorage = function () {
    return !!this.expiringStorage_;
  };
  f.set = function (a, b, c, d) {
    c = c || 31104e3;
    this.remove(a);
    if (this.hasLocalStorage())
      try {
        this.expiringStorage_.set(a, b, C() + 1e3 * c);
        return;
      } catch (g) {}
    var e = "";
    if (d)
      try {
        e = escape(Hc(b));
      } catch (g) {
        return;
      }
    else e = escape(b);
    b = this.domain_;
    Lc.set("yt-dev." + a, e, c, "/", void 0 === b ? "google.com" : b, !1);
  };
  f.get = function (a, b) {
    var c = void 0,
      d = !this.hasLocalStorage();
    if (!d)
      try {
        c = this.expiringStorage_.get(a);
      } catch (e) {
        d = !0;
      }
    if (d && (c = Lc.get("yt-dev." + a, void 0)) && ((c = unescape(c)), b))
      try {
        c = JSON.parse(c);
      } catch (e) {
        (this.remove(a), (c = void 0));
      }
    return c;
  };
  f.remove = function (a) {
    this.hasLocalStorage() && this.expiringStorage_.remove(a);
    var b = this.domain_;
    Lc.remove("yt-dev." + a, "/", void 0 === b ? "google.com" : b);
  };
  f.getCreationTime = function (a) {
    return this.hasLocalStorage() &&
      ((a = (this.expiringStorage_.getWrapper(a) || {}).creation), sa(a))
      ? a
      : null;
  };
  f.getExpirationTime = function (a) {
    return this.hasLocalStorage() &&
      ((a = (this.expiringStorage_.getWrapper(a) || {}).expiration), sa(a))
      ? a
      : null;
  };
  ca();
  var Fd = Symbol("inject");
  function Gd(a, b) {
    a[Fd] = b;
    return a;
  }
  function Hd() {
    N.apply(this, arguments);
    this.handlersMap = {};
  }
  oa(Hd, N);
  Hd.prototype.on = function (a, b) {
    var c = this,
      d = this.handlersMap[a];
    d || ((d = new Set()), (this.handlersMap[a] = d));
    d.add(b);
    return function () {
      d["delete"](b);
      0 === d.size && delete c.handlersMap[a];
    };
  };
  Hd.prototype.triggerEvent = function (a, b) {
    for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
    if ((d = this.handlersMap[a])) {
      d = r(d);
      for (var e = d.next(); !e.done; e = d.next()) {
        e = e.value;
        try {
          e.apply(null, c);
        } catch (k) {
          e = k;
          var g = ta("yt.logging.errors.log");
          if (g) {
            var h = window.environment || {};
            g(e, "ERROR", h.client_name, h.client_version);
          }
        }
      }
    }
  };
  Hd.prototype.disposeInternal = function () {
    var a = this.handlersMap,
      b;
    for (b in a) delete a[b];
    N.prototype.disposeInternal.call(this);
  };
  function Id(a) {
    this.progressHandler = a;
  }
  oa(Id, Oc);
  Id.prototype.createInstance = function () {
    var a = new XMLHttpRequest();
    a.upload.addEventListener("progress", this.progressHandler, !1);
    return a;
  };
  function Jd(a) {
    W.call(this, Kd(a));
  }
  oa(Jd, W);
  function Kd(a) {
    var b = void 0;
    a &&
      (b = new Id(function (c) {
        c && a(c.loaded, c.total);
      }));
    return b;
  }
  Jd.prototype.getResponse = function () {
    var a = this.getResponseHeader("content-type");
    if (null == a) return "";
    if ("arraybuffer" === this.getResponseType())
      var b = W.prototype.getResponse.call(this);
    else if (a && a.includes("xml")) b = this.getResponseXml();
    else if (a && a.includes("html")) b = this.getResponseText();
    else if (a && !a.includes("image"))
      try {
        b = this.getResponseJson();
      } catch (c) {
        b = this.getResponseText();
      }
    return b;
  };
  Gd(Jd, ["opt_progressHandler"]);
  function Ld(a) {
    function b() {
      c.onUnload();
    }
    Hd.call(this);
    var c = this;
    this.hasShutdown = !1;
    a.addEventListener &&
      (a.addEventListener("beforeunload", b, !1),
      a.addEventListener("unload", b, !1));
  }
  oa(Ld, Hd);
  Ld.prototype.onUnload = function () {
    this.hasShutdown ||
      (this.triggerEvent("shutdown"), (this.hasShutdown = !0));
  };
  Gd(Ld, ["window"]);
  function Md(a, b) {
    (b = ta("ytcsi.tick", b)) && b(a);
  }
  function Nd(a, b, c) {
    (c = ta("ytcsi.info", c)) && c(a, b);
  }
  function Od(a, b) {
    return new Promise(function (c, d) {
      var e = a.createElement("link");
      e.setAttribute("rel", "stylesheet");
      e.setAttribute("type", "text/css");
      e.setAttribute("href", b);
      e.onload = function () {
        c();
      };
      e.onerror = d;
      a.head.appendChild(e);
    });
  }
  Gd(Od, ["document"]);
  v.CLOSURE_UNCOMPILED_DEFINES = { BEDROCK_DEV_JS: !0 };
  function Pd(a, b) {
    function c(p) {
      var q = e.csp_nonce;
      e.is_cobalt
        ? ((q = Qd(document, q)),
          q.setAttribute("src", p),
          document.body.appendChild(q))
        : q
          ? document.write(
              '<script src="' +
                p +
                '" nonce="' +
                q +
                '" aria-hidden="true">\x3c/script>',
            )
          : document.write(
              '<script src="' + p + '" aria-hidden="true">\x3c/script>',
            );
      e.use_reset_logic && d("resetTimeout();");
    }
    function d(p) {
      var q = e.csp_nonce;
      e.is_cobalt
        ? ((q = Qd(document, q)), (q.innerHTML = p), m.push(q))
        : q
          ? document.write(
              '<script aria-hidden="true" nonce="' +
                q +
                '">' +
                (p + "\x3c/script>"),
            )
          : document.write('<script aria-hidden="true">' + p + "\x3c/script>");
    }
    b = void 0 === b ? v : b;
    Nd("yt_lt", "cold", b);
    Md("ld_js_s", b);
    var e = b.loadParams || {};
    b.label = (function (p, q) {
      return q ? q : p && p["default"] ? p["default"] : "unknown";
    })(b.labels, e.label_requested);
    var g = "/assets",
      h,
      k = !1,
      m = [];
    e.load_third_party_deps_binary && c(g + "/third-party-deps.js");
    b.resetTimeout = function () {
      b.clearTimeout(h);
      k ||
        (h = b.setTimeout(function () {
          var p = "local:///network_failure.html";
          e.is_cobalt &&
            (p =
              "h5vcc://network-failure?retry-url=" +
              encodeURI(b.location.href.split("#")[0]));
          b.location.replace(p);
        }, 4e4));
    };
    e.use_reset_logic &&
      (b.resetTimeout(),
      (b.applicationLoaded = function () {
        k = !0;
        b.clearTimeout(h);
      }));
    var n = a.prodCssOverride || e.tv_css;
    e.debugjs
      ? ((b.CLOSURE_NO_DEPS = !0),
        n && Od(document, g + n),
        c(g + a.debugJsInitializer))
      : e.devjs ||
        (n && Od(document, g + n), c(g + (a.prodJsOverride || e.tv_binary)));
    e.load_player && c(e.player_url);
    b.checkBrokenLabel = function () {
      if ("undefined" === typeof b.yt && e.label_requested) {
        var p = b.location,
          q = b.location.href.replace(/([?&])label=[^&]+&?/, "$1stick=0&");
        a: {
          try {
            var x = p && p.ownerDocument,
              y = x && (x.defaultView || x.parentWindow);
            y = y || v;
            if (y.Element && y.Location) {
              var M = y;
              break a;
            }
          } catch (pe) {}
          M = null;
        }
        if (
          M &&
          (!p || (!(p instanceof M.Location) && p instanceof M.Element))
        ) {
          if (xa(p))
            try {
              var R =
                p.constructor.displayName ||
                p.constructor.name ||
                Object.prototype.toString.call(p);
            } catch (pe) {
              R = "<object could not be stringified>";
            }
          else R = void 0 === p ? "undefined" : null === p ? "null" : typeof p;
          Fa("Argument is not a Location (or a non-Element mock); got: %s", R);
        }
        q instanceof bb ||
          q instanceof bb ||
          ((q =
            "object" == typeof q && q.implementsGoogStringTypedString
              ? q.getTypedStringValue()
              : String(q)),
          E(db.test(q), "%s does not match the safe URL pattern", q) ||
            (q = "about:invalid#zClosurez"),
          (q = eb(q)));
        q instanceof bb &&
        q.constructor === bb &&
        q.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === cb
          ? (q = q.privateDoNotAccessOrElseSafeUrlWrappedValue_)
          : (Fa(
              "expected object of type SafeUrl, got '" +
                q +
                "' of type " +
                A(q),
            ),
            (q = "type_error:SafeUrl"));
        p.href = q;
      }
    };
    d("checkBrokenLabel()");
    b.initializeOrRedirect = function (p) {
      Md("js_r", b);
      e.devjs || (e.download_kabu_keyboard_async && c(p + "/kabu-prod.js"));
      var q = ta(a.initializerPath);
      q ? q(p) : (b.location = "http://www.youtube.com/error?src=404");
    };
    d("initializeOrRedirect('" + g + "');");
    e.is_cobalt &&
      (b.onload = function () {
        for (var p = 0, q = m.length; p < q; ++p)
          document.body.appendChild(m[p]);
      });
  }
  function Qd(a, b) {
    a = a.createElement("script");
    a.setAttribute("aria-hidden", "true");
    b && a.setAttribute("nonce", b);
    return a;
  }
  function Rd(a, b, c, d) {
    var e = this;
    this.storageApi = b;
    this.validKeySet = c;
    this.storage = a();
    if (d)
      d.on("shutdown", function () {
        e.flush();
      });
  }
  f = Rd.prototype;
  f.isLocalStorage = function () {
    return this.storage.hasLocalStorage();
  };
  f.set = function (a, b, c, d) {
    if (a in this.validKeySet)
      this.storage.set(a, b, c, !(void 0 === d ? 0 : d));
    else throw Error("Attempt to set invalid key in local storage: " + a);
  };
  f.get = function (a, b, c) {
    c = void 0 === c ? !1 : c;
    var d = this.storage.get(a, !c);
    void 0 !== d && b && this.set(a, d, b, c);
    return d;
  };
  f.getCreationTime = function (a) {
    return this.storage.getCreationTime(a);
  };
  f.getExpirationTime = function (a) {
    return this.storage.getExpirationTime(a);
  };
  f.remove = function (a) {
    this.storage.remove(a);
  };
  f.clearKeys = function (a, b) {
    b = void 0 === b ? !1 : b;
    for (var c in a) a.hasOwnProperty(c) && this.storage.remove(c);
    b && this.flush();
  };
  f.flush = function (a) {
    a = void 0 === a ? !1 : a;
    this.storageApi.isSupported() && this.storageApi.flush(a);
  };
  Gd(Rd, ["makeStorage", "storageApi", "validKeySet", "opt_shutdownService"]);
  var Sd = {
      STICKY_FORCE_FULL_ANIMATION: "sticky-force-full-animation",
      STICKY_LABEL: "sticky-label",
      STICKY_LOADER: "sticky-loader",
    },
    Td = {
      ACCOUNT_CREDENTIALS: "account-credentials",
      ACCOUNTS_MAP: "accounts-map",
      ACTIVE_ACCOUNT: "active-account",
      DEVICE_STATS: "device-stats",
      HAS_MIGRATED_TO_CREDENTIAL_MANAGER: "has-migrated-to-credential-manager",
      IS_FIRST_LAUNCH: "is-first-launch",
      MDX_AUTOPLAY_ENABLED: "mdx-autoplay-enabled",
      MDX_DEVICE_ID: "mdx-device-id",
      MDX_IMPACTED_SESSIONS_SERVER_EVENTS:
        "mdx-impacted-sessions-server-events",
      MDX_SCREEN: "yt_mdx_screen",
      PAIRED_DEVICES: "migrated-mdx-paired-devices",
      RED_TRIAL_VOICE_ALERT_TRIGGERED: "red-trial-voice-alert-triggered",
      REFRESH_TOKEN: "tv-refresh-token",
      SHOW_VIDEO_INFO_ENABLED: "show-video-info-enabled",
      SMART_REMOTE_USED: "smart-remote-used",
      TOKEN_LIST: "tv-token-list",
      VISITOR_DATA: "visitor-data",
    };
  function Ud(a) {
    return a();
  }
  Gd(Ud, ["ytStorageFactory"]);
  function Vd(a) {
    return "/" === a.charAt(0) ? a.substr(1) : a;
  }
  var Wd = /^\?/,
    Xd = /^-?(?:|0|[1-9][0-9]*)(?:\.[0-9]*)?$/;
  function Yd(a) {
    if ("number" === typeof a) return a;
    if (a && "string" === typeof a && Xd.test(a)) return Number(a);
    if (null != a && "string" === typeof a && "" === a.trim()) return a;
    var b = String(a).toLowerCase();
    return "true" === b || !0 === a
      ? !0
      : "false" === b || !1 === a
        ? !1
        : null != a
          ? "" + a
          : "";
  }
  function Zd(a, b) {
    b = void 0 === b ? [] : b;
    var c = {};
    if (a) {
      a = a.replace(Wd, "");
      a = a.split("&");
      for (var d = 0, e = a.length; d < e; ++d) {
        var g = a[d].split("="),
          h = g.shift();
        g = g.join("=");
        b.includes(h) || (g = Yd(g));
        g = "string" === typeof g ? decodeURIComponent(g) : g;
        h && (c[h] = g);
      }
    }
    return c;
  }
  var $d = {
      ACCESS_TOKEN_RECEIVED: "access-token-received",
      ACCOUNTS_MAP_COOKIE: "accounts-map-c",
      ACCOUNT_CREDENTIALS_COOKIE: "account-credentials-c",
      ACTIVE_ACCOUNT_COOKIE: "active-account-c",
      AIRSTREAM_SESSION_HISTORY: "airstream-session-history",
      AUTOMATION_TEST_DATA: "automation-test-data",
      AUTOPLAY_ENABLED: "autoplay-enabled",
      DISPLAY_LANGUAGE_CHANGED_TOAST: "display-language-changed-toast",
      ENABLE_DIRECT_SIGN_IN: "enable-direct-sign-in",
      GUIDE_OPENED_EVER: "guide-opened-ever",
      HIGH_CONTRAST_ENABLED: "high-contrast-enabled",
      UI_STATS_RESULTS: "ui-stats-test-data",
      INLINE_PLAYBACK_ENABLED: "inline-playback-enabled",
      LAST_GUIDE_OPENED_TIME: "last-guide-opened-tine",
      LAST_HOME_BROWSE_REQUEST_PAYLOAD: "last-home-browse-request-payload",
      LAST_HOME_BROWSE_REQUEST_URL: "last-home-browse-request-url",
      LIVE_CHAT_EDUCATION_TOAST_SHOWN: "live-chat-education-toast-shown",
      LIVE_CHAT_ENABLED: "live-chat-enabled",
      LIVE_CHAT_INTERACTED: "live-chat-interacted",
      NO_EXPERIMENTS: "no-experiments",
      NUM_TIMES_IME_TELEX_TOAST_SHOWN: "num-times-ime-telex-toast-shown",
      NUM_VOICE_SEARCH_EDUCATION_TOASTS_SHOWN:
        "num-voice-search-education-toasts-shown",
      PROMO_COUPON_SHOWN_TIMES: "promo-coupon-shown-times",
      PROMO_COUPON_SHOWN_TIMESTAMP: "promo-coupon-shown-timestamp",
      PROMO_PREMIUM_SHOWN_TIMES: "promo-premium-shown-times",
      PROMO_PREMIUM_SHOWN_TIMESTAMP: "promo-premium-shown-timestamp",
      RATE_ATV_TOAST_SHOWN: "rate-atv-toast-shown",
      RECURRING_ACTIONS: "recurring_actions",
      REFRESH_TOKEN_COOKIE: "tv-refresh-token-c",
      SAFE_MODE_ENABLED: "safe-mode-enabled",
      SHARED_DEVICE_TOAST_SHOWN: "shared-device-toast-shown",
      SOUND_ENABLED: "sound-enabled",
      TOKEN_LIST_COOKIE: "tv-token-list-c",
      TOKEN_TIME: "token-time",
      TOKEN_TIME_COOKIE: "token-time-c",
      WELCOME_OVERLAY_SHOWN_TIMESTAMP:
        "sign-in-onboarding-dialog-shown-timestamp",
      NUM_SMART_REMOTE_TOASTS_SHOWN: "num-smart-remote-toasts-shown",
    },
    ae = {
      PRIVATE_DATA_PERMISSION: "device-retention-permission",
      SCHEMA_VERSION: "schema-version",
    },
    be = {
      DEVICE_STATISTICS: "device-stats",
      STORAGE_INTEGRITY: "storage-integrity",
    },
    ce = {
      ACCESS_TOKEN: "tv-access-token",
      ACTIVITY_PATH: "activity-path",
      AIRSTREAM_BENTO_TRAINING_COUNT: "airstream-bento-training-count",
      CAPTIONS_SETTINGS: "captions-settings",
      CRASH_CLEAN_EXIT_COUNT: "clean-exits",
      CRASH_COUNT: "crash-count",
      CRASH_DATA: "crash-data",
      CRASH_STARTUP_COUNT: "startup-count",
      CRASH_STARTUP_TIME: "startup",
      DEPRECATED_PAIRED_DEVICES: "mdx-paired-devices",
      DEVICE_STATISTICS_OLD: "device-statistics",
      HAS_AUTHENTICATED: "has-authenticated",
      HAS_BEEN_ONBOARDED: "has-been-onboarded",
      HAS_GUIDE_AUTO_OPENED: "has-guide-auto-opened",
      INLINE_SIGN_IN_COUNT: "inline-sign-in-count",
      INNERTUBE_VISITOR_DATA: "innertube-visitor-data",
      KIDS_PROMO_TOAST: "kids-promo-toast",
      NEEDS_INLINE_SIGN_IN: "needs-inline-sign-in",
      NEEDS_RENTAL_AUTH_DIALOG: "needs_rental_auth_dialog",
      NEEDS_SETS_ONBOARDING: "needs-sets-onboarding",
      PERSISTENT_COOKIE: "persistent-cookie",
      PERSISTENT_LOCAL: "persistent-local",
      PRIVATE_DATA: "private_data",
      REFRESH_TOKEN_V3: "leanback_oauth_renew",
      SAMSUNG_SIGNIN_ERROR_TOAST_SHOWN: "samsung-signin-error-toast-shown",
      SAVED_SEARCHES: "saved-searches",
      SIGNIN_AFTER_N_COUNT: "signing-after-n-count",
      SIGNIN_AFTER_N_LAST_SHOWN: "signin-after-n-last-shown",
      SIGN_IN_ONBOARDING_DIALOG_SHOWN: "sign-in-onboarding-dialog-shown",
      SIGN_IN_PROMO_GUIDE_TOAST_SHOWN: "sign-in-promo-guide-toast-shown",
      SIGN_IN_SHELF_HISTORY: "sign-in-shelf-history",
      SMART_GUIDE: "smart-guide",
      SPINNER_LOG: "spinner_log",
      STICKY_FORCE_FULL_ANIMATION: "sticky-force-full-animation",
      STICKY_LABEL: "sticky-label",
      STICKY_LOADER: "sticky-loader",
      SUBS_MOVED_TOAST_SHOWN: "subs-moved-toast-shown",
      TOPIC_ONBOARDING_TOPICS: "topic-onboarding-topics",
      TOPICS_TOAST_SHOWN: "topics-toast-shown",
      UPLOADS_TOAST_SHOWN: "uploads-toast-shown",
    };
  function de(a) {
    return "yt.leanback." + (void 0 === a ? "default" : a);
  }
  Gd(de, ["opt_sandbox"]);
  Gd(
    function (a, b, c) {
      var d = "default";
      if (a.is_sandboxed)
        switch (b.theme) {
          case "g":
            d = "g";
            break;
          case "k":
            d = "k";
            break;
          default:
            d = "u";
        }
      return c({ opt_sandbox: d });
    },
    ["runtimeParams", "clientInfo", "makeSandboxNamespace"],
  );
  function ee(a) {
    a = void 0 === a ? v : a;
    var b = a.environment.theme || "cl";
    if (
      a.environment.flags.enable_early_browse_request &&
      "cl" === b &&
      ((b = new qd(a.location.hash.substring(1))), "" === Vd(b.getPath()))
    ) {
      var c = fe(a);
      if (
        !c.get("active-account") &&
        ((b = c.get("last-home-browse-request-url")),
        (c = c.get("last-home-browse-request-payload")),
        b && c)
      ) {
        var d = c.context.client;
        if (
          d.clientVersion === a.environment.client_version &&
          ge(
            d.acceptLanguage,
            d.acceptRegion,
            a.environment.hl,
            a.environment.gl,
            a.environment.language,
          )
        ) {
          d.experimentIds = a.environment.experiments;
          c = JSON.stringify(c);
          var e = new Jd();
          a.earlyBrowseRequestParams = {
            browseResponse: null,
            cancel: function () {
              return e.abort();
            },
            isLoading: !0,
          };
          d = function () {
            var g = e.getLastError(),
              h = e.getStatus();
            console.error("Early browse request failed: " + g + ", " + h);
          };
          e.listen("timeout", d);
          e.listen("error", d);
          e.listen("success", function () {
            Md("b_rqf", a);
            var g = a.earlyBrowseRequestParams;
            g &&
              ((g.isLoading = !1),
              (g.browseResponse = e.getResponse()),
              (g.cancel = null));
          });
          d = {
            "Content-Type": "application/json",
            "X-Goog-Visitor-Id": a.environment.visitor_data,
          };
          Md("b_rqs", a);
          e.send(b, "POST", c, d);
        }
      }
    }
  }
  function ge(a, b, c, d, e) {
    a = a ? a.toLowerCase() : "";
    b = b ? b.toLowerCase() : "";
    var g = a + "-" + b;
    c = c ? c.toLowerCase() : "";
    d = d ? d.toLowerCase() : "";
    return c && d
      ? g === c + "-" + d
      : c
        ? c === a
        : d
          ? d === b
          : e
            ? he(a, b, e)
            : !0;
  }
  function he(a, b, c) {
    var d = a + "-" + b;
    c = c.split(",").map(function (k) {
      return $a(k.split(";")[0]);
    });
    for (var e = 0; e < c.length; ++e) {
      var g = c[e].toLowerCase(),
        h = g.split("-")[1];
      if (g === d || g === a || h === b) return !0;
    }
    return !1;
  }
  function fe() {
    var a = Sa(Sd);
    a = Object.assign({}, Sa($d), Sa(ce), Sa(be), Sa(ae), Sa(Td), a);
    var b = Ud.bind(null, function () {
      return new Ed(de());
    });
    return new Rd(
      b,
      {
        cookies: {
          clear: function () {},
          enabled: !1,
          isSupported: function () {
            return !1;
          },
          isUiRequired: function () {
            return !1;
          },
        },
        flush: function () {},
        isSupported: function () {
          return !1;
        },
      },
      a,
    );
  }
  var Z = void 0;
  Z = void 0 === Z ? v : Z;
  try {
    ee(Z);
  } catch (a) {
    var ie = a,
      je = ta("yt.logging.errors.log");
    if (je) je(ie, void 0, void 0, void 0, void 0);
    else {
      var ke,
        le = [];
      ke = "ERRORS" in Ad ? Ad.ERRORS : le;
      ke.push([ie, void 0, void 0, void 0, void 0]);
      Dd("ERRORS", ke);
    }
  }
  var me = Zd(Z.location.hash.replace(/#[^?]*\??/, ""));
  if (me.theme && "cl" !== me.theme) {
    var ne =
        "" +
        (Z.location.search || "") +
        "&" +
        (Z.location.hash || "").replace(/#[^?]*\??/, ""),
      oe = Zd(ne),
      qe = "/tv",
      re = void 0;
    re = void 0 === re ? !1 : re;
    var se;
    a: {
      for (var te in oe) {
        se = !1;
        break a;
      }
      se = !0;
    }
    if (!se) {
      var ue = qe.includes("?") ? "&" : "?",
        ve = qe,
        we = void 0 === re ? !1 : re,
        xe = [],
        ye = void 0 === we ? !1 : we;
      ye = void 0 === ye ? !1 : ye;
      for (
        var ze = {}, Ae = Object.keys(oe || {}), Be = 0, Ce = Ae.length;
        Be < Ce;
        ++Be
      ) {
        var De = Ae[Be],
          Ee = oe[De];
        null != Ee &&
          (ye ? (ze[De] = Yd(Ee)) : "" !== Ee && (ze[De] = Yd(Ee || 0)));
      }
      for (var Fe = Object.keys(ze), Ge = 0, He = Fe.length; Ge < He; ++Ge) {
        var Ie = Fe[Ge];
        xe.push(encodeURIComponent(Ie) + "=" + encodeURIComponent("" + ze[Ie]));
      }
      qe = ve + ("" + ue + xe.join("&"));
    }
    Z.location.assign(qe);
  } else {
    var Je = { initializerPath: "yt.tv.initialize" };
    "Cast Receiver" === Z.environment.browser
      ? ((Je.devJsInitializer = "/chromecast-concat-bundle-dev.js"),
        (Je.debugJsInitializer = "/chromecast-concat-bundle.js"))
      : ((Je.devJsInitializer = "/app-concat-bundle-dev.js"),
        (Je.debugJsInitializer = "/app-concat-bundle.js"));
    Pd(Je, Z);
  }
}).call(this);
