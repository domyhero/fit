import request from 'superagent'

const send = (info, successCallback, errorCallback)=> {
    // ti 标题
    // co 内容
    // fid 吧id
    // word 吧名
    // src 来源 发帖:2 回复,楼中楼:1
    // z 帖子id
    // floor 楼层,楼中楼使用
    // tag 未知,一般是11
    // upload_img_info 图片信息
    // tbs csrf防御
    // bs 验证码vcode_md5
    // input_vcode 验证码用户输入的vcode

    let data = {
        co: info.content,
        tag: 11,
        fid: info.forumId,
        word: info.forumName,
        tbs: window.tbs
    }

    if (info.bs) {
        data.bs = info.bs
    }

    if (info['input_vcode']) {
        data['input_vcode'] = info['input_vcode']
    }

    switch (info.type) {
    case 'post':
        data.ti = info.title
        data.src = 2
        break
    case 'reply':
        data.src = 1
        data.z = info.threadId
        break
    case 'comment':
        data.src = 1
        data.z = info.threadId
        data.pid = info.postId
        break
    }

    request.post('/mo/q/apubpost')
        .send(data)
        .type('form')
        .end((err, res)=> {
            if (err) {
                return console.log(err)
            }

            if (res.body.no !== 0) {
                return errorCallback(res.body.no, res.body)
            }

            successCallback(res.body)
        })
}

export default send