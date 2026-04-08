import { ChatBubbleLeftRight, Star } from "@medusajs/icons"
import { Container, Heading, Table, Text } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
})

const ReviewsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin_reviews"],
    queryFn: () => sdk.client.fetch(`/admin/reviews`)
  })

  const reviews = (data as any)?.reviews || []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Customer Reviews</Heading>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Product ID</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
            <Table.HeaderCell>Comment</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell  colSpan={5 as any} className="text-center py-10">
                <Text>Loading reviews...</Text>
              </Table.Cell>
            </Table.Row>
          ) : reviews.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5 as any} className="text-center py-10">
                <Text>No reviews found.</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            reviews.map((review: any) => (
              <Table.Row key={review.id}>
                <Table.Cell className="font-medium">{review.customer_name}</Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">{review.product_id}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{review.rating}</span>
                    <Star className="text-yellow-400 fill-yellow-400" variant="solid" />
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-xs truncate">{review.comment}</Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">
                  {new Date(review.created_at).toLocaleDateString()}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}


export default ReviewsPage
