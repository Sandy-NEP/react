#!/bin/bash

echo "🧪 Verifying E-commerce System..."

# Start PHP server in background
cd ~/repos/react/jivorix/react-auth-backend
php -S localhost:8000 > /dev/null 2>&1 &
PHP_PID=$!

# Wait for server to start
sleep 3

echo "✅ PHP Server started (PID: $PHP_PID)"

# Test inventory API
echo "📦 Testing inventory API..."
INVENTORY_RESPONSE=$(curl -s http://localhost:8000/cart/inventory.php)
if [[ $INVENTORY_RESPONSE == *"success"* ]]; then
    echo "✅ Inventory API working"
else
    echo "❌ Inventory API failed"
fi

# Test cart index API
echo "🛒 Testing cart API..."
CART_RESPONSE=$(curl -s "http://localhost:8000/cart/index.php?action=view&userId=1")
if [[ $CART_RESPONSE == *"success"* ]] || [[ $CART_RESPONSE == *"User not found"* ]]; then
    echo "✅ Cart API working"
else
    echo "❌ Cart API failed"
fi

# Test payment methods API
echo "💳 Testing payment methods API..."
PAYMENT_RESPONSE=$(curl -s http://localhost:8000/cart/payment_methods.php?action=list)
if [[ $PAYMENT_RESPONSE == *"success"* ]]; then
    echo "✅ Payment methods API working"
else
    echo "❌ Payment methods API failed"
fi

# Clean up
kill $PHP_PID 2>/dev/null

echo ""
echo "🎉 System verification complete!"
echo ""
echo "📁 Final file structure:"
echo "Backend cart files:"
ls -la ~/repos/react/jivorix/react-auth-backend/cart/

echo ""
echo "Frontend services:"
ls -la ~/repos/react/jivorix/react-auth-frontend/src/services/