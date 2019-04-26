function open_depot() {
	if($("#tt").tabs('exists', '仓库管理')) {
		$("#tt").tabs('select', '仓库管理');

	} else {
		$("#tt").tabs('add', {
			title: '仓库管理',
			content: '<iframe src="pages/depot/depot.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true

		});
	}

}

function open_depot_manger() {
	if($("#tt").tabs('exists', '库存信息')) {
		$("#tt").tabs('select', '库存信息');
	} else {
		$("#tt").tabs('add', {
			title: '库存信息',
			content: '<iframe src="pages/depot/depot_manager.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}

}

function open_goods_move() {
	if($("#tt").tabs('exists', '商品调拨')) {
		$("#tt").tabs('select', '商品调拨');
	} else {
		$("#tt").tabs('add', {
			title: '商品调拨',
			content: '<iframe src="pages/depot/goods_move.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}


function open_procurement(){
	if($("#tt").tabs('exists', '出入库')){
		$("#tt").tabs('select', '出入库');
	}else{
		$("#tt").tabs('add', {
			title: '出入库',
			content: '<iframe src="pages/supplies/procurement.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}


function open_account(){
	if($("#tt").tabs('exists', '采购订单')){
		$("#tt").tabs('select', '采购订单');
	}else{
		$("#tt").tabs('add', {
			title: '采购订单',
			content: '<iframe src="pages/supplies/account.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_goods_business(){
	if($("#tt").tabs('exists', '商品业务')){
		$("#tt").tabs('select', '商品业务');
	}else{
		$("#tt").tabs('add', {
			title: '商品业务',
			content: '<iframe src="pages/business/goods_business.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_customer_return(){
	if($("#tt").tabs('exists', '顾客退货')){
		$("#tt").tabs('select', '顾客退货');
	}else{
		$("#tt").tabs('add', {
			title: '顾客退货',
			content: '<iframe src="pages/business/customer_return.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_supplier(){
	if($("#tt").tabs('exists', '供货商管理')){
		$("#tt").tabs('select', '供货商管理');
	}else{
		$("#tt").tabs('add', {
			title: '供货商管理',
			content: '<iframe src="pages/daily/supplier.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_customer(){
	if($("#tt").tabs('exists', '顾客管理')){
		$("#tt").tabs('select', '顾客管理');
	}else{
		$("#tt").tabs('add', {
			title: '顾客管理',
			content: '<iframe src="pages/daily/customer.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_salesman(){
	if($("#tt").tabs('exists', '业务员管理')){
		$("#tt").tabs('select', '业务员管理');
	}else{
		$("#tt").tabs('add', {
			title: '业务员管理',
			content: '<iframe src="pages/daily/salesman.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_bad_debt(){
	if($("#tt").tabs('exists', '客户坏账')){
		$("#tt").tabs('select', '客户坏账');
	}else{
		$("#tt").tabs('add', {
			title: '客户坏账',
			content: '<iframe src="pages/daily/bad_debt.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_contract(){
	if($("#tt").tabs('exists', '合同管理')){
		$("#tt").tabs('select', '合同管理');
	}else{
		$("#tt").tabs('add', {
			title: '合同管理',
			content: '<iframe src="pages/daily/contract.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}

function open_goods(){
	if($("#tt").tabs('exists', '商品信息')){
		$("#tt").tabs('select', '商品信息');
	}else{
		$("#tt").tabs('add', {
			title: '商品信息',
			content: '<iframe src="pages/daily/goods.html" style="border: hidden;height:100%;width:100%"></iframe>',
			closable: true
		});
	}
}


