"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { BuyNowButton } from "@/components/shop/buy-now-button";
import { formatPrice } from "@/lib/constants/home-data";
import type { ProductDetail } from "@/lib/constants/product-details";
import { isValidPincode, useDeliveryStore } from "@/lib/store/delivery-store";
import { royalToast } from "@/lib/toast/royal-toast";

type ProductPurchasePanelProps = {
  product: ProductDetail;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [qty, setQty] = useState(1);
  const pincode = useDeliveryStore((s) => s.pincode);
  const setPincode = useDeliveryStore((s) => s.setPincode);
  const [localPincode, setLocalPincode] = useState(pincode);

  useEffect(() => {
    setLocalPincode(pincode);
  }, [pincode]);

  const handleCheckPincode = () => {
    const value = localPincode.replace(/\D/g, "").slice(0, 6);
    if (!isValidPincode(value)) {
      royalToast.error("Enter a valid 6-digit pincode");
      return;
    }
    setPincode(value);
    royalToast.success(`Delivery available for pincode ${value}`);
  };

  const isNewArrival = product.badge === "New Arrival";
  const isOnlineExclusive = product.badge === "Online Exclusive";

  return (
    <div className="product-purchase">
      <h1 className="product-purchase__title">{product.name}</h1>

      <div className="product-purchase__price-row">
        <span className="product-purchase__price">{formatPrice(product.price)}</span>
        <span className="product-purchase__mrp">{formatPrice(product.mrp)}</span>
        {product.discount && (
          <span className="product-purchase__discount">{product.discount}</span>
        )}
      </div>
      <p className="product-purchase__tax-note">inclusive of all taxes</p>

      <div className="product-purchase__emi">
        <p className="product-purchase__emi-text">
          <span className="product-purchase__emi-amount">
            {formatPrice(product.emiMonthly)}/month
          </span>
          , rest in 3/6/9 months
        </p>
        <button type="button" className="product-purchase__emi-btn">
          BUY ON EMI
        </button>
      </div>

      <div className="product-purchase__offer">
        <p className="product-purchase__offer-label">BEST OFFER FOR YOU</p>
        <p className="product-purchase__offer-text">
          Snapmint EMI offer available on this product. See more details at checkout.
        </p>
      </div>

      <p className="product-purchase__stock">
        Availability :{" "}
        <strong className={product.inStock ? "product-purchase__in-stock" : ""}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </strong>
      </p>

      <div className="product-purchase__pincode">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={localPincode}
          onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleCheckPincode()}
          className="product-purchase__pincode-input"
          aria-label="Delivery pincode"
        />
        <button
          type="button"
          className="product-purchase__pincode-btn"
          onClick={handleCheckPincode}
        >
          CHECK
        </button>
      </div>

      <div className="product-purchase__qty-row">
        <span className="product-purchase__qty-label">Quantity:</span>
        <div className="product-purchase__qty">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span>{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="product-purchase__actions">
        <AddToCartButton
          product={product}
          quantity={qty}
          className="product-purchase__cart-btn"
          disabled={!product.inStock}
        >
          ADD TO CART
        </AddToCartButton>
        <BuyNowButton
          product={product}
          quantity={qty}
          className="product-purchase__buy-btn"
          disabled={!product.inStock}
        >
          BUY NOW
        </BuyNowButton>
      </div>

      <div className="product-purchase__share">
        <span className="product-purchase__share-label">SHARE:</span>
        <div className="product-purchase__share-icons">
          <a
            href="#"
            className="product-purchase__share-icon product-purchase__share-icon--wa"
            aria-label="Share on WhatsApp"
          >
            W
          </a>
          <a
            href="#"
            className="product-purchase__share-icon product-purchase__share-icon--fb"
            aria-label="Share on Facebook"
          >
            f
          </a>
          <a
            href="#"
            className="product-purchase__share-icon product-purchase__share-icon--x"
            aria-label="Share on X"
          >
            X
          </a>
          <a
            href="#"
            className="product-purchase__share-icon product-purchase__share-icon--pin"
            aria-label="Share on Pinterest"
          >
            P
          </a>
          <a
            href="#"
            className="product-purchase__share-icon product-purchase__share-icon--rd"
            aria-label="Share on Reddit"
          >
            R
          </a>
        </div>
      </div>

      {(isNewArrival || isOnlineExclusive) && (
        <div className="sr-only">
          {isNewArrival && "New Arrival"}
          {isOnlineExclusive && "Online Exclusive"}
        </div>
      )}
    </div>
  );
}
