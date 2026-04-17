import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function logEventsHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve("logger")
  logger.info(`[Event caught] Name: ${event.name}, Data: ${JSON.stringify(event.data)}`)
}

export const config: SubscriberConfig = {
  event: "*", // wildcard to catch everything
}
