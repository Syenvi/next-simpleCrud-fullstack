import { PrismaClient } from "@prisma/client";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import Search from "./search";
const prisma = new PrismaClient();

const getProducts = async (query: string, page: number) => {
  const res = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      brandId: true,
      brand: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return res;
};

const getBrands = async () => {
  const res = await prisma.brand.findMany();
  return res;
};

const ProductPage = async ({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page || 1;

  const [products, brands] = await Promise.all([
    getProducts(query, Number(page)),
    getBrands(),
  ]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Search />
        <AddProduct brands={brands} />
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Brand</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.brand.name}</td>
              <td className="flex  space-x-2 justify-center">
                <DeleteProduct product={product} />
                <UpdateProduct brands={brands} product={product} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;
