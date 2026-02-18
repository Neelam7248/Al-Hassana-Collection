import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../admin/ProductManagement/ProductContext";
import { CartContext } from "./CartContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProductDetailPage.css";
import DescriptionTabs from "./ProductDetails/DescriptionTabs";
import FrequentlyBoughtTogether from "./ProductDetails/FrequentlyBoughtTogether";
import ProductGallery from "./ProductDetails/ProductGallery";
import ProductReviews from "./ProductDetails/ProductReview";
function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error } = useContext(ProductContext);
  const {
    addToCart,
    selectedSizes,
    selectedColors,
    updateSelectedSize,
      cartButtonVisible,
    updateSelectedColor
  } = useContext(CartContext);

  const navigate = useNavigate();

  const product = products.find((p) => p._id === id);
  const [isOpen, setIsOpen] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found</p>;

  // Unique sizes
  const sizes = [
    ...new Set(product.variants.map((v) => v.size))
  ];

  // Available colors for selected size
  const availableColors = product.variants
    ?.filter((v) => v.size === selectedSizes[product._id])
    .map((v) => v.color);

  // Get selected variant for price display
  const selectedVariant = product.variants.find(
    (v) =>
      v.size === selectedSizes[product._id] &&
      v.color === selectedColors[product._id]
  );

  const handleAddToCart = () => {
    if (!selectedSizes[product._id] || !selectedColors[product._id]) {
      alert("Please select size and color first!");
      return;
    }

    addToCart(product); // addToCart uses selectedSizes & selectedColors internally

    alert("Added to cart!");
     navigate("/"); // Redirect to home page
  };

  return (
    <div className="product-detail">
<div className="product-main">
  
      {/* IMAGE SECTION */}
      <div className="image-wrapper">
        {product.images.length > 0 && (
      <img
        src={product.images[0]}
        alt={product.name}
        className="product-main-image"
        onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
      />
    )}
    
    {product.images.length > 1 && (
      <div className="thumbnail-wrapper">
        {product.images.slice(1).map((img, idx) => (
          <img
            key={idx + 1}
            src={img}
            alt={`${product.name} ${idx + 2}`}
            className="product-thumbnail"
            onClick={() => { setPhotoIndex(idx + 1); setIsOpen(true); }}
          />
        ))}
      </div>
    )}
      </div>


      {/* LIGHTBOX */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={product.images.map((url) => ({ src: url }))}
          index={photoIndex}
          controller={{ closeOnBackdropClick: true }}
        />
      )}
      
<div  className="product-info">
      {/* PRODUCT INFO */}
      <h3 className="product-title">{product.name}</h3>
   <DescriptionTabs product={product} />
  <div className="parent-selector">
   <h5>Please select quantity:</h5>
    <h5>Product Price:</h5></div>
    <div className="parent-selector">
     <div className="quantity-selector">
   
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
            {/* PRICE */}
      {selectedVariant ? (
        <>
    
        <p className="product-price">
        
          <del>Rs {selectedVariant.realPrice}</del>
          <ins>Rs {selectedVariant.discountPrice}</ins>
        </p></>
      ) : (<>
     
        <p className="product-price">
          <del>Rs {product.variants[0].realPrice}</del>
          <ins>Rs {product.variants[0].discountPrice}</ins>
        </p></>
      )}
</div>
 {/* SIZE SELECT */}
      <select
        value={selectedSizes[product._id] || ""}
        onChange={(e) => {
          updateSelectedSize(product._id, e.target.value);
          updateSelectedColor(product._id, ""); // reset color
        }}
      >
        <option value="">Select Size</option>
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size} ({product.variants.filter(v => v.size === size).reduce((sum, v) => sum + Number(v.stock), 0)} in stock)
          </option>
        ))}
      </select>

      {/* COLOR SELECT */}
      <select
        value={selectedColors[product._id] || ""}
        onChange={(e) => updateSelectedColor(product._id, e.target.value)}
        disabled={!selectedSizes[product._id]}
      >
        <option value="">Select Color</option>
        {availableColors?.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      {/* ADD TO CART */}
      <button className="add-cart-btn" onClick={handleAddToCart}>
        Add To Cart
      </button>
</div>
</div>

   <ProductGallery
        images={product.images}
        setPhotoIndex={setPhotoIndex}
        setIsOpen={setIsOpen}
      />

      {isOpen && (
        <div>
          <h3>Lightbox Opened</h3>
          <p>Selected Image Index: {photoIndex}</p>
        </div>
      )}  
<FrequentlyBoughtTogether productId={product._id} addToCart={addToCart}  photoIndex={photoIndex} setPhotoIndex={setPhotoIndex} setIsOpen={setIsOpen} product={product}  cartButtonVisible={cartButtonVisible} />
      {/* QUANTITY */}
    <ProductReviews reviews={product.reviews}  productId={product._id}/>
  
    </div>
  );
}

export default React.memo(ProductDetail);
