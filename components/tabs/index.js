import { throttle } from "../../utils/utils";

Component({
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: Array,
        active: {
            type: Number,
            value: 0
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentTabIndex: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleSwitchTab: throttle(async function (event) {
            const index = event.currentTarget.dataset.index
            if (this.data.currentTabIndex === index) {
                return
            }
            this.setData({
                currentTabIndex: index,
            })
            this.triggerEvent('change', { index })
        }),
        handleTouchmove: function (event) {
            const direction = event.direction

            const currentTabIndex = this.data.currentTabIndex
            const targetTabIndex = currentTabIndex + direction

            if (targetTabIndex < 0 || targetTabIndex > this.data.tabs.length - 1) {
                return
            }

            const customEvent = {
                currentTarget: {
                    dataset: {
                        index: targetTabIndex
                    }
                }
            }
            this.handleSwitchTab(customEvent)
        }
    }
})
