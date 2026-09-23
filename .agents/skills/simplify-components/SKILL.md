---
name: simplify-components
description: >-
  Utiliza esta skill cuando el usuario pida simplificar la aplicación, arreglar apartados o remover funcionalidades complejas como pagos o inicio de sesión, manteniendo la app como una landing page pura.
---

# Simplify Components (Descomplejizar App)

Esta skill define el procedimiento para simplificar la aplicación Pidgeon Solutions, eliminando módulos innecesarios y convirtiéndola en una landing page.

## Procedimiento

1. **Identificar Componentes a Eliminar:**
   - Busca componentes relacionados con autenticación (ej. `AuthModal.svelte`).
   - Busca componentes relacionados con pagos (ej. `PaymentModal.svelte`, `PricingBackground.svelte`).
   - Revisa el backend (NestJS) para eliminar endpoints innecesarios (auth, mercado-pago, db).

2. **Eliminación Segura:**
   - No borres los archivos directamente sin antes desenlazarlos de la UI principal (`App.svelte`, `Header.svelte`, etc.).
   - Utiliza `grep_search` para encontrar dónde se importan los modales de pago o autenticación, y elimina esas importaciones y los botones que los activan.

3. **Mantener la Consistencia de UI:**
   - Al reemplazar un botón que abría un modal de pago, cámbialo por un botón de "Contacto" o un enlace tipo `mailto:`.
   - Utiliza EXACTAMENTE las mismas clases de Tailwind CSS (`bg-glass`, `text-transparent`, `bg-gradient-to-r`, etc.) que ya tiene la UI original.
   - Respeta el uso de Svelte 5 (Runes si aplican, o la estructura existente).

4. **Verificación:**
   - Asegúrate de que el proyecto sigue compilando (`npm run build` o equivalente).
   - Comprueba que la UI no se rompa al eliminar los componentes complejos.
