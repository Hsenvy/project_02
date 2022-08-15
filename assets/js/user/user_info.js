$(function(){
    let form = layui.form
    let layer = layui.layer

    // 自定义验证规则
    form.verify({
        nickname:function(value){
            if (value.length > 6) {
                return '昵称长度在4-6之间'
            }
        }
    })
    initUserInfo()


    // 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if (res.status !== 0){
                    return layer.msg('获取用户信息失败')
                }

                // console.log(res)
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单数据---将数据还原成默认值
    $('#btnReset').on('click', function(e){
        // 阻止表单的默认重置事件
        e.preventDefault()
        // 调用initUserInfo()方法，重置表单数据
        initUserInfo()
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        // 发起请求更新用户信息
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            // serialize()---快速获取到表单的所有数据
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }

                layer.msg('更改信息成功')
                // 调用index.js的方法，重新渲染用户信息
                window.parent.getUerinfo()
            
            }
        })
    })
    


})