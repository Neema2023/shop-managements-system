const moment = require('moment');

/**
 * Generates a simple text receipt for a sale
 * @param {Object} sale - Sale object from DB
 * @returns {String} receipt text
 */
const generateReceipt = (sale) => {
    let receipt = `\n===== SHOP RECEIPT =====\n`;
    receipt += `Date: ${moment(sale.createdAt).format('YYYY-MM-DD HH:mm')}\n`;
    receipt += `Cashier: ${sale.cashier.name}\n`;
    receipt += `------------------------\n`;

    sale.items.forEach(item => {
        receipt += `${item.product.name} x ${item.quantity} @ ${item.price} = ${item.quantity * item.price}\n`;
    });

    receipt += `------------------------\n`;
    receipt += `Total: ${sale.totalAmount}\n`;
    receipt += `Payment Method: ${sale.paymentMethod}\n`;
    receipt += `========================\n`;
    receipt += `Thank you for shopping with us!\n`;

    return receipt;
};

module.exports = { generateReceipt };