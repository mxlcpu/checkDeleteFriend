/******
本脚本使用auto.js进行运行
本脚本需要开启无障碍模式
本脚本可能需要在安卓7.0以上系统使用
本脚本需要使用root权限
*****/

auto();//开启无障碍模式
mainFunction();//运行主程序



/**
 * 获取权限和设置参数
 */
function prepareThings(){

	DeviceHeight = Math.max(device.height,device.width);
	DeviceWidth = Math.min(device.height,device.width);
    setScreenMetrics(DeviceWidth, DeviceHeight);
    //请求截图
    if(!requestScreenCapture()){
        toast("请求截图失败");
        exit();
    }
}

/**
 * 获取截图
 */
function getCaptureImg(){
    var img0 = captureScreen();
    if(img0==null || typeof(img0)=="undifined"){
        toast("截图失败,退出脚本");
        exit();
    }else{
        return img0;
    }
}


/**
 * 检测某点颜色附近是否与指定的颜色相似
 */
function colorCheckSimilar(x,y){
	var img = getCaptureImg();//屏幕截图
	for(var i=0;i<200;i++){ //这里的200指的是从x-200到x，判断这些点是否与指定的颜色相似,一般适配多种分辨率的手机，200的范围已经够大了，一般不需要修改，如果检测不出，请自己修改对应的值
		var color = images.pixel(img, x-i, y);//获取该点的颜色值
		if(colors.isSimilar(color,"#29ab91",10,"diff") == true){ //判断colors与绿色#29ab91是否相似，后面两个不用管
			return true;
		}
	}

	return false;

}




/**
 * 检测单删好友
 */
function checkFriend(){

	toast("请先打开 合种 邀请页面");
	launchApp("支付宝");
	
	sleep(3000);//这里等待跳转到合种页面
	



	var name = new java.util.Vector();//调用JAVA API，创建JAVA Vector存储名字。JS Array并不安全，可能出错。
	var phoneHeight = Math.max(device.height,device.width);//设备分辨率y
	var phoneWidth = Math.min(device.height,device.width);//设备分辨率x

	


	/******
	注意，脚本尚未完善，这里j=120代表滑动次数，大家根据自己好友数量修改这个值
	整个系统一般只需要修改这里
	*****/
	for(var j=0;j<120;j++){

		var a = className("TextView");//返回一个UiSelect
		var b = a.idContains("list_item_title").find();//由于类名为TextView的很多，根据id筛选出 支付宝昵称 控件集合
		var c = className("CheckBox");//返回一个UiSelect
		var d = c.idContains("selected_check_box").find();//由于类名为CheckBox的很多，根据id筛选出 复选框 控件集合

		//注意，这里由于获取屏幕控件的问题，为了准确性，默认不检测第一个和最后一个，即i=0改成i=1，d.size改成d.size()-1
		for(var i=1;i<d.size()-1;i++){
			var xxx = d.get(i).bounds().centerX();
			var yyy = d.get(i).bounds().centerY();

			//toast("i=" + i + "  x=" + xxx + "  y="+yyy);
			if(colorCheckSimilar(xxx,yyy) == false){ //没找到绿色标志
				toast("找到啦，名字是：" + b.get(i).text());
				name.add(b.get(i).text());
				sleep(1000);
			}		
		}

		swipe(phoneWidth/2, phoneHeight*0.9375, phoneWidth/2, phoneHeight*0.375, 1000);//依次为起始x1,起始y1，结束x2,结束y2，滑动时间毫秒	,这里分辨率已经自适应
		sleep(1000);
	}


	

	var tempName = new java.util.HashSet(name);//调用JAVA API，集合，自动去除重复
	var nameReplace = new java.util.Vector(tempName);//调用JAVA API，用于保存去重复的结果
	var str = "";
	for(var i=0;i<nameReplace.size();i++){
		str = str + nameReplace.get(i) + '\n';
		//toast(nameReplace.get(i));
	}
	setClip(str);
	toast("单删好友名单已经复制到剪贴板")
	
}


/**
 * 主程序入口
 */
function mainFunction(){
	prepareThings();//前置操作
	checkFriend();//检测单删
}