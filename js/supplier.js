$(function() {
	initTableData();
});

//防止表单重复提交
function initForm() {
	$('#supplierFM').form({
		onSubmit: function() {
			return false;
		}
	});
}

//初始化表格
function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/supplier/getList',
		method: 'get',
		checkOnSelect: false,
		singleSelect: false,
		columns: [
			[{
					field: 'id',
					width: 35,
					align: "center",
					checkbox: true
				},
				{
					title: '操作',
					field: 'op',
					align: "center",
					width: 60,
					formatter: function(value, data) {
						var str = '';
						str += '<img title="编辑" src="../../easyui/themes/icons/pencil.png" style="cursor: pointer;" onclick="editSupplier(\'' + data.id + '\');"/>&nbsp;&nbsp;&nbsp;';
						str += '<img title="删除" src="../../easyui/themes/icons/edit_remove.png" style="cursor: pointer;" onclick="deleteSupplier(\'' + data.id + '\');"/>';
						return str;
					}
				},
				{
					title: '供应商编号',
					field: 'num',
					width: 70
				},
				{
					title: '供应商',
					field: 'company',
					width: 300
				},
				{
					title: '负责人',
					field: 'manager',
					width: 80
				},
				{
					title: '电话',
					field: 'telephone',
					width: 80
				},
				{
					title: '描述',
					field: 'remark',
					width: 800
				}
			]
		],
		toolbar: [{
				id: 'addSupplier',
				text: '增加',
				iconCls: 'icon-add',
				handler: function() {
					$("#supplierDlg").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/edit_add.png"/>&nbsp;增加供应商信息');
					getNewNum();
				}
			},
			{
				id: 'deleteSupplier',
				text: '删除',
				iconCls: 'icon-remove',
				handler: function() {
					var row = $('#tableData').datagrid('getChecked');
					if(row.length == 0) {
						alert("请选择");
						return;
					}
					if(row.length > 0) {
						$.messager.confirm('删除确认', '确定要删除选中的' + row.length + '条供应商信息吗？', function(r) {
							if(r) {
								var ids = "";
								for(var i = 0; i < row.length; i++) {
									ids += row[i].id + ",";
								}

								$.ajax({
									type: "get",
									url: "http://127.0.0.1:8001/supplier/deleteBatch",
									xhrFields: {
										withCredentials: true
									},
									dataType: "json",
									data: ({
										'ids': ids
									}),
									success: function(data) {
										if(data.code == 200) {
											alert("删除成功！");
											$('#tableData').datagrid('reload');
										} else {
											alert("删除失败，请稍后再试！");
										}
									},
									error: function() {
										alert("请求错误，删除失败！");
									}
								});
							}
						});
					}
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

function editSupplier(id) {
	$('#supplierDlg').dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/pencil.png"/>&nbsp;编辑供应商信息');
	getSupplier(id);
}

function getSupplier(id) {
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/supplier/getById?id=" + id,
		xhrFields: {
			withCredentials: true
		},
		dataType: "json",
		success: function(data) {
			if(data.code == 200) {
				var res = data.data;
				$('#id').val(res.id);
				$('#company').val(res.company);
				$('#manager').val(res.manager);
				$('#telephone').val(res.telephone);
				$('#remark').val(res.remark);
				$('#num').val(res.num);
				//							alert(res);

			} else {
				alert("获取信息失败");
			}
		},
		error: function() {
			alert("获取信息失败");
		}
	});
}

function saveSupplier() {
	var num = $('#num').val();
	var company = $('#company').val();
	var manager = $('#manager').val();
	var telephone = $('#telephone').val();
	var remark = $('#remark').val();
	var id = $('#id').val();
	
	if(company == ""){
		alert("供应商不能为空");
		return;
	}
	
	if(manager == ""){
		alert("负责人不能为空");
		return;
	}
	
	if(manager == ""){
		alert("电话不能为空");
		return;
	}

	$.ajax({
		type: "post",
		url: "http://127.0.0.1:8001/supplier/upset",
		xhrFields: {
			withCredentials: true
		},
		dataType: "json",
		data: ({
			'id': id,
			'num': num,
			'company': company,
			'manager': manager,
			'telephone': telephone,
			'remark': remark
		}),
		success: function(data) {
			if(data.code == 200) {
				if(data.data == 3) {
					alert("保存成功");
				}
				if(data.data == 2) {
					alert("修改成功");
				}
				cancelSupplier();
				$('#tableData').datagrid('reload');
			}
		},
		error: function() {
			alert("请求服务器错误");
		}
	});

}

function deleteSupplier(id) {
	$.messager.confirm('删除确认', '确定要删除该信息吗？', function(r) {
		if(r) {
			$.ajax({
				type: "get",
				url: "http://127.0.0.1:8001/supplier/deleteById",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: ({
					'id': id,
				}),
				success: function(data) {
					if(data.code == 200) {
						alert("删除成功");
						$('#tableData').datagrid('reload');
					} else {
						alert("删除失败，请稍后再试");
					}
				},
				error: function() {
					alert("请求删除失败");
				}
			});
		}
	})
}

function getNewNum() {
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/supplier/getNewNum",
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			$("#num").val(data.data);
		}
	});
}

//条件查询
function search_supplier() {
	var sea_supplier = $("#sea_supplier").val();
	var sea_manager = $("#sea_manager").val();
	$("#tableData").datagrid('load', {
		supplier: sea_supplier,
		manager: sea_manager
	});
}

function cancelSupplier() {
	$('#supplierDlg').dialog('close');
	$('#num').val("");
	$('#company').val("");
	$('#manager').val("");
	$('#telephone').val("");
	$('#remark').val("");
	$('#id').val("");
}

function reset() {
	$("#sea_supplier").val("");
	$("#sea_manager").val("");
}