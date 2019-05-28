$(function() {
	initTableData();
});

//防止表单重复提交
function initForm() {
	$('#managerFM').form({
		onSubmit: function() {
			return false;
		}
	});
}

//初始化表格
function initTableData() {
	$('#tableData').datagrid({
		url: 'http://127.0.0.1:8001/manager/getList',
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
						str += '<img title="编辑" src="../../easyui/themes/icons/pencil.png" style="cursor: pointer;" onclick="editManager(\'' + data.id + '\');"/>&nbsp;&nbsp;&nbsp;';
						str += '<img title="删除" src="../../easyui/themes/icons/edit_remove.png" style="cursor: pointer;" onclick="deleteManager(\'' + data.id + '\');"/>';
						return str;
					}
				},
				{
					title: '姓名',
					field: 'name',
					width: 70
				},
				{
					title: '账号',
					field: 'username',
					width: 150
				},
				{
					title: '电话',
					field: 'telephone',
					width: 100
				},
				{
					title: '部门',
					field: 'department',
					width: 80
				},
				{
					title: '重置密码',
					field: 'reset',
					align: "center",
					width: 60,
					formatter: function(value, data) {
						var s = '';
						s += '<img title="重置密码" src="../../easyui/themes/icons/reload.png" style="cursor: pointer;" onclick="resetPassword(\'' + data.id + '\');"/>';
						return s;
					}
				}
			]
		],
		toolbar: [{
				id: 'addManager',
				text: '增加',
				iconCls: 'icon-add',
				handler: function() {
					$("#managerDlg").dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/edit_add.png"/>&nbsp;增加业务员信息');
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

function resetPassword(id){
	$.messager.confirm('重置密码', '确定重置该用户密码？', function(r) {
		if(r) {
			$.ajax({
				type: "get",
				url: "http://127.0.0.1:8001/manager/resetPassword",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: ({
					'id': id,
				}),
				success: function(data) {
					if(data.code == 200) {
						$.messager.alert('提示', '重置成功');
					} else {
						$.messager.alert('提示', '删除失败，请稍后再试');
					}
				},
				error: function() {
					$.messager.alert('提示', '系统错误');
				}
			});
		}
	})
}

function editManager(id) {
	$('#managerDlg').dialog('open').dialog('setTitle', '<img src="../../easyui/themes/icons/pencil.png"/>&nbsp;编辑业务员信息');
	getManager(id);
}

function getManager(id) {
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:8001/manager/getById?id=" + id,
		xhrFields: {
			withCredentials: true
		},
		dataType: "json",
		success: function(data) {
			if(data.code == 200) {
				var res = data.data;
				$('#id').val(res.id);
				$('#name').val(res.name);
				$('#username').val(res.username);
				$('#telephone').val(res.telephone);
				$('#department').combobox('select', res.department);
			} else {
				$.messager.alert('提示', '获取信息失败');
			}
		},
		error: function() {
			$.messager.alert('提示', '系统错误');
		}
	});
}

function saveManager() {
	var name = $('#name').val();
	var username = $('#username').val();
	var telephone = $('#telephone').val();
	var department = $('#department').val();
	var id = $('#id').val();
	
	if(name == ""){
		$.messager.alert('提示', '名字不能为空');
		return;
	}
	
	if(username == ""){
		$.messager.alert('提示', '账号不能为空');
		return;
	}
	
	if(telephone == ""){
		$.messager.alert('提示', '电话号码不能为空');
		return;
	}

	$.ajax({
		type: "post",
		url: "http://127.0.0.1:8001/manager/saveManager",
		xhrFields: {
			withCredentials: true
		},
		dataType: "json",
		data: ({
			'id': id,
			'name': name,
			'username': username,
			'department': department,
			'telephone': telephone
		}),
		success: function(data) {
			if(data.code == 200) {
				if(data.data == 3) {
					$.messager.alert('提示', '保存成功');
				}
				if(data.data == 2) {
					$.messager.alert('提示', '修改成功');
				}
				cancelManager();
				$('#tableData').datagrid('reload');
			}
		},
		error: function() {
			$.messager.alert('提示', '系统错误');
		}
	});

}

function deleteManager(id) {
	$.messager.confirm('删除确认', '确定要删除该用户吗？', function(r) {
		if(r) {
			$.ajax({
				type: "get",
				url: "http://127.0.0.1:8001/manager/deleteById",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: ({
					'id': id,
				}),
				success: function(data) {
					if(data.code == 200) {
						$.messager.alert('提示', '删除成功');
						$('#tableData').datagrid('reload');
					} else {
						$.messager.alert('提示', '删除失败，请稍后再试');
					}
				},
				error: function() {
					$.messager.alert('提示', '系统错误');
				}
			});
		}
	})
}


//条件查询
function search_manager() {
	var sea_name = $("#sea_name").val();
	var sea_depart = $("#sea_depart").val();
	$("#tableData").datagrid('load', {
		name: sea_name,
		department: sea_depart
	});
}

function cancelManager() {
	$('#managerDlg').dialog('close');
	$('#name').val("");
	$('#username').val("");
	$('#telephone').val("");
	$('#department').combobox('select', '销售部');
	$('#id').val("");
}

function reset() {
	$("#sea_name").val("");
	$("#sea_depart").combobox('select','全部');
}