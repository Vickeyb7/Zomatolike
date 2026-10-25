import React, { useState } from 'react';
import { CartItem, UserAddress } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  MapPin, 
  Check, 
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  restaurantName: string;
  addresses: UserAddress[];
  onPlaceOrder: (orderDetails: {
    items: CartItem[];
    total: number;
    address: UserAddress;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  restaurantName,
  addresses,
  onPlaceOrder,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [isOrderPlacedSuccess, setIsOrderPlacedSuccess] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const deliveryFee = subtotal >= 250 || subtotal === 0 ? 0 : 35;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const discount = appliedPromo ? Math.round(subtotal * 0.2) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee + taxes - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'ZOMATO20' || code === 'LITE20' || code === 'BURRITO') {
      setAppliedPromo(code);
      setPromoCode('');
    }
  };

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleCheckout = () => {
    if (cartItems.length === 0 || !selectedAddress) return;

    const orderNum = `#ZL-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastOrderNumber(orderNum);

    onPlaceOrder({
      items: cartItems,
      total: grandTotal,
      address: selectedAddress,
    });

    setIsOrderPlacedSuccess(true);
  };

  const handleFinishSuccess = () => {
    setIsOrderPlacedSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#14151c] border-l border-zinc-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-rose-500" />
                <h2 className="text-base font-bold text-white">Your Food Basket</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-xs">
                From <span className="text-zinc-200 font-medium">{restaurantName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success screen state */}
          {isOrderPlacedSuccess ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-2">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
              <p className="text-xs font-mono text-rose-400 font-semibold">
                Order Ticket: {lastOrderNumber}
              </p>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                The kitchen at <strong className="text-white">{restaurantName}</strong> is preparing your meal. Delivery partner will be dispatched shortly to {selectedAddress?.sector}.
              </p>
              <div className="w-full bg-[#1b1c24] p-4 rounded-xl border border-zinc-800 text-xs text-left space-y-1.5 mt-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Destination:</span>
                  <span className="text-white font-medium">{selectedAddress?.label} ({selectedAddress?.sector})</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>ETA:</span>
                  <span className="text-white">25-30 minutes</span>
                </div>
              </div>
              <button
                onClick={handleFinishSuccess}
                className="w-full py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-lg mt-4"
              >
                Track on Active Orders
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto" />
                    <p className="text-sm font-semibold text-zinc-300">Your basket is empty</p>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Explore dishes from {restaurantName} menu and add items to begin ordering.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                      <span>{cartItems.length} dish(es) in order</span>
                      <button
                        onClick={onClearCart}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        Clear Basket
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="bg-[#1a1b24] p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-white">
                              {item.menuItem.name}
                            </h4>
                            <div className="text-xs text-zinc-400 font-medium tabular-nums mt-0.5">
                              ₹{item.menuItem.price} each
                            </div>
                          </div>

                          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                              className="p-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                              className="p-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-xs font-bold text-white tabular-nums text-right w-12">
                            ₹{item.menuItem.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Form */}
                    <div className="pt-3">
                      {appliedPromo ? (
                        <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                          <span className="font-semibold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            Coupon '{appliedPromo}' applied (20% off)
                          </span>
                          <button
                            onClick={() => setAppliedPromo(null)}
                            className="text-emerald-400 hover:text-white text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Promo code (try 'ZOMATO20')"
                            className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg"
                          >
                            Apply
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Delivery Address Selector */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold uppercase text-zinc-400 mb-1.5">
                        Deliver to Address
                      </label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        {addresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label} &mdash; {a.sector}, {a.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bill Breakdown */}
                    <div className="pt-4 border-t border-zinc-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Item Subtotal</span>
                        <span className="tabular-nums">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Delivery Fee</span>
                        <span className="tabular-nums">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-400">FREE</span>
                          ) : (
                            `₹${deliveryFee}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Taxes &amp; GST (5%)</span>
                        <span className="tabular-nums">₹{taxes}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                          <span>Promo Discount</span>
                          <span className="tabular-nums">-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800">
                        <span>Grand Total</span>
                        <span className="tabular-nums text-rose-400">₹{grandTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Checkout Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-zinc-800 bg-zinc-900/60">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-xl shadow-rose-950/40 transition-all"
                  >
                    <span>₹{grandTotal} · Place Order</span>
                    <span className="flex items-center gap-1">
                      Proceed <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                  <p className="text-[10px] text-center text-zinc-500 mt-2">
                    Guaranteed on-time delivery or 100% refund on Zomato Lite.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
