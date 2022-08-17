$(function(){
    // 定义一个查询的参数对象，将来有请求数据的时候
    // 将请求数据提交到服务器
    let q = {
        pagenum:1,      //页码
        pagesize:2,     //每页显示几条数据
        cate_id:'',     //文章分类的id
        state:'',       //文章的发布状态
    }


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = PadZero(dt.getMonth()+1)
        let d = PadZero(dt.getDate())

        let h = PadZero(dt.getHours())
        let mu = PadZero(dt.getMinutes())
        let s = PadZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + h + ':' + mu + ':' + s
    }

    // 定义补零的函数
    function PadZero(n){
        return n > 9 ? n : '0' + n 
    }


    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    initTable()
    initCate() 
    //  初始化文章列表数据
    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                let htmlStr = template('listTable', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的函数renderPage()
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类  
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                let htmlStr = template('tpl-cate', res)
                $('.cate_id').html(htmlStr)
                // 重新渲染表单区域的数据
                form.render()
            }
        })
    }


    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e){
        e.preventDefault()
        // 获取筛选区域内表单的值
        let cate_id =  $('.cate_id').val()
        let state = $('[name=state').val()

        // 将值填充到查询参数q中
        q.cate_id = cate_id
        q.state = state

        // 重新渲染列表区域的数据
        initTable()
    })


    // 定义渲染分页的renderPage
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pages' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total //数据总数，从服务端得到
            ,limit:q.pagesize  //每页显示的条数
            ,curr:q.pagenum   //起始页。默认被选中的分页
            ,limits:[2,3,5,10]
            ,jump: function(obj, first){
                // 触发jump函数的方式：
                // 1.分页切换时触发---first=ture
                // 2.调用laypage函数时触发---first=false
                
                // console.log(obj.curr)  
                q.pagenum = obj.curr  //得到当前页，以便向服务端请求对应页的数据。   
                q.pagesize = obj.limit //得到每页显示的条数
                //首次不执行
                if(!first){
                    // 根据最新的q重新渲染数据
                    initTable() 
                }
            }
            ,layout:['count','limit','prev', 'page', 'next','skip']  //按序展示
            
        })
    }

    // 为删除按钮添加点击事件--代理
    $('tbody').on('click', '.btn-del', function(){
        let id = $(this).attr('data-id')
        let len = $('.btn-del').length
        // console.log(len)
        layer.confirm('是否要删除该文章?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if (res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg('文章删除成功')
                    // 数据删除完成后，需要判断当前页面是否还有数据
                    // 如果没有剩余的数据，页码值-1
                    // 再重新调用initTable()
                    if (len === 1){
                        q.pagenum = q.pagenum ===1 ? 1 : q.pagenum-1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
        
    })
})