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

function css(target, property) {
	return target.currentStyle ? target.currentStyle[property] : getComputedStyle(target, false)[property]
}

function move(target, opt, during, speed, fn) {
	clearInterval(target.iTimer);
	var duringTime = during || 1000,
		obj = {};
	for (var pro in opt) {
		obj[pro] = {};
		"opacity" == pro ?
			(obj[pro].b = Math.round(100 * css(target, pro)),
				obj[pro].c = 100 * opt[pro] - obj[pro].b) :
			(obj[pro].b = parseInt(css(target, pro)),
				obj[pro].c = opt[pro] - obj[pro].b)
	}

	var speed = speed || "linear",
		curTime = (new Date).getTime();
	target.iTimer = setInterval(function() {
		var during = (new Date).getTime() - curTime;
		during >= duringTime && (during = duringTime);
		for (var pro in opt) {
			var val = Tween[speed](during, obj[pro].b, obj[pro].c, duringTime);
			"opacity" == pro ? (target.style[pro] = val / 100,
				target.style.filter = "alpha(opacity=" + val + ")") : target.style[pro] = val + "px"
		}
		during == duringTime && (clearInterval(target.iTimer),
			fn && fn.call(target))
	}, 16)
}

// var one = document.getElementById('one');
// var two = document.getElementById('two');
// var three = document.getElementById('three');
// var four = document.getElementById('four');
// var five = document.getElementById('five');

/*
	move参数：
	运动对象 obj
	改变的值 obj
	过渡时间 int
	过渡形式 string
	运动完回调 function

ps:
	在css定义初始的样式
	absolute
	left,top

*/


// setTimeout(function() {
// 	move(one, {
// 		left: "56",
// 		top: "132",
// 		width: "112",
// 		height: "127"
// 	}, 500, "easeOutStrong", function() {
// 		move(one, {
// 			left: "311",
// 			top: "175"
// 		}, 500, "easeBothStrong")
// 	})
// }, 500);
// setTimeout(function() {
// 	move(two, {
// 		left: "129",
// 		top: "289",
// 		width: "100",
// 		height: "112"
// 	}, 500, "easeOutStrong", function() {
// 		move(two, {
// 			left: "388",
// 			top: "199"
// 		}, 500, "easeBothStrong")
// 	})
// }, 600);
// setTimeout(function() {
// 	move(three, {
// 		left: "713",
// 		top: "142",
// 		width: "114",
// 		height: "107"
// 	}, 500, "easeOutStrong", function() {
// 		move(three, {
// 			left: "442",
// 			top: "218"
// 		}, 500, "easeBothStrong")
// 	})
// }, 700);
// setTimeout(function() {
// 	move(four, {
// 		left: "676",
// 		top: "275",
// 		width: "82",
// 		height: "94"
// 	}, 500, "easeOutStrong", function() {
// 		move(four, {
// 			left: "516",
// 			top: "239"
// 		}, 500, "easeBothStrong")
// 	})
// }, 800);
// setTimeout(function() {
// 	move(five, {
// 		left: "657",
// 		top: "168",
// 		width: "90",
// 		height: "88"
// 	}, 500, "easeOutStrong", function() {
// 		move(five, {
// 			left: "555",
// 			top: "252"
// 		}, 500, "easeBothStrong")
// 	})
// }, 900);