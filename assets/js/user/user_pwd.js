$(function(){

    let form = layui.form
    let layer = layui.layer

    // 自定义密码表单验证规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd:function(value){
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不可以与旧密码一致'
            }
        },
        repeatPwd:function(value){
            if(value !== $('[name=newPwd]').val()) {
                return '两次新密码需要相同'
            }
        }

    })

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if (res.stutas !== 0) {
                    console.log(res)
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('密码更新成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})


