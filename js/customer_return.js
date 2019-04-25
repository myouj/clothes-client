$(function() {
	initTableData();
});

//初始化表格
function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/orders/getList?do=false',
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
					width: 80,
					formatter: function(value, data) {
						var str = '';
						str += '<img title="详细" src="../../easyui/themes/icons/more.png" style="cursor: pointer;" onclick="detail(\'' + data.id + '\');"/>&nbsp;&nbsp;';
						str += '<img title="删除" src="../../easyui/themes/icons/edit_remove.png" style="cursor: pointer;" onclick="drop(\'' + data.id + "\',\'" + data.status + '\');"/>&nbsp;&nbsp;';
						return str;
					}
				},
				{
					title: '客户',
					field: 'customer',
					width: 80,
					align: 'center'
				},
				{
					title: '单据编号',
					field: 'number',
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
					title: '申请/接受',
					field: 'operator',
					width: 150,
					align: 'center'
				},
				{
					title: '状态',
					field: 'status',
					width: 60,
					formatter: function(value, data) {
						var str = "";
						if(data.status == 3) {
							str += "<span style='color:red'>申请退货</span>"
							return str;
						} else if(data.status == 4) {
							str += "<span style='color:#00CC00'>已退货</span>"
							return str;
						} 
					}
				}
			]
		],
		toolbar: [{
				id: 'add',
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
					initCombox("#to_customer");

					var operator = localStorage.getItem("name");
					$("#operator").val(operator);
				}
			},
			{
				id: 'checkReturn',
				text: '确定退货',
				iconCls: 'icon-ok',
				handler: function() {
					checkReturn();
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

function drop(id, status) {
	$.messager.confirm('删除确认', '确定要删除该退货订单吗?', function(r) {
		if(r) {

			if(status == 4) {
				alert("已经接受退货");
				return;
			}
			$.ajax({
				type: "get",
				url: "http://127.0.0.1:8001/orders/deleteById?id=" + id,
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.code == 200) {
						alert("删除成功");
						$("#tableData").datagrid('reload');
					} else {
						alert("删除失败，请稍后再试");
					}
				},
				error: function() {
					alert("系统错误!");
				}
			});
		}
	});
}

function checkReturn() {
	var row = $("#tableData").datagrid('getSelections');
	if(row.length == 0) {
		alert("请选中退货的内容");
	} else {
		var status = row[0].status;
		if(status == 4) {
			alert("已经接受退货申请");
		} else {
			var operator = localStorage.getItem("name");
			$.ajax({
				type: "get",
				url: "http://127.0.0.1:8001/orders/checkReturn?id=" + row[0].id + "&operator=" + operator,
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					if(data.code == 200) {
						alert("退货成功");
						$("#tableData").datagrid('reload');
					} else if(data.code == 500) {
						alert("系统异常，请重试");
					}
				},
				error: function() {
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
		url: "http://127.0.0.1:8001/orders/getDetail?id=" + id,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.code == 200) {
				//							$("#OperTimeShow").val(data.data.operatorTime);
				$("#OperTimeShow").append('<span id="a1">' + data.data.all.operateTime + '</span>');
				$("#NumberShow").append('<span id="a2">' + data.data.all.number + '</span>');
				$("#customerShow").append('<span id="a3">' + data.data.all.customer + '</span>');
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
	var searchCustomer = $("#searchCustomer").val();
	var searchMaterial = $("#searchMaterial").val();
	var searchBeginTime = $("#searchBeginTime").val();
	var searchEndTime = $("#searchEndTime").val();
	$("#tableData").datagrid('load', {
		customer: searchCustomer,
		goodsInfo: searchMaterial,
		beginTime: searchBeginTime,
		endTime: searchEndTime
	});
}

function searchResetBtn() {
	$("#searchCustomer").val("");
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

					initGoods();
					//					initDepot();
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
				}, {
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
	if(goods_name == "") {
		alert("请选择商品");
		return;
	}
	if(depot_num == "") {
		alert("请选择仓库");
		return;
	}
	if(to_count == 0) {
		alert("请输入订货数量");
		return;
	}

	if(Number(count) < Number(to_count)) {
		alert("订货量大于仓库容量，请重新输入");
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

function calSum() {
	var rows = $("#materialData").datagrid('getRows');
	var sum = 0;
	for(var i = 0; i < rows.length; i++) {
		sum = sum + (Number(rows[i].to_count) * Number(rows[i].price));

	}
	$("#sum").numberbox('setValue', sum);
}

function close_addFM() {

	$("#count").numberbox('setValue', 0);
	$("#unit").val("");
	$("#goods_name").val("");
	$("#depot_num").combobox('clear');
	$("#to_count").numberbox('setValue', 0);
	$("#price").numberbox('setValue', 0);
	$("#addDlg").dialog('close');
}

function getNewNum() {
	var num;
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/orders/getNewNum",
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
		url: "http://127.0.0.1:8001/customer/getCustomer",
		textField: "customer",
		valueField: "customer"

	});
}

function initGoods() {
	$("#goods_name").combobox({
		method: "get",
		url: "http://127.0.0.1:8001/goods/getGoods",
		textField: "name",
		valueField: "name",

		onSelect: function(value) {
			$("#price").numberbox('setValue', value.price);
			$("#unit").val(value.unit);

			$("#depot_num").combobox({
				method: "get",
				url: "http://127.0.0.1:8001/depot-goods/getByGoods?goods=" + value.name,
				textField: "depotNum",
				valueField: "depotNum",
				onSelect: function(da) {
					$("#count").numberbox('setValue', da.count);
				}
			});
		}
	});
}

function sendSava() {
	var operator = $("#operator").val();
	if(operator == "") {
		alert("获取操作者失败，请重新登陆");
		top.location.href = "login.html";
		return;
	}
	var to_customer = $("#to_customer").val();
	if(to_customer == "") {
		alert("请选择客户");
		return;
	}
	var rows = $("#materialData").datagrid('getRows');
	if(rows.length == 0) {
		alert("请添加需要采购的商品");
		return;
	}
	var goods = "";
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
	var create_time = $("#create_time").val();
	var new_num = $("#new_num").val();
	var sum = $("#sum").numberbox('getValue');
	var Remark = $("#Remark").val();
	$.messager.confirm('添加确认', '请确认填写信息', function(r) {
		if(r) {
			$.ajax({
				type: "post",
				url: "http://127.0.0.1:8001/orders/insert?do=false",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: ({
					'number': new_num,
					'customer': to_customer,
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