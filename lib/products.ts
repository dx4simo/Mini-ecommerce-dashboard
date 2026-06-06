import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";

export async function getAllProducts(): Promise<Product[]> {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      image: data.image,
      description: data.description,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  });
}

export type ProductInput = {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
};

export async function createProduct(data: ProductInput): Promise<void> {
  await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<ProductInput>
): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}
