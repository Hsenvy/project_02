$(function(){
    let layer = layui.layer
    let form = layui.form
    initArtcateList()

    // 获取文章分类列表
    function initArtcateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮添加点击事件
    let index = null
    $('#btnAddCate').on('click', function(){
        index = layer.open({
            type:1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
          })
    })

    // 监听表单的submit事件--通过代理的形式，为itemlog_add表单绑定事件
    $('body').on('submit', '#itemlog_add', function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                
                initArtcateList()
                layer.msg('新增文章成功')
                // 根据索引关闭弹出层
                layer.close(index)
            }
        })
    })


    // 为编辑按钮添加点击事件---代理的形式
    let indexEdit = null
    $('tbody').on('click', '#btn_edit', function(){
        indexEdit = layer.open({
            type:1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        })

        let id = $(this).attr('data-id')
        console.log(id)

        // 发起请求获取对应的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                form.val('itemlog_edit', res.data)
            }
        })
    })

    // 监听表单的修改分类事件---代理的形式
    $('body').on('submit', '#itemlog_edit', function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(res.message)
                } 
                initArtcateList()
                layer.msg('修改文章成功')
                // 根据索引关闭弹出层
                layer.close(indexEdit)
            }
        })
    })

    // 为删除按钮添加点击事件---代理的形式
    $('tbody').on('click', '#btn_del', function(){
        let id = $(this).attr('data-id')
        // console.log(id)
        layer.confirm('是否删除当前文章？', {icon: 3, title:'提示'}, function(index){
            // 发起请求删除对应的数据
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+ id,
                success:function(res){
                    if (res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtcateList()
                    layer.close(index)
                }
            })   
        })

        

      
    })
    


})



