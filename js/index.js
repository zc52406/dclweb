var winWidth, winHeight, lastPage = 0,
	currentPage = 1,
	totalPage = 0,
	pageTransition = false,
	pageEvents = {},
	pageReverts = {},
	$header = $('#J_Header'),
	carousels = [];

function goToPage(targetPage, mode) {
	var $targetPage = $("#page-" + targetPage);

	var idx = $targetPage.index();

	if(lastPage && lastPage != targetPage) {
		$('#page-' + lastPage).removeClass('page' + lastPage + '-loaded');
		pageReverts[lastPage] && pageReverts[lastPage].call();
	}

	if(mode == "slide" && lastPage != targetPage) {
		$page.animate({
			top: -winHeight * (targetPage - 1)
		}, 1300)
	} else if(mode == "fade" && lastPage != targetPage) {
		$pages.addClass("absolute").hide();
		$page.removeClass("animate").css({
			top: 0
		});
		$targetPage.fadeIn(1000).css('z-index', 5).siblings("div.page").css('z-index', 1).fadeOut(1000);
		setTimeout(function() {
			$pages.removeClass("absolute").show();
			$page.css({
				top: -winHeight * idx
			});
		}, 1000);
	} else {
		$page.css({
			top: -winHeight * idx
		});
	}

	if(lastPage != targetPage) {
		pageTransition = true;
		currentPage = targetPage;
		$indicators.eq(currentPage - 1).addClass("current").siblings().removeClass("current");
		$targetPage.addClass("current").siblings("div.page").removeClass("current");
		setTimeout(function() {
			lastPage = currentPage;
			$targetPage.addClass('page' + targetPage + '-loaded');
			pageEvents[targetPage] && pageEvents[targetPage].call();
			if(targetPage === 1) {
				$header.removeClass('header-black');
			} else {
				$header.addClass('header-black');
			}
			$header.find('li').removeClass('active');
			// console.info(targetPage);
			$header.find('a[data-rel=' + targetPage + ']').parent().addClass('active');
		}, 800);
		setTimeout(function() {
			pageTransition = false;
		}, 1500);
	}
}

function resetPage() {
	var $pages = $("div.page");
	window.scrollTo(0, 0);
	setTimeout(function() {
		winWidth = $(window).width();
		winHeight = $(window).height();
		$pages.height(winHeight);
		totalPage = $(".page:visible").length;
		goToPage(currentPage);

		if(winHeight < 700) {
			$('body').addClass('body-small')
		} else {
			$('body').removeClass('body-small')
		}

		Slider.reset();
	}, 100);
}

/**
 * 首屏幻灯
 */
var Slider = (function() {
	var $slider = $('#J_p1Slider');

	var $wrap = $slider.children('.items');
	var len = $wrap.children('.item').length;

	var current = 0,
		last = 0,
		pause = false;

	$slider.find('.prev').click(function(e) {
		last = current;
		show(--current);
		e.preventDefault();
	});
	$slider.find('.next').click(function(e) {
		last = current;
		show(++current);
		e.preventDefault();
	});
	$slider.find('.ctrl').hover(function() {
		pause = true;
	}, function() {
		pause = false;
	});

	function show(i) {
		if(i < 0) {
			i = len - 1;
		} else if(i >= len) {
			i = 0;
		}

		current = i;

		$wrap.children().eq(last).fadeOut(1000);
		$wrap.children().eq(current).fadeIn(1000);
	}

	show(current);
	var timer;

	return {
		reset: function() {
			$wrap.width(winWidth * len);
			$wrap.children().width(winWidth);
		},
		disable: function() {
			clearInterval(timer);
		},
		enable: function() {
			timer = setInterval(function() {
				if(pause) {
					return;
				}
				last = current;
				show(++current);
			}, 4000);
		}
	}
}());
Slider.enable();

/**
 * 延迟遍历数组
 * @param  {[type]} arr  [数组]
 * @param  {[type]} func [回调]
 * @param  {[type]} time [延迟时间]
 */
function loopWithPause(arr, func, time) {
	if(!arr.length) {
		return;
	}

	function one(idx, arr) {
		if(idx === arr.length) {
			return;
		} else {
			setTimeout(function() {
				func.call(arr[idx], idx, arr[idx]);
				idx++;
				one(idx, arr);
			}, time);
		}
	}

	func.call(arr[0], 0, arr[0]);
	one(1, arr);
}

$(function() {
	$page = $("#page");
	$pages = $(".page");
	$indicators = $("#page-indicator li");

	winWidth = $(window).width();
	winHeight = $(window).height();
	resetPage();
	$(window).resize(function() {
		resetPage();
	});
	totalPage = $(".page").length;

	var e = 1;
	$('body').on("mousewheel", function(t, i, a, n) {
		if(!pageTransition) {
			if(i <= -e) {
				if(currentPage + 1 <= totalPage) {
					currentPage = currentPage + 1;
					goToPage(currentPage, "slide")
				}
			} else if(i >= e) {
				if(currentPage - 1 >= 1) {
					currentPage = currentPage - 1;
					goToPage(currentPage, "slide")
				}
			}
		}
	});

	$("#page-indicator [data-rel], #J_Header [data-rel]").click(function() {
		var targetPage = parseInt($(this).attr("data-rel"));
		if(!pageTransition)
			goToPage(targetPage, "fade");
		return false;
	});
	// 创建carousel2实例
	$('.carousel2').each(function() {
		carousels.push(new carousel2({
			elem: this
		}));
	});

	(function() {
		var $page1 = $('#page-1'),
			$drawer = $page1.find('.modules-box'),
			$itemsInDrawer = $page1.find('.modules'),
			$drawerTrig = $page1.find('.collapsible-arrow'),
			$list = $drawer.find('.modules-list'),
			$lis = $list.find('li'),
			$descs = $('.mudules-description').children(),
			$hideTrigLeft = $page1.find('.hide-trigger-left'),
			$hideTrigRight = $page1.find('.hide-trigger-right'),
			listOuterWidth = $lis.length * 110;

		function openDrawer() {
			if($drawer.hasClass("on")) {
				$drawer.removeClass("on").attr('style', '');
				$itemsInDrawer.removeClass("p1-module-wrapper");
				$lis.removeClass('active');
			} else {
				$drawer.height($lis.height() * 5 - 80).addClass("on");
				$itemsInDrawer.addClass("p1-module-wrapper");
				// carousels[0].lazyLoadImgsAt(0);
			}
		}

		function showDesc(idx) {
			$descs.eq(idx).addClass('active').siblings().removeClass('active');
			idx && carousels[idx - 1].lazyLoadImgsAt(0); // 在这里懒加载当前module下carousel的第1组图片
		}

		var $modal = $('#J_modal');
		$modal.find('.close').click(function() {
			$modal.fadeOut();
			return false;
		});
		$modal.on('mousewheel', function(e) {
			e.stopPropagation && e.stopPropagation();
		});
		$drawerTrig.click(function() {
			openDrawer();
			showDesc(0);
		});

		$lis.click(function() {
			var $self = $(this);
			var idx = $self.index();
			if(!$drawer.hasClass("on")) {
				openDrawer(idx);
			}
			showDesc(idx);
			// carousels[idx].lazyLoadImgsAt(0);
			$self.addClass('active').siblings().removeClass('active');
		});

		var leftMoved = 1;
		var rightMoved = 0;
		var moving = 0;
		$hideTrigLeft.mouseover(function() {
			if(moving || leftMoved) {
				return;
			}
			moving = 1;
			$list.animate({
				left: 0
			}, 800, function() {
				moving = 0;
				leftMoved = 1;
				rightMoved = 0;
			});
		});
		$hideTrigRight.mouseover(function() {
			if(moving || rightMoved) {
				return;
			}
			moving = 1;
			var l = listOuterWidth - winWidth;
			$list.animate({
				left: '-' + l + 'px'
			}, 800, function() {
				moving = 0;
				rightMoved = 1;
				leftMoved = 0;
			});
		});
	}());

	(function() {
		$('#tab1').click(function() {
			$(this).addClass('tab1_active');
			$('#tab2').removeClass('tab2_active');
			$('#tab3').removeClass('tab1_active');
			$('#page-2').removeClass('page_2_bg2');
			$('.p2-inner').removeClass('p2_inner_active');
			$('#page-2').addClass('page_2_bg1');
			$('.tab1_container').css('display', 'block')
			$('.tab2_container').css('display', 'none')
			$('.tab3_container').css('display', 'none')
		})
		$('#tab2').click(function() {
			$(this).addClass('tab2_active');
			$('#tab1').removeClass('tab1_active');
			$('#tab3').removeClass('tab1_active');
			$('#page-2').removeClass('page_2_bg1');
			$('#page-2').addClass('page_2_bg2');
			$('.p2-inner').addClass('p2_inner_active');
			$('.tab1_container').css('display', 'none')
			$('.tab3_container').css('display', 'none')
			$('.tab2_container').css('display', 'block')
		})
		$('#tab3').click(function() {
			$(this).addClass('tab1_active');
			$('.tab3_container').css('display', 'block')
			$('#tab1').removeClass('tab1_active');
			$('#tab2').removeClass('tab2_active');
			$('#page-2').removeClass('page_2_bg2');
			$('.p2-inner').removeClass('p2_inner_active');
			$('#page-2').addClass('page_2_bg1');
			$('.tab1_container').css('display', 'none')
			$('.tab2_container').css('display', 'none')
		})
		$('.tab3_container img').click(function(){
            $('.tab3_container').addClass('shrink');
            $('.tab3_bottom').animate({height:"150px"});
            $('.cricles').css('display','block');
            var id = $(this).attr('data_id');
            $('.tab3_bottom').find('#'+id).css('display','block').siblings('.tab3_bottom_text').css('display','none');
		})
        $('.cricles').click(function(){
        	$(this).css('display','none');
        	$('.tab3_container').removeClass('shrink');
            $('.tab3_bottom').animate({height:"0px"})
        })
        $('.tab1_footer .footer_list').mouseover(function(){
        	$(this).addClass('f_list_active').siblings().removeClass('f_list_active');
        	$(this).find('img').eq(1).show().siblings('img').hide();
        })
        $('.tab1_footer .footer_list').mouseout(function(){
        	$(this).removeClass('f_list_active');
        	$(this).find('img').eq(0).show().siblings('img').hide();
        })
		var index = 0;
		var timer = null;
		function dolunbo() {
			timer = setInterval(function() {
				index++;
				if(index == 3) {
					index = 0;
				}
				show();
			}, 2000);
		};
		dolunbo();
		function show() {
			$('.timeline ul li').eq(index).addClass('current').siblings().removeClass('current');
		}
		$('.timeline ul li').mouseover(function() {
			index = $(this).index();
			show();
			clearInterval(timer);
		})
		$('.timeline ul li').mouseout(function() {
			index = $(this).index();
			dolunbo();
		})

	}());

	(function() {
		var $page3 = $('#page-3'),
			$timelineLis = $page.find('.timeline li'),
			timelineLen = $timelineLis.length,
			$dot = $page3.find('span.dot'),
			page3Timer = 0,
			page3AutoRun = 0,
			page3pause = 0,
			page3Current = 0;

		function activeDotAndTimeline(idx) {
			var $target = $timelineLis.eq(idx);
			$dot.stop().animate({
				left: $target.offset().left + $target.width() / 2 - $dot.width() / 2
			}, 500);
			$target.addClass("current").siblings().removeClass("current");
		}
		$timelineLis.mouseover(function() {
			var self = this;
			clearTimeout(page3Timer);
			page3Timer = setTimeout(function() {
				page3Current = $(self).index()
				activeDotAndTimeline(page3Current);
			}, 500);
			page3pause = 1;
		}).mouseout(function() {
			clearTimeout(page3Timer);
			page3pause = 0;
		});
		pageEvents[3] = function() {
			pageReverts[3]();
			activeDotAndTimeline(page3Current);
			page3Current++;
			page3AutoRun = setInterval(function() {
				if(page3pause) {
					return;
				}

				if(page3Current >= $timelineLis.length) {
					page3Current = 0;
				}

				activeDotAndTimeline(page3Current);
				page3Current++;
			}, 2000);
		};
		pageReverts[3] = function() {
			page3pause = 0;
			clearInterval(page3AutoRun);
		}
	}());

	(function() {
		var $page4 = $('#page-4'),
			$page4descs = $page4.find('.page4-desc'),
			page4timer = 0,
			$jsItem = $page.find('.j_p4item');

		$page4.find('[data-rel]').mouseover(function() {
			var id = $(this).attr('data-rel');
			$('#J_p4desc_' + id).addClass('j_active_' + id);
		}).mouseout(function() {
			$jsItem.removeClass('j_active_' + $(this).attr('data-rel'));
		});

		if($.browser.version < 10) {
			var $page4circle = $page4.find('.page4-circle'),
				$page4shadow = $page4.find('.page4-shadow');

			$page4descs.css('opacity', 0);
			$page4circle.css('display', 'none');
			$page4shadow.css('display', 'none');

			pageEvents[4] = function() {
				page4timer = setTimeout(function() {
					loopWithPause($page4descs, function(idx, item) {
						idx++;
						if(idx === 1 || idx === 4) {
							$(item).animate({
								'opacity': 1,
								'left': -220
							});
						} else {
							$(item).animate({
								'opacity': 1,
								'left': '90%'
							});
						}
					}, 300);
				}, 1000);
				$page4circle.fadeIn();
				$page4shadow.fadeIn();
			};
			pageReverts[4] = function() {
				$page4descs.css('opacity', 0);
				$page4circle.css('display', 'none');
				$page4shadow.css('display', 'none');
				clearTimeout(page4timer);
			};
		} else {
			pageEvents[4] = function() {
				page4timer = setTimeout(function() {
					loopWithPause($page4descs, function(idx, item) {
						idx++;
						$(item).addClass('page4-desc' + idx + '-animate');
					}, 300);
				}, 1000);
			};
			pageReverts[4] = function() {
				setTimeout(function() {
					$.each($page4descs, function(idx, item) {
						idx++;
						$(item).removeClass('page4-desc' + idx + '-animate');
					});
				}, 1200);
				clearTimeout(page4timer);
			};
		}
	}());
	//王肖飞添加
	(function() {
		$('.arrow-1').mouseover(function() {
			$('.page4-desc .service_object').css('opacity', 1);
			$('.page4-desc .line').css('opacity', 0);
			$('.page4-desc').children('p').css('opacity', 0);
		})
		$('.arrow-1').mouseout(function() {
			$('.page4-desc .service_object').css('opacity', 0);
			$('.page4-desc .line').css('opacity', 1);
			$('.page4-desc').children('p').css('opacity', 1);
		})
		$('.arrow-2').mouseover(function() {
			$('.page4-desc .product').css('opacity', 1);
			$('.page4-desc .line').css('opacity', 0);
			$('.page4-desc').children('p').css('opacity', 0);
			$('.page4-article').css('opacity', 1)
		})
		$('.arrow-2').mouseout(function() {
			$('.page4-desc .product').css('opacity', 0);
			$('.page4-desc .line').css('opacity', 1);
			$('.page4-desc').children('p').css('opacity', 1);
			$('.page4-article').css('opacity', 0)

		})
		$('.arrow-3').mouseover(function() {
			//  		 $('.page4-desc .product').css('opacity', 0);
			$('.page4-desc .line').css('opacity', 0);
			$('.page4-desc').children('p').css('opacity', 0);

		})
	}());
    //地图
	(function() {
		var $mapCtn = $('#J_mapCtn'),
			mapInited = 0,
			map;
		pageEvents[7] = function() {
			if(mapInited) {
				return false;
			}
			mapInited = 1;
			map = new BMap.Map('J_mapCtn');
			map.centerAndZoom(new BMap.Point(120.2823874707,30.3224787371), 2000);
			var marker = new BMap.Marker(new BMap.Point(120.2823874707,30.3224787371));
			map.addOverlay(marker);
			var opts = {
				width: 220, // 信息窗口宽度      
				height: 60, // 信息窗口高度      
				title: "杭州领沃科技有限公司" // 信息窗口标题     
			}
			var infoWindow = new BMap.InfoWindow("地址：杭州市江干区玖堡精品5D006 <br /> 电话：15736748889", opts); // 创建信息窗口对象      

			marker.addEventListener('click', function() {
				map.openInfoWindow(infoWindow, marker.getPosition()); // 打开信息窗口
			});
		};
		//王肖飞添加
		$('.img').mouseover(function(){
             $(this).find('img').eq(1).show().siblings('img').hide();
             $(this).find('.num').show().siblings('div').hide();
		})
		$('.img').mouseout(function(){
             $(this).find('img').eq(1).hide().siblings('img').show();
             $(this).find('.mame').show().siblings('div').hide();
		})
	}());
});