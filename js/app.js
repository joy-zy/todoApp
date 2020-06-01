(function (Vue) {
	var STORAGE_KEY = 'items-vuejs';
	// 本地存储数据对象
	const itemStorage = {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (items) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		}
	}
	// 初始化任务
	const items = [
	]
	//自定义全局指令，用于增加输入框   
	//定义时不要在前面加v-, 引用指令时要加上v-
	Vue.directive('app-focus', {
		inserted(el, binding) {
			el.focus()
		}
	})
	var vm = new Vue({
		el: "#todoapp",
		data: {
			//es6中的对象属性简写,等价于items:items;
			items,
			items: itemStorage.fetch(), //获取本地数据进行初始化
			currentItem: null,
			filterStatus: "all"
		},
		// 监听器
		watch: {
			// 如果 items 发生改变，这个函数就会运行
			items: {
				deep: true, // 发现对象内部值的变化, 要在选项参数中指定 deep: true。
				handler: function (newItems, oldItems) {
					//本地进行存储
					itemStorage.save(newItems)
				}
			}
		},
		//自定义局部指令，用于编辑输入
		directives: {
			'todo-focus': {
				updata(el, binding) {
					if (binding.value) {
						el.focus()
					}
				}
			}
		},
		computed: {
			number() {
				return this.items.filter(item => !item.completed).length
			},
			// 复选框计算属性双向绑定
			toggleAll: {
				get() {
					return this.number === 0
				},
				set(newStatus) {
					this.items.forEach((item) => {
						item.completed = newStatus;
					})
				}
			},
			// 过滤出不同的状态数据
			filterItems() {
				//this.filterStatus 作为条件，变化后过滤不同数据
				switch (this.filterStatus) {
					// 过滤出未完成的数据
					case "active":
						return this.items.filter(item => !item.completed)
						break
					case "completed":
						return this.items.filter(item => item.completed)
						break
					default:
						return this.items
				}
			}
		},
		methods: {
			// 增加任务项
			addItem(event) {
				console.log('addItem', event.target.value)
				// 1.获取输入框的内容
				const content = event.target.value.trim()
				// 2.判断内容是否为空，为空则什么也不做
				if (!content.length) {
					return
				}
				// 3.如果不为空，则添加到数组中，生成id值
				const id = this.items.length + 1;
				// 添加到数组中
				this.items.push({
					id,
					content,
					completed: false
				})
				// 清除文本框内容
				event.target.value = ""
			},
			//  移除任务项
			removeItem(index) {
				this.items.splice(index, 1)
			},
			// 移除所有选中项
			removeCompleted() {
				this.items = this.items.filter(item => !item.completed)
			},
			// 进入编辑状态,当前点击的任务项item赋值currentItem，用于页面判断显示 .editing
			toEdit(item) {
				this.currentItem = item;
			},
			//取消编辑
			cancelEdit() {
				this.currentItem = null;
			},
			// 编辑完成
			finishEdit(item, inddx, $event) {
				const content = event.target.value.trim()
				if (!event.target.value.trim()) {
					this.removeItem(index)
					return
				}
				item.content = content
				this.currentItem = null
			},
		}
	})
	   //当路由 hash 值改变后会自动调用此函数
	   window.onhashchange = function () {
		console.log('hash改变了' + window.location.hash)
		// 1.获取点击的路由 hash , 当截取的 hash 不为空返回截取的，为空时返回 'all'
		var hash = window.location.hash.substr(2) || 'all'
  
		// 2. 状态一旦改变，将 hash 赋值给 filterStatus
		//    当计算属性 filterItems  感知到 filterStatus 变化后，就会重新过滤
		//    当 filterItems 重新过滤出目标数据后，则自动同步更新到视图中
		vm.filterStatus = hash
	 }
	 // 第一次访问页面时,调用一次让状态生效
	 window.onhashchange()
  

})(Vue);
