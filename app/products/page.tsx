import { PrismaClient } from "@prisma/client";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import Search from "./search";
import Pagination from "./pagination";
const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 5;

const getProducts = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const res = await prisma.product.findMany({
    skip: offset,
    take: ITEMS_PER_PAGE,
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

const getProductPages = async (query: string) => {
  const res = await prisma.product.count({
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
  const total_pages = Math.ceil(Number(res) / ITEMS_PER_PAGE);

  return total_pages;
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

  const [products, brands, totalPages] = await Promise.all([
    getProducts(query, Number(page)),
    getBrands(),
    getProductPages(query),
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
      <div className="flex justify-center mt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default ProductPage;
