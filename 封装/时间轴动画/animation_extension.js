function css(e, t, a) {
	if (2 == arguments.length) {
		if ("scale" == t || "rotate" == t || "rotateX" == t || "rotateY" == t || "rotateZ" == t || "scaleX" == t || "scaleY" == t || "translateY" == t || "translateX" == t || "translateZ" == t) switch (e.$Transform || (e.$Transform = {}), t) {
			case "scale":
			case "scaleX":
			case "scaleY":
				return "number" == typeof e.$Transform[t] ? e.$Transform[t] : 100;
			case "translateY":
			case "translateX":
			case "translateZ":
				return e.$Transform[t] ? e.$Transform[t] : 0;
			default:
				return e.$Transform[t] ? e.$Transform[t] : 0
		}
		var n = e.currentStyle ? e.currentStyle[t] : document.defaultView.getComputedStyle(e, !1)[t];
		return "opacity" == t ? Math.round(100 * parseFloat(n)) : parseInt(n)
	}
	if (3 == arguments.length) switch (t) {
		case "scale":
		case "scaleX":
		case "scaleY":
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
		case "translateY":
		case "translateX":
		case "translateZ":
			setCss3(e, t, a);
			break;
		case "width":
		case "height":
		case "paddingLeft":
		case "paddingTop":
		case "paddingRight":
		case "paddingBottom":
			a = Math.max(a, 0);
		case "left":
		case "top":
		case "right":
		case "bottom":
		case "marginLeft":
		case "marginTop":
		case "marginRight":
		case "marginBottom":
			e.style[t] = "string" == typeof a ? a : a + "px";
			break;
		case "opacity":
			e.style.filter = "alpha(opacity:" + a + ")", e.style.opacity = a / 100;
			break;
		default:
			e.style[t] = a
	}
	return function(t, a) {
		css(e, t, a)
	}
}

function setCss3(e, t, a) {
	var n = "",
		r = "",
		s = ["Webkit", "Moz", "O", "ms", ""];
	e.$Transform || (e.$Transform = {}), e.$Transform[t] = parseInt(a);
	for (n in e.$Transform) switch (n) {
		case "scale":
		case "scaleX":
		case "scaleY":
			r += n + "(" + e.$Transform[n] / 100 + ") ";
			break;
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
			r += n + "(" + e.$Transform[n] + "deg) ";
			break;
		case "translateY":
		case "translateX":
		case "translateZ":
			r += n + "(" + e.$Transform[n] + "px) "
	}
	for (var c = 0; c < s.length; c++) e.style[s[c] + "Transform"] = r
}



var Tween = {
	linear: function(e, t, a, n) {
		return a * e / n + t
	},
	easeIn: function(e, t, a, n) { //从慢到快
		return a * (e /= n) * e + t
	},
	easeOut: function(e, t, a, n) { //从快到慢
		return -a * (e /= n) * (e - 2) + t
	},
	easeBoth: function(e, t, a, n) {
		return (e /= n / 2) < 1 ? a / 2 * e * e + t : -a / 2 * (--e * (e - 2) - 1) + t
	},
	easeInStrong: function(e, t, a, n) {
		return a * (e /= n) * e * e * e + t
	},
	easeOutStrong: function(e, t, a, n) {
		return -a * ((e = e / n - 1) * e * e * e - 1) + t
	},
	easeBothStrong: function(e, t, a, n) {
		return (e /= n / 2) < 1 ? a / 2 * e * e * e * e + t : -a / 2 * ((e -= 2) * e * e * e - 2) + t
	},
	elasticIn: function(e, t, a, n, r, s) { //先晃动然后走
		if (0 === e) return t;
		if (1 == (e /= n)) return t + a;
		if (s || (s = .3 * n), !r || r < Math.abs(a)) {
			r = a;
			var c = s / 4
		} else var c = s / (2 * Math.PI) * Math.asin(a / r);
		return -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * n - c) * Math.PI / s)) + t
	},
	elasticOut: function(e, t, a, n, r, s) { //先走然后再晃动
		if (0 === e) return t;
		if (1 == (e /= n)) return t + a;
		if (s || (s = .3 * n), !r || r < Math.abs(a)) {
			r = a;
			var c = s / 4
		} else var c = s / (2 * Math.PI) * Math.asin(a / r);
		return r * Math.pow(2, -10 * e) * Math.sin(2 * (e * n - c) * Math.PI / s) + a + t
	},
	elasticBoth: function(e, t, a, n, r, s) { //开始与结束都晃动
		if (0 === e) return t;
		if (2 == (e /= n / 2)) return t + a;
		if (s || (s = .3 * n * 1.5), !r || r < Math.abs(a)) {
			r = a;
			var c = s / 4
		} else var c = s / (2 * Math.PI) * Math.asin(a / r);
		return 1 > e ? -.5 * r * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * n - c) * Math.PI / s) + t : r * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e * n - c) * Math.PI / s) * .5 + a + t
	},
	backIn: function(e, t, a, n, r) {
		return "undefined" == typeof r && (r = 1.70158), a * (e /= n) * e * ((r + 1) * e - r) + t
	},
	backOut: function(e, t, a, n, r) {
		return "undefined" == typeof r && (r = 3.70158), a * ((e = e / n - 1) * e * ((r + 1) * e + r) + 1) + t
	},
	backBoth: function(e, t, a, n, r) {
		return "undefined" == typeof r && (r = 1.70158), (e /= n / 2) < 1 ? a / 2 * e * e * (((r *= 1.525) + 1) * e - r) + t : a / 2 * ((e -= 2) * e * (((r *= 1.525) + 1) * e + r) + 2) + t
	},
	bounceIn: function(e, t, a, n) {
		return a - Tween.bounceOut(n - e, 0, a, n) + t
	},
	bounceOut: function(e, t, a, n) { //弹球
		return (e /= n) < 1 / 2.75 ? 7.5625 * a * e * e + t : 2 / 2.75 > e ? a * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : 2.5 / 2.75 > e ? a * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : a * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t
	},
	bounceBoth: function(e, t, a, n) {
		return n / 2 > e ? .5 * Tween.bounceIn(2 * e, 0, a, n) + t : .5 * Tween.bounceOut(2 * e - n, 0, a, n) + .5 * a + t
	}
};

function tweenMove(opt) {
	var target = opt.obj,
		oTarget = opt.oTarget,
		iTime = opt.iTime,
		iType = opt.iType,
		fnEnd = opt.fnEnd,
		fnDuring = opt.fnDuring,
		twType = Tween[iType],
		i = 0,
		obj1 = {},
		obj2 = {},
		l = iTime / 24,
		obj3 = {},
		m = "";
	clearInterval(target.timer);
	for (m in oTarget) obj1[m] = css(target, m), obj2[m] = oTarget[m] - obj1[m], obj3[m] = 0;
	if (30 > iTime) {
		for (m in oTarget) css(target, m, oTarget[m]);
	} else {
		target.timer = setInterval(function() {
			if (l > i) {
				i++;
				for (m in oTarget) {
					obj3[m] = twType(i, obj1[m], obj2[m], l), css(target, m, twType(i, obj1[m], obj2[m], l))
				}
			} else {
				for (m in oTarget) css(target, m, oTarget[m]);
				clearInterval(target.timer), fnEnd && fnEnd.call(target)
			}

			fnDuring && fnDuring.call(target, obj1, obj3, i, l)
		}, 24);
	}
}


/*
tweenMove({
	obj: one,
	oTarget:{
		left:400
	},
	iTime:2000,
	iType:"easeOut",
	fnDuring:function(){},
	fnEnd:function(){}
});

ps:
支持css3和during动画
*/


