const axios = require('axios');
let attemptCount = 1;

async function fetchOrders() {
    try {
        const response = await axios.get('https://fauxdata.codelayer.io/api/orders');
        const result = response.data;

        let totalValue = 0;
        let orderCount = result.orders.length;
        console.log('Total Orders:', orderCount);

        result.orders.forEach((order, i) => {
            let itemIterator = 1;
            console.log('Order #' + (i + 1) + ' Total Items: ' + order.items.length);
            let orderValue = order.items.reduce((orderTotal, item) => {
                orderTotal += Number(item.price);
                console.log('Item #' + itemIterator + ' Price: £' + item.price, 'Order Total: £', orderTotal);
                itemIterator++;
                return orderTotal;
            }, 0);
            console.log('Order #' + (i + 1) + ' Total Value: £' + orderValue);
            totalValue += orderValue;

            // Order Divider
            console.log('-------------------------------------------');
        });

        let averageOrderValue = totalValue / orderCount;
        console.log('Average Order Value: £' + averageOrderValue.toFixed(2));
    } catch (error) {
        console.error('Error Code:', error.response.data.code);
        if(attemptCount < 3) {
            countdownAndRetry();
        }
    }
}

function countdownAndRetry() {
    let countdown = 3;
    attemptCount++;

    const intervalId = setInterval(() => {
        if (countdown > 0) {
            console.log('Retrying API call in...', countdown);
            countdown--;
        } else {
            clearInterval(intervalId);
            console.log('Commencing Attempt #' + attemptCount);
            fetchOrders();
        }
    }, 1000);
}

fetchOrders();