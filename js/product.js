$(function() {

	var index = 0;

	function show() {
		$('#con_no1 .img img').eq(index).fadeIn(1000).siblings().fadeOut();
		$('#con_no_1 button').eq(index).addClass('button_active').siblings().removeClass('button_active');
	}
	$('#con_no_1 button').mouseover(function() {
		index = $(this).index();
		show();
	})
	$('#con_no_1 button').mouseout(function() {
		index = $(this).index();
	})
	//
	function show1() {
		$('#con_no3 .img img').eq(index).fadeIn(1000).siblings().fadeOut();
		$('#con_no_3 button').eq(index).addClass('button_active').siblings().removeClass('button_active');
	}
	$('#con_no_3 button').mouseover(function() {
		index = $(this).index();
		show1();
	})
	$('#con_no_3 button').mouseout(function() {
		index = $(this).index();
	})
	//
	function show2() {
		$('#con_no2 .img img').eq(index).fadeIn(1000).siblings().fadeOut();
		$('#con_no_2 button').eq(index).addClass('button_active').siblings().removeClass('button_active');
	}
	$('#con_no_2 button').mouseover(function() {
		index = $(this).index();
		show2();
	})
	$('#con_no_2 button').mouseout(function() {
		index = $(this).index();
	})
	//
	function show3() {
		$('#con_no4 .img img').eq(index).fadeIn(1000).siblings().fadeOut();
		$('#con_no_4 button').eq(index).addClass('button_active').siblings().removeClass('button_active');
	}
	$('#con_no_4 button').mouseover(function() {
		index = $(this).index();
		show3();
	})
	$('#con_no_4 button').mouseout(function() {
		index = $(this).index();
	})
	$('.download .down_list').mouseover(function() {
		$(this).find('img').eq(1).show().siblings('img').hide();
		$(this).find('button').css('backgroundColor', '#23b9cb');
	})
	$('.download .down_list').mouseout(function() {
		$(this).find('img').eq(0).show().siblings('img').hide();
		$(this).find('button').css('backgroundColor','#ffffff');
	})
})