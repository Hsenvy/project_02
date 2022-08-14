
$(function(){
    // 绑定注册/登录事件
    $('#link_reg').click(function(){
        $('.loginBox').hide()
        $('.regBox').show()
    })

    $('#link_login').click(function(){
        $('.regBox').hide()
        $('.loginBox').show()
    })

    // 自定义校验规则
    // 1.从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 2.通过form.verify()函数自定义校验规则
    form.verify({
        username: [
            /^[a-zA-Z0-9_-]{4,16}$/
            ,'用户名必须4到16位（字母，数字，下划线，减号'
          ]
        ,password: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ]
        ,repeatpwd: function(value) {
            // 确认两次密码输出一致
            let pwd = $('#formReg [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#formReg').on('submit', function(e){
        e.preventDefault()
        // 发起请求
        let data = {
            username:$('#formReg [name=username]').val(), 
            password:$('#formReg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res){
            if (res.status !== 0){
                // return console.log(res.message)
                return layer.msg(res.message)
            
            }
            layer.msg('注册成功')
            // 注册成功之后模拟人的点击行为,跳转到登录页面
            $('#link_login').click()
        })
    })


    // 监听登录表单的提交事件
    $('#formLogin').on('submit', function(e){
        e.preventDefault()
        // 发起Ajax-post请求
        $.post('/api/login',$(this).serialize(),function(res){
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 将登录成功的token存储带localStorage中
            // console.log(res.token)
            // layer.msg('登录成功')
            localStorage.setItem('token', res.token)
            location.href = '/05HTTP传输协议及MySQL数据库/05综合性后台管理系统项目实战/code/index.html'

        })
    })
})





