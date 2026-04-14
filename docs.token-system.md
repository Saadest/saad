# Nova Scientia — Diseño inicial de tokenización (sin blockchain)

## Reglas de emisión

- `PUBLICATION_REWARD`: se registra al publicar artículo aprobado (base 10 + bonus por score).
- `PEER_REVIEW_REWARD`: se registra al completar review válida (base 4, multiplicador por utilidad media).
- `COMMENT_REWARD`: se registra si comentario supera umbral de utilidad/likes (base 1).
- `ADJUSTMENT`: ajustes manuales anti-fraude o moderación.

## Lógica de saldo

- `Wallet.balance` es el estado agregado.
- `Transaction` es el ledger auditable.
- Cada evento de recompensa crea transacción y actualiza balance en la misma transacción DB.

## Escalabilidad

- Compatible con SQLite y migrable a PostgreSQL sin cambios de modelo.
- Al migrar a on-chain, `Transaction` mantiene `txHash` opcional como puente de conciliación.
