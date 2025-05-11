import { z } from 'zod';
const Deal = z.object({
    name: z.string(),
    value: z.number()
  })
const DealWithId = Deal.extend({
  id: z.number()
})
const DealsResponse = z.object({
    deals: z.array(DealWithId),
    message: z.string().optional()
})
type DealSchema = z.infer<typeof Deal>
type DealWithIdSchema = z.infer<typeof DealWithId>
type DealsResponseSchema = z.infer<typeof DealsResponse>
export type { DealSchema, DealWithIdSchema, DealsResponseSchema}
export { Deal, DealWithId,DealsResponse }