import serviceType from "../../enum/service-type";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        service: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        serviceType: serviceType
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleSelect() {
            this.triggerEvent('select', { service: this.properties.service })
        }
    }
})
