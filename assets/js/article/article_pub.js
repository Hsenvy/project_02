$(function(){
    let layer = layui.layer
    let form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 定义加载文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url:'/my/article/cates',
            success:function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎导入分类
                let htmlStr = template('tpl-cate', res)
                $('[name=categories]').html(htmlStr)
                form.render()
            }
        })
    }

    // 实现基本裁剪效果
     var $image = $('#image') // 1. 初始化图片裁剪器
     var options = {          // 2. 裁剪选项
       aspectRatio: 400 / 280,
       preview: '.img-preview'
     }
     $image.cropper(options)  // 3. 初始化裁剪区域

    //  给选择封面的按钮绑定点击事件
    $('#btnChooseImg').on('click', function(){
        $('#coverFile').click()
    })

    $('#coverFile').on('change',function(e){
        var file = e.target.files
        if (file.length === 0){
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
   
    })

    // 定义文章发布状态
    let art_state = '已发布'

    $('#btnSave').on('click', function(){
        art_state = '草稿'
    })

    $('#submitArt').on('submit', function(e){
        e.preventDefault()
        // 基于form表单快速创建FormDate对象
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 将裁剪后的封面图片，输出为文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，存储到fd中
            fd.append('cover_img',blob)
        })
        pubArt(fd)
    })

    // 定义发起发布文章的请求
    function pubArt(fd){    
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            date:fd,
            // formdata格式数据必须有以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('文章发布成功')
                location.href='/article/article_list.html'
            }
        })
    }
})