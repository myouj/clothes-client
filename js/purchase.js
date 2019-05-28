$(function() {
	initTableData();
});

function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/depot-info/getList',
		method: 'get',
		checkOnSelect: false,
		singleSelect: false,
		columns: [
			[{
					title: '入库编号',
					field: 'document',
					width: 70
				}, {
					title: '操作',
					field: 'op',
					align: "center",
					width: 60,
					formatter: function(value, data) {
						var str = '';
						str += '<img title="详细" src="../../easyui/themes/icons/more.png" style="cursor: pointer;" onclick="detail(\'' + data.id + '\');"/>&nbsp;&nbsp;&nbsp;';
						str += '<img title="退货" src="../../easyui/themes/icons/undo.png" style="cursor: pointer;" onclick="outdepot(\'' + data.id + '\',\'' + data.inOrOut + '\');"/>&nbsp;&nbsp;&nbsp;';
						return str;
					}
				},
				{
					title: '供应商',
					field: 'customer',
					width: 150
				},
				{
					title: '商品信息',
					field: 'goodsInfo',
					width: 200
				},
				{
					title: '数量',
					field: 'sum',
					width: 80
				},
				{
					title: '价格',
					field: 'amount',
					width: 80
				},
				{
					title: '操作时间',
					field: 'operatorTime',
					width: 150
				},
				{
					title: '操作者',
					field: 'operator',
					width: 150
				},
				{
					title: '出/入库',
					field: 'inOrOut',
					width: 60,
					formatter: function(value, data){
						var str = "";
						if(data.inOrOut == 0){
							str += "<span style='color:red'>已退货</span>"
							return str;
						}else{
							str += "<span>已入库</span>"
							return str;
						}
					}
				}
			]
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

function outdepot(id, inOrOut){
	if(inOrOut == 'false'){
		$.messager.alert('提示', '已退货');
	}
	else{
		var operator = localStorage.getItem("name");
		//入库后退货
		$.ajax({
			type:"get",
			url:"http://127.0.0.1:8001/purchase/outPurchase?id="+id+"&operator="+operator+"&status="+status,
			xhrFields: {withCredentials:true},
			success: function(data){
				if(data.code == 200){
					$.messager.alert('提示', '退货成功');
					$("#tableData").datagrid('reload');
				}else{
					alert(data.message);
				}
			},
			error: function(){
				$.messager.alert('提示', '系统错误');
			}
		});
	}
}

//条件查询
function search_1() {
	var beginTime = $("#beginTime").val();
	var endTime = $("#endTime").val();
	$("#tableData").datagrid('load', {
		beginTime: beginTime,
		endTime: endTime
	});
}

//清空条件输入框
function reset() {
	$("#beginTime").val("");
	$("#endTime").val("");

}

function detail(id) {
	$("#depotHeadDlgShow").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/more.png"/>&nbsp;详细');
	initMaterialDataShow();
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/depot-info/getById?id=" + id,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.code == 200) {
				$("#OperTimeShow").append('<span id="a1">' + data.data.all.operatorTime + '</span>');
				$("#NumberShow").append('<span id="a2">' + data.data.all.document + '</span>');
				$("#supplierShow").append('<span id="a3">' + data.data.all.customer + '</span>');
				$("#RemarkShow").append('<span id="a4">' + data.data.all.remark + '</span>');
				$("#amount").append('<span id="a5">' + data.data.all.amount + '</span>');
				$("#opertor").append('<span id="a6">' + data.data.all.operator + '</span>');
				$("#sum").append('<span id="a7">' + data.data.all.sum + '</span>');

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
				$.messager.alert('提示', '请求错误，请重新操作');
			}
		},
		error: function() {
			$.messager.alert('提示', '系统错误');
		}
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
					width: 150,
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

function closeDetail() {
	$('#depotHeadDlgShow').dialog('close');
	$('#a1').remove();
	$('#a2').remove();
	$('#a3').remove();
	$('#a4').remove();
	$('#a5').remove();
	$('#a6').remove();
	$('#a7').remove();
	$('#materialDataShow').datagrid('loadData', {
		total: 0,
		rows: []
	});
}



