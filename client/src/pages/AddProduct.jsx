import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct, getCategories } from "../api/products";

const EMPTY_FORM = {
  title: "",
  category: "",
  price: "",
  stock: "",
  brand: "",
  description: "",
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories());
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim() || form.price === "") {
      toast.error("Title, category and price are required");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("category", form.category.trim());
      payload.append("price", Number(form.price));
      payload.append("stock", Number(form.stock) || 0);
      payload.append("brand", form.brand.trim());
      payload.append("description", form.description.trim());
      if (image) {
        payload.append("image", image);
      }

      const product = await createProduct(payload);
      toast.success(`${product.title} added`);
      navigate(`/product/${product.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h1 className="text-center">Add Product</h1>
            <hr />
            <div className="card">
              <div className="card-body">
                <form onSubmit={submit}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      name="category"
                      list="category-options"
                      placeholder="smartphones"
                      value={form.category}
                      onChange={updateField}
                      required
                    />
                    <datalist id="category-options">
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="price"
                        name="price"
                        value={form.price}
                        onChange={updateField}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="stock">Stock</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={form.stock}
                        onChange={updateField}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      id="brand"
                      name="brand"
                      value={form.brand}
                      onChange={updateField}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={form.description}
                      onChange={updateField}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="image"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                    />
                    <small className="text-muted">
                      Stored on Cloudinary, max 8MB. jpg, png, webp or avif.
                    </small>
                  </div>

                  {preview && (
                    <div className="text-center my-3">
                      <img
                        src={preview}
                        alt="preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: "220px" }}
                      />
                    </div>
                  )}

                  <button type="submit" className="btn btn-dark btn-block" disabled={saving}>
                    {saving ? "Uploading..." : "Add product"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
