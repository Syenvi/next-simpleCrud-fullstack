"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  title: string;
  price: number;
  brandId: number;
}

const DeleteProduct = ({ product }: { product: Product }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (productId: number) => {
    await axios.delete(`/api/products/${productId}`);
    router.refresh();
    setIsOpen(false);
  };
  return (
    <div>
      <button className="btn btn-error btn-sm" onClick={handleModal}>
        Delete
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Add u Sure to Delete {product.title} ?{" "}
          </h3>

          <div className="modal-action">
            <button type="button" className="btn" onClick={handleModal}>
              No
            </button>
            <button
              type="button"
              onClick={() => handleDelete(product.id)}
              className="btn btn-primary"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
