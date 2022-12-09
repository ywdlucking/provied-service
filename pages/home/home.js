import Service from "../../models/service";
import Category from "../../models/category";
import {
    throttle
} from "../../utils/utils";

const serviceModel = new Service()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        tabs: ['所有服务', '在提供', '正在找'],
        serviceList: [],
        currentCategoryId: 0,
        multiple: 2,
        categoryList: [
            { id: 0, name: '全部' },
            { id: 1, name: '清洁' }, 
            { id: 2, name: '做饭' },
            { id: 3, name: '除草' }],
        currentTabIndex: 0,
        showStatus: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // const categoryList = await Category.getCategoryListWithAll();
        // const categoryList = []
        // this.setData({
        //     categoryList: categoryList,
        //     multiple: 2
        // })
       await this._getInitServiceList(this.data.currentTabIndex)
       this.setData({
         loading:false
       })
    },

    handleSelect: function (event) {
        const service = event.detail.service;
        wx.navigateTo({
            url: `/pages/service-detail/index?id=${service.id}`
        })
    },

    async _getInitServiceList(currentTabIndex = 0, categoryId = 0) {
        this.setData({
            currentTabIndex: currentTabIndex,
            currentCategoryId: categoryId,
            showStatus: false,
        })
        // const serviceList = await serviceModel.reset().getServiceList(currentTabIndex, categoryId);
        const serviceList=[]
        this.setData({
            showStatus: !serviceList.length,
            serviceList,
        })
    },

    handleTabChange: function (event) {
        const index = event.detail.index
        this._getInitServiceList(index, this.data.currentCategoryId)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})