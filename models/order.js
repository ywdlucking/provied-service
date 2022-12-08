import Http from "../utils/http";
import Base from "./base";

class Order extends Base {

    static async getOrderCount(role) {
        return Http.request({
            url: `v1/order/count?role=${role}`,
        })
    }

    static async createOrder(data) {
        return Http.request({
            url: 'v1/order',
            data,
            method: 'POST'
        })
    }

    static async updateOrderStatus(orderId, status) {
        return Http.request({
            url: `v1/order/${orderId}`,
            data: {
                action: status
            },
            method: 'POST'
        })
    }

    static async getOrderById(orderId) {
        return await Http.request({
            url: `v1/order/${orderId}`,
        });
    }

    async getOrderListByStatus(role, status) {
        if (!this.hasMoreData) {
            return this.data
        }
        const orderList = await Http.request({
            url: 'v1/order/my',
            data: {
                page: this.page,
                count: this.count,
                role,
                status
            }
        });

        this.data = this.data.concat(orderList.data)
        this.hasMoreData = !(this.page === orderList.last_page)
        this.page++
        return this.data
    }
}

export default Order
