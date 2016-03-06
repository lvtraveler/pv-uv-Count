//初始化
var rst={all:[],hour:[],day:[]};//初始化结果集
var key,viewpv,viewuv,clickpv,clickuv;//初始化结果集变量
var count=1;
window.onload=function(){
	$("#id_ad").focus();
}
//获取广告ID下的产品
function getApp() {
	var id_ad=$("#id_ad").val();
	if(jTrim(id_ad)!=""){
		$.post("data.php",{ad:id_ad},function(data){
//			data=['宝宝爱说话','宝宝巴士','宝宝巴士大全','宝宝爱吃饭'];//测试数据
			var len=data.length;
			var html="";
			$('select[name="duallistbox_demo2_helper1"]').empty();
			$(".demo2").empty();
			for(var i=0;i<len;i++){
				html+="<option value='"+i+"'>"+data[i]+"</option>";
				$('select[name="duallistbox_demo2_helper1"]').html(html);
				$(".demo2").html(html);
				demo2.bootstrapDualListbox('refresh');
			}
		});
		$('select[name="duallistbox_demo2_helper1"]').focus();
	}else {
		alert("请输入广告ID ！");
		return false;
	}
}

//获取数据
function getData(data){
	if(count<2){
		var arr=data;
		if(data.length==0){
			alert("暂无数据");
		}else{
				for(var i=0,j=arr.length;i<j;i++) {
				key=arr[i].time;//all的key
				viewpv=parseInt(arr[i].viewpv);
				viewuv=parseInt(arr[i].viewuv);
				clickpv=parseInt(arr[i].clickpv);
				clickuv=parseInt(arr[i].clickuv);
				setItem(rst.all,key,viewpv,viewuv,clickpv,clickuv);
				key = key.split(':')[0];//hour的key
				setItem(rst.hour,key,viewpv,viewuv,clickpv,clickuv);
				key = key.split(' ')[0];//day的key
				setItem(rst.day,key,viewpv,viewuv,clickpv,clickuv);
			}
		}
	}else if(count>=2) {
		rst={all:[],hour:[],day:[]};
		var arr=data;
		if(data.length==0){
			alert("暂无数据");
		}else {
			for(var i=0,j=arr.length;i<j;i++) {
				key=arr[i].time;//all的key
				viewpv=parseInt(arr[i].viewpv);
				viewuv=parseInt(arr[i].viewuv);
				clickpv=parseInt(arr[i].clickpv);
				clickuv=parseInt(arr[i].clickuv);
				setItem(rst.all,key,viewpv,viewuv,clickpv,clickuv);
				key = key.split(':')[0];//hour的key
				setItem(rst.hour,key,viewpv,viewuv,clickpv,clickuv);
				key = key.split(' ')[0];//day的key
				setItem(rst.day,key,viewpv,viewuv,clickpv,clickuv);
			}
		}
	}
	count++;	
//	console.log(rst);
	getAll();
}

//设置或者更新结果数据项
function setItem(arr,key,viewpv,viewuv,clickpv,clickuv){
	var rstitem=getItem(arr,key);
	if(rstitem){//更新
		rstitem.viewpv+=viewpv;
		rstitem.viewuv+=viewuv;
		rstitem.clickpv+=clickpv;
		rstitem.clickuv+=clickuv;
	}else {
		arr.push({time:key,viewpv:viewpv,viewuv:viewuv,clickpv:clickpv,clickuv:clickuv});//新建
	}
}
//获取结果项中指定的key,找不到返回false，需要新建
function getItem(arr,key){
	for(var i=0;i<arr.length;i++){
		if(arr[i].time==key){
			return arr[i];
		}
	}
	return false;
}
//全部-按钮点击
function getAll() {
	var arr=rst.all;
	createTable(arr);
}

//按天
function getDay() {
	var arr=rst.day;
	createTable(arr);
}

//小时
function getHour() {
	var arr=rst.hour;
	createTable(arr);
}


//生成数据表
function createTable(obj){
	$("#count_body").empty();
	var html="";
	var len=obj.length;
	for(var i=0;i<len;i++) {
		html=html+"<tr><td class='time'>"+obj[i].time+"</td><td>"+obj[i].viewpv+"</td><td>"+obj[i].viewuv+"</td><td>"+obj[i].clickpv+"</td><td>"+obj[i].clickuv+"</td></tr>";
	}
	$("#count_body").html(html);
}


//获取输入参数
function getParams(){
	var id_ad=$("#id_ad").val();
	var id_app=$("#id_app").val();
	var arrName=[];
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	$('select[name="duallistbox_demo2_helper2"] option').each(function(){
		var option_txt=$(this).text();
		arrName.push(option_txt);
	});
	var jsonParam;
	if(jTrim(id_ad)!=""){
		if(arrName.length==0){//没有选中广告ID下的产品
			if(jTrim(id_app)!=""){//输入了APP ID
				jsonParam={"ad":id_ad,"app":id_app,"startDate":startDate,"endDate":endDate};
			}else {//没有输入APP ID
				jsonParam={"ad":id_ad,"startDate":startDate,"endDate":endDate};
			}
		}else{//选择了广告ID下的产品
			if(jTrim(id_app)!=""){//输入了appID
				alert("您输入了APP ID，将优先查看该APP ID下的数据！");
				jsonParam={"ad":id_ad,"app":id_app,"startDate":startDate,"endDate":endDate};
			}else {//没有输入APPID
				jsonParam={"ad":id_ad,"name":arrName,"startDate":startDate,"endDate":endDate};
			}
		}
		jsonParam=JSON.stringify(jsonParam);
		console.log(jsonParam);
		return jsonParam;
	}else {
		alert("广告ID未输入!");
		return false;
	}
}

//输入框-表单非空验证
function jTrim(s){
	return s.replace(/(^\s*)|(\s*$)/g, "");
}

//格式化日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var minutes=date.getMinutes();
    if(minutes>=0&&minutes<=9) {
    	minutes="0"+minutes;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
//  + " " + date.getHours() + seperator2 + minutes;
    return currentdate;
}
//格式化时间
function getNowFormatTime() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var minutes=date.getMinutes();
    if(minutes>=0&&minutes<=9) {
    	minutes="0"+minutes;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    + " " + date.getHours() + seperator2 + minutes;
    return currentdate;
} 
