$(function() {
	initTableData();
});

function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/finance/getList',
		method: 'get',
		checkOnSelect: false,
		singleSelect: false,
		columns: [
			[{
					title: '类型',
					field: 'properties',
					width: 70
				},
				{
					title: '收入/支出',
					field: 'inOrOut',
					width: 80,
					formatter: function(value, data) {
						var str = "";
						if(data.inOrOut == true) {
							str += "<span style='color:black'>收入</span>";
							return str;
						} else {
							str += "<span style='color:#00CC00'>支出</span>";
							return str;
						} 
					}
				},
				{
					title: '订单编号',
					field: 'orderId',
					width: 70
				},
				{
					title: '金额',
					field: 'amount',
					width: 80
				},
				{
					title: '时间',
					field: 'time',
					width: 150
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

//条件查询
function search_1() {
	var type = $("#type").val();
	$("#tableData").datagrid('load', {
		type: type
	});
}

//清空条件输入框
function reset() {
	$("#type").combobox('select', '全部');
	
}