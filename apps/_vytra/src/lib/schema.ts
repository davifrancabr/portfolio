import z from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .nonempty()
    .min(2, 'Nome do produto deve possuir pelo menos 2 caracteres'),
  description: z
    .string()
    .max(1999, 'Descrição deve conter no maximo 1999 caracteres'),
  sku: z.string().nonempty('sku é obrigatório'),
  costPrice: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive(),
  deletedAt: z.iso.datetime()
});
export type ProductType = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export const createStorageSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do deposito deve conver pelo menos 1 caracteres'),
  address: z.string().nonempty('endereço do deposito é obrigatório')
});
export type StorageType = z.infer<typeof createStorageSchema>;

export const updateStorageSchema = createStorageSchema.partial();

export const createInventoryMovementSchema = z.object({
  userId: z.string().nonempty('userId é obrigatório'),
  storageId: z.cuid2().nonempty(),
  productId: z.cuid2().nonempty(),
  type: z.enum(['ENTRADA', 'SAIDA', 'AJUSTE']).nonoptional(),
  quantityBefore: z.number().int().positive(),
  quantity: z.number().int().positive(),
  quantityAfter: z.number().int().positive(),
  reason: z.string()
});
export type createInventoryMovementType = z.infer<
  typeof createInventoryMovementSchema
>;

export const updateInventoryMovementSchema =
  createInventoryMovementSchema.partial();
