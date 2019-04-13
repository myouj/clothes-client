$(function() {
	initTableData();
});

//初始化表格
function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/purchase/getList',
		method: 'get',
		singleSelect: true,
		columns: [
			[{
					field: 'id',
					width: 40,
					checkbox: true,
					align: 'center'
				},
				{

					title: '操作',
					field: 'op',
					align: "center",
					width: 60,
					formatter: function(value, data) {
						var str = '';
						str += '<img title="详细" src="../../easyui/themes/icons/more.png" style="cursor: pointer;" onclick="detail(\'' + data.id + '\');"/>';
						str += '<img title="入库" src="../../easyui/themes/icons/redo.png" style="cursor: pointer;" onclick="depot(\'' + data.id + "\',\'"+ data.status + '\');"/>';
						return str;
					}
				},

				{
					title: '供应商',
					field: 'supplier',
					width: 80,
					align: 'center'
				},
				{
					title: '单据编号',
					field: 'num',
					width: 80,
					align: 'center'
				},
				{
					title: '商品信息',
					field: 'goodsInfo',
					width: 200
				},
				{
					title: '总金额',
					field: 'amount',
					width: 80,
					align: 'center'
				},
				{
					title: '日期',
					field: 'operateTime',
					width: 150
				},
				{
					title: '订货/审核/入库',
					field: 'operator',
					width: 150,
					align: 'center'
				},
				{
					title: '状态',
					field: 'status',
					width: 60,
					formatter: function(value, data){
						var str = "";
						if(data.status == 0){
							str += "<span style='color:red'>未审核</span>"
							return str;
						}else if(data.status == 1){
							str += "<span style='color:#00CC00'>已审核</span>"
							return str;
						}else if(data.status == 2){
							str += "<span style='color:#FF9933'>已入库</span>"
							return str;
						}
					}
				}
			]
		],
		toolbar: [{
				id: 'addDepot',
				text: '增加',
				iconCls: 'icon-add',
				handler: function() {
					$("#depotHeadDlg").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/edit_add.png"/>&nbsp;增加订货信息');
					$("#Remark").val("");
					$("#sum").numberbox('setValue', 0);
					initGoodsTB();
					$('#materialData').datagrid('loadData', {
						total: 0,
						rows: []
					});
					getNewNum();
					initCombox("#from_supplier");
					
					var operator = localStorage.getItem("name");
					$("#operator").val(operator);
				}
			},
			{
				id: 'examine',
				text: '审核',
				iconCls: 'icon-ok',
				handler: function() {
					check();
				}
			}
		],
		pagination: true,
		pageSize: 10,
		pageList: [5, 10, 20],
		onLoadError: function() {
			$.messager.alert('页面加载提示', '输入错误或系统错误，页面加载异常', 'error');
			return;
		}

	});

}

function depot(id, status){
//	var status = data.status;
	if(status == 0){
		alert("采购信息通过审核后才能入库");
	}else if(status == 1){
		var operator = localStorage.getItem("name");
		$.ajax({
			type:"get",
			url:"http://127.0.0.1:8001/purchase/depotPurchase?id="+id+"&operator="+operator,
			xhrFields: {withCredentials:true},
			success: function(data){
				if(data.code == 200){
					alert("入库成功");
					$("#tableData").datagrid('reload');
				}else{
					alert(data.message);
				}
			},
			error: function(){
				alert("系统错误!");
			}
		});
	}else if(status == 2){
		alert("采购商品已经入库");
	}
}

function check(){
	var row = $("#tableData").datagrid('getSelections');
	if(row.length == 0){
		alert("请选中审核的内容");
	}else{
		var status = row[0].status;
		if(status == 1){
			alert("采购已审核");
		}else if(status == 2){
			alert("采购已入库");
		}else{
			var operator = localStorage.getItem("name");
			$.ajax({
				type:"get",
				url:"http://127.0.0.1:8001/purchase/checkPurchase?id="+row[0].id+"&operator="+operator,
				xhrFields: {withCredentials:true},
				success: function(data){
					if(data.code == 200){
						alert("审核成功");
						$("#tableData").datagrid('reload');
					}else if(data.code == 500){
						alert("系统异常，请重试");
					}
				},
				error: function(){
					alert("系统错误!");
				}
			});
		}
//		alert(row[0].status);
	}
}

function detail(id) {
	$("#depotHeadDlgShow").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/more.png"/>&nbsp;详细');;
	initMaterialDataShow();
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/purchase/getById?id="+id,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.code == 200) {
				//							$("#OperTimeShow").val(data.data.operatorTime);
				$("#OperTimeShow").append('<span id="a1">' + data.data.all.operateTime + '</span>');
				$("#NumberShow").append('<span id="a2">' + data.data.all.num + '</span>');
				$("#supplierShow").append('<span id="a3">' + data.data.all.supplier + '</span>');
				$("#RemarkShow").append('<span id="a4">' + data.data.all.remark + '</span>');
				$("#amount").append('<span id="a5">' + data.data.all.amount + '</span>');
				$("#opertor").append('<span id="a6">' + data.data.all.operator + '</span>');

				$.each(data.data.goods, function(i, good) {
					$("#materialDataShow").datagrid('appendRow', {
						depot: good.num,
						goods: good.goods,
						amount: good.count,
						price: good.price,
						unit: good.unit
					});
				});

			} else {
				alert("请求错误，请重新操作");
			}
		},
		error: function() {
			alert("系统错误");
		}
	});
}

function searchBtn() {
	var searchNumber = $("#searchNumber").val();
	var searchMaterial = $("#searchMaterial").val();
	var searchBeginTime = $("#searchBeginTime").val();
	var searchEndTime = $("#searchEndTime").val();
	$("#tableData").datagrid('load', {
		num: searchNumber,
		goodsInfo: searchMaterial,
		beginTime: searchBeginTime,
		endTime: searchEndTime
	});
}

function searchResetBtn() {
	$("#searchNumber").val("");
	$("#searchMaterial").val("");
	$("#searchBeginTime").val("");
	$("#searchEndTime").val("");
}

function initGoodsTB() {
	$("#create_time").val(today());
	$("#materialData").datagrid({
		height: 245,
		rownumbers: true,
		//动画效果
		animate: false,
		collapsible: false,
		selectOnCheck: false,
		pagination: false,
		//交替出现背景
		striped: true,
		showFooter: true,
		toolbar: [{
				id: 'addSupplier',
				text: '增加',
				iconCls: 'icon-add',
				handler: function() {
					$("#addDlg").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/edit_add.png"/>&nbsp;增加商品信息');;
					$("#count").numberbox("setValue", 0);
					$("#to_count").numberbox("setValue", 0);
					initDepot();
					intiGoods();

				}
			},
			{
				id: 'deleteDepot',
				text: '删除',
				iconCls: 'icon-remove',
				handler: function() {
					var row = $('#materialData').datagrid('getChecked');
					if(row.length == 0) {
						alert("请选择");
						return;
					}
					if(row.length > 0) {
						for(var i = 0; i < row.length; i++) {
							var index = $('#materialData').datagrid('getRowIndex', row[i]);
//							alert(index);
							var index = $('#materialData').datagrid('deleteRow', index);
						}
					}
					calSum();
				}
			},
			{
				id: 'resetDepot',
				text: '重置',
				iconCls: 'icon-reload',
				handler: function() {
					$('#materialData').datagrid('loadData', {
						total: 0,
						rows: []
					});
					$("#sum").numberbox('setValue', 0);
				}
			}
		],
		columns: [
			[{
					field: 'id',
					width: 35,
					align: "center",
					checkbox: true
				},
				{
					title: '仓库',
					field: 'depot_num',
					width: 35,
					align: 'center'
				},
				{
					title: '商品',
					field: 'name',
					width: 230
				},
				{
					title: '数量',
					field: 'to_count',
					width: 80
				},{
					title: '单价',
					field: 'price',
					width: 80,
					align: 'center'
				},
				{
					title: '单位',
					field: 'unit',
					width: 60
				}
			]
		],
		onLoadError: function() {
			$.messager.alert('页面加载提示', '页面加载异常，请稍后再试！', 'error');
			return;
		}
	});
}

function addGoods() {
	var depot_num = $("#depot_num").val();
	var goods_name = $("#goods_name").val();
	var count = $("#count").val();
	var to_count = $("#to_count").val();
	var price = $("#price").val();
	var unit = $("#unit").val();
//	alert(depot_num + goods_name +count +to_count +price +unit);
	if(depot_num == "") {
		alert("请选择仓库");
		return;
	}
	if(goods_name == "") {
		alert("请选择商品");
		return;
	}
	if(to_count == 0) {
		alert("请输入采购数量");
		return;
	}
	$("#materialData").datagrid('appendRow', {
		depot_num: depot_num,
		name: goods_name,
		to_count: to_count,
		price: price,
		unit: unit
	});
	close_addFM();
	calSum();
}

function calSum(){
	var rows = $("#materialData").datagrid('getRows');
	var sum = 0;
	for(var i = 0; i < rows.length; i++) {
		sum = sum + (Number(rows[i].to_count)*Number(rows[i].price));

	}
	$("#sum").numberbox('setValue', sum);
}

function close_addFM() {
	$("#depot_num").val("");
	$("#count").numberbox('setValue', 0);
	$("#unit").val("");
	$("#goods_name").val("");
	$("#to_count").numberbox('setValue', 0);
	$("#price").numberbox('setValue', 0);
	$("#addDlg").dialog('close');
}

function getNewNum() {
	var num;
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/purchase/getNewNum",
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.code == 200) {
				$("#new_num").val(data.data);
			} else {
				alert("获取新单号失败!");
			}
		},
		error: function() {
			alert("系统错误!");
		}
	});

}

function initCombox(it) {
	$(it).combobox({
		method: "get",
		url: "http://127.0.0.1:8001/supplier/getSupplierList",
		textField: "company",
		valueField: "company"

	});
}
function initDepot(){
	$("#depot_num").combobox({
		method: "get",
		url: "http://localhost:8001/depot/getDepot",
		textField: "num",
		valueField: "num"
	});
}
function intiGoods(){
	$("#goods_name").combobox({
		method: "get",
		url: "http://127.0.0.1:8001/goods/getGoods",
		textField: "name",
		valueField: "name",
		onSelect: function(value) {
			var good = value.name;
			var depot = $("#depot_num").val();
			$.ajax({
				type:"get",
				url:"http://127.0.0.1:8001/depot-goods/getCountsByDnumAndGoods?depotNum="+depot+"&goodsName="+good,
				xhrFields: {withCredentials:true},
				success: function(data){
					if(data.code == 200){
						if(data.data == null){
							$("#count").numberbox('setValue', 0);
						}else{
							$("#count").numberbox('setValue', data.data.count);
						}
						
					}
				}, 
				error: function(){
					alert("系统错误！");
				}
			});
			$.ajax({
				type:"get",
				url:"http://127.0.0.1:8001/goods/getGoodsByName?name="+good,
				xhrFields: {withCredentials:true},
				success: function(data){
					if(data.code == 200){
						$("#price").numberbox('setValue', data.data.price);
						$("#unit").val(data.data.unit);
					}
				}, 
				error: function(){
					alert("系统错误！");
				}
			});
		}
	});
}

function sendSava() {
	$.messager.confirm('添加确认', '请确认填写信息', function(r) {
		if(r) {
			var create_time = $("#create_time").val();
			var new_num = $("#new_num").val();
			var from_supplier = $("#from_supplier").val();
			var sum = $("#sum").numberbox('getValue');
			var operator = $("#operator").val();
			var Remark = $("#Remark").val();
//			alert(create_time + new_num+from_supplier + sum+ operator+ Remark);
			var goods = "";
			var rows = $("#materialData").datagrid('getRows');
			if(operator == "") {
				alert("获取操作者失败，请重新登陆");
				top.location.href = "login.html";
				return;
			}
			if(from_supplier == "") {
				alert("请选择供应商");
				return;
			}
			if(rows.length == 0) {
				alert("请添加需要采购的商品");
				return;
			}
			for(var i = 0; i < rows.length; i++) {
				goods += rows[i].depot_num;
				goods += ":";
				goods += rows[i].name;
				goods += ":";
				goods += rows[i].to_count;
				goods += ":";
				goods += rows[i].price;
				goods += ":";
				goods += rows[i].unit;
				goods += ";";
			}
			//				alert(create_time + " " + new_num + " " +curr_depot + " " +to_depot +
			//				" " +sum + " " +operator + " " +Remark + " " +goods);
//			alert(goods);
			$.ajax({
				type: "post",
				url: "http://localhost:8001/purchase/savePurchase",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: ({
					'num': new_num,
					'supplier': from_supplier,
					'goodsInfo': goods,
					'amount': sum,
					'operateTime': create_time,
					'operator': operator,
					'remark': Remark
				}),
				success: function(data) {
					if(data.code == 200) {
						alert("保存成功");
						$('#depotHeadDlg').dialog('close');
						$("#tableData").datagrid('reload');
					}
				},
				error: function() {
					alert("系统错误!");
				}
			});
		}
	});
}

function closeDetail() {
	$('#depotHeadDlgShow').dialog('close');
	$('#a1').remove();
	$('#a2').remove();
	$('#a3').remove();
	$('#a4').remove();
	$('#a5').remove();
	$('#a6').remove();
	$('#materialDataShow').datagrid('loadData', {
		total: 0,
		rows: []
	});
}

function initMaterialDataShow() {
	$('#materialDataShow').datagrid({
		columns: [
			[{
					title: '仓库',
					field: 'depot',
					width: 80,
					align: 'center'
				},
				{
					title: '商品',
					field: 'goods',
					width: 80,
					align: 'center'
				},
				{
					title: '数量',
					field: 'amount',
					width: 80,
					align: 'center'
				},
				{
					title: '价格',
					field: 'price',
					width: 80,
					align: 'center'
				},
				{
					title: '单位',
					field: 'unit',
					width: 80,
					align: 'center'
				}
			]
		]

	});
}