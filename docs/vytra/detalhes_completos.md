# Vytra — Detalhes completos do domínio

Documento gerado a partir de:

- `apps/vytra/src/db/schema.ts` (modelo Drizzle / PostgreSQL)
- `apps/vytra/src/lib/schema.ts` (validação Zod usada pelos serviços)
- `apps/vytra/src/services/**` (funções de criação)

IDs de negócio usam CUID2 (`@paralleldrive/cuid2`). Valores monetários são inteiros em **centavos**. Datas no banco usam timezone (`timestamptz`). Campos `created_at` / `updated_at` são padronizados em quase todas as tabelas.

---

## 1. Visão geral

A Vytra modela um e-commerce completo:

1. Autenticação e perfil (`user`, `session`, `account`, `verification`)
2. Catálogo (`brands`, `categories`, `products`, imagens e categorias N:N)
3. Estoque (`warehouses`, `inventory_items`, `stock_movements`)
4. Carrinho, cupons e pedidos (`carts`, `orders`, itens, resgates)
5. Pagamento, reembolso, envio e auditoria (`payments`, `refunds`, `shipments`, `order_events`)
6. Interações do cliente (`addresses`, `wishlists`, `reviews`)

Os serviços atuais cobrem **somente criação** (insert). Tabelas de itens, movimentos de estoque, resgates de cupom, endereços e imagens ainda não têm serviço correspondente.

### 1.1 Mapa de serviços

| Pasta                     | Arquivo                     | Função                  | Tabela             |
| ------------------------- | --------------------------- | ----------------------- | ------------------ |
| `catalogo_estoque`        | `create-brand.ts`           | `createBrand`           | `brands`           |
| `catalogo_estoque`        | `create-category.ts`        | `createCategory`        | `categories`       |
| `catalogo_estoque`        | `create-product.ts`         | `createProduct`         | `products`         |
| `catalogo_estoque`        | `create-warehouses.ts`      | `createWarehouse`       | `warehouses`       |
| `pedidos_cupons_carrinho` | `create-carts.ts`           | `createCarts`           | `carts`            |
| `pedidos_cupons_carrinho` | `create-coupons.ts`         | `createCoupons`         | `coupons`          |
| `pedidos_cupons_carrinho` | `create-orders.ts`          | `createOrders`          | `orders`           |
| `pagamento_envio_eventos` | `create-payments.ts`        | `createPayments`        | `payments`         |
| `pagamento_envio_eventos` | `create-refunds.ts`         | `createRefunds`         | `refunds`          |
| `pagamento_envio_eventos` | `create-shipmentMethods.ts` | `createShipmentMethods` | `shipping_methods` |
| `pagamento_envio_eventos` | `create-shipments.ts`       | `createShipments`       | `shipments`        |
| `pagamento_envio_eventos` | `create-orderEvents.ts`     | `createOrderEvents`     | `order_events`     |
| `usuarios_interacoes`     | `create-wishlists.ts`       | `createWishlists`       | `wishlists`        |
| `usuarios_interacoes`     | `create-reviews.ts`         | `createReviews`         | `reviews`          |

Padrão comum dos serviços:

1. Recebem um objeto tipado com `z.infer<typeof createXSchema>`
2. Validam com `safeParse`
3. Se inválido, retornam `error.cause`
4. Se válido, fazem `db.insert(...).values(...).returning()`
5. Alguns convertem strings ISO (`z.iso.datetime`) para `Date` antes do insert
6. `createBrand`, `createProduct` e `createWarehouse` usam `onConflictDoNothing()`

### 1.2 Tabelas sem serviço de criação

- `user`, `session`, `account`, `verification` (auth)
- `product_images`, `product_categories`
- `cart_items`, `coupon_redemptions`
- `addresses`
- `wishlist_items`
- `inventory_items`, `stock_movements`
- `order_items`, `shipment_items`

---

## 2. Enums

| Enum                  | Valores                                                                                               | Uso                          |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| `product_status`      | `draft`, `active`, `archived`                                                                         | Ciclo de vida do produto     |
| `stock_movement_type` | `purchase`, `sale`, `return`, `adjustment`, `reservation`, `release`, `loss`, `transfer`              | Auditoria de estoque         |
| `cart_status`         | `active`, `converted`, `abandoned`, `expired`                                                         | Estado do carrinho           |
| `discount_type`       | `percentage`, `fixed_amount`, `free_shipping`                                                         | Tipo de cupom                |
| `order_status`        | `pending`, `paid`, `processing`, `shipped`, `delivered`, `canceled`, `refunded`                       | Estado comercial do pedido   |
| `fulfillment_status`  | `unfulfilled`, `partially_fulfilled`, `fulfilled`, `returned`                                         | Separação / envio dos itens  |
| `address_type`        | `shipping`, `billing`, `both`                                                                         | Papel do endereço cadastrado |
| `payment_status`      | `pending`, `authorized`, `paid`, `failed`, `canceled`, `refunded`, `partially_refunded`, `chargeback` | Pagamento e reembolso        |
| `payment_method`      | `credit_card`, `debit_card`, `pix`, `boleto`, `wallet`, `bank_transfer`, `store_credit`               | Meio de pagamento            |
| `shipment_status`     | `pending`, `label_created`, `in_transit`, `out_for_delivery`, `delivered`, `failed`, `returned`       | Rastreio da remessa          |
| `review_status`       | `pending`, `approved`, `rejected`                                                                     | Moderação de avaliação       |

---

## 3. Autenticação e usuário

Não há serviço em `src/services` para estas tabelas. Elas sustentam Better Auth (ou equivalente) e o restante do domínio.

### 3.1 `user`

- Identidade: `id`, `name`, `email` (único), `emailVerified`, `image`
- Perfil: `username` (único), `displayUsername`, `role`
- Moderação: `banned`, `banReason`, `banExpires`
- Índices: email único, role

Relações: sessões, contas, endereços, carrinhos, pedidos, wishlists, reviews.

### 3.2 `session`

Token único, expiração, IP, user-agent, `userId` (cascade) e `impersonatedBy`.

### 3.3 `account`

Vínculo com provedor OAuth/credencial: `accountId`, `providerId`, tokens, `password`, `scope`. Cascade no usuário.

### 3.4 `verification`

Fluxos de e-mail / código: `identifier`, `value`, `expiresAt`.

---

## 4. Catálogo e estoque

Fluxo esperado de cadastro:

```
createBrand ─┐
             ├─► createProduct (brandId + primaryCategoryId)
createCategory ┘
createWarehouse ─► (futuro) inventory_items por produto × depósito
```

### 4.1 Marcas — `createBrand`

Schema Zod (`createBrandsSchema`): `name`, `slug`, `description?`, `logoUrl?` (URL), `isActive` (default `true`). ID e timestamps omitidos.

Persistência: insert em `brands` com `onConflictDoNothing()` (conflito típico: `brands_slug_uidx`).

Tabela:

| Campo                    | Notas                 |
| ------------------------ | --------------------- |
| `id`                     | CUID2 gerado no banco |
| `name`, `slug`           | slug único            |
| `description`, `logoUrl` | opcionais             |
| `isActive`               | default `true`        |

Relação: uma marca tem muitos produtos. Se a marca for apagada, `products.brand_id` vira `null`.

### 4.2 Categorias — `createCategory`

Schema Zod (`createCategorySchema`): `name`, `slug`, `description`, `imageUrl` (URL), `isActive`.

Persistência: insert em `categories` **sem** `onConflictDoNothing`. Slug continua único no banco (`categories_slug_uidx`).

Um produto tem `primaryCategoryId` (categoria principal) e pode participar de várias categorias via `product_categories` (PK composta `product_id + category_id`).

### 4.3 Produtos — `createProduct`

Schema Zod (`createProductSchema`) aceita praticamente todos os campos de catálogo (descrição, fiscal, tags, preços, atributos, ratings, `publishedAt`), mas o serviço **grava só**:

- `name`, `brandId`, `primaryCategoryId`, `slug`, `sku`, `status`, `priceCents`

Insert com `onConflictDoNothing()` (slug único). Soft delete existe no schema (`deletedAt`) e é omitido na criação.

Campos relevantes da tabela (incluindo os ainda não persistidos pelo serviço):

| Campo                            | Papel                         |
| -------------------------------- | ----------------------------- |
| `status`                         | default `draft`               |
| `isDigital` / `requiresShipping` | produto digital vs físico     |
| `taxCode` / `taxRate`            | código fiscal e alíquota      |
| `tags`                           | array de texto, default `[]`  |
| `priceCents`                     | preço de venda (obrigatório)  |
| `compareAtPriceCents`            | preço “de” (riscado)          |
| `costCents`                      | custo interno                 |
| `attributes`                     | JSON `Record<string, string>` |
| `ratingAverage` / `ratingCount`  | agregados de reviews          |
| `publishedAt` / `deletedAt`      | publicação e exclusão lógica  |

Filhos no schema:

- `product_images`: URL, alt, dimensões, `blurDataUrl` (LQIP), `position`
- `product_categories`: N:N
- `inventory_items`, `reviews`

### 4.4 Depósitos — `createWarehouse`

Schema: `name`, `code` (único), `postalCode`, `city`, `state`, `country` (default `BR`), `isActive`, `priority` (menor número = alocado primeiro).

Insert com `onConflictDoNothing()`.

### 4.5 Estoque (schema, sem serviço)

`inventory_items` é único por (`productId`, `warehouseId`):

| Campo              | Significado                                |
| ------------------ | ------------------------------------------ |
| `quantity`         | físico no depósito                         |
| `reservedQuantity` | reservado por carrinho/pedido não faturado |
| `safetyStock`      | buffer contra oversell                     |
| `reorderPoint`     | alerta de reposição                        |
| `binLocation`      | posição no armazém                         |

Disponível teórico: `quantity - reservedQuantity - safetyStock`.

`stock_movements` audita cada alteração:

- `type`: compra, venda, devolução, ajuste, reserva, liberação, perda, transferência
- `quantity`: positivo = entrada, negativo = saída
- `balanceAfter`: saldo após o movimento
- `referenceType` / `referenceId`: origem (`order`, `return`, `manual`, `import`…)
- `createdBy`: usuário operador (set null se o usuário for apagado)

---

## 5. Carrinho, cupons e pedidos

### 5.1 Carrinho — `createCarts`

Schema (`createCartSchema`): `userId`, `status` (default `active`), `currency` (default `BRL`), `couponCode`, `notes`, `expiresAt` (ISO).

O serviço converte `expiresAt` para `Date` e insere em `carts`. `userId` é opcional no banco (carrinho anônimo / guest).

Estados: `active` → `converted` (pedido gerado) | `abandoned` | `expired`.

Itens (`cart_items`, sem serviço): único por (`cartId`, `productId`); guarda `quantity`, `unitPriceCents` e `compareAtPriceCents` congelados no momento da inclusão.

### 5.2 Cupons — `createCoupons`

Schema: código, descrição, `discountType`, `discountValue`, tetos (`maxDiscountCents`, `minSubtotalCents`), limites de resgate globais e por usuário, `redemptionCount`, listas `appliesToProductIds` / `appliesToCategoryIds`, `firstOrderOnly`, `isActive`, `startsAt`, `endsAt`.

O serviço converte `startsAt` e `endsAt` para `Date`. Código é único.

Resgates (`coupon_redemptions`, sem serviço): ligam cupom + usuário + pedido ao valor `discountAppliedCents` efetivamente aplicado.

### 5.3 Pedido — `createOrders`

É o documento comercial. Schema (`createOrderSchema`) inclui número legível, cliente, totais, snapshots de endereço, cupom e timestamps de ciclo de vida.

Conversão de datas no serviço:

- `placedAt` → sempre `Date`
- `paidAt`, `shippedAt`, `deliveredAt` → `Date` se presentes, senão `undefined`
- `canceledAt` → `Date` se presente, senão `null`

Campos centrais:

| Campo                                                         | Papel                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| `orderNumber`                                                 | único, ex. `2026-000451`                                |
| `userId`                                                      | set null se o usuário for apagado (histórico permanece) |
| `cartId`                                                      | origem; set null se o carrinho sumir                    |
| `email`                                                       | obrigatório mesmo em guest checkout                     |
| `status` / `paymentStatus` / `fulfillmentStatus`              | três eixos independentes                                |
| `subtotalCents`                                               | soma dos itens, sem frete/desconto/imposto              |
| `discountCents`, `shippingCents`, `taxCents`                  | componentes                                             |
| `totalCents`                                                  | `subtotal - desconto + frete + imposto`                 |
| `refundedCents`                                               | acumulado de reembolsos                                 |
| `couponId` / `couponCode`                                     | cupom aplicado                                          |
| `shippingAddress` / `billingAddress`                          | JSON `AddressSnapshot` congelado                        |
| `customerNote` / `internalNote` / `cancelReason` / `metadata` | texto e extras                                          |

Snapshot de endereço (`AddressSnapshot`): destinatário, telefone, CPF/CNPJ, CEP, logradouro, número, complemento, bairro, cidade, UF, país.

Itens do pedido (`order_items`, sem serviço):

- `productId` é “melhor esforço” (`onDelete: set null`) para o histórico sobreviver a exclusão no catálogo
- Snapshot: `productName`, `sku`, `imageUrl`, `optionsSnapshot` (ex. `{ "Cor": "Azul", "Tamanho": "M" }`)
- Totais: `quantity * unitPrice - discount + tax = totalCents`
- `fulfilledQuantity` / `refundedQuantity` acompanham envio e devolução

Endereços cadastrados do usuário (`addresses`) não são usados diretamente no pedido: o checkout deve copiar um snapshot JSON para não mudar histórico se o cliente editar o cadastro depois.

---

## 6. Pagamento, envio e eventos

### 6.1 Métodos de envio — `createShipmentMethods`

Cadastro de opções da loja (`shipping_methods`): `name` (PAC, Sedex, retirada), `carrier`, `code` único, `basePriceCents`, `freeAboveCents` (frete grátis acima do subtotal; `null` = nunca), `minDays` / `maxDays`, `isActive`.

Deve existir **antes** das remessas que referenciam `shippingMethodId`.

### 6.2 Pagamento — `createPayments`

Um pedido pode ter vários pagamentos. Schema: `orderId`, `method`, `status`, `amountCents`, `currency`, `provider` (stripe, mercadopago, pagarme, asaas…), `providerTransactionId` (idempotência de webhook), parcelas, dados mascarados de cartão, Pix/boleto, vencimento, falha e `rawResponse`.

O serviço converte `authorizedAt`, `dueAt` e `paidAt` para `Date` (no Zod esses campos são datetime obrigatórios no schema completo de pagamento, o que pode ser rígido demais para Pix/cartão ainda pendente).

Regras de dados:

- Nunca armazenar PAN completo — só `cardBrand` + `cardLast4`
- Unique (`provider`, `providerTransactionId`) para não duplicar webhook
- `onDelete: cascade` no pedido

### 6.3 Reembolso — `createRefunds`

Liga `orderId` + `paymentId` opcional, `amountCents`, `reason`, `status` (reusa `payment_status`), `providerRefundId`, `createdBy`. Sem conversão de datas (só timestamps automáticos).

O pedido acumula `refundedCents`; itens acumulam `refundedQuantity`.

### 6.4 Remessa — `createShipments`

Uma ou mais remessas por pedido (envio parcial). Campos: método, `status`, transportadora, rastreio (`trackingCode` / `trackingUrl`), etiqueta, custo, peso, prazos.

O serviço converte `deliveredAt`, `shippedAt` e `estimatedDeliveryAt` para `Date`.

`shipment_items` (sem serviço) diz **quais** `order_items` e **quantas** unidades foram em cada caixa. Unique (`shipmentId`, `orderItemId`). Isso alimenta `order_items.fulfilledQuantity` e `orders.fulfillmentStatus`.

### 6.5 Eventos — `createOrderEvents`

Timeline imutável do pedido. Schema: `orderId`, `type` (`status_changed`, `payment_received`, `note_added`…), `fromStatus` / `toStatus`, `message`, `payload` JSON, `actorId` (null se veio de webhook/sistema).

O serviço insere o valor validado direto (sem mapear datas). Índice por (`orderId`, `createdAt`).

---

## 7. Interações do usuário

### 7.1 Wishlist — `createWishlists`

Lista de favoritos: `userId` (cascade), `name` (default `Favoritos`), `isPublic`, `shareToken` (único, para compartilhar).

Itens (`wishlist_items`, sem serviço): unique (`wishlistId`, `productId`) + `note`.

### 7.2 Reviews — `createReviews`

Uma avaliação por par (`userId`, `productId`). Schema de criação omite `id`, `reply`, `repliedAt` e timestamps.

Campos: `productId`, `userId`, `orderItemId` (prova de compra), `rating` (1–5, CHECK ainda não está no Drizzle), `title`, `body`, `status` (default `pending`), `isVerifiedPurchase`, `helpfulCount`.

Resposta da loja (`reply` / `repliedAt`) entra depois, fora deste serviço. Reviews aprovadas devem atualizar `products.ratingAverage` e `ratingCount` (ainda não implementado nos services).

---

## 8. Processo de ponta a ponta

Orquestração **conceitual** com base no schema. Os services de hoje só inserem entidades isoladas; não há transação única de checkout.

```
[Admin]
  createBrand / createCategory
  createWarehouse
  createProduct (rascunho → active)
  (futuro) inventory_items + stock_movements type=purchase
  createShipmentMethods
  createCoupons

[Cliente autenticado ou guest]
  createWishlists → (futuro) wishlist_items
  createCarts (status=active)
  (futuro) cart_items + reserva de estoque (reservation)

  Checkout:
    copiar AddressSnapshot de addresses (ou formulário guest)
    aplicar cupom no carrinho (couponCode)
    createOrders
      status=pending
      paymentStatus=pending
      fulfillmentStatus=unfulfilled
      ligar cartId, couponId, totais
    marcar carrinho converted
    (futuro) order_items a partir de cart_items
    (futuro) coupon_redemptions
    createOrderEvents type=status_changed / note_added

  Pagamento:
    createPayments (pix/cartão/boleto…)
    webhook → atualizar payment.status
    se paid:
      orders.paymentStatus=paid, orders.status=paid, paidAt
      (futuro) stock_movements type=sale; liberar reservation
      createOrderEvents type=payment_received

  Fulfillment:
    orders.status=processing
    createShipments (label_created → in_transit → delivered)
    (futuro) shipment_items
    fulfillmentStatus: unfulfilled → partially_fulfilled → fulfilled
    orders.status=shipped / delivered; shippedAt / deliveredAt
    createOrderEvents

  Pós-venda:
    createReviews (orderItemId + isVerifiedPurchase)
    createRefunds → paymentStatus/order status refunded; stock return
    createOrderEvents
```

### 8.1 Três eixos do pedido

| Eixo       | Enum                                              | Quem atualiza                                |
| ---------- | ------------------------------------------------- | -------------------------------------------- |
| Comercial  | `order_status`                                    | checkout, pagamento, logística, cancelamento |
| Financeiro | `payment_status` (no pedido e em cada `payments`) | gateway / reembolso / chargeback             |
| Logístico  | `fulfillment_status` + `shipment_status`          | separação e rastreio                         |

Eles não são o mesmo campo de propósito: um pedido pode estar `paid` e ainda `unfulfilled`.

### 8.2 Integridade e exclusão

| Relação                                                         | `onDelete` | Efeito                          |
| --------------------------------------------------------------- | ---------- | ------------------------------- |
| Auth (session, account, address, cart, wishlist, review) → user | cascade    | some junto com o usuário        |
| Pedido → user                                                   | set null   | histórico comercial permanece   |
| Produto → brand/category                                        | set null   | produto órfão de taxonomia      |
| Imagens / inventory / reviews → product                         | cascade    | some com o produto              |
| Item de pedido → product                                        | set null   | snapshot textual permanece      |
| Pagamentos / itens / eventos / remessas / refunds → order       | cascade    | some com o pedido               |
| Remessa → shipping_method                                       | set null   | histórico de rastreio permanece |
| Movimento de estoque → user                                     | set null   | auditoria permanece             |

### 8.3 Snapshot vs referência viva

O modelo mistura referências atuais e cópias congeladas:

- **Vivo:** catálogo, estoque, métodos de envio, cupom vigente
- **Congelado no pedido:** endereço, nome/SKU/preço do item, código do cupom, totais
- **Congelado no carrinho:** preço unitário do item

Isso evita que um reajuste de preço ou mudança de CEP altere um pedido já feito.

---

## 9. Relacionamentos (grafo)

```
user
  ├─ session, account
  ├─ addresses
  ├─ carts ─ cart_items ─ products
  ├─ orders ─ order_items ─ products
  │         ├─ payments ─ refunds
  │         ├─ shipments ─ shipment_items ─ order_items
  │         ├─ order_events
  │         └─ coupon_redemptions ─ coupons
  ├─ wishlists ─ wishlist_items ─ products
  └─ reviews ─ products / order_items

brands ─ products ─ product_images
                  ├─ product_categories ─ categories
                  └─ inventory_items ─ warehouses
                                     └─ stock_movements

shipping_methods ─ shipments
```

---

## 10. Contratos Zod × persistência

Pontos em que o serviço **não** grava o schema Zod inteiro, ou converte tipos:

| Serviço                                             | Observação                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `createProduct`                                     | Zod tem descrição, tags, fiscal, ratings, `publishedAt`; insert só nome, marca, categoria, slug, SKU, status, preço |
| `createCarts`                                       | `expiresAt` string ISO → `Date`                                                                                     |
| `createCoupons`                                     | `startsAt` / `endsAt` → `Date`                                                                                      |
| `createOrders`                                      | timestamps de ciclo de vida → `Date` / `null`                                                                       |
| `createPayments`                                    | `authorizedAt`, `dueAt`, `paidAt` sempre convertidos para `Date`                                                    |
| `createShipments`                                   | `estimatedDeliveryAt`, `shippedAt`, `deliveredAt` → `Date`                                                          |
| `createBrand` / `createWarehouse` / `createProduct` | `onConflictDoNothing` (demais inserts falham em unique)                                                             |
| `createOrderEvents`                                 | `NewOrderEvent` importado e não usado; insert direto de `value`                                                     |

Tipos exportados em `schema.ts` úteis para os services: `NewCart`, `NewCoupon`, `NewOrder`, `NewPayment`, `NewShipment`, `NewOrderEvent`, além dos `$inferSelect` de entidade.

---

## 11. Índices que sustentam os processos

- Busca de catálogo: slug de marca/categoria/produto, status e marca do produto
- Carrinho ativo por usuário; item único no carrinho
- Cupom por código; resgates por cupom+usuário e por pedido
- Pedidos por número, usuário+data, status, e-mail
- Pagamento por pedido, status e transação do gateway
- Remessa por pedido e código de rastreio
- Review única usuário×produto; listagem por produto+status
- Estoque único produto×depósito; movimentos por item+data e por referência
- Wishlist compartilhada por `share_token`

---

## 12. Estado atual vs. domínio completo

Já existe criação isolada de: marca, categoria, produto (parcial), depósito, carrinho, cupom, pedido, pagamento, reembolso, método de envio, remessa, evento de pedido, wishlist e review.

Ainda falta, para o processo fechar de ponta a ponta:

1. Serviços (e transações) para itens de carrinho, itens de pedido, itens de remessa, itens de wishlist, imagens, categorias N:N, endereços, inventory e movimentos
2. Orquestração de checkout que copie snapshots, converta o carrinho e registre eventos
3. Webhooks de pagamento atualizando pedido + estoque
4. Moderação de review e recálculo de rating no produto
5. Reserva / baixa / devolução de estoque alinhada a `stock_movement_type`
