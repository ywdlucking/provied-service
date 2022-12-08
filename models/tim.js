import TIM from "tim-wx-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import User from "./user";
import timConfig from "../config/tim";

class Tim {

    _SDKInstance = null

    nextReqMessageID = ''
    isCompleted = false
    messageList = []

    constructor() {
        let options = {
            SDKAppID: timConfig.appId // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
        };
        // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
        let SDKInstance = TIM.create(options); // SDK 实例通常用 tim 表示
        // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
        SDKInstance.setLogLevel(timConfig.logLevel); // 普通级别，日志量较多，接入时建议使用
        // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

        // 注册 COS SDK 插件
        SDKInstance.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
        this._SDKInstance = SDKInstance
    }

    //静态方法
    static getInstance() {
        if (!this.instance) {
            this.instance = new Tim();
        }
        return this.instance;
    }

    getSDK() {
        return this._SDKInstance
    }

    async login() {
        const userSign = await User.getUserSign();
        await this._SDKInstance.login({
            userID: userSign.user_id.toString(),
            userSig: userSign.sign
        });
    }

    async logout() {
        const res = await this._SDKInstance.logout();
        return res.data
    }

    async getConversationList() {
        const res = await this._SDKInstance.getConversationList();
        return res.data.conversationList
    }

    async getMessageList(targetUserId, count = 10) {
        if (this.isCompleted) {
            return this.messageList
        }

        const res = await this._SDKInstance.getMessageList({
            conversationID: `C2C${targetUserId}`,
            nextReqMessageID: this.nextReqMessageID,
            count
        });

        this.nextReqMessageID = res.data.nextReqMessageID
        this.isCompleted = res.data.isCompleted
        this.messageList = res.data.messageList

        return this.messageList
    }

    async getUserProfile(userId) {
        const res = await this._SDKInstance.getUserProfile({
            // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
            userIDList: [userId]
        });
        return res.data
    }

    async updateMyProfile(userInfo) {
        await this._SDKInstance.updateMyProfile({
            nick: userInfo.nickname,
            avatar: userInfo.avatar,
            gender: userInfo.gender === 1 ? TIM.TYPES.GENDER_MALE : TIM.TYPES.GENDER_FEMALE
        });
        wx.setStorageSync('userInfo', userInfo)
    }

    async sendTextMessage(to, text) {
        let message = await this._SDKInstance.createTextMessage({
            to,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                text
            }
        });
        const res = await this._SDKInstance.sendMessage(message);
        return res.data
    }

    async sendImageMessage(to, file) {
        let message = await this._SDKInstance.createImageMessage({
            to,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                file
            }
        });
        const res = await this._SDKInstance.sendMessage(message);
        return res.data
    }

    async sendCustomMessage(to, payload) {
        const message = this.createCustomMessage(to, JSON.stringify(payload), 'message')
        const res = await this._SDKInstance.sendMessage(message);
        return res.data
    }

    async setMessageRead(targetUserId) {
        const res = await this._SDKInstance.setMessageRead({ conversationID: `C2C${targetUserId}` });
        return res.data
    }

    createCustomMessage(to, payload, showType = 'link') {
        return this._SDKInstance.createCustomMessage({
            to,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                data: 'service',
                description: payload,
                extension: showType
            }
        });
    }

    reset() {
        this.nextReqMessageID = ''
        this.isCompleted = false
        this.messageList = []
    }

}

export default Tim
