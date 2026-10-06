# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-10-06T17:02:05.279Z
> Files: 179 tracked | Anatomy hits: 0 | Misses: 0

> Project structure index. Auto-maintained by OpenWolf hooks and daemon.
> Run `openwolf scan` to generate, or wait for the first Claude Code session.
> Status: Pending initial scan

## ./

- `.gitignore` — Git ignore rules (~70 tok)
- `CLAUDE.md` — OpenWolf (~99 tok)
- `components.json` (~145 tok)
- `index.html` — fitelle (~96 tok)
- `package.json` — Node.js package manifest (~307 tok)
- `README.md` — Project documentation (~111 tok)
- `tsconfig.app.json` — /*.ts", "src/**/*.tsx", "src/**/*.vue"] (~137 tok)
- `tsconfig.json` — TypeScript configuration (~67 tok)
- `tsconfig.node.json` (~160 tok)
- `vercel.json` (~28 tok)
- `vite.config.ts` — Vite build configuration (~85 tok)

## src/

- `App.vue` — Vue: setup, TS (~48 tok)
- `env.d.ts` — / <reference types="vite/client" /> (~11 tok)
- `main.ts` — Declares app (~108 tok)
- `router.ts` — Declares routes (~644 tok)
- `style.css` — Styles: 8 rules, 123 vars, 1 animations, 1 layers (~1552 tok)

## src/components/base/

- `AlertDialog.vue` — Vue: setup, TS, 6 props, emits (~432 tok)
- `Backdrop.vue` — Vue: setup, TS (~201 tok)
- `Card.vue` — Vue: setup, TS, 9 props (~275 tok)
- `Field.vue` — Vue: setup, TS (~189 tok)
- `Header.vue` — Vue: setup, TS, 5 props, emits (~352 tok)
- `ImageUploader.vue` — Vue: setup, TS, 3 props, emits (~803 tok)
- `Modal.vue` — Vue: setup, TS, emits (~615 tok)
- `Navbar.vue` — Vue: Overview, setup, TS (~537 tok)
- `PopOver.vue` — Vue: setup, TS, 3 props (~201 tok)
- `Search.vue` — Vue: setup, TS, emits (~276 tok)
- `Select.vue` — Vue: setup, TS, emits (~1008 tok)
- `Stats.vue` — Vue: setup, TS, 5 props (~168 tok)
- `Table.vue` — Vue: setup, TS, 4 props, emits (~613 tok)
- `Tabs.vue` — Vue: setup, TS, 2 props (~234 tok)
- `Tooltip.vue` — Vue: setup, TS (~175 tok)
- `UploadImage.vue` — Vue: setup, TS (~211 tok)

## src/components/customer/

- `CustomerForm.vue` — Vue: setup, TS, 3 props (~415 tok)
- `CustomerFormModal.vue` — Vue: setup, TS, 3 props, emits (~1141 tok)
- `customerOders.vue` — Vue: setup, TS, 1 props (~841 tok)
- `MeasurementFieldEditor.vue` — Vue: setup, TS, 3 props, emits (~1118 tok)
- `MeasurementInput.vue` — Vue: setup, TS, 4 props, emits (~390 tok)

## src/components/landing/

- `InstallCard.vue` — Vue: setup, TS (~1405 tok)
- `QrCode.vue` — Vue: setup, TS, 2 props (~168 tok)

## src/components/orders/

- `CustomerPicker.vue` — Vue: setup, TS, 1 props, emits (~338 tok)
- `FabricSourceToggle.vue` — Vue: setup, TS, 1 props (~269 tok)
- `MeasurementsSection.vue` — Vue: setup, TS, 3 props, emits (~930 tok)
- `NewCustomerPopover.vue` — Vue: setup, TS, emits (~667 tok)
- `OrderCard.vue` — Vue: setup, TS, 1 props, emits (~1685 tok)
- `OrderDetailsSection.vue` — Vue: setup, TS, 2 props (~603 tok)
- `OrderFilters.vue` — Vue: setup, TS, 1 props, emits (~551 tok)
- `OrderFormModal.vue` — Vue: setup, TS, 2 props, emits (~907 tok)
- `PaymentSection.vue` — Vue: setup, TS, 4 props (~651 tok)
- `ProgressPhotosSection.vue` — Vue: setup, TS, 1 props (~852 tok)
- `RecentOrder.vue` — Vue: setup, TS (~546 tok)
- `RecordPaymentDialog.vue` — Vue: setup, TS, 2 props, emits (~809 tok)
- `RequirementsChecklist.vue` — Vue: setup, TS, 1 props, emits (~556 tok)
- `SectionLabel.vue` — Vue: setup, TS, 2 props (~88 tok)
- `StatusUpdateSheet.vue` — Vue: setup, TS, 2 props, emits (~560 tok)
- `TrackingOrderPreview.vue` (~0 tok)

## src/components/portfolio/

- `DeleteWorkDialog.vue` — Vue: setup, TS, 2 props, emits (~422 tok)
- `ImageReorderGrid.vue` — Vue: setup, TS, 2 props, emits (~1099 tok)
- `PortfolioFormModal.vue` — Vue: setup, TS, 2 props, emits (~1519 tok)
- `PortfolioLoading.vue` — Vue component (~156 tok)
- `PortfolioNotFound.vue` — Vue component (~161 tok)
- `PortfolioWorkCard.vue` — Vue: setup, TS, 1 props, emits (~888 tok)
- `TagsInput.vue` — Vue: setup, TS, 1 props, emits (~486 tok)

## src/components/portfolio/public/

- `PortfolioAbout.vue` — Vue: setup, TS (~554 tok)
- `PortfolioContact.vue` — Vue: setup, TS (~917 tok)
- `PortfolioFooter.vue` — Vue: setup, TS (~135 tok)
- `PortfolioGallery.vue` — Vue: setup, TS (~935 tok)
- `PortfolioHeader.vue` — Vue: setup, TS, 1 props (~807 tok)
- `PortfolioHero.vue` — Vue: setup, TS (~1042 tok)
- `PortfolioService.vue` — Vue: setup, TS (~744 tok)

## src/components/portfolio/tabs/

- `About.vue` — Vue: setup, TS (~30 tok)
- `Brand.vue` — Vue: setup, TS (~718 tok)
- `Collection.vue` — Vue: setup, TS (~32 tok)
- `Contact.vue` — Vue: setup, TS (~558 tok)
- `Design.vue` — Vue: setup, TS (~1032 tok)
- `Service.vue` — Vue: setup, TS (~254 tok)

## src/components/ui/alert-dialog/

- `AlertDialog.vue` — Vue: setup, TS, emits (~126 tok)
- `AlertDialogAction.vue` — Vue: setup, TS (~161 tok)
- `AlertDialogCancel.vue` — Vue: setup, TS (~180 tok)
- `AlertDialogContent.vue` — Vue: setup, TS, emits (~415 tok)
- `AlertDialogDescription.vue` — Vue: setup, TS (~171 tok)
- `AlertDialogFooter.vue` — Vue: setup, TS, 1 props (~106 tok)
- `AlertDialogHeader.vue` — Vue: setup, TS, 1 props (~93 tok)
- `AlertDialogTitle.vue` — Vue: setup, TS (~159 tok)
- `AlertDialogTrigger.vue` — Vue: setup, TS (~86 tok)
- `index.ts` (~183 tok)

## src/components/ui/button/

- `Button.vue` — Vue: setup, TS (~246 tok)
- `index.ts` — Exports buttonVariants, ButtonVariants (~558 tok)

## src/components/ui/checkbox/

- `Checkbox.vue` — Vue: setup, TS, emits (~385 tok)
- `index.ts` (~16 tok)

## src/components/ui/dialog/

- `Dialog.vue` — Vue: setup, TS, emits (~124 tok)
- `DialogClose.vue` — Vue: setup, TS (~78 tok)
- `DialogContent.vue` — Vue: setup, TS, emits (~368 tok)
- `DialogDescription.vue` — Vue: setup, TS (~182 tok)
- `DialogFooter.vue` — Vue: setup, TS, 2 props (~172 tok)
- `DialogHeader.vue` — Vue: setup, TS, 1 props (~92 tok)
- `DialogOverlay.vue` — Vue: setup, TS (~188 tok)
- `DialogScrollContent.vue` — Vue: setup, TS, emits (~500 tok)
- `DialogTitle.vue` — Vue: setup, TS (~173 tok)
- `DialogTrigger.vue` — Vue: setup, TS (~81 tok)
- `index.ts` (~179 tok)

## src/components/ui/input/

- `index.ts` (~14 tok)
- `Input.vue` — Vue: setup, TS, 3 props, emits (~343 tok)

## src/components/ui/popover/

- `index.ts` (~70 tok)
- `Popover.vue` — Vue: setup, TS, emits (~126 tok)
- `PopoverAnchor.vue` — Vue: setup, TS (~81 tok)
- `PopoverContent.vue` — Vue: setup, TS, emits (~396 tok)
- `PopoverTrigger.vue` — Vue: setup, TS (~82 tok)

## src/components/ui/select/

- `index.ts` (~200 tok)
- `Select.vue` — Vue: setup, TS, emits (~124 tok)
- `SelectContent.vue` — Vue: setup, TS, emits (~515 tok)
- `SelectGroup.vue` — Vue: setup, TS (~78 tok)
- `SelectItem.vue` — Vue: setup, TS (~383 tok)
- `SelectItemText.vue` — Vue: setup, TS (~83 tok)
- `SelectLabel.vue` — Vue: setup, TS (~122 tok)
- `SelectScrollDownButton.vue` — Vue: setup, TS (~220 tok)
- `SelectScrollUpButton.vue` — Vue: setup, TS (~216 tok)
- `SelectSeparator.vue` — Vue: setup, TS (~154 tok)
- `SelectTrigger.vue` — Vue: setup, TS (~452 tok)
- `SelectValue.vue` — Vue: setup, TS (~78 tok)

## src/components/ui/switch/

- `index.ts` (~14 tok)
- `Switch.vue` — Vue: setup, TS, emits (~396 tok)

## src/components/ui/tabs/

- `index.ts` (~62 tok)
- `Tabs.vue` — Vue: setup, TS, emits (~191 tok)
- `TabsContent.vue` — Vue: setup, TS (~150 tok)
- `TabsList.vue` — Vue: setup, TS (~171 tok)
- `TabsTrigger.vue` — Vue: setup, TS (~296 tok)

## src/components/ui/textarea/

- `index.ts` (~16 tok)
- `Textarea.vue` — Vue: setup, TS, 3 props, emits (~289 tok)

## src/components/ui/tooltip/

- `index.ts` (~71 tok)
- `Tooltip.vue` — Vue: setup, TS, emits (~126 tok)
- `TooltipContent.vue` — Vue: setup, TS, emits (~369 tok)
- `TooltipProvider.vue` — Vue: setup, TS (~84 tok)
- `TooltipTrigger.vue` — Vue: setup, TS (~82 tok)

## src/composables/

- `useDebounceRef.ts` — Exports useDebouncedRef (~154 tok)
- `useDevicePlatform.ts` — Exports Platform, useDevicePlatform (~282 tok)
- `useImageUpload.ts` — Exports UploadItem, useImageUpload (~1174 tok)
- `useInstallPrompt.ts` — Exports useInstallPrompt (~370 tok)
- `useOrderForm.ts` — Exports OrderFormState, useOrderForm (~1792 tok)
- `usePortfolioForm.ts` — Exports PortfolioFormState, usePortfolioForm (~752 tok)

## src/constants/

- `index.ts` — Exports EMPTY_TEXT (~9 tok)
- `measurements.ts` — Exports UPPER_BODY_FIELDS, LOWER_BODY_FIELDS, DEFAULT_MEASUREMENT_FIELDS, createEmptyMeasurements + 3 more (~695 tok)
- `orders.ts` — Exports ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, OrderFiltersState, defaultOrderFilters + 8 more (~921 tok)
- `portfolio.ts` — The work's chosen cover, falling back to the first image. (~211 tok)

## src/layouts/

- `AuthLayout.vue` — Vue: setup, TS (~269 tok)
- `DashboardLayout.vue` — Vue: setup, TS (~115 tok)

## src/lib/

- `index.ts` — Exports generateId, toWhatsAppLink, formatCurrency, formatDate + 2 more (~501 tok)
- `pdf.ts` — Exports a list of orders (e.g. the currently filtered view) as a table. (~1452 tok)
- `utils.ts` — Exports cn (~54 tok)

## src/middleware/

- `auth.ts` — Exports authMiddleware (~173 tok)

## src/schema/

- `index.ts` — Zod schemas: measurementFieldSchema, customerSchema (~345 tok)
- `order.ts` — Zod schemas: orderRequirementSchema, measurementSnapshotSchema, quickCustomerSchema (~649 tok)
- `portfolio.ts` — Zod schemas: portfolioWorkSchema (~150 tok)

## src/service/

- `appwrite.ts` — Exports storage, uploadImageFile, getFileUrl, deleteImageFile (~222 tok)
- `firebase.ts` — Declares firebaseConfig (~284 tok)
- `publicOrder.ts` — Exports fetchPublicOrderBySlug (~299 tok)
- `publicPortfolio.ts` — Exports fetchBusinessBySlug, fetchPublishedWorks, fetchPublicWork (~692 tok)

## src/stores/

- `auth.ts` — Exports useAuthStore (~846 tok)
- `customer.ts` — Exports useCustomerStore (~1257 tok)
- `order.ts` — Exports useOrderStore (~1719 tok)
- `portfolio.ts` — Exports usePortfolioStore (~1216 tok)

## src/types/

- `customer.ts` — Exports MeasurementCategory, MeasurementField, MeasurementForm, Unit, CustomerType (~239 tok)
- `index.ts` — Exports UserType, MediaFile (~110 tok)
- `order.ts` — Exports PRODUCTION_STATUSES, ProductionStatus, PaymentStatus, FabricSource + 7 more (~558 tok)
- `portfolio.ts` — Public-safe projection — no userId, nothing a visitor shouldn't see. (~366 tok)

## src/views/

- `index.vue` — Vue: setup, TS (~624 tok)
- `notFound.vue` — Vue: setup, TS (~254 tok)

## src/views/auth/

- `login.vue` — Vue: setup, TS (~468 tok)
- `signup.vue` — Vue: setup, TS (~501 tok)

## src/views/dashboard/

- `index.vue` — Vue: setup, TS (~760 tok)
- `port.vue` — Vue: setup (~31 tok)
- `settings.vue` — Vue: setup, TS (~1203 tok)

## src/views/dashboard/customers/

- `[id].vue` — Vue: setup, TS (~2148 tok)
- `index.vue` — Vue: setup, TS (~1282 tok)

## src/views/dashboard/orders/

- `[id].vue` — Vue: setup, TS (~3282 tok)
- `[slug].vue` — Vue: setup, TS (~1294 tok)
- `index.vue` — Vue: setup, TS (~1573 tok)

## src/views/dashboard/portfolio/

- `[slug].vue` — Vue: setup, TS (~602 tok)
- `[workId].vue` — Vue: setup, TS (~1400 tok)
- `index.vue` — Vue: setup, TS (~715 tok)
