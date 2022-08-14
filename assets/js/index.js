$(function(){
    // 调用getUerinfo()获取用户的基本信息
    getUerinfo()

    // 导出layer方法
    let layer = layui.layer

    // 添加退出事件
    $('#btnlogout').on('click', function(){
        // 添加提示框-询问是否退出
        layer.confirm('确定是否退出？', {icon: 3, title:'提示'}, 
        function(index){
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/05HTTP传输协议及MySQL数据库/05综合性后台管理系统项目实战/code/login.html'
            // 关闭弹出的询问框
            layer.close(index)
          })
        
    })
    
})


// 获取用户的基本信息
function getUerinfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // Headers请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function(res){
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用渲染用户头像函数
           renderAvatar(res.data)
        }
    })
}


// 渲染用户头像函数
function renderAvatar(user) {
    // 1.获取用户的名称
    let name = user.nickname || user.username
    $('#wellcom').html('欢迎&nbsp;&nbsp;'+ name)

    // 2.获取用户头像-按需渲染
    if(user.user_pic !== null) {
        // 渲染图片图像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 渲染文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
