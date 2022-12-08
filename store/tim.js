import { action, observable } from 'mobx-miniprogram'
import TIM from "tim-wx-sdk";
import Tim from "../models/tim";
import User from "../models/user";

export const timStore = observable({

    sdkReady: false,

    login: action(async function () {
        if (this.sdkReady) {
            return
        }
        await Tim.getInstance().login()
        Tim.getInstance().getSDK().on(TIM.EVENT.SDK_READY, this.onSDKReady, this)
    }),

    logout: action(async function () {
        await Tim.getInstance().logout()
    }),

    isReady: action(function () {
        return this.sdkReady
    }),

    async onSDKReady() {
        this.sdkReady = true
        this._runListener()
        const userInfo = await User.getUserInfo()
        await Tim.getInstance().updateMyProfile(userInfo)
        wx.setStorageSync('userInfo', userInfo)
    },

    _runListener() {
        Tim.getInstance().getSDK().on(TIM.EVENT.SDK_NOT_READY, this.onSdkNotReady, this);
        Tim.getInstance().getSDK().on(TIM.EVENT.KICKED_OUT, this.onKickedOut, this);
        Tim.getInstance().getSDK().on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
    },

    onSdkNotReady() {
        this.sdkReady = false
    },

    onKickedOut(event) {
        this.sdkReady = false
    },

    onConversationListUpdated(event) {
        // const unreadCount = event.data.reduce((conversationOne, conversationTwo) => conversationOne.unreadCount + conversationTwo.unreadCount);
        const unreadCount = event.data.reduce((sum, item) => sum + item.unreadCount, 0);

        if (unreadCount !== 0) {
            wx.setTabBarBadge({
                index: 2,
                text: unreadCount.toString()
            })
        } else {
            wx.removeTabBarBadge({
                index: 2
            })
        }
    },

})
