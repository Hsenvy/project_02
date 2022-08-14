$.ajaxPrefilter(function(options){
    // 拼接API接口
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url)
    
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        } 
    }
    

    // 全局统一挂载complete:// 不论请求成功与否，都会执行
    options.complete = function(res){
        // 控制用户访问权限，如果没有输入账户密码，无法进入后台
        if (res.responseJSON.status === 1 && res.responseJSON.message ==='身份认证失败！'){
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/05HTTP传输协议及MySQL数据库/05综合性后台管理系统项目实战/code/login.html'   
        }
    }
})